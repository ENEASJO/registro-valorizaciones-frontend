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
    return 'https://registro-valorizaciones-503600768755.southamerica-west1.run.app';
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

// Debug en producción
if (import.meta.env.PROD) {
  console.log('🌐 Configuración de API en producción:');
  console.log('  API_BASE_URL:', API_BASE_URL);
  console.log('  VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
  console.log('  PROD:', import.meta.env.PROD);
  console.log('  MODE:', import.meta.env.MODE);
  console.log('  ¿Empieza con http://?:', API_BASE_URL.startsWith('http://'));
  console.log('  ¿Empieza con https://?:', API_BASE_URL.startsWith('https://'));
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
  
  // Empresas - Endpoints Turso integrados
  empresas: `${API_BASE_URL}/api/empresas`,              // CRUD completo
  empresasGuardadas: `${API_BASE_URL}/api/empresas`, // Listar guardadas (mismo endpoint)
  empresasSearch: `${API_BASE_URL}/api/empresas-guardadas/search`, // Buscar
  empresasStats: `${API_BASE_URL}/api/empresas-guardadas/stats`,   // Estadísticas
  
  // Obras - Turso integrado
  obras: `${API_BASE_URL}/obras`,
  
  // Valorizaciones - Turso integrado
  valorizaciones: `${API_BASE_URL}/valorizaciones`,
  
  // Health check
  health: `${API_BASE_URL}/health`,
  
  // OSCE - Extracción de consorcios con Playwright
  consultaOsce: `${API_BASE_URL}/consulta-osce`,
  buscar: `${API_BASE_URL}/buscar`
} as const;

// Agregar parámetro de versión para evitar caché en desarrollo
if (import.meta.env.DEV) {
  // En desarrollo, agregar timestamp para evitar caché
  const cacheParam = `?_v=${Date.now()}`;
  Object.keys(API_ENDPOINTS).forEach(key => {
    if (typeof API_ENDPOINTS[key as keyof typeof API_ENDPOINTS] === 'string') {
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