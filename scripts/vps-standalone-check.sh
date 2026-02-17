#!/bin/bash
# ==========================================================
#  VPS Health Check — Axionax Web Hosting
#  Usage: ssh root@217.216.109.5 'bash -s' < scripts/vps-standalone-check.sh
# ==========================================================

APP_DIR="${APP_DIR:-/opt/axionax-web-universe}"
WEB_DIR="$APP_DIR/apps/web"
STANDALONE_DIR="$WEB_DIR/.next/standalone"
# outputFileTracingRoot = monorepo root → server.js อยู่ที่ standalone/apps/web/server.js
SERVER_JS="$STANDALONE_DIR/apps/web/server.js"
PORT="${PORT:-3000}"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass()  { echo -e "  ${GREEN}✓${NC} $1"; }
fail()  { echo -e "  ${RED}✗${NC} $1"; }
warn()  { echo -e "  ${YELLOW}!${NC} $1"; }

echo ""
echo "================================================"
echo "  Axionax Web — VPS Health Check"
echo "  $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "================================================"
echo ""

# ──────────────────────────────────────────────
# 1. System Requirements
# ──────────────────────────────────────────────
echo "── 1. System Requirements ──"

if command -v node &>/dev/null; then
  pass "Node.js: $(node -v)"
else
  fail "Node.js: NOT FOUND"
fi

if command -v pnpm &>/dev/null; then
  pass "pnpm: $(pnpm -v)"
else
  warn "pnpm: NOT FOUND (needed for builds, not runtime)"
fi

if command -v git &>/dev/null; then
  pass "git: $(git --version 2>&1 | head -1)"
else
  warn "git: NOT FOUND"
fi

if command -v pm2 &>/dev/null; then
  pass "PM2: $(pm2 -v 2>/dev/null)"
else
  fail "PM2: NOT FOUND — install: npm i -g pm2"
fi

if command -v nginx &>/dev/null; then
  pass "Nginx: $(nginx -v 2>&1)"
else
  warn "Nginx: NOT FOUND"
fi
echo ""

# ──────────────────────────────────────────────
# 2. Application Files
# ──────────────────────────────────────────────
echo "── 2. Application Files ──"

if [ -d "$APP_DIR" ]; then
  pass "Repo: $APP_DIR"
else
  fail "Repo: $APP_DIR NOT FOUND"
fi

if [ -d "$STANDALONE_DIR" ]; then
  pass "Standalone: $STANDALONE_DIR"
else
  fail "Standalone: NOT FOUND — run: pnpm --filter @axionax/web build"
fi

if [ -f "$SERVER_JS" ]; then
  pass "server.js: $SERVER_JS"
else
  fail "server.js: NOT FOUND at $SERVER_JS"
  # check if it's at old path (pre outputFileTracingRoot fix)
  if [ -f "$STANDALONE_DIR/server.js" ]; then
    warn "  Found server.js at old path: $STANDALONE_DIR/server.js"
    warn "  PM2 should point to: $SERVER_JS (not standalone/server.js)"
  fi
fi

if [ -d "$STANDALONE_DIR/apps/web/.next/static" ]; then
  STATIC_COUNT=$(find "$STANDALONE_DIR/apps/web/.next/static" -type f 2>/dev/null | wc -l)
  pass "Static assets: $STATIC_COUNT files"
else
  fail "Static assets: NOT FOUND — run: mkdir -p $STANDALONE_DIR/apps/web/.next && cp -r $WEB_DIR/.next/static $STANDALONE_DIR/apps/web/.next/"
fi

if [ -d "$STANDALONE_DIR/apps/web/public" ]; then
  pass "Public assets: found"
else
  warn "Public assets: not copied (optional) — cp -r $WEB_DIR/public $STANDALONE_DIR/apps/web/"
fi
echo ""

# ──────────────────────────────────────────────
# 3. PM2 Process
# ──────────────────────────────────────────────
echo "── 3. PM2 Process ──"

