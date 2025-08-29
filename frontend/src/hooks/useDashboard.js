import { useState, useEffect, useCallback } from 'react';
import { useEmpresas } from './useEmpresas';
import { useObras } from './useObras';
import { useValorizaciones } from './useValorizaciones';
const useDashboard = () => {
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [currentPeriod, setCurrentPeriod] = useState('month');
    // Usar hooks de datos reales
    const { obtenerEstadisticas } = useEmpresas();
    const { obras, obtenerObras, estadisticasObras } = useObras();
    const { valorizaciones, obtenerValorizaciones, obtenerEstadisticasValorizaciones } = useValorizaciones();
    // Estado para métricas calculadas
    const [realMetrics, setRealMetrics] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    // Datos principales del dashboard - fallback
    const [metrics] = useState([
        {
            id: 'obras-activas',
            title: 'Obras Activas',
            value: 24,
            previousValue: 22,
            change: 9.09,
            changeType: 'increase',
            icon: 'Building2',
            color: 'bg-gradient-to-r from-blue-500 to-blue-600',
            format: 'number',
            sparklineData: [18, 19, 22, 21, 23, 24, 24]
        },
        {
            id: 'inversion-total',
            title: 'Inversión Total',
            value: 2850000,
            previousValue: 2500000,
            change: 14.0,
            changeType: 'increase',
            icon: 'DollarSign',
            color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
            format: 'currency',
            sparklineData: [2200000, 2300000, 2400000, 2350000, 2600000, 2800000, 2850000]
        },
        {
            id: 'valorizaciones-mes',
            title: 'Valorizaciones del Mes',
            value: 156,
            previousValue: 142,
            change: 9.86,
            changeType: 'increase',
            icon: 'FileText',
            color: 'bg-gradient-to-r from-purple-500 to-purple-600',
            format: 'number',
            sparklineData: [120, 125, 135, 140, 145, 150, 156]
        },
        {
            id: 'eficiencia-general',
            title: 'Eficiencia General',
            value: 87,
            previousValue: 82,
            change: 6.10,
            changeType: 'increase',
            icon: 'TrendingUp',
            color: 'bg-gradient-to-r from-orange-500 to-orange-600',
            format: 'percentage',
            sparklineData: [75, 78, 80, 82, 85, 86, 87]
        },
        {
            id: 'obras-completadas',
            title: 'Obras Completadas',
            value: 8,
            previousValue: 6,
            change: 33.33,
            changeType: 'increase',
            icon: 'CheckCircle',
            color: 'bg-gradient-to-r from-teal-500 to-teal-600',
            format: 'number',
            sparklineData: [4, 4, 5, 6, 6, 7, 8]
        },
        {
            id: 'dias-promedio',
            title: 'Días Promedio Valorización',
            value: 12,
            previousValue: 15,
            change: -20.0,
            changeType: 'increase', // Reducir días es bueno
            icon: 'Clock',
            color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
            format: 'number',
            sparklineData: [18, 16, 15, 14, 13, 13, 12]
        }
    ]);
    // Cargar datos reales al inicializar
    useEffect(() => {
        const cargarDatosReales = async () => {
            try {
                setLoading(true);
                // Cargar datos en paralelo
                await Promise.all([
                    obtenerObras(),
                    obtenerValorizaciones(),
                ]);
                // Obtener estadísticas
                const statsEmpresas = await obtenerEstadisticas();
                setEstadisticas(statsEmpresas);
            }
            catch (error) {
                console.error('Error cargando datos del dashboard:', error);
            }
            finally {
                setLoading(false);
            }
        };
        cargarDatosReales();
    }, []);
    // Convertir obras reales al formato del dashboard
    const obrasFormateadas = obras.map((obra) => ({
        id: obra.id?.toString() || '',
        nombre: obra.nombre,
        contratista: obra.empresa_contratista || 'No especificado',
        avance: obra.porcentaje_avance || 0,
        presupuesto: Number(obra.monto_contrato) || 0,
        estado: (obra.estado_obra === 'EJECUCION' ? 'En ejecución' :
            obra.estado_obra === 'PARALIZADA' ? 'Pausada' :
                obra.estado_obra === 'TERMINADA' ? 'Finalizada' :
                    obra.estado_obra === 'OBSERVADA' ? 'Retrasada' :
                        'En ejecución'),
        fechaInicio: obra.fecha_inicio?.split('T')[0] || new Date().toISOString().split('T')[0],
        fechaVencimiento: obra.fecha_fin_prevista?.split('T')[0] || new Date().toISOString().split('T')[0],
        distrito: obra.ubicacion || 'No especificado',
        categoria: obra.tipo_obra || 'General'
    }));
    const [obrasMock] = useState([
        {
            id: '1',
            nombre: 'Construcción Centro de Salud Huaripampa',
            contratista: 'Constructora GEMSA S.A.C.',
            avance: 75,
            presupuesto: 850000,
            estado: 'En ejecución',
            fechaInicio: '2024-01-15',
            fechaVencimiento: '2024-08-30',
            distrito: 'C.P. Huaripampa',
            categoria: 'Salud'
        },
        {
            id: '2',
            nombre: 'Mejoramiento Carretera San Marcos - Challhuayaco',
            contratista: 'Consorcio Vial Norte',
            avance: 45,
            presupuesto: 1200000,
            estado: 'En ejecución',
            fechaInicio: '2024-03-01',
            fechaVencimiento: '2024-12-15',
            distrito: 'C.P. Challhuayaco',
            categoria: 'Vías'
        },
        {
            id: '3',
            nombre: 'Parque Recreacional Barrio San Francisco',
            contratista: 'Green Spaces S.A.C.',
            avance: 90,
            presupuesto: 450000,
            estado: 'En ejecución',
            fechaInicio: '2024-02-10',
            fechaVencimiento: '2024-07-20',
            distrito: 'Zona Urbana - B. San Francisco',
            categoria: 'Recreación'
        },
        {
            id: '4',
            nombre: 'Remodelación Mercado Central San Marcos',
            contratista: 'Constructora ABC Ltda.',
            avance: 30,
            presupuesto: 680000,
            estado: 'Retrasada',
            fechaInicio: '2024-04-05',
            fechaVencimiento: '2024-10-10',
            distrito: 'Zona Urbana - Centro',
            categoria: 'Comercio'
        },
        {
            id: '5',
            nombre: 'Complejo Deportivo Gaucho',
            contratista: 'Sports Construcciones E.I.R.L.',
            avance: 60,
            presupuesto: 920000,
            estado: 'En ejecución',
            fechaInicio: '2024-01-20',
            fechaVencimiento: '2024-09-15',
            distrito: 'C.P. Gaucho',
            categoria: 'Deporte'
        },
        {
            id: '6',
            nombre: 'Sistema de Agua Potable Carhuayoc',
            contratista: 'Consorcio Hidráulico San Marcos',
            avance: 55,
            presupuesto: 1100000,
            estado: 'En ejecución',
            fechaInicio: '2024-02-20',
            fechaVencimiento: '2024-11-30',
            distrito: 'C.P. Carhuayoc',
            categoria: 'Saneamiento'
        },
        {
            id: '7',
            nombre: 'I.E. Primaria Pujun',
            contratista: 'Constructora Educativa SAC',
            avance: 80,
            presupuesto: 750000,
            estado: 'En ejecución',
            fechaInicio: '2024-01-10',
            fechaVencimiento: '2024-07-15',
            distrito: 'Caserío Pujun',
            categoria: 'Educación'
        },
        {
            id: '8',
            nombre: 'Puente Peatonal Barrio Santa Rosa',
            contratista: 'Ingeniería Civil Norte',
            avance: 40,
            presupuesto: 320000,
            estado: 'En ejecución',
            fechaInicio: '2024-03-15',
            fechaVencimiento: '2024-09-20',
            distrito: 'Zona Urbana - B. Santa Rosa',
            categoria: 'Vías'
        },
        {
            id: '9',
            nombre: 'Centro Comunal Huanico',
            contratista: 'Constructora GEMSA S.A.C.',
            avance: 65,
            presupuesto: 480000,
            estado: 'En ejecución',
            fechaInicio: '2024-02-05',
            fechaVencimiento: '2024-08-10',
            distrito: 'Caserío Huanico',
            categoria: 'Social'
        },
        {
            id: '10',
            nombre: 'Mejoramiento Plaza de Armas San Marcos',
            contratista: 'Green Spaces S.A.C.',
            avance: 95,
            presupuesto: 680000,
            estado: 'En ejecución',
            fechaInicio: '2024-01-05',
            fechaVencimiento: '2024-06-30',
            distrito: 'Zona Urbana - Centro',
            categoria: 'Recreación'
        }
    ]);
    // Usar obras reales si están disponibles, sino usar mock
    const obrasParaDashboard = obrasFormateadas.length > 0 ? obrasFormateadas : obrasMock;
    // Calcular métricas reales basadas en datos de Turso
    useEffect(() => {
        if (!loading && obras.length > 0) {
            const obrasActivas = obras.filter((obra) => obra.estado_obra === 'EJECUCION' || obra.estado_obra === 'PENDIENTE').length;
            const inversionTotal = obras.reduce((sum, obra) => sum + (Number(obra.monto_contrato) || 0), 0);
            const valorizacionesMes = valorizaciones.filter(val => {
                const fecha = new Date(val.created_at);
                const ahora = new Date();
                return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
            }).length;
            const obrasEnTiempo = obras.filter((obra) => obra.estado_obra !== 'OBSERVADA').length;
            const eficienciaGeneral = obras.length > 0 ? Math.round((obrasEnTiempo / obras.length) * 100) : 0;
            const obrasCompletadas = obras.filter((obra) => obra.estado_obra === 'TERMINADA').length;
            // Actualizar métricas reales
            setRealMetrics([
                {
                    id: 'obras-activas',
                    title: 'Obras Activas',
                    value: obrasActivas,
                    previousValue: metrics[0].previousValue,
                    change: ((obrasActivas - Number(metrics[0].previousValue)) / Number(metrics[0].previousValue)) * 100,
                    changeType: obrasActivas >= Number(metrics[0].previousValue) ? 'increase' : 'decrease',
                    icon: 'Building2',
                    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
                    format: 'number',
                    sparklineData: metrics[0].sparklineData
                },
                {
                    id: 'inversion-total',
                    title: 'Inversión Total',
                    value: inversionTotal,
                    previousValue: metrics[1].previousValue,
                    change: ((inversionTotal - Number(metrics[1].previousValue)) / Number(metrics[1].previousValue)) * 100,
                    changeType: inversionTotal >= Number(metrics[1].previousValue) ? 'increase' : 'decrease',
                    icon: 'DollarSign',
                    color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
                    format: 'currency',
                    sparklineData: metrics[1].sparklineData
                },
                {
                    id: 'valorizaciones-mes',
                    title: 'Valorizaciones del Mes',
                    value: valorizacionesMes,
                    previousValue: metrics[2].previousValue,
                    change: ((valorizacionesMes - Number(metrics[2].previousValue)) / Number(metrics[2].previousValue)) * 100,
                    changeType: valorizacionesMes >= Number(metrics[2].previousValue) ? 'increase' : 'decrease',
                    icon: 'FileText',
                    color: 'bg-gradient-to-r from-purple-500 to-purple-600',
                    format: 'number',
                    sparklineData: metrics[2].sparklineData
                },
                {
                    id: 'eficiencia-general',
                    title: 'Eficiencia General',
                    value: eficienciaGeneral,
                    previousValue: metrics[3].previousValue,
                    change: ((eficienciaGeneral - Number(metrics[3].previousValue)) / Number(metrics[3].previousValue)) * 100,
                    changeType: eficienciaGeneral >= Number(metrics[3].previousValue) ? 'increase' : 'decrease',
                    icon: 'TrendingUp',
                    color: 'bg-gradient-to-r from-orange-500 to-orange-600',
                    format: 'percentage',
                    sparklineData: metrics[3].sparklineData
                },
                {
                    id: 'obras-completadas',
                    title: 'Obras Completadas',
                    value: obrasCompletadas,
                    previousValue: metrics[4].previousValue,
                    change: ((obrasCompletadas - Number(metrics[4].previousValue)) / Number(metrics[4].previousValue)) * 100,
                    changeType: obrasCompletadas >= Number(metrics[4].previousValue) ? 'increase' : 'decrease',
                    icon: 'CheckCircle',
                    color: 'bg-gradient-to-r from-teal-500 to-teal-600',
                    format: 'number',
                    sparklineData: metrics[4].sparklineData
                },
                {
                    id: 'dias-promedio',
                    title: 'Días Promedio Valorización',
                    value: 12, // Este cálculo requiere más datos
                    previousValue: metrics[5].previousValue,
                    change: -20.0,
                    changeType: 'increase',
                    icon: 'Clock',
                    color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
                    format: 'number',
                    sparklineData: metrics[5].sparklineData
                }
            ]);
        }
    }, [obras, valorizaciones, loading]);
    const [alerts, setAlerts] = useState([
        {
            id: '1',
            type: 'critical',
            title: 'Obra con retraso crítico',
            message: 'Remodelación Mercado Central lleva 15 días de retraso',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: false
        },
        {
            id: '2',
            type: 'warning',
            title: 'Valorización pendiente',
            message: '3 valorizaciones vencen en las próximas 48 horas',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            read: false
        },
        {
            id: '3',
            type: 'info',
            title: 'Nueva obra registrada',
            message: 'Se registró la obra "Puente Peatonal Surquillo"',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            read: true
        },
        {
            id: '4',
            type: 'warning',
            title: 'Presupuesto alcanzando límite',
            message: 'Obra Centro de Salud San Juan al 95% del presupuesto',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            read: false
        }
    ]);
    const [contratistasRanking] = useState([
        {
            id: '1',
            nombre: 'Constructora GEMSA S.A.C.',
            obrasCompletadas: 12,
            eficiencia: 94,
            valorTotal: 2800000,
            rank: 1,
            change: 0
        },
        {
            id: '2',
            nombre: 'Consorcio Vial Norte',
            obrasCompletadas: 8,
            eficiencia: 91,
            valorTotal: 2200000,
            rank: 2,
            change: 1
        },
        {
            id: '3',
            nombre: 'Sports Construcciones E.I.R.L.',
            obrasCompletadas: 6,
            eficiencia: 88,
            valorTotal: 1850000,
            rank: 3,
            change: -1
        },
        {
            id: '4',
            nombre: 'Green Spaces S.A.C.',
            obrasCompletadas: 5,
            eficiencia: 86,
            valorTotal: 1200000,
            rank: 4,
            change: 0
        },
        {
            id: '5',
            nombre: 'Constructora ABC Ltda.',
            obrasCompletadas: 4,
            eficiencia: 72,
            valorTotal: 980000,
            rank: 5,
            change: 0
        }
    ]);
    const [valorizacionesProximas] = useState([
        {
            id: '1',
            obra: 'Centro de Salud San Juan',
            contratista: 'Constructora GEMSA S.A.C.',
            monto: 125000,
            fechaVencimiento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            diasRestantes: 2,
            estado: 'Próxima'
        },
        {
            id: '2',
            obra: 'Mejoramiento Av. Los Proceres',
            contratista: 'Consorcio Vial Norte',
            monto: 180000,
            fechaVencimiento: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            diasRestantes: 5,
            estado: 'Próxima'
        },
        {
            id: '3',
            obra: 'Parque Recreacional Villa El Salvador',
            contratista: 'Green Spaces S.A.C.',
            monto: 45000,
            fechaVencimiento: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            diasRestantes: 1,
            estado: 'Crítica'
        },
        {
            id: '4',
            obra: 'Complejo Deportivo Ate',
            contratista: 'Sports Construcciones E.I.R.L.',
            monto: 92000,
            fechaVencimiento: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            diasRestantes: -1,
            estado: 'Vencida'
        }
    ]);
    // Datos para gráficos
    const [inversionTiempo] = useState([
        { mes: 'Ene', presupuestado: 2200000, ejecutado: 2100000, valorizacion: 1950000 },
        { mes: 'Feb', presupuestado: 2400000, ejecutado: 2350000, valorizacion: 2200000 },
        { mes: 'Mar', presupuestado: 2600000, ejecutado: 2580000, valorizacion: 2450000 },
        { mes: 'Abr', presupuestado: 2700000, ejecutado: 2650000, valorizacion: 2580000 },
        { mes: 'May', presupuestado: 2800000, ejecutado: 2780000, valorizacion: 2720000 },
        { mes: 'Jun', presupuestado: 2850000, ejecutado: 2830000, valorizacion: 2800000 },
        { mes: 'Jul', presupuestado: 2850000, ejecutado: 2850000, valorizacion: 2850000 }
    ]);
    const [distributionData] = useState([
        { categoria: 'Salud', valor: 1250000, porcentaje: 35, obras: 8 },
        { categoria: 'Vías', valor: 980000, porcentaje: 28, obras: 6 },
        { categoria: 'Educación', valor: 650000, porcentaje: 18, obras: 4 },
        { categoria: 'Recreación', valor: 420000, porcentaje: 12, obras: 3 },
        { categoria: 'Comercio', valor: 250000, porcentaje: 7, obras: 3 }
    ]);
    // Actualización periódica de datos reales
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdate(new Date());
            // Refrescar datos reales cada 30 segundos
            if (!loading) {
                obtenerObras();
                obtenerValorizaciones();
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [loading, obtenerObras, obtenerValorizaciones]);
    // Funciones de utilidad
    const getObrasTopRanking = useCallback((limit = 5) => {
        return obrasParaDashboard
            .sort((a, b) => b.avance - a.avance)
            .slice(0, limit);
    }, [obrasParaDashboard]);
    const getAlertsByType = useCallback((type) => {
        return type ? alerts.filter(alert => alert.type === type) : alerts;
    }, [alerts]);
    const getUnreadAlertsCount = useCallback(() => {
        return alerts.filter(alert => !alert.read).length;
    }, [alerts]);
    const markAlertAsRead = useCallback((alertId) => {
        setAlerts(prev => prev.map(alert => alert.id === alertId ? { ...alert, read: true } : alert));
    }, []);
    const getEfficiencyGaugeData = useCallback(() => {
        const obrasEnTiempo = obrasParaDashboard.filter(obra => obra.estado !== 'Retrasada').length;
        const totalObras = obrasParaDashboard.length;
        if (totalObras === 0)
            return 0; // Evitar división por cero
        const efficiency = (obrasEnTiempo / totalObras) * 100;
        return Math.round(efficiency);
    }, [obrasParaDashboard]);
    const getDistrictHeatMapData = useCallback(() => {
        const distritos = obrasParaDashboard.reduce((acc, obra) => {
            const distrito = obra.distrito;
            if (!acc[distrito]) {
                acc[distrito] = { count: 0, investment: 0, efficiency: 0, tipo: '' };
            }
            // Determinar el tipo de localidad
            if (distrito.includes('C.P.')) {
                acc[distrito].tipo = 'Centro Poblado';
            }
            else if (distrito.includes('Caserío')) {
                acc[distrito].tipo = 'Caserío';
            }
            else if (distrito.includes('Zona Urbana')) {
                acc[distrito].tipo = 'Zona Urbana';
            }
            acc[distrito].count += 1;
            acc[distrito].investment += obra.presupuesto;
            acc[distrito].efficiency += obra.avance;
            return acc;
        }, {});
        return Object.entries(distritos).map(([distrito, data]) => ({
            distrito,
            obras: data.count,
            inversion: data.investment,
            eficiencia: Math.round(data.efficiency / data.count),
            tipo: data.tipo
        }));
    }, [obrasParaDashboard]);
    const formatCurrency = useCallback((value) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }, []);
    const formatNumber = useCallback((value) => {
        return new Intl.NumberFormat('es-PE').format(value);
    }, []);
    const getTimelineData = useCallback(() => {
        return obrasParaDashboard.map(obra => ({
            id: obra.id,
            nombre: obra.nombre,
            fechaInicio: new Date(obra.fechaInicio),
            fechaVencimiento: new Date(obra.fechaVencimiento),
            avance: obra.avance,
            estado: obra.estado,
            contratista: obra.contratista
        })).sort((a, b) => a.fechaVencimiento.getTime() - b.fechaVencimiento.getTime());
    }, [obrasParaDashboard]);
    return {
        // Estado
        lastUpdate,
        currentPeriod,
        setCurrentPeriod,
        // Datos principales - usar métricas reales si están disponibles
        metrics: realMetrics.length > 0 ? realMetrics : metrics,
        obras: obrasParaDashboard,
        alerts,
        contratistasRanking,
        valorizacionesProximas: (() => {
            // Generar valorizaciones próximas basadas en obras reales
            const valorizacionesProximasReales = obrasParaDashboard
                .filter(obra => obra.estado === 'En ejecución')
                .slice(0, 6)
                .map((obra, index) => {
                const diasBase = [2, 5, 1, -1, 7, 3][index] || 1;
                const fechaVencimiento = new Date();
                fechaVencimiento.setDate(fechaVencimiento.getDate() + diasBase);
                return {
                    id: obra.id,
                    obra: obra.nombre,
                    contratista: obra.contratista,
                    monto: Math.round(obra.presupuesto * 0.15), // 15% del presupuesto como valorización
                    fechaVencimiento,
                    diasRestantes: diasBase,
                    estado: (diasBase < 0 ? 'Vencida' :
                        diasBase <= 1 ? 'Crítica' :
                            'Próxima')
                };
            });
            return valorizacionesProximasReales.length > 0
                ? valorizacionesProximasReales
                : valorizacionesProximas;
        })(),
        inversionTiempo: (() => {
            if (valorizaciones.length === 0)
                return inversionTiempo;
            const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'];
            // Generar datos de los últimos 7 meses
            const datosReales = [];
            for (let i = 6; i >= 0; i--) {
                const fecha = new Date();
                fecha.setMonth(fecha.getMonth() - i);
                const mesIndex = fecha.getMonth();
                const año = fecha.getFullYear();
                const valorizacionesMes = valorizaciones.filter(val => {
                    const valFecha = new Date(val.created_at);
                    return valFecha.getMonth() === mesIndex && valFecha.getFullYear() === año;
                });
                const totalValorizado = valorizacionesMes.reduce((sum, val) => sum + (Number(val.monto_total) || 0), 0);
                // Simular presupuestado y ejecutado basado en el valorizado
                const presupuestado = totalValorizado * 1.1; // 10% más que lo valorizado
                const ejecutado = totalValorizado * 1.05; // 5% más que lo valorizado
                datosReales.push({
                    mes: meses[mesIndex],
                    presupuestado: Math.round(presupuestado),
                    ejecutado: Math.round(ejecutado),
                    valorizacion: Math.round(totalValorizado)
                });
            }
            return datosReales.length > 0 ? datosReales : inversionTiempo;
        })(),
        distributionData: (() => {
            if (obrasParaDashboard.length === 0)
                return distributionData;
            const categorias = obrasParaDashboard.reduce((acc, obra) => {
                const categoria = obra.categoria;
                if (!acc[categoria]) {
                    acc[categoria] = { valor: 0, obras: 0 };
                }
                acc[categoria].valor += obra.presupuesto;
                acc[categoria].obras += 1;
                return acc;
            }, {});
            const total = Object.values(categorias).reduce((sum, cat) => sum + cat.valor, 0);
            return Object.entries(categorias)
                .map(([categoria, data]) => ({
                categoria,
                valor: data.valor,
                porcentaje: Math.round((data.valor / total) * 100),
                obras: data.obras
            }))
                .sort((a, b) => b.valor - a.valor)
                .slice(0, 5);
        })(),
        // Funciones de utilidad
        getObrasTopRanking,
        getAlertsByType,
        getUnreadAlertsCount,
        markAlertAsRead,
        getEfficiencyGaugeData,
        getDistrictHeatMapData,
        formatCurrency,
        formatNumber,
        getTimelineData,
        // Estados calculados - usar métricas reales si están disponibles
        totalInversion: (realMetrics.length > 0 ? realMetrics : metrics).find(m => m.id === 'inversion-total')?.value || 0,
        obrasActivas: (realMetrics.length > 0 ? realMetrics : metrics).find(m => m.id === 'obras-activas')?.value || 0,
        loading,
        eficienciaGeneral: getEfficiencyGaugeData(),
        alertasCriticas: getAlertsByType('critical').length,
        alertasNoLeidas: getUnreadAlertsCount()
    };
};
export default useDashboard;
