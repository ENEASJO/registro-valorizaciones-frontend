// =================================================================
// TIPOS TYPESCRIPT PARA MÓDULO DE REPORTES PROFESIONAL
// Sistema de Valorizaciones - Frontend
// =================================================================

import type { AuditoriaBase } from './obra.types';

// =================================================================
// TIPOS BASE Y ENUMS
// =================================================================

export type TipoReporte = 
  | 'VALORIZACION_MENSUAL'
  | 'AVANCE_OBRA'
  | 'FINANCIERO_CONSOLIDADO'
  | 'CONTROL_CONTRACTUAL'
  | 'GERENCIAL_EJECUTIVO';

export type EstadoReporte = 
  | 'GENERANDO'
  | 'COMPLETADO'
  | 'ERROR'
  | 'CANCELADO';

export type FormatoExportacion = 
  | 'PDF'
  | 'EXCEL'
  | 'WORD'
  | 'CSV';

export type PeriodoReporte = 
  | 'MENSUAL'
  | 'TRIMESTRAL'
  | 'SEMESTRAL'
  | 'ANUAL'
  | 'PERSONALIZADO';

export type TipoGrafico = 
  | 'LINE'
  | 'BAR'
  | 'PIE'
  | 'AREA'
  | 'SCATTER'
  | 'RADAR';

export type EstadoCriticidad = 
  | 'CRITICO'
  | 'ALTO'
  | 'MEDIO'
  | 'BAJO'
  | 'NORMAL';

// =================================================================
// INTERFACES PARA FILTROS
// =================================================================

export interface FiltrosReporte {
  periodo: PeriodoReporte;
  fechaInicio: string;
  fechaFin: string;
  obraIds?: string[];
  contratistaIds?: string[];
  supervisorIds?: string[];
  tiposObra?: string[];
  estadosObra?: string[];
  rangoMontoMin?: number;
  rangoMontoMax?: number;
  departamentos?: string[];
  provincias?: string[];
  distritos?: string[];
  incluirCompletadas?: boolean;
  incluirParalizadas?: boolean;
  incluirCanceladas?: boolean;
  soloConAlertas?: boolean;
  soloConRetrasos?: boolean;
  niveLDetalle: 'RESUMEN' | 'DETALLADO' | 'COMPLETO';
}

export interface OpcionesPresentacion {
  incluirGraficos: boolean;
  incluirResumenEjecutivo: boolean;
  incluirAnalisisComparativo: boolean;
  incluirRecomendaciones: boolean;
  incluirAnexos: boolean;
  incluirFotos: boolean;
  marcaAgua?: string;
  logotipo?: string;
  piePagina?: string;
  numerarPaginas: boolean;
}

// =================================================================
// INTERFACES PARA DATOS DE REPORTES
// =================================================================

export interface DatosReporteValorizacion {
  obra: {
    id: string;
    numeroContrato: string;
    nombre: string;
    ubicacion: string;
    montoEjecucion: number;
    montoSupervision: number;
    montoTotal: number;
    plazoEjecucionDias: number;
    fechaInicio: string;
    fechaFinPrevista: string;
    tipoObra: string;
    modalidadEjecucion: string;
  };
  
  contratista: {
    nombre: string;
    ruc: string;
    representanteLegal: string;
    direccion: string;
    telefono?: string;
    email?: string;
  };
  
  supervisor: {
    nombre: string;
    ruc: string;
    supervisorResponsable: string;
    direccion: string;
    telefono?: string;
    email?: string;
  };
  
  valorizacion: {
    numero: number;
    periodo: string;
    periodoInicio: string;
    periodoFin: string;
    montoBruto: number;
    deducciones: {
      adelantoDirecto: number;
      adelantoMateriales: number;
      retencionGarantia: number;
      penalidades: number;
      otras: number;
      total: number;
    };
    montoNeto: number;
    igv: number;
    montoTotal: number;
    avanceFisicoMensual: number;
    avanceEconomicoMensual: number;
    avanceFisicoAcumulado: number;
    avanceEconomicoAcumulado: number;
    estado: string;
    fechaPresentacion?: string;
    fechaAprobacion?: string;
    fechaPago?: string;
  };
  
