/**
 * Example: Listen to blockchain events
 */

import { AxionAxProvider } from '@axionax/sdk';

async function main() {
  console.log('AxionAx SDK - Event Listener Example\n');

  const provider = new AxionAxProvider('http://localhost:8545');
  console.log('✓ Connected to AxionAx node');

  // Listen for new blocks
  provider.on('block', (blockNumber) => {
    console.log(`📦 New block: ${blockNumber}`);
  });

  // Listen for pending transactions
  provider.on('pending', (txHash) => {
    console.log(`📤 Pending tx: ${txHash}`);
  });

  // Listen for network changes
  provider.on('network', (newNetwork, oldNetwork) => {
    if (oldNetwork) {
      console.log(
        `🔄 Network changed from ${oldNetwork.chainId} to ${newNetwork.chainId}`
      );
    }
  });

  console.log('\n👂 Listening for events... (Press Ctrl+C to stop)');

  // Keep running
  await new Promise(() => {});
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
