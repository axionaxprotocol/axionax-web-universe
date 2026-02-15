<#
.SYNOPSIS
    Deploy web frontend (Next.js standalone) to VPS
.DESCRIPTION
    Build @axionax/web from monorepo root (standalone), then upload to VPS.
    Default: root@217.216.109.5, /var/www/axionax. On server run: node server.js (or PM2).
.EXAMPLE
    .\deploy-vps.ps1
    .\deploy-vps.ps1 -SkipBuild
    $env:VPS_IP="1.2.3.4"; .\deploy-vps.ps1
#>

param(
    [string]$VPS_IP,
    [string]$VPS_USER,
    [string]$REMOTE_PATH,
    [string]$RestartCmd,
    [switch]$SkipBuild
)

if (-not $VPS_IP) { $VPS_IP = $env:VPS_IP }
if (-not $VPS_IP) { $VPS_IP = "217.216.109.5" }
if (-not $VPS_USER) { $VPS_USER = $env:VPS_USER }
if (-not $VPS_USER) { $VPS_USER = "root" }
if (-not $REMOTE_PATH) { $REMOTE_PATH = $env:VPS_WEB_PATH }
if (-not $REMOTE_PATH) { $REMOTE_PATH = "/var/www/axionax" }
if (-not $RestartCmd) { $RestartCmd = $env:RESTART_CMD }
# e.g. RESTART_CMD="pm2 restart axionax-web" or "systemctl restart axionax-web"

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$StandaloneDir = Join-Path $ProjectRoot "apps\web\.next\standalone"
$StaticDir = Join-Path $ProjectRoot "apps\web\.next\static"

Write-Host ""
Write-Host "VPS Deploy - Next.js standalone" -ForegroundColor Cyan
Write-Host "Target: ${VPS_USER}@${VPS_IP}:${REMOTE_PATH}" -ForegroundColor Yellow
Write-Host ""

# 1. Build
if (-not $SkipBuild) {
    Write-Host "Building web app (standalone)..." -ForegroundColor Yellow
    Set-Location $ProjectRoot
    pnpm install --frozen-lockfile
    if ($LASTEXITCODE -ne 0) { exit 1 }
    pnpm --filter @axionax/web build
    if ($LASTEXITCODE -ne 0) { exit 1 }
    Write-Host "Build done." -ForegroundColor Green
}
else {
    Write-Host "Skipping build (-SkipBuild)" -ForegroundColor Gray
}

if (-not (Test-Path $StandaloneDir)) {
    Write-Host "ERROR: Not found: $StandaloneDir" -ForegroundColor Red
    Write-Host "Run without -SkipBuild first." -ForegroundColor Yellow
    exit 1
}

# 2. Prepare standalone: copy .next/static into standalone/.next/
$StandaloneNext = Join-Path $StandaloneDir ".next"
if (-not (Test-Path $StandaloneNext)) { New-Item -ItemType Directory -Path $StandaloneNext -Force | Out-Null }
if (Test-Path $StaticDir) {
    Write-Host "Copying static assets into standalone..." -ForegroundColor Gray
    Copy-Item -Path $StaticDir -Destination (Join-Path $StandaloneNext "static") -Recurse -Force
}

# 3. Pack to tarball (avoids scp -r following symlinks → loop)
$TarBall = Join-Path $ProjectRoot "deploy-axionax-web.tar.gz"
Write-Host ""
Write-Host "Creating archive (avoids symlink loop)..." -ForegroundColor Gray
if (Test-Path $TarBall) { Remove-Item $TarBall -Force }
# tar from standalone contents; use dereference so symlinks become real files (no loop)
$tarExe = Get-Command tar -ErrorAction SilentlyContinue
if ($tarExe) {
    & tar -czf $TarBall -C $StandaloneDir .
    if ($LASTEXITCODE -ne 0) { throw "tar failed" }
} else {
    Write-Host "ERROR: tar not found. Install Git for Windows or use Windows 10+ with tar." -ForegroundColor Red
    exit 1
}

# 4. Upload single file then extract on server
Write-Host "Uploading archive to VPS..." -ForegroundColor Yellow
ssh "${VPS_USER}@${VPS_IP}" "mkdir -p ${REMOTE_PATH}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: SSH failed. Check: ssh ${VPS_USER}@${VPS_IP}" -ForegroundColor Red
    Remove-Item $TarBall -Force -ErrorAction SilentlyContinue
    exit 1
}
scp $TarBall "${VPS_USER}@${VPS_IP}:${REMOTE_PATH}/deploy.tar.gz"
if ($LASTEXITCODE -ne 0) {
    Remove-Item $TarBall -Force -ErrorAction SilentlyContinue
    throw "SCP failed"
}
Remove-Item $TarBall -Force -ErrorAction SilentlyContinue

Write-Host "Extracting on server..." -ForegroundColor Yellow
ssh "${VPS_USER}@${VPS_IP}" "cd ${REMOTE_PATH} && tar -xzf deploy.tar.gz && rm -f deploy.tar.gz"
if ($LASTEXITCODE -ne 0) { throw "Extract on server failed" }
Write-Host "Upload done." -ForegroundColor Green

# 5. Restart app on server so the site shows new code
if ($RestartCmd) {
    Write-Host "Restarting app on server: $RestartCmd" -ForegroundColor Yellow
    ssh "${VPS_USER}@${VPS_IP}" "cd ${REMOTE_PATH} && $RestartCmd"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "App restarted. Site should show latest content." -ForegroundColor Green
    } else {
        Write-Host "Restart failed (exit $LASTEXITCODE). On server run: $RestartCmd" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "App NOT restarted - site may still show old content." -ForegroundColor Yellow
    Write-Host "To restart after deploy, run:" -ForegroundColor Gray
    Write-Host "  ssh ${VPS_USER}@${VPS_IP} 'cd ${REMOTE_PATH} && pkill -f \"node server.js\" 2>/dev/null; sleep 1; PORT=3000 nohup node server.js > server.log 2>&1 &'" -ForegroundColor Cyan
    Write-Host "  (or if using PM2: RESTART_CMD=\"pm2 restart axionax-web\" .\deploy-vps.ps1)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "Site: http://${VPS_IP} (Nginx -> port 3000). Hard refresh (Ctrl+Shift+R) if still cached." -ForegroundColor Gray
Write-Host ""