  partidas: PartidaValorizacionReporte[];
  
  firmas: {
    residenteObra: string;
    supervisorObra: string;
    responsableEntidad: string;
    fechaFirmas: string;
  };
}

export interface PartidaValorizacionReporte {
  id: number;
  codigo: string;
  numeroOrden: number;
  descripcion: string;
  unidadMedida: string;
  metradoContractual: number;
  precioUnitario: number;
  montoContractual: number;
  metradoAnterior: number;
  metradoActual: number;
  metradoAcumulado: number;
  porcentajeAnterior: number;
  porcentajeActual: number;
  porcentajeAcumulado: number;
  montoAnterior: number;
  montoActual: number;
  montoAcumulado: number;
  observaciones?: string;
}

export interface DatosReporteAvanceObra {
  obra: DatosReporteValorizacion['obra'] & {
    estadoActual: string;
    diasTranscurridos: number;
    diasRestantes: number;
    porcentajeVigencia: number;
  };
  
  avance: {
    fisicoReal: number;
    economicoReal: number;
    fisicoProgramado: number;
    economicoProgramado: number;
    desviacionFisica: number;
    desviacionEconomica: number;
    tendenciaTermino: 'ADELANTADO' | 'EN_TIEMPO' | 'ATRASADO';
    fechaTerminoProyectada: string;
    diasAtrasoProyectado: number;
  };
  
  cronograma: Array<{
    periodo: string;
    avanceProgramado: number;
    avanceReal: number;
    acumuladoProgramado: number;
    acumuladoReal: number;
  }>;
  
  valorizaciones: Array<{
    numero: number;
    fechaProgramada: string;
    fechaReal?: string;
    monto: number;
    estado: string;
    diasAtraso: number;
  }>;
  
  alertas: AlertaObra[];
  
  recomendaciones: RecomendacionObra[];
}

export interface AlertaObra {
  id: string;
  tipo: 'RETRASO' | 'PRESUPUESTO' | 'CALIDAD' | 'SEGURIDAD' | 'CONTRACTUAL';
  criticidad: EstadoCriticidad;
  titulo: string;
  descripcion: string;
  fechaDeteccion: string;
  impacto?: string;
  accionRequerida?: string;
}

export interface RecomendacionObra {
  id: string;
  categoria: 'CRONOGRAMA' | 'PRESUPUESTO' | 'CALIDAD' | 'GESTION' | 'LEGAL';
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  titulo: string;
  descripcion: string;
  beneficioEsperado?: string;
  responsable?: string;
  plazoEjecucion?: string;
}

export interface DatosReporteFinanciero {
  resumenEjecutivo: {
    inversionTotal: number;
    inversionEjecutada: number;
    porcentajeEjecucion: number;
    saldoPorEjecutar: number;
    obrasActivas: number;
    obrasTerminadas: number;
    obrasParalizadas: number;
    montoPromedioPorObra: number;
  };
  
  flujoEfectivo: Array<{
    periodo: string;
    ingresos: number;
    egresos: number;
    saldo: number;
    acumulado: number;
  }>;
  
  estadoPagos: Array<{
    obraId: string;
    obraNombre: string;
    montoContratado: number;
    montoEjecutado: number;
    montoPagado: number;
    saldoPorPagar: number;
    valorizacionesPendientes: number;
    diasPromedioAprobacion: number;
    diasPromedioPago: number;
    morosidad: number;
  }>;
  
  deducciones: {
    adelantosDirectos: number;
    adelantosMateriales: number;
    retencionesGarantia: number;
    penalidades: number;
    otras: number;
    total: number;
  };
  
