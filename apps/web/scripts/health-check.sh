#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Starting Axionax Health Check...${NC}"
echo "=========================================="

# 1. Check Docker Containers
echo -e "\n${YELLOW}[1] Checking Docker Containers...${NC}"
CONTAINERS=("axionax-nginx" "axionax-web" "axionax-explorer-api" "axionax-rpc" "axionax-postgres" "axionax-redis")
ALL_RUNNING=true

for container in "${CONTAINERS[@]}"; do
    if [ "$(docker inspect -f '{{.State.Running}}' ${container} 2>/dev/null)" == "true" ]; then
        echo -e "${GREEN}✅ ${container} is running${NC}"
    else
        echo -e "${RED}❌ ${container} is NOT running${NC}"
        ALL_RUNNING=false
    fi
done

# 2. Check RPC Node
echo -e "\n${YELLOW}[2] Checking RPC Node (Port 8545)...${NC}"
RPC_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545)
if [[ $RPC_RESPONSE == *"result"* ]]; then
    BLOCK_HEX=$(echo $RPC_RESPONSE | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
    BLOCK_NUM=$((BLOCK_HEX))
    echo -e "${GREEN}✅ RPC is responding. Current Block: ${BLOCK_NUM}${NC}"
else
    echo -e "${RED}❌ RPC Failed: ${RPC_RESPONSE}${NC}"
fi

# 3. Check Explorer API
echo -e "\n${YELLOW}[3] Checking Explorer API (Port 3001)...${NC}"
API_RESPONSE=$(curl -s http://localhost:3001/stats)
if [[ $API_RESPONSE == *"blockNumber"* ]]; then
    echo -e "${GREEN}✅ Explorer API is responding${NC}"
else
    echo -e "${RED}❌ Explorer API Failed${NC}"
fi

# 4. Check Nginx Routing (Public Access)
echo -e "\n${YELLOW}[4] Checking Nginx Routing (Port 80)...${NC}"
NGINX_API=$(curl -L -s -I http://localhost/api/stats | head -n 1)
if [[ $NGINX_API == *"200"* ]]; then
    echo -e "${GREEN}✅ Nginx API Route (/api/stats) is working (200 OK)${NC}"
else
    echo -e "${RED}❌ Nginx API Route Failed: ${NGINX_API}${NC}"
fi

NGINX_WEB=$(curl -L -s -I http://localhost/ | head -n 1)
if [[ $NGINX_WEB == *"200"* ]]; then
    echo -e "${GREEN}✅ Nginx Web Route (/) is working (200 OK)${NC}"
else
    echo -e "${RED}❌ Nginx Web Route Failed: ${NGINX_WEB}${NC}"
fi

echo -e "\n=========================================="
if [ "$ALL_RUNNING" = true ]; then
    echo -e "${GREEN}🎉 System Status: HEALTHY${NC}"
else
    echo -e "${RED}⚠️  System Status: UNHEALTHY (Check logs)${NC}"
fi
