// =================================================================
// SERVICIO DE CONSULTA RUC CONSOLIDADA
// Sistema de Valorizaciones - Frontend
// =================================================================
/**
 * Interfaces para el sistema consolidado que combina datos de SUNAT y OSCE
 * Basado en el endpoint /consulta-ruc-consolidada/{ruc}
 */
// =================================================================
// INTERFACES DE DATOS CONSOLIDADOS
// =================================================================
export interface MiembroConsolidado {
  nombre: string;
  cargo?: string;
  tipo_documento?: string;
  numero_documento?: string;
  documento?: string;
  participacion?: string;
  fecha_desde?: string;
  fuente: 'SUNAT' | 'OECE' | 'AMBOS';
  fuentes_detalle: {
    sunat?: {
      cargo?: string;
      fecha_desde?: string;
      tipo_doc?: string;
      numero_doc?: string;
    };
    oece?: {
      cargo?: string;
      participacion?: string;
      tipo_documento?: string;
      numero_documento?: string;
    };
    matching?: string;
  };
}
export interface ContactoConsolidado {
  telefono?: string;
  email?: string;
  direccion?: string;
  domicilio_fiscal?: string;
  ciudad?: string;
  departamento?: string;
}
export interface RegistroConsolidado {
  sunat?: {
    ruc: string;
    razon_social: string;
    total_representantes: number;
  };
  osce?: {
    ruc: string;
    razon_social: string;
    estado_registro: string;
    total_especialidades: number;
    total_integrantes: number;
    vigencia: string;
    capacidad_contratacion: string;
  };
  estado_sunat?: string;
  estado_osce?: string;
}
export interface EmpresaConsolidada {
  ruc: string;
  razon_social: string;
  tipo_persona?: 'NATURAL' | 'JURIDICA';
  contacto: ContactoConsolidado;
  representantes: MiembroConsolidado[];
  especialidades: string[];
  especialidades_detalle: any[];
  registro: RegistroConsolidado;
  total_miembros?: number;
  total_especialidades?: number;
  fuentes_consultadas?: string[];
  fuentes_con_errores?: string[];
  capacidad_contratacion?: string;
  vigencia?: string;
  timestamp: string;
  consolidacion_exitosa?: boolean;
  observaciones?: string[];
}
export interface RespuestaConsolidada {
  success: true;
  data: EmpresaConsolidada;
  timestamp: string;
  fuente: 'CONSOLIDADO';
  version: string;
}
export interface ErrorConsolidado {
  error: true;
  success: false;
  message: string;
  ruc: string;
  fuente: 'CONSOLIDADO';
  timestamp: string;
}
export type ResultadoConsolidado = RespuestaConsolidada | ErrorConsolidado;
// =================================================================
// INTERFACES PARA FORMULARIO DE EMPRESA
// =================================================================
export interface DatosFormularioConsolidado {
  ruc: string;
  razon_social: string;
  nombre_comercial?: string;
  email?: string;
  telefono?: string;
  celular?: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  representante_legal?: string;
  dni_representante?: string;
  representantes?: MiembroConsolidado[];  // Array completo de representantes
  especialidades?: string[];
  estado?: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  tipo_empresa?: 'SAC' | 'SA' | 'SRL' | 'EIRL' | 'SCS' | 'SCR' | 'OTROS';
  categoria_contratista?: 'A' | 'B' | 'C' | 'D' | 'E';
}
export interface ResultadoFormularioConsolidado {
  success: boolean;
  datos?: DatosFormularioConsolidado;
  datosOriginales?: EmpresaConsolidada;
  error?: string;
  advertencias: string[];
  fuentes_utilizadas: string[];
  representantes_disponibles: Array<{
    nombre: string;
    dni: string;
    cargo: string;
    fuente: string;
  }>;
}
// =================================================================
// CONFIGURACIÓN DEL SERVICIO
// =================================================================
import { API_ENDPOINTS, DEFAULT_HEADERS, API_TIMEOUT } from '../config/api';

const API_BASE_URL = API_ENDPOINTS.consultaRucConsolidada.replace('/consulta-ruc-consolidada', '');
const TIMEOUT_MS = API_TIMEOUT; // Usar timeout configurado centralizadamente
// =================================================================
// FUNCIONES DE TRANSFORMACIÓN Y MAPEO
// =================================================================
/**
 * Mapea especialidades OSCE a especialidades del formulario
 */
