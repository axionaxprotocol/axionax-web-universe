#!/bin/bash
# Axionax Validator Status Check Script
# Run this from local machine to check validator status

echo "🔍 Checking Axionax Validator Nodes..."
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Validator EU
echo -n "📡 Validator EU (217.76.61.116:8545)... "
EU_RESPONSE=$(curl -s -X POST http://217.76.61.116:8545 \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  --connect-timeout 5 2>/dev/null)

if echo "$EU_RESPONSE" | grep -q "result"; then
    EU_BLOCK=$(echo "$EU_RESPONSE" | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
    EU_DECIMAL=$((16#${EU_BLOCK#0x}))
    echo -e "${GREEN}✓ ONLINE${NC} (Block: $EU_DECIMAL)"
else
    echo -e "${RED}✗ OFFLINE${NC}"
fi

# Check Validator AU
echo -n "📡 Validator AU (46.250.244.4:8545)... "
AU_RESPONSE=$(curl -s -X POST http://46.250.244.4:8545 \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  --connect-timeout 5 2>/dev/null)

if echo "$AU_RESPONSE" | grep -q "result"; then
    AU_BLOCK=$(echo "$AU_RESPONSE" | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
    AU_DECIMAL=$((16#${AU_BLOCK#0x}))
    echo -e "${GREEN}✓ ONLINE${NC} (Block: $AU_DECIMAL)"
else
    echo -e "${RED}✗ OFFLINE${NC}"
fi

# Check via Infrastructure Node proxy
echo ""
echo "🌐 Testing via Infrastructure Node proxy..."
echo -n "   /api/rpc/eu... "
PROXY_EU=$(curl -s -X POST https://axionax.org/api/rpc/eu \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  --connect-timeout 5 2>/dev/null)

if echo "$PROXY_EU" | grep -q "result"; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi

echo -n "   /api/rpc/au... "
PROXY_AU=$(curl -s -X POST https://axionax.org/api/rpc/au \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  --connect-timeout 5 2>/dev/null)

if echo "$PROXY_AU" | grep -q "result"; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi

echo ""
echo "========================================"
echo "Done!"
