// Service Worker para interceptar peticiones HTTP y convertirlas a HTTPS
const TARGET_DOMAIN = 'registro-valorizaciones-503600768755.southamerica-west1.run.app';
const TARGET_DOMAINS = [
  'registro-valorizaciones-503600768755.southamerica-west1.run.app',
  'localhost:8000'
];

self.addEventListener('install', (event) => {
  console.log('🛠️ Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activado');
  // Tomar control inmediatamente de todas las pestañas abiertas
  event.waitUntil(self.clients.claim());
  
  // Debug: Log all controlled clients
  self.clients.matchAll().then(clients => {
    console.log('📱 Controlled clients:', clients.length);
    clients.forEach(client => {
      console.log('📱 Client:', client.url);
    });
  });
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  const timestamp = new Date().toISOString();
  
  // Debug: Log all fetch requests to see what's happening
  if (url.includes(TARGET_DOMAINS[0]) || url.includes('/api/')) {
    console.log(`🌐 SERVICE WORKER [${timestamp}] petición recibida:`, {
      url: url,
      method: event.request.method,
      isHTTPS: url.startsWith('https://'),
      containsTargetDomain: TARGET_DOMAINS.some(domain => url.includes(domain))
    });
  }
  
  // CORRECCIÓN PRINCIPAL: Si la URL ya es HTTPS, responder directamente
  if (url.startsWith('https://')) {
    console.log(`✅ SERVICE WORKER [${timestamp}] URL ya es HTTPS - FETCH DIRECTO:`, {
      url: url,
      method: event.request.method
    });
    
    // Clonar el request para evitar "body already used" errors
    try {
      const requestClone = event.request.clone();
      event.respondWith(fetch(requestClone));
      return; // IMPORTANTE: Salir después de responder
    } catch (error) {
      console.error(`❌ SERVICE WORKER [${timestamp}] Error en fetch directo:`, error);
      event.respondWith(fetch(event.request));
      return;
    }
  }
  
  // Detectar URLs HTTP de nuestros dominios objetivo y convertirlas a HTTPS
  const shouldIntercept = TARGET_DOMAINS.some(domain => 
    url.includes('http://' + domain)
  );
  
  if (shouldIntercept) {
    let correctedUrl = url;
    TARGET_DOMAINS.forEach(domain => {
      correctedUrl = correctedUrl.replace('http://' + domain, 'https://' + domain);
    });
    
    console.log(`🔧 SERVICE WORKER [${timestamp}] CORRIGIENDO HTTP a HTTPS:`, {
      original: url,
      corrected: correctedUrl,
      method: event.request.method,
      mode: event.request.mode
    });
    
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
        body: event.request.body
      }).then(response => {
        console.log(`✅ SERVICE WORKER [${timestamp}] respuesta exitosa:`, {
          url: response.url,
          status: response.status,
          statusText: response.statusText
        });
        return response;
      }).catch(error => {
        console.error(`❌ SERVICE WORKER [${timestamp}] error en fetch:`, {
          originalUrl: url,
          correctedUrl: correctedUrl,
          error: error.message
        });
        throw error;
      })
    );
    return; // IMPORTANTE: Salir después de responder
  }
  
  // Para cualquier otra petición, dejarla pasar sin modificaciones
  console.log(`🔄 SERVICE WORKER [${timestamp}] Pasando petición sin modificar:`, {
    url: url,
    method: event.request.method
  });
  
  event.respondWith(fetch(event.request));
});

// Debug: Log Service Worker messages
self.addEventListener('message', (event) => {
  console.log('📨 Service Worker recibió mensaje:', event.data);
  
  if (event.data && event.data.type === 'DEBUG_STATUS') {
    event.ports[0].postMessage({
      type: 'STATUS_RESPONSE',
      timestamp: new Date().toISOString(),
      active: true,
      scope: self.registration?.scope
    });
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ Service Worker saltando espera');
    self.skipWaiting();
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('❌ Error en Service Worker:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

self.addEventListener('error', (event) => {
  console.error('❌ Error en Service Worker:', event.error);
});