function mapearEspecialidadesOSCE(especialidades: string[]): string[] {
  const mapeoEspecialidades: Record<string, string[]> = {
    'CATEGORIA A': ['EDIFICACIONES', 'CARRETERAS', 'PUENTES'],
    'CATEGORIA B': ['SANEAMIENTO', 'ELECTRICIDAD'],
    'CATEGORIA C': ['TELECOMUNICACIONES', 'AEROPUERTOS'],
    'EDIFICACIONES': ['EDIFICACIONES'],
    'CARRETERAS': ['CARRETERAS'],
    'PUENTES': ['PUENTES'],
    'SANEAMIENTO': ['SANEAMIENTO'],
    'ELECTRICIDAD': ['ELECTRICIDAD'],
    'TELECOMUNICACIONES': ['TELECOMUNICACIONES'],
    'AEROPUERTOS': ['AEROPUERTOS'],
    'PUERTOS': ['PUERTOS'],
    'FERROCARRILES': ['FERROCARRILES'],
    'IRRIGACION': ['IRRIGACION'],
    'HIDROENERGETICA': ['HIDROENERGETICA'],
    'TUNELES': ['TUNELES']
  };
  const especialidadesFormulario = new Set<string>();
  especialidades.forEach(especialidad => {
    const especialidadUpper = especialidad.toUpperCase().trim();
    if (mapeoEspecialidades[especialidadUpper]) {
      mapeoEspecialidades[especialidadUpper].forEach(esp => {
        especialidadesFormulario.add(esp);
      });
    } else {
      // Si no hay mapeo específico, intentar buscar coincidencias
      if (especialidadUpper.includes('EDIFICACION')) especialidadesFormulario.add('EDIFICACIONES');
      if (especialidadUpper.includes('CARRETERA')) especialidadesFormulario.add('CARRETERAS');
      if (especialidadUpper.includes('SANEAMIENTO')) especialidadesFormulario.add('SANEAMIENTO');
      if (especialidadUpper.includes('ELECTRIC')) especialidadesFormulario.add('ELECTRICIDAD');
    }
  });
  return Array.from(especialidadesFormulario);
}
/**
 * Selecciona el mejor representante legal basado en el cargo
 */
function seleccionarRepresentantePrincipal(representantes: MiembroConsolidado[]): MiembroConsolidado | null {
  if (!representantes || representantes.length === 0) return null;
  // Orden de prioridad por cargo
  const prioridadCargos = [
    'GERENTE GENERAL',
    'GERENTE',
    'PRESIDENTE',
    'DIRECTOR',
    'ADMINISTRADOR',
    'SOCIO',
    'REPRESENTANTE LEGAL'
  ];
  // Buscar por prioridad de cargo
  for (const cargoPreferido of prioridadCargos) {
    const representante = representantes.find(m =>
      m.cargo?.toUpperCase().includes(cargoPreferido)
    );
    if (representante) return representante;
  }
  // Si no se encuentra por cargo, devolver el primero con DNI válido
  return representantes.find(m => m.numero_documento && m.numero_documento.length >= 8) || representantes[0];
}
/**
 * Extrae ubicación de la dirección o domicilio fiscal
 */