  proyecciones: {
    flujoProyectado: Array<{
      periodo: string;
      montoProyectado: number;
      probabilidad: number;
    }>;
    liquidezProyectada: Array<{
      periodo: string;
      disponible: number;
      requerido: number;
      gap: number;
    }>;
  };
  
  indicadores: {
    roi: number;
    tir: number;
    van: number;
    margenOperativo: number;
    cicloEfectivo: number;
    rotacionActivos: number;
  };
}

export interface DatosReporteContractual {
  contratosVigentes: Array<{
    obraId: string;
    numeroContrato: string;
    nombreObra: string;
    contratista: string;
    montoContrato: number;
    fechaInicio: string;
    fechaFinPrevista: string;
    fechaFinReal?: string;
    estadoContrato: string;
    diasRestantes: number;
    avanceFisico: number;
    riesgoIncumplimiento: EstadoCriticidad;
  }>;
  
  vencimientos: Array<{
    tipo: 'CONTRATO' | 'GARANTIA' | 'LICENCIA' | 'CERTIFICACION';
    descripcion: string;
    fechaVencimiento: string;
    diasParaVencer: number;
    criticidad: EstadoCriticidad;
    accionRequerida: string;
  }>;
  
  penalidades: Array<{
    obraId: string;
    obraNombre: string;
    tipoIncumplimiento: string;
    fechaIncumplimiento: string;
    montoCalculado: number;
    montoAplicado: number;
    estadoAplicacion: string;
    observaciones?: string;
  }>;
  
  adicionalesDeductivos: Array<{
    obraId: string;
    obraNombre: string;
    tipo: 'ADICIONAL' | 'DEDUCTIVO';
    concepto: string;
    montoOriginal: number;
    montoAprobado: number;
    fechaSolicitud: string;
    fechaAprobacion?: string;
    estado: string;
  }>;
  
  garantias: Array<{
    obraId: string;
    obraNombre: string;
    tipoGarantia: string;
    entidadEmisora: string;
    montoGarantia: number;
    fechaEmision: string;
    fechaVencimiento: string;
    estado: string;
    diasParaVencer: number;
  }>;
}

export interface DatosReporteGerencial {
  kpisPrincipales: {
    inversionTotal: number;
    avanceGeneral: number;
    obrasEnEjecucion: number;
    eficienciaPresupuestal: number;
    indiceCumplimiento: number;
    satisfaccionSupervision: number;
  };
  
  distribucionInversion: Array<{
    categoria: string;
    monto: number;
    porcentaje: number;
    color: string;
  }>;
  
  estadoObras: Record<string, number>;
  
  rankingContratistas: Array<{
    id: number;
    nombre: string;
    obrasEnEjecucion: number;
    montoTotal: number;
    promedioAvance: number;
    indiceCumplimiento: number;
    penalidades: number;
    calificacionDesempeño: 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'DEFICIENTE';
    tendencia: 'MEJORANDO' | 'ESTABLE' | 'EMPEORANDO';
  }>;
  
  analisisRiesgos: Array<{
    categoria: string;
    descripcion: string;
    probabilidad: number;
    impacto: number;
    nivel: EstadoCriticidad;
    medidaPreventiva: string;
  }>;
  
  tendenciasPorRegion: Array<{
    region: string;
    obrasActivas: number;
    inversion: number;
    avancePromedio: number;
    problemas: number;
  }>;
  
  proyeccionesEstrategicas: {
    metaAnual: number;
    proyeccionAlcance: number;
    brechaEsperada: number;
    accionesCorrectivas: string[];
    oportunidadesMejora: string[];
  };
}

// =================================================================
// INTERFACES PARA CONFIGURACIÓN DE GRÁFICOS
// =================================================================

