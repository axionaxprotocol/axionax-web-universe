# axionax Web - Manual VPS Deployment
# This script provides step-by-step deployment with manual SSH

$VPS_IP = "217.216.109.5"
$SSH_USER = "root"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " axionax Web - Manual Deployment" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Commit and push local changes
Write-Host "[1/3] Committing and pushing to GitHub..." -ForegroundColor Yellow
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
git commit -m "deploy: Update $timestamp"
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Pushed to GitHub`n" -ForegroundColor Green
} else {
    Write-Host "[OK] No new changes to push`n" -ForegroundColor Green
}

# Step 2: Show SSH command
Write-Host "[2/3] Connect to VPS and run these commands:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ssh ${SSH_USER}@${VPS_IP}" -ForegroundColor White
Write-Host ""
Write-Host "# Then run these commands on the VPS:" -ForegroundColor Gray
Write-Host "cd /var/www/axionax-web" -ForegroundColor White
Write-Host "git pull origin main" -ForegroundColor White  
Write-Host "docker-compose down" -ForegroundColor White
Write-Host "docker-compose up -d --build" -ForegroundColor White
Write-Host "docker-compose ps" -ForegroundColor White
Write-Host "exit" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 3: Offer to open SSH
$response = Read-Host "Open SSH connection now? (Y/n)"
if ($response -eq "" -or $response -eq "y" -or $response -eq "Y") {
    Write-Host "`n[3/3] Opening SSH connection..." -ForegroundColor Yellow
    Write-Host "(Copy and paste the commands above)`n" -ForegroundColor Gray
    ssh ${SSH_USER}@${VPS_IP}
} else {
    Write-Host "`n[INFO] Skipped SSH connection" -ForegroundColor Cyan
    Write-Host "Run manually: ssh ${SSH_USER}@${VPS_IP}" -ForegroundColor White
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host " Deployment Instructions Complete" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Website: http://$VPS_IP" -ForegroundColor Cyan
Write-Host "HTTPS:   https://axionax.org`n" -ForegroundColor Cyan