function extraerUbicacion(direccion: string): { distrito?: string; provincia?: string; departamento?: string } {
  if (!direccion) return {};
  const direccionUpper = direccion.toUpperCase();
  // Patrones comunes en direcciones peruanas
  let distrito = '';
  let provincia = '';
  let departamento = '';
  // Buscar departamento (al final de la dirección típicamente)
  const departamentos = ['LIMA', 'AREQUIPA', 'CUSCO', 'TRUJILLO', 'CHICLAYO', 'PIURA', 'ANCASH', 'JUNIN', 'HUANCAYO'];
  for (const dep of departamentos) {
    if (direccionUpper.includes(dep)) {
      departamento = dep;
      break;
    }
  }
  // Buscar patrones específicos
  const patterns = [
    /(?:DISTRITO|DIST\.?)\s+([A-ZÁÉÍÓÚÑ\s]+?)(?:\s+-\s+|$)/,
    /(?:PROVINCIA|PROV\.?)\s+([A-ZÁÉÍÓÚÑ\s]+?)(?:\s+-\s+|$)/,
    /(?:DEPARTAMENTO|DPTO\.?)\s+([A-ZÁÉÍÓÚÑ\s]+?)(?:\s+-\s+|$)/
  ];
  patterns.forEach((pattern: any, index: number) => {
    const match = direccionUpper.match(pattern);
    if (match) {
      const valor = match[1].trim();
      switch(index) {
        case 0: distrito = valor; break;
        case 1: provincia = valor; break;
        case 2: departamento = valor; break;
      }
    }
  });
  // Si no se encontró departamento pero se tiene Lima en la dirección
  if (!departamento && direccionUpper.includes('LIMA')) {
    departamento = 'LIMA';
    if (!provincia) provincia = 'LIMA';
  }
  return {
    distrito: distrito || undefined,
    provincia: provincia || undefined,
    departamento: departamento || undefined
  };
}
/**
 * Determina el estado basado en los registros
 */
function determinarEstadoEmpresa(registro: RegistroConsolidado): 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' {
  // Priorizar estado de SUNAT
  if (registro.estado_sunat) {
    if (registro.estado_sunat.includes('ACTIVO')) return 'ACTIVO';
    if (registro.estado_sunat.includes('SUSPENDIDO')) return 'SUSPENDIDO';
    if (registro.estado_sunat.includes('INACTIVO')) return 'INACTIVO';
  }
  // Fallback a estado de OSCE
  if (registro.estado_osce) {
    if (registro.estado_osce.includes('HABILITADO') || registro.estado_osce.includes('EJECUTOR')) return 'ACTIVO';
    if (registro.estado_osce.includes('SUSPENDIDO')) return 'SUSPENDIDO';
  }
  return 'ACTIVO'; // Default
}
/**
 * Transforma datos consolidados al formato del formulario
 */
function transformarDatosConsolidados(datos: EmpresaConsolidada): DatosFormularioConsolidado {

  const ubicacion = extraerUbicacion(datos.contacto.direccion || datos.contacto.domicilio_fiscal || '');
  const especialidadesFormulario = mapearEspecialidadesOSCE(datos.especialidades);
  const estado = determinarEstadoEmpresa(datos.registro);
  const representantePrincipal = seleccionarRepresentantePrincipal(datos.representantes);

  return {
    ruc: datos.ruc,
    razon_social: datos.razon_social,
    nombre_comercial: undefined, // No disponible en el sistema consolidado actual
    email: datos.contacto.email,
    telefono: datos.contacto.telefono,
    celular: undefined, // Se puede mapear desde teléfono si es celular
    direccion: datos.contacto.direccion || datos.contacto.domicilio_fiscal,
    distrito: ubicacion.distrito,
    provincia: ubicacion.provincia,
    departamento: ubicacion.departamento,
    representante_legal: representantePrincipal?.nombre,
    dni_representante: representantePrincipal?.numero_documento || representantePrincipal?.documento,
    representantes: datos.representantes,  // Preservar array completo de representantes
    especialidades: especialidadesFormulario,
    estado,
    tipo_empresa: 'SAC', // Default, se puede inferir de la razón social
    categoria_contratista: datos.especialidades.includes('CATEGORIA A') ? 'A' :
                          datos.especialidades.includes('CATEGORIA B') ? 'B' :
                          datos.especialidades.includes('CATEGORIA C') ? 'C' : 'B'
  };
}
/**
 * Genera advertencias basadas en los datos consolidados
 */
