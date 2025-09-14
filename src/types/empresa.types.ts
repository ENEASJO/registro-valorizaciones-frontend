// =================================================================
// TIPOS TYPESCRIPT PARA MÓDULO DE EMPRESAS
// Sistema de Valorizaciones - Frontend
// =================================================================

// Tipos base para auditoría
export interface AuditoriaBase {
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  version?: number;
}

// Tipos de estado comunes
export type EstadoGeneral = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
export type EstadoContrato = 'VIGENTE' | 'RESUELTO' | 'TERMINADO' | 'SUSPENDIDO';
export type EstadoParticipacion = 'ACTIVO' | 'RETIRADO' | 'SUSPENDIDO';
export type TipoEntidad = 'EMPRESA' | 'CONSORCIO';
export type RolContratista = 'EJECUTOR' | 'SUPERVISOR';

// Especialidades de empresas constructoras
export type EspecialidadEmpresa = 
  | 'EDIFICACIONES'
  | 'CARRETERAS'
  | 'SANEAMIENTO'
  | 'ELECTRICIDAD'
  | 'TELECOMUNICACIONES'
  | 'PUENTES'
  | 'TUNELES'
  | 'AEROPUERTOS'
  | 'PUERTOS'
  | 'FERROCARRILES'
  | 'IRRIGACION'
  | 'HIDROENERGETICA'
  | 'PETROQUIMICA'
  | 'MINERIA'
  | 'GASEODUCTOS_OLEODUCTOS';

// Categorías de contratista según capacidad (tradicionales) - OSCE
export type CategoriaContratistaCapacidad = 'A' | 'B' | 'C' | 'D' | 'E';

// Categorías de contratista según función (como las envía el backend)
export type CategoriaContratista = 'EJECUTORA' | 'SUPERVISORA';

// Tipos de empresa según forma jurídica
export type TipoEmpresa = 
  | 'SAC'    // Sociedad Anónima Cerrada
  | 'SA'     // Sociedad Anónima
  | 'SRL'    // Sociedad de Responsabilidad Limitada
  | 'EIRL'   // Empresa Individual de Responsabilidad Limitada
  | 'SCS'    // Sociedad Colectiva
  | 'SCR'    // Sociedad Comercial de Responsabilidad Limitada
  | 'OTROS';

// =================================================================
// INTERFACES PRINCIPALES
// =================================================================

/**
 * Empresa individual registrada en el sistema
 */
export interface Empresa extends AuditoriaBase {
  id: string;
  codigo: string;
  ruc: string;
  razon_social: string;
  nombre_comercial?: string;
  
  // Datos de contacto
  email?: string;
  telefono?: string;
  celular?: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  ubigeo?: string;
  
  // Datos legales y financieros
  representante_legal?: string;
  dni_representante?: string;
  capital_social?: number;
  fecha_constitucion?: string;
  
  // Estados y clasificación
  estado: EstadoGeneral;
  tipo_empresa: TipoEmpresa;
  categoria_contratista?: CategoriaContratista; // Función del contratista (EJECUTORA/SUPERVISORA)
  categoria_contratista_capacidad?: CategoriaContratistaCapacidad; // Capacidad OSCE (A, B, C, D, E)
  
  // Especialidades
  especialidades?: EspecialidadEmpresa[];
  
  // Documentos y certificaciones
  numero_registro_nacional?: string;
  vigencia_registro_desde?: string;
  vigencia_registro_hasta?: string;
  
  // Metadatos
  observaciones?: string;
  activo: boolean;
}

// =================================================================
// INTERFACES PARA DATOS CONSOLIDADOS (SUNAT + OECE)
// =================================================================

/**
 * Miembro/Representante consolidado de múltiples fuentes
 */
export interface MiembroConsolidado {
  nombre: string;
  cargo?: string;
  tipo_documento?: 'DNI' | 'CE' | 'PASSPORT';
  numero_documento?: string;
  participacion?: string;
  fecha_desde?: string;
  fuente: 'SUNAT' | 'OECE' | 'AMBOS' | 'MANUAL';
  activo?: boolean;
}

/**
 * Información de contacto consolidada
 */
export interface ContactoConsolidado {
  telefono?: string;
  email?: string;
  direccion?: string;
  domicilio_fiscal?: string;
  ciudad?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
}

/**
 * Estado de registro en diferentes sistemas
 */
export interface RegistroConsolidado {
  estado_sunat?: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | 'BAJA DEFINITIVA';
  estado_oece?: string; // Estados específicos de OECE como "BIENES\nSERVICIOS\nEJECUTOR DE OBRAS"
  capacidad_contratacion?: string;
  vigencia?: string;
}

