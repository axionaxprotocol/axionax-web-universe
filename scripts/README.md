# Scripts

สคริปต์ระดับ monorepo (deploy, VPS, validators, DB)

| สคริปต์ | ใช้เมื่อ |
|--------|----------|
| **deploy.sh** | Deploy ทั้ง repo ไป VPS แล้วรัน docker-compose (จาก root: `./scripts/deploy.sh`) |
| **vps-setup-from-git.sh** | รันบน VPS: clone/pull, build web, รัน Next.js standalone (ตั้งครั้งแรก) |
| **vps-update-and-restart.sh** | รันบน VPS: pull, build, restart (อัปเดตครั้งถัดไป) |
| **vps-standalone-check.sh** | เช็คว่า process/port 3000 และ Nginx บน VPS ตั้งถูกไหม |
| **check-validators.sh** | เช็คสถานะ validator nodes |
| **check-vps.bat** | เช็ค VPS (Windows) |
| **fix-nginx-rpc-endpoints.sh** | แก้ Nginx RPC endpoints |
| **fix-validators-on-server.sh** | แก้ validators บน server |
| **update-infra-v1.9.0.sh** | อัปเดต infrastructure v1.9.0 |
| **init-db.sql** | SQL สำหรับ init DB |
| **check_vps.py** | เช็ค VPS (Python) |
| **debug_build.py** | debug build |
| **deploy.py** | deploy (Python) |
| **fix_firewall.py** | แก้ firewall |
| **rebuild_vps.py** | rebuild VPS |

**Deploy จาก Windows (แนะนำ):** จาก root รัน `.\deploy-vps.ps1` — ดู [docs/DEPLOY.md](../docs/DEPLOY.md)
