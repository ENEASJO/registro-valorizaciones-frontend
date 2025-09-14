// =================================================================
// TIPOS TYPESCRIPT PARA MÓDULO DE VALORIZACIONES
// Sistema de Valorizaciones - Frontend
// Normativa: Ley N° 30225 (anterior) y Ley N° 32069 (desde 22/04/2025)
// =================================================================

import type { AuditoriaBase } from './obra.types';

// =================================================================
// TIPOS BASE Y ENUMS
// =================================================================

export type EstadoValorizacionEjecucion = 
  | 'BORRADOR'
  | 'PRESENTADA'
  | 'EN_REVISION'
  | 'OBSERVADA'
  | 'APROBADA'
  | 'PAGADA'
  | 'RECHAZADA';

export type EstadoValorizacionSupervision = 
  | 'BORRADOR'
  | 'PRESENTADA'
  | 'APROBADA'
  | 'PAGADA'
  | 'RECHAZADA';

export type EstadoPartida = 
  | 'PENDIENTE'
  | 'MEDIDO'
  | 'VERIFICADO'
  | 'APROBADO'
  | 'RECHAZADO';

export type TipoDocumentoValorizacion = 
  | 'METRADO'
  | 'PANEL_FOTOGRAFICO'
  | 'PLANO_REPLANTEO'
  | 'INFORME_CALIDAD'
  | 'CERTIFICADO_CALIDAD'
  | 'COMPROBANTE_PAGO'
  | 'OTROS';

export type MetodoMedicion = 
  | 'TOPOGRAFICO'
  | 'MANUAL'
  | 'ESTIMADO'
  | 'CALCULO'
  | 'OTROS';

// =================================================================
// INTERFACES PARA NORMATIVA
// =================================================================

export interface Normativa extends AuditoriaBase {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  fecha_vigencia_inicio: string;
  fecha_vigencia_fin?: string;
  
  // Parámetros de la normativa
  porcentaje_adelanto_directo_max: number;
  porcentaje_adelanto_materiales_max: number;
  porcentaje_retencion_garantia: number;
  dias_pago_valorización: number;
  
  activo: boolean;
}

// =================================================================
// INTERFACES PARA PARTIDAS
// =================================================================

export interface Partida extends AuditoriaBase {
  id: number;
  obra_id: number;
  
  // Identificación
  codigo_partida: string;
  numero_orden: number;
  descripcion: string;
  unidad_medida: string;
  
  // Montos contractuales
  metrado_contractual: number;
  precio_unitario: number;
  monto_contractual: number;
  
  // Clasificación
  categoria?: string;
  subcategoria?: string;
  item_padre_id?: number;
  nivel_jerarquia: number;
  
  // Especificaciones
  especificacion_tecnica?: string;
  rendimiento_diario?: number;
  
  activo: boolean;
}

export interface PartidaDetalle extends AuditoriaBase {
  id: number;
  valorizacion_id: number;
  partida_id: number;
  
  // Metrados
  metrado_anterior: number;
  metrado_actual: number;
  metrado_acumulado: number;
  
  // Porcentajes
  porcentaje_anterior: number;
  porcentaje_actual: number;
  porcentaje_acumulado: number;
  
  // Montos
  monto_anterior: number;
  monto_actual: number;
  monto_acumulado: number;
  
  // Control de calidad
  fecha_medicion?: string;
  responsable_medicion?: string;
  metodo_medicion?: MetodoMedicion;
  estado_medicion: EstadoPartida;
  
  // Observaciones
  observaciones_medicion?: string;
  observaciones_calidad?: string;
  
  activo: boolean;
}

// =================================================================
// INTERFACES PARA VALORIZACIONES DE EJECUCIÓN
// =================================================================

export interface ValorizacionEjecucion extends AuditoriaBase {
  id: number;
  obra_id: number;
  normativa_id: number;
  
  // Identificación
  numero_valorizacion: number;
  codigo_valorizacion: string;
  
  // Expediente
  numero_expediente?: string;
  numero_expediente_siaf?: string;
  
  // Periodo
  periodo_inicio: string;
  periodo_fin: string;
  dias_periodo: number;
  
  // Montos base
  monto_bruto: number;
  monto_neto: number;
  
  // Avances
  porcentaje_avance_fisico: number;
  monto_avance_economico: number;
  porcentaje_avance_fisico_anterior: number;
  monto_avance_economico_anterior: number;
  porcentaje_avance_fisico_total: number;
  monto_avance_economico_total: number;
  
