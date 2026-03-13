#!/bin/bash

# Cloudflare Tunnel 快速配置脚本

set -e

echo "🌩️ Cloudflare Tunnel 配置向导"
echo "=============================="
echo ""

# 检查 cloudflared
if ! command -v cloudflared &> /dev/null; then
    echo "❌ cloudflared 未安装"
    echo "请先运行：brew install cloudflared"
    exit 1
fi

echo "✅ cloudflared 已安装"
echo ""

# 步骤 1：登录
echo "📝 第 1 步：登录 Cloudflare"
echo "   将会打开浏览器，请用 Cloudflare 账号登录"
echo ""
read -p "按回车继续..."
cloudflared tunnel login

echo ""
echo "✅ 登录成功"
echo ""

# 步骤 2：创建 tunnel
echo "📝 第 2 步：创建 Tunnel"
TUNNEL_NAME="gift-tracker"
cloudflared tunnel create $TUNNEL_NAME

echo ""
echo "✅ Tunnel 创建成功"
echo ""

# 步骤 3：配置
echo "📝 第 3 步：配置 Tunnel"
CONFIG_FILE="$HOME/.cloudflared/$TUNNEL_NAME.yml"

cat > $CONFIG_FILE << EOF
tunnel: $TUNNEL_NAME
credentials-file: $HOME/.cloudflared/$TUNNEL_NAME.json

ingress:
  - hostname: gift-tracker.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
EOF

echo "配置文件已创建：$CONFIG_FILE"
echo ""
echo "⚠️  请编辑配置文件，将 'gift-tracker.yourdomain.com' 改为你的域名"
echo ""
read -p "编辑完成后按回车继续..."

# 步骤 4：DNS 配置
echo "📝 第 4 步：配置 DNS"
echo ""
echo "在 Cloudflare 控制台添加 CNAME 记录："
echo "  类型：CNAME"
echo "  名称：gift-tracker"
echo "  目标：$TUNNEL_NAME.cfargotunnel.com"
echo ""
read -p "配置完成后按回车继续..."

# 步骤 5：启动
echo "📝 第 5 步：启动 Tunnel"
echo ""
echo "启动命令："
echo "  cloudflared tunnel run $TUNNEL_NAME"
echo ""
echo "或者使用后台运行："
echo "  nohup cloudflared tunnel run $TUNNEL_NAME > tunnel.log 2>&1 &"
echo ""

echo "🎉 配置完成！"
