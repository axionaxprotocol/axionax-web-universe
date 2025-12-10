#!/bin/bash

# Deploy axionax Web to VPS 217.216.109.5
# Updated: December 2025
set -e

VPS_IP="217.216.109.5"
VPS_USER="root"
# VPS_PASS should be set in environment variable
REMOTE_DIR="/var/www/axionax"
LOCAL_OUT_DIR="./out"
BACKUP_DIR="/var/backups/axionax"

echo "🚀 Deploying axionax Web to VPS ${VPS_IP}"
echo "=========================================="
echo "📅 $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check for password
if [ -z "$VPS_PASS" ]; then
    echo -e "${RED}Error: VPS_PASS environment variable is not set.${NC}"
    echo "Usage: VPS_PASS='your_password' ./scripts/deploy-to-vps.sh"
    exit 1
fi

# SSH and RSYNC with sshpass
SSH_CMD="sshpass -p ${VPS_PASS} ssh -o StrictHostKeyChecking=no"
RSYNC_CMD="sshpass -p ${VPS_PASS} rsync"

# Check if out directory exists
if [ ! -d "$LOCAL_OUT_DIR" ]; then
    echo -e "${YELLOW}Building static site...${NC}"
    npm run build
else
    echo -e "${GREEN}✓ Build directory exists${NC}"
fi

# Create remote directory and backup
echo -e "${YELLOW}Setting up remote directory and backup...${NC}"
$SSH_CMD ${VPS_USER}@${VPS_IP} << ENDSSH
mkdir -p ${REMOTE_DIR}
mkdir -p ${BACKUP_DIR}

# Backup current deployment
if [ -d "${REMOTE_DIR}" ] && [ "\$(ls -A ${REMOTE_DIR} 2>/dev/null)" ]; then
    BACKUP_FILE="${BACKUP_DIR}/axionax-web-\$(date +%Y%m%d-%H%M%S).tar.gz"
    tar -czf "\$BACKUP_FILE" -C ${REMOTE_DIR} . 2>/dev/null || true
    echo "✅ Backup created: \$BACKUP_FILE"
    
    # Keep only last 5 backups
    ls -t ${BACKUP_DIR}/*.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true
fi
ENDSSH

# Sync files to VPS
echo -e "${YELLOW}Uploading files to VPS...${NC}"
$RSYNC_CMD -avz --delete \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    -e "ssh -o StrictHostKeyChecking=no" \
    ${LOCAL_OUT_DIR}/ ${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/

# Update nginx configuration if needed
echo -e "${YELLOW}Updating nginx configuration...${NC}"
$SSH_CMD ${VPS_USER}@${VPS_IP} << 'ENDSSH'

# 1. Firewall Hardening (UFW)
echo "🔒 Configuring Firewall..."
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
# Block external access to direct RPC/API ports (they are proxied via Nginx)
ufw deny 8545/tcp comment 'Block direct RPC'
ufw deny 3000/tcp comment 'Block direct Web'
ufw deny 3001/tcp comment 'Block direct Explorer API'
ufw deny 3002/tcp comment 'Block direct Faucet API'
# Enable UFW if not already enabled (non-interactive)
ufw --force enable

# 2. Idempotent Nginx Setup
echo "⚙️ Configuring Nginx..."
# Create nginx config for axionax web with SSL
cat > /etc/nginx/sites-available/axionax-web << 'EOF'
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=5r/s;

# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name axionax.org www.axionax.org;
    return 301 https://axionax.org$request_uri;
}

# HTTPS - Main site
server {
    listen 443 ssl http2;
    server_name axionax.org www.axionax.org;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/axionax.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/axionax.org/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    
    root /var/www/axionax;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_comp_level 5;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    
    # Rate limiting for general requests
    limit_req zone=general burst=20 nodelay;
    
    location / {
        try_files $uri $uri/ $uri.html /index.html =404;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy to explorer backend with rate limiting
    location /api/ {
        limit_req zone=api burst=10 nodelay;
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # RPC Proxy for Testnet (EU Validator)
    location /rpc/ {
        limit_req zone=api burst=30 nodelay;
        proxy_pass http://217.76.61.116:8545/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
EOF

# Enable site (Idempotent: ln -sf forces overwrite)
ln -sf /etc/nginx/sites-available/axionax-web /etc/nginx/sites-enabled/

# Test and reload nginx only if config is valid
if nginx -t; then
    systemctl reload nginx
    echo "✅ Nginx configured and reloaded"
else
    echo "❌ Nginx configuration failed! Not reloading."
    exit 1
fi

# Verify deployment
echo "🔍 Verifying deployment..."
if curl -sf http://localhost/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "⚠️ Health check endpoint not responding (this may be normal for static sites)"
fi
ENDSSH

echo ""
echo -e "${GREEN}=========================================="
echo -e "✅ Deployment Complete!"
echo -e "==========================================${NC}"
echo ""
echo "Website is live at:"
echo "  🌐 https://axionax.org"
echo "  🌐 http://${VPS_IP}"
echo ""
echo "To check service status:"
echo "  ssh ${VPS_USER}@${VPS_IP} 'systemctl status nginx'"
echo "  ssh ${VPS_USER}@${VPS_IP} 'docker ps'"
echo ""
echo "To view logs:"
echo "  ssh ${VPS_USER}@${VPS_IP} 'tail -f /var/log/nginx/access.log'"
echo ""
echo "Backups location:"
echo "  ${VPS_USER}@${VPS_IP}:${BACKUP_DIR}"
echo ""
