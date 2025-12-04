// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/AXXToken.sol";
import "../contracts/Staking.sol";
import "../contracts/Governance.sol";
import "../contracts/EscrowManagerV2.sol";

/**
 * @title AXXToken Test Suite
 * @notice Comprehensive tests for AXX Token contract
 */
contract AXXTokenTest is Test {
    AXXToken public token;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        token = new AXXToken();
    }

    function test_InitialSupply() public view {
        assertEq(token.totalSupply(), 100_000_000 * 1e18);
        assertEq(token.balanceOf(owner), 100_000_000 * 1e18);
    }

    function test_TokenMetadata() public view {
        assertEq(token.name(), "Axionax Token");
        assertEq(token.symbol(), "AXX");
        assertEq(token.decimals(), 18);
    }

    function test_MaxSupply() public view {
        assertEq(token.MAX_SUPPLY(), 1_000_000_000 * 1e18);
    }

    function test_Mint() public {
        uint256 mintAmount = 1_000_000 * 1e18;
        token.mint(user1, mintAmount);
        assertEq(token.balanceOf(user1), mintAmount);
    }

    function test_Mint_RevertIfNotOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        token.mint(user2, 1000 * 1e18);
    }

    function test_Mint_RevertIfExceedsYearlyCap() public {
        uint256 yearlyMintCap = 10_000_000 * 1e18;
        
        // Mint up to cap
        token.mint(user1, yearlyMintCap);
        
        // Try to mint more
        vm.expectRevert("Yearly mint cap exceeded");
        token.mint(user2, 1);
    }

    function test_Mint_RevertIfExceedsMaxSupply() public {
        // Warp to many years later to bypass yearly cap
        vm.warp(block.timestamp + 365 days * 100);
        
        uint256 remaining = token.MAX_SUPPLY() - token.totalSupply();
        token.mint(user1, remaining);
        
        vm.expectRevert("Max supply exceeded");
        token.mint(user2, 1);
    }

    function test_Burn() public {
        uint256 burnAmount = 1_000_000 * 1e18;
        uint256 initialSupply = token.totalSupply();
        
        token.burn(burnAmount);
        assertEq(token.totalSupply(), initialSupply - burnAmount);
    }

    function test_BurnFrom() public {
        uint256 burnAmount = 1000 * 1e18;
        token.transfer(user1, burnAmount);
        
        vm.prank(user1);
        token.approve(owner, burnAmount);
        
        token.burnFrom(user1, burnAmount);
        assertEq(token.balanceOf(user1), 0);
    }

    function test_Transfer() public {
        uint256 amount = 1000 * 1e18;
        token.transfer(user1, amount);
        assertEq(token.balanceOf(user1), amount);
    }

    function test_Approve_And_TransferFrom() public {
        uint256 amount = 1000 * 1e18;
        token.approve(user1, amount);
        
        vm.prank(user1);
        token.transferFrom(owner, user2, amount);
        
        assertEq(token.balanceOf(user2), amount);
    }

    function test_Permit() public {
        uint256 amount = 1000 * 1e18;
        uint256 deadline = block.timestamp + 1 hours;
        
        // Create permit signature
        bytes32 PERMIT_TYPEHASH = keccak256(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
        );
        
        uint256 privateKey = 0xA11CE;
        address signer = vm.addr(privateKey);
        
        // Transfer tokens to signer
        token.transfer(signer, amount);
        
        bytes32 structHash = keccak256(
            abi.encode(
                PERMIT_TYPEHASH,
                signer,
                user1,
                amount,
                token.nonces(signer),
                deadline
            )
        );
        
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", token.DOMAIN_SEPARATOR(), structHash)
        );
        
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        
        token.permit(signer, user1, amount, deadline, v, r, s);
        
        assertEq(token.allowance(signer, user1), amount);
    }

    function testFuzz_Transfer(uint256 amount) public {
        amount = bound(amount, 0, token.balanceOf(owner));
        token.transfer(user1, amount);
        assertEq(token.balanceOf(user1), amount);
    }
}

/**
 * @title Staking Test Suite
 * @notice Comprehensive tests for Staking contract
 */
