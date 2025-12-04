// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AXX Token
 * @notice Native token of the axionax Protocol
 * @dev ERC20 token with burning and permit functionality
 */
contract AXXToken is ERC20, ERC20Burnable, ERC20Permit, Ownable {
    // Maximum supply: 1 billion AXX
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    
    // Minting cap per year (10% of max supply)
    uint256 public constant YEARLY_MINT_CAP = 100_000_000 * 10**18;
    
    // Track minted amount per year
    mapping(uint256 => uint256) public yearlyMinted;
    
    // Events
    event TokensMinted(address indexed to, uint256 amount, string reason);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    constructor(address initialOwner) 
        ERC20("axionax Token", "AXX") 
        ERC20Permit("axionax Token")
        Ownable(initialOwner)
    {
        // Initial supply: 100M for treasury, team, and initial distribution
        _mint(initialOwner, 100_000_000 * 10**18);
    }

    /**
     * @notice Get current year for mint tracking
     */
    function currentYear() public view returns (uint256) {
        return block.timestamp / 365 days;
    }

    /**
     * @notice Mint new tokens (owner only, respects caps)
     * @param to Recipient address
     * @param amount Amount to mint
     * @param reason Reason for minting (for transparency)
     */
    function mint(address to, uint256 amount, string calldata reason) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "AXX: max supply exceeded");
        
        uint256 year = currentYear();
        require(yearlyMinted[year] + amount <= YEARLY_MINT_CAP, "AXX: yearly mint cap exceeded");
        
        yearlyMinted[year] += amount;
        _mint(to, amount);
        
        emit TokensMinted(to, amount, reason);
    }

    /**
     * @notice Get remaining mintable amount for current year
     */
    function remainingMintableThisYear() external view returns (uint256) {
        uint256 year = currentYear();
        if (yearlyMinted[year] >= YEARLY_MINT_CAP) return 0;
        return YEARLY_MINT_CAP - yearlyMinted[year];
    }

    /**
     * @notice Emergency withdraw stuck tokens (owner only)
     * @param token Token address (use address(0) for native)
     */
    function emergencyWithdraw(address token) external onlyOwner {
        if (token == address(0)) {
            uint256 balance = address(this).balance;
            payable(owner()).transfer(balance);
            emit EmergencyWithdraw(token, balance);
        } else {
            uint256 balance = IERC20(token).balanceOf(address(this));
            IERC20(token).transfer(owner(), balance);
            emit EmergencyWithdraw(token, balance);
        }
    }

    /**
     * @notice Receive native currency
     */
    receive() external payable {}
}
