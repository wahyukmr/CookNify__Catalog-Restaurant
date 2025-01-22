/* global clients */

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Menggunakan daftar file hasil build yang dipre-cache
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
  ({ url }) => url.href.startsWith('https://restaurant-api.dicoding.dev/list'),
  new StaleWhileRevalidate({
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
  ({ url }) => url.href.startsWith('https://restaurant-api.dicoding.dev/detail/'),
  new StaleWhileRevalidate({
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
  ({ url }) => url.href.startsWith('https://restaurant-api.dicoding.dev/review'),
  new NetworkOnly({
    plugins: [
      new BackgroundSyncPlugin('review-sync', {
        maxRetentionTime: 24 * 60, // Tahan hingga 24 jam
      }),
    ],
  }),
  'POST',
);

// Menangani event install dan activate
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
