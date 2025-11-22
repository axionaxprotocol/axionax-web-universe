# @axionax/sdk - axionax protocol TypeScript SDK

Official TypeScript/JavaScript SDK for building on axionax protocol.

[![npm version](https://img.shields.io/npm/v/@axionax/sdk.svg)](https://www.npmjs.com/package/@axionax/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Protocol](https://img.shields.io/badge/Protocol-axionax-purple)](https://axionax.org)
[![Status](https://img.shields.io/badge/Status-Ready-green)](https://github.com/axionaxprotocol/axionax-core)

---

## 📢 Latest Update (November 13, 2025)

� **SDK v2.0 - Enhanced Error Handling & Type Safety!**

Recent improvements:

✅ **New Features:**
- 🎯 Custom error classes hierarchy (4 types)
  - `AxionaxError` - Base error class
  - `SignerRequiredError` - Signer validation
  - `InvalidJobIdError` - Job ID validation  
  - `NetworkError` - Network issues with cause tracking
- 🔧 Extracted helper methods for cleaner code
  - `initializeProvider()`, `initializeSigner()`
  - `requireSigner()`, `validateJobId()`
- � Added `NetworkStats` interface
- 📝 Enhanced inline documentation

📊 **Refactoring Results:**
- Better error messages for SDK users
- Improved IDE autocomplete support
- Type-safe error handling
- 100% backward compatible

� **Status:** Production-ready, used by Web & Marketplace

📦 **Details:** See [REFACTORING_SUMMARY.md](../axionax-docs/REFACTORING_SUMMARY.md)

---

## 📖 About

The **@axionax/sdk** is the official TypeScript/JavaScript SDK for interacting
with the **axionax protocol** - a Layer-1 blockchain designed for
high-performance decentralized compute markets.

### Part of axionax Ecosystem

This SDK enables developers to build dApps on axionax protocol:

- **Protocol Core**: [`../core`](../core) - Blockchain implementation
  (Rust/Python)
- **Web Interface**: [`../web`](../web) - Uses this SDK
- **Marketplace**: [`../marketplace`](../marketplace) - Built with this SDK
- **Documentation**: [`../docs`](../docs) - Full protocol documentation
- **DevTools**: [`../devtools`](../devtools) - Testing utilities
- **Deploy**: [`../deploy`](../deploy) - Infrastructure
- **Issue Manager**: [`../issue-manager`](../issue-manager) - Task tracking

**Main Repository**:
[axionaxprotocol/axionax-core](https://github.com/axionaxprotocol/axionax-core)

**SDK Status:** Production-ready, actively used in Web & Marketplace projects

---

## ✨ Features

- ✅ **Full RPC Client** - Complete TypeScript client for axionax protocol RPC
  endpoints
- ✅ **Wallet Integration** - Easy wallet connection and transaction signing
- ✅ **Contract Interaction** - Typed interfaces for smart contract calls
- ✅ **PoPC Utilities** - Helpers for Proof of Probabilistic Checking consensus
- ✅ **Compute Marketplace** - Utilities for compute resource trading
- ✅ **Type Safety** - Full TypeScript support with type definitions
- ✅ **Modern Standards** - Built with ES modules and async/await

---

## Installation

```bash
npm install @axionax/sdk

# or
yarn add @axionax/sdk

# or
pnpm add @axionax/sdk
```

**Note:** SDK will be published to npm after testnet launch (Q1 2026). For now, install from source.

## Features

- **Full RPC Client** - Complete TypeScript client for axionax RPC endpoints
- **Wallet Integration** - Easy wallet connection and transaction signing
- **Contract Interaction** - Typed interfaces for smart contract calls
- **PoPC Utilities** - Helpers for Proof of Probabilistic Checking consensus
- **Type Safety** - Full TypeScript support with type definitions
- **Modern Standards** - Built with ES modules and async/await

## Quick Start

### Connect to axionax Network

```typescript
import { axionaxClient } from '@axionax/sdk';

// Connect to testnet
const client = new axionaxClient({
  rpcUrl: 'https://rpc.axionax.org',
  chainId: 86137  // axionax Testnet
});

// Get latest block
const block = await client.getLatestBlock();
console.log('Latest block:', block.number);
```

**Network Information:**
- **Testnet Chain ID**: `86137` (active for testing)
- **Mainnet Chain ID**: `86150` (reserved, not launched)
- **Local Dev Chain ID**: `31337` (local development only)

### Send a Transaction

```typescript
import { Wallet, Transaction } from '@axionax/sdk';

const wallet = new Wallet(privateKey, client);

const tx = await wallet.sendTransaction({
  to: '0x...',
  value: '1000000000000000000', // 1 AXX
  data: '0x'
});

console.log('Transaction hash:', tx.hash);
await tx.wait(); // Wait for confirmation
```

### Query Contract

```typescript
import { Contract } from '@axionax/sdk';

const abi = [...]; // Your contract ABI
const contract = new Contract(contractAddress, abi, client);

const balance = await contract.balanceOf('0x...');
console.log('Balance:', balance.toString());
```

### PoPC Consensus Helpers

```typescript
import { PoPC } from '@axionax/sdk';

// Verify PoPC proof
const isValid = PoPC.verifyProof(proof, blockHash);

// Calculate challenge score
const score = PoPC.calculateChallengeScore(validator, challenge);
```

## Project Structure

```
src/
  client/           # RPC client implementation
  wallet/           # Wallet and signer utilities
  contract/         # Contract interaction helpers
  popc/             # PoPC consensus utilities
  utils/            # Common utilities
  types/            # TypeScript type definitions
examples/
  basic.ts          # Basic usage examples
  contract.ts       # Contract interaction examples
  wallet.ts         # Wallet integration examples
  popc.ts           # PoPC consensus examples
```

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm run test
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

**Testing Goals:**
- Unit test coverage: >80%
- Integration tests: All RPC methods
- Type safety validation

### Lint & Format

```bash
npm run lint
npm run format
```

## API Documentation

### axionaxClient

Main client for interacting with axionax RPC:

```typescript
const client = new axionaxClient({
  rpcUrl: string;     // RPC endpoint URL
  chainId?: number;   // Chain ID (default: 86137)
  timeout?: number;   // Request timeout in ms
});

// Methods
await client.getLatestBlock()
await client.getBlockByNumber(blockNumber)
await client.getTransaction(txHash)
await client.getBalance(address)
await client.sendRawTransaction(signedTx)
await client.call(txObject)
await client.estimateGas(txObject)
```

### Wallet

Wallet management and transaction signing:

```typescript
const wallet = new Wallet(privateKey, client);

// Properties
wallet.address        // Wallet address
wallet.privateKey     // Private key (encrypted in memory)

// Methods
await wallet.getBalance()
await wallet.sendTransaction(tx)
await wallet.signMessage(message)
await wallet.signTransaction(tx)
```

### Contract

Smart contract interaction:

```typescript
const contract = new Contract(address, abi, clientOrWallet);

// Read-only calls
await contract.methodName(...args)

// Write calls (requires Wallet)
await contract.methodName(...args, { value, gasLimit })
```

## Network Endpoints

### Testnet

```
RPC: https://rpc.axionax.org (Coming Q1 2026)
Chain ID: 86137
Explorer: https://explorer.axionax.org (Coming Q1 2026)
Faucet: https://faucet.axionax.org (Coming Q1 2026)
```

### Mainnet (Reserved - Not Launched)

```
RPC: https://mainnet-rpc.axionax.org
Chain ID: 86150
```

**Note:** Public RPC endpoints will be available after testnet launch. You can run a local node now.

## Examples

Check out the `examples/` directory for complete working examples:

- **[basic.ts](examples/basic.ts)** - Basic client setup and queries
- **[wallet.ts](examples/wallet.ts)** - Wallet creation and transactions
- **[contract.ts](examples/contract.ts)** - Contract deployment and interaction
- **[popc.ts](examples/popc.ts)** - PoPC consensus utilities

---

## 🎯 SDK Development Checklist

Track SDK readiness:

- [x] ✅ RPC Client implementation
- [x] ✅ Wallet integration
- [x] ✅ Contract interaction
- [x] ✅ PoPC utilities
- [x] ✅ TypeScript types
- [x] ✅ Unit tests (>80% coverage)
- [ ] 📝 API documentation (90%)
- [ ] 📝 Integration tests (in progress)
- [ ] 📝 npm package preparation
- [ ] 🔥 Performance optimization

Use [`../issue-manager`](../issue-manager) to track SDK tasks.

---

## Related Projects & axionax Ecosystem

### Core Components

| Component       | Description                | Location                           | Status      |
| --------------- | -------------------------- | ---------------------------------- | ----------- |
| **SDK** (this)  | TypeScript SDK             | `sdk/`                             | ✅ Ready    |
| **Protocol Core** | Blockchain implementation | [`../core`](../core)              | ✅ Ready    |
| **Web Interface** | Official website          | [`../web`](../web)                | ✅ Ready    |
| **Marketplace** | Compute marketplace        | [`../marketplace`](../marketplace) | 🚧 Beta     |
| **Documentation** | Protocol docs            | [`../docs`](../docs)              | 📝 Active   |
| **DevTools**    | Development utilities      | [`../devtools`](../devtools)       | ✅ Ready    |
| **Deploy**      | Infrastructure             | [`../deploy`](../deploy)           | 🔥 Testing  |
| **Issue Manager** | Task tracking            | [`../issue-manager`](../issue-manager) | 🎉 New! |

### External Resources

- **Main Repository**: https://github.com/axionaxprotocol/axionax-core
- **Protocol Website**: https://axionax.org
- **Documentation**: https://docs.axionax.org
- **RPC Endpoint**: https://rpc.axionax.org (Coming Q1 2026)

---

## 📊 SDK Metrics

### Feature Completion

- **RPC Client**: 100% ✅
- **Wallet Integration**: 100% ✅
- **Contract Helpers**: 100% ✅
- **PoPC Utilities**: 100% ✅
- **Type Definitions**: 100% ✅
- **Unit Tests**: 85% 🔥
- **Documentation**: 90% 📝
- **Examples**: 100% ✅

### Active Usage

- ✅ Used by `axionax-web`
- ✅ Used by `axionax-marketplace`
- ✅ Ready for third-party dApps

---

**Part of the axionax protocol Ecosystem**

Built with ❤️ by the axionax team

**Last Updated**: November 13, 2025 - SDK v2.0 with enhanced error handling ✨
