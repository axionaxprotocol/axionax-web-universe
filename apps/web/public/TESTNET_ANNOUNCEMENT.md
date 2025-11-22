# 🚀 Axionax Public Testnet Launch Announcement

**Date**: November 5, 2025  
**Network**: Axionax Public Testnet  
**Chain ID**: `axionax-testnet-1`

---

## 🎉 We're Live!

We're excited to announce the launch of **Axionax Public Testnet** – a Layer-1 blockchain with Proof of Probabilistic Checking (PoPC) consensus, designed for decentralized compute markets with built-in AI security.

The testnet is now open for developers, validators, and community members to explore, test, and build on the Axionax protocol.

---

## 🌐 Network Information

### Endpoints

| Service | URL | Purpose |
|---------|-----|---------|
| **RPC Node** | https://rpc.axionax.org | JSON-RPC endpoint for transactions |
| **WebSocket** | wss://rpc.axionax.org/ws | Real-time event subscriptions |
| **Block Explorer** | https://explorer.axionax.org | View blocks, transactions, accounts |
| **Testnet Faucet** | https://faucet.axionax.org | Request test AXX tokens |
| **Website** | https://axionax.org | Documentation and resources |

### Network Parameters

- **Chain ID**: `axionax-testnet-1`
- **Block Time**: ~6 seconds
- **Token Symbol**: AXX
- **Consensus**: Proof of Probabilistic Checking (PoPC)
- **Max Validators**: 100
- **Min Validator Stake**: 10,000 AXX

---

## 💰 Get Testnet Tokens

Visit our faucet to receive test AXX tokens:

1. Go to https://faucet.axionax.org
2. Enter your wallet address
3. Complete the verification
4. Receive 100 AXX (once per 24 hours)

*Note: Testnet tokens have no real value and are for testing purposes only.*

---

## 🛠️ For Developers

### Quick Start

**1. Install SDK**
```bash
npm install @axionax/sdk
```

**2. Connect to Testnet**
```typescript
import { AxionaxClient } from '@axionax/sdk';

const client = new AxionaxClient({
  rpcUrl: 'https://rpc.axionax.org',
  chainId: 1001
});

// Get latest block
const block = await client.getLatestBlock();
console.log('Latest block:', block.height);
```

**3. Send Transaction**
```typescript
import { Wallet } from '@axionax/sdk';

const wallet = new Wallet(privateKey, client);

const tx = await wallet.sendTransaction({
  to: '0x...',
  value: '1000000000000000000', // 1 AXX
});

console.log('Transaction hash:', tx.hash);
```

### Resources

- **SDK Documentation**: https://docs.axionax.org/sdk
- **API Reference**: https://docs.axionax.org/api
- **Examples**: https://github.com/axionaxprotocol/axionax-sdk-ts/tree/main/examples
- **Integration Guide**: https://docs.axionax.org/integration

---

## 🎯 Become a Validator

Join the testnet as a validator and help secure the network:

### Requirements
- Ubuntu 20.04+ VPS
- 4GB RAM, 2 CPU cores
- 100GB SSD
- Static IP address
- Minimum stake: 10,000 AXX

### Setup Steps

**1. Install Axionax Node**
```bash
git clone https://github.com/axionaxprotocol/axionax-core.git
cd axionax-core
cargo build --release
```

**2. Initialize Node**
```bash
./target/release/axionax-node init --chain-id axionax-testnet-1
```

**3. Download Genesis**
```bash
wget https://raw.githubusercontent.com/axionaxprotocol/axionax-deploy/main/genesis.json
cp genesis.json ~/.axionax/config/
```

**4. Start Node**
```bash
./target/release/axionax-node start
```

**5. Create Validator**
```bash
./target/release/axionax-node tx staking create-validator \
  --amount=10000000000000000000000axx \
  --pubkey=$(./target/release/axionax-node tendermint show-validator) \
  --moniker="Your Validator Name" \
  --chain-id=axionax-testnet-1 \
  --commission-rate="0.10" \
  --commission-max-rate="0.20" \
  --commission-max-change-rate="0.01" \
  --min-self-delegation="1" \
  --from=validator
```

**Full Guide**: https://docs.axionax.org/validators/setup

---

## 🏗️ Build on Axionax

### What You Can Build

- **Compute Marketplaces**: Buy and sell decentralized compute resources
- **AI Model Training**: Distributed machine learning platforms
- **Data Availability**: Decentralized storage solutions
- **DeFi Applications**: Decentralized exchanges, lending protocols
- **NFT Platforms**: Create and trade NFTs
- **Gaming**: On-chain games with compute-intensive logic

