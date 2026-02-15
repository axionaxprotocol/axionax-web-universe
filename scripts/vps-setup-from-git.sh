#!/bin/bash
# รันบน VPS ครั้งเดียว: clone/pull repo แล้ว build + รัน Next.js (standalone)
# ใช้เมื่ออยากเริ่มใหม่หรือตั้งเซิร์ฟเวอร์ใหม่
# Usage: ส่งไปรันบนเซิร์ฟเวอร์ หรือ copy-paste ทีละบล็อก

set -e

# --- ตั้งค่า (แก้ได้) ---
REPO_URL="${REPO_URL:-https://github.com/axionaxprotocol/axionax-web-universe.git}"
BRANCH="${BRANCH:-main}"
APP_DIR="${APP_DIR:-/opt/axionax-web-universe}"
WEB_DIR="$APP_DIR/apps/web"
RUN_DIR="$APP_DIR/apps/web/.next/standalone"   # หลัง build จะมี server.js ตรงนี้
PORT="${PORT:-3000}"
NODE_BIN="${NODE_BIN:-/usr/bin/node}"

# --- 1. ติดตั้ง Node 20 + pnpm (ถ้ายังไม่มี) ---
if ! command -v node &>/dev/null; then
  echo "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
if ! command -v pnpm &>/dev/null; then
  echo "Installing pnpm..."
  npm install -g pnpm
fi

# --- 2. Clone หรือ Pull ---
if [ -d "$APP_DIR/.git" ]; then
  echo "Pull latest..."
  cd "$APP_DIR" && git pull origin "$BRANCH"
else
  echo "Clone repo..."
  mkdir -p "$(dirname "$APP_DIR")"
  git clone --depth 1 -b "$BRANCH" "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

# --- 3. Install + Build ---
echo "Install dependencies..."
pnpm install --frozen-lockfile
echo "Build web (standalone)..."
pnpm --filter @axionax/web build

# --- 4. เตรียม standalone (copy static เข้าไป) ---
mkdir -p "$WEB_DIR/.next/standalone/.next"
cp -r "$WEB_DIR/.next/static" "$WEB_DIR/.next/standalone/.next/" 2>/dev/null || true

# --- 5. รัน (ฆ่าตัวเก่าก่อน) ---
pkill -f "node.*server.js" 2>/dev/null || true
sleep 2
cd "$WEB_DIR/.next/standalone"
PORT=$PORT nohup $NODE_BIN server.js > server.log 2>&1 &
echo "Started. Port $PORT. Log: $WEB_DIR/.next/standalone/server.log"
echo "Check: ss -tlnp | grep $PORT"
