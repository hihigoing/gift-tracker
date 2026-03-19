# 多阶段构建 - 前端
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 多阶段构建 - 后端
FROM maven:3.9-eclipse-temurin-17-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/pom.xml ./
COPY backend/src ./src
RUN mvn clean package -DskipTests

# 生产镜像
FROM eclipse-temurin:17-jre-alpine

# 安装 Nginx
RUN apk add --no-cache nginx

# 创建工作目录
WORKDIR /app

# 复制后端 JAR
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# 复制前端构建产物
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Nginx 配置
COPY docker/nginx.conf /etc/nginx/nginx.conf

# 启动脚本
COPY docker/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# 暴露端口
EXPOSE 80 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# 启动服务
CMD ["/app/start.sh"]