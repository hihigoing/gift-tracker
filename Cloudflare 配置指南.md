# 🌩️ Cloudflare Tunnel 配置指南

## ✅ 前提条件

- [x] cloudflared 已安装
- [ ] Cloudflare 账号（免费）
- [ ] 一个域名（可选，可用免费域名）

---

## 📋 方案 A：使用 Quick Tunnel（最简单，无需域名）

### 1. 直接启动

```bash
cd /Users/dongshucheng/.openclaw/workspace/gift-tracker-final
cloudflared tunnel --url http://localhost:3000
```

### 2. 获得公网 URL

会显示类似：
```
+-------------------------------------------------------------------+
|  Your quick Tunnel has been created!                              |
|                                                                   |
|  It is publicly available at:                                     |
|  https://gift-tracker-abc-def-ghi.trycloudflare.com               |
+-------------------------------------------------------------------+
```

### 3. 修改前端 API 地址

编辑 `public/index.html`：
```javascript
const API_BASE = 'https://gift-tracker-abc-def-ghi.trycloudflare.com';
```

### 4. 提交推送

```bash
git add .
git commit -m "配置 Cloudflare Tunnel 地址"
git push
```

**完成！** 现在任何地方都能访问了。

---

## 📋 方案 B：使用自定义域名（推荐，长期稳定）

### 前提条件

1. **有域名**（没有可用免费的）
   - 免费域名：https://www.eu.org（免费，但审核慢）
   - 付费域名：阿里云/腾讯云/Godaddy（约 50-100 元/年）

2. **域名已添加到 Cloudflare**
   - 访问 https://dash.cloudflare.com
   - "Add a domain"
   - 按指引修改域名 DNS 到 Cloudflare

---

### 步骤 1：登录 Cloudflare

```bash
cloudflared tunnel login
```

会自动打开浏览器，登录 Cloudflare 账号。

---

### 步骤 2：创建 Tunnel

```bash
cloudflared tunnel create gift-tracker
```

会生成：
- Tunnel ID
- 凭证文件：`~/.cloudflared/gift-tracker.json`

---

### 步骤 3：配置 Tunnel

编辑配置文件：
```bash
nano ~/.cloudflared/gift-tracker.yml
```

内容：
```yaml
tunnel: gift-tracker
credentials-file: /Users/你的用户名/.cloudflared/gift-tracker.json

ingress:
  - hostname: api.你的域名.com
    service: http://localhost:3000
  - service: http_status:404
```

---

### 步骤 4：配置 DNS

**方式 A：命令行**
```bash
cloudflared tunnel route dns gift-tracker api.你的域名.com
```

**方式 B：Cloudflare 控制台**
1. 访问 https://dash.cloudflare.com
2. 选择你的域名
3. DNS → 添加记录
   - 类型：CNAME
   - 名称：api
   - 目标：gift-tracker.cfargotunnel.com
   - 代理：开启（橙色云朵）

---

### 步骤 5：启动 Tunnel

```bash
# 前台运行（测试用）
cloudflared tunnel run gift-tracker

# 后台运行（生产环境）
nohup cloudflared tunnel run gift-tracker > tunnel.log 2>&1 &

# 查看日志
tail -f tunnel.log

# 停止
pkill -f "cloudflared tunnel run"
```

---

### 步骤 6：修改前端 API 地址

编辑 `public/index.html`：
```javascript
const API_BASE = 'https://api.你的域名.com';
```

提交推送：
```bash
git add .
git commit -m "配置自定义域名 API 地址"
git push
```

---

## 🎯 推荐：先用 Quick Tunnel 测试

**无需域名，1 分钟搞定：**

```bash
# 1. 确保后端服务运行
npm start

# 2. 启动 Cloudflare Tunnel
cloudflared tunnel --url http://localhost:3000
```

获得 URL 后，告诉我，我帮你配置前端！

---

## 📊 架构说明

```
用户手机
   ↓
https://xxx.trycloudflare.com (Cloudflare Tunnel)
   ↓
http://localhost:3000 (你的 Mac)
   ↓
MySQL 数据库
```

---

## ⚠️ 注意事项

### 1. Mac 必须开机
- 关机后 Tunnel 会断开
- 建议保持 Mac 常开

### 2. 后台运行
```bash
# 使用 nohup
nohup cloudflared tunnel --url http://localhost:3000 > tunnel.log 2>&1 &

# 或使用 screen
brew install screen
screen -S tunnel
cloudflared tunnel --url http://localhost:3000
# Ctrl+A, D 脱离 screen
```

### 3. 开机自启（可选）
```bash
# 创建 launchd 配置
cat > ~/Library/LaunchAgents/com.cloudflare.tunnel.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.cloudflare.tunnel</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/cloudflared</string>
        <string>tunnel</string>
        <string>run</string>
        <string>gift-tracker</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
EOF

# 加载
launchctl load ~/Library/LaunchAgents/com.cloudflare.tunnel.plist
```

---

## 🔧 常用命令

```bash
# 查看 Tunnel 状态
cloudflared tunnel list

# 启动 Tunnel
cloudflared tunnel run gift-tracker

# 停止 Tunnel
pkill -f "cloudflared tunnel"

# 查看日志
tail -f tunnel.log

# 删除 Tunnel
cloudflared tunnel delete gift-tracker
```

---

## 🎉 快速开始

**现在执行：**

```bash
# 1. 确保后端运行
cd /Users/dongshucheng/.openclaw/workspace/gift-tracker-final
npm start

# 2. 新终端窗口，启动 Tunnel
cloudflared tunnel --url http://localhost:3000
```

**告诉我显示的 URL**，我帮你完成后续配置！
