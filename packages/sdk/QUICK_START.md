# 🚀 Quick Start Guide - axionax-sdk-ts

## Overview

**axionax-sdk-ts** เป็น TypeScript/JavaScript SDK สำหรับ developers ที่ต้องการสร้าง dApps บน axionax protocol

**Repository:** https://github.com/axionaxprotocol/axionax-sdk-ts

---

## 📋 Prerequisites

```bash
# Required
- Node.js 18+ (with npm)
- TypeScript 5.0+
- Git

# Recommended
- VS Code with TypeScript extensions
- Prettier & ESLint
```

---

## 🔧 Installation

### 1. Clone Repository

```bash
git clone https://github.com/axionaxprotocol/axionax-sdk-ts.git
cd axionax-sdk-ts
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

### 3. Build the SDK

```bash
# Build TypeScript to JavaScript
npm run build

# Build and watch for changes
npm run build:watch
```

---

## 📦 Using the SDK in Your Project

### Installation

```bash
# From npm (when published)
npm install @axionax/sdk

# From local workspace (development)
npm install file:../axionax-sdk-ts

# From GitHub
npm install github:axionaxprotocol/axionax-sdk-ts
```

### Basic Usage

```typescript
import { AxionaxClient, Wallet } from '@axionax/sdk'

// Connect to axionax node
const client = new AxionaxClient('http://localhost:8545')

// Create wallet
const wallet = Wallet.createRandom()
console.log('Address:', wallet.address)

// Get balance
const balance = await client.getBalance(wallet.address)
console.log('Balance:', balance)

// Send transaction
const tx = await client.sendTransaction({
  from: wallet.address,
  to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  value: '1000000000000000000', // 1 AXX
  gasLimit: 21000
})

console.log('Transaction hash:', tx.hash)
```

---

## 🏃 Running Development Mode

### Start Development Server

```bash
# Watch mode with hot reload
npm run dev

# Run examples
npm run examples

# Run specific example
npm run example:basic
npm run example:wallet
npm run example:contract
```

---

## ✅ Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- wallet.test.ts

# Run integration tests
npm run test:integration
```

### Test Structure

```typescript
// Example test: tests/wallet.test.ts
import { Wallet } from '../src'

describe('Wallet', () => {
  it('should create random wallet', () => {
    const wallet = Wallet.createRandom()
    expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/)
  })

  it('should sign message', async () => {
    const wallet = Wallet.createRandom()
    const message = 'Hello axionax'
    const signature = await wallet.signMessage(message)
    expect(signature).toBeDefined()
  })
})
```

---

## 🏗️ Project Structure

```
axionax-sdk-ts/
├── src/                        # Source code
│   ├── client/                 # RPC client
│   ├── wallet/                 # Wallet management
│   ├── contract/               # Smart contract interface
│   ├── utils/                  # Utility functions
│   ├── types/                  # TypeScript types
│   └── index.ts                # Main entry point
│
├── tests/                      # Test files
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── fixtures/               # Test fixtures
│
├── examples/                   # Usage examples
│   ├── basic.ts                # Basic usage
│   ├── wallet.ts               # Wallet examples
│   ├── contract.ts             # Contract examples
│   └── defi.ts                 # DeFi examples
│
├── dist/                       # Built files (after build)
├── docs/                       # Additional documentation
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config
└── README.md                   # Main documentation
```

---

## 🔨 Common Development Tasks

### Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Type check
npm run type-check
```

### Building

```bash
# Clean build
npm run clean
npm run build

# Build for production
npm run build:prod

# Generate type declarations
npm run build:types
```

### Add New Feature

```bash
# 1. Create feature branch
git checkout -b feature/add-staking

# 2. Create new module in src/
# mkdir src/staking
# touch src/staking/index.ts

# 3. Write code with types
# ... edit files ...

# 4. Add tests
# touch tests/staking.test.ts

# 5. Test your changes
npm run lint
npm run type-check
npm test

# 6. Build
npm run build

# 7. Commit (mention local dev only)
git add .
git commit -m "feat: add staking module [Local dev]"

# 8. Push to GitHub
git push origin feature/add-staking
```

---

## 📚 Core Modules

### 1. Client Module

```typescript
import { AxionaxClient } from '@axionax/sdk'

const client = new AxionaxClient('http://localhost:8545')

// Get chain info
const chainId = await client.getChainId()
const blockNumber = await client.getBlockNumber()

// Get block details
const block = await client.getBlock(blockNumber)

// Get transaction
const tx = await client.getTransaction('0x...')
```

### 2. Wallet Module

```typescript
import { Wallet } from '@axionax/sdk'

// Create wallet
const wallet1 = Wallet.createRandom()
const wallet2 = Wallet.fromMnemonic('your mnemonic phrase...')
const wallet3 = Wallet.fromPrivateKey('0x...')

// Sign message
const signature = await wallet1.signMessage('Hello')

// Sign transaction
const signedTx = await wallet1.signTransaction({
  to: '0x...',
  value: '1000000000000000000',
  gasLimit: 21000
})
```

### 3. Contract Module

```typescript
import { Contract } from '@axionax/sdk'

// Connect to contract
const contract = new Contract(
  '0x...', // contract address
  ABI,     // contract ABI
  client   // axionax client
)

