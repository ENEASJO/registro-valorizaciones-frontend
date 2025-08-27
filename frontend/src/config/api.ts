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

// URL base del backend - Usa variable de entorno o fallback a localhost para desarrollo
// Eliminar barra final si existe para evitar doble barras
const rawUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
export const API_BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

// Verificar que en producción no se use localhost
if (import.meta.env.PROD && API_BASE_URL.includes('localhost')) {
  console.error('🚨 ERROR: Usando localhost en producción!', {
    API_BASE_URL,
    env: import.meta.env
  });
}

// Configuración de endpoints
export const API_ENDPOINTS = {
  // Consultas RUC
  consultaRuc: `${API_BASE_URL}/consulta-ruc`,
  consultaRucConsolidada: `${API_BASE_URL}/consulta-ruc-consolidada`,
  
  // Empresas - Endpoint temporal funcionando
  empresas: `${API_BASE_URL}/api/empresas`,
  
  // Obras
  obras: `${API_BASE_URL}/api/v1/obras`,
  
  // Valorizaciones
  valorizaciones: `${API_BASE_URL}/api/v1/valorizaciones`,
  
  // Health check
  health: `${API_BASE_URL}/health`,
  
  // OSCE - Extracción de consorcios con Playwright
  consultaOsce: `${API_BASE_URL}/consulta-osce`,
  buscar: `${API_BASE_URL}/buscar`
} as const;

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