export interface ConfiguracionGrafico {
  id: string;
  tipo: TipoGrafico;
  titulo: string;
  descripcion?: string;
  datos: any[];
  configuracion: {
    width?: number;
    height?: number;
    margin?: { top: number; right: number; bottom: number; left: number; };
    colores?: string[];
    mostrarLeyenda?: boolean;
    mostrarGrid?: boolean;
    formatoTooltip?: 'moneda' | 'porcentaje' | 'numero' | 'fecha';
    ejeX?: {
      dataKey: string;
      label?: string;
      tipo?: 'categoria' | 'numero' | 'fecha';
    };
    ejeY?: {
      dataKey: string;
      label?: string;
      formato?: 'moneda' | 'porcentaje' | 'numero';
      dominio?: [number, number];
    };
  };
}

export interface DashboardConfig {
  titulo: string;
  subtitulo?: string;
  periodo: string;
  graficos: ConfiguracionGrafico[];
  indicadores: Array<{
    id: string;
    titulo: string;
    valor: number | string;
    formato: 'moneda' | 'porcentaje' | 'numero' | 'texto';
    tendencia?: {
      direccion: 'up' | 'down' | 'stable';
      valor: number;
      periodo: string;
    };
    meta?: number;
    criticidad?: EstadoCriticidad;
  }>;
}

// =================================================================
// INTERFACES PARA EXPORTACIÓN
// =================================================================

export interface ConfiguracionExportacion {
  formato: FormatoExportacion;
  nombreArchivo: string;
  incluirPortada: boolean;
  incluirIndice: boolean;
  incluirGraficos: boolean;
  incluirAnexos: boolean;
  configuracionPDF?: {
    orientacion: 'portrait' | 'landscape';
    tamaño: 'A4' | 'A3' | 'Letter';
    margen: number;
    fuente: string;
    tamañoFuente: number;
    numerarPaginas: boolean;
    marcaAgua?: string;
  };
  configuracionExcel?: {
    incluirFormulas: boolean;
    incluirGraficos: boolean;
    protegerHojas: boolean;
    nombreHojas?: string[];
  };
}

export interface ResultadoExportacion {
  exito: boolean;
  rutaArchivo?: string;
  urlDescarga?: string;
  tamaño?: number;
  error?: string;
  tiempoGeneracion?: number;
}

// =================================================================
// INTERFACES PARA GESTIÓN DE REPORTES
// =================================================================

export interface ReporteGenerado extends AuditoriaBase {
  id: number;
  tipo: TipoReporte;
  nombre: string;
  descripcion?: string;
  filtros: FiltrosReporte;
  opciones: OpcionesPresentacion;
  estado: EstadoReporte;
  fechaGeneracion: string;
  tiempoGeneracion?: number;
  tamaño?: number;
  formato: FormatoExportacion;
  rutaArchivo?: string;
  urlDescarga?: string;
  fechaExpiracion?: string;
  numeroDescargas: number;
  ultimaDescarga?: string;
  error?: string;
  usuarioSolicitante: string;
  activo: boolean;
}

export interface SolicitudReporte {
  tipo: TipoReporte;
  nombre: string;
  descripcion?: string;
  filtros: FiltrosReporte;
  opciones: OpcionesPresentacion;
  configuracionExportacion: ConfiguracionExportacion;
  programado?: {
    frecuencia: 'DIARIO' | 'SEMANAL' | 'MENSUAL' | 'TRIMESTRAL';
    diaEjecucion?: number;
    horaEjecucion?: string;
    destinatarios?: string[];
    activo: boolean;
  };
}

export interface HistorialReporte {
  id: number;
  reporteId: number;
  accion: 'GENERADO' | 'DESCARGADO' | 'MODIFICADO' | 'ELIMINADO' | 'ENVIADO';
  usuario: string;
  fecha: string;
  detalles?: string;
  ipOrigen?: string;
}

// =================================================================
// INTERFACES PARA PLANTILLAS
// =================================================================

