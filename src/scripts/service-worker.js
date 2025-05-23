import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { API_ENPOINTS, BASE_API_URL } from '../config/constants';

// Menggunakan daftar file hasil build yang dipre-cache (Pre-cache assets statis)
precacheAndRoute(self.__WB_MANIFEST);

// Caching untuk aset statis (HTML, CSS, JS, gambar)
registerRoute(
  /\.(?:html|js|css|png|jpg|jpeg|svg|gif|webp|woff2?)$/,
  new StaleWhileRevalidate({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => url.href.startsWith(`${API_ENPOINTS.RESTO_LIST}`),
  new NetworkFirst({
    cacheName: 'restaurant-list-api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50, // Maksimum 50 detail restoran
        maxAgeSeconds: 7 * 24 * 60 * 60, // Simpan hingga 7 hari
      }),
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => /\/images\/medium\/[\w-]+$/.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: 'image-medium-resolution',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => /\/images\/large\/[\w-]+$/.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: 'image-large-resolution',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => url.searchParams.has('as') && url.searchParams.get('as') === 'webp',
  new StaleWhileRevalidate({
    cacheName: 'image-webp',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => url.href.startsWith(`${BASE_API_URL}/detail/`),
  new NetworkFirst({
    cacheName: 'restaurant-detail-api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => url.href.startsWith(`${API_ENPOINTS.REVIEW}`),
  new NetworkFirst({
    cacheName: 'restaurant-review-api',
    plugins: [
      new BackgroundSyncPlugin('review-sync', {
        maxRetentionTime: 24 * 60, // Tahan hingga 24 jam
      }),
    ],
  }),
  'POST',
);

// Tambahkan Event Fetch untuk Log Debugging
self.addEventListener('fetch', (event) => {
  console.log(`[Service Worker] Fetching: ${event.request.url}`);
});

// Menangani event install dan activate
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Event listener yang berjalan sekali saja ketika service worker diaktifkan setelah diinstal
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            ![
              'restaurant-list-api',
              'restaurant-detail-api',
              'restaurant-review-api',
              'static-assets',
            ].includes(cacheName)
          ) {
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});
