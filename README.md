# 💝 人情往来账 - 最终版

完整的 MySQL 版本，支持增删改查、导入导出功能。

---

## 📋 功能清单

✅ **核心功能**
- 添加记录（增）
- 查看记录列表（查）
- 编辑记录（改）
- 删除记录（删）
- 搜索记录（姓名/场合/备注）

✅ **数据管理**
- 批量导入 JSON 数据
- 导出所有数据为 JSON
- 实时统计面板

✅ **统计功能**
- 总记录数
- 送出总额
- 收到总额
- 收支结余

✅ **技术特性**
- MySQL 数据库（数据持久化）
- 响应式设计（手机/平板/电脑）
- RESTful API
- 支持多用户扩展
- ✅ **PWA 支持**（可安装到手机桌面）

---

## 🚀 快速开始

### 1️⃣ 安装 MySQL

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
```

**Windows:**
- 下载 MySQL Installer: https://dev.mysql.com/downloads/installer/

---

### 2️⃣ 配置项目

```bash
cd /Users/dongshucheng/.openclaw/workspace/gift-tracker-final

# 复制环境变量配置
cp .env.example .env

# 编辑 .env 文件，修改 MySQL 密码
nano .env
```

**.env 配置:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的 MySQL 密码
DB_NAME=gift_tracker
PORT=3000
```

---

### 3️⃣ 安装依赖

```bash
npm install
```

---

### 4️⃣ 初始化数据库

```bash
npm run init-db
```

看到以下提示表示成功：
```
✅ MySQL 连接成功
✅ 数据库 gift_tracker 创建成功
✅ 数据表 records 创建成功
🎉 数据库初始化完成！
```

---

### 5️⃣ 启动服务

```bash
npm start
```

看到以下提示表示成功：
```
✅ 数据库连接成功
🚀 服务器运行在 http://localhost:3000
📋 API 接口:
  GET    /api/records           - 获取所有记录
  POST   /api/records           - 创建记录
  PUT    /api/records/:id       - 更新记录
  DELETE /api/records/:id       - 删除记录
  ...
```

---

### 6️⃣ 访问应用

打开浏览器访问：**http://localhost:3000**

---

## 📱 手机访问（局域网）

### 查看电脑 IP
```bash
# macOS
ipconfig getifaddr en0

# Linux
hostname -I

# Windows
ipconfig
```

### 手机访问
```
http://电脑 IP:3000
```

---

## 🔧 API 接口文档

### 记录管理

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| GET | `/api/records` | 获取所有记录 | - |
| GET | `/api/records/search` | 搜索记录 | `?keyword=xxx` |
| GET | `/api/records/:id` | 获取单条记录 | - |
| POST | `/api/records` | 创建记录 | `{name,type,amount,date,occasion,note}` |
| PUT | `/api/records/:id` | 更新记录 | `{name,type,amount,date,occasion,note}` |
| DELETE | `/api/records/:id` | 删除记录 | - |
| POST | `/api/records/batch` | 批量导入 | `{records:[...]}` |
| GET | `/api/records/export` | 导出数据 | - |

### 统计接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/stats` | 总体统计 |
| GET | `/api/stats/:name` | 个人往来汇总 |
| GET | `/api/names` | 所有人名列表 |

---

## 📊 数据表结构

```sql
CREATE TABLE records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,           -- 姓名
  type ENUM('give', 'receive') NOT NULL, -- 类型：give=送出，receive=收到
  amount DECIMAL(10, 2) NOT NULL,       -- 金额
  date DATE NOT NULL,                   -- 日期
  occasion VARCHAR(200),                -- 场合/事由
  note TEXT,                            -- 备注
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_date (date),
  INDEX idx_type (type)
);
```

---

## 💾 数据导入导出

### 导出格式
```json
{
  "exportTime": "2026-03-13T12:00:00.000Z",
  "version": "1.0",
  "totalRecords": 10,
  "records": [
    {
      "name": "张三",
      "type": "give",
      "amount": 500.00,
      "date": "2026-03-13",
      "occasion": "婚礼",
      "note": "恭喜新婚"
    }
  ]
}
```

### 导入步骤
1. 点击"📥 导入数据"按钮
2. 选择之前导出的 JSON 文件
3. 自动批量导入所有记录

---

## 🛠️ 开发模式

```bash
# 使用 nodemon 自动重启
npm run dev
```

---

## 📦 部署到服务器

### 1. 准备服务器
- 购买云服务器（阿里云/腾讯云等）
- 安装 Node.js 和 MySQL

### 2. 上传代码
```bash
git clone 你的仓库
cd gift-tracker-final
npm install
```

### 3. 配置 .env
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的密码
DB_NAME=gift_tracker
PORT=3000
```

### 4. 初始化并启动
```bash
npm run init-db
npm start
```

### 5. 使用 PM2 守护进程（推荐）
```bash
npm install -g pm2
pm2 start server.js --name gift-tracker
pm2 save
pm2 startup
```

---

## ⚠️ 常见问题

### Q: 无法连接数据库？
A: 检查 MySQL 服务是否启动，.env 配置是否正确

### Q: 中文乱码？
A: 数据库已配置 utf8mb4，确保连接字符集正确

### Q: 如何清空数据？
```sql
USE gift_tracker;
TRUNCATE TABLE records;
```

### Q: 如何备份数据？
```bash
mysqldump -u root -p gift_tracker > backup.sql
```

### Q: 如何恢复数据？
```bash
mysql -u root -p gift_tracker < backup.sql
```

---

## 🔐 安全建议

1. **生产环境** 不要使用 root 用户
2. **设置强密码** 并定期更换
3. **启用防火墙** 限制数据库访问
4. **使用 HTTPS** 加密传输
5. **定期备份** 数据

---

## 📝 更新日志

### v1.0.0 (2026-03-13)
- ✅ 完整的增删改查功能
- ✅ MySQL 数据库支持
- ✅ 批量导入导出
- ✅ 实时统计面板
- ✅ 响应式设计
- ✅ 搜索功能

---

## 📄 许可证

MIT License

---

## 🎯 下一步计划

- [ ] 用户登录系统
- [ ] 多用户数据隔离
- [ ] 图表统计可视化
- [ ] 微信/飞书机器人集成
- [ ] 定时提醒功能
- [ ] Excel 导出

---

**开始使用吧！** 🚀