/**
 * Especialidad con información extendida de OECE
 */
export interface EspecialidadConsolidada {
  codigo?: string;
  nombre: string;
  categoria?: string; // CATEGORIA A, B, C, etc.
  fuente: 'OECE' | 'LOCAL';
  activa?: boolean;
}

/**
 * Datos consolidados completos de una empresa
 */
export interface EmpresaConsolidada {
  ruc: string;
  razon_social: string;
  tipo_persona?: 'NATURAL' | 'JURIDICA';
  contacto: ContactoConsolidado;
  estado_registro?: string; // Estado específico de OECE
  especialidades: string[]; // Lista simple de especialidades
  especialidades_detalle?: EspecialidadConsolidada[]; // Información detallada
  miembros: MiembroConsolidado[];
  total_miembros: number;
  total_especialidades?: number;
  fuentes_consultadas: string[];
  fuentes_con_errores?: string[];
  consolidacion_exitosa: boolean;
  timestamp?: string;
  observaciones?: string[];
  registro?: RegistroConsolidado;
}

/**
 * Formulario para crear/editar empresa (ACTUALIZADO)
 */
export interface EmpresaForm {
  codigo?: string;
  ruc: string;
  razon_social: string;
  nombre_comercial?: string;
  
  // Información de contacto
  email?: string;
  telefono?: string;
  celular?: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  ubigeo?: string;
  domicilio_fiscal?: string; // Nueva propiedad para domicilio fiscal separado
  
  // Representantes legales (ACTUALIZADO para soportar múltiples)
  representante_legal?: string; // Mantener por compatibilidad
  dni_representante?: string; // Mantener por compatibilidad
  representantes?: RepresentanteFormulario[]; // Nueva: múltiples representantes
  
  // Datos corporativos
  capital_social?: number;
  fecha_constitucion?: string;
  
  // Estados y clasificación
  estado: EstadoGeneral;
  tipo_empresa: TipoEmpresa;
  categoria_contratista?: CategoriaContratista; // Función del contratista (EJECUTORA/SUPERVISORA)
  categoria_contratista_capacidad?: CategoriaContratistaCapacidad; // Capacidad OSCE (A, B, C, D, E)
  
  // Especialidades (actualizado para soportar datos de OECE)
  especialidades?: EspecialidadEmpresa[];
  especialidades_oece?: string[]; // Nueva: especialidades específicas de OECE
  categoria_oece?: string; // Nueva: categoría específica de OECE (A, B, C)
  
  // Registro y certificaciones
  numero_registro_nacional?: string;
  vigencia_registro_desde?: string;
  vigencia_registro_hasta?: string;
  estado_sunat?: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  estado_oece?: string;
  
  // Capacidades (nuevas propiedades)
  capacidad_contratacion?: string;
  experiencia_anos?: number;
  
  // Metadatos de consolidación
  fuentes_datos?: string[]; // Nueva: fuentes de donde vienen los datos
  fecha_consolidacion?: string; // Nueva: cuándo se consolidaron los datos
  advertencias_consolidacion?: string[]; // Nueva: advertencias del proceso
  
  // Observaciones y notas
  observaciones?: string;
}

/**
 * Representante con estructura unificada para el formulario
 */
export interface RepresentanteFormulario {
  nombre: string;
  cargo?: string;
  numero_documento?: string;
  tipo_documento?: 'DNI' | 'CE' | 'PASSPORT';
  es_principal?: boolean; // Marca cuál es el representante legal principal
  fuente?: 'SUNAT' | 'OECE' | 'MANUAL' | 'AMBOS';
  activo?: boolean;
}

/**
 * Formulario extendido con información de consolidación (REDISEÑADO)
 */
export interface EmpresaFormConsolidado extends EmpresaForm {
  // === ESTRUCTURA REDISEÑADA PARA MÚLTIPLES REPRESENTANTES ===
  
  // Representantes múltiples (reemplaza representante_legal + dni_representante)
  representantes: RepresentanteFormulario[];
  representante_principal_index?: number; // Índice del representante principal
  
  // === INFORMACIÓN OECE CONSOLIDADA ===
  
  // Estado de registro OECE (texto multilinea)
  estado_oece_registro?: string; // "BIENES\nSERVICIOS\nEJECUTOR DE OBRAS"
  especialidades_oece: string[]; // ["CATEGORIA A"]
  
  // === DATOS DE CONTACTO CONSOLIDADOS ===
  
  // Unificación de campos de contacto (celular maps to contacto.telefono)
  email: string; // from contacto.email
  celular: string; // from contacto.telefono 
  direccion: string; // from contacto.direccion
  
