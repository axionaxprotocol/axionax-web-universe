import { describe, it, expect, beforeAll } from '@jest/globals';
import { AxionaxClient } from '../src';

describe('Axionax SDK Integration Tests', () => {
  let client: AxionaxClient;
  const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';

  beforeEach(() => {
    client = new AxionaxClient(RPC_URL);
  });

  describe('RPC Connection', () => {
    it('should connect to the node', async () => {
      const status = await client.getStatus();
      expect(status).toBeDefined();
      expect(status.chainId).toBe('axionax-testnet-1');
    });

    it('should get latest block', async () => {
      const block = await client.getLatestBlock();
      expect(block).toBeDefined();
      expect(block.height).toBeGreaterThan(0);
    });
  });

  describe('Account Operations', () => {
    it('should query account balance', async () => {
      const testAddress = 'axionax1test...';
      const balance = await client.getBalance(testAddress);
      expect(balance).toBeDefined();
      expect(typeof balance).toBe('bigint');
    });
  });

  describe('Transaction Submission', () => {
    it('should broadcast a transaction', async () => {
      // Mock transaction for testing
      const tx = {
        from: 'axionax1test...',
        to: 'axionax1recipient...',
        amount: BigInt(1000),
        gas: BigInt(100000),
      };

      // Note: This test requires a funded test account
      // Skip in CI unless test environment is configured
      if (process.env.CI && !process.env.TEST_PRIVATE_KEY) {
        console.log('Skipping transaction test in CI');
        return;
      }

      const result = await client.sendTransaction(tx);
      expect(result.txHash).toBeDefined();
      expect(result.txHash.length).toBe(64);
    });
  });
});
