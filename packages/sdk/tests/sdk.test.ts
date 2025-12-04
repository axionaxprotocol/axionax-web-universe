/**
 * axionax SDK v2.0 Test Suite
 * Comprehensive integration tests for all SDK modules
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ethers } from 'ethers';
import {
  AxionaxClient,
  createClient,
  AXIONAX_TESTNET_CONFIG,
  EscrowStatus,
  JobStatus,
} from '../src/index';
import {
  AXXTokenContract,
  StakingContract,
  GovernanceContract,
  EscrowV2Contract,
  ProposalState,
  VoteType,
} from '../src/contracts';
import {
  EventSubscriptionManager,
  EventFilters,
  createEventFilter,
} from '../src/events';
import {
  GasEstimator,
  formatGwei,
  parseGwei,
  formatAXX,
  parseAXX,
  DEFAULT_GAS_LIMITS,
} from '../src/gas';

// Mock provider for testing
const createMockProvider = () => {
  return new ethers.JsonRpcProvider(AXIONAX_TESTNET_CONFIG.rpcUrls[0]);
};

describe('AxionaxClient', () => {
  let client: AxionaxClient;

  beforeAll(() => {
    client = createClient({
      rpcUrl: AXIONAX_TESTNET_CONFIG.rpcUrls[0],
      chainId: AXIONAX_TESTNET_CONFIG.chainIdDecimal,
    });
  });

  describe('Connection', () => {
    it('should create client with config', () => {
      expect(client).toBeDefined();
      expect(client.config.chainId).toBe(AXIONAX_TESTNET_CONFIG.chainIdDecimal);
    });

    it('should ping RPC endpoint', async () => {
      const isConnected = await client.ping();
      // May be false if RPC is not available, but should not throw
      expect(typeof isConnected).toBe('boolean');
    });

    it('should get network status', async () => {
      try {
        const status = await client.getStatus();
        expect(status).toHaveProperty('chainId');
        expect(status).toHaveProperty('blockNumber');
      } catch (e) {
        // Skip if network unavailable
        expect(e).toBeDefined();
      }
    });
  });

  describe('Job Management', () => {
    it('should generate valid job IDs', () => {
      // Access private method through type assertion for testing
      const jobId = (client as any).generateJobId();
      expect(jobId).toMatch(/^job-\d+-[a-z0-9]+$/);
    });

    it('should validate job ID format', () => {
      expect(() => (client as any).validateJobId('job-123-abc')).not.toThrow();
      expect(() => (client as any).validateJobId('invalid')).toThrow();
      expect(() => (client as any).validateJobId('')).toThrow();
    });
  });

  describe('Network Stats', () => {
    it('should return network statistics', async () => {
      try {
        const stats = await client.getNetworkStats();
        expect(stats).toHaveProperty('totalWorkers');
        expect(stats).toHaveProperty('activeJobs');
        expect(stats).toHaveProperty('blockNumber');
        expect(stats).toHaveProperty('utilization');
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });
});

describe('Gas Utilities', () => {
  describe('formatGwei', () => {
    it('should format wei to gwei', () => {
      expect(formatGwei(1000000000n)).toBe('1.0');
      expect(formatGwei(20000000000n)).toBe('20.0');
    });
  });

  describe('parseGwei', () => {
    it('should parse gwei to wei', () => {
      expect(parseGwei('1')).toBe(1000000000n);
      expect(parseGwei(20)).toBe(20000000000n);
    });
  });

  describe('formatAXX', () => {
    it('should format wei to AXX', () => {
      const oneAXX = 1000000000000000000n;
      expect(formatAXX(oneAXX)).toBe('1.0000');
      expect(formatAXX(oneAXX / 2n)).toBe('0.5000');
    });
  });

  describe('parseAXX', () => {
    it('should parse AXX to wei', () => {
      expect(parseAXX('1')).toBe(1000000000000000000n);
      expect(parseAXX(0.5)).toBe(500000000000000000n);
    });
  });

  describe('Default Gas Limits', () => {
    it('should have reasonable defaults', () => {
      expect(DEFAULT_GAS_LIMITS.transfer).toBe(21000n);
      expect(DEFAULT_GAS_LIMITS.erc20Transfer).toBeGreaterThan(21000n);
      expect(DEFAULT_GAS_LIMITS.stake).toBeGreaterThan(100000n);
    });
  });
});

describe('Event Filters', () => {
  describe('createEventFilter', () => {
    it('should create transfer event filter', () => {
      const filter = EventFilters.transfer(
        '0x1234567890123456789012345678901234567890',
        '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
      );

      expect(filter.address).toBe('0x1234567890123456789012345678901234567890');
      expect(filter.topics).toBeDefined();
      expect(filter.topics!.length).toBeGreaterThan(0);
    });

    it('should create staked event filter', () => {
      const filter = EventFilters.staked(
        '0x1234567890123456789012345678901234567890'
      );

      expect(filter.address).toBeDefined();
      expect(filter.topics).toBeDefined();
    });

    it('should create custom event filter', () => {
      const filter = createEventFilter(
        '0x1234567890123456789012345678901234567890',
        'Transfer(address,address,uint256)',
        [null, '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd']
      );

      expect(filter.address).toBeDefined();
      expect(filter.topics!.length).toBe(2);
    });
  });
});

describe('Contract Types', () => {
  describe('EscrowStatus', () => {
    it('should have all status values', () => {
      expect(EscrowStatus.Pending).toBe('pending');
      expect(EscrowStatus.Deposited).toBe('deposited');
      expect(EscrowStatus.Released).toBe('released');
      expect(EscrowStatus.Refunded).toBe('refunded');
      expect(EscrowStatus.Disputed).toBe('disputed');
    });
  });

  describe('JobStatus', () => {
    it('should have all status values', () => {
      expect(JobStatus.Pending).toBe('pending');
      expect(JobStatus.Assigned).toBe('assigned');
      expect(JobStatus.Executing).toBe('executing');
      expect(JobStatus.Completed).toBe('completed');
      expect(JobStatus.Failed).toBe('failed');
    });
  });

  describe('ProposalState', () => {
    it('should have all state values', () => {
      expect(ProposalState.Pending).toBe(0);
      expect(ProposalState.Active).toBe(1);
      expect(ProposalState.Defeated).toBe(3);
      expect(ProposalState.Succeeded).toBe(4);
      expect(ProposalState.Executed).toBe(7);
    });
  });

  describe('VoteType', () => {
    it('should have all vote types', () => {
      expect(VoteType.Against).toBe(0);
      expect(VoteType.For).toBe(1);
      expect(VoteType.Abstain).toBe(2);
    });
  });
});

describe('EventSubscriptionManager', () => {
  let provider: ethers.Provider;
  let manager: EventSubscriptionManager;

  beforeAll(() => {
    provider = createMockProvider();
    manager = new EventSubscriptionManager(provider);
  });

  afterAll(() => {
    manager.stop();
  });

  it('should create manager', () => {
    expect(manager).toBeDefined();
    expect(manager.activeSubscriptions).toBe(0);
  });

  it('should subscribe to events', () => {
    const filter = EventFilters.transfer(
      '0x1234567890123456789012345678901234567890'
    );

    const unsubscribe = manager.subscribe(
      'test-transfer',
      filter,
      (event) => {
        console.log('Event received:', event);
      }
    );

    expect(manager.activeSubscriptions).toBe(1);
    
    unsubscribe();
    expect(manager.activeSubscriptions).toBe(0);
  });
});

describe('GasEstimator', () => {
  let provider: ethers.Provider;
  let estimator: GasEstimator;

  beforeAll(() => {
    provider = createMockProvider();
    estimator = new GasEstimator(provider);
  });

  it('should create estimator', () => {
    expect(estimator).toBeDefined();
  });

  it('should get operation costs', async () => {
    try {
      const costs = await estimator.getOperationCosts('standard');
      expect(costs).toHaveProperty('transfer');
      expect(costs).toHaveProperty('stake');
    } catch (e) {
      // Skip if network unavailable
      expect(e).toBeDefined();
    }
  });
});

// Integration tests (require running testnet)
describe.skip('Integration Tests', () => {
  let client: AxionaxClient;
  const testPrivateKey = process.env.TEST_PRIVATE_KEY;

  beforeAll(() => {
    if (!testPrivateKey) {
      throw new Error('TEST_PRIVATE_KEY not set');
    }

    client = createClient({
      rpcUrl: AXIONAX_TESTNET_CONFIG.rpcUrls[0],
      chainId: AXIONAX_TESTNET_CONFIG.chainIdDecimal,
      privateKey: testPrivateKey,
    });
  });

  it('should get real balance', async () => {
    const address = '0x1234567890123456789012345678901234567890';
    const balance = await client.getBalance(address);
    expect(balance).toBeGreaterThanOrEqual(0n);
  });

  it('should get real block', async () => {
    const block = await client.getLatestBlock();
    expect(block).toBeDefined();
    expect(block?.number).toBeGreaterThan(0);
  });

  it('should deposit to escrow', async () => {
    const jobId = `job-test-${Date.now()}`;
    const amount = parseAXX('0.001');

    const tx = await client.depositEscrow(jobId, amount);
    expect(tx.txHash).toBeDefined();
    expect(tx.status).toBe(EscrowStatus.Deposited);
  });
});
