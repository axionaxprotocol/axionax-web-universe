#!/bin/bash
# fix-nginx-rpc-endpoints.sh
# แก้ไข Nginx config เพื่อเพิ่ม /api/rpc/eu และ /api/rpc/au endpoints
# รันบน Infrastructure Node (217.216.109.5)
set -e

echo "🔧 Fixing Nginx RPC Endpoints"
echo "=============================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

CONFIG_FILE="/etc/nginx/sites-available/axionax-web"
BACKUP_FILE="/etc/nginx/sites-available/axionax-web.backup.$(date +%Y%m%d-%H%M%S)"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# Remove broken symlink if exists
if [ -L "/etc/nginx/conf.d/axionax.conf" ]; then
    echo -e "${YELLOW}Removing broken symlink...${NC}"
    rm -f /etc/nginx/conf.d/axionax.conf
fi

# Backup current config
echo -e "${YELLOW}Creating backup...${NC}"
cp "$CONFIG_FILE" "$BACKUP_FILE"
echo -e "${GREEN}✓ Backup: $BACKUP_FILE${NC}"

# Check if endpoints already exist
if grep -q "/api/rpc/eu" "$CONFIG_FILE"; then
    echo -e "${GREEN}✓ /api/rpc/eu already exists${NC}"
else
    echo -e "${YELLOW}Adding /api/rpc/eu and /api/rpc/au endpoints...${NC}"
    
    # Create new config with endpoints inserted before the last closing brace
    # We'll use sed to insert before the last }
    
    NEW_LOCATIONS='
    # RPC Proxy - EU Validator (added by fix script)
    location = /api/rpc/eu {
        limit_req zone=api burst=30 nodelay;
        proxy_pass http://217.76.61.116:8545/;
        proxy_http_version 1.1;
        proxy_set_header Host 217.76.61.116:8545;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_hide_header Access-Control-Allow-Origin;
        proxy_hide_header Access-Control-Allow-Methods;
        proxy_hide_header Access-Control-Allow-Headers;
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;
        
        if ($request_method = '"'"'OPTIONS'"'"') {
            return 204;
        }
    }

    # RPC Proxy - AU Validator (added by fix script)
    location = /api/rpc/au {
        limit_req zone=api burst=30 nodelay;
        proxy_pass http://46.250.244.4:8545/;
        proxy_http_version 1.1;
        proxy_set_header Host 46.250.244.4:8545;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_hide_header Access-Control-Allow-Origin;
        proxy_hide_header Access-Control-Allow-Methods;
        proxy_hide_header Access-Control-Allow-Headers;
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;
        
        if ($request_method = '"'"'OPTIONS'"'"') {
            return 204;
        }
    }
'

    # Find the line number of "location /health" and insert after that block
    # Or find the last } and insert before it
    
    # Using awk to insert before the last closing brace of the HTTPS server block
    awk -v new_loc="$NEW_LOCATIONS" '
    {
        # Store all lines
        lines[NR] = $0
    }
    END {
        # Find the last } that closes the server block
        last_brace = 0
        for (i = NR; i >= 1; i--) {
            if (lines[i] ~ /^}$/) {
                last_brace = i
                break
            }
        }
        
        # Print all lines, inserting new locations before last brace
        for (i = 1; i <= NR; i++) {
            if (i == last_brace) {
                print new_loc
            }
            print lines[i]
        }
    }
    ' "$BACKUP_FILE" > "$CONFIG_FILE"
    
    echo -e "${GREEN}✓ Endpoints added${NC}"
fi

# Test nginx config
echo -e "${YELLOW}Testing nginx configuration...${NC}"
if nginx -t 2>&1; then
    echo -e "${GREEN}✓ Nginx config is valid${NC}"
    
    # Reload nginx
    echo -e "${YELLOW}Reloading nginx...${NC}"
    systemctl reload nginx
    echo -e "${GREEN}✓ Nginx reloaded${NC}"
else
    echo -e "${RED}✗ Nginx config test failed!${NC}"
    echo -e "${YELLOW}Restoring backup...${NC}"
    cp "$BACKUP_FILE" "$CONFIG_FILE"
    echo -e "${GREEN}✓ Backup restored${NC}"
    exit 1
fi

# Test endpoints
echo ""
echo -e "${YELLOW}Testing endpoints...${NC}"
sleep 2

echo -n "   /api/rpc/eu: "
EU_RESULT=$(curl -s -X POST https://axionax.org/api/rpc/eu \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    --connect-timeout 5 2>/dev/null || echo "FAILED")

if echo "$EU_RESULT" | grep -q "result"; then
    BLOCK=$(echo "$EU_RESULT" | grep -oP '"result":"0x[0-9a-fA-F]+"' | cut -d'"' -f4)
    DECIMAL=$((16#${BLOCK#0x}))
    echo -e "${GREEN}✓ OK${NC} (Block: $DECIMAL)"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "   Response: $EU_RESULT"
fi

echo -n "   /api/rpc/au: "
AU_RESULT=$(curl -s -X POST https://axionax.org/api/rpc/au \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    --connect-timeout 5 2>/dev/null || echo "FAILED")

if echo "$AU_RESULT" | grep -q "result"; then
    BLOCK=$(echo "$AU_RESULT" | grep -oP '"result":"0x[0-9a-fA-F]+"' | cut -d'"' -f4)
    DECIMAL=$((16#${BLOCK#0x}))
    echo -e "${GREEN}✓ OK${NC} (Block: $DECIMAL)"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "   Response: $AU_RESULT"
fi

echo ""
echo "=============================="
echo -e "${GREEN}✅ Done!${NC}"
echo ""
echo "Backup saved at: $BACKUP_FILE"
