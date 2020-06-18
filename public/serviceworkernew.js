
const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';
const FILES_TO_CACHE = [
  '/partials/offline.html'
];

self.addEventListener('install', function(event) {
    console.log('used to register the service worker')
    event.waitUntil(
        caches.open(CACHE_NAME)
          .then(function(cache) {
              return cache.addAll(toCache)
          })
          .then(self.skipWaiting())
      )
  })

  
  self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    // CODELAB: Remove previous cached data from disk.
    evt.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
  );
    self.clients.claim();
  });

  self.addEventListener('fetch', (evt) => {
    
    })