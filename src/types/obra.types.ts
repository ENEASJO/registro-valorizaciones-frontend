// =================================================================
// TIPOS TYPESCRIPT PARA MÓDULO DE OBRAS
// Sistema de Valorizaciones - Frontend
// =================================================================


// Tipos base para auditoría
export interface AuditoriaBase {
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
  version?: number;
}

// Tipos de estado para obras
export type EstadoObra = 
  | 'REGISTRADA'
  | 'EN_EJECUCION' 
  | 'PARALIZADA'
  | 'TERMINADA'
  | 'LIQUIDADA'
  | 'CANCELADA';

export type EstadoValorizacion = 
  | 'PROGRAMADA'
  | 'EN_PROCESO'
  | 'APROBADA'
  | 'PAGADA';

export type EstadoProfesional = 
  | 'ACTIVO'
  | 'RETIRADO'
  | 'SUSPENDIDO';

export type EstadoDocumento = 
  | 'VIGENTE'
  | 'VENCIDO'
  | 'REEMPLAZADO'
  | 'ANULADO';

// Tipos de obra y modalidades
export type TipoObra = 
  | 'CARRETERA'
  | 'EDIFICACION'
  | 'SANEAMIENTO'
  | 'ELECTRICIDAD'
  | 'PUENTE'
  | 'VEREDAS_PISTAS'
  | 'PARQUES_JARDINES'
  | 'DRENAJE_PLUVIAL'
  | 'OTROS';

export type ModalidadEjecucion = 
  | 'ADMINISTRACION_DIRECTA'
  | 'CONTRATA'
  | 'ENCARGO'
  | 'CONVENIO';

// Leyes peruanas de contratación pública
export type LeyContratacion = 
  | 'LEY_30225' // Contratos anteriores al 22/04/2025
  | 'LEY_32069'; // Contratos desde 22/04/2025

// Procedimientos de selección según ley peruana
export type ProcedimientoSeleccionLey30225 = 
  | 'LICITACION_PUBLICA'
  | 'CONCURSO_PUBLICO'
  | 'ADJUDICACION_SIMPLIFICADA'
  | 'CONTRATACION_DIRECTA'
  | 'SUBASTA_INVERSA_ELECTRONICA'
  | 'COMPARACION_PRECIOS'
  | 'SELECCION_CONSULTORES_INDIVIDUALES'
  | 'CATALOGO_ELECTRONICO_ACUERDOS_MARCO';

export type ProcedimientoSeleccionLey32069 = 
  | 'LICITACION_PUBLICA'
  | 'CONCURSO_PUBLICO'
  | 'COMPARACION_PRECIOS'
  | 'SUBASTA_INVERSA_ELECTRONICA'
  | 'CONTRATACION_DIRECTA'
  | 'SELECCION_CONSULTORES_INDIVIDUALES'
  | 'COMPRAS_CENTRALIZADAS'
  | 'COMPRAS_CORPORATIVAS'
  | 'COMPRAS_CENTRALIZADAS_EMERGENCIA';

export type ProcedimientoSeleccion = ProcedimientoSeleccionLey30225 | ProcedimientoSeleccionLey32069;

export type SistemaContratacion = 
  | 'SUMA_ALZADA' // Monto fijo global
  | 'PRECIOS_UNITARIOS' // Cantidades × precios unitarios
  | 'TARIFAS' // Tarifa por unidad de tiempo
  | 'PORCENTAJE_MONTO' // % del valor ejecutado
  | 'LLAVE_EN_MANO'; // Design-Build

// Tipos de documento
export type TipoDocumentoObra = 
  | 'CONTRATO_EJECUCION'
  | 'CONTRATO_SUPERVISION'
  | 'EXPEDIENTE_TECNICO'
  | 'ORDEN_INICIO'
  | 'ACTA_ENTREGA_TERRENO'
  | 'PLANOS'
  | 'ESPECIFICACIONES_TECNICAS'
  | 'METRADOS'
  | 'PRESUPUESTO'
  | 'CRONOGRAMA'
  | 'OTROS';

// =================================================================
// INTERFACES PRINCIPALES
// =================================================================

/**
 * Profesión disponible para el plantel técnico
 */
