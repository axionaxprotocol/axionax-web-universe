# เตรียมโฮสต์เว็บ (Website Hosting Guide)

คู่มือตั้งค่า hosting เว็บ axionax ตั้งแต่ต้น — เลือกได้ 2 ทาง

| ทาง | เหมาะกับ | สรุป |
|-----|----------|------|
| **1. Build บนเซิร์ฟเวอร์** | เริ่มใหม่, VPS เปล่า | Clone repo บน VPS → build → รันด้วย PM2 → ตั้ง Nginx |
| **2. Build ที่เครื่องแล้วส่งขึ้นไป** | อัปเดตบ่อยจาก PC | รัน `deploy-vps.ps1` จาก Windows → ส่งไฟล์ขึ้น VPS → restart |

---

## ทางที่ 1: Build บนเซิร์ฟเวอร์ (แนะนำสำหรับเริ่มใหม่)

### ขั้นที่ 1 — เตรียม VPS

SSH เข้าเซิร์ฟเวอร์ (เช่น `ssh root@217.216.109.5`) แล้วรัน:

```bash
# อัปเดตระบบ (Ubuntu/Debian)
apt update && apt upgrade -y

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# pnpm + git
npm install -g pnpm
apt-get install -y git
```

ตรวจสอบ: `node -v` (v20.x), `pnpm -v`, `git --version`

---

### ขั้นที่ 2 — Clone, Build, เตรียม Standalone

```bash
# Clone (หรือใช้สคริปต์เดียวด้านล่าง)
export APP_DIR=/opt/axionax-web-universe
git clone --depth 1 -b main https://github.com/axionaxprotocol/axionax-web-universe.git $APP_DIR
cd $APP_DIR

# Install + Build (ต้อง build packages ก่อน — web ใช้ @axionax/sdk, @axionax/blockchain-utils)
pnpm install --frozen-lockfile
pnpm --filter @axionax/blockchain-utils build
pnpm --filter @axionax/sdk build
pnpm --filter @axionax/web build

# เตรียม standalone
# ⚠️ สำคัญ: outputFileTracingRoot ชี้ไป monorepo root
# ทำให้ server.js อยู่ที่ standalone/apps/web/server.js (ไม่ใช่ standalone/server.js)
# static + public ต้อง copy ไปที่ standalone/apps/web/.next/static
mkdir -p apps/web/.next/standalone/apps/web/.next
cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/
cp -r apps/web/public apps/web/.next/standalone/apps/web/ 2>/dev/null || true
```

**ทางลัด — รันสคริปต์เดียว:** (จากเครื่องคุณ ส่งไปรันบนเซิร์ฟเวอร์)

```bash
ssh root@217.216.109.5 'bash -s' < scripts/vps-setup-from-git.sh
```

สคริปต์จะติดตั้ง Node/pnpm ถ้ายังไม่มี, clone, build, และรันแอปชั่วคราว (ขั้นถัดไปแนะนำให้ใช้ PM2 แทน nohup)

---

### ขั้นที่ 3 — รันแอปด้วย PM2 (ให้รันต่อหลัง restart)

บนเซิร์ฟเวอร์:

```bash
# ติดตั้ง PM2
npm install -g pm2

# รันแอป
# ⚠️ สำคัญ: ต้องใช้ path apps/web/server.js (เพราะ outputFileTracingRoot = monorepo root)
cd /opt/axionax-web-universe/apps/web/.next/standalone
PORT=3000 pm2 start apps/web/server.js --name axionax-web

# บันทึก + เปิดรันอัตโนมัติหลัง reboot
pm2 save
pm2 startup
# รันคำสั่งที่ PM2 แนะนำ (มักเป็น env PATH=... pm2 startup ...)
```

ตรวจสอบ: `pm2 list` และ `ss -tlnp | grep 3000`

---

### ขั้นที่ 4 — ตั้ง Nginx (proxy ไปที่ port 3000)

เว็บเป็นแอป Node (Next.js) — **ต้องใช้ proxy ไปที่ 127.0.0.1:3000** ไม่ใช่ `root` ไปโฟลเดอร์ static

1. สร้าง config (แก้ `server_name` และ path SSL ตามจริง):

```bash
sudo nano /etc/nginx/sites-available/axionax-web
```

