#!/bin/bash
# Run on VPS (217.216.109.5) to check why site shows old content.
# Usage: ssh root@217.216.109.5 'bash -s' < scripts/vps-standalone-check.sh

set -e
REMOTE_PATH="${REMOTE_PATH:-/var/www/axionax}"

echo "=== 1. Path $REMOTE_PATH ==="
ls -la "$REMOTE_PATH" 2>/dev/null | head -20 || echo "Directory missing or empty"

echo ""
echo "=== 2. Node process (server.js) ==="
pgrep -af "node server.js" || echo "No node server.js process running - site will not update until you start it"

echo ""
echo "=== 3. Port 3000 ==="
ss -tlnp | grep 3000 || echo "Nothing listening on 3000 - start: cd $REMOTE_PATH && PORT=3000 node server.js"

echo ""
echo "=== 4. Nginx upstream (must point to 127.0.0.1:3000 for standalone) ==="
grep -r "3000\|proxy_pass\|root.*axionax" /etc/nginx/ 2>/dev/null | head -20 || echo "Adjust Nginx to proxy_pass to http://127.0.0.1:3000"

echo ""
echo "=== 5. Start app (if not running) ==="
echo "  cd $REMOTE_PATH && PORT=3000 nohup node server.js > server.log 2>&1 &"
echo "  Or install PM2: npm i -g pm2 && pm2 start server.js --name axionax-web && pm2 save && pm2 startup"
