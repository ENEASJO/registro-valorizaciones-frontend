import { useState, useEffect, useCallback } from 'react';

export interface DashboardMetric {
  id: string;
  title: string;
  value: number | string;
  previousValue: number | string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
  format: 'number' | 'currency' | 'percentage' | 'text';
  sparklineData: number[];
}

export interface ObrasData {
  id: string;
  nombre: string;
  contratista: string;
  avance: number;
  presupuesto: number;
  estado: 'En ejecución' | 'Pausada' | 'Finalizada' | 'Retrasada';
  fechaInicio: string;
  fechaVencimiento: string;
  distrito: string;
  categoria: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface ContratistRanking {
  id: string;
  nombre: string;
  obrasCompletadas: number;
  eficiencia: number;
  valorTotal: number;
  rank: number;
  change: number;
}

export interface ValorizacionProxima {
  id: string;
  obra: string;
  contratista: string;
  monto: number;
  fechaVencimiento: Date;
  diasRestantes: number;
  estado: 'Próxima' | 'Vencida' | 'Crítica';
}

const useDashboard = () => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [currentPeriod, setCurrentPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  
  // Datos principales del dashboard
  const [metrics, setMetrics] = useState<DashboardMetric[]>([
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

  const [obras] = useState<ObrasData[]>([
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

  const [alerts, setAlerts] = useState<Alert[]>([
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

  const [contratistasRanking] = useState<ContratistRanking[]>([
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

  const [valorizacionesProximas] = useState<ValorizacionProxima[]>([
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

  // Simulación de actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Simular pequeños cambios en las métricas
      setMetrics(prev => prev.map(metric => {
        const variation = Math.random() * 0.02 - 0.01; // ±1%
        const newValue = typeof metric.value === 'number' 
          ? Math.max(0, Math.round(Number(metric.value) * (1 + variation)))
          : metric.value;
        
        return {
          ...metric,
          value: newValue,
          sparklineData: [
            ...metric.sparklineData.slice(1),
            typeof newValue === 'number' ? newValue : 0
          ]
        };
      }));
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Funciones de utilidad
  const getObrasTopmRanking = useCallback((limit: number = 5) => {
    return obras
      .sort((a, b) => b.avance - a.avance)
      .slice(0, limit);
  }, [obras]);

  const getAlertsByType = useCallback((type?: Alert['type']) => {
    return type ? alerts.filter(alert => alert.type === type) : alerts;
  }, [alerts]);

  const getUnreadAlertsCount = useCallback(() => {
    return alerts.filter(alert => !alert.read).length;
  }, [alerts]);

  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  }, []);

  const getEfficiencyGaugeData = useCallback(() => {
    const obrasEnTiempo = obras.filter(obra => obra.estado !== 'Retrasada').length;
    const totalObras = obras.length;
    if (totalObras === 0) return 0; // Evitar división por cero
    const efficiency = (obrasEnTiempo / totalObras) * 100;
    return Math.round(efficiency);
  }, [obras]);

  const getDistrictHeatMapData = useCallback(() => {
    const distritos = obras.reduce((acc, obra) => {
      const distrito = obra.distrito;
      if (!acc[distrito]) {
        acc[distrito] = { count: 0, investment: 0, efficiency: 0, tipo: '' };
      }
      
      // Determinar el tipo de localidad
      if (distrito.includes('C.P.')) {
        acc[distrito].tipo = 'Centro Poblado';
      } else if (distrito.includes('Caserío')) {
        acc[distrito].tipo = 'Caserío';
      } else if (distrito.includes('Zona Urbana')) {
        acc[distrito].tipo = 'Zona Urbana';
      }
      
      acc[distrito].count += 1;
      acc[distrito].investment += obra.presupuesto;
      acc[distrito].efficiency += obra.avance;
      return acc;
    }, {} as Record<string, { count: number; investment: number; efficiency: number; tipo: string }>);

    return Object.entries(distritos).map(([distrito, data]) => ({
      distrito,
      obras: data.count,
      inversion: data.investment,
      eficiencia: Math.round(data.efficiency / data.count),
      tipo: data.tipo
    }));
  }, [obras]);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }, []);

  const formatNumber = useCallback((value: number) => {
    return new Intl.NumberFormat('es-PE').format(value);
  }, []);

  const getTimelineData = useCallback(() => {
    return obras.map(obra => ({
      id: obra.id,
      nombre: obra.nombre,
      fechaInicio: new Date(obra.fechaInicio),
      fechaVencimiento: new Date(obra.fechaVencimiento),
      avance: obra.avance,
      estado: obra.estado,
      contratista: obra.contratista
    })).sort((a, b) => a.fechaVencimiento.getTime() - b.fechaVencimiento.getTime());
  }, [obras]);

  return {
    // Estado
    lastUpdate,
    currentPeriod,
    setCurrentPeriod,

    // Datos principales
    metrics,
    obras,
    alerts,
    contratistasRanking,
    valorizacionesProximas,
    inversionTiempo,
    distributionData,

    // Funciones de utilidad
    getObrasTopRanking: getObrasTopmRanking,
    getAlertsByType,
    getUnreadAlertsCount,
    markAlertAsRead,
    getEfficiencyGaugeData,
    getDistrictHeatMapData,
    formatCurrency,
    formatNumber,
    getTimelineData,

    // Estados calculados
    totalInversion: metrics.find(m => m.id === 'inversion-total')?.value || 0,
    obrasActivas: metrics.find(m => m.id === 'obras-activas')?.value || 0,
    eficienciaGeneral: getEfficiencyGaugeData(),
    alertasCriticas: getAlertsByType('critical').length,
    alertasNoLeidas: getUnreadAlertsCount()
  };
};

export default useDashboard;