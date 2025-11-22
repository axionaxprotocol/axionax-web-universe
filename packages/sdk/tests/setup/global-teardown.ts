/**
 * Global teardown for integration tests
 * Runs once after all tests
 */

export default async function globalTeardown() {
  console.log('\n✅ Integration test suite completed\n');
  
  // Cleanup any resources if needed
  // e.g., close database connections, stop mock servers, etc.
}