export interface Profesion extends AuditoriaBase {
  id: number;
  codigo: string;
  nombre: string;
  abreviatura?: string;
  area_especialidad?: string;
  descripcion?: string;
  observaciones?: string;
  activo: boolean;
}

/**
 * Obra principal del sistema
 */
export interface Obra extends AuditoriaBase {
  id: string;

  // Identificación
  numero_contrato: string;
  nombre: string;
  codigo_interno?: string;

  // Referencias a entidades contratistas
  entidad_ejecutora_id: string;
  entidad_supervisora_id: string;
  
  // Montos
  monto_ejecucion: number;
  monto_supervision: number;
  monto_total: number; // Campo calculado
  
  // Plazos y fechas
  plazo_ejecucion_dias: number;
  numero_valorizaciones: number; // Campo calculado
  fecha_inicio: string;
  fecha_fin_prevista: string; // Campo calculado
  fecha_fin_real?: string;
  fecha_termino?: string; // Fecha de término/culminación planificada
  
  // Ubicación
  ubicacion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  ubigeo?: string;
  
  // Clasificación técnica
  tipo_obra?: TipoObra;
  modalidad_ejecucion?: ModalidadEjecucion;
  sistema_contratacion?: SistemaContratacion;
  
  // Normativa peruana
  ley_aplicable?: LeyContratacion;
  procedimiento_seleccion?: ProcedimientoSeleccion;
  fecha_contrato?: string; // Para determinar ley aplicable
  
  // Estados
  estado: EstadoObra;
  
  // Metadatos
  descripcion?: string;
  observaciones?: string;
  activo: boolean;
}

/**
 * Formulario para crear/editar obra
 */
export interface ObraForm {
  numero_contrato: string;
  nombre: string;
  codigo_interno?: string;
  entidad_ejecutora_id: string;
  entidad_supervisora_id: string;
  monto_ejecucion: number;
  monto_supervision: number;
  plazo_ejecucion_dias: number;
  fecha_inicio: string;
  fecha_termino?: string;
  ubicacion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  ubigeo?: string;
  tipo_obra?: TipoObra;
  modalidad_ejecucion?: ModalidadEjecucion;
  sistema_contratacion?: SistemaContratacion;
  ley_aplicable?: LeyContratacion;
  procedimiento_seleccion?: ProcedimientoSeleccion;
  fecha_contrato?: string;
  descripcion?: string;
  observaciones?: string;
}

/**
 * Profesional asignado a una obra
 */
export interface ObraProfesional extends AuditoriaBase {
  id: number;
  obra_id: number;
  profesion_id: number;
  
  // Datos del profesional
  nombre_completo: string;
  numero_colegiatura?: string;
  dni?: string;
  telefono?: string;
  email?: string;
  
  // Participación en la obra
  porcentaje_participacion: number;
  fecha_inicio_participacion: string;
  fecha_fin_participacion?: string;
  
  // Rol específico
  cargo?: string;
  responsabilidades?: string[];
  
  // Estados
  estado: EstadoProfesional;
  
  // Metadatos
  observaciones?: string;
  activo: boolean;
}

/**
 * Formulario para profesional de obra
 */
export interface ProfesionalForm {
  profesion_id: number;
  nombre_completo: string;
  numero_colegiatura?: string;
  dni?: string;
  telefono?: string;
  email?: string;
  porcentaje_participacion: number;
  fecha_inicio_participacion: string;
  fecha_fin_participacion?: string;
  cargo?: string;
  responsabilidades?: string[];
  observaciones?: string;
}

/**
 * Valorización de obra
 */
export interface ObraValorizacion extends AuditoriaBase {
  id: string;
  obra_id: string;
  
  // Identificación
  numero_valorizacion: number;
  periodo_inicio: string;
  periodo_fin: string;
  
  // Montos
  monto_ejecutado: number;
  porcentaje_avance: number;
  monto_acumulado: number;
  porcentaje_acumulado: number;
  
  // Estados
  estado: EstadoValorizacion;
  
  // Fechas de proceso
  fecha_programada: string;
  fecha_presentacion?: string;
  fecha_aprobacion?: string;
  fecha_pago?: string;
  
  // Metadatos
  observaciones?: string;
  activo: boolean;
}

