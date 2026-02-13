const CACHE_NAME = 'battery-calculator-v1';
const ASSETS_URLS = [
    '/',
    '/index.html',
    '/pure-min.css',
    '/webmanifest.json',
    '/favicon-512x512.png',
    '/favicon-256x256.png',
    '/favicon-192x192.png',
    '/favicon-128x128.png',
    '/favicon-64x64.png',
    '/favicon-48x48.png',
    '/favicon-32x32.png',
    '/favicon-16x16.png'
];

const version = "1.0.0"

// Install service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {

            console.log("XX", event.request.url, response ? 'cache' : 'network');

            if (response != null) {
                return response;
            }

            // Clone the request
            const fetchRequest = event.request.clone();

            return fetch(fetchRequest).then((response) => {
                // Check if we got a response and can clone it
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});