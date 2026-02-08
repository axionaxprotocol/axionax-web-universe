# Deploy ขึ้น Server

มี 3 ทางหลัก: **CI → VPS** (อัตโนมัติเมื่อ push), **GitHub Pages** (static), และ **VPS เอง** (SSH ส่งไฟล์เอง)

---

## 0. CI/CD → VPS (แนะนำถ้าใช้ GitHub Actions)

- **Workflow:** `.github/workflows/ci-cd.yml`
- **Trigger:** Push ไป `develop` = deploy staging; push ไป `main` = deploy production
- **ขั้นตอน:** Build แอป web แบบ standalone → rsync ขึ้น VPS ผ่าน SSH → (ถ้าตั้งไว้) รันคำสั่ง restart บน server
- **สิ่งที่ต้องตั้ง:** ใน repo → Settings → Secrets and variables → Actions → เลือก environment **staging** / **production** แล้วใส่ secrets: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `REMOTE_PATH`, และถ้าต้องการ restart: `DEPLOY_RESTART_CMD` (เช่น `pm2 restart axionax-web`)
- รายละเอียดการตั้งค่า server และ SSH ดูที่ [apps/web/docs/DEPLOYMENT.md](apps/web/docs/DEPLOYMENT.md) หัวข้อ "CI/CD Deploy (GitHub Actions)"

---

## 1. GitHub Pages (อัตโนมัติเมื่อ push ขึ้น main)

- **Workflow:** `.github/workflows/deploy-pages.yml`
- **Trigger:** Push ไปที่ branch `main` (เมื่อมีเปลี่ยนใน `apps/web/**` หรือ `packages/**`)
- **ขั้นตอน:** Build `@axionax/web` → อัปโหลด `apps/web/out` → Deploy ไป GitHub Pages

**สิ่งที่ต้องทำใน Repo:**

1. เปิด **Settings → Pages**
2. **Source:** เลือก **GitHub Actions**
3. หลัง push ขึ้น `main` workflow จะรันและ deploy ให้
4. ดู URL ได้ที่ **Environments → github-pages** หรือ `https://<org>.github.io/<repo>/`

**ถ้าใช้ custom domain (เช่น axionax.org):** ใส่ใน Settings → Pages → Custom domain และตั้งค่า CNAME ตาม [docs/DNS_SETUP.md](apps/web/docs/DNS_SETUP.md)

---

## 2. VPS (SSH ขึ้น server เอง)

ใช้เมื่อมี VPS (เช่น Linux/Windows) และต้องการ deploy ขึ้น server นั้น

### รันจาก root (แนะนำ — build + อัปโหลด static)

จากโฟลเดอร์ root ของ repo:

```powershell
# Windows PowerShell
.\deploy-vps.ps1
```

- **ทำอะไร:** `pnpm install` → build `@axionax/web` → อัปโหลด `apps/web/out` ไปที่ VPS ผ่าน SCP
- **ค่าเริ่มต้น:** VPS_IP=`217.216.109.5`, VPS_USER=`root`, REMOTE_PATH=`/var/www/axionax`
- **เปลี่ยนค่า:** ตั้ง env หรือส่งพารามิเตอร์ เช่น  
  `$env:VPS_IP="1.2.3.4"; .\deploy-vps.ps1`  
  หรือ  
  `.\deploy-vps.ps1 -VPS_IP 1.2.3.4 -VPS_USER ubuntu -REMOTE_PATH /var/www/html`
- **ข้าม build:** `.\deploy-vps.ps1 -SkipBuild` (ใช้เมื่อ build ไว้แล้ว)

**เงื่อนไข:** ต้อง SSH เข้า VPS ได้ (เช่น `ssh root@217.216.109.5`) และบน server มีโฟลเดอร์ที่ Nginx (หรือ web server อื่น) ชี้ไปที่ `REMOTE_PATH`

### สคริปต์อื่น (ถ้าใช้ flow แบบ git + docker บน server)

| สคริปต์ | รันจาก | หมายเหตุ |
|--------|--------|----------|
| `deploy-vps.ps1` (ที่ root) | โฟลเดอร์ root | **แนะนำ** — build + ส่งเฉพาะ static ขึ้น VPS |
| `apps/web/scripts/deploy-to-vps.ps1` | โฟลเดอร์ `apps/web` | Windows, build + push GitHub แล้วบน server ทำ git pull + docker-compose |
| `apps/web/scripts/deploy-to-vps.sh` | โฟลเดอร์ `apps/web` | Linux/macOS, rsync `out/` ไป VPS (ต้องมี VPS_PASS) |
| `deploy.sh` (ที่ root) | โฟลเดอร์ root | ส่งทั้ง monorepo ไปที่ VPS แล้วรัน `docker-compose` |

### เงื่อนไขสำหรับ VPS

- **SSH:** เข้าได้ด้วย `ssh user@VPS_IP` (และถ้าต้องการ ไม่ใช้ password ให้ใช้ SSH key)
- **ที่อยู่บน server:** สคริปต์ใน repo บางตัวตั้งค่าให้ clone/pull ที่ `/opt/axionax-web` หรือ `/var/www/axionax-marketplace` — ต้องให้ path ตรงกับที่ server มี
- **ถ้าใช้ Docker:** บน server ต้องมี Docker + Docker Compose และมี `docker-compose.yml` ที่ใช้รัน web/API ตามที่ตั้งใจ

### แก้ IP / path ในสคริปต์

- **PowerShell (VPS):** แก้ใน `apps/web/scripts/deploy-to-vps.ps1`  
  - `$VPS_IP`  
  - `$SSH_USER`  
  - `$DEPLOY_PATH`
- **Bash (root):** แก้ใน `deploy.sh`  
  - `VPS_IP`  
  - `USER`  
  - `REMOTE_DIR`

---

## สรุป

- **Deploy ขึ้น server ได้เลยไหม?**
  - **GitHub Pages:** ได้เลย — push ขึ้น `main` แล้วเปิด Pages จาก **GitHub Actions** ใน Settings → Pages
  - **VPS:** ได้ถ้ามี server + SSH และแก้ IP/path ในสคริปต์ให้ตรงกับ server ของคุณ

รายละเอียด VPS แบบเต็ม (Docker, Nginx, DNS): [apps/web/docs/DEPLOYMENT.md](apps/web/docs/DEPLOYMENT.md)
