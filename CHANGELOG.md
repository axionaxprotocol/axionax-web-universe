# Changelog

All notable changes to the Axionax Web Universe monorepo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.9.0-testnet] - 2025-12-13

### 🎉 Major Release - SDK & Architecture Improvements

This release focuses on code architecture, SDK creation, and documentation consistency.

### ✨ Added

#### New `@axionax/sdk` Package
- **Complete TypeScript SDK** for Axionax Protocol integration
  - `AxionaxClient` class with full API support
  - `createClient()` factory function
  - `EscrowStatus`, `EscrowTransaction` types
  - `Job`, `Worker`, `Wallet` interfaces
  - `AXIONAX_TESTNET_CONFIG` configuration
- Re-exports from `@axionax/blockchain-utils` for convenience
- Full JSDoc documentation

#### Architecture Improvements
- **Created `packages/sdk`** - Central SDK package (previously missing)
- **Refactored `web3.ts`** - Reduced from 268 lines to 77 lines (71% reduction)
- **Enhanced `packages/blockchain-utils`** with new `wallet.ts` module

### 🔧 Changed

#### Documentation Updates
- **README.md** - Updated repository structure with all apps/packages
- **SYSTEM_ARCHITECTURE.md** - Updated tech stack table with new packages
- **All HTML docs** - Updated to v1.9.0 (7 files)
  - `index.html`, `API_REFERENCE.html`, `BUILD.html`
  - `QUICKSTART.html`, `ARCHITECTURE.html`
  - `NODE_INTEGRATION.html`, `TESTNET_INTEGRATION.html`
- **Chain ID consistency** - Updated all references from 888/31337 to 86137

#### Package Updates
- **`@axionax/ui`** version 1.8.0 → 1.9.0
- **`apps/web`** now depends on `@axionax/blockchain-utils`

### 🐛 Fixed
- Version inconsistency between packages (all now at 1.9.0)
- Hardcoded RPC URLs replaced with centralized configuration
- Missing `@axionax/sdk` package that was referenced but didn't exist

---

## [1.8.0-testnet] - 2025-12-05

### 🎉 Major Release - Production Ready Testnet

This release marks a significant milestone with full infrastructure deployment, comprehensive documentation, and production-ready testnet.

### ✨ Added

#### Infrastructure
- **Full 9/9 Services Operational** (100% uptime)
  - Web Application (Next.js)
  - Marketplace (Vite + React)
  - Explorer API (Express + PostgreSQL)
  - Faucet API (Express + Redis)
  - RPC Server (WebSocket + HTTP)
  - PostgreSQL Database
  - Redis Cache
  - Nginx Reverse Proxy
  - Monitoring Stack (Prometheus + Grafana)

#### Documentation
- **JOIN_TESTNET.md** - Comprehensive Thai language guide for joining testnet
  - MetaMask setup (automatic and manual)
  - Faucet usage instructions
  - Block explorer navigation
  - Smart contract deployment with Hardhat and Foundry
  - Common troubleshooting scenarios
- **RUNBOOK.md** - Complete operations manual for DevOps teams
  - Health check automation scripts
  - Service management procedures
  - Troubleshooting guides for all 9 services
  - Emergency recovery procedures
  - Backup and restore scripts
  - Monitoring and alerting setup
- **VALIDATOR_SETUP_GUIDE.md** - Validator node setup guide
  - Hardware and software requirements
  - Step-by-step installation instructions
  - Configuration templates
  - Monitoring and security best practices
  - Troubleshooting common issues
- **SMART_CONTRACT_EXAMPLES.md** - Smart contract development guide
  - ERC-20, ERC-721, ERC-1155 implementations
  - DeFi examples (Staking, DEX/AMM)
  - DAO governance contracts
  - Testing frameworks and deployment scripts
  - Verification on block explorer
- **DEPLOYMENT_CHECKLIST.md** - Comprehensive deployment guide
  - Pre-deployment checklists
  - Step-by-step deployment procedures
  - Post-deployment validation
  - Rollback procedures
  - Environment configurations
  - Monitoring setup

#### Features
- Updated all components to display v1.8.0-testnet
- Improved roadmap visualization with completed phases
- Enhanced infrastructure status dashboard
- Real-time metrics and monitoring dashboards

### 🔄 Changed

