#!/bin/bash
# BYZM 联机服务器 - 启动脚本 (Linux)
cd "$(dirname "$0")"

echo "========================================"
echo "  BYZM 联机服务器 - 启动脚本 (Linux)"
echo "  端口 8787"
echo "========================================"

# 检查 Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "[错误] 未检测到 Node.js！"
  echo "  请先安装: sudo apt install -y nodejs npm"
  exit 1
fi

# 首次运行安装依赖
if [ ! -d node_modules ]; then
  echo "首次运行，正在安装依赖..."
  npm install --no-fund --no-audit
fi

echo "启动成功！联机服务器运行在端口 8787 (ws://localhost:8787/room)"
echo "保持此进程运行（Ctrl+C 停止）"
node index.js
