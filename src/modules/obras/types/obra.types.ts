/**
 * Types para el módulo de Obras
 * Diseñado para aprovechar toda la información de MEF Invierte
 */

// ============================================================================
// DATOS MEF INVIERTE
// ============================================================================

export interface DatosMEF {
  cui: string;
  nombre: string;
  estado: string;
  etapa: string;
  fecha_registro: string;
  fuente: string;
  costos_finales: CostosFinales;
  articulacion_pmi?: ArticulacionPMI;
  institucionalidad?: Institucionalidad;
  expediente_tecnico?: ExpedienteTecnico;
  modificaciones_ejecucion?: ModificacionesEjecucion;
  responsabilidad_funcional?: ResponsabilidadFuncional;
}

export interface CostosFinales {
  costo_total_actualizado: number;
  costo_control_concurrente: number;
  costo_controversias: number;
  monto_carta_fianza: number;
  costo_obra?: number;
  costo_supervision?: number;
  fuentes_financiamiento?: Array<{
    fuente: string;
    monto: number;
  }>;
}

export interface ArticulacionPMI {
  servicio_publico: string;
  indicador_brecha: string;
  espacio_geografico: string;
  contribucion_brecha: number;
}

export interface Institucionalidad {
  uep?: UnidadEjecutora;
  uei?: UnidadInversion;
  uf?: UnidadFormuladora;
  opmi?: OficinaMultianual;
  unidad_formuladora?: string;
  unidad_ejecutora?: string;
  responsable_ue?: string;
  sector?: string;
}

export interface UnidadEjecutora {
  codigo: string | null;
  nombre?: string;
  responsable?: string | null;
}

export interface UnidadInversion {
  codigo: string | null;
  responsable: string | null;
}

export interface UnidadFormuladora {
  codigo: string | null;
  responsable: string | null;
}

export interface OficinaMultianual {
  codigo: string | null;
  responsable: string | null;
}

export interface ExpedienteTecnico {
  metas?: MetaFisica[];
  modalidad_ejecucion?: string;
  fechas_muro?: FechasComponente;
  fechas_ptar?: FechasComponente;
  fechas_expediente?: FechasExpediente;
  fechas_supervision?: FechasExpediente;
  fechas_liquidacion?: FechasExpediente;
  subtotal_metas?: number;
  costo_expediente_tecnico?: number;
  costo_supervision?: number;
  costo_liquidacion?: number;
  costo_inversion_actualizado?: number;
}

export interface MetaFisica {
  tipo: string;
  activo: string;
  unidad: string;
  cantidad: number;
  naturaleza?: string;
  factor_productivo?: string;
  componente?: string; // Alias de tipo para compatibilidad
  meta?: string; // Alias de activo para compatibilidad
  unidad_medida?: string; // Alias de unidad para compatibilidad
}

export interface FechasComponente {
  inicio: string;
  termino: string;
  entrega: string;
}

export interface FechasComponenteModificado {
  inicio: string;
  termino_vigente: string;
  entrega: string;
}

export interface FechasExpediente {
  inicio: string;
  termino: string;
}

export interface ModificacionesEjecucion {
  documentos?: DocumentoModificacion[];
  fechas_muro_modificado?: FechasComponenteModificado;
  fechas_ptar_modificado?: FechasComponenteModificado;
  fechas_supervision_modificado?: FechasExpedienteModificado;
  fechas_liquidacion_modificado?: FechasExpedienteModificado;
  subtotal_modificado?: number;
  costo_supervision_modificado?: number;
  costo_liquidacion_modificado?: number;
  costo_inversion_modificado?: number;
}

export interface DocumentoModificacion {
  tipo_documento: string;
  numero_documento: string;
  fecha_documento: string;
  monto_modificacion?: number;
  observaciones?: string;
}

export interface FechasExpedienteModificado {
  inicio: string;
  termino_vigente: string;
}

export interface ResponsabilidadFuncional {
  funcion: string | null;
  grupo_funcional: string | null;
  division_funcional: string | null;
  sector_responsable: string | null;
}

// ============================================================================
// DATOS CONTRACTUALES (Municipalidad)
// ============================================================================

export interface DatosContrato {
  numero_contrato: string;
  fecha_contrato: string;
  sistema_contratacion: SistemaContratacion;
  modalidad_ejecucion: ModalidadEjecucion;
  ley_aplicable?: LeyAplicable;
  procedimiento_seleccion?: string;
  entidad_ejecutora_id?: string;
  entidad_supervisora_id?: string;
  plazo_ejecucion_dias?: number;
  monto_contratado?: number;
  contratista_ruc?: string;
  contratista_nombre?: string;
}

export type SistemaContratacion =
  | 'suma_alzada'
  | 'precios_unitarios'
  | 'tarifas'
  | 'porcentaje'
  | 'llave_en_mano';

export type ModalidadEjecucion =
  | 'administracion_directa'
  | 'contrata'
  | 'encargo'
  | 'convenio';

