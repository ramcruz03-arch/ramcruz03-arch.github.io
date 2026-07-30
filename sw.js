/* Kandhan Karunai — service worker
 *
 * Bump CACHE whenever you ship new files. That one string is what forces
 * every existing user onto the new version; without it they keep serving
 * whatever they cached the first time, forever.
 */
const CACHE = 'kandhan-v3';

/* The app shell. These are fetched on install, so the app works offline
 * from the first visit onward. Keep this list in sync with what index.html
 * actually references. */
const SHELL = [
  './',
  './index.html',
  './app.js',
  './data-v3.json',
  './manifest.json',
  './icon.svg',
  './murugan.svg',
  './art/photos/credits.json',
];

/* Cross-origin things we cache opportunistically as they're requested,
 * rather than up front — Google Fonts, and anything else off-site.
 * NOTE: this only helps AFTER a first online visit. Self-hosting the Tamil
 * woff2 files and adding them to SHELL is the real fix. */
const RUNTIME = 'kandhan-runtime-v3';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      /* addAll is atomic — one 404 fails the whole install. Add individually
       * so a single missing asset can't leave users with no cache at all. */
      .then(cache => Promise.all(
        SHELL.map(url =>
          cache.add(url).catch(err => console.warn('[sw] skipped', url, err))
        )
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(n => n !== CACHE && n !== RUNTIME)
          .map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  /* Navigations: try the network so a fresh index.html lands promptly,
   * fall back to the cached shell when offline. */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  /* Everything else: cache first. The corpus never changes without a new
   * filename, so there is nothing to revalidate. */
  event.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        /* Don't cache errors. Opaque responses (cross-origin, status 0)
         * are fine to keep — that's how Google Fonts arrives. */
        if (!res || (res.status !== 200 && res.type !== 'opaque')) return res;
        const copy = res.clone();
        caches.open(sameOrigin ? CACHE : RUNTIME).then(c => c.put(req, copy));
        return res;
      }).catch(() => hit);
    })
  );
});

/* Lets the page trigger an immediate update:
 *   navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' }) */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