if command -v pm2 &>/dev/null; then
  PM2_STATUS=$(pm2 jlist 2>/dev/null)
  PM2_WEB=$(echo "$PM2_STATUS" | python3 -c "
import sys, json
try:
  procs = json.load(sys.stdin)
  for p in procs:
    if 'axionax-web' in p.get('name',''):
      print(f\"status={p['pm2_env']['status']} restarts={p['pm2_env']['restart_time']} uptime_ms={p['pm2_env'].get('pm_uptime',0)} memory={p.get('monit',{}).get('memory',0)}\")
      break
  else:
    print('NOT_FOUND')
except:
  print('PARSE_ERROR')
" 2>/dev/null)

  if [[ "$PM2_WEB" == "NOT_FOUND" ]]; then
    fail "PM2 process 'axionax-web': NOT FOUND"
    echo "    Start: cd $STANDALONE_DIR && PORT=$PORT pm2 start apps/web/server.js --name axionax-web"
  elif [[ "$PM2_WEB" == "PARSE_ERROR" ]]; then
    warn "PM2: could not parse status"
    pm2 list 2>/dev/null | sed 's/^/    /'
  else
    STATUS=$(echo "$PM2_WEB" | grep -oP 'status=\K\w+')
    RESTARTS=$(echo "$PM2_WEB" | grep -oP 'restarts=\K\d+')
    MEMORY=$(echo "$PM2_WEB" | grep -oP 'memory=\K\d+')
    MEMORY_MB=$((MEMORY / 1024 / 1024))

    if [[ "$STATUS" == "online" ]]; then
      pass "PM2 axionax-web: ONLINE (restarts: $RESTARTS, memory: ${MEMORY_MB}MB)"
    elif [[ "$STATUS" == "stopped" ]]; then
      fail "PM2 axionax-web: STOPPED (restarts: $RESTARTS)"
      echo "    Check: pm2 logs axionax-web --err --lines 30"
      echo "    Restart: pm2 restart axionax-web"
    else
      warn "PM2 axionax-web: $STATUS (restarts: $RESTARTS)"
    fi
  fi
else
  fail "PM2 not installed"
fi
echo ""

# ──────────────────────────────────────────────
# 4. Port & HTTP Check
# ──────────────────────────────────────────────
echo "── 4. Port $PORT ──"

if ss -tlnp 2>/dev/null | grep -q ":$PORT "; then
  pass "Port $PORT is listening"
  ss -tlnp 2>/dev/null | grep ":$PORT " | sed 's/^/    /'
else
  fail "Nothing listening on port $PORT"
fi
echo ""

echo "── 5. HTTP Response ──"

if command -v curl &>/dev/null; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://127.0.0.1:$PORT" 2>/dev/null)
  if [[ "$HTTP_CODE" == "200" ]]; then
    pass "http://127.0.0.1:$PORT → HTTP $HTTP_CODE OK"
  elif [[ "$HTTP_CODE" == "000" ]]; then
    fail "http://127.0.0.1:$PORT → No response (app not running?)"
  else
    warn "http://127.0.0.1:$PORT → HTTP $HTTP_CODE"
  fi
else
  warn "curl not available — skipping HTTP check"
fi
echo ""

# ──────────────────────────────────────────────
# 5. Nginx
# ──────────────────────────────────────────────
echo "── 6. Nginx ──"

if command -v nginx &>/dev/null; then
  NGINX_TEST=$(nginx -t 2>&1)
  if echo "$NGINX_TEST" | grep -q "successful"; then
    pass "Nginx config: valid"
  else
    fail "Nginx config: invalid"
    echo "$NGINX_TEST" | sed 's/^/    /'
  fi

  if systemctl is-active --quiet nginx 2>/dev/null; then
    pass "Nginx service: running"
  else
    fail "Nginx service: NOT running — sudo systemctl start nginx"
  fi

  PROXY_CONF=$(grep -rl "proxy_pass.*127.0.0.1:$PORT\|proxy_pass.*localhost:$PORT\|upstream.*$PORT" /etc/nginx/ 2>/dev/null | head -3)
  if [ -n "$PROXY_CONF" ]; then
    pass "Proxy to port $PORT found in:"
    echo "$PROXY_CONF" | sed 's/^/    /'
  else
    fail "No Nginx proxy to port $PORT found"
    echo "    Create: /etc/nginx/sites-available/axionax-web with proxy_pass http://127.0.0.1:$PORT"
  fi
else
  warn "Nginx not installed — skipping"
fi
echo ""

# ──────────────────────────────────────────────
# 6. Disk & Memory
# ──────────────────────────────────────────────
echo "── 7. Resources ──"

DISK_USAGE=$(df -h / 2>/dev/null | tail -1 | awk '{print $5 " used of " $2}')
pass "Disk: $DISK_USAGE"

MEM_INFO=$(free -m 2>/dev/null | awk '/Mem:/{printf "%dMB / %dMB (%.0f%%)", $3, $2, $3/$2*100}')
if [ -n "$MEM_INFO" ]; then
  pass "Memory: $MEM_INFO"
fi
echo ""

# ──────────────────────────────────────────────
# Summary
# ──────────────────────────────────────────────
echo "================================================"
echo "  Quick Commands:"
echo "    Check logs:    pm2 logs axionax-web --lines 30"
echo "    Restart:       pm2 restart axionax-web"
echo "    Full rebuild:  cd $APP_DIR && pnpm --filter @axionax/blockchain-utils build && pnpm --filter @axionax/sdk build && pnpm --filter @axionax/web build"
echo "    Copy static:   mkdir -p $STANDALONE_DIR/apps/web/.next && cp -r $WEB_DIR/.next/static $STANDALONE_DIR/apps/web/.next/"
echo "    Start PM2:     cd $STANDALONE_DIR && PORT=$PORT pm2 start apps/web/server.js --name axionax-web && pm2 save"
echo "================================================"
echo ""
