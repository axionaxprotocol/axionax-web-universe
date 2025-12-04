// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title axionax Enhanced Escrow Manager
 * @notice Improved escrow system for compute marketplace with worker assignment and dispute resolution
 * @dev Supports both native currency and ERC20 tokens
 */
contract EscrowManagerV2 is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Escrow status
    enum EscrowStatus { 
        Created,      // Initial state
        Deposited,    // Funds deposited
        WorkerAssigned, // Worker accepted the job
        InProgress,   // Work has started
        Completed,    // Work completed, awaiting release
        Released,     // Funds released to worker
        Refunded,     // Funds refunded to payer
        Disputed,     // In dispute resolution
        Resolved      // Dispute resolved
    }

    // Escrow structure
    struct Escrow {
        string jobId;
        address payer;
        address worker;
        address token;          // address(0) for native currency
        uint256 amount;
        uint256 platformFee;    // Fee taken by platform
        uint256 workerDeadline; // Deadline for worker to complete
        EscrowStatus status;
        uint256 createdAt;
        uint256 completedAt;
        string metadataHash;    // IPFS hash for job details
    }

    // Dispute structure
    struct Dispute {
        string jobId;
        address initiator;
        string reason;
        uint256 initiatedAt;
        bool resolved;
        address winner;
    }

    // Platform settings
    uint256 public platformFeeRate = 250;  // 2.5% (basis points)
    uint256 public constant MAX_FEE_RATE = 1000; // Max 10%
    uint256 public constant BASIS_POINTS = 10000;
    
    // Arbiter for disputes
    address public arbiter;
    
    // Storage
    mapping(string => Escrow) public escrows;
    mapping(string => Dispute) public disputes;
    mapping(address => uint256) public platformFees; // Collected fees per token
    
    // Events
    event EscrowCreated(string indexed jobId, address indexed payer, uint256 amount, address token);
    event WorkerAssigned(string indexed jobId, address indexed worker, uint256 deadline);
    event WorkStarted(string indexed jobId);
    event WorkCompleted(string indexed jobId);
    event EscrowReleased(string indexed jobId, address indexed worker, uint256 amount, uint256 fee);
    event EscrowRefunded(string indexed jobId, address indexed payer, uint256 amount);
    event DisputeInitiated(string indexed jobId, address indexed initiator, string reason);
    event DisputeResolved(string indexed jobId, address indexed winner, uint256 amount);
    event PlatformFeeUpdated(uint256 newRate);
    event ArbiterUpdated(address indexed newArbiter);
    event FeesWithdrawn(address indexed token, uint256 amount);

    constructor(address _owner, address _arbiter) Ownable(_owner) {
        arbiter = _arbiter;
    }

    // ============ Modifiers ============

    modifier onlyPayer(string calldata jobId) {
        require(escrows[jobId].payer == msg.sender, "Escrow: not payer");
        _;
    }

    modifier onlyWorker(string calldata jobId) {
        require(escrows[jobId].worker == msg.sender, "Escrow: not worker");
        _;
    }

    modifier onlyPayerOrWorker(string calldata jobId) {
        require(
            escrows[jobId].payer == msg.sender || escrows[jobId].worker == msg.sender,
            "Escrow: not authorized"
        );
        _;
    }

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "Escrow: not arbiter");
        _;
    }

    modifier escrowExists(string calldata jobId) {
        require(escrows[jobId].createdAt > 0, "Escrow: does not exist");
        _;
    }

    // ============ Payer Functions ============

    /**
     * @notice Create and deposit into escrow with native currency
     */
    function depositNative(
        string calldata jobId,
        string calldata metadataHash
    ) external payable nonReentrant {
        require(msg.value > 0, "Escrow: zero amount");
        require(escrows[jobId].createdAt == 0, "Escrow: job exists");

        uint256 fee = (msg.value * platformFeeRate) / BASIS_POINTS;
        
        escrows[jobId] = Escrow({
            jobId: jobId,
            payer: msg.sender,
            worker: address(0),
            token: address(0),
            amount: msg.value - fee,
            platformFee: fee,
            workerDeadline: 0,
            status: EscrowStatus.Deposited,
            createdAt: block.timestamp,
            completedAt: 0,
            metadataHash: metadataHash
        });

        platformFees[address(0)] += fee;

        emit EscrowCreated(jobId, msg.sender, msg.value, address(0));
    }

    /**
     * @notice Create and deposit into escrow with ERC20 token
     */
    function depositToken(
        string calldata jobId,
        address token,
        uint256 amount,
        string calldata metadataHash
    ) external nonReentrant {
        require(amount > 0, "Escrow: zero amount");
        require(token != address(0), "Escrow: invalid token");
        require(escrows[jobId].createdAt == 0, "Escrow: job exists");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        uint256 fee = (amount * platformFeeRate) / BASIS_POINTS;
        
        escrows[jobId] = Escrow({
            jobId: jobId,
            payer: msg.sender,
            worker: address(0),
            token: token,
            amount: amount - fee,
            platformFee: fee,
            workerDeadline: 0,
            status: EscrowStatus.Deposited,
            createdAt: block.timestamp,
            completedAt: 0,
            metadataHash: metadataHash
        });

        platformFees[token] += fee;

        emit EscrowCreated(jobId, msg.sender, amount, token);
    }

    /**
     * @notice Assign a worker to the job
     */
    function assignWorker(
        string calldata jobId,
        address worker,
        uint256 deadline
    ) external escrowExists(jobId) onlyPayer(jobId) {
        Escrow storage escrow = escrows[jobId];
        require(escrow.status == EscrowStatus.Deposited, "Escrow: invalid status");
        require(worker != address(0), "Escrow: invalid worker");
        require(deadline > block.timestamp, "Escrow: invalid deadline");

        escrow.worker = worker;
        escrow.workerDeadline = deadline;
        escrow.status = EscrowStatus.WorkerAssigned;

        emit WorkerAssigned(jobId, worker, deadline);
    }

    /**
     * @notice Release funds to worker after work completion
     */
    function release(string calldata jobId) external escrowExists(jobId) onlyPayer(jobId) nonReentrant {
        Escrow storage escrow = escrows[jobId];
        require(
            escrow.status == EscrowStatus.Completed || escrow.status == EscrowStatus.InProgress,
            "Escrow: invalid status"
        );

        escrow.status = EscrowStatus.Released;
        escrow.completedAt = block.timestamp;

        _transferFunds(escrow.token, escrow.worker, escrow.amount);

        emit EscrowReleased(jobId, escrow.worker, escrow.amount, escrow.platformFee);
    }

    /**
     * @notice Request refund (only before worker assigned or after deadline)
     */
    function refund(string calldata jobId) external escrowExists(jobId) onlyPayer(jobId) nonReentrant {
        Escrow storage escrow = escrows[jobId];
        
        bool canRefund = escrow.status == EscrowStatus.Deposited ||
            (escrow.status == EscrowStatus.WorkerAssigned && block.timestamp > escrow.workerDeadline);
        
        require(canRefund, "Escrow: cannot refund");

        escrow.status = EscrowStatus.Refunded;
        
        // Refund includes platform fee if worker never assigned
        uint256 refundAmount = escrow.status == EscrowStatus.Deposited 
            ? escrow.amount + escrow.platformFee 
            : escrow.amount;
        
        if (escrow.status == EscrowStatus.Deposited) {
            platformFees[escrow.token] -= escrow.platformFee;
        }

        _transferFunds(escrow.token, escrow.payer, refundAmount);

        emit EscrowRefunded(jobId, escrow.payer, refundAmount);
    }

    // ============ Worker Functions ============

    /**
     * @notice Worker starts work on the job
     */
    function startWork(string calldata jobId) external escrowExists(jobId) onlyWorker(jobId) {
        Escrow storage escrow = escrows[jobId];
        require(escrow.status == EscrowStatus.WorkerAssigned, "Escrow: not assigned");
        require(block.timestamp <= escrow.workerDeadline, "Escrow: deadline passed");

        escrow.status = EscrowStatus.InProgress;

        emit WorkStarted(jobId);
    }

    /**
     * @notice Worker marks work as completed
     */
    function completeWork(string calldata jobId) external escrowExists(jobId) onlyWorker(jobId) {
        Escrow storage escrow = escrows[jobId];
        require(escrow.status == EscrowStatus.InProgress, "Escrow: not in progress");

        escrow.status = EscrowStatus.Completed;

        emit WorkCompleted(jobId);
    }

    // ============ Dispute Functions ============

    /**
     * @notice Initiate a dispute
     */
    function initiateDispute(
        string calldata jobId,
        string calldata reason
    ) external escrowExists(jobId) onlyPayerOrWorker(jobId) {
        Escrow storage escrow = escrows[jobId];
        require(
            escrow.status == EscrowStatus.InProgress || 
            escrow.status == EscrowStatus.Completed ||
            escrow.status == EscrowStatus.WorkerAssigned,
            "Escrow: cannot dispute"
        );
        require(disputes[jobId].initiatedAt == 0, "Escrow: dispute exists");

        escrow.status = EscrowStatus.Disputed;
        
        disputes[jobId] = Dispute({
            jobId: jobId,
            initiator: msg.sender,
            reason: reason,
            initiatedAt: block.timestamp,
            resolved: false,
            winner: address(0)
        });

        emit DisputeInitiated(jobId, msg.sender, reason);
    }

    /**
     * @notice Resolve dispute (arbiter only)
     */
    function resolveDispute(
        string calldata jobId,
        address winner,
        uint256 payerPercent  // 0-100, percentage to payer
    ) external escrowExists(jobId) onlyArbiter nonReentrant {
        Escrow storage escrow = escrows[jobId];
        Dispute storage dispute = disputes[jobId];
        
        require(escrow.status == EscrowStatus.Disputed, "Escrow: not disputed");
        require(!dispute.resolved, "Escrow: already resolved");
        require(payerPercent <= 100, "Escrow: invalid percentage");
        require(
            winner == escrow.payer || winner == escrow.worker,
            "Escrow: invalid winner"
        );

        dispute.resolved = true;
        dispute.winner = winner;
        escrow.status = EscrowStatus.Resolved;

        uint256 payerAmount = (escrow.amount * payerPercent) / 100;
        uint256 workerAmount = escrow.amount - payerAmount;

        if (payerAmount > 0) {
            _transferFunds(escrow.token, escrow.payer, payerAmount);
        }
        if (workerAmount > 0) {
            _transferFunds(escrow.token, escrow.worker, workerAmount);
        }

        emit DisputeResolved(jobId, winner, winner == escrow.payer ? payerAmount : workerAmount);
    }

    // ============ View Functions ============

    /**
     * @notice Get escrow details
     */
    function getEscrow(string calldata jobId) external view returns (Escrow memory) {
        return escrows[jobId];
    }

    /**
     * @notice Get dispute details
     */
    function getDispute(string calldata jobId) external view returns (Dispute memory) {
        return disputes[jobId];
    }

    /**
     * @notice Check if job can be refunded
     */
    function canRefund(string calldata jobId) external view returns (bool) {
        Escrow storage escrow = escrows[jobId];
        return escrow.status == EscrowStatus.Deposited ||
            (escrow.status == EscrowStatus.WorkerAssigned && block.timestamp > escrow.workerDeadline);
    }

    // ============ Admin Functions ============

    /**
     * @notice Update platform fee rate
     */
    function setPlatformFeeRate(uint256 newRate) external onlyOwner {
        require(newRate <= MAX_FEE_RATE, "Escrow: fee too high");
        platformFeeRate = newRate;
        emit PlatformFeeUpdated(newRate);
    }

    /**
     * @notice Update arbiter
     */
    function setArbiter(address newArbiter) external onlyOwner {
        require(newArbiter != address(0), "Escrow: invalid arbiter");
        arbiter = newArbiter;
        emit ArbiterUpdated(newArbiter);
    }

    /**
     * @notice Withdraw collected platform fees
     */
    function withdrawFees(address token) external onlyOwner nonReentrant {
        uint256 amount = platformFees[token];
        require(amount > 0, "Escrow: no fees");
        
        platformFees[token] = 0;
        _transferFunds(token, owner(), amount);
        
        emit FeesWithdrawn(token, amount);
    }

    // ============ Internal Functions ============

    /**
     * @notice Transfer funds (native or ERC20)
     */
    function _transferFunds(address token, address to, uint256 amount) internal {
        if (token == address(0)) {
            (bool success, ) = to.call{value: amount}("");
            require(success, "Escrow: transfer failed");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    /**
     * @notice Receive native currency
     */
    receive() external payable {}
}
