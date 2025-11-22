<#
.SYNOPSIS
    VPS Management Commands
.DESCRIPTION
    Useful commands for managing axionax-web on VPS
#>

$VPS_IP = "217.216.109.5"
$SSH_USER = "root"
$DEPLOY_PATH = "/opt/axionax-web"

function Show-Menu {
    Write-Host "`n🎛️  VPS Management Menu" -ForegroundColor Cyan
    Write-Host "=" * 50
    Write-Host "VPS: ${SSH_USER}@${VPS_IP}" -ForegroundColor Yellow
    Write-Host "=" * 50
    Write-Host ""
    Write-Host "1. View logs (live)" -ForegroundColor White
    Write-Host "2. View logs (last 100 lines)" -ForegroundColor White
    Write-Host "3. Check service status" -ForegroundColor White
    Write-Host "4. Restart services" -ForegroundColor White
    Write-Host "5. Stop services" -ForegroundColor White
    Write-Host "6. Start services" -ForegroundColor White
    Write-Host "7. View disk usage" -ForegroundColor White
    Write-Host "8. View memory usage" -ForegroundColor White
    Write-Host "9. SSH into VPS" -ForegroundColor White
    Write-Host "0. Exit" -ForegroundColor Gray
    Write-Host ""
}

while ($true) {
    Show-Menu
    $choice = Read-Host "Select option"
    
    switch ($choice) {
        "1" {
            Write-Host "`n📊 Live logs (Ctrl+C to exit)..." -ForegroundColor Yellow
            ssh ${SSH_USER}@${VPS_IP} "cd ${DEPLOY_PATH} && docker-compose logs -f"
        }
        "2" {
            Write-Host "`n📊 Last 100 log lines..." -ForegroundColor Yellow
            ssh ${SSH_USER}@${VPS_IP} "cd ${DEPLOY_PATH} && docker-compose logs --tail=100"
            Read-Host "`nPress Enter to continue"
        }
        "3" {
            Write-Host "`n✅ Service status..." -ForegroundColor Yellow
            ssh ${SSH_USER}@${VPS_IP} "cd ${DEPLOY_PATH} && docker-compose ps"
            Read-Host "`nPress Enter to continue"
        }
        "4" {
            Write-Host "`n🔄 Restarting services..." -ForegroundColor Yellow
            ssh ${SSH_USER}@${VPS_IP} "cd ${DEPLOY_PATH} && docker-compose restart"
            Write-Host "✅ Services restarted" -ForegroundColor Green
            Read-Host "Press Enter to continue"
        }
        "5" {
            Write-Host "`n⏸️  Stopping services..." -ForegroundColor Yellow
            ssh ${SSH_USER}@${VPS_IP} "cd ${DEPLOY_PATH} && docker-compose down"
            Write-Host "✅ Services stopped" -ForegroundColor Green
            Read-Host "Press Enter to continue"
        }
        "6" {
            Write-Host "`n▶️  Starting services..." -ForegroundColor Yellow
            ssh ${SSH_USER}@${VPS_IP} "cd ${DEPLOY_PATH} && docker-compose up -d"
            Write-Host "✅ Services started" -ForegroundColor Green
            Read-Host "Press Enter to continue"
        }
        "7" {
            Write-Host "`n💾 Disk usage..." -ForegroundColor Yellow
            ssh ${SSH_USER}@${VPS_IP} "df -h"
            Read-Host "`nPress Enter to continue"
        }
        "8" {
            Write-Host "`n🧠 Memory usage..." -ForegroundColor Yellow
            ssh ${SSH_USER}@${VPS_IP} "free -h"
            Read-Host "`nPress Enter to continue"
        }
        "9" {
            Write-Host "`n🔐 Connecting to VPS..." -ForegroundColor Yellow
            ssh ${SSH_USER}@${VPS_IP}
        }
        "0" {
            Write-Host "`n👋 Goodbye!" -ForegroundColor Cyan
            exit
        }
        default {
            Write-Host "`n❌ Invalid option" -ForegroundColor Red
        }
    }
}
