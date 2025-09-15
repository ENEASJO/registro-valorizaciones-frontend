/**
 * Configuración centralizada de APIs
 */

// Debug: Imprimir variables de entorno en desarrollo
if (import.meta.env.DEV) {
  console.log('🔧 Variables de entorno (DEV):', {
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
    MODE: import.meta.env.MODE,
  });
}

// URL base del backend - Usa variable de entorno o fallback según el entorno
// En producción usa Cloud Run, en desarrollo usa localhost
const getBackendUrl = () => {
  // Si hay variable de entorno definida, úsala pero fuerza HTTPS en producción
  if (import.meta.env.VITE_BACKEND_URL) {
    let url = import.meta.env.VITE_BACKEND_URL;
    
    // Forzar HTTPS en producción
    if (import.meta.env.PROD && url.startsWith('http://')) {
      console.log('🔒 Forzando HTTPS en producción (cambiando http:// a https://)');
      url = url.replace('http://', 'https://');
    }
    
    return url;
  }
  
  // En producción usa Cloud Run - URL unificada
  if (import.meta.env.PROD) {
    return 'https://registro-valorizaciones-backend-503600768755.southamerica-west1.run.app';
  }
  
  // En desarrollo usa localhost
  return 'http://localhost:8000';
};

const rawUrl = getBackendUrl();

// Forzar HTTPS en producción (doble seguridad)
let finalUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
if (import.meta.env.PROD && finalUrl.startsWith('http://')) {
  console.warn('🔒 Forzando HTTPS en API_BASE_URL (segunda verificación)');
  finalUrl = finalUrl.replace('http://', 'https://');
}

export const API_BASE_URL = finalUrl;

