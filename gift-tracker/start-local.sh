#!/bin/bash

# 本地部署脚本 - 同一局域网访问
# 用法: ./start-local.sh

set -e

echo "🚀 启动本地服务器..."

# 获取本机 IP
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
if [ -z "$IP" ]; then
    IP=$(ip addr show | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1 | head -1)
fi

if [ -z "$IP" ]; then
    IP="localhost"
fi

echo "📍 本机 IP: $IP"

# 启动后端
echo "📦 启动后端服务..."
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--server.address=0.0.0.0" &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 15

# 更新前端配置
echo "📝 配置前端..."
cd frontend
echo "VITE_API_URL=http://$IP:9000" > .env.local

# 构建前端
echo "🔨 构建前端..."
npm run build

# 启动前端（本地服务器）
echo "🌐 启动前端服务器..."
npm install -g serve
serve -s dist -l 3000 &
FRONTEND_PID=$!

cd ..

echo ""
echo "🎉 服务已启动！"
echo ""
echo "📱 访问地址:"
echo "   前端: http://$IP:3000"
echo "   后端: http://$IP:9000"
echo ""
echo "💡 同一 WiFi/局域网的设备都可以访问"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待中断
trap "echo ''; echo '🛑 停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait