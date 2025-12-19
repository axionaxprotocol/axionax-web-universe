#!/bin/bash
# Script to start/restart Axionax Validator service
# Run this ON the validator server (217.76.61.116 or 46.250.244.4)
set -e

echo "🚀 Axionax Validator Service Manager"
echo "======================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root: sudo $0"
    exit 1
fi

# Check current status
echo "📊 Current status:"
systemctl status axionax-validator --no-pager || true
echo ""

# Check if binary exists
if [ ! -f /usr/local/bin/axionax ]; then
    echo "❌ Binary not found at /usr/local/bin/axionax"
    echo "Please ensure the validator is properly installed."
    exit 1
fi

# Restart validator
echo "🔄 Restarting validator service..."
systemctl restart axionax-validator

# Wait for startup
echo "⏳ Waiting for service to start..."
sleep 10

# Check status again
echo ""
echo "📊 New status:"
systemctl status axionax-validator --no-pager

# Test RPC endpoint
echo ""
echo "🧪 Testing local RPC..."
RESPONSE=$(curl -s -X POST http://localhost:8545 \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  --connect-timeout 5 2>/dev/null || echo "FAILED")

if echo "$RESPONSE" | grep -q "result"; then
    BLOCK=$(echo "$RESPONSE" | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
    DECIMAL=$((16#${BLOCK#0x}))
    echo "✅ RPC is working! Current block: $DECIMAL"
else
    echo "❌ RPC test failed"
    echo "Response: $RESPONSE"
    echo ""
    echo "Check logs with: journalctl -u axionax-validator -n 50"
fi

echo ""
echo "======================================"
echo "Done!"