export type LeyAplicable =
  | 'ley_30225' // Ley de Contrataciones del Estado (pre-2025)
  | 'ley_32069'; // Nueva Ley de Contrataciones (2025+)

// ============================================================================
// UBICACIÓN (San Marcos)
// ============================================================================

export interface Ubicacion {
  departamento: 'Áncash';
  provincia: 'Huari';
  distrito: 'San Marcos';
  lugar_ejecucion: string; // Zona Urbana, Centro Poblado o Caserío
  zona_tipo: ZonaTipo;
  tipo?: string; // Alias de zona_tipo para compatibilidad
  nombre_ubicacion?: string; // Alias de lugar_ejecucion para compatibilidad
  direccion_especifica?: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
}

export type ZonaTipo = 'urbana' | 'centro_poblado' | 'caserio';

// ============================================================================
// OBRA COMPLETA
// ============================================================================

export interface Obra {
  id: string;
  cui?: string;
  codigo_interno?: string;

  // Datos MEF (completos del scraping) - OPCIONAL para compatibilidad con modelo antiguo
  datos_mef?: DatosMEF;
  fecha_actualizacion_mef?: string;

  // Datos contractuales municipales - OPCIONAL para compatibilidad con modelo antiguo
  contrato?: DatosContrato;

  // Ubicación - OPCIONAL para compatibilidad con modelo antiguo
  ubicacion?: Ubicacion;

  // Estado y seguimiento
  estado_obra: EstadoObra;
  observaciones?: string;

  // Metadata
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;

  // Campos del modelo antiguo (para compatibilidad retroactiva)
  empresa_id?: string;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  monto_contractual?: string;
  fecha_inicio?: string;
  fecha_fin_programada?: string;
  fecha_fin_real?: string;
  estado?: string;
  tipo_obra?: string;
  modalidad_contrato?: string;
  cliente?: string;
  ubigeo?: string;
  modalidad_ejecucion?: string;
  sistema_contratacion?: string;
  monto_adicionales?: string;
  monto_total?: string;
  fecha_fin_contractual?: string;
  plazo_contractual?: number;
  plazo_total?: number;
  porcentaje_avance?: string;
  activo?: boolean;
  version?: number;
  contrato_numero?: string;
  contrato_fecha?: string;
  contrato_plazo_dias?: number;
  contrato_monto?: string;
  contratista_ruc?: string;
  contratista_nombre?: string;
  supervisor_ruc?: string;
  supervisor_nombre?: string;
  ubicacion_tipo?: string;
  ubicacion_nombre?: string;
  ubicacion_direccion?: string;
  ubicacion_latitud?: number;
  ubicacion_longitud?: number;
  empresa_nombre?: string;
}

export type EstadoObra =
  | 'registrada'
  | 'en_ejecucion'
  | 'paralizada'
  | 'terminada'
  | 'liquidada'
  | 'cancelada';

// ============================================================================
// FILTROS Y BÚSQUEDA
// ============================================================================

export interface FiltrosObra {
  busqueda?: string;
  estado_obra?: EstadoObra;
  estado_mef?: string;
  etapa_mef?: string;
  ley_aplicable?: LeyAplicable;
  zona_tipo?: ZonaTipo;
  rango_inversion?: {
    min?: number;
    max?: number;
  };
  fecha_contrato?: {
    desde?: string;
    hasta?: string;
  };
}

// ============================================================================
// FORMULARIOS
// ============================================================================

export interface ObraFormulario {
  // Tab 1: Datos MEF
  cui: string;
  importar_mef: boolean;
  datos_mef?: DatosMEF;

  // Tab 2: Datos Contractuales
  numero_contrato: string;
  codigo_interno?: string;
  fecha_contrato: string;
  sistema_contratacion: SistemaContratacion;
  modalidad_ejecucion: ModalidadEjecucion;
  procedimiento_seleccion?: string;
  entidad_ejecutora_id?: string;
  entidad_supervisora_id?: string;

  // Tab 3: Ubicación
  lugar_ejecucion: string;
  zona_tipo: ZonaTipo;

  // Tab 4: Observaciones
  observaciones?: string;
  estado_obra: EstadoObra;
}

// ============================================================================
// RESPUESTAS API
// ============================================================================

export interface ObrasResponse {
  status: string;
  data?: Obra[] | {
    obras: Obra[];
    total: number;
    limit?: number;
    offset?: number;
  };
  timestamp?: string;
  message?: string;
}

export interface ObraResponse {
  status: string;
  data?: Obra;
  message?: string;
  timestamp?: string;
}

export interface ConsultaMEFResponse {
  success: boolean;
  found: boolean;
  cui: string;
  data?: DatosMEF;
  obra_info?: {
    nombre: string;
    codigo: string;
  };
  cache_info?: {
    ultima_actualizacion?: string;
    fecha_scraping?: string;
    fuente: string;
    message: string;
  };
}