  // === ESTADO DE CONSOLIDACIÓN ===
  
  // Datos originales de la consolidación
  datos_consolidados?: EmpresaConsolidada;
  
  // Estado de la consolidación
  consolidacion_exitosa: boolean;
  fuentes_utilizadas: string[];
  
  // === CLASIFICACIÓN LOCAL VS OECE ===
  
  // Clasificación local (editable)
  estado: EstadoGeneral; // ACTIVO, INACTIVO, SUSPENDIDO
  tipo_empresa: TipoEmpresa; // SAC, SA, SRL, etc.
  categoria_contratista: CategoriaContratista; // EJECUTORA/SUPERVISORA
  especialidades_locales: EspecialidadEmpresa[]; // Especialidades mapeadas localmente
  
  // === MAPEO Y OBSERVACIONES ===
  
  // Especialidades mapeadas
  mapeo_especialidades?: {
    oece_originales: string[];
    mapeadas_formulario: EspecialidadEmpresa[];
    no_mapeadas: string[];
  };
  
  // Observaciones del proceso de consolidación
  observaciones_consolidacion?: string[];
}

/**
 * Consorcio de empresas
 */
export interface Consorcio extends AuditoriaBase {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  
  // Datos legales del consorcio
  fecha_constitucion: string;
  fecha_disolucion?: string;
  
  // Representación
  empresa_lider_id: string;
  representante_consorcio?: string;
  
  // Estados
  estado: EstadoGeneral;
  
  // Especialidades heredadas/combinadas
  especialidades?: EspecialidadEmpresa[];
  
  // Metadatos
  observaciones?: string;
  activo: boolean;
}

/**
 * Formulario para crear/editar consorcio
 */
export interface ConsorcioForm {
  codigo?: string;
  nombre: string;
  descripcion?: string;
  fecha_constitucion: string;
  empresa_lider_id: string;
  representante_consorcio?: string;
  estado: EstadoGeneral;
  especialidades?: EspecialidadEmpresa[];
  observaciones?: string;
}

/**
 * Participación de una empresa en un consorcio
 */
export interface ConsorcioEmpresa extends AuditoriaBase {
  id: string;
  consorcio_id: string;
  empresa_id: string;
  
  // Participación
  porcentaje_participacion: number;
  es_lider: boolean;
  
  // Responsabilidades específicas
  responsabilidades?: string[];
  
  // Vigencia de la participación
  fecha_ingreso: string;
  fecha_salida?: string;
  
  // Estados
  estado: EstadoParticipacion;
  
  // Metadatos
  observaciones?: string;
  activo: boolean;
}

/**
 * Entidad contratista unificada (empresa o consorcio)
 */
export interface EntidadContratista extends AuditoriaBase {
  id: string;
  tipo_entidad: TipoEntidad;

  // Referencias polimórficas
  empresa_id?: string;
  consorcio_id?: string;
  
  // Datos denormalizados para consultas rápidas
  nombre_completo: string;
  ruc_principal?: string;
  
  // Capacidad operativa
  capacidad_contratacion_anual?: number;
  experiencia_anos?: number;
  
  // Estados
  estado: EstadoGeneral;
  activo: boolean;
}

/**
 * Asignación de contratista a obra con rol específico
 */
export interface ObraContratista extends AuditoriaBase {
  id: number;
  obra_id: number;
  entidad_contratista_id: string;
  
  // Rol en la obra
  rol: RolContratista;
  
  // Datos del contrato
  numero_contrato?: string;
  fecha_contrato?: string;
  monto_contratado?: number;
  plazo_dias?: number;
  fecha_inicio_prevista?: string;
  fecha_fin_prevista?: string;
  
  // Estados del contrato
  estado_contrato: EstadoContrato;
  
  // Vigencia
  fecha_inicio: string;
  fecha_fin?: string;
  
  // Metadatos
  observaciones?: string;
  activo: boolean;
}

/**
 * Documento adjunto de empresa o consorcio
 */
export interface EmpresaDocumento extends AuditoriaBase {
  id: string;
  entidad_contratista_id: string;
  
  // Datos del documento
  tipo_documento: TipoDocumento;
  nombre_archivo: string;
  ruta_archivo: string;
  tamaño_archivo?: number;
  tipo_mime?: string;
  
  // Vigencia del documento
  fecha_emision?: string;
  fecha_vencimiento?: string;
  
  // Estados
  estado: EstadoDocumento;
  
  // Metadatos
  descripcion?: string;
  activo: boolean;
}

