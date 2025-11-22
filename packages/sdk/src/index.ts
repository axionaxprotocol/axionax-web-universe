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
  private config: AxionaxConfig;

  constructor(config: AxionaxConfig) {
    this.config = config;
    this.provider = this.initializeProvider(config);
    this.signer = this.initializeSigner(config);
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
  async listWorkers(filter?: Partial<WorkerSpecs>): Promise<Worker[]> {
    // TODO: Implement RPC call with filtering
    return [];
  }

  /**
   * Register as a worker
   */
  async registerWorker(specs: WorkerSpecs, stake: bigint): Promise<string> {
    const signer = this.requireSigner('register as worker');
    // TODO: Implement actual transaction
    return await signer.getAddress();
  }

  /**
   * Get current price from PPC
   */
  async getCurrentPrice(jobClass: string = 'standard'): Promise<bigint> {
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
  onJobUpdate(jobId: string, callback: (job: Job) => void): () => void {
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
}

/**
 * Helper function to create Axionax client
 */
export function createClient(config: AxionaxConfig): AxionaxClient {
  return new AxionaxClient(config);
}
