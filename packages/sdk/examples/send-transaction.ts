/**
 * Example: Connect to AxionAx and send a transaction
 */

import { AxionAxProvider, Wallet, parseAxx } from '@axionax/sdk';

async function main() {
  console.log('AxionAx SDK - Send Transaction Example\n');

  // Connect to testnet
  const provider = new AxionAxProvider('http://localhost:8545');
  console.log('✓ Connected to AxionAx node');

  // Get network info
  const network = await provider.getNetwork();
  console.log(`✓ Network: ${network.name} (Chain ID: ${network.chainId})`);

  // Create wallet (EXAMPLE ONLY - Never use this in production!)
  // In production, use: process.env.PRIVATE_KEY or secure key management
  const privateKey = '0x' + 'a'.repeat(64); // EXAMPLE PLACEHOLDER - NOT A REAL KEY
  const wallet = new Wallet(privateKey, provider);
  console.log(`✓ Wallet address: ${wallet.address}`);

  // Get balance
  const balance = await provider.getBalance(wallet.address);
  console.log(`✓ Balance: ${balance} wei (${parseAxx(balance)} AXX)`);

  // Send transaction
  console.log('\nSending transaction...');
  const tx = await wallet.sendTransaction({
    to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    value: parseAxx('0.1'), // 0.1 AXX
    gasLimit: 21000,
  });

  console.log(`✓ Transaction hash: ${tx.hash}`);
  console.log('  Waiting for confirmation...');

  // Wait for confirmation
  const receipt = await tx.wait();
  console.log(`✓ Transaction confirmed in block ${receipt.blockNumber}`);
  console.log(`  Status: ${receipt.status === 1 ? 'Success' : 'Failed'}`);
  console.log(`  Gas used: ${receipt.gasUsed}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
