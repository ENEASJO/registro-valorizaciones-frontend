// Service Worker - DESACTIVADO TEMPORALMENTE
// Este Service Worker se autodesinstalará inmediatamente

self.addEventListener('install', (event) => {
  console.log('🚫 Service Worker instalado - desinstalando automáticamente...');
  self.skipWaiting();

  // Desinstalar inmediatamente
  event.waitUntil(
    self.registration.unregister()
  );
});

self.addEventListener('activate', (event) => {
  console.log('🚫 Service Worker activado - desinstalando...');

  // Limpiar todos los caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('🗑️ Eliminando caché:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );

  // Desinstalar el Service Worker
  self.registration.unregister();
});

self.addEventListener('fetch', (event) => {
  // No interceptar peticiones - dejar pasar directamente
  // El Service Worker está siendo desinstalado
});