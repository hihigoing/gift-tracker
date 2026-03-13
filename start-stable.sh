#!/bin/bash

# 人情往来账 - 稳定启动脚本（自动重启 Tunnel）

set -e

echo "💝 人情往来账 - 启动服务"
echo "========================"
echo ""

cd /Users/dongshucheng/.openclaw/workspace/gift-tracker-final

# 检查后端服务
echo "📊 检查后端服务..."
if ! pgrep -f "node server.js" > /dev/null; then
    echo "🚀 启动后端服务..."
    npm start &
    sleep 3
    echo "✅ 后端服务已启动"
else
    echo "✅ 后端服务已运行"
fi

echo ""
echo "🌩️  启动 Cloudflare Tunnel..."
echo ""

# 启动 Tunnel（前台运行，方便查看日志）
cloudflared tunnel --url http://localhost:3000
