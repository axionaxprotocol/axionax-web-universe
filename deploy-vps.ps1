<#
.SYNOPSIS
    Deploy web frontend (static) to VPS - Option 2
.DESCRIPTION
    Build @axionax/web from monorepo root, then upload apps/web/out to VPS.
    No git/docker on server required - only static files.
.EXAMPLE
    .\deploy-vps.ps1
    $env:VPS_IP="1.2.3.4"; .\deploy-vps.ps1
#>

param(
    [string]$VPS_IP = $env:VPS_IP ?? "217.216.109.5",
    [string]$VPS_USER = $env:VPS_USER ?? "root",
    [string]$REMOTE_PATH = $env:VPS_WEB_PATH ?? "/var/www/axionax",
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$WebOut = Join-Path $ProjectRoot "apps\web\out"

Write-Host "`n🚀 VPS Deploy (Option 2) - Static Web" -ForegroundColor Cyan
Write-Host "Target: ${VPS_USER}@${VPS_IP}:${REMOTE_PATH}" -ForegroundColor Yellow
Write-Host ""

# 1. Build
if (-not $SkipBuild) {
    Write-Host "📦 Building web app..." -ForegroundColor Yellow
    Set-Location $ProjectRoot
    pnpm install --frozen-lockfile
    if ($LASTEXITCODE -ne 0) { exit 1 }
    pnpm --filter @axionax/web build
    if ($LASTEXITCODE -ne 0) { exit 1 }
    Write-Host "✅ Build done" -ForegroundColor Green
} else {
    Write-Host "⏭️  Skipping build (-SkipBuild)" -ForegroundColor Gray
}

if (-not (Test-Path $WebOut)) {
    Write-Host "❌ Not found: $WebOut" -ForegroundColor Red
    Write-Host "   Run without -SkipBuild first." -ForegroundColor Yellow
    exit 1
}

# 2. Upload via SCP (OpenSSH) - contents of out/ → REMOTE_PATH/
Write-Host "`n📤 Uploading to VPS..." -ForegroundColor Yellow
ssh "${VPS_USER}@${VPS_IP}" "mkdir -p ${REMOTE_PATH}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ SSH failed. Check: ssh ${VPS_USER}@${VPS_IP}" -ForegroundColor Red
    exit 1
}
Push-Location $WebOut
try {
    scp -r . "${VPS_USER}@${VPS_IP}:${REMOTE_PATH}/"
    if ($LASTEXITCODE -ne 0) { throw "SCP failed" }
} finally {
    Pop-Location
}
Write-Host "✅ Upload done" -ForegroundColor Green

Write-Host "`n🌐 Site: http://${VPS_IP}" -ForegroundColor Cyan
Write-Host "   (Ensure Nginx/server serves from ${REMOTE_PATH})" -ForegroundColor Gray
Write-Host ""
