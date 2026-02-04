@echo off
echo ========================================
echo   Testing API Server
echo ========================================
echo.

echo Step 1: Checking if Node.js is installed...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js version:
node --version
echo.

echo Step 2: Navigating to API directory...
cd apps\api
if errorlevel 1 (
    echo ERROR: Cannot find apps\api directory!
    echo Make sure you're running this from the project root.
    pause
    exit /b 1
)
echo Current directory:
cd
echo.

echo Step 3: Checking if node_modules exists...
if exist "node_modules" (
    echo node_modules found!
) else (
    echo node_modules NOT found. Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
)
echo.

echo Step 4: Checking .env file...
if exist ".env" (
    echo .env file found!
    echo.
    echo Contents:
    type .env
) else (
    echo WARNING: .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
)
echo.

echo Step 5: Checking Prisma setup...
if exist "node_modules\.prisma" (
    echo Prisma client found!
) else (
    echo Prisma client NOT found. Generating...
    call npm run db:generate
)
echo.

echo Step 6: Starting API server...
echo.
echo ========================================
echo   API SERVER STARTING
echo ========================================
echo.
echo If you see "Server running on port 3001", it's working!
echo.
echo Press Ctrl+C to stop the server when done testing.
echo.
echo ========================================
echo.

npm run dev
