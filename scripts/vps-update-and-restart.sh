#!/bin/bash
# อัปเดตเว็บบน VPS: pull ล่าสุด → build → restart (รันบนเซิร์ฟเวอร์)
# ใช้หลังตั้งครั้งแรกด้วย vps-setup-from-git.sh แล้ว

set -e
APP_DIR="${APP_DIR:-/opt/axionax-web-universe}"
WEB_DIR="$APP_DIR/apps/web"
RUN_DIR="$WEB_DIR/.next/standalone"
PORT="${PORT:-3000}"
NODE_BIN="${NODE_BIN:-/usr/bin/node}"

cd "$APP_DIR"
git pull origin main
pnpm install --frozen-lockfile
pnpm --filter @axionax/web build
mkdir -p "$RUN_DIR/.next"
cp -r "$WEB_DIR/.next/static" "$RUN_DIR/.next/" 2>/dev/null || true

pkill -f "node.*server.js" 2>/dev/null || true
sleep 2
cd "$RUN_DIR"
PORT=$PORT nohup $NODE_BIN server.js >> server.log 2>&1 &
echo "Updated and restarted on port $PORT"
