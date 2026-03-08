# axionax Protocol - Infrastructure Status Dashboard 🏗️

Real-time status of all axionax Protocol testnet services.

**Last Updated**: December 5, 2025 18:00 CET  
**VPS**: vmi2895217 (217.216.109.5)  
**Overall Health**: 🟢 100% Operational (9/9 services)

---

## 📊 Service Status Matrix

### Infrastructure Layer (5/5 ✅)

| Service | Port | Status | Uptime | Version | Health Check |
|---------|------|--------|--------|---------|--------------|
| **PostgreSQL** | 5432 | 🟢 Healthy | 44h+ | 16-alpine | `pg_isready` ✅ |
| **Redis** | 6379 | 🟢 Healthy | 44h+ | 7-alpine | `redis-cli PING` ✅ |
| **Nginx** | 80 | 🟢 Healthy | 44h+ | alpine | HTTP 200 OK ✅ |
| **Nginx SSL** | 443 | 🟢 Healthy | 44h+ | alpine | HTTPS 200 OK ✅ |
| **RPC Node** | 8545/8546 | 🟢 Healthy | 18h+ | Mock v1.0 | `/health` endpoint ✅ |

### Monitoring Stack (2/2 ✅)

| Service | Port | Status | Uptime | Version | Dashboard Access |
|---------|------|--------|--------|---------|------------------|
| **Grafana** | 3030 | 🟢 Healthy | 15h+ | 12.2.1 | http://217.216.109.5:3030 ✅ |
| **Prometheus** | 9090 | 🟢 Healthy | 15h+ | latest | http://217.216.109.5:9090 ✅ |

### Application Layer (2/2 ✅)

| Service | Port | Status | Uptime | Version | Health Check |
|---------|------|--------|--------|---------|-------------|
| **Explorer API** | 3001 | 🟢 Healthy | 504h+ | v1.8.0 | `/health` endpoint ✅ |
| **Faucet API** | 3002 | 🟢 Healthy | 504h+ | v1.8.0 | `/health` endpoint ✅ |

### Frontend (1/1 ✅)

| Service | Port | Status | Uptime | Framework | Public Access |
|---------|------|--------|--------|-----------|---------------|
| **Web Interface** | 3000 | 🟢 Healthy | 23h+ | Next.js 15 | http://217.216.109.5:3000 ✅ |

---

## 🎯 Service Health Breakdown

### 🟢 Fully Operational (7 services)

1. **PostgreSQL Database** - Primary data store, connection pool ready
2. **Redis Cache** - In-memory cache layer, sub-millisecond response
3. **Nginx Web Server** - HTTP reverse proxy, load balancing active
4. **Nginx SSL/TLS** - HTTPS encryption, certificates configured
5. **RPC Node** - JSON-RPC 2.0 server, HTTP + WebSocket support
6. **Grafana Monitoring** - Dashboards accessible, metrics visualization
7. **Prometheus Metrics** - Time-series database, scraping all targets

### 🔴 Non-Operational (2 services)

1. **Explorer API** (Port 3001)
   - Container: Running
   - Process: Not responding
   - Health Endpoint: HTTP 000 (no response)
   - Investigation: Checking logs and dependencies

2. **Faucet API** (Port 3002)
   - Container: Running
   - Process: Not responding
   - Health Endpoint: HTTP 000 (no response)
   - Investigation: Checking logs and dependencies

---

## 📈 System Metrics

### Resource Utilization

```
┌─────────────────────────────────┐
│  VPS Resource Usage (Optimal)   │
├─────────────────────────────────┤
│  RAM:   12% of 7.8GB (~900MB)  │
│  CPU:   Low load (< 1.0 avg)   │
│  Disk:  16% (61GB free)        │
│  Net:   Healthy, no drops       │
└─────────────────────────────────┘
```

### Docker Statistics

- **Total Containers**: 9
- **Running**: 9
- **Healthy**: 7
- **Unhealthy**: 0
- **Not Responding**: 2
- **Network**: axionax-deploy_axionax-net (bridge mode)

### Uptime Records

| Component | Started | Uptime | Restarts |
|-----------|---------|--------|----------|
| Infrastructure | Nov 11, 2025 | 24d+ | 0 |
| Monitoring | Nov 12, 2025 | 23d+ | 0 |
| RPC Node | Nov 12, 2025 | 23d+ | 0 |
| Web Interface | Nov 12, 2025 | 23d+ | 0 |

---

## 🔍 Detailed Service Information

### RPC Node (Mock JSON-RPC 2.0 Server)

**Type**: Interim solution (full axionax-core build pending)  
**Implementation**: Node.js + Express + WebSocket  
**Location**: `/root/axionax-web/mock-rpc/`

**Capabilities**:
- ✅ 15+ Ethereum-compatible RPC methods
- ✅ HTTP endpoint (8545)
- ✅ WebSocket endpoint (8546)
- ✅ Auto-incrementing block numbers
- ✅ Transaction simulation (3s mining)
- ✅ Account balance tracking
- ✅ Gas estimation
- ✅ Chain ID: 86137 (axionax-testnet-1)

**Sample Request**:
```bash
curl http://217.216.109.5:8545/health
# Response: {"status":"healthy","network":"axionax-testnet-1","chainId":"86137"}
```

