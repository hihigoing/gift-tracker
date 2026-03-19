#!/bin/bash

# 自动部署脚本 - 本地服务器 + ngrok 内网穿透
# 用法: ./deploy-local.sh

set -e

echo "🚀 启动本地部署..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 检查 ngrok
if ! command -v ngrok &> /dev/null; then
    echo -e "${RED}❌ ngrok 未安装${NC}"
    echo "安装: https://ngrok.com/download"
    exit 1
fi

# 启动后端
echo -e "${YELLOW}📦 启动后端服务...${NC}"
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 15

# 启动 ngrok
echo -e "${YELLOW}🌐 启动 ngrok 内网穿透...${NC}"
ngrok http 9000 --log=stdout &
NGROK_PID=$!

# 等待 ngrok 启动
sleep 5

# 获取 ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -1)

if [ -z "$NGROK_URL" ]; then
    echo -e "${RED}❌ 无法获取 ngrok URL${NC}"
    kill $BACKEND_PID $NGROK_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✅ 后端已暴露: $NGROK_URL${NC}"

# 更新前端 API 地址
echo -e "${YELLOW}📝 更新前端 API 配置...${NC}"
cd frontend
echo "VITE_API_URL=$NGROK_URL" > .env.local

# 构建前端
echo -e "${YELLOW}🔨 构建前端...${NC}"
npm run build

# 部署到 GitHub Pages（可选）
read -p "部署到 GitHub Pages? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}📤 部署到 GitHub Pages...${NC}"
    npm run deploy
    echo -e "${GREEN}✅ 前端已部署到 GitHub Pages${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "${GREEN}🔗 前端: https://hihigoing.github.io/gift-tracker/${NC}"
echo -e "${GREEN}🔗 后端: $NGROK_URL${NC}"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待中断
trap "echo ''; echo -e '${YELLOW}🛑 停止服务...${NC}'; kill $BACKEND_PID $NGROK_PID 2>/dev/null; exit" INT
wait