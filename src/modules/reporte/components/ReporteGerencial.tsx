import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts';
import {
  Presentation,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Users,
  Building,
  MapPin,
  Star,
  Award,
  Zap,
  Shield,
  Activity,
  Gauge,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Lightbulb,
  Settings
} from 'lucide-react';
import type { DatosReporteGerencial, FiltrosReporte } from '../../../types/reporte.types';

interface ReporteGerencialProps {
  datos: DatosReporteGerencial;
  filtros: FiltrosReporte;
}

const ReporteGerencial: React.FC<ReporteGerencialProps> = ({ datos, filtros }) => {
  // Configuración de colores para gráficos
  const colores = {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4',
    purple: '#8B5CF6',
    indigo: '#6366F1',
    emerald: '#059669',
    rose: '#F43F5E',
    slate: '#64748B'
  };

  // Datos para el radar de desempeño
  const datosRadarDesempeño = [
    { indicador: 'Cumplimiento', valor: datos.kpisPrincipales.indiceCumplimiento, max: 100 },
    { indicador: 'Eficiencia', valor: datos.kpisPrincipales.eficienciaPresupuestal, max: 100 },
    { indicador: 'Avance', valor: datos.kpisPrincipales.avanceGeneral, max: 100 },
    { indicador: 'Satisfacción', valor: datos.kpisPrincipales.satisfaccionSupervision * 20, max: 100 },
    { indicador: 'Calidad', valor: 88.5, max: 100 }, // Valor simulado
    { indicador: 'Seguridad', valor: 92.3, max: 100 } // Valor simulado
  ];

  // Datos para tendencias por región con métricas adicionales
  const datosTendenciasRegion = datos.tendenciasPorRegion.map(region => ({
    ...region,
    eficiencia: (region.avancePromedio / (region.inversion / 1000000)) * 100,
    score: region.avancePromedio * 0.4 + (region.problemas === 0 ? 30 : 30 - region.problemas * 5) + 
           (region.obrasActivas * 2)
  }));

  // Datos para matriz de riesgos
  const datosMatrizRiesgos = datos.analisisRiesgos.map(riesgo => ({
    name: riesgo.categoria,
    probabilidad: riesgo.probabilidad * 100,
    impacto: riesgo.impacto * 100,
    nivel: riesgo.nivel,
    size: Math.max(riesgo.probabilidad * riesgo.impacto * 100, 20)
  }));

  // Datos para distribución de estados de obra
  const datosEstadosObra = Object.entries(datos.estadoObras).map(([estado, cantidad]) => ({
    name: estado.replace('_', ' '),
    value: cantidad,
    color: estado === 'EN_EJECUCION' ? colores.success :
           estado === 'TERMINADA' ? colores.primary :
           estado === 'PARALIZADA' ? colores.danger :
           estado === 'CANCELADA' ? colores.slate :
           colores.warning
  }));

  // Función para formatear números como moneda
  const formatearMoneda = (valor: number) => 
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 0 }).format(valor);

  // Función para formatear números como porcentaje
  const formatearPorcentaje = (valor: number) => `${valor.toFixed(1)}%`;

  // Función para formatear números con separadores de miles
  const formatearNumero = (valor: number) => 
    new Intl.NumberFormat('es-PE', { minimumFractionDigits: 0 }).format(valor);

  // Función para determinar el ícono de tendencia
  const obtenerIconoTendencia = (tendencia: string) => {
    switch (tendencia) {
      case 'MEJORANDO': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'EMPEORANDO': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  // Función para obtener el color de calificación de desempeño
  const obtenerColorDesempeño = (calificacion: string) => {
    switch (calificacion) {
      case 'EXCELENTE': return 'bg-green-100 text-green-800 border-green-200';
      case 'BUENO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REGULAR': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'DEFICIENTE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Custom tooltip para gráficos de moneda
  const TooltipMoneda = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${typeof entry.value === 'number' && entry.value > 1000 ? 
                formatearMoneda(entry.value) : 
                formatearNumero(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header del Reporte */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Gerencial Ejecutivo</h2>
            <p className="text-indigo-100 mt-1">
              Análisis estratégico del portafolio de inversiones - {filtros.fechaInicio} al {filtros.fechaFin}
            </p>
            <p className="text-indigo-200 text-sm mt-1">
              Inversión Total: {formatearMoneda(datos.kpisPrincipales.inversionTotal)} • 
              {datos.kpisPrincipales.obrasEnEjecucion} obras activas
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{formatearPorcentaje(datos.kpisPrincipales.avanceGeneral)}</div>
            <div className="text-sm text-indigo-100">Avance General</div>
          </div>
        </div>
      </motion.div>

      {/* KPIs Principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6"
      >
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inversión Total</p>
              <p className="text-xl font-bold text-indigo-600">
                {formatearMoneda(datos.kpisPrincipales.inversionTotal)}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avance General</p>
              <p className="text-xl font-bold text-green-600">
                {formatearPorcentaje(datos.kpisPrincipales.avanceGeneral)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Obras Activas</p>
              <p className="text-xl font-bold text-purple-600">{datos.kpisPrincipales.obrasEnEjecucion}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Eficiencia Presup.</p>
              <p className="text-xl font-bold text-blue-600">
                {formatearPorcentaje(datos.kpisPrincipales.eficienciaPresupuestal)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cumplimiento</p>
              <p className="text-xl font-bold text-emerald-600">
                {formatearPorcentaje(datos.kpisPrincipales.indiceCumplimiento)}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Gauge className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satisfacción</p>
              <p className="text-xl font-bold text-amber-600">
                {datos.kpisPrincipales.satisfaccionSupervision.toFixed(1)}/5.0
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Star className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución de Inversión */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Distribución de Inversión por Sector</h3>
            <p className="text-sm text-gray-600">
              Composición del portafolio de inversiones por tipo de obra
            </p>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={datos.distribucionInversion}
                dataKey="monto"
                aspectRatio={4/3}
                stroke="#fff"
                fill="#8884d8"
              >
                {datos.distribucionInversion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Treemap>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {datos.distribucionInversion.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{item.categoria}</div>
                  <div className="text-gray-600">{formatearPorcentaje(item.porcentaje)}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Estado de Obras */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Estado de Obras</h3>
            <p className="text-sm text-gray-600">
              Distribución por estado de ejecución
            </p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosEstadosObra}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosEstadosObra.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-sm">
            {datosEstadosObra.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Análisis de Desempeño */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar de Desempeño */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Gauge className="w-5 h-5 text-blue-600 mr-2" />
              Radar de Desempeño Integral
            </h3>
            <p className="text-sm text-gray-600">
              Evaluación multidimensional del desempeño organizacional
            </p>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={datosRadarDesempeño}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="indicador" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10 }}
                  tickFormatter={formatearPorcentaje}
                />
                <Radar
                  name="Desempeño"
                  dataKey="valor"
                  stroke={colores.primary}
                  fill={colores.primary}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Score Promedio: <span className="font-bold text-blue-600">
                {formatearPorcentaje(
                  datosRadarDesempeño.reduce((sum, item) => sum + item.valor, 0) / datosRadarDesempeño.length
                )}
              </span>
            </p>
          </div>
        </motion.div>

        {/* Matriz de Riesgos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Shield className="w-5 h-5 text-red-600 mr-2" />
              Matriz de Análisis de Riesgos
            </h3>
            <p className="text-sm text-gray-600">
              Evaluación de probabilidad vs impacto de riesgos identificados
            </p>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  dataKey="probabilidad" 
                  name="Probabilidad"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  type="number" 
                  dataKey="impacto" 
                  name="Impacto"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => [`${value}%`, name]}
                  labelFormatter={(label) => `Riesgo: ${label}`}
                />
                <Scatter 
                  data={datosMatrizRiesgos} 
                  fill={colores.danger}
                  fillOpacity={0.7}
                />
                
                {/* Líneas de referencia */}
                <ReferenceLine x={50} stroke="#fbbf24" strokeDasharray="2 2" />
                <ReferenceLine y={50} stroke="#fbbf24" strokeDasharray="2 2" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-medium text-gray-700 mb-2">Leyenda de Cuadrantes:</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Alto Riesgo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-600">Riesgo Medio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Bajo Riesgo</span>
                </div>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-2">Riesgos Críticos:</p>
              <div className="space-y-1">
                {datosMatrizRiesgos
                  .filter(r => r.probabilidad > 50 && r.impacto > 50)
                  .map((riesgo, index) => (
                    <div key={index} className="text-red-600 font-medium">
                      {riesgo.name}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ranking de Contratistas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <Award className="w-5 h-5 text-gold-600 mr-2" />
            Ranking de Desempeño de Contratistas
          </h3>
          <p className="text-sm text-gray-600">
            Evaluación comparativa del desempeño de proveedores
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">#</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Contratista</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Obras</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Monto Total</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Avance Prom.</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Cumplimiento</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Penalidades</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Calificación</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {datos.rankingContratistas.map((contratista, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{contratista.nombre}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">ID: {contratista.id}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-blue-600">
                    {contratista.obrasEnEjecucion}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900">
                    {formatearMoneda(contratista.montoTotal)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, contratista.promedioAvance)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {formatearPorcentaje(contratista.promedioAvance)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-medium ${
                      contratista.indiceCumplimiento >= 90 ? 'text-green-600' :
                      contratista.indiceCumplimiento >= 75 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {formatearPorcentaje(contratista.indiceCumplimiento)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-medium ${
                      contratista.penalidades === 0 ? 'text-green-600' :
                      contratista.penalidades <= 2 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {contratista.penalidades}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                      obtenerColorDesempeño(contratista.calificacionDesempeño)
                    }`}>
                      {contratista.calificacionDesempeño}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      {obtenerIconoTendencia(contratista.tendencia)}
                      <span className="ml-1 text-xs text-gray-600">
                        {contratista.tendencia}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Tendencias por Región */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <MapPin className="w-5 h-5 text-purple-600 mr-2" />
            Análisis de Tendencias por Región
          </h3>
          <p className="text-sm text-gray-600">
            Comparativo de desempeño e inversión por zona geográfica
          </p>
        </div>

        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={datosTendenciasRegion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="region" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => formatearNumero(value)}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<TooltipMoneda />} />
              <Legend />
              
              <Bar 
                yAxisId="left"
                dataKey="inversion" 
                fill={colores.primary} 
                name="Inversión (S/)"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                yAxisId="left"
                dataKey="obrasActivas" 
                fill={colores.success} 
                name="Obras Activas"
                radius={[2, 2, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avancePromedio"
                stroke={colores.warning}
                strokeWidth={3}
                dot={{ fill: colores.warning, strokeWidth: 2, r: 6 }}
                name="Avance Promedio (%)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="score"
                stroke={colores.purple}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: colores.purple, strokeWidth: 2, r: 4 }}
                name="Score de Eficiencia"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {datosTendenciasRegion.map((region, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{region.region}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  region.problemas === 0 ? 'bg-green-100 text-green-800' :
                  region.problemas <= 2 ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {region.problemas === 0 ? 'Sin problemas' : `${region.problemas} problemas`}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Obras:</span>
                  <span className="font-medium text-gray-900 ml-1">{region.obrasActivas}</span>
                </div>
                <div>
                  <span className="text-gray-600">Avance:</span>
                  <span className="font-medium text-gray-900 ml-1">
                    {formatearPorcentaje(region.avancePromedio)}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Inversión:</span>
                  <span className="font-medium text-gray-900 ml-1">
                    {formatearMoneda(region.inversion)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Proyecciones Estratégicas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <Eye className="w-5 h-5 text-indigo-600 mr-2" />
            Proyecciones y Recomendaciones Estratégicas
          </h3>
          <p className="text-sm text-gray-600">
            Análisis prospectivo y plan de acción para el cumplimiento de objetivos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Proyecciones */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-900 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Proyecciones de Cumplimiento
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-indigo-700 text-sm">Meta Anual:</span>
                <span className="font-bold text-indigo-900">
                  {formatearPorcentaje(datos.proyeccionesEstrategicas.metaAnual)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-700 text-sm">Proyección Alcance:</span>
                <span className="font-bold text-indigo-900">
                  {formatearPorcentaje(datos.proyeccionesEstrategicas.proyeccionAlcance)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-700 text-sm">Brecha:</span>
                <span className={`font-bold ${
                  datos.proyeccionesEstrategicas.brechaEsperada >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {datos.proyeccionesEstrategicas.brechaEsperada >= 0 ? '+' : ''}
                  {formatearPorcentaje(datos.proyeccionesEstrategicas.brechaEsperada)}
                </span>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full relative"
                    style={{ width: `${Math.min(100, datos.proyeccionesEstrategicas.proyeccionAlcance)}%` }}
                  >
                    <div className="absolute right-0 top-0 h-full w-1 bg-amber-500 rounded-r-full"></div>
                  </div>
                </div>
                <p className="text-xs text-indigo-600 mt-1">
                  Avance proyectado al cierre del año
                </p>
              </div>
            </div>
          </div>

          {/* Acciones Correctivas */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-4 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Acciones Correctivas
            </h4>
            <div className="space-y-2">
              {datos.proyeccionesEstrategicas.accionesCorrectivas.map((accion, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-amber-800">{accion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Oportunidades de Mejora */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              Oportunidades de Mejora
            </h4>
            <div className="space-y-2">
              {datos.proyeccionesEstrategicas.oportunidadesMejora.map((oportunidad, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-green-800">{oportunidad}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resumen Ejecutivo Final */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-xl"
      >
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Resumen Ejecutivo</h3>
          <p className="text-gray-300 mb-4">
            Estado general del portafolio de inversiones y recomendaciones estratégicas
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {formatearPorcentaje(datos.kpisPrincipales.avanceGeneral)}
              </div>
              <div className="text-sm text-gray-300">Avance General</div>
              <div className="text-xs text-green-300 mt-1">
                {datos.kpisPrincipales.avanceGeneral >= datos.proyeccionesEstrategicas.metaAnual ? 
                  'Por encima de meta' : 'En progreso hacia meta'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {formatearPorcentaje(datos.kpisPrincipales.eficienciaPresupuestal)}
              </div>
              <div className="text-sm text-gray-300">Eficiencia Presupuestal</div>
              <div className="text-xs text-blue-300 mt-1">
                {datos.kpisPrincipales.eficienciaPresupuestal >= 95 ? 
                  'Excelente control' : 'Dentro de parámetros'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {datos.analisisRiesgos.filter(r => r.nivel === 'CRITICO').length}
              </div>
              <div className="text-sm text-gray-300">Riesgos Críticos</div>
              <div className="text-xs text-purple-300 mt-1">
                {datos.analisisRiesgos.filter(r => r.nivel === 'CRITICO').length === 0 ? 
                  'Sin riesgos críticos' : 'Requieren atención'}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-200">
              <span className="font-medium">Recomendación Principal:</span> 
              {datos.proyeccionesEstrategicas.brechaEsperada < 0 ? 
                ' Se requiere acelerar la ejecución de obras críticas para alcanzar la meta anual.' :
                ' El portafolio mantiene un desempeño satisfactorio. Continuar con el plan actual.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer del Reporte */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center text-sm text-gray-600"
      >
        <p>
          Reporte generado el {new Date().toLocaleDateString('es-PE')} a las {new Date().toLocaleTimeString('es-PE')}
        </p>
        <p className="mt-1">
          Sistema de Gestión de Valorizaciones - Dashboard Gerencial Ejecutivo
        </p>
        <p className="mt-1 text-xs">
          Información clasificada para uso interno de la Alta Dirección
        </p>
      </motion.div>
    </div>
  );
};

export default ReporteGerencial;