  // Deducciones
  adelanto_directo_porcentaje: number;
  adelanto_directo_monto: number;
  adelanto_materiales_porcentaje: number;
  adelanto_materiales_monto: number;
  penalidades_monto: number;
  retencion_garantia_porcentaje: number;
  retencion_garantia_monto: number;
  otras_deducciones_monto: number;
  total_deducciones: number;
  
  // IGV
  igv_porcentaje: number;
  igv_monto: number;
  
  // Estados y fechas
  estado: EstadoValorizacionEjecucion;
  fecha_presentacion?: string;
  fecha_revision?: string;
  fecha_observacion?: string;
  fecha_aprobacion?: string;
  fecha_conformidad_servicio?: string;
  fecha_autorizacion_pago?: string;
  fecha_pago?: string;
  fecha_limite_pago?: string;
  
  // Días de proceso
  dias_revision?: number;
  dias_observacion?: number;
  dias_aprobacion?: number;
  dias_pago?: number;
  dias_atraso: number;
  
  // Personal responsable
  residente_obra?: string;
  supervisor_obra?: string;
  responsable_entidad?: string;
  
  // Observaciones
  observaciones_residente?: string;
  observaciones_supervisor?: string;
  observaciones_entidad?: string;
  motivo_rechazo?: string;
  
  // Referencias administrativas
  numero_comprobante_pago?: string;
  numero_siaf?: string;
  numero_seace?: string;
  
  activo: boolean;
}

// =================================================================
// INTERFACES PARA VALORIZACIONES DE SUPERVISIÓN
// =================================================================

export interface ValorizacionSupervision extends AuditoriaBase {
  id: number;
  obra_id: number;
  valorizacion_ejecucion_id: number;
  normativa_id: number;
  
  // Identificación
  numero_valorizacion: number;
  
  // Expediente
  numero_expediente?: string;
  numero_expediente_siaf?: string;
  
  periodo_inicio: string;
  periodo_fin: string;
  
  // Cálculo de días
  dias_calendario_periodo: number;
  dias_efectivos_trabajados: number;
  dias_no_trabajados: number;
  
  // Motivos de días no trabajados
  dias_lluvia: number;
  dias_feriados: number;
  dias_suspension_obra: number;
  dias_otros_motivos: number;
  
  // Montos
  tarifa_diaria_supervision: number;
  monto_bruto: number;
  retencion_garantia_porcentaje: number;
  retencion_garantia_monto: number;
  penalidades_monto: number;
  otras_deducciones_monto: number;
  total_deducciones: number;
  monto_neto: number;
  
  // IGV
  igv_porcentaje: number;
  igv_monto: number;
  
  // Estados y fechas
  estado: EstadoValorizacionSupervision;
  fecha_presentacion?: string;
  fecha_aprobacion?: string;
  fecha_pago?: string;
  
  // Días de proceso
  dias_atraso: number;
  
  // Personal y actividades
  supervisor_responsable: string;
  responsable_entidad?: string;
  actividades_realizadas?: string;
  observaciones_periodo?: string;
  motivos_dias_no_trabajados?: string;
  
  // Referencias administrativas
  numero_comprobante_pago?: string;
  numero_siaf?: string;
  
  activo: boolean;
}

// =================================================================
// INTERFACES PARA FORMULARIOS
// =================================================================

export interface ValorizacionEjecucionForm {
  obra_id: number;
  periodo_inicio: string;
  periodo_fin: string;
  
  // Expediente
  numero_expediente?: string;
  numero_expediente_siaf?: string;
  
  // Deducciones opcionales
  adelanto_directo_porcentaje?: number;
  adelanto_materiales_porcentaje?: number;
  penalidades_monto?: number;
  otras_deducciones_monto?: number;
  
  // Personal responsable
  residente_obra?: string;
  supervisor_obra?: string;
  
  // Observaciones
  observaciones_residente?: string;
  observaciones_supervisor?: string;
  
  // Partidas a valorizar
  partidas: PartidaDetalleForm[];
}

export interface PartidaDetalleForm {
  partida_id: number;
  metrado_actual: number;
  fecha_medicion?: string;
  responsable_medicion?: string;
  metodo_medicion?: MetodoMedicion;
  observaciones_medicion?: string;
}

export interface ValorizacionSupervisionForm {
  obra_id: number;
  periodo_inicio: string;
  periodo_fin: string;
  dias_efectivos_trabajados: number;
  
