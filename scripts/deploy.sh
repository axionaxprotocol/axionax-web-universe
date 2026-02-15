#!/bin/bash
# Deploy ทั้ง monorepo ไป VPS แล้วรัน docker-compose (รันจาก repo root: ./scripts/deploy.sh)

set -e
cd "$(dirname "$0")/.."

# Configuration
VPS_IP="${VPS_IP:-217.216.109.5}"
USER="${USER:-root}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/axionax-marketplace}"

echo "🚀 Deploying to $VPS_IP..."

# Create remote directory
ssh $USER@$VPS_IP "mkdir -p $REMOTE_DIR"

# Copy files
echo "📦 Copying files..."
scp -r apps packages package.json pnpm-lock.yaml pnpm-workspace.yaml docker-compose.yml $USER@$VPS_IP:$REMOTE_DIR

# Deploy
echo "🐳 Building and starting containers..."
ssh $USER@$VPS_IP "cd $REMOTE_DIR && docker-compose up -d --build"

echo "✅ Deployment complete! Visit http://$VPS_IP"
