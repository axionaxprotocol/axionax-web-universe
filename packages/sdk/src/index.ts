/**
 * axionax SDK - TypeScript Client
 *
 * Official TypeScript SDK for interacting with axionax protocol
 */

import { ethers } from 'ethers';

/**
 * SDK Error classes for better error handling
 */
export class AxionaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AxionaxError';
  }
}

export class SignerRequiredError extends AxionaxError {
  constructor(operation: string) {
    super(`Signer required to ${operation}`);
    this.name = 'SignerRequiredError';
  }
}

export class InvalidJobIdError extends AxionaxError {
  constructor(jobId: string) {
    super(`Invalid job ID: ${jobId}`);
    this.name = 'InvalidJobIdError';
  }
}

export class NetworkError extends AxionaxError {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Job specifications for compute requests
 */
export interface JobSpecs {
  gpu: string;
  vram: number;
  framework?: string;
  region?: string;
  tags?: string[];
}

/**
 * SLA (Service Level Agreement) parameters
 */
export interface SLA {
  maxLatency: number;  // in seconds
  maxRetries: number;
  timeout: number;     // in seconds
  requiredUptime: number;  // 0.0 to 1.0
}

/**
 * Job status enum
 */
export enum JobStatus {
  Pending = 'pending',
  Assigned = 'assigned',
  Executing = 'executing',
  Committed = 'committed',
  Validating = 'validating',
  Completed = 'completed',
  Failed = 'failed',
  Slashed = 'slashed',
}

/**
 * Escrow status enum
 */
export enum EscrowStatus {
  Pending = 'pending',
  Deposited = 'deposited',
  Released = 'released',
  Refunded = 'refunded',
  Disputed = 'disputed',
}

/**
 * Escrow transaction information
 */
export interface EscrowTransaction {
  jobId: string;
  amount: bigint;
  status: EscrowStatus;
  payer: string;
  payee?: string;
  createdAt: Date;
  updatedAt: Date;
  txHash?: string;
}

/**
 * Job information
 */
export interface Job {
  id: string;
  client: string;
  worker?: string;
  specs: JobSpecs;
  sla: SLA;
  price: bigint;
  status: JobStatus;
  submittedAt: Date;
  completedAt?: Date;
  outputRoot?: string;
}

/**
 * Worker specifications
 */
export interface WorkerSpecs {
  gpus: Array<{
    model: string;
    vram: number;
    count: number;
  }>;
  cpuCores: number;
  ram: number;
  storage: number;
  bandwidth: number;
  region: string;
}

/**
 * Worker information
 */
export interface Worker {
  address: string;
  specs: WorkerSpecs;
  reputation: number;
  stake: bigint;
  status: 'active' | 'inactive' | 'suspended' | 'slashed';
  registeredAt: Date;
}

/**
 * Network statistics
 */
export interface NetworkStats {
  totalWorkers: number;
  activeJobs: number;
  blockNumber: number;
  utilization: number;
}

/**
 * Axionax client configuration
 */
export interface AxionaxConfig {
  rpcUrl: string;
  chainId: number;
  privateKey?: string;
  provider?: ethers.Provider;
}

/**
 * Main Axionax SDK Client
 */
export class AxionaxClient {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;
  private _config: AxionaxConfig;

  constructor(config: AxionaxConfig) {
    this._config = config;
    this.provider = this.initializeProvider(config);
    this.signer = this.initializeSigner(config);
  }

  get config(): AxionaxConfig {
    return this._config;
  }

  /**
   * Initialize provider from config
   */
  private initializeProvider(config: AxionaxConfig): ethers.Provider {
    if (config.provider) {
      return config.provider;
    }
    return new ethers.JsonRpcProvider(config.rpcUrl);
  }

  /**
   * Initialize signer from config
   */
  private initializeSigner(config: AxionaxConfig): ethers.Signer | undefined {
    if (config.privateKey) {
      return new ethers.Wallet(config.privateKey, this.provider);
    }
    return undefined;
  }