// Interceptador global para corregir URLs HTTP en producción (definitivo)
if (import.meta.env.PROD) {
  
  // ÚLTIMO RECURSO: Interceptar a nivel de window.fetch también
  if (typeof window !== 'undefined') {
    const windowFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      let url: string;
      
      if (typeof input === 'string') {
        url = input;
      } else if (input instanceof URL) {
        url = input.toString();
      } else if (input instanceof Request) {
        url = input.url;
      } else {
        return windowFetch.call(this, input, init);
      }
      
      // DEBUG: Mostrar URL original para depuración
      if (url.includes('registro-valorizaciones-503600768755.southamerica-west1.run.app')) {
        console.log('🔍 DEBUG: URL que llega al interceptor fetch:', url);
      }
      
      const cleanUrl = url.trim();
      const targetDomain = 'registro-valorizaciones-503600768755.southamerica-west1.run.app';
      
      if (cleanUrl.includes('http://') && cleanUrl.includes(targetDomain)) {
        const correctedUrl = cleanUrl.replace('http://' + targetDomain, 'https://' + targetDomain);
        console.warn('🔧 WINDOW.FETCH interceptado: Corrigiendo HTTP a HTTPS:', {
          original: cleanUrl,
          corrected: correctedUrl
        });
        
        if (typeof input === 'string') {
          return windowFetch.call(this, correctedUrl, init);
        } else if (input instanceof URL) {
          return windowFetch.call(this, new URL(correctedUrl), init);
        } else {
          const newRequest = new Request(correctedUrl, {
            method: input.method,
            headers: input.headers,
            body: input.body,
            mode: input.mode,
            credentials: input.credentials,
            cache: input.cache,
            redirect: input.redirect,
            referrer: input.referrer,
            referrerPolicy: input.referrerPolicy,
            ...init
          });
          return windowFetch.call(this, newRequest);
        }
      }
      
      return windowFetch.call(this, input, init);
    };
    
    console.log('🛡️ WINDOW.FETCH interceptador activado');
  }
  
  // Service Worker registration - Forzar reinstalación para corregir Mixed Content
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        console.log('🔄 Desinstalando Service Worker anterior:', registration);
        registration.unregister();
      });
      
      // Forzar nueva instalación
      setTimeout(() => {
        navigator.serviceWorker.register('/service-worker.js?v=' + Date.now(), {
          scope: '/'
        }).then(registration => {
          console.log('✅ Service Worker reinstalado:', registration);
          // Forzar activación inmediata
          if (registration.active) {
            registration.active.postMessage({ type: 'SKIP_WAITING' });
          }
        }).catch(error => {
          console.error('❌ Error al reinstalar Service Worker:', error);
        });
      }, 1000);
    });
  }
  // Sobrescribir fetch para interceptar y corregir URLs HTTP
  const originalFetch = globalThis.fetch;
  globalThis.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let url: string;
    
    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof URL) {
      url = input.toString();
    } else if (input instanceof Request) {
      url = input.url;
    } else {
      return originalFetch.call(this, input, init);
    }
    
    // Corregir URLs HTTP en producción - detección ultra agresiva
    const cleanUrl = url.trim();
    const targetDomain = 'registro-valorizaciones-503600768755.southamerica-west1.run.app';
    
    // Detectar cualquier URL con nuestro dominio en HTTP - ULTRA AGRESIVO
    if (cleanUrl.includes('http://') && cleanUrl.includes(targetDomain)) {
      const correctedUrl = cleanUrl.replace('http://' + targetDomain, 'https://' + targetDomain);
      console.warn('🔧 Fetch interceptado: Corrigiendo HTTP a HTTPS:', {
        original: cleanUrl,
        corrected: correctedUrl
      });
      
      if (typeof input === 'string') {
        return originalFetch.call(this, correctedUrl, init);
      } else if (input instanceof URL) {
        return originalFetch.call(this, new URL(correctedUrl), init);
      } else {
        // Para Request objects, crear uno nuevo con la URL corregida
        const newRequest = new Request(correctedUrl, {
          method: input.method,
          headers: input.headers,
          body: input.body,
          mode: input.mode,
          credentials: input.credentials,
          cache: input.cache,
          redirect: input.redirect,
          referrer: input.referrer,
          referrerPolicy: input.referrerPolicy,
          ...init
        });
        return originalFetch.call(this, newRequest);
      }
    }
    
    // Debug: mostrar URLs HTTP de nuestro dominio
    if (cleanUrl.includes('http://') && cleanUrl.includes(targetDomain)) {
      console.log('⚠️  URL HTTP detectada para corrección:', cleanUrl);
    }
    
    return originalFetch.call(this, input, init);
  };
  
  // También interceptar XMLHttpRequest para mayor cobertura
  const OriginalXMLHttpRequest = globalThis.XMLHttpRequest;
  function InterceptedXMLHttpRequest(this: XMLHttpRequest) {
    const xhr = new OriginalXMLHttpRequest();
    const originalOpen = xhr.open;
    
    xhr.open = function(method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null) {
      let urlString = url.toString();
      
      // Corregir URLs HTTP - detección mejorada
      const cleanUrlString = urlString.trim();
      const targetDomain = 'registro-valorizaciones-503600768755.southamerica-west1.run.app';
      
      if (cleanUrlString.includes('http://') && cleanUrlString.includes(targetDomain)) {
        const correctedUrl = cleanUrlString.replace('http://' + targetDomain, 'https://' + targetDomain);
        console.warn('🔧 XMLHttpRequest interceptado: Corrigiendo HTTP a HTTPS:', {
          original: cleanUrlString,
          corrected: correctedUrl
        });
        urlString = correctedUrl;
      }
      
      return originalOpen.call(this, method, urlString, async !== false, username || null, password || null);
    };
    
    return xhr;
  }
  
  // Mantener el prototype y propiedades estáticas
  InterceptedXMLHttpRequest.prototype = OriginalXMLHttpRequest.prototype;
  InterceptedXMLHttpRequest.UNSENT = OriginalXMLHttpRequest.UNSENT;
  InterceptedXMLHttpRequest.OPENED = OriginalXMLHttpRequest.OPENED;
  InterceptedXMLHttpRequest.HEADERS_RECEIVED = OriginalXMLHttpRequest.HEADERS_RECEIVED;
  InterceptedXMLHttpRequest.LOADING = OriginalXMLHttpRequest.LOADING;
  InterceptedXMLHttpRequest.DONE = OriginalXMLHttpRequest.DONE;
  
  globalThis.XMLHttpRequest = InterceptedXMLHttpRequest as any;
  
  // Interceptar el constructor Request también
  const OriginalRequest = globalThis.Request;
  function InterceptedRequest(this: Request, input: RequestInfo | URL, init?: RequestInit) {
    if (typeof input === 'string') {
      const cleanInput = input.trim();
      const targetDomain = 'registro-valorizaciones-503600768755.southamerica-west1.run.app';
      
      if (cleanInput.includes('http://') && cleanInput.includes(targetDomain)) {
        const correctedUrl = cleanInput.replace('http://' + targetDomain, 'https://' + targetDomain);
        console.warn('🔧 Request constructor interceptado: Corrigiendo HTTP a HTTPS:', {
          original: cleanInput,
          corrected: correctedUrl
        });
        return new OriginalRequest(correctedUrl, init);
      }
    }
    return new OriginalRequest(input, init);
  }
  
  InterceptedRequest.prototype = OriginalRequest.prototype;
  globalThis.Request = InterceptedRequest as any;
  
  console.log('🛡️ Fetch interceptador activado para corregir URLs HTTP');
  console.log('🛡️ XMLHttpRequest interceptador activado');
  console.log('🛡️ Request constructor interceptador');
}

