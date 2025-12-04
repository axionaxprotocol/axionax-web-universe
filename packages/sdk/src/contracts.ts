/**
 * axionax SDK v2.0 - Contract Interfaces
 * Type-safe contract interaction with full ABI support
 */

import { ethers } from 'ethers';

// Import contract ABIs
import EscrowArtifact from '@axionax/contracts/artifacts/contracts/Escrow.sol/EscrowManager.json';

// ============ Contract ABIs ============

export const ESCROW_ABI = EscrowArtifact.abi;

export const AXX_TOKEN_ABI = [
  // ERC20 Standard
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  // ERC20 Permit
  "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
  "function nonces(address owner) view returns (uint256)",
  "function DOMAIN_SEPARATOR() view returns (bytes32)",
  // Burnable
  "function burn(uint256 amount)",
  "function burnFrom(address account, uint256 amount)",
  // Custom
  "function mint(address to, uint256 amount, string reason)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function YEARLY_MINT_CAP() view returns (uint256)",
  "function remainingMintableThisYear() view returns (uint256)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event TokensMinted(address indexed to, uint256 amount, string reason)"
] as const;

export const STAKING_ABI = [
  // View functions
  "function axxToken() view returns (address)",
  "function MIN_STAKE() view returns (uint256)",
  "function UNBONDING_PERIOD() view returns (uint256)",
  "function MIN_VALIDATOR_STAKE() view returns (uint256)",
  "function rewardRate() view returns (uint256)",
  "function totalStaked() view returns (uint256)",
  "function rewardPerToken() view returns (uint256)",
  "function earned(address account) view returns (uint256)",
  "function getStakeInfo(address account) view returns (uint256 stakedAmount, uint256 pendingRewards, uint256 unstakeRequestTime, uint256 unstakeAmount, bool validatorStatus)",
  "function getValidators() view returns (address[])",
  "function validatorCount() view returns (uint256)",
  "function isValidator(address) view returns (bool)",
  // Staking functions
  "function stake(uint256 amount)",
  "function requestUnstake(uint256 amount)",
  "function unstake()",
  "function claimRewards()",
  "function compoundRewards()",
  // Events
  "event Staked(address indexed user, uint256 amount)",
  "event UnstakeRequested(address indexed user, uint256 amount)",
  "event Unstaked(address indexed user, uint256 amount)",
  "event RewardsClaimed(address indexed user, uint256 amount)",
  "event ValidatorRegistered(address indexed validator)",
  "event ValidatorRemoved(address indexed validator)"
] as const;

export const GOVERNANCE_ABI = [
  // View functions
  "function governanceToken() view returns (address)",
  "function VOTING_DELAY() view returns (uint256)",
  "function VOTING_PERIOD() view returns (uint256)",
  "function EXECUTION_DELAY() view returns (uint256)",
  "function PROPOSAL_THRESHOLD() view returns (uint256)",
  "function QUORUM() view returns (uint256)",
  "function proposalCount() view returns (uint256)",
  "function state(uint256 proposalId) view returns (uint8)",
  "function getProposal(uint256 proposalId) view returns (address proposer, string title, string description, uint256 forVotes, uint256 againstVotes, uint256 abstainVotes, uint8 currentState)",
  "function getReceipt(uint256 proposalId, address voter) view returns (bool hasVoted, uint8 voteType, uint256 votes)",
  "function getVotingPower(address account) view returns (uint256)",
  "function delegates(address) view returns (address)",
  // Proposal functions
  "function propose(string title, string description, string ipfsHash, address[] targets, uint256[] values, bytes[] calldatas) returns (uint256)",
  "function cancel(uint256 proposalId)",
  "function queue(uint256 proposalId)",
  "function execute(uint256 proposalId) payable",
  // Voting functions
  "function delegate(address delegatee)",
  "function castVote(uint256 proposalId, uint8 voteType)",
  "function castVoteWithReason(uint256 proposalId, uint8 voteType, string reason)",
  // Events
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title, uint256 startTime, uint256 endTime)",
  "event VoteCast(address indexed voter, uint256 indexed proposalId, uint8 voteType, uint256 votes)",
  "event ProposalExecuted(uint256 indexed proposalId)",
  "event ProposalCanceled(uint256 indexed proposalId)",
  "event ProposalQueued(uint256 indexed proposalId, uint256 executionTime)",
  "event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate)"
] as const;

