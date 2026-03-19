# 💰 人情往来账 (Gift Tracker)

记录送礼收礼，统计人情往来金额的 Web 应用。

## 功能特性

- ✅ 记录送礼/收礼
- ✅ 统计累计金额
- ✅ 计算净余额（谁欠我/我欠谁）
- ✅ 按人员查询往来记录
- ✅ 支持多种事件类型（婚礼、生日、满月等）
- ✅ PWA 支持（可安装到手机桌面）
- ✅ 响应式设计（支持 PC 和移动端）

## 技术栈

**后端:**
- Spring Boot 3.2
- Spring Data JPA
- H2 Database (开发) / MySQL (生产)

**前端:**
- React 18
- Vite
- Ant Design
- PWA

## 快速启动

### 1. 启动后端

```bash
cd backend
./mvnw spring-boot:run
# 或
mvn spring-boot:run
```

后端将在 http://localhost:8080 启动

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端将在 http://localhost:3000 启动

## API 接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/gifts | 获取所有记录 |
| GET | /api/gifts/{id} | 获取单条记录 |
| POST | /api/gifts | 创建记录 |
| PUT | /api/gifts/{id} | 更新记录 |
| DELETE | /api/gifts/{id} | 删除记录 |
| GET | /api/gifts/stats | 获取统计数据 |
| GET | /api/gifts/person/{name} | 按人员查询 |

## 数据模型

```json
{
  "id": 1,
  "type": "GIVE",
  "personName": "张三",
  "eventType": "婚礼",
  "amount": 1000.00,
  "date": "2026-03-18",
  "remark": "结婚红包",
  "createdAt": "2026-03-18"
}
```

## 生产部署

### MySQL 配置

修改 `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gift_tracker?useSSL=false&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### 构建前端

```bash
cd frontend
npm run build
```

构建产物在 `frontend/dist` 目录。

## 许可证

MIT
