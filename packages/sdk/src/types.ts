/**
 * Type definitions for Axionax SDK
 */

// Re-export types from blockchain-utils
export type {
    NetworkConfig,
    TokenInfo,
    TokenBalance,
    TransactionInfo,
    TransactionType,
    AddressInfo,
    BlockInfo,
    ValidatorInfo,
    StakingPosition,
    Proposal,
    ProposalStatus,
    ApiResponse,
    PaginatedResponse,
} from '@axionax/blockchain-utils';

// ============================================
// Escrow Types
// ============================================

export enum EscrowStatus {
    Pending = 'pending',
    Deposited = 'deposited',
    Released = 'released',
    Refunded = 'refunded',
    Disputed = 'disputed',
}

export interface EscrowTransaction {
    id: string;
    jobId: string;
    buyer: string;
    seller: string;
    amount: bigint;
    status: EscrowStatus;
    txHash?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// Job Types
// ============================================

export interface Job {
    id: string;
    name: string;
    description: string;
    requester: string;
    worker?: string;
    status: JobStatus;
    payment: bigint;
    createdAt: Date;
    completedAt?: Date;
}

export enum JobStatus {
    Open = 'open',
    Assigned = 'assigned',
    InProgress = 'in_progress',
    Completed = 'completed',
    Cancelled = 'cancelled',
}

// ============================================
// Worker Types
// ============================================

export interface Worker {
    id: string;
    name: string;
    address: string;
    specs: string;
    pricePerHour: number;
    isActive: boolean;
    reputation: number;
}

// ============================================
// Client Types
// ============================================

export interface ClientConfig {
    rpcUrl: string;
    chainId: number;
    rpcUrls?: string[];
    chainIdDecimal?: number;
    provider?: unknown;
    signer?: unknown;
}

export interface AxionaxClient {
    config: ClientConfig;

    // Escrow methods
    getEscrowStatus(jobId: string): Promise<EscrowTransaction | null>;
    depositEscrow(jobId: string, amount: bigint): Promise<EscrowTransaction>;
    releaseEscrow(jobId: string): Promise<EscrowTransaction>;
    refundEscrow(jobId: string): Promise<EscrowTransaction>;

    // Job methods
    getJobs(): Promise<Job[]>;
    getJob(jobId: string): Promise<Job | null>;
    createJob(job: Partial<Job>): Promise<Job>;

    // Worker methods
    getWorkers(): Promise<Worker[]>;
    selectWorker(workerId: string): Promise<Worker>;

    // Wallet methods
    getBalance(address: string): Promise<bigint>;
    getAddress(): Promise<string | null>;
}

// ============================================
// Wallet Types
// ============================================

export interface Wallet {
    address: string;
    privateKey?: string;
    mnemonic?: string;
}

// ============================================
// Transaction Types
// ============================================

export interface TransactionRequest {
    to: string;
    value?: bigint;
    data?: string;
    gasLimit?: bigint;
    gasPrice?: bigint;
}

export interface TransactionResponse {
    hash: string;
    wait(): Promise<TransactionReceipt>;
}

export interface TransactionReceipt {
    hash: string;
    blockNumber: number;
    status: 'success' | 'failed';
    gasUsed: bigint;
}
