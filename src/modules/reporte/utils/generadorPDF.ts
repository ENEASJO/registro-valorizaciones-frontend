// =================================================================
// GENERADOR DE REPORTES PDF
// Sistema de Valorizaciones - Frontend
// =================================================================

import type {
  TipoReporte,
  ConfiguracionExportacion,
  ResultadoExportacion,
  DatosReporteValorizacion,
  DatosReporteAvanceObra,
  DatosReporteFinanciero,
  DatosReporteContractual,
  DatosReporteGerencial
} from '../../../types/reporte.types';

/**
 * Clase para generar reportes en formato PDF
 * En un entorno real, usaría librerías como jsPDF, PDFKit o similar
 */
export class GeneradorPDF {
  /**
   * Genera un reporte PDF según el tipo y configuración
   */
  static async generarReporte(
    tipo: TipoReporte,
    datos: any,
    configuracion: ConfiguracionExportacion
  ): Promise<ResultadoExportacion> {
    const inicioTiempo = Date.now();
    try {
      // Simular tiempo de generación
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      switch (tipo) {
        case 'VALORIZACION_MENSUAL':
          return await this.generarReporteValorizacion(datos, configuracion);
        case 'AVANCE_OBRA':
          return await this.generarReporteAvance(datos, configuracion);
        case 'FINANCIERO_CONSOLIDADO':
          return await this.generarReporteFinanciero(datos, configuracion);
        case 'CONTROL_CONTRACTUAL':
          return await this.generarReporteContractual(datos, configuracion);
        case 'GERENCIAL_EJECUTIVO':
          return await this.generarReporteGerencial(datos, configuracion);
        default:
          throw new Error(`Tipo de reporte no soportado: ${tipo}`);
      }
    } catch (error) {
      return {
        exito: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        tiempoGeneracion: (Date.now() - inicioTiempo) / 1000
      };
    }
  }
  /**
   * Genera reporte de valorización mensual
   */
  private static async generarReporteValorizacion(
    datos: DatosReporteValorizacion,
    configuracion: ConfiguracionExportacion
  ): Promise<ResultadoExportacion> {
    // En un entorno real, aquí iría la lógica de jsPDF o similar
    
    return {
      exito: true,
      rutaArchivo: `/reportes/${configuracion.nombreArchivo}.pdf`,
      urlDescarga: `/api/reportes/download/valorización-${Date.now()}`,
      tamaño: Math.floor(Math.random() * 3000000) + 1000000,
      tiempoGeneracion: 3.5
    };
  }
  /**
   * Genera reporte de avance de obra
   */
  private static async generarReporteAvance(
    datos: DatosReporteAvanceObra,
    configuracion: ConfiguracionExportacion
  ): Promise<ResultadoExportacion> {
    
    return {
      exito: true,
      rutaArchivo: `/reportes/${configuracion.nombreArchivo}.pdf`,
      urlDescarga: `/api/reportes/download/avance-${Date.now()}`,
      tamaño: Math.floor(Math.random() * 4000000) + 1500000,
      tiempoGeneracion: 4.2
    };
  }
  /**
   * Genera reporte financiero consolidado
   */
  private static async generarReporteFinanciero(
    datos: DatosReporteFinanciero,
    configuracion: ConfiguracionExportacion
  ): Promise<ResultadoExportacion> {
    
    return {
      exito: true,
      rutaArchivo: `/reportes/${configuracion.nombreArchivo}.pdf`,
      urlDescarga: `/api/reportes/download/financiero-${Date.now()}`,
      tamaño: Math.floor(Math.random() * 5000000) + 2000000,
      tiempoGeneracion: 5.8
    };
  }
  /**
   * Genera reporte de control contractual
   */
  private static async generarReporteContractual(
    datos: DatosReporteContractual,
    configuracion: ConfiguracionExportacion
  ): Promise<ResultadoExportacion> {
    
    return {
      exito: true,
      rutaArchivo: `/reportes/${configuracion.nombreArchivo}.pdf`,
      urlDescarga: `/api/reportes/download/contractual-${Date.now()}`,
      tamaño: Math.floor(Math.random() * 3500000) + 1200000,
      tiempoGeneracion: 4.1
    };
  }
  /**
   * Genera reporte gerencial ejecutivo
   */
  private static async generarReporteGerencial(
    datos: DatosReporteGerencial,
    configuracion: ConfiguracionExportacion
  ): Promise<ResultadoExportacion> {
    
    return {
      exito: true,
      rutaArchivo: `/reportes/${configuracion.nombreArchivo}.pdf`,
      urlDescarga: `/api/reportes/download/gerencial-${Date.now()}`,
      tamaño: Math.floor(Math.random() * 6000000) + 2500000,
      tiempoGeneracion: 6.5
    };
  }
  /**
   * Construye el contenido del reporte de valorización
   */
  private static construirContenidoValorizacion(
    datos: DatosReporteValorizacion,
    configuracion: ConfiguracionExportacion
  ): string {
    let contenido = '';
    // Portada
    if (configuracion.incluirPortada) {
      contenido += this.generarPortada(
        'REPORTE DE VALORIZACIÓN MENSUAL',
        datos.obra.nombre,
        datos.valorizacion.periodo
      );
    }
    // Índice
    if (configuracion.incluirIndice) {
      contenido += this.generarIndice([
        'Información General de la Obra',
        'Datos del Contratista',
        'Datos del Supervisor',
        'Resumen de Valorización',
        'Detalle de Partidas',
        'Firmas y Aprobaciones'
      ]);
    }
    // Contenido principal
    contenido += this.generarSeccionObra(datos.obra);
    contenido += this.generarSeccionContratista(datos.contratista);
    contenido += this.generarSeccionSupervisor(datos.supervisor);
    contenido += this.generarSeccionValorizacion(datos.valorizacion);
    if (configuracion.incluirGraficos) {
      contenido += this.generarSeccionGraficos();
    }
    contenido += this.generarTablaPartidas(datos.partidas);
    contenido += this.generarSeccionFirmas(datos.firmas);
    return contenido;
  }
  /**
   * Construye el contenido del reporte de avance
   */
  private static construirContenidoAvance(
    datos: DatosReporteAvanceObra,
    configuracion: ConfiguracionExportacion
  ): string {
    let contenido = '';
    if (configuracion.incluirPortada) {
      contenido += this.generarPortada(
        'REPORTE DE AVANCE DE OBRA',
        datos.obra.nombre,
        `${datos.obra.diasTranscurridos} días de ejecución`
      );
    }
    if (configuracion.incluirIndice) {
      contenido += this.generarIndice([
        'Información General de la Obra',
        'Estado Actual de Avance',
        'Análisis de Cronograma',
        'Valorizations Status',
        'Alertas y Observaciones',
        'Recomendaciones'
      ]);
    }
    contenido += this.generarSeccionObra(datos.obra);
    contenido += this.generarSeccionAvance(datos.avance);
    if (configuracion.incluirGraficos) {
      contenido += this.generarGraficoCurvaS(datos.cronograma);
    }
    contenido += this.generarTablaValorizaciones(datos.valorizaciones);
    contenido += this.generarSeccionAlertas(datos.alertas);
    contenido += this.generarSeccionRecomendaciones(datos.recomendaciones);
    return contenido;
  }
  /**
   * Construye el contenido del reporte financiero
   */
  private static construirContenidoFinanciero(
    datos: DatosReporteFinanciero,
    configuracion: ConfiguracionExportacion
  ): string {
    let contenido = '';
    if (configuracion.incluirPortada) {
      contenido += this.generarPortada(
        'REPORTE FINANCIERO CONSOLIDADO',
        'Sistema de Valorizaciones',
        'Análisis de Inversión y Liquidez'
      );
    }
    if (configuracion.incluirIndice) {
      contenido += this.generarIndice([
        'Resumen Ejecutivo',
        'Estado de Pagos',
        'Flujo de Efectivo',
        'Análisis de Deducciones',
        'Proyecciones Financieras',
        'Indicadores Clave'
      ]);
    }
    contenido += this.generarResumenEjecutivoFinanciero(datos.resumenEjecutivo);
    if (configuracion.incluirGraficos) {
      contenido += this.generarGraficoFlujoEfectivo(datos.flujoEfectivo);
    }
    contenido += this.generarTablaEstadoPagos(datos.estadoPagos);
    contenido += this.generarSeccionDeducciones(datos.deducciones);
    contenido += this.generarSeccionProyecciones(datos.proyecciones);
    contenido += this.generarIndicadoresFinancieros(datos.indicadores);
    return contenido;
  }
  /**
   * Construye el contenido del reporte contractual
   */
  private static construirContenidoContractual(
    datos: DatosReporteContractual,
    configuracion: ConfiguracionExportacion
  ): string {
    let contenido = '';
    if (configuracion.incluirPortada) {
      contenido += this.generarPortada(
        'REPORTE DE CONTROL CONTRACTUAL',
        'Sistema de Valorizaciones',
        'Control y Seguimiento de Contratos'
      );
    }
    contenido += this.generarTablaContratosVigentes(datos.contratosVigentes);
    contenido += this.generarSeccionVencimientos(datos.vencimientos);
    contenido += this.generarTablaPenalidades(datos.penalidades);
    contenido += this.generarTablaAdicionalesDeductivos(datos.adicionalesDeductivos);
    contenido += this.generarTablaGarantias(datos.garantias);
    return contenido;
  }
  /**
   * Construye el contenido del reporte gerencial
   */
  private static construirContenidoGerencial(
    datos: DatosReporteGerencial,
    configuracion: ConfiguracionExportacion
  ): string {
    let contenido = '';
    if (configuracion.incluirPortada) {
      contenido += this.generarPortada(
        'REPORTE GERENCIAL EJECUTIVO',
        'Sistema de Valorizaciones',
        'Dashboard de Control y Gestión'
      );
    }
    contenido += this.generarKPIsPrincipales(datos.kpisPrincipales);
    if (configuracion.incluirGraficos) {
      contenido += this.generarGraficoDistribucionInversion(datos.distribucionInversion);
    }
    contenido += this.generarRankingContratistas(datos.rankingContratistas);
    contenido += this.generarAnalisisRiesgos(datos.analisisRiesgos);
    contenido += this.generarTendenciasPorRegion(datos.tendenciasPorRegion);
    contenido += this.generarProyeccionesEstrategicas(datos.proyeccionesEstrategicas);
    return contenido;
  }
  // =================================================================
  // MÉTODOS AUXILIARES PARA CONSTRUCCIÓN DE CONTENIDO
  // =================================================================
  private static generarPortada(titulo: string, subtitulo: string, periodo: string): string {
    return `
    PORTADA:
    ========
    ${titulo}
    ${subtitulo}
    ${periodo}
    MUNICIPALIDAD DISTRITAL DE SAN MARTÍN DE PORRES
    GERENCIA DE OBRAS PÚBLICAS
    ${new Date().toLocaleDateString('es-PE')}
    `;
  }
  private static generarIndice(secciones: string[]): string {
    let indice = '\nÍNDICE:\n========\n';
    secciones.forEach((seccion, index) => {
      indice += `${index + 1}. ${seccion}\n`;
    });
    return indice + '\n';
  }
  private static generarSeccionObra(obra: any): string {
    return `
    1. INFORMACIÓN GENERAL DE LA OBRA
    =================================
    Nombre: ${obra.nombre || obra.numeroContrato}
    Número de Contrato: ${obra.numeroContrato}
    Ubicación: ${obra.ubicacion}
    Tipo de Obra: ${obra.tipoObra}
    Modalidad: ${obra.modalidadEjecucion}
    Monto de Ejecución: S/ ${obra.montoEjecucion?.toLocaleString('es-PE')}
    Monto de Supervisión: S/ ${obra.montoSupervision?.toLocaleString('es-PE')}
    Monto Total: S/ ${obra.montoTotal?.toLocaleString('es-PE')}
    Plazo: ${obra.plazoEjecucionDias} días
    Fecha de Inicio: ${obra.fechaInicio}
    Fecha de Fin Prevista: ${obra.fechaFinPrevista}
    `;
  }
  private static generarSeccionContratista(contratista: any): string {
    return `
    2. DATOS DEL CONTRATISTA
    ========================
    Razón Social: ${contratista.nombre}
    RUC: ${contratista.ruc}
    Representante Legal: ${contratista.representanteLegal}
    Dirección: ${contratista.direccion}
    Teléfono: ${contratista.telefono || 'No especificado'}
    Email: ${contratista.email || 'No especificado'}
    `;
  }
  private static generarSeccionSupervisor(supervisor: any): string {
    return `
    3. DATOS DEL SUPERVISOR
    =======================
    Razón Social: ${supervisor.nombre}
    RUC: ${supervisor.ruc}
    Supervisor Responsable: ${supervisor.supervisorResponsable}
    Dirección: ${supervisor.direccion}
    Teléfono: ${supervisor.telefono || 'No especificado'}
    Email: ${supervisor.email || 'No especificado'}
    `;
  }
  private static generarSeccionValorizacion(valorizacion: any): string {
    return `
    4. RESUMEN DE VALORIZACIÓN
    ==========================
    Número: ${valorizacion.numero}
    Período: ${valorizacion.periodo}
    Fecha Inicio: ${valorizacion.periodoInicio}
    Fecha Fin: ${valorizacion.periodoFin}
    MONTOS:
    -------
    Monto Bruto: S/ ${valorizacion.montoBruto?.toLocaleString('es-PE')}
    DEDUCCIONES:
    ------------
    Adelanto Directo: S/ ${valorizacion.deducciones.adelantoDirecto?.toLocaleString('es-PE')}
    Adelanto Materiales: S/ ${valorizacion.deducciones.adelantoMateriales?.toLocaleString('es-PE')}
    Retención Garantía: S/ ${valorizacion.deducciones.retencionGarantia?.toLocaleString('es-PE')}
    Penalidades: S/ ${valorizacion.deducciones.penalidades?.toLocaleString('es-PE')}
    Otras: S/ ${valorizacion.deducciones.otras?.toLocaleString('es-PE')}
    Total Deducciones: S/ ${valorizacion.deducciones.total?.toLocaleString('es-PE')}
    Monto Neto: S/ ${valorizacion.montoNeto?.toLocaleString('es-PE')}
    IGV: S/ ${valorizacion.igv?.toLocaleString('es-PE')}
    Monto Total: S/ ${valorizacion.montoTotal?.toLocaleString('es-PE')}
    AVANCE:
    -------
    Avance Físico Mensual: ${valorizacion.avanceFisicoMensual}%
    Avance Económico Mensual: ${valorizacion.avanceEconomicoMensual}%
    Avance Físico Acumulado: ${valorizacion.avanceFisicoAcumulado}%
    Avance Económico Acumulado: ${valorizacion.avanceEconomicoAcumulado}%
    Estado: ${valorizacion.estado}
    `;
  }
  private static generarTablaPartidas(partidas: any[]): string {
    let tabla = `
    5. DETALLE DE PARTIDAS
    ======================
    `;
    partidas.forEach(partida => {
      tabla += `
    ${partida.codigo} - ${partida.descripcion}
    Unidad: ${partida.unidadMedida}
    Metrado Contractual: ${partida.metradoContractual}
    Precio Unitario: S/ ${partida.precioUnitario}
    Monto Contractual: S/ ${partida.montoContractual?.toLocaleString('es-PE')}
    Metrado Anterior: ${partida.metradoAnterior}
    Metrado Actual: ${partida.metradoActual}
    Metrado Acumulado: ${partida.metradoAcumulado}
    Monto Anterior: S/ ${partida.montoAnterior?.toLocaleString('es-PE')}
    Monto Actual: S/ ${partida.montoActual?.toLocaleString('es-PE')}
    Monto Acumulado: S/ ${partida.montoAcumulado?.toLocaleString('es-PE')}
    ------------------------------------
    `;
    });
    return tabla;
  }
  private static generarSeccionFirmas(firmas: any): string {
    return `
    6. FIRMAS Y APROBACIONES
    ========================
    Residente de Obra: ${firmas.residenteObra}
    Supervisor de Obra: ${firmas.supervisorObra}  
    Responsable de la Entidad: ${firmas.responsableEntidad}
    Fecha: ${firmas.fechaFirmas}
    ________________________    ________________________    ________________________
       RESIDENTE DE OBRA           SUPERVISOR DE OBRA         ENTIDAD CONTRATANTE
    `;
  }
  private static generarSeccionAvance(avance: any): string {
    return `
    ESTADO ACTUAL DE AVANCE
    =======================
    Avance Físico Real: ${avance.fisicoReal}%
    Avance Económico Real: ${avance.economicoReal}%
    Avance Físico Programado: ${avance.fisicoProgramado}%
    Avance Económico Programado: ${avance.economicoProgramado}%
    Desviación Física: ${avance.desviacionFisica}%
    Desviación Económica: ${avance.desviacionEconomica}%
    Tendencia de Término: ${avance.tendenciaTermino}
    Fecha Término Proyectada: ${avance.fechaTerminoProyectada}
    Días de Atraso Proyectado: ${avance.diasAtrasoProyectado}
    `;
  }
  private static generarSeccionGraficos(): string {
    return `
    [GRÁFICO: Curva S de Avance]
    [GRÁFICO: Comparativo Programado vs Real]
    [GRÁFICO: Distribución de Valorizaciones]
    `;
  }
  private static generarGraficoCurvaS(cronograma: any[]): string {
    return `
    [GRÁFICO: Curva S - Cronograma de Avance]
    Datos del cronograma incluidos...
    `;
  }
  private static generarTablaValorizaciones(valorizaciones: any[]): string {
    let tabla = `
    ESTADO DE VALORIZACIONES
    ========================
    `;
    valorizaciones.forEach(val => {
      tabla += `
    Valorización N° ${val.numero}
    Fecha Programada: ${val.fechaProgramada}
    Fecha Real: ${val.fechaReal || 'Pendiente'}
    Monto: S/ ${val.monto?.toLocaleString('es-PE')}
    Estado: ${val.estado}
    Días de Atraso: ${val.diasAtraso}
    `;
    });
    return tabla;
  }
  private static generarSeccionAlertas(alertas: any[]): string {
    let seccion = `
    ALERTAS Y OBSERVACIONES
    =======================
    `;
    alertas.forEach(alerta => {
      seccion += `
    [${alerta.criticidad}] ${alerta.titulo}
    Tipo: ${alerta.tipo}
    Descripción: ${alerta.descripcion}
    Fecha Detección: ${alerta.fechaDeteccion}
    Acción Requerida: ${alerta.accionRequerida}
    `;
    });
    return seccion;
  }
  private static generarSeccionRecomendaciones(recomendaciones: any[]): string {
    let seccion = `
    RECOMENDACIONES
    ===============
    `;
    recomendaciones.forEach(rec => {
      seccion += `
    [${rec.prioridad}] ${rec.titulo}
    Categoría: ${rec.categoria}
    Descripción: ${rec.descripcion}
    Beneficio Esperado: ${rec.beneficioEsperado}
    Responsable: ${rec.responsable}
    Plazo: ${rec.plazoEjecucion}
    `;
    });
    return seccion;
  }
  // Métodos adicionales para otros tipos de reportes...
  private static generarResumenEjecutivoFinanciero(resumen: any): string {
    return `
    RESUMEN EJECUTIVO FINANCIERO
    ============================
    Inversión Total: S/ ${resumen.inversionTotal?.toLocaleString('es-PE')}
    Inversión Ejecutada: S/ ${resumen.inversionEjecutada?.toLocaleString('es-PE')}
    Porcentaje de Ejecución: ${resumen.porcentajeEjecucion}%
    Saldo por Ejecutar: S/ ${resumen.saldoPorEjecutar?.toLocaleString('es-PE')}
    Obras Activas: ${resumen.obrasActivas}
    Obras Terminadas: ${resumen.obrasTerminadas}
    Obras Paralizadas: ${resumen.obrasParalizadas}
    Monto Promedio por Obra: S/ ${resumen.montoPromedioPorObra?.toLocaleString('es-PE')}
    `;
  }
  private static generarGraficoFlujoEfectivo(flujo: any[]): string {
    return `
    [GRÁFICO: Flujo de Efectivo Mensual]
    Datos del flujo de efectivo incluidos...
    `;
  }
  private static generarTablaEstadoPagos(estadoPagos: any[]): string {
    let tabla = `
    ESTADO DE PAGOS POR OBRA
    ========================
    `;
    estadoPagos.forEach(pago => {
      tabla += `
    ${pago.obraNombre}
    Monto Contratado: S/ ${pago.montoContratado?.toLocaleString('es-PE')}
    Monto Ejecutado: S/ ${pago.montoEjecutado?.toLocaleString('es-PE')}
    Monto Pagado: S/ ${pago.montoPagado?.toLocaleString('es-PE')}
    Saldo por Pagar: S/ ${pago.saldoPorPagar?.toLocaleString('es-PE')}
    Valorizaciones Pendientes: ${pago.valorizacionesPendientes}
    Promedio Días Aprobación: ${pago.diasPromedioAprobacion}
    Promedio Días Pago: ${pago.diasPromedioPago}
    Morosidad: ${pago.morosidad} días
    `;
    });
    return tabla;
  }
  private static generarSeccionDeducciones(deducciones: any): string {
    return `
    ANÁLISIS DE DEDUCCIONES
    =======================
    Adelantos Directos: S/ ${deducciones.adelantosDirectos?.toLocaleString('es-PE')}
    Adelantos Materiales: S/ ${deducciones.adelantosMateriales?.toLocaleString('es-PE')}
    Retenciones Garantía: S/ ${deducciones.retencionesGarantia?.toLocaleString('es-PE')}
    Penalidades: S/ ${deducciones.penalidades?.toLocaleString('es-PE')}
    Otras: S/ ${deducciones.otras?.toLocaleString('es-PE')}
    Total: S/ ${deducciones.total?.toLocaleString('es-PE')}
    `;
  }
  private static generarSeccionProyecciones(proyecciones: any): string {
    return `
    PROYECCIONES FINANCIERAS
    ========================
    [Incluye gráficos y tablas de proyecciones]
    `;
  }
  private static generarIndicadoresFinancieros(indicadores: any): string {
    return `
    INDICADORES FINANCIEROS CLAVE
    =============================
    ROI: ${indicadores.roi}%
    TIR: ${indicadores.tir}%
    VAN: S/ ${indicadores.van?.toLocaleString('es-PE')}
    Margen Operativo: ${indicadores.margenOperativo}%
    Ciclo Efectivo: ${indicadores.cicloEfectivo} días
    Rotación de Activos: ${indicadores.rotacionActivos}
    `;
  }
  // Métodos para reportes contractuales y gerenciales...
  private static generarTablaContratosVigentes(contratos: any[]): string {
    let tabla = `
    CONTRATOS VIGENTES
    ==================
    `;
    contratos.forEach(contrato => {
      tabla += `
    ${contrato.numeroContrato} - ${contrato.nombreObra}
    Contratista: ${contrato.contratista}
    Monto: S/ ${contrato.montoContrato?.toLocaleString('es-PE')}
    Fecha Inicio: ${contrato.fechaInicio}
    Fecha Fin Prevista: ${contrato.fechaFinPrevista}
    Estado: ${contrato.estadoContrato}
    Días Restantes: ${contrato.diasRestantes}
    Avance Físico: ${contrato.avanceFisico}%
    Riesgo: ${contrato.riesgoIncumplimiento}
    `;
    });
    return tabla;
  }
  private static generarSeccionVencimientos(vencimientos: any[]): string {
    let seccion = `
    PRÓXIMOS VENCIMIENTOS
    =====================
    `;
    vencimientos.forEach(venc => {
      seccion += `
    [${venc.criticidad}] ${venc.descripcion}
    Tipo: ${venc.tipo}
    Fecha Vencimiento: ${venc.fechaVencimiento}
    Días para Vencer: ${venc.diasParaVencer}
    Acción Requerida: ${venc.accionRequerida}
    `;
    });
    return seccion;
  }
  private static generarTablaPenalidades(penalidades: any[]): string {
    if (penalidades.length === 0) {
      return `
    PENALIDADES
    ===========
    No se han aplicado penalidades en el período.
    `;
    }
    let tabla = `
    PENALIDADES APLICADAS
    =====================
    `;
    penalidades.forEach(pen => {
      tabla += `
    ${pen.obraNombre}
    Tipo Incumplimiento: ${pen.tipoIncumplimiento}
    Fecha Incumplimiento: ${pen.fechaIncumplimiento}
    Monto Calculado: S/ ${pen.montoCalculado?.toLocaleString('es-PE')}
    Monto Aplicado: S/ ${pen.montoAplicado?.toLocaleString('es-PE')}
    Estado: ${pen.estadoAplicacion}
    `;
    });
    return tabla;
  }
  private static generarTablaAdicionalesDeductivos(adicionales: any[]): string {
    let tabla = `
    ADICIONALES Y DEDUCTIVOS
    ========================
    `;
    adicionales.forEach(ad => {
      tabla += `
    ${ad.obraNombre}
    Tipo: ${ad.tipo}
    Concepto: ${ad.concepto}
    Monto Original: S/ ${ad.montoOriginal?.toLocaleString('es-PE')}
    Monto Aprobado: S/ ${ad.montoAprobado?.toLocaleString('es-PE')}
    Fecha Solicitud: ${ad.fechaSolicitud}
    Fecha Aprobación: ${ad.fechaAprobacion}
    Estado: ${ad.estado}
    `;
    });
    return tabla;
  }
  private static generarTablaGarantias(garantias: any[]): string {
    let tabla = `
    GARANTÍAS VIGENTES
    ==================
    `;
    garantias.forEach(gar => {
      tabla += `
    ${gar.obraNombre}
    Tipo: ${gar.tipoGarantia}
    Entidad Emisora: ${gar.entidadEmisora}
    Monto: S/ ${gar.montoGarantia?.toLocaleString('es-PE')}
    Fecha Emisión: ${gar.fechaEmision}
    Fecha Vencimiento: ${gar.fechaVencimiento}
    Estado: ${gar.estado}
    Días para Vencer: ${gar.diasParaVencer}
    `;
    });
    return tabla;
  }
  private static generarKPIsPrincipales(kpis: any): string {
    return `
    INDICADORES CLAVE DE RENDIMIENTO (KPIs)
    =======================================
    Inversión Total: S/ ${kpis.inversionTotal?.toLocaleString('es-PE')}
    Avance General: ${kpis.avanceGeneral}%
    Obras en Ejecución: ${kpis.obrasEnEjecucion}
    Eficiencia Presupuestal: ${kpis.eficienciaPresupuestal}%
    Índice de Cumplimiento: ${kpis.indiceCumplimiento}%
    Satisfacción Supervisión: ${kpis.satisfaccionSupervision}/5
    `;
  }
  private static generarGraficoDistribucionInversion(distribucion: any[]): string {
    return `
    [GRÁFICO: Distribución de Inversión por Tipo de Obra]
    Datos de distribución incluidos...
    `;
  }
  private static generarRankingContratistas(ranking: any[]): string {
    let tabla = `
    RANKING DE CONTRATISTAS
    =======================
    `;
    ranking.forEach((contratista, index) => {
      tabla += `
    ${index + 1}. ${contratista.nombre}
    Obras en Ejecución: ${contratista.obrasEnEjecucion}
    Monto Total: S/ ${contratista.montoTotal?.toLocaleString('es-PE')}
    Promedio Avance: ${contratista.promedioAvance}%
    Índice Cumplimiento: ${contratista.indiceCumplimiento}%
    Penalidades: ${contratista.penalidades}
    Calificación: ${contratista.calificacionDesempeño}
    Tendencia: ${contratista.tendencia}
    `;
    });
    return tabla;
  }
  private static generarAnalisisRiesgos(riesgos: any[]): string {
    let seccion = `
    ANÁLISIS DE RIESGOS
    ===================
    `;
    riesgos.forEach(riesgo => {
      seccion += `
    [${riesgo.nivel}] ${riesgo.categoria}
    Descripción: ${riesgo.descripcion}
    Probabilidad: ${(riesgo.probabilidad * 100).toFixed(0)}%
    Impacto: ${(riesgo.impacto * 100).toFixed(0)}%
    Medida Preventiva: ${riesgo.medidaPreventiva}
    `;
    });
    return seccion;
  }
  private static generarTendenciasPorRegion(tendencias: any[]): string {
    let tabla = `
    TENDENCIAS POR REGIÓN
    =====================
    `;
    tendencias.forEach(tend => {
      tabla += `
    ${tend.region}
    Obras Activas: ${tend.obrasActivas}
    Inversión: S/ ${tend.inversion?.toLocaleString('es-PE')}
    Avance Promedio: ${tend.avancePromedio}%
    Problemas Reportados: ${tend.problemas}
    `;
    });
    return tabla;
  }
  private static generarProyeccionesEstrategicas(proyecciones: any): string {
    return `
    PROYECCIONES ESTRATÉGICAS
    =========================
    Meta Anual: ${proyecciones.metaAnual}%
    Proyección Alcance: ${proyecciones.proyeccionAlcance}%
    Brecha Esperada: ${proyecciones.brechaEsperada}%
    ACCIONES CORRECTIVAS:
    ${proyecciones.accionesCorrectivas.map((accion: string, index: number) => `${index + 1}. ${accion}`).join('\n')}
    OPORTUNIDADES DE MEJORA:
    ${proyecciones.oportunidadesMejora.map((oportunidad: string, index: number) => `${index + 1}. ${oportunidad}`).join('\n')}
    `;
  }
}
export default GeneradorPDF;