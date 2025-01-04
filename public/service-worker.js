const CACHE_NAME = 'shop-african-brand-v1';
const RUNTIME_CACHE = 'runtime-cache';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo.svg'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME_CACHE)
          .then(cache => {
            return fetch(event.request)
              .then(response => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }

                cache.put(event.request, response.clone());
                return response;
              });
          });
      })
  );
});

// API response caching
self.addEventListener('fetch', (event) => {
  if (!event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.open(RUNTIME_CACHE)
      .then(cache => {
        return fetch(event.request)
          .then(response => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => {
            return cache.match(event.request);
          });
      })
  );
});