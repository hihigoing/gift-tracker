#!/bin/bash

# 生成 PWA 图标脚本
# 需要安装 ImageMagick: brew install imagemagick

cd /Users/dongshucheng/.openclaw/workspace/gift-tracker-final/public

# 创建临时 SVG 图标
cat > icon-temp.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#grad)"/>
  <text x="256" y="320" font-size="280" text-anchor="middle" fill="white">💝</text>
</svg>
EOF

# 转换为 PNG（需要 ImageMagick）
if command -v convert &> /dev/null; then
    convert -background none icon-temp.svg -resize 192x192 icon-192.png
    convert -background none icon-temp.svg -resize 512x512 icon-512.png
    rm icon-temp.svg
    echo "✅ 图标生成成功！"
    echo "   - icon-192.png (192x192)"
    echo "   - icon-512.png (512x512)"
else
    echo "⚠️  未找到 ImageMagick，无法生成图标"
    echo ""
    echo "请安装 ImageMagick:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo ""
    echo "或者手动创建两个 PNG 图片:"
    echo "  - icon-192.png (192x192 像素)"
    echo "  - icon-512.png (512x512 像素)"
fi
