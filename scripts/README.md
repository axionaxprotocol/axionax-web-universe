# Scripts

Monorepo-level scripts (deploy, VPS, validators, DB)

| Script | Use when |
|--------|----------|
| **deploy.sh** | Deploy full repo to VPS and run docker-compose (from root: `./scripts/deploy.sh`) |
| **vps-setup-from-git.sh** | Run on VPS: clone/pull, build web, run Next.js standalone (initial setup) |
| **vps-update-and-restart.sh** | Run on VPS: pull, build, restart (subsequent updates) |
| **vps-standalone-check.sh** | Verify process/port 3000 and Nginx on VPS are configured correctly |
| **check-validators.sh** | Check validator node status |
| **check-vps.bat** | Check VPS (Windows) |
| **fix-nginx-rpc-endpoints.sh** | Fix Nginx RPC endpoints |
| **fix-validators-on-server.sh** | Fix validators on server |
| **update-infra-v1.9.0.sh** | Update infrastructure v1.9.0 |
| **init-db.sql** | SQL for DB init |
| **check_vps.py** | Check VPS (Python) |
| **debug_build.py** | Debug build |
| **deploy.py** | Deploy (Python) |
| **fix_firewall.py** | Fix firewall |
| **rebuild_vps.py** | Rebuild VPS |

**Deploy from Windows (recommended):** From root run `.\deploy-vps.ps1` — see [docs/DEPLOY.md](../docs/DEPLOY.md)
