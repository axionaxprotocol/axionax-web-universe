/**
 * Integration Tests: Contract Interactions
 * 
 * Tests smart contract deployment and interaction through SDK
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import { AxionaxClient, Wallet, Contract } from '../../src';

describe('SDK ↔ Contract Integration', () => {
  let client: AxionaxClient;
  let wallet: Wallet;
  
  const RPC_URL = process.env.RPC_URL || 'https://rpc.axionax.org';
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY;

  // Simple ERC20-like token ABI
  const TOKEN_ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint256 value)'
  ];

  beforeAll(() => {
    client = new AxionaxClient({ rpcUrl: RPC_URL, chainId: 1001 });
    
    if (TEST_PRIVATE_KEY) {
      wallet = new Wallet(TEST_PRIVATE_KEY, client);
    }
  });

  describe('Contract Read Operations', () => {
    it('should read contract state (no wallet required)', async () => {
      // Skip if no test contract deployed
      const testContractAddress = process.env.TEST_CONTRACT_ADDRESS;
      if (!testContractAddress) {
        console.log('No test contract configured, skipping');
        return;
      }

      const contract = new Contract(testContractAddress, TOKEN_ABI, client);
      
      const name = await contract.name();
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    }, 10000);

    it('should query multiple contract methods concurrently', async () => {
      const testContractAddress = process.env.TEST_CONTRACT_ADDRESS;
      if (!testContractAddress) return;

      const contract = new Contract(testContractAddress, TOKEN_ABI, client);
      
      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals()
      ]);
      
      expect(name).toBeDefined();
      expect(symbol).toBeDefined();
      expect(decimals).toBeGreaterThanOrEqual(0);
    }, 15000);
  });

  describe('Contract Write Operations', () => {
    it('should estimate gas for contract call', async () => {
      if (!TEST_PRIVATE_KEY || !process.env.TEST_CONTRACT_ADDRESS) {
        console.log('Wallet not configured, skipping write test');
        return;
      }

      const contract = new Contract(
        process.env.TEST_CONTRACT_ADDRESS!,
        TOKEN_ABI,
        wallet
      );
      
      const recipientAddress = '0x' + '0'.repeat(40);
      const amount = '1000';
      
      const gasEstimate = await contract.estimateGas.transfer(
        recipientAddress,
        amount
      );
      
      expect(gasEstimate).toBeDefined();
      expect(typeof gasEstimate).toBe('bigint');
    }, 10000);

    it('should send contract transaction (requires funded wallet)', async () => {
      if (!TEST_PRIVATE_KEY || !process.env.TEST_CONTRACT_ADDRESS) {
        console.log('Wallet not configured, skipping');
        return;
      }

      const contract = new Contract(
        process.env.TEST_CONTRACT_ADDRESS!,
        TOKEN_ABI,
        wallet
      );
      
      const recipientAddress = wallet.address; // Send to self
      const amount = '1'; // Minimal amount
      
      const tx = await contract.transfer(recipientAddress, amount);
      
      expect(tx.hash).toBeDefined();
      expect(tx.hash.length).toBe(66); // 0x + 64 chars
      
      // Wait for confirmation
      const receipt = await tx.wait();
      expect(receipt.status).toBe(1); // Success
    }, 30000);
  });

  describe('Contract Events', () => {
    it('should listen to contract events', async () => {
      const testContractAddress = process.env.TEST_CONTRACT_ADDRESS;
      if (!testContractAddress) return;

      const contract = new Contract(testContractAddress, TOKEN_ABI, client);
      
      // Get past events
      const filter = contract.filters.Transfer();
      const events = await contract.queryFilter(filter, -100); // Last 100 blocks
      
      expect(Array.isArray(events)).toBe(true);
      
      if (events.length > 0) {
        const event = events[0];
        expect(event.args).toBeDefined();
        expect(event.blockNumber).toBeGreaterThan(0);
      }
    }, 15000);
  });

  describe('Multi-Contract Integration', () => {
    it('should interact with multiple contracts', async () => {
      // Test interaction between multiple contracts
      // e.g., Token approval + DEX swap
      
      if (!process.env.TEST_CONTRACT_1 || !process.env.TEST_CONTRACT_2) {
        console.log('Multiple contracts not configured, skipping');
        return;
      }

      const contract1 = new Contract(
        process.env.TEST_CONTRACT_1,
        TOKEN_ABI,
        client
      );
      
      const contract2 = new Contract(
        process.env.TEST_CONTRACT_2,
        TOKEN_ABI,
        client
      );
      
      const [balance1, balance2] = await Promise.all([
        contract1.balanceOf(wallet?.address || '0x0'),
        contract2.balanceOf(wallet?.address || '0x0')
      ]);
      
      expect(balance1).toBeDefined();
      expect(balance2).toBeDefined();
    }, 15000);
  });
});
