#!/bin/bash

# Cloudflare Tunnel 自动部署脚本
# 用法: ./deploy-cf.sh

set -e

echo "🚀 Cloudflare Tunnel 部署..."

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 检查 cloudflared
if ! command -v cloudflared &> /dev/null; then
    echo -e "${RED}❌ cloudflared 未安装${NC}"
    echo "安装: brew install cloudflared"
    echo "或: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/"
    exit 1
fi

# 配置
TUNNEL_NAME="gift-tracker"
BACKEND_PORT=9000
FRONTEND_PORT=3000

# 检查是否已登录
if [ ! -f ~/.cloudflared/cert.pem ]; then
    echo -e "${YELLOW}🔐 首次使用，需要登录 Cloudflare...${NC}"
    cloudflared tunnel login
    echo -e "${GREEN}✅ 登录成功${NC}"
fi

# 检查隧道是否存在
TUNNEL_ID=$(cloudflared tunnel list | grep "$TUNNEL_NAME" | awk '{print $1}')

if [ -z "$TUNNEL_ID" ]; then
    echo -e "${YELLOW}🔨 创建隧道: $TUNNEL_NAME${NC}"
    cloudflared tunnel create "$TUNNEL_NAME"
    TUNNEL_ID=$(cloudflared tunnel list | grep "$TUNNEL_NAME" | awk '{print $1}')
    echo -e "${GREEN}✅ 隧道创建成功: $TUNNEL_ID${NC}"
else
    echo -e "${GREEN}✅ 使用现有隧道: $TUNNEL_ID${NC}"
fi

# 获取域名
DOMAIN=$(cat ~/.cloudflared/cert.pem 2>/dev/null | openssl x509 -noout -subject 2>/dev/null | grep -o 'CN=[^,]*' | cut -d= -f2 | head -1)
if [ -z "$DOMAIN" ]; then
    read -p "请输入你的 Cloudflare 域名 (如: example.com): " DOMAIN
fi

# 配置路由
BACKEND_URL="api.$DOMAIN"
echo -e "${YELLOW}🌐 配置域名: $BACKEND_URL${NC}"
cloudflared tunnel route dns "$TUNNEL_NAME" "$BACKEND_URL" 2>/dev/null || true

# 创建配置文件
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml << EOF
tunnel: $TUNNEL_ID
credentials-file: ~/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: $BACKEND_URL
    service: http://localhost:$BACKEND_PORT
  - service: http_status:404
EOF

echo -e "${GREEN}✅ 配置文件已创建${NC}"

# 启动后端
echo -e "${YELLOW}📦 启动后端服务...${NC}"
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--server.address=0.0.0.0" &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 15

# 启动隧道
echo -e "${YELLOW}🌐 启动 Cloudflare Tunnel...${NC}"
cloudflared tunnel run "$TUNNEL_NAME" &
TUNNEL_PID=$!

# 等待隧道启动
sleep 5

echo -e "${GREEN}✅ 后端已暴露: https://$BACKEND_URL${NC}"

# 更新前端配置
echo -e "${YELLOW}📝 更新前端 API 配置...${NC}"
cd frontend
echo "VITE_API_URL=https://$BACKEND_URL" > .env.local

# 构建前端
echo -e "${YELLOW}🔨 构建前端...${NC}"
npm run build

# 部署到 GitHub Pages
read -p "部署到 GitHub Pages? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}📤 部署到 GitHub Pages...${NC}"
    npm run deploy
    echo -e "${GREEN}✅ 前端已部署${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "${GREEN}🔗 前端: https://hihigoing.github.io/gift-tracker/${NC}"
echo -e "${GREEN}🔗 后端: https://$BACKEND_URL${NC}"
echo ""
echo -e "${YELLOW}💡 提示:${NC}"
echo "   - 域名固定，重启后不变"
echo "   - 按 Ctrl+C 停止服务"
echo "   - 下次直接运行: cloudflared tunnel run gift-tracker"

# 等待中断
trap "echo ''; echo -e '${YELLOW}🛑 停止服务...${NC}'; kill $BACKEND_PID $TUNNEL_PID 2>/dev/null; exit" INT
wait