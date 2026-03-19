#!/bin/bash

echo "🚀 启动人情往来账系统..."

# 检查后端是否运行
if ! lsof -i :8080 > /dev/null 2>&1; then
    echo "📦 启动后端服务..."
    cd backend
    ./mvnw spring-boot:run &
    cd ..
    sleep 10
else
    echo "✅ 后端服务已运行"
fi

# 检查前端是否运行
if ! lsof -i :3000 > /dev/null 2>&1; then
    echo "🎨 启动前端服务..."
    cd frontend
    npm run dev &
    cd ..
else
    echo "✅ 前端服务已运行"
fi

echo ""
echo "✨ 启动完成!"
echo "📱 访问地址：http://localhost:3000"
echo "🔧 后端 API: http://localhost:8080"
echo "💾 H2 控制台：http://localhost:8080/h2-console"
