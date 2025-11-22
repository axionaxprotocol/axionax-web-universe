/**
 * Global setup for integration tests
 * Runs once before all tests
 */

export default async function globalSetup() {
  console.log('\n🚀 Starting integration test suite...\n');
  
  // Check if RPC endpoint is accessible
  const RPC_URL = process.env.RPC_URL || 'https://rpc.axionax.org';
  
  try {
    const response = await fetch(`${RPC_URL}/health`);
    if (response.ok) {
      console.log(`✅ RPC endpoint accessible: ${RPC_URL}\n`);
    } else {
      console.warn(`⚠️  RPC endpoint returned status ${response.status}\n`);
    }
  } catch (error) {
    console.error(`❌ Failed to connect to RPC endpoint: ${RPC_URL}`);
    console.error(`Error: ${error}\n`);
    console.warn('⚠️  Tests may fail if RPC endpoint is not accessible\n');
  }
  
  // Set global test timeout
  global.testTimeout = 30000;
  
  console.log('Test Configuration:');
  console.log(`  RPC URL: ${RPC_URL}`);
  console.log(`  Chain ID: ${process.env.CHAIN_ID || '1001'}`);
  console.log(`  Timeout: ${global.testTimeout}ms\n`);
}
