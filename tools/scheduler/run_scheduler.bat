@echo off
REM Destinyteller 小红书自动化调度器启动脚本
REM 用于 Windows 任务计划程序

echo ========================================
echo Destinyteller 自动化调度器
echo ========================================
echo.

REM 切换到项目目录
cd /d h:\Project\Auto-Redbook-Skills

REM 激活虚拟环境（如果存在）
if exist venv\Scripts\activate.bat (
    echo 激活虚拟环境...
    call venv\Scripts\activate.bat
)

REM 启动调度器
echo 启动调度器...
echo.
python automation/schedulers/daily_scheduler.py

REM 如果出错，暂停以便查看错误信息
if errorlevel 1 (
    echo.
    echo 调度器运行出错！
    pause
)
