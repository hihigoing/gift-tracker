#!/bin/sh

# 启动脚本 - 同时启动后端和 Nginx

echo "Starting Gift Tracker Application..."

# 启动后端服务
echo "Starting Spring Boot backend..."
java -jar /app/app.jar --spring.profiles.active=prod &
BACKEND_PID=$!

# 等待后端启动
sleep 10

# 启动 Nginx
echo "Starting Nginx..."
nginx -g 'daemon off;' &
NGINX_PID=$!

# 等待 Nginx 启动
sleep 2

echo "Application started successfully!"
echo "Frontend: http://localhost:80"
echo "Backend API: http://localhost:8080"

# 等待任意进程退出
wait -n

# 捕获退出信号，优雅关闭
trap "echo 'Shutting down...'; kill $BACKEND_PID $NGINX_PID 2>/dev/null; exit" SIGTERM SIGINT

# 保持运行
wait