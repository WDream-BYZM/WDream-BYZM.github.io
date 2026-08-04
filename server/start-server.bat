@echo off
chcp 65001 >nul
title BYZM 联机服务器
echo ========================================
echo   BYZM 联机服务器 - 启动脚本 (Windows)
echo   端口 8787
echo ========================================
echo.

cd /d "%~dp0"

REM 检查 Node.js
where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js！
  echo   请先到 https://nodejs.org 下载并安装 Node.js (选 LTS 版本)
  echo   安装后重新运行本脚本。
  echo.
  pause
  exit /b 1
)

REM 首次运行安装依赖
if not exist node_modules (
  echo 首次运行，正在安装依赖，请稍候...
  call npm install --no-fund --no-audit
  if errorlevel 1 (
    echo [错误] 依赖安装失败，请检查网络后重试。
    pause
    exit /b 1
  )
)

echo.
echo 启动成功！联机服务器已运行在端口 8787
echo 本机测试地址: ws://localhost:8787/room
echo 保持此窗口开启即可（关闭窗口 = 服务器停止）
echo.
node index.js
pause
