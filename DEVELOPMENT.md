# Axionax Development Environment
# Quick start scripts for full-stack development

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ & pnpm
- Rust (for core development)

### 1. First Time Setup
```bash
# Clone with submodules
git clone --recursive https://github.com/axionaxprotocol/axionax-web-universe.git
cd axionax-web-universe

# Or if already cloned, init submodules
git submodule update --init --recursive

# Install web dependencies
pnpm install
```

### 2. Development Modes

#### 🌐 Web Only (Connect to Live Testnet)
```bash
# Uses live validators (217.76.61.116, 46.250.244.4)
pnpm dev
```
- Web: http://localhost:3000
- Marketplace: http://localhost:5173

#### 🐳 Full Stack (Local Blockchain)
```bash
# Start all services with Docker
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

Services:
| Service | URL | Description |
|---------|-----|-------------|
| 🦀 Node | http://localhost:8545 | Local blockchain RPC |
| 🌐 Web | http://localhost:3000 | Next.js website |
| 🛒 Marketplace | http://localhost:5173 | React marketplace |
| 💧 Faucet | http://localhost:3002 | Token faucet |
| 📊 Prometheus | http://localhost:9090 | Metrics |
| 📈 Grafana | http://localhost:3030 | Dashboards |
| 🗄️ Adminer | http://localhost:8080 | Database UI |

#### 🦀 Core Development (Rust)
```bash
cd core-universe/core

# Build
cargo build --release

# Test
cargo test --workspace

# Run local node
cargo run --release -- --dev
```

### 3. Common Commands

```bash
# Update submodule to latest
git submodule update --remote core-universe

# Rebuild specific service
docker-compose -f docker-compose.dev.yml build web

# View specific logs
docker-compose -f docker-compose.dev.yml logs -f axionax-node

# Stop all
docker-compose -f docker-compose.dev.yml down

# Clean volumes (reset data)
docker-compose -f docker-compose.dev.yml down -v
```

### 4. Project Structure

```
axionax-web-universe/
├── apps/
│   ├── web/                 # Next.js 14 website
│   ├── marketplace/         # Vite + React marketplace
│   ├── faucet-api/          # Faucet service
│   └── docs/                # Documentation
├── packages/
│   ├── sdk/                 # TypeScript SDK
│   ├── blockchain-utils/    # Chain utilities
│   └── ui/                  # Shared UI components
├── core-universe/           # 👈 Git Submodule
│   ├── core/                # Rust blockchain
│   ├── ops/deploy/          # Deployment scripts
│   └── tools/devtools/      # Testing utilities
├── docker-compose.yml       # Production services
└── docker-compose.dev.yml   # Development services
```

### 5. Environment Variables

Copy example env files:
```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/marketplace/.env.example apps/marketplace/.env
```

### 6. Connecting to Live Testnet

RPC Endpoints:
- **HTTPS (Recommended)**: https://axionax.org/rpc/
- **EU Validator**: http://217.76.61.116:8545
- **AU Validator**: http://46.250.244.4:8545

Chain ID: `86137` (0x15079)

---

## 📚 Documentation

- [Web README](apps/web/README.md)
- [Marketplace README](apps/marketplace/README.md)
- [Core README](core-universe/README.md)
- [SDK README](packages/sdk/README.md)

## 🔗 Links

- **Website**: https://axionax.org
- **Explorer**: https://axionax.org/explorer
- **GitHub**: https://github.com/axionaxprotocol
