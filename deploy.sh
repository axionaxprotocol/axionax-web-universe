#!/bin/bash

# Configuration
VPS_IP="217.216.109.5"
USER="root" # Assuming root, change if needed
REMOTE_DIR="/var/www/axionax-marketplace"

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
