@echo off
title Backend API Server - Port 3001
color 0A
echo.
echo ========================================
echo    BACKEND API SERVER
echo ========================================
echo.

cd apps\api

echo [1/4] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies!
        echo.
        pause
        exit /b 1
    )
)
echo Dependencies OK!
echo.

echo [2/4] Checking Prisma...
if not exist "node_modules\.prisma" (
    echo Generating Prisma client...
    call npm run db:generate
)
echo Prisma OK!
echo.

echo [3/4] Checking database...
if not exist "prisma\dev.db" (
    echo Setting up database...
    call npm run db:push
    call npm run db:seed
)
echo Database OK!
echo.

echo [4/4] Starting API server...
echo.
echo ========================================
echo   KEEP THIS WINDOW OPEN!
echo ========================================
echo.
echo The API will run on: http://localhost:3001
echo.
echo When you see "Server running on port 3001"
echo you can start the frontend in another window.
echo.
echo ========================================
echo.

npm run dev

pause
