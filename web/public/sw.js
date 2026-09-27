/**
 * WinnegansFake Service Worker (PWA Offline Engine)
 * Provides offline caching for Joycean annotations, schemas, and reading workstation.
 */

const CACHE_NAME = 'winnegansfake-v3-offline-v1';

const STATIC_PRECACHE = [
  '/',
  '/reader',
  '/library',
  '/library/coverage',
  '/thunders',
  '/schemas/ulysses',
  '/sigla',
  '/vico',
  '/bookclub',
  '/manifest.json',
  '/works.json',
  '/coverage_matrix.json',
  '/favicon.ico',
];

// Install: precache the core shell and metadata catalogs
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE).catch((err) => {
        console.warn('PWA precache partial failure:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate for annotations, network-first for HTML pages
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET and cross-origin requests (except unpkg/cdn fonts)
  if (request.method !== 'GET') return;

  // Cache-first for annotations JSON, fonts, audio, and static images
  if (
    url.pathname.startsWith('/annotations/') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.mp3') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Network-first with cache fallback for HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/reader');
          });
        })
    );
    return;
  }

  // Standard fallback
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});
