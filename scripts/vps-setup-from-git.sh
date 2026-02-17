#!/bin/bash
# ==========================================================
#  ตั้งค่า VPS ครั้งแรก: clone repo → build → start PM2 → verify
#  Usage: ssh root@217.216.109.5 'bash -s' < scripts/vps-setup-from-git.sh
# ==========================================================

set -e

# --- ตั้งค่า (แก้ได้) ---
REPO_URL="${REPO_URL:-https://github.com/axionaxprotocol/axionax-web-universe.git}"
BRANCH="${BRANCH:-main}"
APP_DIR="${APP_DIR:-/opt/axionax-web-universe}"
WEB_DIR="$APP_DIR/apps/web"
STANDALONE_DIR="$WEB_DIR/.next/standalone"
PORT="${PORT:-3000}"
PM2_NAME="axionax-web"

echo "================================================"
echo "  Axionax Web — VPS Initial Setup"
echo "================================================"
echo ""

# --- 1. ติดตั้ง Node 20 + pnpm + PM2 (ถ้ายังไม่มี) ---
echo "=== 1. System dependencies ==="
if ! command -v node &>/dev/null; then
  echo "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "  node: $(node -v)"

if ! command -v pnpm &>/dev/null; then
  echo "Installing pnpm..."
  npm install -g pnpm
fi
echo "  pnpm: $(pnpm -v)"

if ! command -v pm2 &>/dev/null; then
  echo "Installing PM2..."
  npm install -g pm2
fi
echo "  pm2: $(pm2 -v 2>/dev/null)"
echo ""

# --- 2. Clone หรือ Pull ---
echo "=== 2. Repository ==="
if [ -d "$APP_DIR/.git" ]; then
  echo "  Pulling latest..."
  cd "$APP_DIR" && git pull origin "$BRANCH"
else
  echo "  Cloning..."
  mkdir -p "$(dirname "$APP_DIR")"
  git clone --depth 1 -b "$BRANCH" "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi
echo ""

# --- 3. Install + Build ---
echo "=== 3. Install + Build ==="
echo "  Installing dependencies..."
pnpm install --frozen-lockfile

echo "  Building packages..."
pnpm --filter @axionax/blockchain-utils build || echo "  (blockchain-utils build failed — continuing)"
pnpm --filter @axionax/sdk build || echo "  (sdk build failed — continuing)"

echo "  Building web (standalone)..."
pnpm --filter @axionax/web build
echo ""

# --- 4. เตรียม standalone ---
# ⚠️ outputFileTracingRoot = monorepo root → server.js อยู่ที่ standalone/apps/web/server.js
echo "=== 4. Prepare standalone ==="
mkdir -p "$STANDALONE_DIR/apps/web/.next"
cp -r "$WEB_DIR/.next/static" "$STANDALONE_DIR/apps/web/.next/"
cp -r "$WEB_DIR/public" "$STANDALONE_DIR/apps/web/" 2>/dev/null || true
echo "  Static & public assets copied"
echo ""

# --- 5. Start PM2 ---
echo "=== 5. Start PM2 ==="
pm2 delete "$PM2_NAME" 2>/dev/null || true
cd "$STANDALONE_DIR"
PORT=$PORT pm2 start apps/web/server.js --name "$PM2_NAME"
pm2 save
pm2 startup 2>/dev/null || true
echo ""

# --- 6. Verify ---
echo "=== 6. Verify ==="
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://127.0.0.1:$PORT" 2>/dev/null || echo "000")
if [[ "$HTTP_CODE" == "200" ]]; then
  echo "  ✓ Web is running at http://127.0.0.1:$PORT (HTTP $HTTP_CODE)"
else
  echo "  ✗ HTTP $HTTP_CODE — check: pm2 logs $PM2_NAME --err --lines 20"
fi

echo ""
echo "================================================"
echo "  Setup complete!"
echo "  Next: Configure Nginx (see docs/HOSTING.md)"
echo "  Health check: bash -s < scripts/vps-standalone-check.sh"
echo "================================================"
