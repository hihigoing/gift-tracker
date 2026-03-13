#!/bin/bash

# 人情往来账 - 快速启动（含 Cloudflare Tunnel）

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
else
    echo "✅ 后端服务已运行"
fi

echo ""
echo "🌩️  启动 Cloudflare Tunnel..."
echo ""

# 启动 Tunnel
cloudflared tunnel --url http://localhost:3000
