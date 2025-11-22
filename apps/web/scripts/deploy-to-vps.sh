#!/bin/bash

# Deploy axionax Web to VPS 217.216.109.5
set -e

VPS_IP="217.216.109.5"
VPS_USER="root"
REMOTE_DIR="/var/www/axionax"
LOCAL_OUT_DIR="./out"

echo "🚀 Deploying axionax Web to VPS ${VPS_IP}"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if out directory exists
if [ ! -d "$LOCAL_OUT_DIR" ]; then
    echo -e "${YELLOW}Building static site...${NC}"
    npm run build
else
    echo -e "${GREEN}✓ Build directory exists${NC}"
fi

# Create remote directory if it doesn't exist
echo -e "${YELLOW}Setting up remote directory...${NC}"
ssh ${VPS_USER}@${VPS_IP} "mkdir -p ${REMOTE_DIR}"

# Sync files to VPS
echo -e "${YELLOW}Uploading files to VPS...${NC}"
rsync -avz --delete \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    ${LOCAL_OUT_DIR}/ ${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/

# Update nginx configuration if needed
echo -e "${YELLOW}Updating nginx configuration...${NC}"
ssh ${VPS_USER}@${VPS_IP} << 'ENDSSH'
# Create nginx config for axionax web with SSL
cat > /etc/nginx/sites-available/axionax-web << 'EOF'
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
    
    root /var/www/axionax;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    location / {
        try_files $uri $uri/ $uri.html /index.html =404;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy to explorer backend
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # RPC Proxy for Testnet (EU Validator)
    location /rpc/ {
        proxy_pass http://217.76.61.116:8545/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/axionax-web /etc/nginx/sites-enabled/

# Test and reload nginx
nginx -t && systemctl reload nginx

echo "✅ Nginx configured and reloaded"
ENDSSH

echo ""
echo -e "${GREEN}=========================================="
echo -e "✅ Deployment Complete!"
echo -e "==========================================${NC}"
echo ""
echo "Website is live at:"
echo "  🌐 http://${VPS_IP}"
echo ""
echo "To check nginx status:"
echo "  ssh ${VPS_USER}@${VPS_IP} 'systemctl status nginx'"
echo ""
echo "To view nginx logs:"
echo "  ssh ${VPS_USER}@${VPS_IP} 'tail -f /var/log/nginx/access.log'"
echo ""
