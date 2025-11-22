/**
 * Integration Tests: SDK Client ↔ Core RPC Node
 * 
 * Tests the connection between TypeScript SDK and axionax Core RPC endpoint
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { AxionaxClient } from '../../src/index';

describe('SDK ↔ Core RPC Integration', () => {
  let client: AxionaxClient;
  const RPC_URL = process.env.RPC_URL || 'https://rpc.axionax.org';
  const CHAIN_ID = parseInt(process.env.CHAIN_ID || '1001');

  beforeAll(() => {
    client = new AxionaxClient({
      rpcUrl: RPC_URL,
      chainId: CHAIN_ID,
      timeout: 10000
    });
  });

  afterAll(async () => {
    // Cleanup connections
    await client.disconnect?.();
  });

  describe('Node Health & Status', () => {
    it('should connect to RPC endpoint', async () => {
      const isConnected = await client.ping();
      expect(isConnected).toBe(true);
    }, 15000);

    it('should get node status', async () => {
      const status = await client.getStatus();
      
      expect(status).toBeDefined();
      expect(status.chainId).toBe(CHAIN_ID);
      expect(status.nodeInfo).toBeDefined();
      expect(status.syncInfo).toBeDefined();
    }, 10000);

    it('should get network info', async () => {
      const networkInfo = await client.getNetworkInfo();
      
      expect(networkInfo).toBeDefined();
      expect(networkInfo.peers).toBeDefined();
      expect(Array.isArray(networkInfo.peers)).toBe(true);
    }, 10000);

    it('should verify chain ID matches', async () => {
      const status = await client.getStatus();
      expect(status.chainId).toBe(CHAIN_ID);
    });
  });

  describe('Block Operations', () => {
    it('should get latest block', async () => {
      const block = await client.getLatestBlock();
      
      expect(block).toBeDefined();
      expect(block.height).toBeGreaterThan(0);
      expect(block.hash).toBeDefined();
      expect(block.timestamp).toBeDefined();
      expect(block.transactions).toBeDefined();
    }, 10000);

    it('should get block by height', async () => {
      const latestBlock = await client.getLatestBlock();
      const height = latestBlock.height - 10; // Get block 10 blocks ago
      
      const block = await client.getBlockByNumber(height);
      
      expect(block).toBeDefined();
      expect(block.height).toBe(height);
      expect(block.hash).toBeDefined();
    }, 10000);

    it('should get block by hash', async () => {
      const latestBlock = await client.getLatestBlock();
      const blockHash = latestBlock.hash;
      
      const block = await client.getBlockByHash(blockHash);
      
      expect(block).toBeDefined();
      expect(block.hash).toBe(blockHash);
      expect(block.height).toBe(latestBlock.height);
    }, 10000);

    it('should get multiple blocks in sequence', async () => {
      const latestBlock = await client.getLatestBlock();
      const startHeight = latestBlock.height - 5;
      
      const blocks = await Promise.all([
        client.getBlockByNumber(startHeight),
        client.getBlockByNumber(startHeight + 1),
        client.getBlockByNumber(startHeight + 2)
      ]);
      
      expect(blocks[0].height).toBe(startHeight);
      expect(blocks[1].height).toBe(startHeight + 1);
      expect(blocks[2].height).toBe(startHeight + 2);
    }, 15000);
  });

  describe('Transaction Queries', () => {
    it('should handle non-existent transaction gracefully', async () => {
      const fakeHash = '0x' + '0'.repeat(64);
      
      const tx = await client.getTransaction(fakeHash);
      expect(tx).toBeNull();
    }, 10000);

    it('should get transaction from recent block', async () => {
      const latestBlock = await client.getLatestBlock();
      
      if (latestBlock.transactions && latestBlock.transactions.length > 0) {
        const txHash = latestBlock.transactions[0].hash;
        const tx = await client.getTransaction(txHash);
        
        expect(tx).toBeDefined();
        expect(tx?.hash).toBe(txHash);
        expect(tx?.blockNumber).toBe(latestBlock.height);
      } else {
        console.log('No transactions in latest block, skipping test');
      }
    }, 10000);
  });

  describe('Account & Balance Queries', () => {
    it('should query zero balance for new address', async () => {
      const testAddress = '0x' + '0'.repeat(40); // Zero address
      const balance = await client.getBalance(testAddress);
      
      expect(balance).toBeDefined();
      expect(typeof balance).toBe('bigint');
    }, 10000);

    it('should get account nonce', async () => {
      const testAddress = '0x' + '0'.repeat(40);
      const nonce = await client.getTransactionCount(testAddress);
      
      expect(typeof nonce).toBe('number');
      expect(nonce).toBeGreaterThanOrEqual(0);
    }, 10000);
  });

  describe('Gas Estimation', () => {
    it('should estimate gas for simple transfer', async () => {
      const tx = {
        from: '0x' + '1'.repeat(40),
        to: '0x' + '2'.repeat(40),
        value: '1000000000000000000', // 1 AXX
        data: '0x'
      };
      
      const gasEstimate = await client.estimateGas(tx);
      
      expect(gasEstimate).toBeDefined();
      expect(typeof gasEstimate).toBe('bigint');
      expect(gasEstimate).toBeGreaterThan(0n);
    }, 10000);

    it('should get current gas price', async () => {
      const gasPrice = await client.getGasPrice();
      
      expect(gasPrice).toBeDefined();
      expect(typeof gasPrice).toBe('bigint');
      expect(gasPrice).toBeGreaterThan(0n);
    }, 10000);
  });

  describe('PoPC Consensus Queries', () => {
    it('should get validator set', async () => {
      const validators = await client.getValidators();
      
      expect(validators).toBeDefined();
      expect(Array.isArray(validators)).toBe(true);
      
      if (validators.length > 0) {
        const validator = validators[0];
        expect(validator.address).toBeDefined();
        expect(validator.votingPower).toBeDefined();
        expect(typeof validator.votingPower).toBe('bigint');
      }
    }, 10000);

    it('should get PoPC proof for recent block', async () => {
      const latestBlock = await client.getLatestBlock();
      const proof = await client.getPoPCProof(latestBlock.height);
      
      if (proof) {
        expect(proof.blockHeight).toBe(latestBlock.height);
        expect(proof.validators).toBeDefined();
        expect(proof.signatures).toBeDefined();
      }
    }, 10000);
  });

  describe('Error Handling', () => {
    it('should handle invalid block number', async () => {
      await expect(
        client.getBlockByNumber(999999999)
      ).rejects.toThrow();
    });

    it('should handle invalid address format', async () => {
      await expect(
        client.getBalance('invalid-address')
      ).rejects.toThrow();
    });

    it('should handle network timeout gracefully', async () => {
      const slowClient = new AxionaxClient({
        rpcUrl: RPC_URL,
        chainId: CHAIN_ID,
        timeout: 1 // 1ms timeout to force failure
      });

      await expect(
        slowClient.getLatestBlock()
      ).rejects.toThrow();
    });
  });

  describe('Performance & Throughput', () => {
    it('should handle concurrent requests', async () => {
      const promises = Array(10).fill(null).map(() => 
        client.getLatestBlock()
      );
      
      const blocks = await Promise.all(promises);
      
      expect(blocks.length).toBe(10);
      blocks.forEach(block => {
        expect(block).toBeDefined();
        expect(block.height).toBeGreaterThan(0);
      });
    }, 20000);

    it('should complete request within reasonable time', async () => {
      const startTime = Date.now();
      await client.getLatestBlock();
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});