// Debug en producción
if (import.meta.env.PROD) {
  console.log('🌐 Configuración de API en producción:');
  console.log('  API_BASE_URL:', API_BASE_URL);
  console.log('  VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
  console.log('  PROD:', import.meta.env.PROD);
  console.log('  MODE:', import.meta.env.MODE);
  console.log('  ¿Empieza con http://?:', API_BASE_URL.startsWith('http://'));
  console.log('  ¿Empieza con https://?:', API_BASE_URL.startsWith('https://'));
  
  // Service Worker debugging is now handled by service-worker-manager.ts
}

// Verificar que en producción no se use localhost
if (import.meta.env.PROD && API_BASE_URL.includes('localhost')) {
  console.error('🚨 ERROR: Usando localhost en producción!', {
    API_BASE_URL,
    env: import.meta.env
  });
}

// Configuración de endpoints
export const API_ENDPOINTS = {
  // Consultas RUC - Endpoints actualizados para el backend working
  consultaRuc: `${API_BASE_URL}/consultar-ruc`,  // POST endpoint
  consultaRucConsolidada: `${API_BASE_URL}/consulta-ruc-consolidada`,  // GET endpoint

  // Empresas - Endpoints Neon integrados
  empresas: `${API_BASE_URL}/empresas`,              // CRUD completo
  empresasGuardadas: `${API_BASE_URL}/empresas`, // Listar guardadas (mismo endpoint)
  empresasSearch: `${API_BASE_URL}/api/empresas-guardadas/search`, // Buscar
  empresasStats: `${API_BASE_URL}/api/empresas-guardadas/stats`,   // Estadísticas

  // Obras - Neon integrado
  obras: `${API_BASE_URL}/obras`,

  // Valorizaciones - Neon integrado
  valorizaciones: `${API_BASE_URL}/valorizaciones`,

  // Health check
  health: `${API_BASE_URL}/health`,

  // OSCE - Extracción de consorcios con Playwright (usando endpoint consolidado que incluye OSCE)
  consultaOsce: `${API_BASE_URL}/consulta-osce`, // Temporalmente deshabilitado - usar consultaRucConsolidada en su lugar
  buscar: `${API_BASE_URL}/buscar`
} as const;

// Endpoint especial para empresas sin cache busting (para DELETE y PUT)
export const EMPRESAS_ENDPOINT = `${API_BASE_URL}/empresas`;

// Agregar parámetro de versión para evitar caché (en producción también)
if (import.meta.env.DEV || import.meta.env.PROD) {
  // Forzar cache busting en ambos entornos para resolver Mixed Content
  const cacheParam = `?_v=${Date.now()}`;
  Object.keys(API_ENDPOINTS).forEach(key => {
    // No añadir cache busting a endpoints que necesitan paths dinámicos
    if (typeof API_ENDPOINTS[key as keyof typeof API_ENDPOINTS] === 'string' &&
        key !== 'consultaRucConsolidada' &&
        key !== 'empresas') {
      (API_ENDPOINTS as any)[key] += cacheParam;
    }
  });
  
  // Debug para verificar cache busting
  if (import.meta.env.PROD) {
    console.log('🔄 Cache busting activado con parámetro:', cacheParam);
    console.log('🔄 Endpoint empresas:', API_ENDPOINTS.empresas);
  }
}

// Configuración de headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;

// Configuración de timeouts - Optimizada para Lambda con Playwright
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '45000'); // 45 segundos para Playwright
export const RETRY_ATTEMPTS = parseInt(import.meta.env.VITE_RETRY_ATTEMPTS || '2');

export default {
  baseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS,
  headers: DEFAULT_HEADERS,
  timeout: API_TIMEOUT,
  retryAttempts: RETRY_ATTEMPTS
};