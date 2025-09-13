// Service Worker para interceptar peticiones HTTP y convertirlas a HTTPS
const TARGET_DOMAIN = 'registro-valorizaciones-503600768755.southamerica-west1.run.app';

self.addEventListener('install', (event) => {
  console.log('🛠️ Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activado');
  // Tomar control inmediatamente de todas las pestañas abiertas
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Detectar URLs HTTP del dominio objetivo y convertirlas a HTTPS
  if (url.includes('http://') && url.includes(TARGET_DOMAIN)) {
    const correctedUrl = url.replace('http://' + TARGET_DOMAIN, 'https://' + TARGET_DOMAIN);
    console.log('🔧 SERVICE WORKER interceptado:', url, '->', correctedUrl);
    
    // Crear una nueva petición con la URL corregida
    event.respondWith(
      fetch(correctedUrl, {
        method: event.request.method,
        headers: event.request.headers,
        mode: event.request.mode,
        credentials: event.request.credentials,
        redirect: event.request.redirect,
        referrer: event.request.referrer,
        referrerPolicy: event.request.referrerPolicy,
        // Nota: No podemos acceder directamente al body del request original
        // por seguridad, pero fetch() manejará esto correctamente
      })
    );
    return;
  }
  
  // Para todas las demás peticiones, dejarlas pasar
  event.respondWith(fetch(event.request));
});

self.addEventListener('error', (event) => {
  console.error('❌ Error en Service Worker:', event.error);
});