  /**
   * Ensure signer is available for operations that require it
   */
  private requireSigner(operation: string): ethers.Signer {
    if (!this.signer) {
      throw new SignerRequiredError(operation);
    }
    return this.signer;
  }

  /**
   * Submit a compute job
   */
  async submitJob(specs: JobSpecs, sla: SLA): Promise<Job> {
    const signer = this.requireSigner('submit jobs');

    // TODO: Implement actual transaction
    const jobId = this.generateJobId();

    const job: Job = {
      id: jobId,
      client: await signer.getAddress(),
      specs,
      sla,
      price: BigInt(0), // TODO: Calculate from PPC
      status: JobStatus.Pending,
      submittedAt: new Date(),
    };

    return job;
  }

  /**
   * Deposit funds into escrow for a job
   */
  async depositEscrow(jobId: string, amount: bigint): Promise<EscrowTransaction> {
    const signer = this.requireSigner('deposit escrow');
    this.validateJobId(jobId);

    // TODO: Implement actual smart contract deposit call
    
    return {
      jobId,
      amount,
      status: EscrowStatus.Deposited,
      payer: await signer.getAddress(),
      createdAt: new Date(),
      updatedAt: new Date(),
      txHash: '0xmock_deposit_tx_hash_' + Date.now()
    };
  }

  /**
   * Release escrow funds to worker
   */
  async releaseEscrow(jobId: string): Promise<EscrowTransaction> {
    const signer = this.requireSigner('release escrow');
    this.validateJobId(jobId);

    // TODO: Implement actual smart contract release call

    return {
      jobId,
      amount: BigInt(0), // In real scenario, fetch from contract
      status: EscrowStatus.Released,
      payer: await signer.getAddress(),
      payee: '0xmock_worker_address', // In real scenario, this would be the assigned worker
      createdAt: new Date(), // Original creation date would be fetched
      updatedAt: new Date(),
      txHash: '0xmock_release_tx_hash_' + Date.now()
    };
  }

  /**
   * Refund escrow funds to payer
   */
  async refundEscrow(jobId: string): Promise<EscrowTransaction> {
    const signer = this.requireSigner('refund escrow');
    this.validateJobId(jobId);

    // TODO: Implement actual smart contract refund call

    return {
      jobId,
      amount: BigInt(0), // In real scenario, fetch from contract
      status: EscrowStatus.Refunded,
      payer: await signer.getAddress(),
      createdAt: new Date(), // Original creation date would be fetched
      updatedAt: new Date(),
      txHash: '0xmock_refund_tx_hash_' + Date.now()
    };
  }

  /**
   * Get escrow status
   */
  async getEscrowStatus(jobId: string): Promise<EscrowTransaction | null> {
    this.validateJobId(jobId);
    
    // TODO: Implement actual smart contract call to get status
    
    // Return null to simulate that no escrow has been created yet
    return null;
  }

  /**
   * Get job status
   */
  async getJob(jobId: string): Promise<Job | null> {
    this.validateJobId(jobId);
    // TODO: Implement RPC call
    return null;
  }

  /**
   * List available workers
   */
  async listWorkers(_filter?: Partial<WorkerSpecs>): Promise<Worker[]> {
    // TODO: Implement RPC call with filtering
    return [];
  }

  /**
   * Register as a worker
   */
  async registerWorker(_specs: WorkerSpecs, _stake: bigint): Promise<string> {
    const signer = this.requireSigner('register as worker');
    // TODO: Implement actual transaction
    return await signer.getAddress();
  }

  /**
   * Get current price from PPC
   */
  async getCurrentPrice(_jobClass: string = 'standard'): Promise<bigint> {
    // TODO: Implement RPC call to PPC
    return BigInt(1000000000000000); // 0.001 AXX
  }