contract StakingTest is Test {
    AXXToken public token;
    Staking public staking;
    address public owner;
    address public staker1;
    address public staker2;

    uint256 constant STAKE_AMOUNT = 10_000 * 1e18;

    function setUp() public {
        owner = address(this);
        staker1 = makeAddr("staker1");
        staker2 = makeAddr("staker2");

        token = new AXXToken();
        staking = new Staking(address(token));

        // Fund stakers
        token.transfer(staker1, 200_000 * 1e18);
        token.transfer(staker2, 200_000 * 1e18);

        // Fund staking contract for rewards
        token.transfer(address(staking), 1_000_000 * 1e18);
    }

    function test_Stake() public {
        vm.startPrank(staker1);
        token.approve(address(staking), STAKE_AMOUNT);
        staking.stake(STAKE_AMOUNT);
        vm.stopPrank();

        assertEq(staking.stakedBalance(staker1), STAKE_AMOUNT);
        assertEq(staking.totalStaked(), STAKE_AMOUNT);
    }

    function test_Stake_RevertIfBelowMinimum() public {
        uint256 belowMin = staking.MIN_STAKE() - 1;
        
        vm.startPrank(staker1);
        token.approve(address(staking), belowMin);
        vm.expectRevert("Below minimum stake");
        staking.stake(belowMin);
        vm.stopPrank();
    }

    function test_Stake_BecomesValidator() public {
        uint256 validatorStake = 100_000 * 1e18;
        
        vm.startPrank(staker1);
        token.approve(address(staking), validatorStake);
        staking.stake(validatorStake);
        vm.stopPrank();

        assertTrue(staking.isValidator(staker1));
    }

    function test_RequestUnstake() public {
        vm.startPrank(staker1);
        token.approve(address(staking), STAKE_AMOUNT);
        staking.stake(STAKE_AMOUNT);
        staking.requestUnstake(STAKE_AMOUNT);
        vm.stopPrank();

        assertEq(staking.stakedBalance(staker1), 0);
    }

    function test_Unstake() public {
        vm.startPrank(staker1);
        token.approve(address(staking), STAKE_AMOUNT);
        staking.stake(STAKE_AMOUNT);
        staking.requestUnstake(STAKE_AMOUNT);
        
        // Fast forward past unbonding period
        vm.warp(block.timestamp + 7 days + 1);
        
        uint256 balanceBefore = token.balanceOf(staker1);
        staking.unstake(0);
        uint256 balanceAfter = token.balanceOf(staker1);
        vm.stopPrank();

        assertEq(balanceAfter - balanceBefore, STAKE_AMOUNT);
    }

    function test_Unstake_RevertIfStillBonded() public {
        vm.startPrank(staker1);
        token.approve(address(staking), STAKE_AMOUNT);
        staking.stake(STAKE_AMOUNT);
        staking.requestUnstake(STAKE_AMOUNT);
        
        vm.expectRevert("Still unbonding");
        staking.unstake(0);
        vm.stopPrank();
    }

    function test_ClaimRewards() public {
        vm.startPrank(staker1);
        token.approve(address(staking), STAKE_AMOUNT);
        staking.stake(STAKE_AMOUNT);
        
        // Fast forward to accrue rewards
        vm.warp(block.timestamp + 365 days);
        
        uint256 pendingRewards = staking.pendingRewards(staker1);
        assertTrue(pendingRewards > 0);
        
        uint256 balanceBefore = token.balanceOf(staker1);
        staking.claimRewards();
        uint256 balanceAfter = token.balanceOf(staker1);
        vm.stopPrank();

        assertEq(balanceAfter - balanceBefore, pendingRewards);
    }

    function test_Slash() public {
        vm.startPrank(staker1);
        token.approve(address(staking), STAKE_AMOUNT);
        staking.stake(STAKE_AMOUNT);
        vm.stopPrank();

        uint256 slashAmount = STAKE_AMOUNT / 10;
        staking.slash(staker1, slashAmount, "Test slash");

        assertEq(staking.stakedBalance(staker1), STAKE_AMOUNT - slashAmount);
    }

    function testFuzz_Stake(uint256 amount) public {
        amount = bound(amount, staking.MIN_STAKE(), 100_000 * 1e18);
        
        vm.startPrank(staker1);
        token.approve(address(staking), amount);
        staking.stake(amount);
        vm.stopPrank();

        assertEq(staking.stakedBalance(staker1), amount);
    }
}

/**
 * @title EscrowManagerV2 Test Suite
 * @notice Comprehensive tests for EscrowManagerV2 contract
 */
