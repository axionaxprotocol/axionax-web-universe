// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title axionax Staking Contract
 * @notice Stake AXX tokens to earn rewards and participate in network validation
 * @dev Supports flexible staking with time-weighted rewards
 */
contract Staking is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // AXX Token
    IERC20 public immutable axxToken;

    // Staking parameters
    uint256 public constant MIN_STAKE = 1000 * 10**18;      // 1000 AXX minimum
    uint256 public constant UNBONDING_PERIOD = 7 days;      // 7 days unbonding
    uint256 public constant REWARD_PRECISION = 1e18;

    // Reward rate per second per staked token
    uint256 public rewardRate;
    
    // Last update time for rewards
    uint256 public lastUpdateTime;
    
    // Accumulated rewards per token
    uint256 public rewardPerTokenStored;
    
    // Total staked amount
    uint256 public totalStaked;

    // Staker information
    struct StakeInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 pendingRewards;
        uint256 unstakeRequestTime;
        uint256 unstakeAmount;
        bool isValidator;
    }

    // Staker data
    mapping(address => StakeInfo) public stakes;
    
    // Validator set
    address[] public validators;
    mapping(address => bool) public isValidator;
    uint256 public constant MIN_VALIDATOR_STAKE = 100_000 * 10**18; // 100K AXX

    // Events
    event Staked(address indexed user, uint256 amount);
    event UnstakeRequested(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event ValidatorRegistered(address indexed validator);
    event ValidatorRemoved(address indexed validator);
    event RewardRateUpdated(uint256 newRate);

    constructor(address _axxToken, address _owner) Ownable(_owner) {
        axxToken = IERC20(_axxToken);
        rewardRate = 317097919837645; // ~10% APY assuming 1B total staked
        lastUpdateTime = block.timestamp;
    }

    // ============ Modifiers ============

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        
        if (account != address(0)) {
            stakes[account].pendingRewards = earned(account);
            stakes[account].rewardDebt = rewardPerTokenStored;
        }
        _;
    }

    // ============ View Functions ============

    /**
     * @notice Calculate current reward per token
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored + 
            ((block.timestamp - lastUpdateTime) * rewardRate * REWARD_PRECISION) / totalStaked;
    }

    /**
     * @notice Calculate earned rewards for an account
     */
    function earned(address account) public view returns (uint256) {
        StakeInfo storage stake = stakes[account];
        return (stake.amount * (rewardPerToken() - stake.rewardDebt)) / REWARD_PRECISION 
            + stake.pendingRewards;
    }

    /**
     * @notice Get stake info for an account
     */
    function getStakeInfo(address account) external view returns (
        uint256 stakedAmount,
        uint256 pendingRewards,
        uint256 unstakeRequestTime,
        uint256 unstakeAmount,
        bool validatorStatus
    ) {
        StakeInfo storage stake = stakes[account];
        return (
            stake.amount,
            earned(account),
            stake.unstakeRequestTime,
            stake.unstakeAmount,
            stake.isValidator
        );
    }

    /**
     * @notice Get all validators
     */
    function getValidators() external view returns (address[] memory) {
        return validators;
    }

    /**
     * @notice Get validator count
     */
    function validatorCount() external view returns (uint256) {
        return validators.length;
    }

    // ============ Staking Functions ============

    /**
     * @notice Stake AXX tokens
     * @param amount Amount to stake
     */
    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount >= MIN_STAKE, "Staking: below minimum stake");
        
        axxToken.safeTransferFrom(msg.sender, address(this), amount);
        
        stakes[msg.sender].amount += amount;
        totalStaked += amount;
        
        // Auto-register as validator if meets threshold
        _checkValidatorStatus(msg.sender);
        
        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Request to unstake tokens (starts unbonding period)
     * @param amount Amount to unstake
     */
    function requestUnstake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        StakeInfo storage stakeInfo = stakes[msg.sender];
        require(stakeInfo.amount >= amount, "Staking: insufficient stake");
        require(stakeInfo.unstakeAmount == 0, "Staking: pending unstake exists");
        
        stakeInfo.amount -= amount;
        stakeInfo.unstakeRequestTime = block.timestamp;
        stakeInfo.unstakeAmount = amount;
        totalStaked -= amount;
        
        // Check if still qualifies as validator
        _checkValidatorStatus(msg.sender);
        
        emit UnstakeRequested(msg.sender, amount);
    }

    /**
     * @notice Complete unstaking after unbonding period
     */
    function unstake() external nonReentrant {
        StakeInfo storage stakeInfo = stakes[msg.sender];
        require(stakeInfo.unstakeAmount > 0, "Staking: no pending unstake");
        require(
            block.timestamp >= stakeInfo.unstakeRequestTime + UNBONDING_PERIOD,
            "Staking: unbonding period not complete"
        );
        
        uint256 amount = stakeInfo.unstakeAmount;
        stakeInfo.unstakeAmount = 0;
        stakeInfo.unstakeRequestTime = 0;
        
        axxToken.safeTransfer(msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }

    /**
     * @notice Claim pending rewards
     */
    function claimRewards() external nonReentrant updateReward(msg.sender) {
        uint256 reward = stakes[msg.sender].pendingRewards;
        require(reward > 0, "Staking: no rewards to claim");
        
        stakes[msg.sender].pendingRewards = 0;
        axxToken.safeTransfer(msg.sender, reward);
        
        emit RewardsClaimed(msg.sender, reward);
    }

    /**
     * @notice Compound rewards into stake
     */
    function compoundRewards() external nonReentrant updateReward(msg.sender) {
        uint256 reward = stakes[msg.sender].pendingRewards;
        require(reward > 0, "Staking: no rewards to compound");
        
        stakes[msg.sender].pendingRewards = 0;
        stakes[msg.sender].amount += reward;
        totalStaked += reward;
        
        _checkValidatorStatus(msg.sender);
        
        emit Staked(msg.sender, reward);
    }

    // ============ Validator Functions ============

    /**
     * @notice Check and update validator status
     */
    function _checkValidatorStatus(address account) internal {
        StakeInfo storage stakeInfo = stakes[account];
        bool shouldBeValidator = stakeInfo.amount >= MIN_VALIDATOR_STAKE;
        
        if (shouldBeValidator && !stakeInfo.isValidator) {
            // Add to validator set
            stakeInfo.isValidator = true;
            isValidator[account] = true;
            validators.push(account);
            emit ValidatorRegistered(account);
        } else if (!shouldBeValidator && stakeInfo.isValidator) {
            // Remove from validator set
            stakeInfo.isValidator = false;
            isValidator[account] = false;
            _removeValidator(account);
            emit ValidatorRemoved(account);
        }
    }

    /**
     * @notice Remove validator from array
     */
    function _removeValidator(address account) internal {
        for (uint256 i = 0; i < validators.length; i++) {
            if (validators[i] == account) {
                validators[i] = validators[validators.length - 1];
                validators.pop();
                break;
            }
        }
    }

    // ============ Admin Functions ============

    /**
     * @notice Update reward rate (owner only)
     */
    function setRewardRate(uint256 newRate) external onlyOwner updateReward(address(0)) {
        rewardRate = newRate;
        emit RewardRateUpdated(newRate);
    }

    /**
     * @notice Deposit rewards to contract
     */
    function depositRewards(uint256 amount) external {
        axxToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    /**
     * @notice Emergency withdraw (owner only, for stuck tokens)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(axxToken)) {
            // Only allow withdrawing excess (not staked amounts)
            uint256 excess = axxToken.balanceOf(address(this)) - totalStaked;
            require(amount <= excess, "Staking: cannot withdraw staked tokens");
        }
        IERC20(token).safeTransfer(owner(), amount);
    }
}
