// =================================================================
// SERVICIO DE CONSULTA RUC
// Sistema de Valorizaciones - Frontend
// =================================================================
/**
 * Datos de empresa obtenidos de la consulta RUC
 */
export interface DatosRucConsulta {
  ruc: string;
  razon_social: string;
  nombre_comercial?: string;
  estado_contribuyente: string;
  condicion_domicilio: string;
  direccion_completa: string;
  domicilio_fiscal?: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  ubigeo?: string;
  fecha_inscripcion?: string;
  fecha_inicio_actividades?: string;
  tipo_contribuyente?: string;
  tipo_persona?: 'NATURAL' | 'JURÍDICA';
  representantes_legales?: Array<{
    tipo_documento: string;
    numero_documento: string;
    nombre_completo: string;
    cargo: string;
    fecha_desde: string;
    fecha_hasta?: string;
  }>;
  email?: string;
  telefono?: string;
  actividades_economicas?: Array<{
    ciiu: string;
    descripcion: string;
    principal: boolean;
  }>;
}
/**
 * Respuesta exitosa de la API de consulta RUC
 */
export interface RespuestaConsultaRuc {
  success: true;
  data: DatosRucConsulta;
  message: string;
  timestamp: string;
}
/**
 * Respuesta de error de la API de consulta RUC
 */
export interface ErrorConsultaRuc {
  success: false;
  error: string;
  message: string;
  details?: string;
  timestamp: string;
}
/**
 * Respuesta unificada de la API
 */
export type ResultadoConsultaRuc = RespuestaConsultaRuc | ErrorConsultaRuc;
/**
 * Datos procesados para formulario de empresa
 */
export interface DatosEmpresaFormulario {
  ruc: string;
  razon_social: string;
  nombre_comercial?: string;
  direccion?: string;
  domicilio_fiscal?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  representante_legal?: string;
  dni_representante?: string;
  email?: string;
  telefono?: string;
  ubigeo?: string;
  fecha_constitucion?: string;
}
/**
 * Resultado de consulta y transformación para formularios
 */
export interface ResultadoConsultaFormulario {
  success: boolean;
  datos?: DatosEmpresaFormulario;
  datosOriginales?: DatosRucConsulta;
  error?: string;
  advertencias: string[];
}
// =================================================================
// CONFIGURACIÓN DEL SERVICIO
// =================================================================
import { API_BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS, API_TIMEOUT } from '../config/api';

const TIMEOUT_MS = API_TIMEOUT; // Usar timeout configurado centralizadamente
// =================================================================
// FUNCIONES DE VALIDACIÓN
// =================================================================
/**
 * Valida si un RUC tiene el formato correcto
 */
export function validarFormatoRuc(ruc: string): boolean {
  if (!ruc || typeof ruc !== 'string') return false;
  // RUC debe tener 11 dígitos
  const rucLimpio = ruc.replace(/\D/g, '');
  if (rucLimpio.length !== 11) return false;
  // Los dos primeros dígitos indican el tipo de contribuyente
  const tipoContribuyente = rucLimpio.substring(0, 2);
  const tiposValidos = ['10', '15', '17', '20', '25'];
  return tiposValidos.includes(tipoContribuyente);
}
/**
 * Limpia y formatea un RUC
 */
export function limpiarRuc(ruc: string): string {
  return ruc.replace(/\D/g, '');
}
// =================================================================
// FUNCIONES DE TRANSFORMACIÓN
// =================================================================
/**
 * Transforma la respuesta de la API consolidada al formato interno esperado
 */
function transformarRespuestaAPI(apiData: any): DatosRucConsulta {
  // La API consolidada devuelve una estructura diferente
  return {
    ruc: apiData.ruc || '',
    razon_social: apiData.razon_social || '',
    nombre_comercial: undefined,
    estado_contribuyente: apiData.estado || 'ACTIVO',
    condicion_domicilio: 'HABIDO',
    direccion_completa: apiData.direccion || '',
    domicilio_fiscal: apiData.direccion || '',
    direccion: apiData.direccion,
    distrito: apiData.distrito,
    provincia: apiData.provincia,
    departamento: apiData.departamento,
    ubigeo: undefined,
    fecha_inscripcion: undefined,
    fecha_inicio_actividades: undefined,
    tipo_contribuyente: undefined,
    tipo_persona: apiData.ruc?.startsWith('10') ? 'NATURAL' : 'JURÍDICA',
    representantes_legales: (apiData.representantes || []).map((rep: any) => ({
      tipo_documento: 'DNI',
      numero_documento: rep.documento || '',
      nombre_completo: rep.nombre || '',
      cargo: rep.cargo || '',
      fecha_desde: '',
      fecha_hasta: undefined
    })),
    email: apiData.contactos?.[0]?.email || '',
    telefono: apiData.contactos?.[0]?.telefono || '',
    actividades_economicas: []
  };
}
/**
 * Transforma datos de SUNAT a formato del formulario de empresa
 */