contract EscrowManagerV2Test is Test {
    AXXToken public token;
    EscrowManagerV2 public escrow;
    address public owner;
    address public client;
    address public worker;
    address public arbiter;

    uint256 constant JOB_AMOUNT = 1000 * 1e18;

    function setUp() public {
        owner = address(this);
        client = makeAddr("client");
        worker = makeAddr("worker");
        arbiter = makeAddr("arbiter");

        token = new AXXToken();
        escrow = new EscrowManagerV2(address(token), arbiter);

        // Fund client
        token.transfer(client, 100_000 * 1e18);
    }

    function test_CreateEscrow() public {
        bytes32 jobId = keccak256("job1");
        uint256 deadline = block.timestamp + 7 days;

        vm.startPrank(client);
        token.approve(address(escrow), JOB_AMOUNT);
        escrow.createEscrow(jobId, JOB_AMOUNT, deadline);
        vm.stopPrank();

        (
            address escrowClient,
            ,
            uint256 amount,
            EscrowManagerV2.EscrowStatus status,
            ,
            ,

        ) = escrow.escrows(jobId);

        assertEq(escrowClient, client);
        assertEq(amount, JOB_AMOUNT);
        assertEq(uint8(status), uint8(EscrowManagerV2.EscrowStatus.Funded));
    }

    function test_AssignWorker() public {
        bytes32 jobId = keccak256("job1");
        uint256 deadline = block.timestamp + 7 days;

        vm.startPrank(client);
        token.approve(address(escrow), JOB_AMOUNT);
        escrow.createEscrow(jobId, JOB_AMOUNT, deadline);
        escrow.assignWorker(jobId, worker);
        vm.stopPrank();

        (, address assignedWorker, , , , , ) = escrow.escrows(jobId);
        assertEq(assignedWorker, worker);
    }

    function test_SubmitWork() public {
        bytes32 jobId = keccak256("job1");
        uint256 deadline = block.timestamp + 7 days;
        bytes32 workHash = keccak256("completed work");

        vm.startPrank(client);
        token.approve(address(escrow), JOB_AMOUNT);
        escrow.createEscrow(jobId, JOB_AMOUNT, deadline);
        escrow.assignWorker(jobId, worker);
        vm.stopPrank();

        vm.prank(worker);
        escrow.submitWork(jobId, workHash);

        (, , , EscrowManagerV2.EscrowStatus status, , , ) = escrow.escrows(jobId);
        assertEq(uint8(status), uint8(EscrowManagerV2.EscrowStatus.Submitted));
    }

    function test_ApproveWork() public {
        bytes32 jobId = keccak256("job1");
        uint256 deadline = block.timestamp + 7 days;
        bytes32 workHash = keccak256("completed work");

        vm.startPrank(client);
        token.approve(address(escrow), JOB_AMOUNT);
        escrow.createEscrow(jobId, JOB_AMOUNT, deadline);
        escrow.assignWorker(jobId, worker);
        vm.stopPrank();

        vm.prank(worker);
        escrow.submitWork(jobId, workHash);

        uint256 workerBalanceBefore = token.balanceOf(worker);

        vm.prank(client);
        escrow.approveWork(jobId);

        uint256 workerBalanceAfter = token.balanceOf(worker);
        uint256 platformFee = (JOB_AMOUNT * escrow.platformFeeRate()) / 10000;
        uint256 expectedPayment = JOB_AMOUNT - platformFee;

        assertEq(workerBalanceAfter - workerBalanceBefore, expectedPayment);

        (, , , EscrowManagerV2.EscrowStatus status, , , ) = escrow.escrows(jobId);
        assertEq(uint8(status), uint8(EscrowManagerV2.EscrowStatus.Released));
    }

    function test_RaiseDispute() public {
        bytes32 jobId = keccak256("job1");
        uint256 deadline = block.timestamp + 7 days;

        vm.startPrank(client);
        token.approve(address(escrow), JOB_AMOUNT);
        escrow.createEscrow(jobId, JOB_AMOUNT, deadline);
        escrow.assignWorker(jobId, worker);
        escrow.raiseDispute(jobId, "Work quality issues");
        vm.stopPrank();

        (, , , EscrowManagerV2.EscrowStatus status, , , ) = escrow.escrows(jobId);
        assertEq(uint8(status), uint8(EscrowManagerV2.EscrowStatus.Disputed));
    }

    function test_ResolveDispute_ForWorker() public {
        bytes32 jobId = keccak256("job1");
        uint256 deadline = block.timestamp + 7 days;
        bytes32 workHash = keccak256("completed work");

        vm.startPrank(client);
        token.approve(address(escrow), JOB_AMOUNT);
        escrow.createEscrow(jobId, JOB_AMOUNT, deadline);
        escrow.assignWorker(jobId, worker);
        vm.stopPrank();

        vm.prank(worker);
        escrow.submitWork(jobId, workHash);

        vm.prank(client);
        escrow.raiseDispute(jobId, "Not satisfied");

        uint256 workerBalanceBefore = token.balanceOf(worker);

        vm.prank(arbiter);
        escrow.resolveDispute(jobId, true, "Worker completed as specified");

        uint256 workerBalanceAfter = token.balanceOf(worker);
        assertTrue(workerBalanceAfter > workerBalanceBefore);
    }

    function test_ResolveDispute_ForClient() public {
        bytes32 jobId = keccak256("job1");
        uint256 deadline = block.timestamp + 7 days;

        vm.startPrank(client);
        token.approve(address(escrow), JOB_AMOUNT);
        escrow.createEscrow(jobId, JOB_AMOUNT, deadline);
        escrow.assignWorker(jobId, worker);
        escrow.raiseDispute(jobId, "Worker disappeared");
        vm.stopPrank();

        uint256 clientBalanceBefore = token.balanceOf(client);

        vm.prank(arbiter);
        escrow.resolveDispute(jobId, false, "Worker failed to deliver");

        uint256 clientBalanceAfter = token.balanceOf(client);
        assertEq(clientBalanceAfter - clientBalanceBefore, JOB_AMOUNT);
    }

    function test_RefundAfterDeadline() public {
        bytes32 jobId = keccak256("job1");
        uint256 deadline = block.timestamp + 7 days;

        vm.startPrank(client);
        token.approve(address(escrow), JOB_AMOUNT);
        escrow.createEscrow(jobId, JOB_AMOUNT, deadline);
        vm.stopPrank();

        // Fast forward past deadline
        vm.warp(deadline + 1);

        uint256 clientBalanceBefore = token.balanceOf(client);

        vm.prank(client);
        escrow.refundAfterDeadline(jobId);

        uint256 clientBalanceAfter = token.balanceOf(client);
        assertEq(clientBalanceAfter - clientBalanceBefore, JOB_AMOUNT);
    }

    function test_UpdatePlatformFee() public {
        uint256 newFee = 300; // 3%
        escrow.updatePlatformFee(newFee);
        assertEq(escrow.platformFeeRate(), newFee);
    }

    function test_UpdatePlatformFee_RevertIfTooHigh() public {
        vm.expectRevert("Fee too high");
        escrow.updatePlatformFee(1001); // > 10%
    }
}

