# 人情往来账 - Git + Netlify 自动部署

## ✅ 已配置完成

- [x] Git 仓库初始化
- [x] .gitignore 配置
- [x] netlify.toml 配置
- [x] 首次提交完成

---

## 🚀 下一步：推送到 GitHub

### 1. 创建 GitHub 仓库

访问：https://github.com/new

- 仓库名：`gift-tracker`（或你喜欢的名字）
- 公开仓库（Public）
- 不要添加 README/.gitignore
- 点击 "Create repository"

### 2. 关联远程仓库

```bash
cd /Users/dongshucheng/.openclaw/workspace/gift-tracker-final

# 替换为你的 GitHub 用户名
git remote add origin https://github.com/你的用户名/gift-tracker.git

# 推送
git push -u origin main
```

### 3. 连接 Netlify

1. 访问 https://app.netlify.com
2. 用 GitHub 账号登录
3. 点击 "Add new site" → "Import an existing project"
4. 选择 "Deploy with GitHub"
5. 选择 `gift-tracker` 仓库
6. 配置：
   - **Branch**: `main`
   - **Build command**: `echo 'No build needed'`
   - **Publish directory**: `public`
7. 点击 "Deploy site"

### 4. 完成！

等待 1-2 分钟，获得你的公网链接：
```
https://gift-tracker-xxx.netlify.app
```

---

## 📝 后续更新

每次修改代码后：

```bash
# 方式 1：手动推送
git add .
git commit -m "修改说明"
git push

# 方式 2：使用脚本
./deploy.sh
```

Netlify 会自动检测并部署（1-2 分钟）！

---

## 📊 项目结构

```
gift-tracker-final/
├── 📁 public/              # 前端（Netlify 部署这个目录）
│   ├── index.html         # 主页面
│   ├── manifest.json      # PWA 配置
│   ├── sw.js             # Service Worker
│   └── icon.svg          # 图标
├── 📁 后端（需单独部署）
│   ├── server.js         # Express 服务器
│   └── init-database.js  # 数据库初始化
├── 📄 netlify.toml       # Netlify 配置
├── 📄 package.json       # 依赖配置
└── 📄 部署指南.md         # 详细文档
```

---

## ⚠️ 重要提示

### 前端 vs 后端

- **Netlify** 部署的是 **前端（public 目录）**
- **后端（server.js）** 需要单独部署到云服务器

### 修改 API 地址

部署后需要修改 `public/index.html`：

```javascript
// 本地开发
const API_BASE = '';

// 生产环境（部署后）
const API_BASE = 'https://你的后端域名.com';
```

或者使用环境变量（需要构建工具）。

---

## 🎯 快速命令

```bash
# 查看 Git 状态
git status

# 查看提交历史
git log --oneline

# 推送代码
git push

# 使用部署脚本
./deploy.sh
```

---

**准备推送吧！** 🚀
