@echo off
echo =============================================
echo  Axionax VPS Status Checker
echo  Connecting to 217.216.109.5...
echo =============================================
echo.
echo Password: 95V1ct0r2
echo.
echo Commands to run after login:
echo   docker ps -a
echo   docker logs axionax-mock-rpc --tail 50
echo   netstat -tlnp
echo.
ssh root@217.216.109.5
