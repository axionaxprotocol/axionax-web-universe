// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title axionax Governance Contract
 * @notice On-chain governance for protocol parameters and upgrades
 * @dev Token-weighted voting with time-locked execution
 */
contract Governance is ReentrancyGuard, Ownable {
    // Governance token (AXX)
    IERC20 public immutable governanceToken;

    // Proposal states
    enum ProposalState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Queued,
        Expired,
        Executed
    }

    // Vote types
    enum VoteType {
        Against,
        For,
        Abstain
    }

    // Proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        string ipfsHash;  // Detailed proposal on IPFS
        address[] targets;
        uint256[] values;
        bytes[] calldatas;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 executionTime;
        bool executed;
        bool canceled;
    }

    // Vote receipt
    struct Receipt {
        bool hasVoted;
        VoteType voteType;
        uint256 votes;
    }

    // Governance parameters
    uint256 public constant VOTING_DELAY = 1 days;          // Time before voting starts
    uint256 public constant VOTING_PERIOD = 7 days;         // Voting duration
    uint256 public constant EXECUTION_DELAY = 2 days;       // Timelock after passing
    uint256 public constant EXECUTION_WINDOW = 14 days;     // Time to execute after delay
    uint256 public constant PROPOSAL_THRESHOLD = 10_000 * 10**18;  // 10K AXX to propose
    uint256 public constant QUORUM = 1_000_000 * 10**18;    // 1M AXX quorum

    // Proposal tracking
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Receipt)) public receipts;
    
    // Delegated voting power
    mapping(address => address) public delegates;
    mapping(address => uint256) public votingPower;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        uint256 startTime,
        uint256 endTime
    );
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        VoteType voteType,
        uint256 votes
    );
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    event ProposalQueued(uint256 indexed proposalId, uint256 executionTime);
    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
    event VotingPowerChanged(address indexed account, uint256 previousPower, uint256 newPower);

    constructor(address _governanceToken, address _owner) Ownable(_owner) {
        governanceToken = IERC20(_governanceToken);
    }

    // ============ View Functions ============

    /**
     * @notice Get proposal state
     */
    function state(uint256 proposalId) public view returns (ProposalState) {
        Proposal storage proposal = proposals[proposalId];
        
        if (proposal.id == 0) revert("Governance: invalid proposal id");
        if (proposal.canceled) return ProposalState.Canceled;
        if (proposal.executed) return ProposalState.Executed;
        if (block.timestamp < proposal.startTime) return ProposalState.Pending;
        if (block.timestamp <= proposal.endTime) return ProposalState.Active;
        
        // Check if passed
        if (_quorumReached(proposalId) && _voteSucceeded(proposalId)) {
            if (proposal.executionTime == 0) return ProposalState.Succeeded;
            if (block.timestamp < proposal.executionTime) return ProposalState.Queued;
            if (block.timestamp <= proposal.executionTime + EXECUTION_WINDOW) return ProposalState.Queued;
            return ProposalState.Expired;
        }
        
        return ProposalState.Defeated;
    }

    /**
     * @notice Check if quorum reached
     */
    function _quorumReached(uint256 proposalId) internal view returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        return (proposal.forVotes + proposal.againstVotes + proposal.abstainVotes) >= QUORUM;
    }

    /**
     * @notice Check if vote succeeded
     */
    function _voteSucceeded(uint256 proposalId) internal view returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        return proposal.forVotes > proposal.againstVotes;
    }

    /**
     * @notice Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        string memory title,
        string memory description,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 abstainVotes,
        ProposalState currentState
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.abstainVotes,
            state(proposalId)
        );
    }

    /**
     * @notice Get vote receipt
     */
    function getReceipt(uint256 proposalId, address voter) external view returns (Receipt memory) {
        return receipts[proposalId][voter];
    }

    /**
     * @notice Get voting power for an account
     */
    function getVotingPower(address account) public view returns (uint256) {
        address delegate = delegates[account];
        if (delegate == address(0)) {
            return governanceToken.balanceOf(account);
        }
        return votingPower[account];
    }

    // ============ Delegation Functions ============

    /**
     * @notice Delegate voting power to another address
     */
    function delegate(address delegatee) external {
        address currentDelegate = delegates[msg.sender];
        uint256 balance = governanceToken.balanceOf(msg.sender);
        
        delegates[msg.sender] = delegatee;
        
        // Update voting power
        if (currentDelegate != address(0)) {
            votingPower[currentDelegate] -= balance;
            emit VotingPowerChanged(currentDelegate, votingPower[currentDelegate] + balance, votingPower[currentDelegate]);
        }
        
        if (delegatee != address(0)) {
            votingPower[delegatee] += balance;
            emit VotingPowerChanged(delegatee, votingPower[delegatee] - balance, votingPower[delegatee]);
        }
        
        emit DelegateChanged(msg.sender, currentDelegate, delegatee);
    }

    // ============ Proposal Functions ============

    /**
     * @notice Create a new proposal
     */
    function propose(
        string calldata title,
        string calldata description,
        string calldata ipfsHash,
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata calldatas
    ) external returns (uint256) {
        require(
            getVotingPower(msg.sender) >= PROPOSAL_THRESHOLD,
            "Governance: below proposal threshold"
        );
        require(
            targets.length == values.length && values.length == calldatas.length,
            "Governance: invalid proposal length"
        );
        require(targets.length > 0, "Governance: empty proposal");

        proposalCount++;
        uint256 proposalId = proposalCount;

        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = title;
        proposal.description = description;
        proposal.ipfsHash = ipfsHash;
        proposal.targets = targets;
        proposal.values = values;
        proposal.calldatas = calldatas;
        proposal.startTime = block.timestamp + VOTING_DELAY;
        proposal.endTime = proposal.startTime + VOTING_PERIOD;

        emit ProposalCreated(proposalId, msg.sender, title, proposal.startTime, proposal.endTime);

        return proposalId;
    }

    /**
     * @notice Cancel a proposal (proposer only, before execution)
     */
    function cancel(uint256 proposalId) external {
        ProposalState currentState = state(proposalId);
        require(
            currentState != ProposalState.Executed && 
            currentState != ProposalState.Canceled &&
            currentState != ProposalState.Expired,
            "Governance: cannot cancel"
        );
        
        Proposal storage proposal = proposals[proposalId];
        require(
            msg.sender == proposal.proposer || msg.sender == owner(),
            "Governance: not authorized"
        );

        proposal.canceled = true;
        emit ProposalCanceled(proposalId);
    }

    // ============ Voting Functions ============

    /**
     * @notice Cast a vote
     */
    function castVote(uint256 proposalId, VoteType voteType) external {
        _castVote(msg.sender, proposalId, voteType);
    }

    /**
     * @notice Cast vote with reason
     */
    function castVoteWithReason(
        uint256 proposalId,
        VoteType voteType,
        string calldata /* reason */
    ) external {
        _castVote(msg.sender, proposalId, voteType);
    }

    /**
     * @notice Internal vote casting
     */
    function _castVote(address voter, uint256 proposalId, VoteType voteType) internal {
        require(state(proposalId) == ProposalState.Active, "Governance: voting closed");
        
        Receipt storage receipt = receipts[proposalId][voter];
        require(!receipt.hasVoted, "Governance: already voted");

        uint256 votes = getVotingPower(voter);
        require(votes > 0, "Governance: no voting power");

        Proposal storage proposal = proposals[proposalId];

        if (voteType == VoteType.For) {
            proposal.forVotes += votes;
        } else if (voteType == VoteType.Against) {
            proposal.againstVotes += votes;
        } else {
            proposal.abstainVotes += votes;
        }

        receipt.hasVoted = true;
        receipt.voteType = voteType;
        receipt.votes = votes;

        emit VoteCast(voter, proposalId, voteType, votes);
    }

    // ============ Execution Functions ============

    /**
     * @notice Queue a successful proposal for execution
     */
    function queue(uint256 proposalId) external {
        require(state(proposalId) == ProposalState.Succeeded, "Governance: not succeeded");
        
        Proposal storage proposal = proposals[proposalId];
        proposal.executionTime = block.timestamp + EXECUTION_DELAY;
        
        emit ProposalQueued(proposalId, proposal.executionTime);
    }

    /**
     * @notice Execute a queued proposal
     */
    function execute(uint256 proposalId) external payable nonReentrant {
        ProposalState currentState = state(proposalId);
        require(currentState == ProposalState.Queued, "Governance: not queued");
        
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.executionTime, "Governance: too early");
        require(
            block.timestamp <= proposal.executionTime + EXECUTION_WINDOW,
            "Governance: execution window expired"
        );

        proposal.executed = true;

        for (uint256 i = 0; i < proposal.targets.length; i++) {
            (bool success, ) = proposal.targets[i].call{value: proposal.values[i]}(
                proposal.calldatas[i]
            );
            require(success, "Governance: execution failed");
        }

        emit ProposalExecuted(proposalId);
    }

    /**
     * @notice Receive ETH for proposal execution
     */
    receive() external payable {}
}