export const ESCROW_V2_ABI = [
  // View functions
  "function platformFeeRate() view returns (uint256)",
  "function arbiter() view returns (address)",
  "function getEscrow(string jobId) view returns (tuple(string jobId, address payer, address worker, address token, uint256 amount, uint256 platformFee, uint256 workerDeadline, uint8 status, uint256 createdAt, uint256 completedAt, string metadataHash))",
  "function getDispute(string jobId) view returns (tuple(string jobId, address initiator, string reason, uint256 initiatedAt, bool resolved, address winner))",
  "function canRefund(string jobId) view returns (bool)",
  // Payer functions
  "function depositNative(string jobId, string metadataHash) payable",
  "function depositToken(string jobId, address token, uint256 amount, string metadataHash)",
  "function assignWorker(string jobId, address worker, uint256 deadline)",
  "function release(string jobId)",
  "function refund(string jobId)",
  // Worker functions
  "function startWork(string jobId)",
  "function completeWork(string jobId)",
  // Dispute functions
  "function initiateDispute(string jobId, string reason)",
  "function resolveDispute(string jobId, address winner, uint256 payerPercent)",
  // Events
  "event EscrowCreated(string indexed jobId, address indexed payer, uint256 amount, address token)",
  "event WorkerAssigned(string indexed jobId, address indexed worker, uint256 deadline)",
  "event WorkStarted(string indexed jobId)",
  "event WorkCompleted(string indexed jobId)",
  "event EscrowReleased(string indexed jobId, address indexed worker, uint256 amount, uint256 fee)",
  "event EscrowRefunded(string indexed jobId, address indexed payer, uint256 amount)",
  "event DisputeInitiated(string indexed jobId, address indexed initiator, string reason)",
  "event DisputeResolved(string indexed jobId, address indexed winner, uint256 amount)"
] as const;

// ============ Contract Types ============

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

export interface StakeInfo {
  stakedAmount: bigint;
  pendingRewards: bigint;
  unstakeRequestTime: number;
  unstakeAmount: bigint;
  isValidator: boolean;
}

export enum ProposalState {
  Pending = 0,
  Active = 1,
  Canceled = 2,
  Defeated = 3,
  Succeeded = 4,
  Queued = 5,
  Expired = 6,
  Executed = 7
}

export enum VoteType {
  Against = 0,
  For = 1,
  Abstain = 2
}

export interface ProposalInfo {
  id: number;
  proposer: string;
  title: string;
  description: string;
  forVotes: bigint;
  againstVotes: bigint;
  abstainVotes: bigint;
  state: ProposalState;
}

export interface VoteReceipt {
  hasVoted: boolean;
  voteType: VoteType;
  votes: bigint;
}

export enum EscrowStatusV2 {
  Created = 0,
  Deposited = 1,
  WorkerAssigned = 2,
  InProgress = 3,
  Completed = 4,
  Released = 5,
  Refunded = 6,
  Disputed = 7,
  Resolved = 8
}

export interface EscrowInfoV2 {
  jobId: string;
  payer: string;
  worker: string;
  token: string;
  amount: bigint;
  platformFee: bigint;
  workerDeadline: number;
  status: EscrowStatusV2;
  createdAt: number;
  completedAt: number;
  metadataHash: string;
}

export interface DisputeInfo {
  jobId: string;
  initiator: string;
  reason: string;
  initiatedAt: number;
  resolved: boolean;
  winner: string;
}

// ============ Contract Wrapper Classes ============

/**
 * AXX Token Contract Wrapper
 */
export class AXXTokenContract {
  private contract: ethers.Contract;
  private signer?: ethers.Signer;

  constructor(address: string, providerOrSigner: ethers.Provider | ethers.Signer) {
    if ('getAddress' in providerOrSigner) {
      this.signer = providerOrSigner as ethers.Signer;
      this.contract = new ethers.Contract(address, AXX_TOKEN_ABI, providerOrSigner);
    } else {
      this.contract = new ethers.Contract(address, AXX_TOKEN_ABI, providerOrSigner);
    }
  }

  // Read functions
  async getTokenInfo(): Promise<TokenInfo> {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
      this.contract.decimals(),
      this.contract.totalSupply()
    ]);
    return { name, symbol, decimals, totalSupply };
  }

  async balanceOf(address: string): Promise<bigint> {
    return this.contract.balanceOf(address);
  }

  async allowance(owner: string, spender: string): Promise<bigint> {
    return this.contract.allowance(owner, spender);
  }

  async remainingMintableThisYear(): Promise<bigint> {
    return this.contract.remainingMintableThisYear();
  }

  // Write functions
  async transfer(to: string, amount: bigint): Promise<ethers.TransactionResponse> {
    return this.contract.transfer(to, amount);
  }

  async approve(spender: string, amount: bigint): Promise<ethers.TransactionResponse> {
    return this.contract.approve(spender, amount);
  }

  async burn(amount: bigint): Promise<ethers.TransactionResponse> {
    return this.contract.burn(amount);
  }

  // Event listeners
  onTransfer(callback: (from: string, to: string, value: bigint) => void): () => void {
    this.contract.on('Transfer', callback);
    return () => this.contract.off('Transfer', callback);
  }
}

