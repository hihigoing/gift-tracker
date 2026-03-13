#!/bin/bash

# 人情往来账 - 快速启动脚本

set -e

echo "💝 人情往来账 - 快速启动"
echo "========================="
echo ""

cd /Users/dongshucheng/.openclaw/workspace/gift-tracker-final

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  未找到 .env 文件，正在创建..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件"
    echo "⚠️  请编辑 .env 文件，修改 DB_PASSWORD 为你的 MySQL 密码"
    echo ""
    echo "然后重新运行：./start.sh"
    exit 1
fi

# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 检查数据库
echo "📊 检查数据库..."
node init-database.js

echo ""
echo "🚀 启动服务..."
echo ""
npm start
