// =================================================================
// EXPORTADOR DE REPORTES EXCEL
// Sistema de Valorizaciones - Frontend
// =================================================================
/**
 * Clase para generar reportes en formato Excel
 * En un entorno real, usaría librerías como SheetJS, ExcelJS o similar
 */
export class ExportadorExcel {
    /**
     * Genera un reporte Excel según el tipo y configuración
     */
    static async generarReporte(tipo, datos, configuracion) {
        const inicioTiempo = Date.now();
        try {
            // Simular tiempo de generación
            await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2500));
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
        }
        catch (error) {
            return {
                exito: false,
                error: error instanceof Error ? error.message : 'Error desconocido',
                tiempoGeneracion: (Date.now() - inicioTiempo) / 1000
            };
        }
    }
    /**
     * Genera reporte de valorización mensual en Excel
     */
    static async generarReporteValorizacion(datos, configuracion) {
        const hojas = this.construirHojasValorizacion(datos, configuracion);
        return {
            exito: true,
            rutaArchivo: `/reportes/${configuracion.nombreArchivo}.xlsx`,
            urlDescarga: `/api/reportes/download/valorización-excel-${Date.now()}`,
            tamaño: Math.floor(Math.random() * 1500000) + 500000,
            tiempoGeneracion: 2.8
        };
    }
    /**
     * Genera reporte de avance de obra en Excel
     */
    static async generarReporteAvance(datos, configuracion) {
        const hojas = this.construirHojasAvance(datos, configuracion);
        return {
            exito: true,
            rutaArchivo: `/reportes/${configuracion.nombreArchivo}.xlsx`,
            urlDescarga: `/api/reportes/download/avance-excel-${Date.now()}`,
            tamaño: Math.floor(Math.random() * 2000000) + 800000,
            tiempoGeneracion: 3.2
        };
    }
    /**
     * Genera reporte financiero consolidado en Excel
     */
    static async generarReporteFinanciero(datos, configuracion) {
        const hojas = this.construirHojasFinanciero(datos, configuracion);
        return {
            exito: true,
            rutaArchivo: `/reportes/${configuracion.nombreArchivo}.xlsx`,
            urlDescarga: `/api/reportes/download/financiero-excel-${Date.now()}`,
            tamaño: Math.floor(Math.random() * 3000000) + 1200000,
            tiempoGeneracion: 4.1
        };
    }
    /**
     * Genera reporte de control contractual en Excel
     */
    static async generarReporteContractual(datos, configuracion) {
        const hojas = this.construirHojasContractual(datos, configuracion);
        return {
            exito: true,
            rutaArchivo: `/reportes/${configuracion.nombreArchivo}.xlsx`,
            urlDescarga: `/api/reportes/download/contractual-excel-${Date.now()}`,
            tamaño: Math.floor(Math.random() * 2500000) + 900000,
            tiempoGeneracion: 3.7
        };
    }
    /**
     * Genera reporte gerencial ejecutivo en Excel
     */
    static async generarReporteGerencial(datos, configuracion) {
        const hojas = this.construirHojasGerencial(datos, configuracion);
        return {
            exito: true,
            rutaArchivo: `/reportes/${configuracion.nombreArchivo}.xlsx`,
            urlDescarga: `/api/reportes/download/gerencial-excel-${Date.now()}`,
            tamaño: Math.floor(Math.random() * 4000000) + 1800000,
            tiempoGeneracion: 5.3
        };
    }
    // =================================================================
    // MÉTODOS PARA CONSTRUCCIÓN DE HOJAS DE CÁLCULO
    // =================================================================
    /**
     * Construye las hojas para reporte de valorización
     */
    static construirHojasValorizacion(datos, configuracion) {
        const hojas = [];
        // Hoja 1: Información General
        hojas.push({
            nombre: 'Info General',
            datos: this.crearHojaInfoGeneral(datos)
        });
        // Hoja 2: Resumen de Valorización
        hojas.push({
            nombre: 'Resumen Valorización',
            datos: this.crearHojaResumenValorizacion(datos.valorizacion)
        });
        // Hoja 3: Detalle de Partidas
        hojas.push({
            nombre: 'Detalle Partidas',
            datos: this.crearHojaDetallePartidas(datos.partidas)
        });
        // Hoja 4: Análisis (con fórmulas si está habilitado)
        if (configuracion.configuracionExcel?.incluirFormulas) {
            hojas.push({
                nombre: 'Análisis',
                datos: this.crearHojaAnalisisValorizacion(datos)
            });
        }
        return hojas;
    }
    /**
     * Construye las hojas para reporte de avance
     */
    static construirHojasAvance(datos, configuracion) {
        const hojas = [];
        // Hoja 1: Resumen de Avance
        hojas.push({
            nombre: 'Resumen Avance',
            datos: this.crearHojaResumenAvance(datos)
        });
        // Hoja 2: Cronograma
        hojas.push({
            nombre: 'Cronograma',
            datos: this.crearHojaCronograma(datos.cronograma)
        });
        // Hoja 3: Valorizaciones
        hojas.push({
            nombre: 'Valorizaciones',
            datos: this.crearHojaValorizaciones(datos.valorizaciones)
        });
        // Hoja 4: Alertas y Recomendaciones
        hojas.push({
            nombre: 'Alertas',
            datos: this.crearHojaAlertas(datos.alertas, datos.recomendaciones)
        });
        return hojas;
    }
    /**
     * Construye las hojas para reporte financiero
     */
    static construirHojasFinanciero(datos, configuracion) {
        const hojas = [];
        // Hoja 1: Dashboard Financiero
        hojas.push({
            nombre: 'Dashboard',
            datos: this.crearHojaDashboardFinanciero(datos)
        });
        // Hoja 2: Flujo de Efectivo
        hojas.push({
            nombre: 'Flujo Efectivo',
            datos: this.crearHojaFlujoEfectivo(datos.flujoEfectivo)
        });
        // Hoja 3: Estado de Pagos
        hojas.push({
            nombre: 'Estado Pagos',
            datos: this.crearHojaEstadoPagos(datos.estadoPagos)
        });
        // Hoja 4: Proyecciones
        hojas.push({
            nombre: 'Proyecciones',
            datos: this.crearHojaProyecciones(datos.proyecciones)
        });
        // Hoja 5: Indicadores
        hojas.push({
            nombre: 'Indicadores',
            datos: this.crearHojaIndicadores(datos.indicadores)
        });
        return hojas;
    }
    /**
     * Construye las hojas para reporte contractual
     */
    static construirHojasContractual(datos, configuracion) {
        const hojas = [];
        // Hoja 1: Contratos Vigentes
        hojas.push({
            nombre: 'Contratos Vigentes',
            datos: this.crearHojaContratosVigentes(datos.contratosVigentes)
        });
        // Hoja 2: Vencimientos
        hojas.push({
            nombre: 'Vencimientos',
            datos: this.crearHojaVencimientos(datos.vencimientos)
        });
        // Hoja 3: Garantías
        hojas.push({
            nombre: 'Garantías',
            datos: this.crearHojaGarantias(datos.garantias)
        });
        // Hoja 4: Adicionales y Deductivos
        hojas.push({
            nombre: 'Adicionales',
            datos: this.crearHojaAdicionales(datos.adicionalesDeductivos)
        });
        if (datos.penalidades.length > 0) {
            // Hoja 5: Penalidades (solo si existen)
            hojas.push({
                nombre: 'Penalidades',
                datos: this.crearHojaPenalidades(datos.penalidades)
            });
        }
        return hojas;
    }
    /**
     * Construye las hojas para reporte gerencial
     */
    static construirHojasGerencial(datos, configuracion) {
        const hojas = [];
        // Hoja 1: KPIs Principales
        hojas.push({
            nombre: 'KPIs',
            datos: this.crearHojaKPIs(datos)
        });
        // Hoja 2: Distribución Inversión
        hojas.push({
            nombre: 'Distribución',
            datos: this.crearHojaDistribucion(datos.distribucionInversion)
        });
        // Hoja 3: Ranking Contratistas
        hojas.push({
            nombre: 'Ranking',
            datos: this.crearHojaRanking(datos.rankingContratistas)
        });
        // Hoja 4: Análisis de Riesgos
        hojas.push({
            nombre: 'Riesgos',
            datos: this.crearHojaRiesgos(datos.analisisRiesgos)
        });
        // Hoja 5: Tendencias por Región
        hojas.push({
            nombre: 'Regiones',
            datos: this.crearHojaTendenciasRegion(datos.tendenciasPorRegion)
        });
        return hojas;
    }
    // =================================================================
    // MÉTODOS ESPECÍFICOS PARA CREAR CONTENIDO DE HOJAS
    // =================================================================
    static crearHojaInfoGeneral(datos) {
        return [
            [{ value: 'INFORMACIÓN GENERAL DE LA OBRA', style: 'header' }],
            [],
            [{ value: 'Nombre:', style: 'label' }, { value: datos.obra.nombre }],
            [{ value: 'Número de Contrato:', style: 'label' }, { value: datos.obra.numeroContrato }],
            [{ value: 'Ubicación:', style: 'label' }, { value: datos.obra.ubicacion }],
            [{ value: 'Tipo de Obra:', style: 'label' }, { value: datos.obra.tipoObra }],
            [{ value: 'Modalidad:', style: 'label' }, { value: datos.obra.modalidadEjecucion }],
            [],
            [{ value: 'MONTOS', style: 'header' }],
            [{ value: 'Monto Ejecución:', style: 'label' }, { value: datos.obra.montoEjecucion, style: 'currency' }],
            [{ value: 'Monto Supervisión:', style: 'label' }, { value: datos.obra.montoSupervision, style: 'currency' }],
            [{ value: 'Monto Total:', style: 'label' }, { value: datos.obra.montoTotal, style: 'currency' }],
            [],
            [{ value: 'PLAZOS', style: 'header' }],
            [{ value: 'Plazo Ejecución:', style: 'label' }, { value: `${datos.obra.plazoEjecucionDias} días` }],
            [{ value: 'Fecha Inicio:', style: 'label' }, { value: datos.obra.fechaInicio }],
            [{ value: 'Fecha Fin Prevista:', style: 'label' }, { value: datos.obra.fechaFinPrevista }],
            [],
            [{ value: 'CONTRATISTA', style: 'header' }],
            [{ value: 'Razón Social:', style: 'label' }, { value: datos.contratista.nombre }],
            [{ value: 'RUC:', style: 'label' }, { value: datos.contratista.ruc }],
            [{ value: 'Representante Legal:', style: 'label' }, { value: datos.contratista.representanteLegal }],
            [],
            [{ value: 'SUPERVISOR', style: 'header' }],
            [{ value: 'Razón Social:', style: 'label' }, { value: datos.supervisor.nombre }],
            [{ value: 'RUC:', style: 'label' }, { value: datos.supervisor.ruc }],
            [{ value: 'Supervisor Responsable:', style: 'label' }, { value: datos.supervisor.supervisorResponsable }]
        ];
    }
    static crearHojaResumenValorizacion(valorizacion) {
        return [
            [{ value: 'RESUMEN DE VALORIZACIÓN', style: 'header' }],
            [],
            [{ value: 'Número:', style: 'label' }, { value: valorizacion.numero }],
            [{ value: 'Período:', style: 'label' }, { value: valorizacion.periodo }],
            [{ value: 'Fecha Inicio:', style: 'label' }, { value: valorizacion.periodoInicio }],
            [{ value: 'Fecha Fin:', style: 'label' }, { value: valorizacion.periodoFin }],
            [],
            [{ value: 'MONTOS', style: 'header' }],
            [{ value: 'Monto Bruto:', style: 'label' }, { value: valorizacion.montoBruto, style: 'currency' }],
            [],
            [{ value: 'DEDUCCIONES', style: 'header' }],
            [{ value: 'Adelanto Directo:', style: 'label' }, { value: valorizacion.deducciones.adelantoDirecto, style: 'currency' }],
            [{ value: 'Adelanto Materiales:', style: 'label' }, { value: valorizacion.deducciones.adelantoMateriales, style: 'currency' }],
            [{ value: 'Retención Garantía:', style: 'label' }, { value: valorizacion.deducciones.retencionGarantia, style: 'currency' }],
            [{ value: 'Penalidades:', style: 'label' }, { value: valorizacion.deducciones.penalidades, style: 'currency' }],
            [{ value: 'Otras:', style: 'label' }, { value: valorizacion.deducciones.otras, style: 'currency' }],
            [{ value: 'Total Deducciones:', style: 'label' }, { value: valorizacion.deducciones.total, style: 'currency' }],
            [],
            [{ value: 'Monto Neto:', style: 'label' }, { value: valorizacion.montoNeto, style: 'currency' }],
            [{ value: 'IGV:', style: 'label' }, { value: valorizacion.igv, style: 'currency' }],
            [{ value: 'Monto Total:', style: 'label' }, { value: valorizacion.montoTotal, style: 'currency' }],
            [],
            [{ value: 'AVANCE', style: 'header' }],
            [{ value: 'Avance Físico Mensual:', style: 'label' }, { value: valorizacion.avanceFisicoMensual, style: 'percentage' }],
            [{ value: 'Avance Económico Mensual:', style: 'label' }, { value: valorizacion.avanceEconomicoMensual, style: 'percentage' }],
            [{ value: 'Avance Físico Acumulado:', style: 'label' }, { value: valorizacion.avanceFisicoAcumulado, style: 'percentage' }],
            [{ value: 'Avance Económico Acumulado:', style: 'label' }, { value: valorizacion.avanceEconomicoAcumulado, style: 'percentage' }],
            [],
            [{ value: 'Estado:', style: 'label' }, { value: valorizacion.estado }],
            [{ value: 'Fecha Presentación:', style: 'label' }, { value: valorizacion.fechaPresentacion }],
            [{ value: 'Fecha Aprobación:', style: 'label' }, { value: valorizacion.fechaAprobacion }],
            [{ value: 'Fecha Pago:', style: 'label' }, { value: valorizacion.fechaPago }]
        ];
    }
    static crearHojaDetallePartidas(partidas) {
        const datos = [
            [
                { value: 'Código', style: 'header' },
                { value: 'Descripción', style: 'header' },
                { value: 'Und', style: 'header' },
                { value: 'Metrado Contractual', style: 'header' },
                { value: 'Precio Unitario', style: 'header' },
                { value: 'Monto Contractual', style: 'header' },
                { value: 'Metrado Anterior', style: 'header' },
                { value: 'Metrado Actual', style: 'header' },
                { value: 'Metrado Acumulado', style: 'header' },
                { value: '% Anterior', style: 'header' },
                { value: '% Actual', style: 'header' },
                { value: '% Acumulado', style: 'header' },
                { value: 'Monto Anterior', style: 'header' },
                { value: 'Monto Actual', style: 'header' },
                { value: 'Monto Acumulado', style: 'header' }
            ]
        ];
        partidas.forEach(partida => {
            datos.push([
                { value: partida.codigo },
                { value: partida.descripcion },
                { value: partida.unidadMedida },
                { value: partida.metradoContractual, style: 'number' },
                { value: partida.precioUnitario, style: 'currency' },
                { value: partida.montoContractual, style: 'currency' },
                { value: partida.metradoAnterior, style: 'number' },
                { value: partida.metradoActual, style: 'number' },
                { value: partida.metradoAcumulado, style: 'number' },
                { value: partida.porcentajeAnterior, style: 'percentage' },
                { value: partida.porcentajeActual, style: 'percentage' },
                { value: partida.porcentajeAcumulado, style: 'percentage' },
                { value: partida.montoAnterior, style: 'currency' },
                { value: partida.montoActual, style: 'currency' },
                { value: partida.montoAcumulado, style: 'currency' }
            ]);
        });
        return datos;
    }
    static crearHojaAnalisisValorizacion(datos) {
        return [
            [{ value: 'ANÁLISIS DE VALORIZACIÓN', style: 'header' }],
            [],
            [{ value: 'INDICADORES CALCULADOS', style: 'subheader' }],
            [{ value: 'Eficiencia de Avance:', style: 'label' }, { value: '=B10/B11', style: 'formula' }], // Ejemplo de fórmula
            [{ value: 'Ratio Deducciones:', style: 'label' }, { value: '=B15/B8', style: 'formula' }],
            [{ value: 'Índice de Cumplimiento:', style: 'label' }, { value: '=B21/100', style: 'formula' }],
            [],
            [{ value: 'PROYECCIONES', style: 'subheader' }],
            [{ value: 'Fecha Término Proyectada:', style: 'label' }, { value: 'Calculada según avance' }],
            [{ value: 'Monto Final Estimado:', style: 'label' }, { value: 'Basado en tendencia' }],
            [],
            [{ value: 'ALERTAS AUTOMÁTICAS', style: 'subheader' }],
            [{ value: 'Retraso en cronograma:', style: 'label' }, { value: datos.valorizacion.avanceFisicoAcumulado < 10 ? 'SÍ' : 'NO' }],
            [{ value: 'Exceso en deducciones:', style: 'label' }, { value: datos.valorizacion.deducciones.total > datos.valorizacion.montoBruto * 0.2 ? 'SÍ' : 'NO' }]
        ];
    }
    static crearHojaResumenAvance(datos) {
        return [
            [{ value: 'RESUMEN DE AVANCE DE OBRA', style: 'header' }],
            [],
            [{ value: 'INFORMACIÓN GENERAL', style: 'subheader' }],
            [{ value: 'Obra:', style: 'label' }, { value: datos.obra.nombre }],
            [{ value: 'Estado Actual:', style: 'label' }, { value: datos.obra.estadoActual }],
            [{ value: 'Días Transcurridos:', style: 'label' }, { value: datos.obra.diasTranscurridos }],
            [{ value: 'Días Restantes:', style: 'label' }, { value: datos.obra.diasRestantes }],
            [{ value: '% Vigencia:', style: 'label' }, { value: datos.obra.porcentajeVigencia, style: 'percentage' }],
            [],
            [{ value: 'AVANCE ACTUAL', style: 'subheader' }],
            [{ value: 'Avance Físico Real:', style: 'label' }, { value: datos.avance.fisicoReal, style: 'percentage' }],
            [{ value: 'Avance Económico Real:', style: 'label' }, { value: datos.avance.economicoReal, style: 'percentage' }],
            [{ value: 'Avance Físico Programado:', style: 'label' }, { value: datos.avance.fisicoProgramado, style: 'percentage' }],
            [{ value: 'Avance Económico Programado:', style: 'label' }, { value: datos.avance.economicoProgramado, style: 'percentage' }],
            [],
            [{ value: 'DESVIACIONES', style: 'subheader' }],
            [{ value: 'Desviación Física:', style: 'label' }, { value: datos.avance.desviacionFisica, style: 'percentage' }],
            [{ value: 'Desviación Económica:', style: 'label' }, { value: datos.avance.desviacionEconomica, style: 'percentage' }],
            [{ value: 'Tendencia Término:', style: 'label' }, { value: datos.avance.tendenciaTermino }],
            [{ value: 'Fecha Término Proyectada:', style: 'label' }, { value: datos.avance.fechaTerminoProyectada }],
            [{ value: 'Días Atraso Proyectado:', style: 'label' }, { value: datos.avance.diasAtrasoProyectado }]
        ];
    }
    static crearHojaCronograma(cronograma) {
        const datos = [
            [
                { value: 'Período', style: 'header' },
                { value: 'Avance Programado', style: 'header' },
                { value: 'Avance Real', style: 'header' },
                { value: 'Acumulado Programado', style: 'header' },
                { value: 'Acumulado Real', style: 'header' },
                { value: 'Desviación', style: 'header' }
            ]
        ];
        cronograma.forEach(periodo => {
            datos.push([
                { value: periodo.periodo },
                { value: periodo.avanceProgramado, style: 'percentage' },
                { value: periodo.avanceReal, style: 'percentage' },
                { value: periodo.acumuladoProgramado, style: 'percentage' },
                { value: periodo.acumuladoReal, style: 'percentage' },
                { value: periodo.acumuladoReal - periodo.acumuladoProgramado, style: 'percentage' }
            ]);
        });
        return datos;
    }
    static crearHojaValorizaciones(valorizaciones) {
        const datos = [
            [
                { value: 'N°', style: 'header' },
                { value: 'Fecha Programada', style: 'header' },
                { value: 'Fecha Real', style: 'header' },
                { value: 'Monto', style: 'header' },
                { value: 'Estado', style: 'header' },
                { value: 'Días Atraso', style: 'header' }
            ]
        ];
        valorizaciones.forEach(val => {
            datos.push([
                { value: val.numero },
                { value: val.fechaProgramada },
                { value: val.fechaReal || 'Pendiente' },
                { value: val.monto, style: 'currency' },
                { value: val.estado },
                { value: val.diasAtraso }
            ]);
        });
        return datos;
    }
    static crearHojaAlertas(alertas, recomendaciones) {
        const datos = [
            [{ value: 'ALERTAS', style: 'header' }],
            [],
            [
                { value: 'Tipo', style: 'header' },
                { value: 'Criticidad', style: 'header' },
                { value: 'Título', style: 'header' },
                { value: 'Descripción', style: 'header' },
                { value: 'Fecha Detección', style: 'header' },
                { value: 'Acción Requerida', style: 'header' }
            ]
        ];
        alertas.forEach(alerta => {
            datos.push([
                { value: alerta.tipo },
                { value: alerta.criticidad },
                { value: alerta.titulo },
                { value: alerta.descripcion },
                { value: alerta.fechaDeteccion },
                { value: alerta.accionRequerida }
            ]);
        });
        // Agregar separador y recomendaciones
        datos.push([]);
        datos.push([{ value: 'RECOMENDACIONES', style: 'header' }]);
        datos.push([]);
        datos.push([
            { value: 'Categoría', style: 'header' },
            { value: 'Prioridad', style: 'header' },
            { value: 'Título', style: 'header' },
            { value: 'Descripción', style: 'header' },
            { value: 'Responsable', style: 'header' },
            { value: 'Plazo', style: 'header' }
        ]);
        recomendaciones.forEach(rec => {
            datos.push([
                { value: rec.categoria },
                { value: rec.prioridad },
                { value: rec.titulo },
                { value: rec.descripcion },
                { value: rec.responsable },
                { value: rec.plazoEjecucion }
            ]);
        });
        return datos;
    }
    static crearHojaDashboardFinanciero(datos) {
        return [
            [{ value: 'DASHBOARD FINANCIERO', style: 'header' }],
            [],
            [{ value: 'RESUMEN EJECUTIVO', style: 'subheader' }],
            [{ value: 'Inversión Total:', style: 'label' }, { value: datos.resumenEjecutivo.inversionTotal, style: 'currency' }],
            [{ value: 'Inversión Ejecutada:', style: 'label' }, { value: datos.resumenEjecutivo.inversionEjecutada, style: 'currency' }],
            [{ value: '% Ejecución:', style: 'label' }, { value: datos.resumenEjecutivo.porcentajeEjecucion, style: 'percentage' }],
            [{ value: 'Saldo por Ejecutar:', style: 'label' }, { value: datos.resumenEjecutivo.saldoPorEjecutar, style: 'currency' }],
            [],
            [{ value: 'ESTADÍSTICAS DE OBRAS', style: 'subheader' }],
            [{ value: 'Obras Activas:', style: 'label' }, { value: datos.resumenEjecutivo.obrasActivas }],
            [{ value: 'Obras Terminadas:', style: 'label' }, { value: datos.resumenEjecutivo.obrasTerminadas }],
            [{ value: 'Obras Paralizadas:', style: 'label' }, { value: datos.resumenEjecutivo.obrasParalizadas }],
            [{ value: 'Monto Promedio por Obra:', style: 'label' }, { value: datos.resumenEjecutivo.montoPromedioPorObra, style: 'currency' }],
            [],
            [{ value: 'TOTAL DEDUCCIONES', style: 'subheader' }],
            [{ value: 'Adelantos Directos:', style: 'label' }, { value: datos.deducciones.adelantosDirectos, style: 'currency' }],
            [{ value: 'Adelantos Materiales:', style: 'label' }, { value: datos.deducciones.adelantosMateriales, style: 'currency' }],
            [{ value: 'Retenciones Garantía:', style: 'label' }, { value: datos.deducciones.retencionesGarantia, style: 'currency' }],
            [{ value: 'Penalidades:', style: 'label' }, { value: datos.deducciones.penalidades, style: 'currency' }],
            [{ value: 'Otras:', style: 'label' }, { value: datos.deducciones.otras, style: 'currency' }],
            [{ value: 'Total:', style: 'label' }, { value: datos.deducciones.total, style: 'currency' }]
        ];
    }
    static crearHojaFlujoEfectivo(flujo) {
        const datos = [
            [
                { value: 'Período', style: 'header' },
                { value: 'Ingresos', style: 'header' },
                { value: 'Egresos', style: 'header' },
                { value: 'Saldo', style: 'header' },
                { value: 'Acumulado', style: 'header' }
            ]
        ];
        flujo.forEach(periodo => {
            datos.push([
                { value: periodo.periodo },
                { value: periodo.ingresos, style: 'currency' },
                { value: periodo.egresos, style: 'currency' },
                { value: periodo.saldo, style: 'currency' },
                { value: periodo.acumulado, style: 'currency' }
            ]);
        });
        return datos;
    }
    static crearHojaEstadoPagos(estadoPagos) {
        const datos = [
            [
                { value: 'Obra', style: 'header' },
                { value: 'Monto Contratado', style: 'header' },
                { value: 'Monto Ejecutado', style: 'header' },
                { value: 'Monto Pagado', style: 'header' },
                { value: 'Saldo por Pagar', style: 'header' },
                { value: 'Valorizaciones Pendientes', style: 'header' },
                { value: 'Días Promedio Aprobación', style: 'header' },
                { value: 'Días Promedio Pago', style: 'header' },
                { value: 'Morosidad', style: 'header' }
            ]
        ];
        estadoPagos.forEach(pago => {
            datos.push([
                { value: pago.obraNombre },
                { value: pago.montoContratado, style: 'currency' },
                { value: pago.montoEjecutado, style: 'currency' },
                { value: pago.montoPagado, style: 'currency' },
                { value: pago.saldoPorPagar, style: 'currency' },
                { value: pago.valorizacionesPendientes },
                { value: pago.diasPromedioAprobacion },
                { value: pago.diasPromedioPago },
                { value: pago.morosidad }
            ]);
        });
        return datos;
    }
    static crearHojaProyecciones(proyecciones) {
        const datos = [
            [{ value: 'PROYECCIONES FINANCIERAS', style: 'header' }],
            [],
            [{ value: 'FLUJO PROYECTADO', style: 'subheader' }],
            [
                { value: 'Período', style: 'header' },
                { value: 'Monto Proyectado', style: 'header' },
                { value: 'Probabilidad', style: 'header' }
            ]
        ];
        proyecciones.flujoProyectado.forEach((item) => {
            datos.push([
                { value: item.periodo },
                { value: item.montoProyectado, style: 'currency' },
                { value: item.probabilidad, style: 'percentage' }
            ]);
        });
        datos.push([]);
        datos.push([{ value: 'LIQUIDEZ PROYECTADA', style: 'subheader' }]);
        datos.push([
            { value: 'Período', style: 'header' },
            { value: 'Disponible', style: 'header' },
            { value: 'Requerido', style: 'header' },
            { value: 'Gap', style: 'header' }
        ]);
        proyecciones.liquidezProyectada.forEach((item) => {
            datos.push([
                { value: item.periodo },
                { value: item.disponible, style: 'currency' },
                { value: item.requerido, style: 'currency' },
                { value: item.gap, style: 'currency' }
            ]);
        });
        return datos;
    }
    static crearHojaIndicadores(indicadores) {
        return [
            [{ value: 'INDICADORES FINANCIEROS', style: 'header' }],
            [],
            [{ value: 'ROI (Return on Investment):', style: 'label' }, { value: indicadores.roi, style: 'percentage' }],
            [{ value: 'TIR (Tasa Interna de Retorno):', style: 'label' }, { value: indicadores.tir, style: 'percentage' }],
            [{ value: 'VAN (Valor Actual Neto):', style: 'label' }, { value: indicadores.van, style: 'currency' }],
            [{ value: 'Margen Operativo:', style: 'label' }, { value: indicadores.margenOperativo, style: 'percentage' }],
            [{ value: 'Ciclo de Efectivo:', style: 'label' }, { value: `${indicadores.cicloEfectivo} días` }],
            [{ value: 'Rotación de Activos:', style: 'label' }, { value: indicadores.rotacionActivos, style: 'number' }]
        ];
    }
    // Métodos adicionales para hojas contractuales y gerenciales...
    static crearHojaContratosVigentes(contratos) {
        const datos = [
            [
                { value: 'N° Contrato', style: 'header' },
                { value: 'Obra', style: 'header' },
                { value: 'Contratista', style: 'header' },
                { value: 'Monto', style: 'header' },
                { value: 'Fecha Inicio', style: 'header' },
                { value: 'Fecha Fin Prevista', style: 'header' },
                { value: 'Días Restantes', style: 'header' },
                { value: 'Avance Físico', style: 'header' },
                { value: 'Riesgo', style: 'header' }
            ]
        ];
        contratos.forEach(contrato => {
            datos.push([
                { value: contrato.numeroContrato },
                { value: contrato.nombreObra },
                { value: contrato.contratista },
                { value: contrato.montoContrato, style: 'currency' },
                { value: contrato.fechaInicio },
                { value: contrato.fechaFinPrevista },
                { value: contrato.diasRestantes },
                { value: contrato.avanceFisico, style: 'percentage' },
                { value: contrato.riesgoIncumplimiento }
            ]);
        });
        return datos;
    }
    static crearHojaVencimientos(vencimientos) {
        const datos = [
            [
                { value: 'Tipo', style: 'header' },
                { value: 'Descripción', style: 'header' },
                { value: 'Fecha Vencimiento', style: 'header' },
                { value: 'Días para Vencer', style: 'header' },
                { value: 'Criticidad', style: 'header' },
                { value: 'Acción Requerida', style: 'header' }
            ]
        ];
        vencimientos.forEach(venc => {
            datos.push([
                { value: venc.tipo },
                { value: venc.descripcion },
                { value: venc.fechaVencimiento },
                { value: venc.diasParaVencer },
                { value: venc.criticidad },
                { value: venc.accionRequerida }
            ]);
        });
        return datos;
    }
    static crearHojaGarantias(garantias) {
        const datos = [
            [
                { value: 'Obra', style: 'header' },
                { value: 'Tipo Garantía', style: 'header' },
                { value: 'Entidad Emisora', style: 'header' },
                { value: 'Monto', style: 'header' },
                { value: 'Fecha Emisión', style: 'header' },
                { value: 'Fecha Vencimiento', style: 'header' },
                { value: 'Estado', style: 'header' },
                { value: 'Días para Vencer', style: 'header' }
            ]
        ];
        garantias.forEach(garantia => {
            datos.push([
                { value: garantia.obraNombre },
                { value: garantia.tipoGarantia },
                { value: garantia.entidadEmisora },
                { value: garantia.montoGarantia, style: 'currency' },
                { value: garantia.fechaEmision },
                { value: garantia.fechaVencimiento },
                { value: garantia.estado },
                { value: garantia.diasParaVencer }
            ]);
        });
        return datos;
    }
    static crearHojaAdicionales(adicionales) {
        const datos = [
            [
                { value: 'Obra', style: 'header' },
                { value: 'Tipo', style: 'header' },
                { value: 'Concepto', style: 'header' },
                { value: 'Monto Original', style: 'header' },
                { value: 'Monto Aprobado', style: 'header' },
                { value: 'Fecha Solicitud', style: 'header' },
                { value: 'Fecha Aprobación', style: 'header' },
                { value: 'Estado', style: 'header' }
            ]
        ];
        adicionales.forEach(ad => {
            datos.push([
                { value: ad.obraNombre },
                { value: ad.tipo },
                { value: ad.concepto },
                { value: ad.montoOriginal, style: 'currency' },
                { value: ad.montoAprobado, style: 'currency' },
                { value: ad.fechaSolicitud },
                { value: ad.fechaAprobacion },
                { value: ad.estado }
            ]);
        });
        return datos;
    }
    static crearHojaPenalidades(penalidades) {
        const datos = [
            [
                { value: 'Obra', style: 'header' },
                { value: 'Tipo Incumplimiento', style: 'header' },
                { value: 'Fecha Incumplimiento', style: 'header' },
                { value: 'Monto Calculado', style: 'header' },
                { value: 'Monto Aplicado', style: 'header' },
                { value: 'Estado Aplicación', style: 'header' },
                { value: 'Observaciones', style: 'header' }
            ]
        ];
        penalidades.forEach(pen => {
            datos.push([
                { value: pen.obraNombre },
                { value: pen.tipoIncumplimiento },
                { value: pen.fechaIncumplimiento },
                { value: pen.montoCalculado, style: 'currency' },
                { value: pen.montoAplicado, style: 'currency' },
                { value: pen.estadoAplicacion },
                { value: pen.observaciones || '' }
            ]);
        });
        return datos;
    }
    static crearHojaKPIs(datos) {
        return [
            [{ value: 'INDICADORES CLAVE DE RENDIMIENTO (KPIs)', style: 'header' }],
            [],
            [{ value: 'Inversión Total:', style: 'label' }, { value: datos.kpisPrincipales.inversionTotal, style: 'currency' }],
            [{ value: 'Avance General:', style: 'label' }, { value: datos.kpisPrincipales.avanceGeneral, style: 'percentage' }],
            [{ value: 'Obras en Ejecución:', style: 'label' }, { value: datos.kpisPrincipales.obrasEnEjecucion }],
            [{ value: 'Eficiencia Presupuestal:', style: 'label' }, { value: datos.kpisPrincipales.eficienciaPresupuestal, style: 'percentage' }],
            [{ value: 'Índice de Cumplimiento:', style: 'label' }, { value: datos.kpisPrincipales.indiceCumplimiento, style: 'percentage' }],
            [{ value: 'Satisfacción Supervisión:', style: 'label' }, { value: `${datos.kpisPrincipales.satisfaccionSupervision}/5` }],
            [],
            [{ value: 'ESTADO DE OBRAS', style: 'subheader' }],
            ...Object.entries(datos.estadoObras).map(([estado, cantidad]) => [
                { value: estado.replace('_', ' ') + ':', style: 'label' },
                { value: cantidad }
            ])
        ];
    }
    static crearHojaDistribucion(distribucion) {
        const datos = [
            [
                { value: 'Categoría', style: 'header' },
                { value: 'Monto', style: 'header' },
                { value: 'Porcentaje', style: 'header' }
            ]
        ];
        distribucion.forEach(item => {
            datos.push([
                { value: item.categoria },
                { value: item.monto, style: 'currency' },
                { value: item.porcentaje, style: 'percentage' }
            ]);
        });
        return datos;
    }
    static crearHojaRanking(ranking) {
        const datos = [
            [
                { value: 'Posición', style: 'header' },
                { value: 'Contratista', style: 'header' },
                { value: 'Obras en Ejecución', style: 'header' },
                { value: 'Monto Total', style: 'header' },
                { value: 'Promedio Avance', style: 'header' },
                { value: 'Índice Cumplimiento', style: 'header' },
                { value: 'Penalidades', style: 'header' },
                { value: 'Calificación', style: 'header' },
                { value: 'Tendencia', style: 'header' }
            ]
        ];
        ranking.forEach((contratista, index) => {
            datos.push([
                { value: index + 1 },
                { value: contratista.nombre },
                { value: contratista.obrasEnEjecucion },
                { value: contratista.montoTotal, style: 'currency' },
                { value: contratista.promedioAvance, style: 'percentage' },
                { value: contratista.indiceCumplimiento, style: 'percentage' },
                { value: contratista.penalidades },
                { value: contratista.calificacionDesempeño },
                { value: contratista.tendencia }
            ]);
        });
        return datos;
    }
    static crearHojaRiesgos(riesgos) {
        const datos = [
            [
                { value: 'Categoría', style: 'header' },
                { value: 'Descripción', style: 'header' },
                { value: 'Probabilidad', style: 'header' },
                { value: 'Impacto', style: 'header' },
                { value: 'Nivel', style: 'header' },
                { value: 'Medida Preventiva', style: 'header' }
            ]
        ];
        riesgos.forEach(riesgo => {
            datos.push([
                { value: riesgo.categoria },
                { value: riesgo.descripcion },
                { value: riesgo.probabilidad, style: 'percentage' },
                { value: riesgo.impacto, style: 'percentage' },
                { value: riesgo.nivel },
                { value: riesgo.medidaPreventiva }
            ]);
        });
        return datos;
    }
    static crearHojaTendenciasRegion(tendencias) {
        const datos = [
            [
                { value: 'Región', style: 'header' },
                { value: 'Obras Activas', style: 'header' },
                { value: 'Inversión', style: 'header' },
                { value: 'Avance Promedio', style: 'header' },
                { value: 'Problemas', style: 'header' }
            ]
        ];
        tendencias.forEach(tend => {
            datos.push([
                { value: tend.region },
                { value: tend.obrasActivas },
                { value: tend.inversion, style: 'currency' },
                { value: tend.avancePromedio, style: 'percentage' },
                { value: tend.problemas }
            ]);
        });
        return datos;
    }
}
export default ExportadorExcel;
