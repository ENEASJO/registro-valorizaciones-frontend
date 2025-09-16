/**
 * Configuración centralizada de APIs
 */

// URL base del backend - Usa variable de entorno o fallback según el entorno
const getBackendUrl = () => {
  // Si hay variable de entorno definida, úsala pero fuerza HTTPS en producción
  if (import.meta.env.VITE_BACKEND_URL) {
    let url = import.meta.env.VITE_BACKEND_URL;

    // Forzar HTTPS en producción
    if (import.meta.env.PROD && url.startsWith('http://')) {
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
  finalUrl = finalUrl.replace('http://', 'https://');
}

export const API_BASE_URL = finalUrl;

// Interceptador global para corregir URLs HTTP en producción (solo window.fetch)
if (import.meta.env.PROD && typeof window !== 'undefined') {
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

    const cleanUrl = url.trim();
    const targetDomain = 'registro-valorizaciones-backend-503600768755.southamerica-west1.run.app';

    if (cleanUrl.includes('http://') && cleanUrl.includes(targetDomain)) {
      const correctedUrl = cleanUrl.replace('http://' + targetDomain, 'https://' + targetDomain);

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
}

// Service Worker ELIMINACIÓN COMPLETA para resolver problemas
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  console.log('🚫 Iniciando eliminación completa de Service Workers...');

  const removeServiceWorkers = async () => {
    try {
      // Obtener todos los registros
      const registrations = await navigator.serviceWorker.getRegistrations();

      if (registrations.length > 0) {
        console.log(`🔍 Encontrados ${registrations.length} Service Workers...`);

        // Desregistrar cada Service Worker
        const unregisterPromises = registrations.map(registration => {
          console.log('🗑️ Desinstalando Service Worker:', registration.scope);
          return registration.unregister();
        });

        await Promise.all(unregisterPromises);
        console.log('✅ Todos los Service Workers han sido desinstalados');

        // Esperar un momento y verificar nuevamente
        setTimeout(async () => {
          const remainingRegistrations = await navigator.serviceWorker.getRegistrations();
          if (remainingRegistrations.length > 0) {
            console.log('⚠️ Aún quedan Service Workers, intentando nuevamente...');
            remainingRegistrations.forEach(reg => reg.unregister());
          } else {
            console.log('✅ Verificación completa: No quedan Service Workers');
          }
        }, 1000);
      } else {
        console.log('✅ No se encontraron Service Workers registrados');
      }
    } catch (error) {
      console.error('❌ Error al eliminar Service Workers:', error);
    }
  };

  // Iniciar la eliminación
  removeServiceWorkers();

  // También intentar con el método más agresivo
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
      console.log('🗑️ Service Worker desinstalado desde ready state');
    }).catch(error => {
      console.log('No había Service Worker en ready state:', error);
    });
  }

  // Forzar recarga si hay un Service Worker activo
  if (navigator.serviceWorker.controller) {
    console.log('🔄 Service Worker activo detectado, forzando recarga en 2 segundos...');
    setTimeout(() => {
      window.location.reload(); // Recargar la página
    }, 2000);
  }
}

// Debug en producción
if (import.meta.env.PROD) {
  console.log('🌐 Configuración de API en producción:');
  console.log('  API_BASE_URL:', API_BASE_URL);
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
  empresas: `${API_BASE_URL}/empresas/`,              // CRUD completo - con trailing slash
  empresasGuardadas: `${API_BASE_URL}/empresas/`, // Listar guardadas (mismo endpoint)
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
export const EMPRESAS_ENDPOINT = `${API_BASE_URL}/empresas/`;

// Agregar parámetro de versión para evitar caché (SOLAMENTE en desarrollo)
if (import.meta.env.DEV) {
  // Cache busting solo en desarrollo
  const cacheParam = `?_v=${Date.now()}`;
  Object.keys(API_ENDPOINTS).forEach(key => {
    // No añadir cache busting a endpoints que necesitan paths dinámicos
    if (typeof API_ENDPOINTS[key as keyof typeof API_ENDPOINTS] === 'string' &&
        key !== 'consultaRucConsolidada' &&
        key !== 'empresas') {
      (API_ENDPOINTS as any)[key] += cacheParam;
    }
  });
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