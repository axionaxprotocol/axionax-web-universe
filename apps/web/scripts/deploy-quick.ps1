<#
.SYNOPSIS
    Quick deploy to VPS (skips tests)
.DESCRIPTION
    Fast deployment script that skips tests and only deploys code changes
#>

$VPS_IP = "217.216.109.5"
$SSH_USER = "root"

Write-Host "`n⚡ Quick Deploy to VPS" -ForegroundColor Cyan
Write-Host "=" * 50

# 1. Commit changes
Write-Host "`n📤 Committing changes..." -ForegroundColor Yellow
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "deploy: Quick update - $timestamp" 2>&1 | Out-Null
git push origin main

# 2. Deploy
Write-Host "🚀 Deploying to ${VPS_IP}..." -ForegroundColor Yellow
Write-Host "(Enter SSH password when prompted)" -ForegroundColor Gray

ssh ${SSH_USER}@${VPS_IP} @"
cd /opt/axionax-web && \
git pull origin main && \
docker-compose up -d --build
"@

Write-Host "`n✅ Quick deploy complete!" -ForegroundColor Green
Write-Host "🌐 View at: http://${VPS_IP}" -ForegroundColor Cyan
