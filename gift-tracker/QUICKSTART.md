# 🚀 快速启动指南

## 第一步：启动后端

```bash
cd /Users/dongshucheng/.openclaw/workspace/gift-tracker/backend

# 方式 1: 使用 Maven Wrapper
./mvnw spring-boot:run

# 方式 2: 如果有 Maven
mvn spring-boot:run
```

后端启动后访问：
- API: http://localhost:8080/api/gifts
- H2 控制台：http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:gifthub`)

## 第二步：启动前端

打开新终端：

```bash
cd /Users/dongshucheng/.openclaw/workspace/gift-tracker/frontend

# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev
```

前端启动后访问：**http://localhost:3000**

## 第三步：使用应用

1. 打开浏览器访问 http://localhost:3000
2. 点击"添加记录"按钮
3. 填写信息：
   - 类型：送礼/收礼
   - 对方姓名
   - 事件类型（婚礼、生日等）
   - 金额
   - 日期
   - 备注（可选）
4. 点击确定保存

## 手机端使用

在手机上访问同一地址，或：

1. 构建生产版本：`npm run build`
2. 部署到服务器
3. 在手机浏览器打开，点击"添加到主屏幕"

## 常见问题

**Q: 后端启动失败？**
A: 确保 Java 17+ 已安装，运行 `java -version` 检查

**Q: 前端启动失败？**
A: 确保 Node.js 已安装，运行 `node -v` 检查

**Q: 数据会丢失吗？**
A: 开发模式使用 H2 内存数据库，重启后端数据会清空。生产环境请配置 MySQL。

## 切换到 MySQL（生产环境）

1. 安装 MySQL
2. 创建数据库：`CREATE DATABASE gift_tracker;`
3. 修改 `backend/src/main/resources/application.properties`
4. 重启后端