  /**
   * Get network statistics
   */
  async getNetworkStats(): Promise<NetworkStats> {
    try {
      const blockNumber = await this.provider.getBlockNumber();

      return {
        totalWorkers: 0,  // TODO: Implement
        activeJobs: 0,    // TODO: Implement
        blockNumber,
        utilization: 0,   // TODO: Implement
      };
    } catch (error) {
      throw new NetworkError(
        'Failed to fetch network stats',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Subscribe to job status updates
   */
  onJobUpdate(jobId: string, _callback: (job: Job) => void): () => void {
    this.validateJobId(jobId);
    // TODO: Implement WebSocket subscription
    return () => {};
  }

  /**
   * Validate job ID format
   */
  private validateJobId(jobId: string): void {
    if (!jobId || !jobId.startsWith('job-')) {
      throw new InvalidJobIdError(jobId);
    }
  }

  /**
   * Generate unique job ID
   */
  private generateJobId(): string {
    return `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check connection to RPC endpoint
   */
  async ping(): Promise<boolean> {
    try {
      await this.provider.getNetwork();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get node status
   */
  async getStatus(): Promise<{ chainId: number; blockNumber: number }> {
    const network = await this.provider.getNetwork();
    const blockNumber = await this.provider.getBlockNumber();
    return {
      chainId: Number(network.chainId),
      blockNumber,
    };
  }

  /**
   * Get network info
   */
  async getNetworkInfo(): Promise<{
    chainId: number;
    name: string;
    peers: number;
  }> {
    const network = await this.provider.getNetwork();
    return {
      chainId: Number(network.chainId),
      name: network.name,
      peers: 0, // Mocked as JsonRpcProvider doesn't expose peers directly
    };
  }

  /**
   * Get latest block
   */
  async getLatestBlock(): Promise<ethers.Block | null> {
    return await this.provider.getBlock('latest');
  }

  /**
   * Get block by number
   */
  async getBlockByNumber(blockNumber: number): Promise<ethers.Block | null> {
    if (blockNumber < 0 || blockNumber > 1000000000) {
      throw new Error('Invalid block number');
    }
    return await this.provider.getBlock(blockNumber);
  }

  /**
   * Get block by hash
   */
  async getBlockByHash(blockHash: string): Promise<ethers.Block | null> {
    return await this.provider.getBlock(blockHash);
  }

  /**
   * Get transaction
   */
  async getTransaction(txHash: string): Promise<ethers.TransactionResponse | null> {
    return await this.provider.getTransaction(txHash);
  }

  /**
   * Get balance
   */
  async getBalance(address: string): Promise<bigint> {
    if (!ethers.isAddress(address)) {
      throw new Error('Invalid address format');
    }
    return await this.provider.getBalance(address);
  }

  /**
   * Get transaction count (nonce)
   */
  async getTransactionCount(address: string): Promise<number> {
    return await this.provider.getTransactionCount(address);
  }

  /**
   * Estimate gas
   */
  async estimateGas(tx: ethers.TransactionRequest): Promise<bigint> {
    return await this.provider.estimateGas(tx);
  }

  /**
   * Get gas price
   */
  async getGasPrice(): Promise<bigint> {
    const feeData = await this.provider.getFeeData();
    return feeData.gasPrice ?? BigInt(0);
  }

  /**
   * Get validator set
   */
  async getValidators(): Promise<string[]> {
    // TODO: Implement actual validator retrieval from contract
    return ['0x123...']; // Mock
  }

  /**
   * Get PoPC proof
   */
  async getPoPCProof(blockHeight: number): Promise<{ height: number; proof: string } | null> {
    // TODO: Implement PoPC proof retrieval
    if (blockHeight < 0) return null;
    return { height: blockHeight, proof: '0x...' };
  }
}

/**
 * Helper function to create Axionax client
 */
export function createClient(config: AxionaxConfig): AxionaxClient {
  return new AxionaxClient(config);
}