function generarAdvertenciasConsolidadas(datos: EmpresaConsolidada): string[] {
  const advertencias: string[] = [];
  // Verificar errores en fuentes
  if (datos.fuentes_con_errores.length > 0) {
    advertencias.push(`Errores en fuentes: ${datos.fuentes_con_errores.join(', ')}`);
  }
  // Verificar consolidación parcial
  if (datos.fuentes_consultadas.length === 1) {
    advertencias.push(`Solo se pudo consultar: ${datos.fuentes_consultadas[0]}`);
  }
  // Verificar estado en OSCE
  if (datos.registro.estado_osce && !datos.registro.estado_osce.includes('HABILITADO')) {
    advertencias.push(`Estado en OSCE: ${datos.registro.estado_osce}`);
  }
  // Verificar información faltante
  if (!datos.contacto.telefono && !datos.contacto.email) {
    advertencias.push('No se encontró información de contacto');
  }
  if (datos.representantes.length === 0) {
    advertencias.push('No se encontraron representantes legales');
  }
  // Verificar especialidades
  if (datos.especialidades.length === 0 && datos.fuentes_consultadas?.includes('OECE')) {
    advertencias.push('No se encontraron especialidades registradas en OSCE');
  }
  // Verificar conflictos de datos entre fuentes
  const representantesConflicto = datos.representantes.filter(m =>
    m.fuente === 'AMBOS' &&
    m.fuentes_detalle.matching &&
    parseFloat(m.fuentes_detalle.matching.split('(')[1]?.split(')')[0]) < 1.0
  );
  if (representantesConflicto.length > 0) {
    advertencias.push('Se detectaron diferencias menores en datos de representantes entre SUNAT y OSCE');
  }
  // Observaciones del proceso de consolidación
  if (datos.observaciones.length > 0) {
    advertencias.push(...datos.observaciones);
  }
  return advertencias;
}
// =================================================================
// FUNCIÓN PRINCIPAL DEL SERVICIO
// =================================================================
/**
 * Consulta el endpoint consolidado de RUC
 */