  // Expediente
  numero_expediente?: string;
  numero_expediente_siaf?: string;
  
  // Desglose de días no trabajados
  dias_lluvia?: number;
  dias_feriados?: number;
  dias_suspension_obra?: number;
  dias_otros_motivos?: number;
  
  // Deducciones opcionales
  penalidades_monto?: number;
  otras_deducciones_monto?: number;
  
  // Documentación
  supervisor_responsable: string;
  actividades_realizadas?: string;
  observaciones_periodo?: string;
  motivos_dias_no_trabajados?: string;
}

// =================================================================
// INTERFACES PARA VISTAS EXTENDIDAS
// =================================================================

export interface ValorizacionEjecucionDetalle extends ValorizacionEjecucion {
  // Información de la obra
  obra_nombre: string;
  obra_numero_contrato: string;
  obra_monto_ejecucion: number;
  ejecutora_nombre: string;
  ejecutora_ruc?: string;
  
  // Información de normativa
  normativa_nombre: string;
  normativa_codigo: string;
  
  // Estadísticas
  porcentaje_obra_ejecutada: number;
  porcentaje_monto_neto: number;
  total_partidas: number;
  partidas_aprobadas: number;
  
  // Partidas detalladas
  partidas?: PartidaValorizadaDetalle[];
}

export interface ValorizacionSupervisionDetalle extends ValorizacionSupervision {
  // Información de la obra
  obra_nombre: string;
  obra_numero_contrato: string;
  supervisora_nombre: string;
  supervisora_ruc?: string;
  
  // Relación con valorización de ejecución
  valorizacion_ejecucion_codigo: string;
  valorizacion_ejecucion_estado: string;
  
  // Cálculos de eficiencia
  porcentaje_dias_trabajados: number;
  porcentaje_dias_no_trabajados: number;
}

export interface PartidaValorizadaDetalle extends PartidaDetalle {
  // Datos de la partida
  codigo_partida: string;
  numero_orden: number;
  descripcion: string;
  unidad_medida: string;
  precio_unitario: number;
  metrado_contractual: number;
  monto_contractual: number;
  
  // Cálculos adicionales
  porcentaje_avance_real: number;
  metrado_pendiente: number;
  monto_pendiente: number;
}

// =================================================================
// INTERFACES PARA DOCUMENTOS
// =================================================================

export interface DocumentoValorizacion extends AuditoriaBase {
  id: number;
  tabla_origen: 'val_ejecucion' | 'val_supervision';
  registro_id: number;
  
  tipo_documento: TipoDocumentoValorizacion;
  nombre_archivo: string;
  ruta_archivo: string;
  tamaño_archivo?: number;
  tipo_mime?: string;
  hash_archivo?: string;
  
  numero_documento?: string;
  fecha_documento?: string;
  descripcion?: string;
  
  estado: 'ACTIVO' | 'REEMPLAZADO' | 'ELIMINADO';
  version_documento: number;
  documento_padre_id?: number;
  
  activo: boolean;
}

// =================================================================
// INTERFACES PARA HISTORIAL Y AUDITORÍA
// =================================================================

export interface EstadoHistorial extends AuditoriaBase {
  id: number;
  tabla_origen: 'val_ejecucion' | 'val_supervision';
  registro_id: number;
  
  estado_anterior?: string;
  estado_nuevo: string;
  fecha_cambio: string;
  
  motivo_cambio?: string;
  usuario_responsable?: string;
}

// =================================================================
// INTERFACES PARA REPORTES Y ESTADÍSTICAS
// =================================================================

export interface ResumenValorizacionesObra {
  obra_id: number;
  obra_nombre: string;
  numero_contrato: string;
  monto_ejecucion: number;
  monto_supervision: number;
  
  // Estadísticas de ejecución
  total_valorizaciones_ejecucion: number;
  valorizaciones_aprobadas: number;
  valorizaciones_pagadas: number;
  valorizaciones_pendientes: number;
  
  monto_bruto_total: number;
  monto_neto_total: number;
  total_deducciones: number;
  
  avance_fisico_total: number;
  avance_economico_total: number;
  porcentaje_avance_obra: number;
  saldo_por_ejecutar: number;
  
  // Estadísticas de supervisión
  total_valorizaciones_supervision: number;
  monto_supervision_total: number;
  total_dias_supervision: number;
  
  // Fechas importantes
  primera_valorización_presentada?: string;
  ultima_valorización_pagada?: string;
}

