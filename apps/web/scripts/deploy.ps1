# AxionAX VPS Deployment Script (Windows)

Write-Host "🚀 AxionAX Deployment Script" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

# Check if Docker is running
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed or not running. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is available
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not available." -ForegroundColor Red
    exit 1
}

# Pull latest code
Write-Host "📥 Pulling latest code from GitHub..." -ForegroundColor Yellow
git pull origin main

# Build and start containers
Write-Host "🔨 Building Docker images..." -ForegroundColor Yellow
docker-compose build

Write-Host "🚀 Starting services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service status
Write-Host "📊 Checking service status..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Services are running at:" -ForegroundColor Cyan
Write-Host "  - Website:      http://localhost" -ForegroundColor White
Write-Host "  - Explorer API: http://localhost:3001" -ForegroundColor White
Write-Host "  - Faucet API:   http://localhost:3002" -ForegroundColor White
Write-Host "  - RPC Node:     http://localhost:8545" -ForegroundColor White
Write-Host ""
Write-Host "To view logs: docker-compose logs -f" -ForegroundColor Yellow
Write-Host "To stop: docker-compose down" -ForegroundColor Yellow
Write-Host "To restart: docker-compose restart" -ForegroundColor Yellow
