#!/bin/bash

# 本地自动部署监听脚本
# 用法: ./auto-deploy.sh

set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
BRANCH="main"
CHECK_INTERVAL=30  # 秒

echo "🎁 Gift Tracker 自动部署监听"
echo "=============================="
echo ""
echo "📍 仓库目录: $REPO_DIR"
echo "🌿 监听分支: $BRANCH"
echo "⏱️  检查间隔: ${CHECK_INTERVAL}秒"
echo ""

# 获取当前 commit
cd "$REPO_DIR"
LOCAL_COMMIT=$(git rev-parse HEAD)
echo "📝 当前版本: ${LOCAL_COMMIT:0:8}"
echo ""

# 检查 cloudflared
if ! command -v cloudflared &> /dev/null; then
    echo "❌ cloudflared 未安装"
    echo "安装: brew install cloudflared"
    exit 1
fi

# 启动后端和隧道
echo "🚀 启动服务..."
./deploy-cf.sh &
DEPLOY_PID=$!

# 等待部署完成
sleep 20

echo ""
echo "✅ 服务已启动"
echo "🔍 开始监听 GitHub 更新..."
echo ""

# 监听循环
check_and_update() {
    cd "$REPO_DIR"
    
    # 获取远程最新 commit
    git fetch origin "$BRANCH" 2>/dev/null || return
    REMOTE_COMMIT=$(git rev-parse "origin/$BRANCH")
    
    if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
        echo ""
        echo "🎉 检测到更新！"
        echo "   本地: ${LOCAL_COMMIT:0:8}"
        echo "   远程: ${REMOTE_COMMIT:0:8}"
        echo ""
        
        # 停止当前服务
        echo "🛑 停止当前服务..."
        kill $DEPLOY_PID 2>/dev/null || true
        pkill -f "cloudflared tunnel run" 2>/dev/null || true
        sleep 5
        
        # 拉取更新
        echo "📥 拉取更新..."
        git pull origin "$BRANCH"
        
        # 重新部署
        echo "🚀 重新部署..."
        ./deploy-cf.sh &
        DEPLOY_PID=$!
        
        # 更新本地 commit
        LOCAL_COMMIT=$REMOTE_COMMIT
        
        echo ""
        echo "✅ 部署完成！"
        echo ""
    fi
}

# 定时检查
trap "echo ''; echo '🛑 停止监听...'; kill $DEPLOY_PID 2>/dev/null; exit" INT

while true; do
    check_and_update
    sleep $CHECK_INTERVAL
done