export interface PlantillaReporte {
  id: number;
  nombre: string;
  descripcion?: string;
  tipo: TipoReporte;
  filtrosDefecto: Partial<FiltrosReporte>;
  opcionesDefecto: Partial<OpcionesPresentacion>;
  configuracionDefecto: Partial<ConfiguracionExportacion>;
  publica: boolean;
  usuarioCreador: string;
  fechaCreacion: string;
  usos: number;
  activa: boolean;
}

// =================================================================
// INTERFACES PARA ANÁLISIS Y COMPARACIONES
// =================================================================

export interface ComparacionPeriodos {
  periodoActual: {
    inicio: string;
    fin: string;
    datos: any;
  };
  periodoAnterior: {
    inicio: string;
    fin: string;
    datos: any;
  };
  variaciones: Array<{
    indicador: string;
    valorActual: number;
    valorAnterior: number;
    variacionAbsoluta: number;
    variacionPorcentual: number;
    tendencia: 'POSITIVA' | 'NEGATIVA' | 'NEUTRAL';
  }>;
}

export interface AnalisisComparativo {
  titulo: string;
  descripcion?: string;
  dimensiones: string[];
  entidades: Array<{
    id: number;
    nombre: string;
    datos: Record<string, number>;
  }>;
  ranking: Array<{
    posicion: number;
    entidadId: number;
    puntaje: number;
    fortalezas: string[];
    debilidades: string[];
  }>;
}

// =================================================================
// CONSTANTES Y CONFIGURACIONES
// =================================================================

export const TIPOS_REPORTE: Record<TipoReporte, string> = {
  VALORIZACION_MENSUAL: 'Reporte de Valorización Mensual',
  AVANCE_OBRA: 'Reporte de Avance de Obra',
  FINANCIERO_CONSOLIDADO: 'Reporte Financiero Consolidado',
  CONTROL_CONTRACTUAL: 'Reporte de Control Contractual',
  GERENCIAL_EJECUTIVO: 'Reporte Gerencial Ejecutivo'
};

export const ESTADOS_REPORTE: Record<EstadoReporte, string> = {
  GENERANDO: 'Generando',
  COMPLETADO: 'Completado',
  ERROR: 'Error',
  CANCELADO: 'Cancelado'
};

export const FORMATOS_EXPORTACION: Record<FormatoExportacion, string> = {
  PDF: 'PDF',
  EXCEL: 'Excel',
  WORD: 'Word',
  CSV: 'CSV'
};

export const PERIODOS_REPORTE: Record<PeriodoReporte, string> = {
  MENSUAL: 'Mensual',
  TRIMESTRAL: 'Trimestral',
  SEMESTRAL: 'Semestral',
  ANUAL: 'Anual',
  PERSONALIZADO: 'Personalizado'
};

export const COLORES_GRAFICOS = {
  PRIMARY: ['#3B82F6', '#1E40AF', '#1D4ED8', '#2563EB'],
  SUCCESS: ['#10B981', '#059669', '#047857', '#065F46'],
  WARNING: ['#F59E0B', '#D97706', '#B45309', '#92400E'],
  DANGER: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B'],
  INFO: ['#06B6D4', '#0891B2', '#0E7490', '#155E75'],
  NEUTRAL: ['#6B7280', '#4B5563', '#374151', '#1F2937']
};

export const CONFIGURACION_DEFECTO_EXPORTACION: ConfiguracionExportacion = {
  formato: 'PDF',
  nombreArchivo: '',
  incluirPortada: true,
  incluirIndice: true,
  incluirGraficos: true,
  incluirAnexos: false,
  configuracionPDF: {
    orientacion: 'portrait',
    tamaño: 'A4',
    margen: 20,
    fuente: 'Arial',
    tamañoFuente: 12,
    numerarPaginas: true
  },
  configuracionExcel: {
    incluirFormulas: true,
    incluirGraficos: true,
    protegerHojas: false
  }
};

export default {};