export type TipoDocumento = 
  | 'RUC'
  | 'RNP'
  | 'CONSTITUCION'
  | 'PODER'
  | 'VIGENCIA_PODER'
  | 'CAPACIDAD_LIBRE_CONTRATACION'
  | 'EXPERIENCIA'
  | 'CERTIFICADO_HABILIDAD'
  | 'OTROS';

export type EstadoDocumento = 'VIGENTE' | 'VENCIDO' | 'REEMPLAZADO';

/**
 * Registro de auditoría para cambios
 */
export interface EmpresaAuditoria {
  id: string;
  tabla_origen: string;
  registro_id: string;
  operacion: 'INSERT' | 'UPDATE' | 'DELETE';
  
  // Datos del cambio
  datos_anteriores?: Record<string, any>;
  datos_nuevos?: Record<string, any>;
  campos_modificados?: string[];
  
  // Metadatos del cambio
  razon_cambio?: string;
  ip_origen?: string;
  user_agent?: string;
  
  // Auditoría
  created_at: string;
  created_by: number;
}

// =================================================================
// INTERFACES PARA VISTAS Y CONSULTAS COMPLEJAS
// =================================================================

/**
 * Vista detallada de entidad contratista con información extendida
 */
export interface EntidadContratistaDetalle extends EntidadContratista {
  // Datos específicos según el tipo
  datos_empresa?: {
    ruc: string;
    razon_social: string;
    nombre_comercial?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    representante_legal?: string;
    dni_representante?: string;
    tipo_empresa?: TipoEmpresa;
    categoria_contratista?: CategoriaContratista; // Función (EJECUTORA/SUPERVISORA)
    categoria_contratista_capacidad?: CategoriaContratistaCapacidad; // Capacidad OSCE (A,B,C,D,E)
    especialidades?: EspecialidadEmpresa[];
  };
  
  datos_consorcio?: {
    nombre: string;
    descripcion?: string;
    fecha_constitucion: string;
    empresa_lider_id: string;
    empresa_lider_nombre: string;
    especialidades?: EspecialidadEmpresa[];
  };
  
  // Información de participación (solo para consorcios)
  empresas_participantes?: Array<{
    empresa_id: string;
    empresa_nombre: string;
    empresa_ruc: string;
    porcentaje_participacion: number;
    es_lider: boolean;
    responsabilidades?: string[];
  }>;
}

/**
 * Vista de empresa con información de consorcios
 */
export interface EmpresaConConsorcio extends Empresa {
  // Consorcios en los que participa
  consorcios_participacion: Array<{
    consorcio_id: string;
    consorcio_nombre: string;
    consorcio_codigo: string;
    porcentaje_participacion: number;
    es_lider: boolean;
    estado_participacion: EstadoParticipacion;
    fecha_ingreso: string;
    responsabilidades?: string[];
  }>;
  
  // Estadísticas
  total_consorcios_activos: number;
  total_consorcios_liderados: number;
}

/**
 * Detalle completo de consorcio con empresas
 */
export interface ConsorcioCompleto extends Consorcio {
  empresa_lider: Empresa;
  empresas_participantes: Array<{
    empresa: Empresa;
    participacion: ConsorcioEmpresa;
  }>;
  
