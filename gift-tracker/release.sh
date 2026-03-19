#!/bin/bash

# 自动发版脚本
# 用法: ./release.sh [patch|minor|major]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取当前版本
get_current_version() {
    git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"
}

# 计算新版本
bump_version() {
    local version=$1
    local type=$2
    
    # 去掉 v 前缀
    version=${version#v}
    
    # 分割版本号
    IFS='.' read -r major minor patch <<< "$version"
    
    case $type in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            echo "Invalid version type"
            exit 1
            ;;
    esac
    
    echo "v${major}.${minor}.${patch}"
}

# 主流程
main() {
    local bump_type=${1:-patch}
    
    echo -e "${YELLOW}🚀 Starting release process...${NC}"
    
    # 检查是否在 main 分支
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
        echo -e "${RED}❌ Error: Must be on main or master branch${NC}"
        exit 1
    fi
    
    # 检查是否有未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${RED}❌ Error: There are uncommitted changes${NC}"
        git status
        exit 1
    fi
    
    # 拉取最新代码
    echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
    git pull origin main
    
    # 获取当前版本
    current_version=$(get_current_version)
    echo -e "${YELLOW}📋 Current version: $current_version${NC}"
    
    # 计算新版本
    new_version=$(bump_version "$current_version" "$bump_type")
    echo -e "${GREEN}✨ New version: $new_version${NC}"
    
    # 确认
    read -p "Proceed with release $new_version? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Release cancelled${NC}"
        exit 1
    fi
    
    # 更新版本文件
    echo "$new_version" > VERSION
    
    # 提交版本更新
    git add VERSION
    git commit -m "chore(release): bump version to $new_version"
    
    # 创建标签
    echo -e "${YELLOW}🏷️  Creating tag...${NC}"
    git tag -a "$new_version" -m "Release $new_version"
    
    # 推送代码和标签
    echo -e "${YELLOW}📤 Pushing to remote...${NC}"
    git push origin main
    git push origin "$new_version"
    
    echo -e "${GREEN}✅ Release $new_version completed successfully!${NC}"
    echo -e "${GREEN}🎉 GitHub Actions will now build and deploy automatically${NC}"
    echo ""
    echo -e "${YELLOW}📋 Release notes:${NC}"
    git log --pretty=format:"- %s" "$current_version"..HEAD --no-merges || echo "No changes"
}

main "$@"