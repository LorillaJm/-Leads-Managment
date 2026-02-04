@echo off
echo ========================================
echo   Checking if API is Running
echo ========================================
echo.

echo [1] Checking if port 3001 is in use...
netstat -ano | findstr :3001 >nul 2>&1
if errorlevel 1 (
    echo ❌ Port 3001 is NOT in use
    echo    The API server is NOT running!
    echo.
    echo    Solution: Start the API with START_API_FIRST.bat
    echo.
) else (
    echo ✅ Port 3001 is in use
    echo.
    netstat -ano | findstr :3001
    echo.
)

echo [2] Testing API health endpoint...
echo.
curl -s http://localhost:3001/api/v1/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Cannot connect to API
    echo.
    echo Possible reasons:
    echo   1. API is still starting up (wait 30 seconds)
    echo   2. API crashed (check the API window for errors)
    echo   3. Firewall is blocking the connection
    echo.
) else (
    echo ✅ API is responding!
    echo.
    echo Response:
    curl -s http://localhost:3001/api/v1/health
    echo.
    echo.
)

echo [3] Checking API window...
echo.
echo Look at your API window (green window).
echo It should show:
echo   "🚀 Server running on port 3001"
echo.
echo If you don't see that message:
echo   - The API is still starting (wait longer)
echo   - The API crashed (check for error messages)
echo   - The API didn't start (restart START_API_FIRST.bat)
echo.

echo ========================================
echo   Summary
echo ========================================
echo.
echo If you see ✅ above, the API is working!
echo If you see ❌, follow the solutions shown.
echo.
pause