function transformarDatosParaFormulario(datos: DatosRucConsulta): DatosEmpresaFormulario {
  const representante = datos.representantes_legales?.[0];
  return {
    ruc: datos.ruc,
    razon_social: datos.razon_social,
    nombre_comercial: datos.nombre_comercial || undefined,
    direccion: datos.direccion || datos.direccion_completa,
    domicilio_fiscal: datos.domicilio_fiscal,
    distrito: datos.distrito,
    provincia: datos.provincia,
    departamento: datos.departamento,
    representante_legal: representante?.nombre_completo,
    dni_representante: representante?.numero_documento,
    email: datos.email,
    telefono: datos.telefono,
    ubigeo: datos.ubigeo,
    fecha_constitucion: datos.fecha_inscripcion,
  };
}
/**
 * Genera advertencias basadas en los datos obtenidos
 */
function generarAdvertencias(datos: DatosRucConsulta): string[] {
  const advertencias: string[] = [];
  // Estado del contribuyente
  if (datos.estado_contribuyente !== 'ACTIVO') {
    advertencias.push(`El estado del contribuyente es: ${datos.estado_contribuyente}`);
  }
  // Condición del domicilio
  if (datos.condicion_domicilio !== 'HABIDO') {
    advertencias.push(`La condición del domicilio es: ${datos.condicion_domicilio}`);
  }
  // Falta de datos importantes
  if (!datos.representantes_legales || datos.representantes_legales.length === 0) {
    advertencias.push('No se encontró información de representantes legales');
  }
  if (!datos.direccion && !datos.direccion_completa) {
    advertencias.push('No se encontró información de dirección');
  }
  if (!datos.distrito || !datos.provincia || !datos.departamento) {
    advertencias.push('La información de ubicación geográfica está incompleta');
  }
  return advertencias;
}
// =================================================================
// FUNCIONES PRINCIPALES DEL SERVICIO
// =================================================================
/**
 * Realiza consulta directa a la API de RUC
 */
