/* Service Worker de "Mi Rutina de Gym".
   Hace dos cosas:
   1) Guarda la app (HTML, íconos, manifest) para que abra sin internet.
   2) Guarda las fotos de ejercicios la primera vez que las ves, para que en el
      gimnasio funcionen aunque no haya señal.

   Son dos cachés separadas: al publicar una versión nueva de la app solo se
   renueva la de la app, y las fotos ya descargadas se conservan.            */

const APP_CACHE = 'gym-app-v2';
const PHOTO_CACHE = 'gym-rutina-v1';   // nombre heredado: ahí ya están tus fotos

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
    caches.open(APP_CACHE)
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keep = [APP_CACHE, PHOTO_CACHE];
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => !keep.includes(k)).map(k => caches.delete(k)));
    // la caché de fotos de la versión 1 también guardaba la app vieja: se limpia
    const photos = await caches.open(PHOTO_CACHE);
    const reqs = await photos.keys();
    await Promise.all(reqs
      .filter(r => new URL(r.url).hostname !== 'raw.githubusercontent.com')
      .map(r => photos.delete(r)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Fotos de ejercicios (GitHub): primero caché, y si es la primera vez se
  // descarga y se guarda para las próximas sesiones sin internet.
  if (url.hostname === 'raw.githubusercontent.com') {
    event.respondWith((async () => {
      const cache = await caches.open(PHOTO_CACHE);
      const hit = await cache.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        // las respuestas de otro dominio son "opaque": igual sirven para <img>
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      } catch (err) {
        return Response.error();
      }
    })());
    return;
  }

  // Archivos propios de la app: pide siempre la versión más nueva al servidor
  // (así ves las actualizaciones apenas abres la app) y si no hay internet
  // responde con lo guardado.
  event.respondWith((async () => {
    const cache = await caches.open(APP_CACHE);
    try {
      const res = await fetch(req, { cache: 'no-cache' });
      if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
      return res;
    } catch (err) {
      const hit = await cache.match(req);
      return hit || cache.match('./index.html');
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
