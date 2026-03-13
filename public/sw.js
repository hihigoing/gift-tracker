// PWA Service Worker - 离线缓存支持
const CACHE_NAME = 'gift-tracker-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 安装事件 - 缓存资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 缓存资源');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// 请求拦截 - 离线优先
self.addEventListener('fetch', (event) => {
  // API 请求走网络
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response(JSON.stringify({
            success: false,
            error: '离线状态，无法访问数据'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }
  
  // 静态资源离线优先
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
