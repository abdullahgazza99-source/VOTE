/* STREAMING_CHUNK:Installing service worker and caching offline assets... */
const CACHE_NAME = 'live-race-voting-v1';
const ASSETS_TO_CACHE = [
'./',
'./index.html',
'./manifest.json',
'https://cdn.tailwindcss.com',
'https://unpkg.com/lucide@latest',
'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700;800&family=Rajdhani:wght@500;600;700;800&family=Inter:wght@400;600;700&display=swap'
];

self.addEventListener('install', (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
console.log('[SW] Caching application assets...');
return cache.addAll(ASSETS_TO_CACHE);
}).then(() => self.skipWaiting())
);
});

self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames.map((cache) => {
if (cache !== CACHE_NAME) {
console.log('[SW] Deleting old cache:', cache);
return caches.delete(cache);
}
})
);
}).then(() => self.clients.claim())
);
});

self.addEventListener('fetch', (event) => {
event.respondWith(
caches.match(event.request).then((cachedResponse) => {
if (cachedResponse) {
return cachedResponse;
}
return fetch(event.request).catch(() => {
// Fallback response if network fails
if (event.request.mode === 'navigate') {
return caches.match('./index.html');
}
});
})
);
});