/**
 * Staking Contract Wrapper
 */
export class StakingContract {
  private contract: ethers.Contract;

  constructor(address: string, providerOrSigner: ethers.Provider | ethers.Signer) {
    this.contract = new ethers.Contract(address, STAKING_ABI, providerOrSigner);
  }

  // Read functions
  async getStakeInfo(address: string): Promise<StakeInfo> {
    const result = await this.contract.getStakeInfo(address);
    return {
      stakedAmount: result.stakedAmount,
      pendingRewards: result.pendingRewards,
      unstakeRequestTime: Number(result.unstakeRequestTime),
      unstakeAmount: result.unstakeAmount,
      isValidator: result.validatorStatus
    };
  }

  async totalStaked(): Promise<bigint> {
    return this.contract.totalStaked();
  }

  async earned(address: string): Promise<bigint> {
    return this.contract.earned(address);
  }

  async getValidators(): Promise<string[]> {
    return this.contract.getValidators();
  }

  async isValidator(address: string): Promise<boolean> {
    return this.contract.isValidator(address);
  }

  // Write functions
  async stake(amount: bigint): Promise<ethers.TransactionResponse> {
    return this.contract.stake(amount);
  }

  async requestUnstake(amount: bigint): Promise<ethers.TransactionResponse> {
    return this.contract.requestUnstake(amount);
  }

  async unstake(): Promise<ethers.TransactionResponse> {
    return this.contract.unstake();
  }

  async claimRewards(): Promise<ethers.TransactionResponse> {
    return this.contract.claimRewards();
  }

  async compoundRewards(): Promise<ethers.TransactionResponse> {
    return this.contract.compoundRewards();
  }

  // Event listeners
  onStaked(callback: (user: string, amount: bigint) => void): () => void {
    this.contract.on('Staked', callback);
    return () => this.contract.off('Staked', callback);
  }

  onRewardsClaimed(callback: (user: string, amount: bigint) => void): () => void {
    this.contract.on('RewardsClaimed', callback);
    return () => this.contract.off('RewardsClaimed', callback);
  }

  onValidatorRegistered(callback: (validator: string) => void): () => void {
    this.contract.on('ValidatorRegistered', callback);
    return () => this.contract.off('ValidatorRegistered', callback);
  }
}

/**
 * Governance Contract Wrapper
 */
export class GovernanceContract {
  private contract: ethers.Contract;

  constructor(address: string, providerOrSigner: ethers.Provider | ethers.Signer) {
    this.contract = new ethers.Contract(address, GOVERNANCE_ABI, providerOrSigner);
  }

  // Read functions
  async getProposal(proposalId: number): Promise<ProposalInfo> {
    const result = await this.contract.getProposal(proposalId);
    return {
      id: proposalId,
      proposer: result.proposer,
      title: result.title,
      description: result.description,
      forVotes: result.forVotes,
      againstVotes: result.againstVotes,
      abstainVotes: result.abstainVotes,
      state: result.currentState as ProposalState
    };
  }

  async getVotingPower(address: string): Promise<bigint> {
    return this.contract.getVotingPower(address);
  }

  async getReceipt(proposalId: number, voter: string): Promise<VoteReceipt> {
    const result = await this.contract.getReceipt(proposalId, voter);
    return {
      hasVoted: result.hasVoted,
      voteType: result.voteType as VoteType,
      votes: result.votes
    };
  }

  async proposalCount(): Promise<number> {
    return Number(await this.contract.proposalCount());
  }

  // Write functions
  async propose(
    title: string,
    description: string,
    ipfsHash: string,
    targets: string[],
    values: bigint[],
    calldatas: string[]
  ): Promise<ethers.TransactionResponse> {
    return this.contract.propose(title, description, ipfsHash, targets, values, calldatas);
  }

  async castVote(proposalId: number, voteType: VoteType): Promise<ethers.TransactionResponse> {
    return this.contract.castVote(proposalId, voteType);
  }

  async castVoteWithReason(
    proposalId: number,
    voteType: VoteType,
    reason: string
  ): Promise<ethers.TransactionResponse> {
    return this.contract.castVoteWithReason(proposalId, voteType, reason);
  }

  async delegate(delegatee: string): Promise<ethers.TransactionResponse> {
    return this.contract.delegate(delegatee);
  }

  async queue(proposalId: number): Promise<ethers.TransactionResponse> {
    return this.contract.queue(proposalId);
  }