/**
 * Documento de obra
 */
export interface ObraDocumento extends AuditoriaBase {
  id: number;
  obra_id: number;
  
  // Datos del documento
  tipo_documento: TipoDocumentoObra;
  nombre_archivo: string;
  ruta_archivo: string;
  tamaño_archivo?: number;
  tipo_mime?: string;
  
  // Metadatos
  numero_documento?: string;
  fecha_documento?: string;
  fecha_vencimiento?: string;
  
  // Estados
  estado: EstadoDocumento;
  
  // Metadatos
  descripcion?: string;
  observaciones?: string;
  activo: boolean;
}

// =================================================================
// INTERFACES PARA VISTAS Y CONSULTAS COMPLEJAS
// =================================================================

/**
 * Vista detallada de obra con información extendida
 */
export interface ObraDetalle extends Obra {
  // Información de entidades contratistas
  ejecutora_nombre: string;
  ejecutora_ruc: string;
  supervisora_nombre: string;
  supervisora_ruc: string;
  
  // Estadísticas de avance
  porcentaje_avance_total: number;
  monto_ejecutado_total: number;
  
  // Información del plantel profesional
  plantel_profesional?: ObraProfesionalDetalle[];
  
  // Información de valorizaciones
  valorizaciones?: ObraValorizacion[];
  
  // Documentos asociados
  documentos?: ObraDocumento[];
}

/**
 * Profesional con información extendida y validaciones
 */
export interface ObraProfesionalDetalle extends ObraProfesional {
  // Información de la profesión
  profesion_nombre: string;
  profesion_abreviatura?: string;
  
  // Información de la obra
  obra_nombre: string;
  obra_numero_contrato: string;
  obra_fecha_inicio: string;
  obra_fecha_fin: string;
  
  // Validaciones
  tiene_conflictos: boolean;
  conflictos?: ConflictoProfesional[];
}

/**
 * Conflicto de disponibilidad de profesional
 */
export interface ConflictoProfesional {
  obra_id: number;
  obra_nombre: string;
  numero_contrato: string;
  fecha_inicio: string;
  fecha_fin_prevista: string;
  porcentaje_participacion: number;
}

/**
 * Valorización con información extendida
 */
export interface ValorizacionDetalle extends ObraValorizacion {
  // Información de la obra
  obra_nombre: string;
  obra_numero_contrato: string;
  obra_monto_total: number;
  
  // Cálculos adicionales
  porcentaje_del_total: number;
  dias_atraso: number;
}

// =================================================================
// INTERFACES PARA API Y RESPUESTAS
// =================================================================

/**
 * Respuesta paginada para listados
 */
export interface RespuestaPaginada<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Filtros para búsqueda de obras
 */
export interface FiltrosObra {
  search?: string;
  estado?: EstadoObra;
  entidad_ejecutora_id?: string;
  entidad_supervisora_id?: string;
  tipo_obra?: TipoObra;
  modalidad_ejecucion?: ModalidadEjecucion;
  fecha_inicio_desde?: string;
  fecha_inicio_hasta?: string;
  monto_desde?: number;
  monto_hasta?: number;
  distrito?: string;
  provincia?: string;
  departamento?: string;
}

/**
 * Filtros para búsqueda de profesionales
 */
export interface FiltrosProfesional {
  search?: string;
  profesion_id?: number;
  estado?: EstadoProfesional;
  porcentaje_participacion?: number;
  disponible_para_fechas?: {
    fecha_inicio: string;
    fecha_fin: string;
  };
}

/**
 * Parámetros para crear obra completa con plantel
 */
export interface CrearObraParams {
  obra: ObraForm;
  plantel_profesional: ProfesionalForm[];
}

/**
 * Estadísticas del dashboard de obras
 */
export interface EstadisticasObras {
  obras_totales: number;
  obras_activas: number;
  obras_terminadas: number;
  obras_paralizadas: number;
  monto_total_obras: number;
  monto_ejecutado_total: number;
  obras_por_estado: Record<EstadoObra, number>;
  obras_por_tipo: Record<TipoObra, number>;
  valorizaciones_pendientes: number;
  valorizaciones_vencidas: number;
  profesionales_con_conflictos: number;
  top_ejecutoras: Array<{
    entidad_id: number;
    entidad_nombre: string;
    total_obras: number;
    monto_total: number;
  }>;
}

