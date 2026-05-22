@echo off
setlocal EnableExtensions
title Content Forge Dev Server

set "ROOT=%~dp0"
set "APP=%ROOT%content-forge"
set "LOG=%APP%\start.log"

echo.
echo   ====================================
echo    Content Forge Dev Server
echo   ====================================
echo.
echo   Project: %APP%
echo   Log    : %LOG%
echo.

if not exist "%APP%\package.json" (
    echo   [ERROR] content-forge package.json was not found.
    echo   [ERROR] Please keep start.bat in the project root folder.
    pause
    exit /b 1
)

pushd "%APP%"

echo [%date% %time%] start.bat launched > "%LOG%"
echo APP=%APP%>> "%LOG%"

where node >nul 2>nul
if errorlevel 1 (
    echo   [ERROR] Node.js was not found. Please install Node.js 20 or newer.
    echo missing node>> "%LOG%"
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo   [ERROR] npm was not found. Please check Node.js installation.
    echo missing npm>> "%LOG%"
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set "NODE_VERSION=%%v"
for /f "tokens=*" %%v in ('npm -v') do set "NPM_VERSION=%%v"
echo   Node: %NODE_VERSION%
echo   npm : %NPM_VERSION%
echo NODE=%NODE_VERSION%>> "%LOG%"
echo NPM=%NPM_VERSION%>> "%LOG%"
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$listener = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue; if ($listener) { exit 10 }"
if errorlevel 10 (
    echo   [INFO] Frontend port 5173 is already running. Opening browser.
    start "" http://localhost:5173
    popd
    exit /b 0
)

if not exist "node_modules" (
    echo   [INSTALL] Installing dependencies. Please wait...
    echo npm install started>> "%LOG%"
    call npm install
    if errorlevel 1 (
        echo   [ERROR] npm install failed. Check log: %LOG%
        echo npm install failed>> "%LOG%"
        pause
        exit /b 1
    )
    echo.
)

echo   [START] Backend : http://localhost:3210
echo   [START] Frontend: http://localhost:5173
echo   Keep this window open while using the app.
echo   The browser will open automatically in about 5 seconds.
echo.

echo npm run dev started>> "%LOG%"
start "" cmd /c "timeout /t 5 /nobreak >nul && start "" http://localhost:5173"
call npm run dev

set "EXIT_CODE=%ERRORLEVEL%"
echo npm run dev exited with %EXIT_CODE%>> "%LOG%"
echo.
echo   [STOP] Dev server exited with code: %EXIT_CODE%
echo   Run start.bat again to restart.
echo.
pause
popd
exit /b %EXIT_CODE%