### Development Tools

- **TypeScript SDK**: `@axionax/sdk`
- **Block Explorer**: https://explorer.axionax.org
- **RPC Endpoint**: https://rpc.axionax.org
- **Faucet**: https://faucet.axionax.org
- **Documentation**: https://docs.axionax.org

### Testnet Incentives

Early builders and testers may be eligible for:
- Early access to mainnet
- Mainnet token allocation
- Featured in showcase
- Technical support priority

*Details to be announced*

---

## 🌟 Key Features

### Proof of Probabilistic Checking (PoPC)
Novel consensus mechanism that combines:
- Fast block finality
- High throughput
- Energy efficiency
- Security through randomness

### Auto-Selection with Randomness (ASR)
- VRF-based validator selection
- Fair and unpredictable
- Resistant to manipulation

### DeAI Security
- ML-powered fraud detection
- Anomaly detection
- Automated threat response

### EVM Compatible
- Deploy Solidity contracts
- Use existing Ethereum tools
- Familiar developer experience

---

## 📊 Testnet Phases

### Phase 1: Genesis Launch (Current)
- 4 genesis validators
- Basic RPC functionality
- Explorer and faucet online
- Developer SDK available

### Phase 2: Community Validators (Week 2)
- Open validator registration
- Up to 100 validators
- Enhanced monitoring
- Performance optimizations

### Phase 3: Stress Testing (Week 4)
- Load testing campaigns
- Bug bounty program
- Performance benchmarks
- Security audits

### Phase 4: Pre-Mainnet (Week 8)
- Final feature freeze
- Mainnet preparation
- Token migration planning
- Governance activation

---

## 🎯 What to Test

We encourage testing and feedback on:

- ✅ Transaction throughput and speed
- ✅ Validator performance and uptime
- ✅ Smart contract deployment and execution
- ✅ SDK usability and bugs
- ✅ Block explorer features
- ✅ Faucet functionality
- ✅ API endpoints
- ✅ Security vulnerabilities
- ✅ Documentation clarity

---

## 🐛 Report Issues

Found a bug? We want to hear about it!

- **GitHub Issues**: https://github.com/axionaxprotocol/axionax-core/issues
- **Security**: security@axionax.org (for sensitive issues)
- **Discord**: https://discord.gg/axionax (for general questions)

### Bug Bounty

Security researchers: We offer rewards for valid vulnerabilities.
- **Critical**: Up to 10,000 AXX (mainnet tokens)
- **High**: Up to 5,000 AXX
- **Medium**: Up to 1,000 AXX
- **Low**: Up to 100 AXX

*Terms and conditions apply*

---

## 📞 Get Support

### Community
- **Discord**: https://discord.gg/axionax
- **Telegram**: https://t.me/axionax
- **Twitter**: @AxionaxProtocol
- **Forum**: https://forum.axionax.org

### Resources
- **Documentation**: https://docs.axionax.org
- **Blog**: https://blog.axionax.org
- **GitHub**: https://github.com/axionaxprotocol
- **Status Page**: https://status.axionax.org

### Team
- **General**: hello@axionax.org
- **Technical**: tech@axionax.org
- **Business**: partnerships@axionax.org

---

## 🗓️ Upcoming Events

### Week 1: Launch Week
- **Nov 6**: Developer workshop (Discord)
- **Nov 8**: AMA with core team
- **Nov 10**: Validator onboarding session

### Week 2: Building Week
- **Nov 13**: Smart contract workshop
- **Nov 15**: Hackathon kickoff
- **Nov 17**: Office hours with devs

### Week 4: Competition Week
- **Nov 27**: Testnet competition begins
- **Dec 1**: Bug bounty program launches
- **Dec 4**: Results announcement

*All times in UTC. Check Discord for updates.*

---

## 🙏 Thank You

Special thanks to:
- Our early contributors and testers
- The validator community
- Open-source projects we build upon
- Everyone who believed in the vision

---

## 🚀 Join the Revolution

Axionax is building the future of decentralized compute. Join us in creating a more efficient, secure, and accessible blockchain infrastructure.

**Get Started Today:**
1. ✅ Get testnet tokens: https://faucet.axionax.org
2. ✅ Install SDK: `npm install @axionax/sdk`
3. ✅ Join Discord: https://discord.gg/axionax
4. ✅ Read docs: https://docs.axionax.org
5. ✅ Start building!

---

**Happy testing! 🎉**

*Follow our progress: [Twitter](https://twitter.com/AxionaxProtocol) | [Discord](https://discord.gg/axionax) | [GitHub](https://github.com/axionaxprotocol)*