/**
 * Resumen de avance de obra
 */
export interface ResumenAvanceObra {
  obra_id: number;
  porcentaje_avance_fisico: number;
  porcentaje_avance_financiero: number;
  monto_ejecutado: number;
  valorizaciones_aprobadas: number;
  valorizaciones_pendientes: number;
  valorizaciones_vencidas: number;
  dias_transcurridos: number;
  dias_restantes: number;
  estado_cronograma: 'EN_TIEMPO' | 'ATRASADO' | 'ADELANTADO';
}

// =================================================================
// TIPOS PARA VALIDACIÓN
// =================================================================

/**
 * Errores de validación
 */
export interface ErrorValidacion {
  campo: string;
  mensaje: string;
  codigo?: string;
}

/**
 * Resultado de validación
 */
export interface ResultadoValidacion {
  valido: boolean;
  errores: ErrorValidacion[];
}

/**
 * Resultado de validación de disponibilidad de profesional
 */
export interface ResultadoDisponibilidadProfesional {
  disponible: boolean;
  conflictos: ConflictoProfesional[];
}

// =================================================================
// TIPOS PARA FORMULARIOS Y UI
// =================================================================

/**
 * Opciones para selects
 */
export interface OpcionSelect<T = string | number> {
  value: T;
  label: string;
  disabled?: boolean;
}

/**
 * Opciones para select de profesiones
 */
export interface OpcionProfesion extends OpcionSelect<number> {
  codigo: string;
  abreviatura?: string;
  area_especialidad?: string;
}

/**
 * Opciones para select de entidades contratistas
 */
export interface OpcionEntidadContratista extends OpcionSelect<number> {
  ruc?: string;
  tipo_entidad: 'EMPRESA' | 'CONSORCIO';
  categoria?: string;
}

/**
 * Estados de formulario
 */
export type EstadoFormulario = 'idle' | 'loading' | 'success' | 'error';

/**
 * Configuración de tabla
 */
export interface ConfiguracionTabla {
  columnas: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
  }>;
  ordenamiento?: {
    campo: string;
    direccion: 'asc' | 'desc';
  };
  paginacion?: {
    page: number;
    limit: number;
  };
}

/**
 * Configuración para validación de número de contrato
 */
export interface ConfiguracionNumeroContrato {
  patron: RegExp;
  formato: string;
  ejemplo: string;
  descripcion: string;
}

/**
 * Configuración para formateo de moneda
 */
export interface ConfiguracionMoneda {
  simbolo: string;
  decimales: number;
  separador_miles: string;
  separador_decimal: string;
}

// =================================================================
// CONSTANTES Y CONFIGURACIONES
// =================================================================

export const ESTADOS_OBRA: Record<EstadoObra, string> = {
  REGISTRADA: 'Registrada',
  EN_EJECUCION: 'En Ejecución',
  PARALIZADA: 'Paralizada',
  TERMINADA: 'Terminada',
  LIQUIDADA: 'Liquidada',
  CANCELADA: 'Cancelada'
};

export const ESTADOS_VALORIZACION: Record<EstadoValorizacion, string> = {
  PROGRAMADA: 'Programada',
  EN_PROCESO: 'En Proceso',
  APROBADA: 'Aprobada',
  PAGADA: 'Pagada'
};

export const TIPOS_OBRA: Record<TipoObra, string> = {
  CARRETERA: 'Carretera',
  EDIFICACION: 'Edificación',
  SANEAMIENTO: 'Saneamiento',
  ELECTRICIDAD: 'Electricidad',
  PUENTE: 'Puente',
  VEREDAS_PISTAS: 'Veredas y Pistas',
  PARQUES_JARDINES: 'Parques y Jardines',
  DRENAJE_PLUVIAL: 'Drenaje Pluvial',
  OTROS: 'Otros'
};

export const MODALIDADES_EJECUCION: Record<ModalidadEjecucion, string> = {
  ADMINISTRACION_DIRECTA: 'Administración Directa',
  CONTRATA: 'Contrata',
  ENCARGO: 'Encargo',
  CONVENIO: 'Convenio'
};

