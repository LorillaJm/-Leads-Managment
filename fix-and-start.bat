@echo off
echo ========================================
echo   Lead Management System - Setup
echo ========================================
echo.

echo [Step 1/5] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo.

echo [Step 2/5] Installing API dependencies...
cd apps\api
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install API dependencies
    pause
    exit /b 1
)
echo API dependencies installed successfully!
echo.

echo [Step 3/5] Setting up database...
echo Generating Prisma client...
call npm run db:generate
if errorlevel 1 (
    echo WARNING: Prisma generate failed, but continuing...
)

echo Pushing database schema...
call npm run db:push
if errorlevel 1 (
    echo WARNING: Database push failed, but continuing...
)

echo Seeding database...
call npm run db:seed
if errorlevel 1 (
    echo WARNING: Database seed failed, but continuing...
)
echo Database setup complete!
echo.

cd ..\..

echo [Step 4/5] Installing Frontend dependencies...
cd apps\web
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

cd ..\..

echo [Step 5/5] Starting servers...
echo.
echo Starting Backend API...
start "Backend API - Port 3001" cmd /k "cd apps\api && echo ========================================= && echo    BACKEND API SERVER && echo ========================================= && echo. && npm run dev"

echo Waiting 8 seconds for API to start...
timeout /t 8 /nobreak >nul

echo Starting Frontend...
start "Frontend - Port 5173" cmd /k "cd apps\web && echo ========================================= && echo    FRONTEND SERVER && echo ========================================= && echo. && npm run dev"

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Two windows have opened:
echo   1. Backend API (port 3001)
echo   2. Frontend (port 5173)
echo.
echo Wait about 30 seconds for both to start, then:
echo.
echo   Open: http://localhost:5173
echo.
echo Login with:
echo   Email: admin@example.com
echo   Password: admin123
echo.
echo If you see errors, check the server windows!
echo.
pause
