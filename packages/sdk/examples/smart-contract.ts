/**
 * Example: Deploy and interact with a smart contract
 */

import { AxionAxProvider, Wallet, Contract } from '@axionax/sdk';

// Simple ERC20 ABI
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

async function main() {
  console.log('AxionAx SDK - Smart Contract Example\n');

  // Setup
  const provider = new AxionAxProvider('http://localhost:8545');
  const wallet = new Wallet('0x' + 'a'.repeat(64), provider);
  console.log(`✓ Wallet: ${wallet.address}`);

  // Connect to existing contract
  const tokenAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  const token = new Contract(tokenAddress, ERC20_ABI, wallet);
  console.log(`✓ Connected to token at ${tokenAddress}`);

  // Read contract data
  console.log('\nReading contract data...');
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();
  const totalSupply = await token.totalSupply();

  console.log(`  Name: ${name}`);
  console.log(`  Symbol: ${symbol}`);
  console.log(`  Decimals: ${decimals}`);
  console.log(`  Total Supply: ${totalSupply}`);

  // Check balance
  const balance = await token.balanceOf(wallet.address);
  console.log(`  Balance: ${balance}`);

  // Transfer tokens
  console.log('\nTransferring tokens...');
  const tx = await token.transfer(
    '0x0000000000000000000000000000000000000001',
    1000
  );
  console.log(`✓ Transaction hash: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`✓ Transfer confirmed in block ${receipt.blockNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
