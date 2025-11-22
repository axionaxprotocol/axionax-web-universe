# Integration Tests Guide

## Overview

This directory contains integration tests that verify the interaction between:
- **SDK ↔ Core RPC Node** - Client communication with blockchain
- **SDK ↔ Smart Contracts** - Contract deployment and interaction
- **Web App ↔ SDK** - Frontend integration
- **Cross-repo functionality** - End-to-end workflows

## Test Structure

```
tests/
├── integration/
│   ├── client.test.ts       # SDK ↔ RPC integration
│   ├── contract.test.ts     # Contract interactions
│   └── wallet.test.ts       # Wallet operations
├── setup/
│   ├── global-setup.ts      # Pre-test setup
│   ├── global-teardown.ts   # Post-test cleanup
│   └── test-setup.ts        # Test configuration
└── e2e/
    └── app.spec.ts          # End-to-end tests
```

## Running Tests

### All Integration Tests
```bash
npm run test:integration
```

### Specific Test Suites
```bash
# SDK ↔ RPC tests only
npm run test:integration -- tests/integration/client.test.ts

# Contract tests only
npm run test:contract

# E2E tests
cd ../axionax-web
npm run test:e2e
```

### With Coverage
```bash
npm run test:integration -- --coverage
```

### Watch Mode
```bash
npm run test:integration -- --watch
```

## Environment Variables

Create `.env.test` file:

```env
# RPC Endpoint
RPC_URL=https://rpc.axionax.org
CHAIN_ID=1001

# For write operations (optional)
TEST_PRIVATE_KEY=0x...
TEST_CONTRACT_ADDRESS=0x...

# Performance tests
TEST_DURATION=60

# Test behavior
SILENT_TESTS=false
```

## Test Categories

### 1. Node Health & Status
Tests basic connectivity and node information:
- RPC endpoint accessibility
- Node status and sync info
- Network peer information
- Chain ID verification

### 2. Block Operations
Tests block querying functionality:
- Get latest block
- Get block by height
- Get block by hash
- Sequential block fetching

### 3. Transaction Queries
Tests transaction-related operations:
- Get transaction by hash
- Transaction history
- Pending transactions
- Transaction receipts

### 4. Account Operations
Tests account and balance queries:
- Balance queries
- Transaction count (nonce)
- Account state

### 5. Contract Integration
Tests smart contract interactions:
- Contract deployment
- Read-only calls
- Write transactions
- Event listening
- Multi-contract operations

### 6. PoPC Consensus
Tests consensus-specific features:
- Validator set queries
- PoPC proof verification
- Challenge response queries

## Writing New Tests

### Example: Client Test

```typescript
import { describe, it, expect, beforeAll } from '@jest/globals';
import { axionaxClient } from '../../src';

describe('Feature Tests', () => {
  let client: axionaxClient;
  
  beforeAll(() => {
    client = new axionaxClient({
      rpcUrl: process.env.RPC_URL,
      chainId: parseInt(process.env.CHAIN_ID || '1001')
    });
  });
  
  it('should test feature', async () => {
    const result = await client.someMethod();
    expect(result).toBeDefined();
  }, 10000); // 10 second timeout
});
```

### Example: Contract Test

```typescript
import { Contract } from '../../src';

describe('Contract Tests', () => {
  it('should interact with contract', async () => {
    const contract = new Contract(address, abi, client);
    const result = await contract.method();
    expect(result).toBeDefined();
  });
});
```

## Best Practices

### 1. Test Independence
- Each test should be independent
- Don't rely on test execution order
- Clean up resources after tests

### 2. Timeouts
- Set appropriate timeouts for network operations
- Default: 30 seconds for integration tests
- Use `test.setTimeout()` for longer operations

### 3. Error Handling
```typescript
it('should handle errors gracefully', async () => {
  await expect(
    client.invalidOperation()
  ).rejects.toThrow('Expected error message');
});
```

### 4. Conditional Tests
```typescript
it('should run only with credentials', async () => {
  if (!process.env.TEST_PRIVATE_KEY) {
    console.log('Skipping: No credentials');
    return;
  }
  // Test code
});
```

### 5. Performance Considerations
- Use `Promise.all()` for concurrent requests
- Avoid unnecessary waits
- Mock external dependencies when possible

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests
- Daily schedule (2 AM UTC)

### GitHub Actions Workflow

See `.github/workflows/integration-tests.yml`:

```yaml
jobs:
  sdk-integration-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Run integration tests
        env:
          RPC_URL: https://rpc.axionax.org
          CHAIN_ID: 1001
        run: npm run test:integration
```

## Debugging Tests

### Verbose Output
```bash
npm run test:integration -- --verbose
```

### Single Test
```bash
npm run test:integration -- --testNamePattern="should get latest block"
```

### Debug Mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then attach debugger in VS Code.

## Troubleshooting

### Tests Timeout
- Check RPC endpoint connectivity
- Increase timeout: `jest.setTimeout(60000)`
- Check network conditions

### Connection Refused
- Verify RPC_URL is correct
- Check if node is running
- Verify firewall settings

### Random Failures
- Check for race conditions
- Ensure test independence
- Add retry logic for flaky tests

## Performance Tests

Run performance benchmarks:

```bash
npm run test:performance
```

Generates report:
- Request latency
- Throughput (requests/sec)
- Concurrent connection handling
- Memory usage

## Contributing

When adding new integration tests:

1. Follow existing test structure
2. Add appropriate documentation
3. Ensure tests are idempotent
4. Handle errors gracefully
5. Add environment variable docs
6. Update this README

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Testing](https://playwright.dev/)
- [axionax SDK Docs](https://docs.axionax.org/sdk)
- [Integration Testing Best Practices](https://martinfowler.com/bliki/IntegrationTest.html)
