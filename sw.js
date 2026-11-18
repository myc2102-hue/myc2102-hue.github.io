// 서비스 워커: 설치 조건(PWA)용 최소 구성. 게임 본체·Firebase·CDN 은 캐시하지 않고 항상 네트워크.
// 네트워크가 끊겼을 때 화면 이동(navigate)만 offline.html 로 대신한다.
const CACHE = 'charles-forest-v1';
const OFFLINE = '/offline.html';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([OFFLINE, '/icons/icon-192.png'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request).catch(() => caches.match(OFFLINE)));
});
