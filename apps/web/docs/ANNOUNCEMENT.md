# 📢 Axionax Testnet Launch Announcement

---

## 🎉 We're Live! Axionax Testnet is Now Available

**Date**: November 20, 2025  
**Version**: 2.0.0

We're thrilled to announce the official launch of **Axionax Testnet** - a high-performance Layer-1 blockchain designed for decentralized compute markets!

---

## 🌟 What's Launched

### ✅ Core Infrastructure

- **2 Validators Online** (EU 🇪🇺 + AU 🇦🇺)
- **5-Second Block Time** with consistent performance
- **99.9%+ Uptime** since deployment
- **SSL-Secured Website** at https://axionax.org

### ✅ Web Interface

- **Live Metrics Dashboard** - Real-time block height updates
- **Block Explorer** - Search blocks, transactions, and accounts
- **Modern Architecture** - React 19 + TanStack Query v5
- **Mobile-First Design** - Fully responsive across devices

### 🔧 Coming Soon

- **Testnet Faucet** - Get free AXX tokens (Expected: Late Nov)
- **Explorer API** - Advanced querying (Expected: Nov 25)
- **Community Channels** - Discord & Twitter (Q4 2025)

---

## 🚀 Quick Start

### 1. Add Network to MetaMask

```
Network Name: Axionax Testnet
RPC URL: https://axionax.org/rpc/
Chain ID: 86137
Currency: AXX
Explorer: https://axionax.org/explorer
```

### 2. Explore the Network

Visit **https://axionax.org** to:
- View live block height (updates every 5 seconds)
- Check validator status (2/2 online)
- Browse recent blocks and transactions
- Monitor network health

### 3. Get Test Tokens

- **Faucet**: Coming soon at https://axionax.org/faucet
- **Request**: Open GitHub issue for early access tokens
- **Discord**: Join our community (launching soon)

---

## 💻 For Developers

### RPC Endpoints

```bash
# Primary (HTTPS - Recommended)
https://axionax.org/rpc/

# Direct Validators
EU: http://217.76.61.116:8545
AU: http://46.250.244.4:8545
```

### Example: Get Latest Block

```bash
curl -X POST https://axionax.org/rpc/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_blockNumber",
    "params": [],
    "id": 1
  }'
```

### SDK Support

```bash
npm install @axionax/sdk
```

```typescript
import { AxionaxClient } from '@axionax/sdk';

const client = new AxionaxClient({
  rpcUrl: 'https://axionax.org/rpc/',
  chainId: 86137
});

const blockHeight = await client.getBlockNumber();
console.log(`Current block: ${blockHeight}`);
```

---

## 🏗️ Technical Highlights

### Modern Tech Stack

- **Frontend**: Next.js 14 + React 19
- **State Management**: Zustand + TanStack Query v5
- **Styling**: Tailwind CSS (mobile-first)
- **Infrastructure**: Nginx + SSL + Reverse Proxy
- **Monitoring**: Prometheus + Grafana

### Network Specifications

- **Consensus**: Proof of Authority (PoA)
- **Block Time**: 5 seconds
- **TPS**: ~200 transactions per second
- **Gas Model**: EVM-compatible
- **Chain ID**: 86137 (0x15079)

---

## 🎯 What Makes Axionax Different?

### 🚀 Built for Compute Markets

Unlike general-purpose blockchains, Axionax is specifically designed for:
- **Decentralized compute resource trading**
- **High-throughput task scheduling**
- **Efficient resource allocation**
- **Fair pricing mechanisms**

### ⚡ Performance-First

- **Fast Finality**: 5-second blocks
- **Low Latency**: Multi-region validators
- **High Throughput**: 200+ TPS
- **Cost-Effective**: Minimal gas fees

### 🛠️ Developer-Friendly

- **EVM-Compatible**: Use existing Ethereum tools
- **Modern SDK**: TypeScript-first development
- **Comprehensive Docs**: Clear guides and examples
- **Active Support**: Responsive community

---

## 🗺️ Roadmap

### Q4 2025 (Now)

- [x] Testnet launch with 2 validators
- [x] Website with live metrics
- [x] Basic block explorer
- [ ] Faucet functionality
- [ ] Community channels (Discord, Twitter)

### Q1 2026

- [ ] Additional validators (Asia, Americas)
- [ ] Enhanced developer tools
- [ ] Compute marketplace beta
- [ ] Security audit
- [ ] Mainnet preparation

### Q2 2026

- [ ] Mainnet launch
- [ ] Token generation event
- [ ] Staking mechanism
- [ ] Governance implementation
- [ ] Full marketplace launch

---

## 🤝 Join the Community

### We Need You!

- **Developers**: Build dApps and tools
- **Testers**: Help us find bugs
- **Validators**: Run nodes (mainnet)
- **Users**: Try the network and provide feedback

### Get Involved

- **GitHub**: [github.com/axionaxprotocol](https://github.com/axionaxprotocol)
- **Issues**: Report bugs or request features
- **PRs**: Contribute to open-source repos
- **Discord**: Coming soon - stay tuned!

---

## 📊 Live Statistics

Current network status (as of Nov 20, 2025):

```
Block Height:    ~34,560 (growing)
Validators:      2/2 online
Uptime:          99.9%+
Avg Block Time:  5.0 seconds
Network Hash:    Stable
```

Visit https://axionax.org for real-time metrics!

---

## 🔗 Links

- **Website**: https://axionax.org
- **Explorer**: https://axionax.org/explorer
- **Docs**: https://axionax.org/docs
- **GitHub**: https://github.com/axionaxprotocol
- **Testnet Guide**: [TESTNET_LAUNCH.md](./TESTNET_LAUNCH.md)

---

## 💬 Feedback

We'd love to hear from you! Share your thoughts:

- Open GitHub issues for bugs
- Suggest features via discussions
- Share your experience on social media
- Help improve our documentation

---

## 🙏 Thank You

Special thanks to:
- Our early testers and supporters
- The open-source community
- Everyone who believed in the vision

**Let's build the future of decentralized compute together!** 🚀

---

<div align="center">

**Axionax Protocol**

*Powering the Future of Compute*

[Website](https://axionax.org) • [GitHub](https://github.com/axionaxprotocol) • [Docs](https://axionax.org/docs)

</div>
