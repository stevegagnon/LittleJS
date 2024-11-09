const CACHE_VERSION = 'v1';
const RESOURCES = [
  '../../little.js',
  '../favicon.png',
  './index.html',
  './game.js',
  './tiles.png',
  './icon-72.png',
  './icon-192.png',
  './screenshot1.png',
  './screenshot2.png'
];

self.addEventListener("fetch", (event) => {
  event.respondWith((async (request) => {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return fetch(event.request);
  })());
});

self.addEventListener('install', (event) => {
  event.waitUntil(async () => {
    const cache = await caches.open(CACHE_VERSION);
    await cache.addAll(RESOURCES);
  });
});

self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    async () => {
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
    },
    async () => {
      const cacheKeys = await caches.keys();
      const cachesToDelete = cacheKeys.filter((key) => key !== CACHE_VERSION);
      console.log({cachesToDelete});
      await Promise.all(cachesToDelete.map(key => caches.delete(key)));
    }
  ]));
});