export interface EstadisticasValorizaciones {
  // Resumen general
  total_valorizaciones_ejecucion: number;
  total_valorizaciones_supervision: number;
  monto_total_valorizado: number;
  monto_total_pagado: number;
  
  // Por estado
  valorizaciones_por_estado: Record<string, number>;
  
  // Distribución temporal
  valorizaciones_por_mes: Array<{
    mes: string;
    cantidad: number;
    monto: number;
  }>;
  
  // Top obras con más valorizaciones
  top_obras_valorizadas: Array<{
    obra_id: number;
    obra_nombre: string;
    total_valorizaciones: number;
    monto_total: number;
    avance_fisico: number;
  }>;
  
  // Indicadores de gestión
  promedio_dias_aprobacion: number;
  promedio_dias_pago: number;
  valorizaciones_con_atraso: number;
}

// =================================================================
// INTERFACES PARA FILTROS Y BÚSQUEDAS
// =================================================================

export interface FiltrosValorizacion {
  search?: string;
  obra_id?: number;
  estado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  monto_desde?: number;
  monto_hasta?: number;
  ejecutora_id?: number;
  supervisora_id?: number;
  solo_con_atraso?: boolean;
}

export interface FiltrosPartidas {
  search?: string;
  categoria?: string;
  subcategoria?: string;
  estado_medicion?: EstadoPartida;
  con_metrado_pendiente?: boolean;
}

// =================================================================
// INTERFACES PARA CÁLCULOS Y VALIDACIONES
// =================================================================

export interface CalculosValorizacion {
  monto_bruto: number;
  total_deducciones: number;
  monto_neto: number;
  igv_monto: number;
  monto_total_con_igv: number;
  porcentaje_avance_fisico: number;
  porcentaje_avance_economico: number;
  errores_calculo: string[];
  advertencias: string[];
}

export interface ValidacionValorizacion {
  valida: boolean;
  errores: Array<{
    campo: string;
    mensaje: string;
    tipo: 'error' | 'warning';
  }>;
  puede_presentar: boolean;
  puede_aprobar: boolean;
}

export interface LimitesNormativa {
  adelanto_directo_max: number;
  adelanto_materiales_max: number;
  retencion_garantia: number;
  dias_pago_max: number;
  tolerancia_metrado: number;
}

// =================================================================
// CONSTANTES Y MAPEOS
// =================================================================

export const ESTADOS_VALORIZACION_EJECUCION: Record<EstadoValorizacionEjecucion, string> = {
  BORRADOR: 'Borrador',
  PRESENTADA: 'Presentada',
  EN_REVISION: 'En Revisión',
  OBSERVADA: 'Observada',
  APROBADA: 'Aprobada',
  PAGADA: 'Pagada',
  RECHAZADA: 'Rechazada'
};

export const ESTADOS_VALORIZACION_SUPERVISION: Record<EstadoValorizacionSupervision, string> = {
  BORRADOR: 'Borrador',
  PRESENTADA: 'Presentada',
  APROBADA: 'Aprobada',
  PAGADA: 'Pagada',
  RECHAZADA: 'Rechazada'
};

export const ESTADOS_PARTIDA: Record<EstadoPartida, string> = {
  PENDIENTE: 'Pendiente',
  MEDIDO: 'Medido',
  VERIFICADO: 'Verificado',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado'
};

export const TIPOS_DOCUMENTO_VALORIZACION: Record<TipoDocumentoValorizacion, string> = {
  METRADO: 'Metrado',
  PANEL_FOTOGRAFICO: 'Panel Fotográfico',
  PLANO_REPLANTEO: 'Plano de Replanteo',
  INFORME_CALIDAD: 'Informe de Calidad',
  CERTIFICADO_CALIDAD: 'Certificado de Calidad',
  COMPROBANTE_PAGO: 'Comprobante de Pago',
  OTROS: 'Otros'
};

export const METODOS_MEDICION: Record<MetodoMedicion, string> = {
  TOPOGRAFICO: 'Topográfico',
  MANUAL: 'Manual',
  ESTIMADO: 'Estimado',
  CALCULO: 'Cálculo',
  OTROS: 'Otros'
};

// Configuración para formateo de moneda peruana
export const CONFIG_MONEDA_PERUANA = {
  simbolo: 'S/',
  decimales: 2,
  separador_miles: ',',
  separador_decimal: '.'
};

export default {};