// Read contract
const balance = await contract.balanceOf(wallet.address)

// Write contract
const tx = await contract.transfer(
  '0x...',  // to address
  '1000000000000000000'  // amount
)

await tx.wait() // Wait for confirmation
```

### 4. Utils Module

```typescript
import { utils } from '@axionax/sdk'

// Unit conversion
const wei = utils.parseUnits('1', 18) // 1 AXX to wei
const axx = utils.formatUnits(wei, 18) // wei to AXX

// Address validation
const isValid = utils.isAddress('0x...')

// Hash functions
const hash = utils.keccak256('0x...')
const messageHash = utils.hashMessage('Hello')
```

---

## 🔌 Integration with Other Repos

### With axionax-core

```typescript
// SDK connects to your local axionax-core node
const client = new AxionaxClient('http://localhost:8545')

// Make sure axionax-core is running:
// cd ../axionax-core && cargo run
```

### With axionax-web

```typescript
// In axionax-web, import SDK from local workspace
// package.json: "@axionax/sdk": "file:../axionax-sdk-ts"

import { AxionaxClient } from '@axionax/sdk'

export default function Home() {
  const client = new AxionaxClient(process.env.NEXT_PUBLIC_RPC_URL)
  // ... use client in React components
}
```

### With axionax-marketplace

```typescript
// Similar to axionax-web
import { AxionaxClient, Contract } from '@axionax/sdk'

// Use for marketplace smart contract interactions
const marketplace = new Contract(
  MARKETPLACE_ADDRESS,
  MARKETPLACE_ABI,
  client
)
```

---

## 📖 Examples

### Example 1: Send Transaction

```typescript
// examples/send-transaction.ts
import { AxionaxClient, Wallet } from '@axionax/sdk'

async function sendTransaction() {
  const client = new AxionaxClient('http://localhost:8545')
  const wallet = Wallet.fromPrivateKey(process.env.PRIVATE_KEY!)
  
  const tx = await client.sendTransaction({
    from: wallet.address,
    to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    value: '1000000000000000000', // 1 AXX
    gasLimit: 21000
  })
  
  console.log('Transaction sent:', tx.hash)
  
  const receipt = await tx.wait()
  console.log('Transaction confirmed:', receipt)
}

sendTransaction()
```

### Example 2: Deploy Contract

```typescript
// examples/deploy-contract.ts
import { ContractFactory, Wallet } from '@axionax/sdk'

async function deployContract() {
  const wallet = Wallet.fromPrivateKey(process.env.PRIVATE_KEY!)
  
  const factory = new ContractFactory(
    ABI,
    BYTECODE,
    wallet
  )
  
  const contract = await factory.deploy('Constructor', 'Args')
  await contract.deployed()
  
  console.log('Contract deployed at:', contract.address)
}

deployContract()
```

### Example 3: Listen to Events

```typescript
// examples/listen-events.ts
import { AxionaxClient, Contract } from '@axionax/sdk'

async function listenEvents() {
  const client = new AxionaxClient('ws://localhost:8546')
  const contract = new Contract(CONTRACT_ADDRESS, ABI, client)
  
  // Listen to Transfer events
  contract.on('Transfer', (from, to, amount) => {
    console.log('Transfer detected:')
    console.log('From:', from)
    console.log('To:', to)
    console.log('Amount:', amount.toString())
  })
  
  // Listen to new blocks
  client.on('block', (blockNumber) => {
    console.log('New block:', blockNumber)
  })
}

listenEvents()
```

---

## 🚨 Troubleshooting

### Build Errors

```bash
# Clean and rebuild
npm run clean
rm -rf node_modules
npm install
npm run build
```

### Type Errors

```bash
# Check types explicitly
npm run type-check

# Regenerate type declarations
npm run build:types
```

### Test Failures

```bash
# Run tests in debug mode
npm test -- --verbose

# Run single test file
npm test -- wallet.test.ts

# Clear jest cache
npm test -- --clearCache
```

### Import Errors

```typescript
// Use correct import paths
import { AxionaxClient } from '@axionax/sdk'  // ✅ Correct
import { AxionaxClient } from '../src'        // ❌ Wrong (in production)

// Check package.json "exports" field
{
  "exports": {
    ".": "./dist/index.js",
    "./types": "./dist/types/index.js"
  }
}
```

---

## 📝 Configuration

### TypeScript Config: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```

---

## 📚 Additional Resources

- **API Documentation:** https://docs.axionax.org/sdk
- **Type Definitions:** [src/types/](src/types/)
- **Examples:** [examples/](examples/)
- **Contributing Guide:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)

---

## 🤝 Getting Help

- **Issues:** Report bugs on [GitHub Issues](https://github.com/axionaxprotocol/axionax-sdk-ts/issues)
- **Documentation:** Check [axionax-docs](https://github.com/axionaxprotocol/axionax-docs)
- **Core Node:** See [axionax-core](https://github.com/axionaxprotocol/axionax-core)

---

## 📄 License

MIT - See [LICENSE](LICENSE) file for details

---

<p align="center">
  <sub>Built with ❤️ by the axionax protocol Team</sub>
</p>
