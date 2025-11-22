# Deployment & Installation Scripts

This directory contains all deployment and installation scripts for the Axionax Web project.

## 📦 Installation Scripts

### Linux
```bash
./install_dependencies_linux.sh
```
Installs Node.js, npm, and all project dependencies on Linux systems.

### macOS
```bash
./install_dependencies_macos.sh
```
Installs Homebrew, Node.js, and project dependencies on macOS.

### Windows
```powershell
.\install_dependencies_windows.ps1
```
Installs Chocolatey, Node.js, and project dependencies on Windows.

---

## 🚀 Deployment Scripts

### Primary Deployment (Recommended)
```bash
./deploy-to-vps.sh
```
**Main deployment script** for VPS (217.216.109.5). Builds the project and deploys to production with:
- Static build generation (`next build`)
- File upload via rsync
- Nginx configuration with SSL/HTTPS
- Automatic service reload

### Alternative Deployments

#### Quick Deploy (PowerShell)
```powershell
.\deploy-quick.ps1
```
Fast deployment script for Windows users.

#### Simple Deploy (PowerShell)
```powershell
.\deploy-simple.ps1
```
Simplified deployment without advanced configurations.

#### Manual Deploy (PowerShell)
```powershell
.\deploy-manual.ps1
```
Step-by-step manual deployment with user prompts.

#### Basic Deploy (Bash/PowerShell)
```bash
./deploy.sh       # Linux/macOS
.\deploy.ps1      # Windows
```
Basic deployment scripts without VPS-specific configurations.

---

## 🔧 VPS Management

### VPS Commands (PowerShell)
```powershell
.\vps-commands.ps1
```
Utility commands for managing the VPS:
- Nginx status/restart
- Log viewing
- SSL certificate management
- Service monitoring

---

## 📝 Prerequisites

### For All Scripts
- Git installed
- SSH access configured (for VPS deployments)
- Node.js 18+ and npm

### For VPS Deployment (`deploy-to-vps.sh`)
- SSH key authentication to `root@217.216.109.5`
- Nginx installed on VPS
- SSL certificates at `/etc/letsencrypt/live/axionax.org/`

### For Windows Scripts (`.ps1`)
- PowerShell 5.1+ or PowerShell Core 7+
- Execution policy: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

## 🌐 VPS Configuration

**Server:** `217.216.109.5` (Contabo Ubuntu 24.04)  
**Domain:** `axionax.org`  
**Web Root:** `/var/www/axionax-web`  
**Nginx Config:** `/etc/nginx/sites-enabled/axionax-web`

---

## 🔒 Security Notes

- All deployment scripts require proper SSH authentication
- VPS uses Let's Encrypt SSL certificates (auto-renewed)
- HTTPS redirects are enforced
- HSTS headers enabled for security

---

## 📚 Additional Documentation

See `/docs` directory for:
- `DEPLOYMENT.md` - Detailed deployment guide
- `DEPLOYMENT_SUCCESS.md` - Post-deployment verification
- `QUICK_START.md` - Quick start guide
