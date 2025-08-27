// =================================================================
// TIPOS SUPABASE - INTERFACES SIMPLIFICADAS PARA BASE DE DATOS
// Sistema de Valorizaciones - Frontend con Supabase
// =================================================================

import type { Database } from '../lib/supabase'

// Tipos de tabla directos de Supabase
type Tables = Database['public']['Tables']

// Tipos principales de las tablas
export type EmpresaDB = Tables['empresas']['Row']
export type EmpresaInsert = Tables['empresas']['Insert']
export type EmpresaUpdate = Tables['empresas']['Update']

export type ObraDB = Tables['obras']['Row']
export type ObraInsert = Tables['obras']['Insert']
export type ObraUpdate = Tables['obras']['Update']

export type ValorizacionDB = Tables['valorizaciones']['Row']
export type ValorizacionInsert = Tables['valorizaciones']['Insert']
export type ValorizacionUpdate = Tables['valorizaciones']['Update']

// Enums de la base de datos
export type TipoEmpresaDB = 'ejecutora' | 'supervisora' | 'consultora'
export type EstadoGeneralDB = 'activo' | 'inactivo'
export type EstadoObraDB = 'planificada' | 'en_ejecucion' | 'suspendida' | 'terminada'
export type TipoValorizacionDB = 'ejecucion' | 'supervision'
export type EstadoValorizacionDB = 'borrador' | 'presentada' | 'aprobada' | 'rechazada'

// Tipos extendidos con relaciones
export type EmpresaConRelaciones = EmpresaDB & {
  obras_ejecutadas?: ObraDB[]
  obras_supervisadas?: ObraDB[]
}

export type ObraConRelaciones = ObraDB & {
  empresa_ejecutora: EmpresaDB
  empresa_supervisora?: EmpresaDB
  valorizaciones?: ValorizacionDB[]
}

export type ValorizacionConRelaciones = ValorizacionDB & {
  obra: ObraConRelaciones
}

// Tipos para formularios simplificados
export interface FormularioEmpresaSupabase {
  ruc: string
  razon_social: string
  tipo_empresa: TipoEmpresaDB
  estado?: EstadoGeneralDB
  direccion?: string
  telefono?: string
  email?: string
  representante_legal?: string
  fecha_constitucion?: string
  capital_social?: number
}

export interface FormularioObraSupabase {
  nombre: string
  codigo: string
  descripcion?: string
  monto_contrato: number
  fecha_inicio: string
  fecha_fin?: string
  estado?: EstadoObraDB
  empresa_ejecutora_id: string
  empresa_supervisora_id?: string
  ubicacion?: string
  tipo_obra?: string
}

export interface FormularioValorizacionSupabase {
  obra_id: string
  numero: number
  periodo: string
  tipo: TipoValorizacionDB
  monto_ejecutado: number
  monto_acumulado: number
  porcentaje_avance: number
  estado?: EstadoValorizacionDB
  fecha_presentacion?: string
  fecha_aprobacion?: string
  observaciones?: string
}

// Tipos para respuestas de API
export interface RespuestaSupabase<T = any> {
  data: T | null
  error: Error | null
  success: boolean
}

export interface RespuestaPaginadaSupabase<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  error: Error | null
  success: boolean
}

// Tipos para filtros de búsqueda
export interface FiltrosEmpresaSupabase {
  search?: string
  tipo_empresa?: TipoEmpresaDB
  estado?: EstadoGeneralDB
}

export interface FiltrosObraSupabase {
  search?: string
  estado?: EstadoObraDB
  empresa_ejecutora_id?: string
  empresa_supervisora_id?: string
}

export interface FiltrosValorizacionSupabase {
  obra_id?: string
  tipo?: TipoValorizacionDB
  estado?: EstadoValorizacionDB
  periodo?: string
}

// Tipos para dashboard y estadísticas
export interface EstadisticasDashboard {
  total_empresas: number
  total_obras: number
  total_valorizaciones: number
  empresas_activas: number
  obras_en_ejecucion: number
  valorizaciones_pendientes: number
  monto_total_contratos: number
  monto_total_ejecutado: number
}

export interface MetricasObra {
  avance_porcentaje: number
  monto_ejecutado: number
  monto_pendiente: number
  dias_transcurridos: number
  dias_restantes: number
  estado_cronograma: 'atrasada' | 'a_tiempo' | 'adelantada'
}

// Tipos para consulta RUC con integración externa
export interface ConsultaRucExterna {
  ruc: string
  razon_social: string
  direccion?: string
  estado_sunat?: string
  fecha_inscripcion?: string
  actividad_economica?: string
  tipo_contribuyente?: string
}

export interface ResultadoConsultaRuc {
  success: boolean
  data?: ConsultaRucExterna
  source: 'database' | 'external'
  error?: string
}

// Utilidades para manejo de errores
export interface ErrorSupabase {
  message: string
  details?: string
  hint?: string
  code?: string
}

export interface ValidacionCampo {
  campo: string
  mensaje: string
  tipo: 'requerido' | 'formato' | 'longitud' | 'valor_invalido'
}

export interface ResultadoValidacion {
  valido: boolean
  errores: ValidacionCampo[]
}

export default {}