export const SISTEMAS_CONTRATACION: Record<SistemaContratacion, string> = {
  SUMA_ALZADA: 'A Suma Alzada (monto fijo global)',
  PRECIOS_UNITARIOS: 'Por Precios Unitarios (cantidades × precios unitarios)',
  TARIFAS: 'Por Tarifas (tarifa por unidad de tiempo)',
  PORCENTAJE_MONTO: 'Por Porcentaje del monto contratado (% del valor ejecutado)',
  LLAVE_EN_MANO: 'Llave en Mano (Design-Build)'
};

// Leyes de contratación pública peruana
export const LEYES_CONTRATACION: Record<LeyContratacion, string> = {
  LEY_30225: 'Ley N° 30225 (antes del 22/04/2025)',
  LEY_32069: 'Ley N° 32069 (desde el 22/04/2025)'
};

// Procedimientos de selección según Ley 30225
export const PROCEDIMIENTOS_LEY_30225: Record<ProcedimientoSeleccionLey30225, string> = {
  LICITACION_PUBLICA: 'Licitación Pública',
  CONCURSO_PUBLICO: 'Concurso Público',
  ADJUDICACION_SIMPLIFICADA: 'Adjudicación Simplificada',
  CONTRATACION_DIRECTA: 'Contratación Directa',
  SUBASTA_INVERSA_ELECTRONICA: 'Subasta Inversa Electrónica',
  COMPARACION_PRECIOS: 'Comparación de Precios',
  SELECCION_CONSULTORES_INDIVIDUALES: 'Selección de Consultores Individuales',
  CATALOGO_ELECTRONICO_ACUERDOS_MARCO: 'Catálogo Electrónico de Acuerdos Marco'
};

// Procedimientos de selección según Ley 32069
export const PROCEDIMIENTOS_LEY_32069: Record<ProcedimientoSeleccionLey32069, string> = {
  LICITACION_PUBLICA: 'Licitación Pública',
  CONCURSO_PUBLICO: 'Concurso Público',
  COMPARACION_PRECIOS: 'Comparación de Precios',
  SUBASTA_INVERSA_ELECTRONICA: 'Subasta Inversa Electrónica',
  CONTRATACION_DIRECTA: 'Contratación Directa',
  SELECCION_CONSULTORES_INDIVIDUALES: 'Selección de Consultores Individuales',
  COMPRAS_CENTRALIZADAS: 'Compras Centralizadas',
  COMPRAS_CORPORATIVAS: 'Compras Corporativas',
  COMPRAS_CENTRALIZADAS_EMERGENCIA: 'Compras Centralizadas de Emergencia'
};

// Tooltips explicativos para sistemas de contratación
export const TOOLTIPS_SISTEMAS_CONTRATACION: Record<SistemaContratacion, string> = {
  SUMA_ALZADA: 'El contratista se compromete a ejecutar la obra por un monto fijo e invariable, asumiendo los riesgos de variaciones en costos.',
  PRECIOS_UNITARIOS: 'Se paga según las cantidades realmente ejecutadas multiplicadas por precios unitarios predeterminados.',
  TARIFAS: 'El pago se realiza según una tarifa por unidad de tiempo (hora, día, mes) de servicios prestados.',
  PORCENTAJE_MONTO: 'El pago corresponde a un porcentaje del valor de la obra ejecutada, común en supervisión.',
  LLAVE_EN_MANO: 'El contratista se encarga del diseño y construcción completa, entregando la obra funcionando.'
};

// Configuración para validación de número de contrato
export const CONFIG_NUMERO_CONTRATO: ConfiguracionNumeroContrato = {
  patron: /^N\.º\s+\d{1,3}-\d{4}-MDSM\/GM$/,
  formato: 'N.º XX-YYYY-MDSM/GM',
  ejemplo: 'N.º 01-2025-MDSM/GM',
  descripcion: 'Formato: N.º [número]-[año]-MDSM/GM'
};

// Configuración para formateo de moneda peruana
export const CONFIG_MONEDA: ConfiguracionMoneda = {
  simbolo: 'S/',
  decimales: 2,
  separador_miles: ',',
  separador_decimal: '.'
};

export default {};