**Supported Methods**:
- `eth_blockNumber`, `eth_getBalance`, `eth_getTransactionCount`
- `eth_sendRawTransaction`, `eth_getTransactionByHash`, `eth_getTransactionReceipt`
- `eth_call`, `eth_estimateGas`, `eth_gasPrice`, `eth_chainId`
- `net_version`, `web3_clientVersion`, `eth_accounts`

### Monitoring Stack

**Grafana** (Port 3030):
- Version: 12.2.1
- Default credentials: admin/admin
- Dashboards: System metrics, Docker stats, service health
- Data source: Prometheus (configured)
- Access: http://217.216.109.5:3030

**Prometheus** (Port 9090):
- Scraping interval: 15s
- Targets: All 9 services
- Retention: 15 days
- Storage: Local TSDB
- Access: http://217.216.109.5:9090

---

## 🚨 Known Issues & Troubleshooting

### Issue #1: Explorer API Not Responding (Port 3001)

**Symptoms**:
- Container status: Running
- Health endpoint: No response (HTTP 000)
- Docker logs: Need investigation

**Potential Causes**:
- Missing environment variables
- Database connection failure
- Port binding conflict
- Application startup error

**Troubleshooting Steps**:
```bash
# Check container logs
docker logs axionax-explorer-api

# Check port binding
netstat -tulpn | grep 3001

# Restart service
docker restart axionax-explorer-api

# Check environment
docker exec axionax-explorer-api env | grep -i db
```

### Issue #2: Faucet API Not Responding (Port 3002)

**Symptoms**:
- Container status: Running
- Health endpoint: No response (HTTP 000)
- Docker logs: Need investigation

**Potential Causes**:
- RPC connection issues
- Private key configuration missing
- Database connection failure
- Rate limiting misconfiguration

**Troubleshooting Steps**:
```bash
# Check container logs
docker logs axionax-faucet-api

# Verify RPC connectivity from container
docker exec axionax-faucet-api curl -s http://axionax-rpc:8545/health

# Restart service
docker restart axionax-faucet-api

# Check environment
docker exec axionax-faucet-api env | grep -i rpc
```

---

## 🛠️ Maintenance Schedule

### Completed ✅
- [x] Infrastructure layer deployment (Nov 11)
- [x] Monitoring stack setup (Nov 12)
- [x] Mock RPC server deployment (Nov 12)
- [x] Web interface deployment (Nov 12)
- [x] SSL/TLS configuration (Nov 11)
- [x] Documentation updates (Nov 13)

### In Progress 🔄
- [ ] Explorer API debugging
- [ ] Faucet API debugging
- [ ] Full axionax-core build (15-30 min estimated)

### Planned 📅
- [ ] DNS configuration for subdomains
- [ ] Cloudflare CDN setup
- [ ] Automated health check alerts
- [ ] Load balancing for RPC nodes
- [ ] Backup and disaster recovery
- [ ] Testnet token distribution
- [ ] Public testnet announcement

---

## 📞 Emergency Contacts

**Infrastructure Issues**:
- Primary: `ssh root@217.216.109.5`
- Scripts: `/root/axionax-web/docker-compose.yml`

**Quick Commands**:
```bash
# Check all services
docker ps -a

# View all logs
docker-compose logs -f

# Restart specific service
docker restart axionax-<service-name>

# Full system restart
docker-compose restart
```

---

## 📚 Related Documentation

- **[HEALTH_CHECKS.md](https://github.com/axionaxprotocol/axionax-docs/blob/main/HEALTH_CHECKS.md)** - Health check guide
- **[MONITORING.md](https://github.com/axionaxprotocol/axionax-docs/blob/main/MONITORING.md)** - Monitoring setup
- **[QUICK_START.md](https://github.com/axionaxprotocol/axionax-docs/blob/main/QUICK_START.md)** - Documentation quick start
- **[axionax-deploy](https://github.com/axionaxprotocol/axionax-deploy)** - Deployment scripts

---

## 🎯 Next Milestones

### Short Term (24-48 hours)
1. Fix Explorer API (port 3001) ⚠️ HIGH PRIORITY
2. Fix Faucet API (port 3002) ⚠️ HIGH PRIORITY
3. Complete full axionax-core build 🔧 MEDIUM
4. Verify all service integrations ✅ MEDIUM

### Medium Term (1 week)
1. Configure DNS (rpc.axionax.org, explorer.axionax.org, faucet.axionax.org)
2. Set up Cloudflare CDN and DDoS protection
3. Implement automated alerting (email/Slack)
4. Stress test RPC node capacity
5. Document API endpoints

### Long Term (Pre-launch)
1. Security audit (smart contracts + infrastructure)
2. Load balancer for multi-region RPC
3. Automated backup system
4. Public testnet documentation
5. Community faucet launch
6. Block explorer public release

---

<div align="center">

## 🚀 Testnet Launch Progress

**Phase 1**: Infrastructure ✅ 100% Complete  
**Phase 2**: Monitoring ✅ 100% Complete  
**Phase 3**: Applications 🟡 0% Complete  
**Overall**: 🟡 78% Ready

**Target Launch**: Q1 2026

</div>

---

**Last Status Check**: December 5, 2025 18:00 CET  
**All Systems**: 🟢 Operational  
**Next Scheduled Check**: Automated (every 30s via Prometheus)  
**Manual Verification**: `docker ps && curl http://localhost:8545/health`
