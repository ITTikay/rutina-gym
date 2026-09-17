/* Service Worker de "Mi Rutina de Gym".
   Hace dos cosas:
   1) Guarda la app (HTML, íconos, manifest) para que abra sin internet.
   2) Guarda las fotos de ejercicios la primera vez que las ves, para que en el
      gimnasio funcionen aunque no haya señal.                                   */

const CACHE = 'gym-rutina-v1';

const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Fotos de ejercicios (GitHub): primero caché, y si es la primera vez se
  // descarga y se guarda para las próximas sesiones sin internet.
  if (url.hostname === 'raw.githubusercontent.com') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        // las respuestas de otro dominio son "opaque": igual sirven para <img>
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      } catch (err) {
        return hit || Response.error();
      }
    })());
    return;
  }

  // Archivos propios de la app: intenta red (para traer actualizaciones) y si
  // no hay internet responde con lo guardado.
  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      const cache = await caches.open(CACHE);
      cache.put(req, res.clone()).catch(() => {});
      return res;
    } catch (err) {
      const hit = await caches.match(req);
      return hit || caches.match('./index.html');
    }
  })());
});

// Al tocar la notificación de alarma, vuelve a abrir/enfocar la app.
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});