/**
 * @title Governance Test Suite
 * @notice Comprehensive tests for Governance contract
 */
contract GovernanceTest is Test {
    AXXToken public token;
    Governance public governance;
    address public owner;
    address public proposer;
    address public voter1;
    address public voter2;

    uint256 constant PROPOSER_TOKENS = 1_000_000 * 1e18;
    uint256 constant VOTER_TOKENS = 500_000 * 1e18;

    function setUp() public {
        owner = address(this);
        proposer = makeAddr("proposer");
        voter1 = makeAddr("voter1");
        voter2 = makeAddr("voter2");

        token = new AXXToken();
        governance = new Governance(address(token));

        // Fund accounts
        token.transfer(proposer, PROPOSER_TOKENS);
        token.transfer(voter1, VOTER_TOKENS);
        token.transfer(voter2, VOTER_TOKENS);

        // Delegate to self
        vm.prank(proposer);
        token.delegate(proposer);
        vm.prank(voter1);
        token.delegate(voter1);
        vm.prank(voter2);
        token.delegate(voter2);

        // Mine a block to register voting power
        vm.roll(block.number + 1);
    }

    function test_CreateProposal() public {
        address[] memory targets = new address[](1);
        targets[0] = address(token);

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature(
            "mint(address,uint256)",
            proposer,
            1000 * 1e18
        );

        vm.prank(proposer);
        uint256 proposalId = governance.propose(
            targets,
            values,
            calldatas,
            "Mint tokens for development"
        );

        assertTrue(proposalId > 0);
    }

    function test_Vote() public {
        address[] memory targets = new address[](1);
        targets[0] = address(token);

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature(
            "mint(address,uint256)",
            proposer,
            1000 * 1e18
        );

        vm.prank(proposer);
        uint256 proposalId = governance.propose(
            targets,
            values,
            calldatas,
            "Test proposal"
        );

        // Fast forward past voting delay
        vm.roll(block.number + governance.votingDelay() + 1);

        vm.prank(voter1);
        governance.castVote(proposalId, 1); // For

        assertTrue(governance.hasVoted(proposalId, voter1));
    }

    function test_VoteWithReason() public {
        address[] memory targets = new address[](1);
        targets[0] = address(token);

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = "";

        vm.prank(proposer);
        uint256 proposalId = governance.propose(
            targets,
            values,
            calldatas,
            "Test proposal"
        );

        vm.roll(block.number + governance.votingDelay() + 1);

        vm.prank(voter1);
        governance.castVoteWithReason(
            proposalId,
            1,
            "Supporting this proposal because..."
        );

        assertTrue(governance.hasVoted(proposalId, voter1));
    }

    function test_QuorumRequirement() public view {
        uint256 quorum = governance.quorum(block.number - 1);
        assertEq(quorum, 1_000_000 * 1e18);
    }

    function test_ProposalThreshold() public view {
        uint256 threshold = governance.proposalThreshold();
        assertEq(threshold, 100_000 * 1e18);
    }

    function test_VotingDelay() public view {
        assertEq(governance.votingDelay(), 1);
    }

    function test_VotingPeriod() public view {
        // 7 days at ~12 sec per block
        assertEq(governance.votingPeriod(), 50400);
    }
}
