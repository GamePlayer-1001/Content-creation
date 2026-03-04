@echo off
chcp 65001 > nul
title 内容推广工具集 — Web 控制台

echo.
echo   ====================================
echo    内容推广工具集 — Web 控制台
echo   ====================================
echo.

cd /d "D:\Software\内容生成输出\webapp"

:: 检查 Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo   [错误] 未找到 Node.js，请先安装
    pause
    exit /b 1
)

:: 检查依赖
if not exist "node_modules" (
    echo   [安装] 正在安装依赖...
    npm install --production
    echo.
)

:: 检查 marked.js
if not exist "public\lib\marked.min.js" (
    echo   [下载] marked.js...
    node -e "const https=require('https');const fs=require('fs');https.get('https://cdn.jsdelivr.net/npm/marked/marked.min.js',r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>fs.writeFileSync('public/lib/marked.min.js',d))}).on('error',e=>console.log('下载失败，请手动下载 marked.min.js'))"
    echo.
)

echo   [启动] http://localhost:3210
echo   按 Ctrl+C 退出
echo.

:: 打开浏览器并启动服务器
start "" http://localhost:3210
node server.js
