#!/bin/bash

# 快速推送到 GitHub 并触发 Netlify 部署

set -e

echo "🚀 准备推送到 GitHub..."
echo ""

# 检查是否有未提交的更改
if ! git diff --quiet HEAD || ! git diff --cached --quiet; then
    echo "📝 检测到未提交的更改，正在提交..."
    git add .
    git commit -m "Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 显示当前状态
echo ""
echo "📊 当前分支：$(git branch --show-current)"
echo "📝 最近提交："
git log --oneline -3

echo ""
read -p "确认推送到 GitHub? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 推送到 GitHub..."
    git push
    
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "🌐 Netlify 将自动部署，访问以下链接查看状态："
    echo "   https://app.netlify.com"
    echo ""
    echo "⏱️  部署通常需要 1-2 分钟"
else
    echo ""
    echo "❌ 已取消推送"
fi
