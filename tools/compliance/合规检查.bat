@echo off
chcp 65001 >nul
title 内容合规检查器
echo.
echo   内容合规检查器 — 正在启动...
echo   按 Ctrl+C 退出
echo.
start "" "%~dp0index.html"
