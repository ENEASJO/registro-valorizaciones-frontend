import { useState, useCallback, useMemo } from 'react';
import { useEntidadesContratistas } from './useEmpresas';
import { useObras } from './useObras';
// Mock de reportes generados
const mockReportesGenerados = [
    {
        id: 1,
        tipo: 'VALORIZACION_MENSUAL',
        nombre: 'Valorización Enero 2025',
        descripcion: 'Reporte de valorización del mes de enero 2025',
        filtros: {
            periodo: 'MENSUAL',
            fechaInicio: '2025-01-01',
            fechaFin: '2025-01-31',
            niveLDetalle: 'COMPLETO'
        },
        opciones: {
            incluirGraficos: true,
            incluirResumenEjecutivo: true,
            incluirAnalisisComparativo: false,
            incluirRecomendaciones: true,
            incluirAnexos: false,
            incluirFotos: true,
            numerarPaginas: true
        },
        estado: 'COMPLETADO',
        fechaGeneracion: '2025-02-01T10:30:00Z',
        tiempoGeneracion: 45,
        tamaño: 2847392,
        formato: 'PDF',
        rutaArchivo: '/reportes/valorización-enero-2025.pdf',
        urlDescarga: '/api/reportes/download/1',
        numeroDescargas: 3,
        ultimaDescarga: '2025-02-01T14:20:00Z',
        usuarioSolicitante: 'admin',
        activo: true,
        created_at: '2025-02-01T10:30:00Z',
        updated_at: '2025-02-01T14:20:00Z'
    },
    {
        id: 2,
        tipo: 'GERENCIAL_EJECUTIVO',
        nombre: 'Dashboard Gerencial Q1 2025',
        descripcion: 'Reporte gerencial ejecutivo del primer trimestre 2025',
        filtros: {
            periodo: 'TRIMESTRAL',
            fechaInicio: '2025-01-01',
            fechaFin: '2025-03-31',
            niveLDetalle: 'RESUMEN'
        },
        opciones: {
            incluirGraficos: true,
            incluirResumenEjecutivo: true,
            incluirAnalisisComparativo: true,
            incluirRecomendaciones: true,
            incluirAnexos: true,
            incluirFotos: false,
            numerarPaginas: true
        },
        estado: 'COMPLETADO',
        fechaGeneracion: '2025-01-28T16:45:00Z',
        tiempoGeneracion: 120,
        tamaño: 4592847,
        formato: 'PDF',
        rutaArchivo: '/reportes/gerencial-q1-2025.pdf',
        urlDescarga: '/api/reportes/download/2',
        numeroDescargas: 8,
        ultimaDescarga: '2025-02-05T09:15:00Z',
        usuarioSolicitante: 'gerente',
        activo: true,
        created_at: '2025-01-28T16:45:00Z',
        updated_at: '2025-02-05T09:15:00Z'
    }
];
export const useReportes = () => {
    const [reportes, setReportes] = useState(mockReportesGenerados);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Hooks de datos necesarios
    const { entidades } = useEntidadesContratistas();
    const { obras } = useObras();
    // const { valorizaciones } = useValorizaciones();
    // Función para generar datos mock de valorización mensual
    const generarDatosValorizacion = useCallback((filtros) => {
        const obraSeleccionada = obras[0]; // Por simplicidad, usar primera obra
        const entidadEjecutora = entidades.find(e => e.id === obraSeleccionada?.entidad_ejecutora_id);
        const entidadSupervisora = entidades.find(e => e.id === obraSeleccionada?.entidad_supervisora_id);
        return {
            obra: {
                id: obraSeleccionada?.id || 1,
                numeroContrato: obraSeleccionada?.numero_contrato || 'N.º 001-2025-MDSM/GM',
                nombre: obraSeleccionada?.nombre || 'CONSTRUCCION DE CARRETERA PRINCIPAL',
                ubicacion: obraSeleccionada?.ubicacion || 'Distrito de Lima, Provincia de Lima',
                montoEjecucion: obraSeleccionada?.monto_ejecucion || 2500000,
                montoSupervision: obraSeleccionada?.monto_supervision || 125000,
                montoTotal: (obraSeleccionada?.monto_ejecucion || 2500000) + (obraSeleccionada?.monto_supervision || 125000),
                plazoEjecucionDias: obraSeleccionada?.plazo_ejecucion_dias || 365,
                fechaInicio: obraSeleccionada?.fecha_inicio || '2025-01-15',
                fechaFinPrevista: obraSeleccionada?.fecha_fin_prevista || '2026-01-14',
                tipoObra: obraSeleccionada?.tipo_obra || 'CARRETERA',
                modalidadEjecucion: obraSeleccionada?.modalidad_ejecucion || 'CONTRATA'
            },
            contratista: {
                nombre: entidadEjecutora?.nombre_completo || 'CONSTRUCTORA ABC S.A.C.',
                ruc: entidadEjecutora?.ruc_principal || '20123456789',
                representanteLegal: entidadEjecutora?.datos_empresa?.representante_legal || 'Juan Pérez García',
                direccion: entidadEjecutora?.datos_empresa?.direccion || 'Av. Principal 123, Lima',
                telefono: entidadEjecutora?.datos_empresa?.telefono,
                email: entidadEjecutora?.datos_empresa?.email
            },
            supervisor: {
                nombre: entidadSupervisora?.nombre_completo || 'CONSULTORES XYZ E.I.R.L.',
                ruc: entidadSupervisora?.ruc_principal || '20987654321',
                supervisorResponsable: 'Ing. María López Silva',
                direccion: entidadSupervisora?.datos_empresa?.direccion || 'Jr. Secundario 456, Lima',
                telefono: entidadSupervisora?.datos_empresa?.telefono,
                email: entidadSupervisora?.datos_empresa?.email
            },
            valorizacion: {
                numero: 1,
                periodo: 'Enero 2025',
                periodoInicio: filtros.fechaInicio,
                periodoFin: filtros.fechaFin,
                montoBruto: 245000,
                deducciones: {
                    adelantoDirecto: 24500,
                    adelantoMateriales: 12250,
                    retencionGarantia: 12250,
                    penalidades: 0,
                    otras: 0,
                    total: 49000
                },
                montoNeto: 196000,
                igv: 35280,
                montoTotal: 231280,
                avanceFisicoMensual: 9.8,
                avanceEconomicoMensual: 9.8,
                avanceFisicoAcumulado: 9.8,
                avanceEconomicoAcumulado: 9.8,
                estado: 'APROBADA',
                fechaPresentacion: '2025-02-01',
                fechaAprobacion: '2025-02-05',
                fechaPago: '2025-02-10'
            },
            partidas: [
                {
                    id: 1,
                    codigo: '01.01.01',
                    numeroOrden: 1,
                    descripcion: 'MOVIMIENTO DE TIERRAS - EXCAVACION MASIVA',
                    unidadMedida: 'm³',
                    metradoContractual: 1500.00,
                    precioUnitario: 35.50,
                    montoContractual: 53250.00,
                    metradoAnterior: 0.00,
                    metradoActual: 185.00,
                    metradoAcumulado: 185.00,
                    porcentajeAnterior: 0.00,
                    porcentajeActual: 12.33,
                    porcentajeAcumulado: 12.33,
                    montoAnterior: 0.00,
                    montoActual: 6567.50,
                    montoAcumulado: 6567.50
                },
                {
                    id: 2,
                    codigo: '01.02.01',
                    numeroOrden: 2,
                    descripcion: 'CONCRETO - CONCRETO F\'C=210 KG/CM2',
                    unidadMedida: 'm³',
                    metradoContractual: 850.00,
                    precioUnitario: 420.00,
                    montoContractual: 357000.00,
                    metradoAnterior: 0.00,
                    metradoActual: 95.00,
                    metradoAcumulado: 95.00,
                    porcentajeAnterior: 0.00,
                    porcentajeActual: 11.18,
                    porcentajeAcumulado: 11.18,
                    montoAnterior: 0.00,
                    montoActual: 39900.00,
                    montoAcumulado: 39900.00
                }
            ],
            firmas: {
                residenteObra: 'Ing. Carlos Mendoza',
                supervisorObra: 'Ing. María López Silva',
                responsableEntidad: 'Ing. Roberto Vásquez',
                fechaFirmas: '2025-02-01'
            }
        };
    }, [obras, entidades]);
    // Función para generar datos mock de avance de obra
    const generarDatosAvance = useCallback((filtros) => {
        const datosValorizacion = generarDatosValorizacion(filtros);
        const alertas = [
            {
                id: '1',
                tipo: 'RETRASO',
                criticidad: 'MEDIO',
                titulo: 'Leve retraso en cronograma',
                descripcion: 'La obra presenta un retraso de 3 días respecto al cronograma programado',
                fechaDeteccion: '2025-01-28',
                impacto: 'Posible impacto en entrega final si no se corrige',
                accionRequerida: 'Incrementar cuadrilla de trabajo'
            },
            {
                id: '2',
                tipo: 'PRESUPUESTO',
                criticidad: 'BAJO',
                titulo: 'Variación menor en costos de materiales',
                descripcion: 'Incremento del 2% en costos de cemento',
                fechaDeteccion: '2025-01-25',
                impacto: 'Impacto mínimo en presupuesto total',
                accionRequerida: 'Monitorear precios de mercado'
            }
        ];
        const recomendaciones = [
            {
                id: '1',
                categoria: 'CRONOGRAMA',
                prioridad: 'MEDIA',
                titulo: 'Optimizar secuencia de actividades',
                descripcion: 'Reorganizar actividades para recuperar tiempo perdido',
                beneficioEsperado: 'Recuperar 3 días de retraso',
                responsable: 'Residente de Obra',
                plazoEjecucion: '1 semana'
            },
            {
                id: '2',
                categoria: 'GESTION',
                prioridad: 'BAJA',
                titulo: 'Implementar control digital de metrados',
                descripcion: 'Usar herramientas digitales para mejorar precisión',
                beneficioEsperado: 'Mayor precisión en mediciones',
                responsable: 'Supervisor',
                plazoEjecucion: '2 semanas'
            }
        ];
        return {
            obra: {
                ...datosValorizacion.obra,
                estadoActual: 'EN_EJECUCION',
                diasTranscurridos: 17,
                diasRestantes: 348,
                porcentajeVigencia: 4.66
            },
            avance: {
                fisicoReal: 9.8,
                economicoReal: 9.8,
                fisicoProgramado: 10.5,
                economicoProgramado: 10.5,
                desviacionFisica: -0.7,
                desviacionEconomica: -0.7,
                tendenciaTermino: 'ATRASADO',
                fechaTerminoProyectada: '2026-01-17',
                diasAtrasoProyectado: 3
            },
            cronograma: [
                { periodo: '2025-01', avanceProgramado: 10.5, avanceReal: 9.8, acumuladoProgramado: 10.5, acumuladoReal: 9.8 },
                { periodo: '2025-02', avanceProgramado: 8.5, avanceReal: 0, acumuladoProgramado: 19.0, acumuladoReal: 9.8 },
                { periodo: '2025-03', avanceProgramado: 9.0, avanceReal: 0, acumuladoProgramado: 28.0, acumuladoReal: 9.8 }
            ],
            valorizaciones: [
                {
                    numero: 1,
                    fechaProgramada: '2025-02-01',
                    fechaReal: '2025-02-01',
                    monto: 245000,
                    estado: 'APROBADA',
                    diasAtraso: 0
                },
                {
                    numero: 2,
                    fechaProgramada: '2025-03-01',
                    monto: 190000,
                    estado: 'PROGRAMADA',
                    diasAtraso: 0
                }
            ],
            alertas,
            recomendaciones
        };
    }, [generarDatosValorizacion]);
    // Función para generar datos financieros
    const generarDatosFinancieros = useCallback(() => {
        return {
            resumenEjecutivo: {
                inversionTotal: 15750000,
                inversionEjecutada: 1547000,
                porcentajeEjecucion: 9.8,
                saldoPorEjecutar: 14203000,
                obrasActivas: 6,
                obrasTerminadas: 2,
                obrasParalizadas: 0,
                montoPromedioPorObra: 2625000
            },
            flujoEfectivo: [
                { periodo: '2024-10', ingresos: 0, egresos: 450000, saldo: -450000, acumulado: -450000 },
                { periodo: '2024-11', ingresos: 0, egresos: 380000, saldo: -380000, acumulado: -830000 },
                { periodo: '2024-12', ingresos: 0, egresos: 290000, saldo: -290000, acumulado: -1120000 },
                { periodo: '2025-01', ingresos: 245000, egresos: 320000, saldo: -75000, acumulado: -1195000 },
                { periodo: '2025-02', ingresos: 190000, egresos: 285000, saldo: -95000, acumulado: -1290000 }
            ],
            estadoPagos: [
                {
                    obraId: 1,
                    obraNombre: 'CONSTRUCCION DE CARRETERA PRINCIPAL',
                    montoContratado: 2625000,
                    montoEjecutado: 245000,
                    montoPagado: 231280,
                    saldoPorPagar: 13720,
                    valorizacionesPendientes: 0,
                    diasPromedioAprobacion: 4,
                    diasPromedioPago: 9,
                    morosidad: 0
                },
                {
                    obraId: 2,
                    obraNombre: 'MEJORAMIENTO DE SISTEMA DE AGUA POTABLE',
                    montoContratado: 1850000,
                    montoEjecutado: 185000,
                    montoPagado: 175000,
                    saldoPorPagar: 10000,
                    valorizacionesPendientes: 1,
                    diasPromedioAprobacion: 5,
                    diasPromedioPago: 12,
                    morosidad: 2
                }
            ],
            deducciones: {
                adelantosDirectos: 157500,
                adelantosMateriales: 78750,
                retencionesGarantia: 77350,
                penalidades: 0,
                otras: 5400,
                total: 319000
            },
            proyecciones: {
                flujoProyectado: [
                    { periodo: '2025-03', montoProyectado: 420000, probabilidad: 0.85 },
                    { periodo: '2025-04', montoProyectado: 380000, probabilidad: 0.80 },
                    { periodo: '2025-05', montoProyectado: 410000, probabilidad: 0.75 }
                ],
                liquidezProyectada: [
                    { periodo: '2025-03', disponible: 850000, requerido: 920000, gap: -70000 },
                    { periodo: '2025-04', disponible: 920000, requerido: 890000, gap: 30000 },
                    { periodo: '2025-05', disponible: 1050000, requerido: 980000, gap: 70000 }
                ]
            },
            indicadores: {
                roi: 12.5,
                tir: 15.8,
                van: 2850000,
                margenOperativo: 18.5,
                cicloEfectivo: 35,
                rotacionActivos: 2.1
            }
        };
    }, []);
    // Función para generar datos contractuales
    const generarDatosContractuales = useCallback(() => {
        return {
            contratosVigentes: [
                {
                    obraId: 1,
                    numeroContrato: 'N.º 001-2025-MDSM/GM',
                    nombreObra: 'CONSTRUCCION DE CARRETERA PRINCIPAL',
                    contratista: 'CONSTRUCTORA ABC S.A.C.',
                    montoContrato: 2625000,
                    fechaInicio: '2025-01-15',
                    fechaFinPrevista: '2026-01-14',
                    estadoContrato: 'VIGENTE',
                    diasRestantes: 348,
                    avanceFisico: 9.8,
                    riesgoIncumplimiento: 'BAJO'
                },
                {
                    obraId: 2,
                    numeroContrato: 'N.º 002-2025-MDSM/GM',
                    nombreObra: 'MEJORAMIENTO DE SISTEMA DE AGUA POTABLE',
                    contratista: 'INGENIERIA XYZ E.I.R.L.',
                    montoContrato: 1850000,
                    fechaInicio: '2025-01-20',
                    fechaFinPrevista: '2025-12-19',
                    estadoContrato: 'VIGENTE',
                    diasRestantes: 317,
                    avanceFisico: 10.2,
                    riesgoIncumplimiento: 'BAJO'
                }
            ],
            vencimientos: [
                {
                    tipo: 'GARANTIA',
                    descripcion: 'Garantía de Fiel Cumplimiento - Obra Carretera',
                    fechaVencimiento: '2026-04-14',
                    diasParaVencer: 438,
                    criticidad: 'BAJO',
                    accionRequerida: 'Solicitar renovación 90 días antes'
                },
                {
                    tipo: 'LICENCIA',
                    descripcion: 'Licencia de Construcción - Sistema Agua Potable',
                    fechaVencimiento: '2025-06-20',
                    diasParaVencer: 134,
                    criticidad: 'MEDIO',
                    accionRequerida: 'Gestionar renovación en 30 días'
                }
            ],
            penalidades: [],
            adicionalesDeductivos: [
                {
                    obraId: 1,
                    obraNombre: 'CONSTRUCCION DE CARRETERA PRINCIPAL',
                    tipo: 'ADICIONAL',
                    concepto: 'Mejora en especificaciones de pavimento',
                    montoOriginal: 125000,
                    montoAprobado: 125000,
                    fechaSolicitud: '2025-01-25',
                    fechaAprobacion: '2025-01-28',
                    estado: 'APROBADO'
                }
            ],
            garantias: [
                {
                    obraId: 1,
                    obraNombre: 'CONSTRUCCION DE CARRETERA PRINCIPAL',
                    tipoGarantia: 'FIEL CUMPLIMIENTO',
                    entidadEmisora: 'Banco de Crédito del Perú',
                    montoGarantia: 262500,
                    fechaEmision: '2025-01-15',
                    fechaVencimiento: '2026-04-14',
                    estado: 'VIGENTE',
                    diasParaVencer: 438
                },
                {
                    obraId: 2,
                    obraNombre: 'MEJORAMIENTO DE SISTEMA DE AGUA POTABLE',
                    tipoGarantia: 'FIEL CUMPLIMIENTO',
                    entidadEmisora: 'Banco Continental',
                    montoGarantia: 185000,
                    fechaEmision: '2025-01-20',
                    fechaVencimiento: '2026-03-20',
                    estado: 'VIGENTE',
                    diasParaVencer: 413
                }
            ]
        };
    }, []);
    // Función para generar datos gerenciales
    const generarDatosGerenciales = useCallback(() => {
        return {
            kpisPrincipales: {
                inversionTotal: 15750000,
                avanceGeneral: 9.8,
                obrasEnEjecucion: 6,
                eficienciaPresupuestal: 98.5,
                indiceCumplimiento: 85.2,
                satisfaccionSupervision: 4.3
            },
            distribucionInversion: [
                { categoria: 'Carreteras', monto: 7875000, porcentaje: 50.0, color: '#3B82F6' },
                { categoria: 'Saneamiento', monto: 3150000, porcentaje: 20.0, color: '#10B981' },
                { categoria: 'Edificaciones', monto: 2362500, porcentaje: 15.0, color: '#F59E0B' },
                { categoria: 'Electricidad', monto: 1575000, porcentaje: 10.0, color: '#EF4444' },
                { categoria: 'Otros', monto: 787500, porcentaje: 5.0, color: '#6B7280' }
            ],
            estadoObras: {
                'EN_EJECUCION': 6,
                'TERMINADA': 2,
                'PARALIZADA': 0,
                'CANCELADA': 0,
                'REGISTRADA': 1
            },
            rankingContratistas: [
                {
                    id: 1,
                    nombre: 'CONSTRUCTORA ABC S.A.C.',
                    obrasEnEjecucion: 2,
                    montoTotal: 4475000,
                    promedioAvance: 9.8,
                    indiceCumplimiento: 95.5,
                    penalidades: 0,
                    calificacionDesempeño: 'EXCELENTE',
                    tendencia: 'ESTABLE'
                },
                {
                    id: 2,
                    nombre: 'INGENIERIA XYZ E.I.R.L.',
                    obrasEnEjecucion: 2,
                    montoTotal: 3200000,
                    promedioAvance: 10.2,
                    indiceCumplimiento: 88.3,
                    penalidades: 0,
                    calificacionDesempeño: 'BUENO',
                    tendencia: 'MEJORANDO'
                }
            ],
            analisisRiesgos: [
                {
                    categoria: 'Cronograma',
                    descripcion: 'Posibles retrasos por condiciones climáticas',
                    probabilidad: 0.3,
                    impacto: 0.6,
                    nivel: 'MEDIO',
                    medidaPreventiva: 'Planificar actividades alternativas para época de lluvias'
                },
                {
                    categoria: 'Presupuesto',
                    descripcion: 'Incremento en costos de materiales',
                    probabilidad: 0.5,
                    impacto: 0.4,
                    nivel: 'MEDIO',
                    medidaPreventiva: 'Monitoreo semanal de precios y contratos marco'
                }
            ],
            tendenciasPorRegion: [
                {
                    region: 'Lima Norte',
                    obrasActivas: 3,
                    inversion: 8750000,
                    avancePromedio: 9.5,
                    problemas: 1
                },
                {
                    region: 'Lima Sur',
                    obrasActivas: 2,
                    inversion: 4250000,
                    avancePromedio: 10.1,
                    problemas: 0
                },
                {
                    region: 'Lima Este',
                    obrasActivas: 1,
                    inversion: 2750000,
                    avancePromedio: 10.8,
                    problemas: 0
                }
            ],
            proyeccionesEstrategicas: {
                metaAnual: 85.0,
                proyeccionAlcance: 82.5,
                brechaEsperada: -2.5,
                accionesCorrectivas: [
                    'Incrementar supervisión en obras críticas',
                    'Optimizar procesos de aprobación de valorizaciones',
                    'Implementar sistema de alerta temprana'
                ],
                oportunidadesMejora: [
                    'Digitalización de procesos de control',
                    'Capacitación continua del personal técnico',
                    'Implementación de metodología BIM'
                ]
            }
        };
    }, []);
    // Función principal para generar reporte
    const generarReporte = useCallback(async (solicitud) => {
        setLoading(true);
        setError(null);
        try {
            // Simular tiempo de generación
            await new Promise(resolve => setTimeout(resolve, 2000));
            const nuevoReporte = {
                id: Math.max(...reportes.map(r => r.id)) + 1,
                tipo: solicitud.tipo,
                nombre: solicitud.nombre,
                descripcion: solicitud.descripcion,
                filtros: solicitud.filtros,
                opciones: solicitud.opciones,
                estado: 'COMPLETADO',
                fechaGeneracion: new Date().toISOString(),
                tiempoGeneracion: Math.floor(Math.random() * 120) + 30,
                tamaño: Math.floor(Math.random() * 5000000) + 1000000,
                formato: solicitud.configuracionExportacion.formato,
                rutaArchivo: `/reportes/${solicitud.nombre.toLowerCase().replace(/\s+/g, '-')}.${solicitud.configuracionExportacion.formato.toLowerCase()}`,
                urlDescarga: `/api/reportes/download/${Math.max(...reportes.map(r => r.id)) + 1}`,
                numeroDescargas: 0,
                usuarioSolicitante: 'admin',
                activo: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            setReportes(prev => [...prev, nuevoReporte]);
            return nuevoReporte;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al generar reporte';
            setError(errorMessage);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [reportes]);
    // Función para obtener datos según el tipo de reporte
    const obtenerDatosReporte = useCallback((tipo, filtros) => {
        switch (tipo) {
            case 'VALORIZACION_MENSUAL':
                return generarDatosValorizacion(filtros);
            case 'AVANCE_OBRA':
                return generarDatosAvance(filtros);
            case 'FINANCIERO_CONSOLIDADO':
                return generarDatosFinancieros();
            case 'CONTROL_CONTRACTUAL':
                return generarDatosContractuales();
            case 'GERENCIAL_EJECUTIVO':
                return generarDatosGerenciales();
            default:
                throw new Error(`Tipo de reporte no soportado: ${tipo}`);
        }
    }, [generarDatosValorizacion, generarDatosAvance, generarDatosFinancieros, generarDatosContractuales, generarDatosGerenciales]);
    // Función para eliminar reporte
    const eliminarReporte = useCallback(async (id) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setReportes(prev => prev.filter(r => r.id !== id));
            return true;
        }
        catch (err) {
            setError('Error al eliminar reporte');
            return false;
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Función para descargar reporte
    const descargarReporte = useCallback(async (id) => {
        try {
            const reporte = reportes.find(r => r.id === id);
            if (!reporte) {
                throw new Error('Reporte no encontrado');
            }
            // Actualizar contador de descargas
            setReportes(prev => prev.map(r => r.id === id
                ? { ...r, numeroDescargas: r.numeroDescargas + 1, ultimaDescarga: new Date().toISOString() }
                : r));
            // Simular descarga
            await new Promise(resolve => setTimeout(resolve, 1000));
            return reporte.urlDescarga || null;
        }
        catch (err) {
            setError('Error al descargar reporte');
            return null;
        }
    }, [reportes]);
    // Configuraciones de gráficos comunes
    const configuracionesGraficos = useMemo(() => ({
        avanceMensual: {
            id: 'avance-mensual',
            tipo: 'LINE',
            titulo: 'Avance Mensual de Obras',
            datos: [
                { periodo: 'Ene', programado: 10.5, real: 9.8 },
                { periodo: 'Feb', programado: 19.0, real: 18.2 },
                { periodo: 'Mar', programado: 28.0, real: 26.8 }
            ],
            configuracion: {
                height: 300,
                colores: ['#3B82F6', '#10B981'],
                mostrarLeyenda: true,
                mostrarGrid: true,
                ejeX: { dataKey: 'periodo', label: 'Periodo' },
                ejeY: { dataKey: '', label: 'Porcentaje (%)', formato: 'porcentaje' }
            }
        },
        distribucionInversion: {
            id: 'distribucion-inversion',
            tipo: 'PIE',
            titulo: 'Distribución de Inversión por Tipo de Obra',
            datos: [
                { name: 'Carreteras', value: 50, color: '#3B82F6' },
                { name: 'Saneamiento', value: 20, color: '#10B981' },
                { name: 'Edificaciones', value: 15, color: '#F59E0B' },
                { name: 'Electricidad', value: 10, color: '#EF4444' },
                { name: 'Otros', value: 5, color: '#6B7280' }
            ],
            configuracion: {
                height: 300,
                mostrarLeyenda: true,
                formatoTooltip: 'porcentaje'
            }
        },
        flujoEfectivo: {
            id: 'flujo-efectivo',
            tipo: 'BAR',
            titulo: 'Flujo de Efectivo Mensual',
            datos: [
                { periodo: 'Oct', ingresos: 0, egresos: 450 },
                { periodo: 'Nov', ingresos: 0, egresos: 380 },
                { periodo: 'Dic', ingresos: 0, egresos: 290 },
                { periodo: 'Ene', ingresos: 245, egresos: 320 },
                { periodo: 'Feb', ingresos: 190, egresos: 285 }
            ],
            configuracion: {
                height: 300,
                colores: ['#10B981', '#EF4444'],
                mostrarLeyenda: true,
                mostrarGrid: true,
                ejeX: { dataKey: 'periodo', label: 'Mes' },
                ejeY: { dataKey: '', label: 'Miles de S/', formato: 'moneda' }
            }
        }
    }), []);
    return {
        reportes,
        loading,
        error,
        generarReporte,
        obtenerDatosReporte,
        eliminarReporte,
        descargarReporte,
        configuracionesGraficos
    };
};
// Hook específico para estadísticas de reportes
export const useEstadisticasReportes = () => {
    const { reportes } = useReportes();
    const estadisticas = useMemo(() => {
        const reportesCompletados = reportes.filter(r => r.estado === 'COMPLETADO');
        const totalDescargas = reportes.reduce((sum, r) => sum + r.numeroDescargas, 0);
        return {
            totalReportes: reportes.length,
            reportesCompletados: reportesCompletados.length,
            reportesEnProceso: reportes.filter(r => r.estado === 'GENERANDO').length,
            reportesConError: reportes.filter(r => r.estado === 'ERROR').length,
            totalDescargas,
            reporteMasDescargado: reportes.reduce((prev, current) => (prev.numeroDescargas > current.numeroDescargas) ? prev : current),
            tiempoPromedioGeneracion: reportesCompletados.reduce((sum, r) => sum + (r.tiempoGeneracion || 0), 0) / (reportesCompletados.length || 1),
            reportesPorTipo: reportes.reduce((acc, reporte) => {
                acc[reporte.tipo] = (acc[reporte.tipo] || 0) + 1;
                return acc;
            }, {})
        };
    }, [reportes]);
    return estadisticas;
};
