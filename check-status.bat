@echo off
echo ========================================
echo   System Status Check
echo ========================================
echo.

echo [1] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js NOT installed
    echo    Install from: https://nodejs.org/
) else (
    echo ✅ Node.js installed:
    node --version
)
echo.

echo [2] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm NOT installed
) else (
    echo ✅ npm installed:
    npm --version
)
echo.

echo [3] Checking if API dependencies are installed...
if exist "apps\api\node_modules" (
    echo ✅ API dependencies installed
) else (
    echo ❌ API dependencies NOT installed
    echo    Run: cd apps\api && npm install
)
echo.

echo [4] Checking if Frontend dependencies are installed...
if exist "apps\web\node_modules" (
    echo ✅ Frontend dependencies installed
) else (
    echo ❌ Frontend dependencies NOT installed
    echo    Run: cd apps\web && npm install
)
echo.

echo [5] Checking if database exists...
if exist "apps\api\prisma\dev.db" (
    echo ✅ Database file exists
) else (
    echo ❌ Database file NOT found
    echo    Run: cd apps\api && npm run db:push
)
echo.

echo [6] Checking if API is running on port 3001...
netstat -ano | findstr :3001 >nul 2>&1
if errorlevel 1 (
    echo ❌ API NOT running on port 3001
    echo    Start with: cd apps\api && npm run dev
) else (
    echo ✅ Port 3001 is in use (API might be running)
)
echo.

echo [7] Checking if Frontend is running on port 5173...
netstat -ano | findstr :5173 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend NOT running on port 5173
    echo    Start with: cd apps\web && npm run dev
) else (
    echo ✅ Port 5173 is in use (Frontend might be running)
)
echo.

echo [8] Checking environment files...
if exist "apps\api\.env" (
    echo ✅ API .env file exists
) else (
    echo ❌ API .env file NOT found
    echo    Copy from: apps\api\.env.example
)

if exist "apps\web\.env" (
    echo ✅ Frontend .env file exists
) else (
    echo ❌ Frontend .env file NOT found
    echo    Create with: VITE_API_URL=http://localhost:3001
)
echo.

echo ========================================
echo   Recommendations
echo ========================================
echo.

netstat -ano | findstr :3001 >nul 2>&1
if errorlevel 1 (
    echo 1. Start the API server:
    echo    - Open Command Prompt
    echo    - Run: cd apps\api
    echo    - Run: npm run dev
    echo.
)

netstat -ano | findstr :5173 >nul 2>&1
if errorlevel 1 (
    echo 2. Start the Frontend:
    echo    - Open NEW Command Prompt
    echo    - Run: cd apps\web
    echo    - Run: npm run dev
    echo.
)

echo 3. Or use the automated script:
echo    - Double-click: fix-and-start.bat
echo.

echo ========================================
pause
