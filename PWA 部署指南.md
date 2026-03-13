# 📱 PWA 部署指南

## ✅ PWA 已配置完成！

现在应用已经是完整的 PWA（渐进式 Web 应用），可以像原生 APP 一样安装到手机桌面。

---

## 🚀 部署步骤

### 1️⃣ 生成图标（可选但推荐）

```bash
cd /Users/dongshucheng/.openclaw/workspace/gift-tracker-final

# 安装 ImageMagick（如果还没有）
brew install imagemagick

# 生成图标
./generate-icons.sh
```

如果没有 ImageMagick，可以手动创建两个 PNG 图片：
- `public/icon-192.png` (192x192 像素)
- `public/icon-512.png` (512x512 像素)

可以用任何图片编辑工具制作，建议使用 💝 表情作为图标。

---

### 2️⃣ 本地测试

```bash
cd /Users/dongshucheng/.openclaw/workspace/gift-tracker-final
npm start
```

访问：**http://localhost:3000**

---

### 3️⃣ 手机访问（同一 WiFi）

**电脑 IP**: 192.168.3.204

**手机浏览器访问**:
```
http://192.168.3.204:3000
```

---

### 4️⃣ 安装到手机

#### 📱 iPhone (Safari)

1. 用 Safari 打开 `http://192.168.3.204:3000`
2. 点击底部 **分享按钮**（方框 + 箭头）
3. 向下滑动，点击 **"添加到主屏幕"**
4. 点击右上角 **"添加"**
5. 完成！桌面会出现"人情账"图标

#### 🤖 Android (Chrome)

1. 用 Chrome 打开 `http://192.168.3.204:3000`
2. 等待几秒，底部会弹出 **"安装应用"** 提示
3. 或者点击浏览器菜单（三个点）→ **"安装应用"**
4. 点击 **"安装"**
5. 完成！桌面会出现"人情往来账"图标

---

## 🌐 部署到公网（推荐）

### 方案 1：Vercel（最简单）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
cd /Users/dongshucheng/.openclaw/workspace/gift-tracker-final/public
vercel --prod
```

获得公网链接：`https://xxx.vercel.app`

### 方案 2：Netlify（拖拽上传）

1. 访问 https://app.netlify.com/drop
2. 将 `public` 文件夹拖到网页
3. 获得公网链接：`https://xxx.netlify.app`

### 方案 3：GitHub Pages

```bash
cd /Users/dongshucheng/.openclaw/workspace/gift-tracker-final/public
git init
git add .
git commit -m "PWA 部署"
git remote add origin https://github.com/你的用户名/gift-tracker.git
git push -u origin main
```

然后在 GitHub 仓库设置中开启 GitHub Pages。

---

## ✨ PWA 功能

### 已实现

- ✅ **离线缓存** - 静态资源离线可用
- ✅ **添加到主屏幕** - 像原生 APP 一样
- ✅ **全屏显示** - 无浏览器界面
- ✅ **自定义图标** - 桌面显示专属图标
- ✅ **状态栏颜色** - 匹配应用主题
- ✅ **启动画面** - 专业 APP 体验

### 离线支持

- ✅ HTML/CSS/JS 静态资源
- ⚠️ 数据需要联网（存储在 MySQL 服务器）

---

## 📋 PWA 文件清单

```
public/
├── index.html          # 主页面（含 PWA 配置）
├── manifest.json       # 应用清单
├── sw.js              # Service Worker
├── icon-192.png       # 图标（192x192）
└── icon-512.png       # 图标（512x512）
```

---

## 🔧 自定义配置

### 修改应用名称

编辑 `public/manifest.json`:
```json
{
  "name": "你的应用名称",
  "short_name": "简称"
}
```

### 修改主题颜色

编辑 `public/index.html`:
```html
<meta name="theme-color" content="#你的颜色">
```

### 修改图标

替换 `public/icon-192.png` 和 `public/icon-512.png`

---

## ⚠️ 注意事项

### 1. HTTPS 要求

PWA 的 Service Worker **必须使用 HTTPS**（localhost 除外）。

部署到公网时：
- Vercel/Netlify 自动提供 HTTPS
- 自建服务器需要配置 SSL 证书

### 2. 离线限制

当前版本：
- ✅ 界面离线可用
- ❌ 数据需要联网（MySQL 在服务器）

如需完全离线使用，需要：
- 使用 IndexedDB 本地存储
- 实现数据同步机制

### 3. iOS 限制

- iOS 11.3+ 支持 PWA
- Safari 必须添加到主屏幕才能全屏
- Service Worker 功能有限

---

## 🎯 快速测试

### 在 Chrome 开发者工具测试

1. 打开 http://localhost:3000
2. 按 F12 打开开发者工具
3. 点击"Application"标签
4. 查看：
   - Manifest（应用清单）
   - Service Workers（服务工作线程）
   - Cache Storage（缓存存储）

### 测试离线模式

1. 打开应用
2. F12 → Network → 勾选 "Offline"
3. 刷新页面
4. 界面应该仍然显示（但数据无法加载）

---

## 📊 PWA 评分测试

访问 https://web.dev/measure/ 输入你的 URL，获取 PWA 评分。

目标分数：**90+**

---

## 🎉 完成！

现在你的应用已经是完整的 PWA，可以：

1. ✅ 手机浏览器访问
2. ✅ 安装到桌面
3. ✅ 全屏运行
4. ✅ 离线访问界面
5. ✅ 推送通知（可选）

**开始使用吧！** 🚀

---

## 📞 常见问题

**Q: 手机无法访问？**
A: 确保手机和电脑在同一 WiFi，检查防火墙设置

**Q: 安装按钮不显示？**
A: 必须使用 HTTPS（localhost 除外），确保 manifest.json 配置正确

**Q: 图标不显示？**
A: 检查 icon-192.png 和 icon-512.png 是否存在

**Q: 如何卸载？**
A: 像普通 APP 一样，长按图标删除即可