#### Protocol
- **PoPC (Proof of Provable Computation)**
  - Sample size (s): 1000 transactions
  - Confidence level: 99% (α=0.01)
  - Fraud window: 3600 seconds
- **ASR (Adaptive Sampling Rate)**
  - Number of sentinels (K): 64
  - Maximum quota: 12.5% of block transactions
- **VRF (Verifiable Random Function)**
  - Minimum delay (k): 2 blocks

#### Infrastructure Status
- Updated from 7/9 services (78% operational) to 9/9 services (100% operational)
- All services now have health check endpoints
- Improved monitoring with Prometheus metrics
- Grafana dashboards for all services

#### Documentation
- Updated all version references from v1.5/v1.6/v1.7 to v1.8.0-testnet
- Updated all dates from November 2025 to December 5, 2025
- Consolidated architecture compliance documentation
- Enhanced API reference with latest endpoints

### 📦 Package Updates
All packages updated to version 1.8.0:
- `@axionax/web@1.8.0`
- `@axionax/marketplace@1.8.0`
- `@axionax/sdk@1.8.0`
- `@axionax/ui@1.8.0`
- `@axionax/contracts@1.8.0`
- `axionax-faucet-api@1.8.0`
- `axionax-mock-rpc@1.8.0`
- `axionax-mock-explorer-api@1.8.0`

### 🐛 Fixed
- Corrected version inconsistencies across 50+ documentation files
- Fixed infrastructure status reporting
- Updated HTML meta tags with correct version
- Resolved date mismatches in documentation

### 🔒 Security
- All services now use HTTPS in production
- Environment variables properly secured
- Firewall rules configured for all services
- Rate limiting implemented on API endpoints
- CORS policies reviewed and updated

### 📊 Performance
- Response time (p95): 198ms (improved from 245ms)
- Error rate: 0.01% (improved from 0.02%)
- Memory usage: Optimized to 3.0GB (from 3.2GB)
- CPU usage: Reduced to 25% average (from 28%)

### 🌐 Network Information
- **Chain ID**: 86137
- **Network Name**: axionax-testnet-1
- **RPC Endpoint**: https://testnet-rpc.axionax.org
- **WebSocket**: wss://testnet-ws.axionax.org
- **Block Explorer**: https://explorer.axionax.org
- **Faucet**: https://faucet.axionax.org

### 📝 Notes
This release represents the culmination of months of development and testing. The testnet is now production-ready with comprehensive documentation for all user types:
- **Users**: Can easily join testnet and interact with the network
- **Developers**: Have complete smart contract examples and deployment guides
- **Validators**: Can set up nodes with detailed instructions
- **DevOps**: Have runbooks and checklists for operations

---

## [1.7.0] - 2025-11-15

### Added
- Public testnet launch
- RPC infrastructure deployment
- Block explorer with transaction history
- Faucet API for test token distribution

### Changed
- Improved consensus performance
- Enhanced network stability

---

## [1.6.0] - 2025-10-20

### Added
- Multi-language architecture (Rust + Python + TypeScript)
- Rust core for consensus, blockchain, and cryptography
- Python DeAI layer (ASR, fraud detection)
- TypeScript SDK and PyO3 bridge

### Changed
- 3x performance improvement over Go implementation

---

## [1.5.0] - 2025-09-10

### Added
- Initial protocol specification
- PoPC consensus mechanism
- Basic blockchain implementation

---

## Upcoming Releases

### [1.9.0] - Q1 2026 (Planned)
- Network expansion and scaling
- Advanced block explorer features
- Validator network growth
- Additional DeFi protocols

### [2.0.0] - Q1-Q2 2026 (Planned)
- Protocol compliance audits
- Advanced governance features
- Cross-chain bridge implementations
- Layer-2 scaling solutions

### [2.1.0] - Q3 2026 (Planned)
- Mainnet preparation
- Security audits (Trail of Bits, OpenZeppelin)
- Permissionless validator registration
- Emergency response system

---

## Links
- **Website**: https://axionax.org
- **Documentation**: https://docs.axionax.org
- **GitHub**: https://github.com/axionaxprotocol/axionax-web-universe
- **Discord**: https://discord.gg/axionax
- **Twitter**: https://twitter.com/axionax

---

**Legend**:
- 🎉 Major release
- ✨ New features
- 🔄 Changes
- 🐛 Bug fixes
- 🔒 Security
- 📊 Performance
- 📦 Packages
- 🌐 Network
- 📝 Notes
