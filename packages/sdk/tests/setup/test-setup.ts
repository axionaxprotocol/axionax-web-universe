/**
 * Test setup
 * Runs before each test file
 */

// Extend Jest matchers if needed
expect.extend({
  toBeValidAddress(received: string) {
    const pass = /^0x[a-fA-F0-9]{40}$/.test(received);
    return {
      pass,
      message: () => `expected ${received} to be a valid Ethereum address`
    };
  },
  
  toBeValidTxHash(received: string) {
    const pass = /^0x[a-fA-F0-9]{64}$/.test(received);
    return {
      pass,
      message: () => `expected ${received} to be a valid transaction hash`
    };
  }
});

// Increase timeout for integration tests
jest.setTimeout(30000);

// Suppress console logs in tests (optional)
if (process.env.SILENT_TESTS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}
