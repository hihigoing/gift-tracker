// 使用 Node.js 生成简单的 PWA 图标
const fs = require('fs');
const path = require('path');

// 创建简单的 SVG 图标
const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#grad)"/>
  <text x="256" y="340" font-size="300" text-anchor="middle" dominant-baseline="middle">💝</text>
</svg>`;

const publicDir = path.join(__dirname, 'public');

// 保存 SVG
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

console.log('✅ SVG 图标已生成：public/icon.svg');
console.log('');
console.log('📝 下一步：将 SVG 转换为 PNG');
console.log('');
console.log('方法 1: 使用在线工具');
console.log('  访问 https://cloudconvert.com/svg-to-png');
console.log('  上传 icon.svg，下载 192x192 和 512x512 两个尺寸');
console.log('');
console.log('方法 2: 安装 ImageMagick');
console.log('  brew install imagemagick');
console.log('  然后运行：./generate-icons.sh');
console.log('');
console.log('方法 3: 手动创建');
console.log('  用任何图片编辑工具创建两个 PNG:');
console.log('  - icon-192.png (192x192)');
console.log('  - icon-512.png (512x512)');
console.log('');
console.log('⚠️  没有图标也可以正常使用 PWA，只是桌面图标是默认的');