export async function consultarRucConsolidado(ruc: string): Promise<ResultadoConsolidado> {
  // Validar formato de RUC
  const rucLimpio = ruc.replace(/\D/g, '');
  if (rucLimpio.length !== 11) {
    return {
      error: true,
      success: false,
      message: `El RUC debe tener 11 dígitos (actual: ${rucLimpio.length})`,
      ruc: rucLimpio,
      fuente: 'CONSOLIDADO',
      timestamp: new Date().toISOString(),
    };
  }
  if (!['10', '20'].includes(rucLimpio.substring(0, 2))) {
    return {
      error: true,
      success: false,
      message: `RUC inválido. Debe comenzar con 10 o 20 (actual: ${rucLimpio.substring(0, 2)})`,
      ruc: rucLimpio,
      fuente: 'CONSOLIDADO',
      timestamp: new Date().toISOString(),
    };
  }
  try {
    // Crear controlador para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, TIMEOUT_MS);
    // Realizar consulta al endpoint consolidado
    const response = await fetch(`${API_BASE_URL}/consulta-ruc-consolidada/${rucLimpio}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      let errorMessage = 'Error en la consulta consolidada';
      let errorDetails = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
      } catch {
        // Si no se puede parsear el error, usar mensaje genérico
      }
      return {
        error: true,
        success: false,
        message: errorMessage,
        ruc: rucLimpio,
        fuente: 'CONSOLIDADO',
        timestamp: new Date().toISOString(),
      };
    }
    const data = await response.json();
    // Verificar estructura de respuesta
    if (!data || !data.success || !data.data) {
      return {
        error: true,
        success: false,
        message: data.message || 'La respuesta no tiene el formato esperado',
        ruc: rucLimpio,
        fuente: 'CONSOLIDADO',
        timestamp: new Date().toISOString(),
      };
    }

    // Transformar respuesta del backend al formato esperado
    const backendData = data.data;
    const empresaConsolidada: EmpresaConsolidada = {
      ruc: backendData.ruc || '',
      razon_social: backendData.razon_social || '',
      tipo_persona: backendData.tipo_persona || ('JURIDICA' as 'NATURAL' | 'JURIDICA'),
      contacto: {
        direccion: backendData.direccion || '',
        domicilio_fiscal: backendData.direccion || '',
        departamento: backendData.departamento || '',
        email: backendData.contactos?.[0]?.email || '',
        telefono: backendData.contactos?.[0]?.telefono || '',
      },
      representantes: (backendData.representantes || []).map((rep: any) => ({
        nombre: rep.nombre || '',
        cargo: rep.cargo || '',
        numero_documento: rep.documento || '',
        documento: rep.documento || '',
        tipo_documento: 'DNI',
        fuente: (rep.fuente || 'SUNAT') as 'SUNAT' | 'OECE' | 'AMBOS',
        fuentes_detalle: {},
      })),
      especialidades: backendData.especialidades || [],
      especialidades_detalle: [],
      registro: {
        estado_sunat: backendData.estado || '',
        estado_osce: '',
      },
      timestamp: data.timestamp || new Date().toISOString(),
      fuentes_consultadas: backendData.fuentes || ['SUNAT'],
      fuentes_con_errores: [],
      consolidacion_exitosa: backendData.consolidacion_exitosa || true,
      observaciones: [],
    };

    return {
      success: true,
      data: empresaConsolidada,
      timestamp: data.timestamp || new Date().toISOString(),
      fuente: 'CONSOLIDADO',
      version: '1.0',
    } as RespuestaConsolidada;
  } catch (error) {
    let errorMessage = 'Error de conexión con el servicio consolidado';
    let errorCode = 'NETWORK_ERROR';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = `La consulta consolidada ha excedido el tiempo límite de ${TIMEOUT_MS/1000} segundos`;
        errorCode = 'TIMEOUT';
      } else if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        errorMessage = `Error de conexión. Verifique que la API esté ejecutándose en ${API_BASE_URL}`;
        errorCode = 'CONNECTION_ERROR';
      } else {
        errorMessage = error.message;
      }
    }
    return {
      error: true,
      success: false,
      message: errorMessage,
      ruc: rucLimpio,
      fuente: 'CONSOLIDADO',
      timestamp: new Date().toISOString(),
    };
  }
}
/**
 * Consulta consolidada y transforma datos para uso en formularios
 */
export async function consultarRucConsolidadoParaFormulario(ruc: string): Promise<ResultadoFormularioConsolidado> {
  const resultado = await consultarRucConsolidado(ruc);
  if (!resultado.success) {
    return {
      success: false,
      error: 'error' in resultado ? resultado.message : 'Error desconocido',
      advertencias: [],
      fuentes_utilizadas: [],
      representantes_disponibles: [],
    };
  }
  const datosTransformados = transformarDatosConsolidados(resultado.data);
  const advertencias = generarAdvertenciasConsolidadas(resultado.data);
  const representantesDisponibles = resultado.data.representantes.map(miembro => ({
    nombre: miembro.nombre,
    dni: miembro.numero_documento || miembro.documento || '',
    cargo: miembro.cargo || '',
    fuente: miembro.fuente,
  }));
  return {
    success: true,
    datos: datosTransformados,
    datosOriginales: resultado.data,
    advertencias,
    fuentes_utilizadas: resultado.data.fuentes_consultadas,
    representantes_disponibles: representantesDisponibles,
  };
}
// =================================================================
// UTILIDADES ADICIONALES
// =================================================================
/**
 * Verifica si el endpoint consolidado está disponible
 */
export async function verificarDisponibilidadConsolidada(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
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
/**
 * Cache para consultas consolidadas
 */
class CacheConsolidado {
  private cache = new Map<string, { data: ResultadoFormularioConsolidado; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutos para datos consolidados
  get(ruc: string): ResultadoFormularioConsolidado | null {
    const cached = this.cache.get(ruc);
    if (!cached) return null;
    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(ruc);
      return null;
    }
    return cached.data;
  }
  set(ruc: string, data: ResultadoFormularioConsolidado): void {
    this.cache.set(ruc, {
      data,
      timestamp: Date.now(),
    });
  }
  clear(): void {
    this.cache.clear();
  }
}
export const cacheConsolidado = new CacheConsolidado();
/**
 * Consulta consolidada con cache
 */
export async function consultarRucConsolidadoConCache(ruc: string): Promise<ResultadoFormularioConsolidado> {
  const rucLimpio = ruc.replace(/\D/g, '');
  // Verificar cache primero
  const cached = cacheConsolidado.get(rucLimpio);
  if (cached) {
    return cached;
  }
  // Realizar consulta
  const resultado = await consultarRucConsolidadoParaFormulario(rucLimpio);
  // Cachear solo resultados exitosos
  if (resultado.success) {
    cacheConsolidado.set(rucLimpio, resultado);
  }
  return resultado;
}
export default {
  consultarRucConsolidado,
  consultarRucConsolidadoParaFormulario,
  consultarRucConsolidadoConCache,
  verificarDisponibilidadConsolidada,
  cacheConsolidado,
};