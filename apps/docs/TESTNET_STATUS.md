# axionax Testnet Status

> **Last Updated**: December 5, 2025  
> **Version**: v1.8.0-testnet  
> **Phase**: Phase 2 Active ✅ | All Services Operational 🟢

---

## 🌐 Live Testnet Information

### Network Details
- **Chain ID**: 86137 (0x15079)
- **Native Token**: AXX (18 decimals)
- **Consensus**: Proof of Probabilistic Checking (PoPC)
- **Block Time**: ~3 seconds

### Public Endpoints
- **RPC Endpoint**: https://rpc.axionax.org (load balanced)
- **WebSocket**: wss://rpc.axionax.org
- **Explorer**: https://explorer.axionax.org
- **Faucet**: https://faucet.axionax.org
- **Website**: https://axionax.org
- **Monitoring**: https://monitor.axionax.org

### Validator Nodes (2 Active)

| Validator | Location | IP | RPC Port | P2P Port | Status |
|-----------|----------|-----|----------|----------|--------|
| **Validator EU** | Europe | 217.76.61.116 | 8545 | 30303 | ✅ Running |
| **Validator AU** | Australia | 46.250.244.4 | 8545 | 30303 | ✅ Running |

### Direct RPC Access
```bash
# Validator EU (Primary)
curl -X POST -H "Content-Type: application/json" \\
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \\
  http://217.76.61.116:8545

# Validator AU (Backup)
curl -X POST -H "Content-Type: application/json" \\
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \\
  http://46.250.244.4:8545
```

---

## 📊 Service Status

| Service | Status | Endpoint | Description |
|---------|--------|----------|-------------|
| **Validator EU** | ✅ Running | 217.76.61.116:8545 | Primary validator node |
| **Validator AU** | ✅ Running | 46.250.244.4:8545 | Secondary validator node |
| **RPC Gateway** | ✅ Running | rpc.axionax.org | Load-balanced RPC endpoint |
| **Website** | ✅ Running | axionax.org | Main website |
| **Explorer** | ✅ Running | explorer.axionax.org | Block explorer |
| **Faucet** | ✅ Running | faucet.axionax.org | Real AXX token distribution |
| **Grafana** | ✅ Running | monitor.axionax.org | Monitoring dashboard |
| **Prometheus** | ✅ Running | Internal | Metrics collection |

---

## ✅ Phase 2 Progress

### Completed
- [x] 2 Validator nodes deployed and synced
- [x] Real PoPC consensus running
- [x] Peer discovery working (validators connected)
- [x] Load-balanced RPC endpoint
- [x] Real faucet transactions (ethers.js integration)
- [x] SSL certificates for all subdomains
- [x] Monitoring with Prometheus & Grafana
- [x] Website updated with validator status

### In Progress
- [ ] Additional validator recruitment
- [ ] Genesis ceremony documentation
- [ ] Staking UI implementation
- [ ] Governance portal

---

## 🔧 MetaMask Configuration

Add axionax Testnet to MetaMask:

| Setting | Value |
|---------|-------|
| **Network Name** | Axionax Testnet |
| **RPC URL** | https://rpc.axionax.org |
| **Chain ID** | 86137 |
| **Currency Symbol** | AXX |
| **Block Explorer** | https://explorer.axionax.org |

---

## 📈 Network Statistics

Current network metrics (live from validators):
- **Block Height**: ~264,000+ blocks
- **Validators**: 2 active
- **Peer Count**: 1 (validators connected)
- **Target TPS**: 45,000+
- **Finality**: <0.5 seconds

---

## 🚀 Getting Started

### 1. Get Test Tokens
```bash
curl -X POST -H "Content-Type: application/json" \\
  -d '{"address":"0xYourWalletAddress"}' \\
  https://faucet.axionax.org/faucet
```

### 2. Check Balance
```bash
curl -X POST -H "Content-Type: application/json" \\
  --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xYourAddress","latest"],"id":1}' \\
  https://rpc.axionax.org
```

### 3. Run Your Own Node
See [VPS_VALIDATOR_SETUP.md](./VPS_VALIDATOR_SETUP.md) for detailed instructions.
  - HighDiskUsage: <20% available for 5min
- **Automated Backups**:
  - Daily at 2:00 AM UTC via cron
  - PostgreSQL: `pg_dumpall` (3.5KB)
  - Redis: dump.rdb (509 bytes)
  - Retention: 7 days with gzip compression
  - Location: `/root/backups/`

---

## 🔄 Phase 2: Enhanced Services (25% Complete)

### In Progress
- [ ] **Mock RPC Rebuild** 🔴 Critical
  - Replace Alpine placeholder with proper Node.js implementation
  - Implement full Ethereum JSON-RPC 2.0 methods
  - Add block mining simulation (every 3 seconds)
  - Support transaction mempool

### Planned (This Week)
- [ ] **Grafana Dashboards** 🟡 High Priority
  - Restart Grafana container
  - Create dashboards for all services
  - Visualize block production rate
  - Monitor API response times
  - Track faucet distribution