export async function consultarRucAPI(ruc: string): Promise<ResultadoConsultaRuc> {
  // Validar formato de RUC
  const rucLimpio = limpiarRuc(ruc);
  if (!validarFormatoRuc(rucLimpio)) {
    // Generar mensaje específico basado en el error
    let errorMessage = 'RUC inválido';
    if (rucLimpio.length !== 11) {
      errorMessage = `El RUC debe tener 11 dígitos (actual: ${rucLimpio.length})`;
    } else {
      const prefijo = rucLimpio.substring(0, 2);
      errorMessage = `RUC inválido. Debe comenzar con 10, 15, 17, 20 o 25 (actual: ${prefijo})`;
    }
    return {
      success: false,
      error: 'INVALID_RUC_FORMAT',
      message: errorMessage,
      details: 'El RUC debe tener 11 dígitos y comenzar con 10, 15, 17, 20 o 25',
      timestamp: new Date().toISOString(),
    };
  }
  try {
    // Crear controlador para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, TIMEOUT_MS);
    // Usar el endpoint consolidado GET para obtener todos los datos (SUNAT + OSCE)
    const response = await fetch(`${API_BASE_URL}/consulta-ruc-consolidada/${rucLimpio}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      let errorMessage = 'Error desconocido en la consulta';
      let errorDetails = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
        if (errorData.details) errorDetails = errorData.details;
      } catch {
        // Si no se puede parsear el error, usar mensaje genérico
      }
      return {
        success: false,
        error: `HTTP_${response.status}`,
        message: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
      };
    }
    const response_data = await response.json();
    // console.log('🔍 Respuesta del backend (consolidado):', response_data);

    // Verificar estructura de respuesta
    if (!response_data || typeof response_data !== 'object') {
      return {
        success: false,
        error: 'INVALID_RESPONSE',
        message: 'La respuesta del servidor no tiene el formato esperado',
        timestamp: new Date().toISOString(),
      };
    }

    // Verificar respuesta exitosa del backend
    if (!response_data.success) {
      return {
        success: false,
        error: 'API_ERROR',
        message: response_data.message || 'Error en la consulta del backend',
        timestamp: new Date().toISOString(),
      };
    }

    // Extraer los datos del wrapper - la respuesta consolidada tiene estructura diferente
    const data = response_data.data;
    if (!data) {
      return {
        success: false,
        error: 'NO_DATA',
        message: 'El backend no devolvió datos',
        timestamp: new Date().toISOString(),
      };
    }
    
    // Transformar la respuesta de la API al formato esperado por la aplicación
    const transformedData = transformarRespuestaAPI(data);
    // Validar datos mínimos requeridos
    if (!transformedData.ruc || !transformedData.razon_social) {
      return {
        success: false,
        error: 'INCOMPLETE_DATA',
        message: 'Los datos obtenidos están incompletos',
        details: 'Faltan campos obligatorios: RUC o razón social',
        timestamp: new Date().toISOString(),
      };
    }
    return {
      success: true,
      data: transformedData,
      message: 'Consulta exitosa',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    let errorMessage = 'Error de conexión con el servicio de consulta RUC';
    let errorCode = 'NETWORK_ERROR';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = `La consulta ha excedido el tiempo límite de ${TIMEOUT_MS/1000} segundos`;
        errorCode = 'TIMEOUT';
      } else if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        errorMessage = `Error de conexión. Verifique que la API esté ejecutándose en ${API_BASE_URL}`;
        errorCode = 'CONNECTION_ERROR';
      } else {
        errorMessage = error.message;
        errorCode = 'UNKNOWN_ERROR';
      }
    }
    return {
      success: false,
      error: errorCode,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    };
  }
}
/**
 * Consulta RUC y transforma los datos para uso en formularios
 */
export async function consultarRucParaFormulario(ruc: string): Promise<ResultadoConsultaFormulario> {
  const resultado = await consultarRucAPI(ruc);
  if (!resultado.success) {
    return {
      success: false,
      error: resultado.message,
      advertencias: [],
    };
  }
  const datosTransformados = transformarDatosParaFormulario(resultado.data);
  const advertencias = generarAdvertencias(resultado.data);
  return {
    success: true,
    datos: datosTransformados,
    datosOriginales: resultado.data,
    advertencias,
  };
}
/**
 * Verifica si la API está disponible
 */
export async function verificarDisponibilidadAPI(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos para ping
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}
// =================================================================
// UTILIDADES ADICIONALES
// =================================================================
/**
 * Formatea un RUC para mostrar con guiones
 */
export function formatearRucParaMostrar(ruc: string): string {
  const rucLimpio = limpiarRuc(ruc);
  if (rucLimpio.length === 11) {
    return `${rucLimpio.substring(0, 2)}-${rucLimpio.substring(2, 10)}-${rucLimpio.substring(10)}`;
  }
  return ruc;
}
/**
 * Obtiene el tipo de contribuyente basado en el RUC
 */
export function obtenerTipoContribuyente(ruc: string): string {
  const rucLimpio = limpiarRuc(ruc);
  const prefijo = rucLimpio.substring(0, 2);
  const tipos: Record<string, string> = {
    '10': 'Persona Natural',
    '15': 'Persona Natural - Sucesión Indivisa',
    '17': 'Persona Natural - No Domiciliado',
    '20': 'Persona Jurídica',
    '25': 'Persona Jurídica - No Domiciliado',
  };
  return tipos[prefijo] || 'Tipo no reconocido';
}
/**
 * Cache simple para evitar consultas repetidas
 */
class CacheConsultaRuc {
  private cache = new Map<string, { data: ResultadoConsultaFormulario; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  get(ruc: string): ResultadoConsultaFormulario | null {
    const cached = this.cache.get(ruc);
    if (!cached) return null;
    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(ruc);
      return null;
    }
    return cached.data;
  }
  set(ruc: string, data: ResultadoConsultaFormulario): void {
    this.cache.set(ruc, {
      data,
      timestamp: Date.now(),
    });
  }
  clear(): void {
    this.cache.clear();
  }
}
export const cacheConsultaRuc = new CacheConsultaRuc();
/**
 * Consulta RUC con cache
 */
export async function consultarRucConCache(ruc: string): Promise<ResultadoConsultaFormulario> {
  const rucLimpio = limpiarRuc(ruc);
  // Verificar cache primero
  const cached = cacheConsultaRuc.get(rucLimpio);
  if (cached) {
    return cached;
  }
  // Realizar consulta
  const resultado = await consultarRucParaFormulario(rucLimpio);
  // Cachear solo resultados exitosos
  if (resultado.success) {
    cacheConsultaRuc.set(rucLimpio, resultado);
  }
  return resultado;
}
export default {
  consultarRucAPI,
  consultarRucParaFormulario,
  consultarRucConCache,
  validarFormatoRuc,
  limpiarRuc,
  formatearRucParaMostrar,
  obtenerTipoContribuyente,
  verificarDisponibilidadAPI,
  cacheConsultaRuc,
};