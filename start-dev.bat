@echo off
echo ========================================
echo   Starting Lead Management System
echo ========================================
echo.

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js: OK
echo.

echo [2/3] Starting Backend API Server...
echo.
start "Backend API" cmd /k "cd apps\api && echo Installing dependencies... && npm install && echo Starting API server on port 3001... && npm run dev"
echo Backend API starting in new window...
echo Waiting 5 seconds for API to start...
timeout /t 5 /nobreak >nul
echo.

echo [3/3] Starting Frontend Server...
echo.
start "Frontend" cmd /k "cd apps\web && echo Installing dependencies... && npm install && echo Starting frontend on port 5173... && npm run dev"
echo Frontend starting in new window...
echo.

echo ========================================
echo   Servers Starting!
echo ========================================
echo.
echo Backend API:  http://localhost:3001
echo Frontend:     http://localhost:5173
echo.
echo Two new windows will open:
echo   1. Backend API (port 3001)
echo   2. Frontend (port 5173)
echo.
echo Wait for both servers to start, then open:
echo   http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