- [ ] **Enhanced RPC Methods**
  - `eth_call` - Contract interaction
  - `eth_estimateGas` - Gas estimation
  - `eth_getLogs` - Event filtering
  - `eth_getTransactionReceipt` - Receipt with status
  - `debug_traceTransaction` - Debug endpoint

- [ ] **Example Smart Contracts**
  - ERC-20 token template
  - ERC-721 NFT template
  - Simple DeFi contract (swap/stake)
  - Deployment guide and scripts

---

## 📅 Phase 3: Validator Node (Planned)

### Infrastructure Planning
- **Provider**: Hetzner Cloud (recommended)
- **Instance**: CPX41 (8 vCPU, 16GB RAM, 240GB NVMe)
- **Cost**: ~€40/month (~$45 USD)
- **Timeline**: 2-4 weeks after Phase 2

### Tasks
- [ ] Provision dedicated VPS for validator
- [ ] Build axionax-core from source
- [ ] Genesis ceremony (define chain parameters)
- [ ] Configure validator keys
- [ ] Setup systemd service
- [ ] Connect to infrastructure VPS
- [ ] Test block production
- [ ] Enable consensus

---

## 📅 Phase 4: Public Launch (Planned)

### Pre-Launch Checklist
- [ ] All services 100% operational (currently 8/9)
- [ ] Validator node stable (3+ days uptime)
- [ ] Documentation complete
- [ ] Security audit
- [ ] Bug bounty program
- [ ] Community validator recruitment
- [ ] Public announcement

### Timeline
- **Target**: Q1 2026 (1-3 months after Phase 3)
- **Prerequisites**: Phases 1-3 complete, 5-10 validators recruited

---

## 📈 Metrics & KPIs

### Current Metrics (November 15, 2025)
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Services Operational | 8/9 | 9/9 | 🟡 89% |
| Infrastructure Uptime | 8+ days | >7 days | ✅ Pass |
| VPS RAM Usage | 1GB/8GB | <70% | ✅ 13% |
| VPS Disk Usage | 19GB/72GB | <80% | ✅ 26% |
| Website Response Time | <100ms | <500ms | ✅ Pass |
| API Response Time | <50ms | <200ms | ✅ Pass |
| Backup Success Rate | 100% | 100% | ✅ Pass |

### Phase 2 Goals
| Goal | Current | Target |
|------|---------|--------|
| Mock RPC Methods | 1 | 10+ |
| Grafana Dashboards | 0 | 5+ |
| Example Contracts | 0 | 3+ |
| dApp Templates | 0 | 1 |

---

## 🔧 Immediate Next Steps

### This Week (November 15-22)
1. **Fix Mock RPC** 🔴 Day 1-2
   - Locate or create proper Node.js mock RPC implementation
   - Implement Ethereum JSON-RPC 2.0 methods
   - Build Docker image
   - Deploy and test all endpoints
   - Update documentation

2. **Restart Grafana** 🟡 Day 1
   - Find and restart Grafana container
   - Or deploy new Grafana instance
   - Configure data sources (Prometheus)
   - Create initial dashboards

3. **Enhanced RPC Methods** 🟡 Day 3-5
   - Implement `eth_call` for contract interactions
   - Add `eth_estimateGas` for gas calculations
   - Support event logs filtering
   - Add transaction receipts with status

### Next Week (November 23-30)
4. **Example Contracts** 📋
   - Create ERC-20 token template
   - Create ERC-721 NFT template
   - Simple DeFi contract example
   - Deployment scripts and documentation

5. **dApp Starter Kit** 📋
   - React + TypeScript template
   - Web3.js / ethers.js integration
   - MetaMask connection boilerplate
   - Example contract interactions

---

## 🔗 Quick Links

### Documentation
- [Deployment Plan](./TESTNET_DEPLOYMENT_PLAN.md) - Full 4-phase roadmap
- [STATUS.md](./STATUS.md) - Overall project status
- [README.md](./README.md) - Project overview

### Live Services
- Website: http://217.216.109.5:3000
- Explorer API: http://217.216.109.5:3001
- Faucet API: http://217.216.109.5:3002
- Prometheus: http://217.216.109.5:9090
- RPC: http://217.216.109.5:8545 (⚠️ needs rebuild)

### Developer Tools
- Add Network to MetaMask: Chain ID 86137, RPC http://217.216.109.5:8545
- Get Testnet Tokens: http://217.216.109.5:3000/faucet
- View Blocks: http://217.216.109.5:3000/explorer

---

## 📞 Support & Contact

- **Discord**: Coming soon
- **GitHub**: https://github.com/axionaxprotocol
- **Email**: dev@axionax.org

---

**Last Status Check**: November 15, 2025 15:36 UTC  
**Next Update**: November 22, 2025  
**Phase 1 Progress**: ✅ 100% Complete  
**Phase 2 Progress**: 🔄 25% In Progress

Made with 💜 by the axionax Team