2. วางเนื้อหาด้านล่าง (สำหรับ HTTP ก่อน — ใส่ SSL ภายหลังได้):

```nginx
# Upstream: แอปรันที่ port 3000
upstream web_frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name axionax.org www.axionax.org;   # แก้เป็น domain หรือ IP

    location /api/ {
        proxy_pass http://web_frontend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://web_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. เปิดใช้และรีโหลด Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/axionax-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### ขั้นที่ 5 — SSL (Optional)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d axionax.org -d www.axionax.org
```

จากนั้น Nginx จะถูก certbot แก้ให้ใช้ HTTPS อัตโนมัติ

---

## ทางที่ 2: Build ที่เครื่องแล้วส่งขึ้นไป

จาก **Windows** (โฟลเดอร์ root ของ repo):

```powershell
.\deploy-vps.ps1
```

- Build แอปแบบ standalone → อัดเป็น tar → ส่งขึ้น VPS → แตกไฟล์ที่ `/var/www/axionax`
- บนเซิร์ฟเวอร์ต้อง **รัน Node** เอง (เช่น PM2) และ **Nginx ต้อง proxy ไปที่ 3000**

รายละเอียดเพิ่ม (ค่าเริ่มต้น, restart, แก้ปัญหา): [DEPLOY.md](DEPLOY.md)

---

## Checklist หลังตั้งค่า

- [ ] `ss -tlnp | grep 3000` — มี process รันที่ port 3000
- [ ] `curl -s http://127.0.0.1:3000 | head -5` — ได้ HTML กลับมา
- [ ] เปิดเว็บผ่าน domain หรือ IP (และ HTTPS ถ้าตั้ง SSL แล้ว)
- [ ] `pm2 restart axionax-web` — restart ได้และเว็บกลับมาทำงาน

---

## เช็คสถานะ VPS (Health Check)

รันสคริปต์เช็ครวดเดียว (จากเครื่องคุณ):

```bash
ssh root@217.216.109.5 'bash -s' < scripts/vps-standalone-check.sh
```

สคริปต์จะเช็ค: Node/PM2/Nginx, ไฟล์ server.js + static, PM2 process, port 3000, HTTP response, disk/memory

### เช็คด้วยมือ (Quick Commands)

```bash
# PM2 สถานะ
pm2 list
pm2 logs axionax-web --lines 20

# Port 3000
ss -tlnp | grep 3000

# HTTP response
curl -I http://127.0.0.1:3000

# Nginx
nginx -t
systemctl status nginx

# Disk + Memory
df -h /
free -m
```

---

## แก้ปัญหาเบื้องต้น

| อาการ | ตรวจสอบ | แก้ |
|--------|----------|-----|
| PM2 stopped / crash loop | `pm2 logs axionax-web --err` | ดู error → แก้ → `pm2 restart axionax-web` |
| `Cannot find module server.js` | path ผิด (outputFileTracingRoot) | ต้องรัน `apps/web/server.js` ไม่ใช่ `server.js` ดูขั้นที่ 3 |
| เปิดเว็บไม่ขึ้น | Port 3000 มี process ไหม | `cd .../standalone && PORT=3000 pm2 start apps/web/server.js --name axionax-web` |
| เปิดผ่าน IP ได้ แต่ผ่าน domain ไม่ได้ | Nginx ชี้ไป 127.0.0.1:3000 ไหม | ตรวจ `proxy_pass http://web_frontend;` และ upstream |
| CSS/JS หาย (หน้าเว็บเปล่า) | static ไม่ได้ copy | `mkdir -p .../standalone/apps/web/.next && cp -r .../apps/web/.next/static .../standalone/apps/web/.next/` |
| หลัง deploy หน้าเว็บยังเก่า | Process เก่ายังรันอยู่ | `pm2 restart axionax-web` หรือ kill แล้ว start ใหม่ |

---

## อัปเดตเว็บ (หลังตั้งครั้งแรกแล้ว)

รันสคริปต์เดียว (จากเครื่องคุณ):

```bash
ssh root@217.216.109.5 'bash -s' < scripts/vps-update-and-restart.sh
```

สคริปต์จะ: `git pull` → build packages → build web → copy static → restart PM2 → verify HTTP 200
