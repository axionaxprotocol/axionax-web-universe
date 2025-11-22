# axionax Web - Simple VPS Deployment Script
# Usage: .\deploy-simple.ps1

param(
    [switch]$SkipTests,
    [switch]$SkipBuild
)

$VPS_IP = "217.216.109.5"
$SSH_USER = "root"
$DEPLOY_PATH = "/opt/axionax-web"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " axionax Web - VPS Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VPS: ${SSH_USER}@${VPS_IP}" -ForegroundColor Yellow
Write-Host ""

# Step 1: Check directory
if (-not (Test-Path "package.json")) {
    Write-Host "[ERROR] package.json not found!" -ForegroundColor Red
    Write-Host "Please run from axionax-web directory" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Found package.json" -ForegroundColor Green

# Step 2: Check git status
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "[WARN] Uncommitted changes found" -ForegroundColor Yellow
    git status --short
}

# Step 3: Build (optional)
if (-not $SkipBuild) {
    Write-Host "`n[BUILD] Building production..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] Build successful" -ForegroundColor Green
}

# Step 4: Commit and push
Write-Host "`n[GIT] Committing changes..." -ForegroundColor Yellow
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "deploy: Update from Windows - $timestamp" 2>&1 | Out-Null

Write-Host "[GIT] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARN] Git push had issues, but continuing..." -ForegroundColor Yellow
}

# Step 5: Deploy to VPS
Write-Host "`n[DEPLOY] Connecting to VPS..." -ForegroundColor Yellow
Write-Host "(Enter SSH password when prompted)" -ForegroundColor Gray
Write-Host ""

# Create a simple deploy command
$commands = @"
cd $DEPLOY_PATH
echo '[VPS] Pulling from GitHub...'
git pull origin main
echo '[VPS] Rebuilding containers...'
docker-compose down
docker-compose up -d --build
echo '[VPS] Waiting for services...'
sleep 10
echo '[VPS] Checking status...'
docker-compose ps
echo '[VPS] Done!'
"@

# Execute on VPS
$commands | ssh ${SSH_USER}@${VPS_IP}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host " Deployment Successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Website: http://$VPS_IP" -ForegroundColor Cyan
    Write-Host "HTTPS:   https://axionax.org" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "`n[ERROR] Deployment failed!" -ForegroundColor Red
    Write-Host "Check SSH connection and try again" -ForegroundColor Red
    exit 1
}