  async execute(proposalId: number, value?: bigint): Promise<ethers.TransactionResponse> {
    return this.contract.execute(proposalId, { value: value || 0n });
  }

  // Event listeners
  onProposalCreated(
    callback: (proposalId: bigint, proposer: string, title: string, startTime: bigint, endTime: bigint) => void
  ): () => void {
    this.contract.on('ProposalCreated', callback);
    return () => this.contract.off('ProposalCreated', callback);
  }

  onVoteCast(
    callback: (voter: string, proposalId: bigint, voteType: number, votes: bigint) => void
  ): () => void {
    this.contract.on('VoteCast', callback);
    return () => this.contract.off('VoteCast', callback);
  }
}

/**
 * Escrow V2 Contract Wrapper
 */
export class EscrowV2Contract {
  private contract: ethers.Contract;

  constructor(address: string, providerOrSigner: ethers.Provider | ethers.Signer) {
    this.contract = new ethers.Contract(address, ESCROW_V2_ABI, providerOrSigner);
  }

  // Read functions
  async getEscrow(jobId: string): Promise<EscrowInfoV2 | null> {
    try {
      const result = await this.contract.getEscrow(jobId);
      if (result.createdAt === 0n) return null;
      
      return {
        jobId: result.jobId,
        payer: result.payer,
        worker: result.worker,
        token: result.token,
        amount: result.amount,
        platformFee: result.platformFee,
        workerDeadline: Number(result.workerDeadline),
        status: result.status as EscrowStatusV2,
        createdAt: Number(result.createdAt),
        completedAt: Number(result.completedAt),
        metadataHash: result.metadataHash
      };
    } catch {
      return null;
    }
  }

  async getDispute(jobId: string): Promise<DisputeInfo | null> {
    try {
      const result = await this.contract.getDispute(jobId);
      if (result.initiatedAt === 0n) return null;
      
      return {
        jobId: result.jobId,
        initiator: result.initiator,
        reason: result.reason,
        initiatedAt: Number(result.initiatedAt),
        resolved: result.resolved,
        winner: result.winner
      };
    } catch {
      return null;
    }
  }

  async canRefund(jobId: string): Promise<boolean> {
    return this.contract.canRefund(jobId);
  }

  async platformFeeRate(): Promise<number> {
    return Number(await this.contract.platformFeeRate());
  }

  // Write functions (Payer)
  async depositNative(jobId: string, metadataHash: string, amount: bigint): Promise<ethers.TransactionResponse> {
    return this.contract.depositNative(jobId, metadataHash, { value: amount });
  }

  async depositToken(
    jobId: string,
    token: string,
    amount: bigint,
    metadataHash: string
  ): Promise<ethers.TransactionResponse> {
    return this.contract.depositToken(jobId, token, amount, metadataHash);
  }

  async assignWorker(jobId: string, worker: string, deadline: number): Promise<ethers.TransactionResponse> {
    return this.contract.assignWorker(jobId, worker, deadline);
  }

  async release(jobId: string): Promise<ethers.TransactionResponse> {
    return this.contract.release(jobId);
  }

  async refund(jobId: string): Promise<ethers.TransactionResponse> {
    return this.contract.refund(jobId);
  }

  // Write functions (Worker)
  async startWork(jobId: string): Promise<ethers.TransactionResponse> {
    return this.contract.startWork(jobId);
  }

  async completeWork(jobId: string): Promise<ethers.TransactionResponse> {
    return this.contract.completeWork(jobId);
  }

  // Write functions (Dispute)
  async initiateDispute(jobId: string, reason: string): Promise<ethers.TransactionResponse> {
    return this.contract.initiateDispute(jobId, reason);
  }

  // Event listeners
  onEscrowCreated(
    callback: (jobId: string, payer: string, amount: bigint, token: string) => void
  ): () => void {
    this.contract.on('EscrowCreated', callback);
    return () => this.contract.off('EscrowCreated', callback);
  }

  onWorkStarted(callback: (jobId: string) => void): () => void {
    this.contract.on('WorkStarted', callback);
    return () => this.contract.off('WorkStarted', callback);
  }

  onEscrowReleased(
    callback: (jobId: string, worker: string, amount: bigint, fee: bigint) => void
  ): () => void {
    this.contract.on('EscrowReleased', callback);
    return () => this.contract.off('EscrowReleased', callback);
  }

  onDisputeInitiated(
    callback: (jobId: string, initiator: string, reason: string) => void
  ): () => void {
    this.contract.on('DisputeInitiated', callback);
    return () => this.contract.off('DisputeInitiated', callback);
  }
}