  // Estadísticas
  total_empresas: number;
  suma_porcentajes: number;
  estado_porcentajes: 'CORRECTO' | 'FALTA_PORCENTAJE' | 'EXCEDE_PORCENTAJE';
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
 * Filtros para búsqueda de empresas
 */
export interface FiltrosEmpresa {
  search?: string;
  estado?: EstadoGeneral;
  categoria_contratista?: CategoriaContratista; // Función (EJECUTORA/SUPERVISORA)
  categoria_contratista_capacidad?: CategoriaContratistaCapacidad; // Capacidad OSCE (A,B,C,D,E)
  tipo_empresa?: TipoEmpresa;
  especialidades?: EspecialidadEmpresa[];
  departamento?: string;
  provincia?: string;
  distrito?: string;
  fecha_constitucion_desde?: string;
  fecha_constitucion_hasta?: string;
}

/**
 * Filtros para búsqueda de entidades contratistas
 */
export interface FiltrosEntidadContratista {
  search?: string;
  tipo_entidad?: TipoEntidad;
  estado?: EstadoGeneral;
  categoria?: CategoriaContratistaCapacidad; // Capacidad OSCE (A,B,C,D,E)
  categoria_contratista?: CategoriaContratista; // Función (EJECUTORA/SUPERVISORA)
  especialidades?: EspecialidadEmpresa[];
  disponible_para_obra?: number; // ID de obra para excluir ya asignados
}

/**
 * Parámetros para crear consorcio
 */
export interface CrearConsorcioParams {
  consorcio: ConsorcioForm;
  empresas_participacion: Array<{
    empresa_id: string;
    porcentaje: number;
    responsabilidades?: string[];
  }>;
}

/**
 * Estadísticas del dashboard
 */
export interface EstadisticasEmpresas {
  empresas_activas: number;
  consorcios_activos: number;
  entidades_totales: number;
  contratos_vigentes: number;
  empresas_por_categoria: Record<CategoriaContratistaCapacidad, number>;
  consorcios_por_mes: Array<{
    mes: string;
    total: number;
  }>;
  top_empresas_por_contratos: Array<{
    entidad: EntidadContratista;
    total_contratos: number;
    monto_total: number;
  }>;
}

// =================================================================
// TIPOS PARA VALIDACIÓN EXTENDIDA
// =================================================================

/**
 * Errores de validación con soporte para secciones
 */
export interface ErrorValidacion {
  campo: string;
  mensaje: string;
  seccion?: 'basica' | 'contacto' | 'representantes' | 'registro' | 'especialidades';
  codigo?: string;
  tipo?: 'requerido' | 'formato' | 'longitud' | 'valor_invalido' | 'conflicto_datos';
  fuente_conflicto?: string; // Cuando hay conflictos entre SUNAT y OECE
}

/**
 * Resultado de validación con detalles por sección
 */
export interface ResultadoValidacion {
  valido: boolean;
  errores: ErrorValidacion[];
  errores_por_seccion?: {
    basica: ErrorValidacion[];
    contacto: ErrorValidacion[];
    representantes: ErrorValidacion[];
    registro: ErrorValidacion[];
    especialidades: ErrorValidacion[];
  };
  advertencias?: string[]; // Advertencias no bloqueantes
}

/**
 * Configuración de validación para el formulario
 */
export interface ConfiguracionValidacion {
  campos_requeridos: {
    basica: string[];
    contacto: string[];
    representantes: string[];
    registro: string[];
    especialidades: string[];
  };
  validaciones_especiales: {
    ruc: boolean;
    email: boolean;
    telefono: boolean;
    dni: boolean;
  };
  permitir_datos_parciales: boolean;
}

// =================================================================
// TIPOS PARA FORMULARIOS Y UI EXTENDIDA
// =================================================================

/**
 * Estados extendidos para cada sección del formulario
 */
export interface EstadoSeccionFormulario {
  completado: boolean;
  con_errores: boolean;
  con_advertencias: boolean;
  datos_consolidados: boolean; // Si los datos provienen de consolidación
  fuente_datos?: string; // SUNAT, OECE, MANUAL
}

/**
 * Estado completo del formulario por secciones
 */
export interface EstadoFormularioCompleto {
  general: EstadoFormulario;
  secciones: {
    basica: EstadoSeccionFormulario;
    contacto: EstadoSeccionFormulario;
    representantes: EstadoSeccionFormulario;
    registro: EstadoSeccionFormulario;
    especialidades: EstadoSeccionFormulario;
  };
  consolidacion: {
    estado: 'no_consultado' | 'consultando' | 'exitoso' | 'error' | 'parcial';
    fuentes_utilizadas: string[];
    ultima_actualizacion?: string;
  };
}

/**
 * Configuración para componentes de sección
 */
export interface ConfiguracionSeccion {
  titulo: string;
  descripcion?: string;
  icono?: string;
  colapsable: boolean;
  expandido_por_defecto: boolean;
  requerida: boolean;
  orden: number;
}

/**
 * Configuración completa del formulario
 */
export interface ConfiguracionFormularioEmpresa {
  mostrar_obtener_datos: boolean;
  permitir_edicion_manual: boolean;
  validacion_tiempo_real: boolean;
  guardar_automatico: boolean;
  secciones: {
    basica: ConfiguracionSeccion;
    contacto: ConfiguracionSeccion;
    representantes: ConfiguracionSeccion;
    registro: ConfiguracionSeccion;
    especialidades: ConfiguracionSeccion;
  };
}

/**
 * Opciones para select de especialidades
 */
export interface OpcionEspecialidad {
  value: EspecialidadEmpresa;
  label: string;
  categoria?: string;
}

/**
 * Opciones para select de empresas
 */
export interface OpcionEmpresa {
  value: number;
  label: string;
  ruc: string;
  categoria?: CategoriaContratistaCapacidad; // Capacidad OSCE
  categoria_contratista?: CategoriaContratista; // Función
  especialidades?: EspecialidadEmpresa[];
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

export default {};