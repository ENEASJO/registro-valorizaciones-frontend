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
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Activity,
  Award,
  ArrowUp,
  ArrowDown,
  MinusCircle
} from 'lucide-react';
import type { DatosReporteAvanceObra, FiltrosReporte } from '../../../types/reporte.types';

interface ReporteAvanceObraProps {
  datos: DatosReporteAvanceObra;
  filtros: FiltrosReporte;
}

const ReporteAvanceObra: React.FC<ReporteAvanceObraProps> = ({ datos, filtros }) => {
  // Configuración de colores para gráficos
  const colores = {
    programado: '#3B82F6',
    real: '#10B981',
    critico: '#EF4444',
    alerta: '#F59E0B',
    exito: '#10B981',
    neutro: '#6B7280',
    info: '#06B6D4'
  };

  // Datos para la Curva S
  const datosCurvaS = datos.cronograma.map((item, index) => ({
    periodo: item.periodo,
    avanceProgramado: item.acumuladoProgramado,
    avanceReal: item.acumuladoReal,
    meta: index === 0 ? item.acumuladoProgramado : undefined,
    proyeccion: index > 0 ? item.acumuladoReal + ((item.acumuladoProgramado - item.acumuladoReal) * 0.8) : undefined
  }));

  // Datos para análisis de desviaciones
  const datosDesviaciones = datos.cronograma.map(item => ({
    periodo: item.periodo,
    desviacion: item.acumuladoReal - item.acumuladoProgramado,
    programado: item.acumuladoProgramado,
    real: item.acumuladoReal
  }));

  // Datos para timeline de hitos
  const hitosTimeline = [
    { hito: 'Inicio de Obra', fecha: datos.obra.fechaInicio, estado: 'completado', avance: 0 },
    { hito: 'Primera Valorización', fecha: '2025-02-01', estado: 'completado', avance: 9.8 },
    { hito: 'Avance 25%', fecha: '2025-04-15', estado: 'programado', avance: 25 },
    { hito: 'Avance 50%', fecha: '2025-07-15', estado: 'programado', avance: 50 },
    { hito: 'Avance 75%', fecha: '2025-10-15', estado: 'programado', avance: 75 },
    { hito: 'Término de Obra', fecha: datos.obra.fechaFinPrevista, estado: 'programado', avance: 100 }
  ];

  // Función para determinar el ícono de tendencia
  const iconoTendencia = (valor: number) => {
    if (valor > 0) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (valor < 0) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <MinusCircle className="w-4 h-4 text-gray-600" />;
  };

  // Función para formatear números como porcentaje
  const formatearPorcentaje = (valor: number) => `${valor.toFixed(1)}%`;

  // Función para formatear números como moneda
  const formatearMoneda = (valor: number) => 
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(valor);

  // Custom tooltip para gráficos
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`Periodo: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatearPorcentaje(entry.value)}`}
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
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Reporte de Avance de Obra</h2>
            <p className="text-blue-100 mt-1">
              {datos.obra.nombre} - {filtros.fechaInicio} al {filtros.fechaFin}
            </p>
            <p className="text-blue-200 text-sm mt-1">
              Contrato: {datos.obra.numeroContrato}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{formatearPorcentaje(datos.avance.fisicoReal)}</div>
            <div className="text-sm text-blue-100">Avance Real</div>
          </div>
        </div>
      </motion.div>

      {/* KPIs Principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avance Físico</p>
              <p className="text-2xl font-bold text-blue-600">{formatearPorcentaje(datos.avance.fisicoReal)}</p>
              <div className="flex items-center mt-1 text-sm">
                {iconoTendencia(datos.avance.desviacionFisica)}
                <span className={`ml-1 ${datos.avance.desviacionFisica >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatearPorcentaje(Math.abs(datos.avance.desviacionFisica))}
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avance Económico</p>
              <p className="text-2xl font-bold text-green-600">{formatearPorcentaje(datos.avance.economicoReal)}</p>
              <div className="flex items-center mt-1 text-sm">
                {iconoTendencia(datos.avance.desviacionEconomica)}
                <span className={`ml-1 ${datos.avance.desviacionEconomica >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatearPorcentaje(Math.abs(datos.avance.desviacionEconomica))}
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Días Transcurridos</p>
              <p className="text-2xl font-bold text-amber-600">{datos.obra.diasTranscurridos}</p>
              <p className="text-sm text-gray-500 mt-1">
                de {datos.obra.diasTranscurridos + datos.obra.diasRestantes} días
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estado del Proyecto</p>
              <p className={`text-2xl font-bold ${
                datos.avance.tendenciaTermino === 'EN_TIEMPO' ? 'text-green-600' :
                datos.avance.tendenciaTermino === 'ADELANTADO' ? 'text-blue-600' : 'text-red-600'
              }`}>
                {datos.avance.tendenciaTermino === 'EN_TIEMPO' ? 'A Tiempo' :
                 datos.avance.tendenciaTermino === 'ADELANTADO' ? 'Adelantado' : 'Atrasado'}
              </p>
              {datos.avance.diasAtrasoProyectado > 0 && (
                <p className="text-sm text-red-600 mt-1">
                  +{datos.avance.diasAtrasoProyectado} días proyectado
                </p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${
              datos.avance.tendenciaTermino === 'EN_TIEMPO' ? 'bg-green-100' :
              datos.avance.tendenciaTermino === 'ADELANTADO' ? 'bg-blue-100' : 'bg-red-100'
            }`}>
              {datos.avance.tendenciaTermino === 'EN_TIEMPO' ? 
                <CheckCircle className="w-6 h-6 text-green-600" /> :
                datos.avance.tendenciaTermino === 'ADELANTADO' ?
                <Award className="w-6 h-6 text-blue-600" /> :
                <Clock className="w-6 h-6 text-red-600" />
              }
            </div>
          </div>
        </div>
      </motion.div>

      {/* Curva S - Gráfico Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Curva S - Avance Programado vs Real</h3>
          <p className="text-sm text-gray-600">
            Comparación del avance físico programado contra el avance real ejecutado
          </p>
        </div>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={datosCurvaS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="periodo" 
                stroke="#666"
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickFormatter={formatearPorcentaje}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Área de proyección */}
              <Area
                type="monotone"
                dataKey="proyeccion"
                fill={colores.programado}
                fillOpacity={0.1}
                stroke="none"
                name="Proyección"
              />
              
              {/* Línea programada */}
              <Line
                type="monotone"
                dataKey="avanceProgramado"
                stroke={colores.programado}
                strokeWidth={3}
                dot={{ fill: colores.programado, strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
                name="Avance Programado"
              />
              
              {/* Línea real */}
              <Line
                type="monotone"
                dataKey="avanceReal"
                stroke={colores.real}
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: colores.real, strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
                name="Avance Real"
              />
              
              {/* Línea de referencia en 100% */}
              <ReferenceLine y={100} stroke="#e0e0e0" strokeDasharray="2 2" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Análisis de Desviaciones */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis de Desviaciones</h3>
            <p className="text-sm text-gray-600">
              Diferencia entre el avance programado y el real por periodo
            </p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosDesviaciones}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="periodo" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={formatearPorcentaje}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [formatearPorcentaje(value), name]}
                  labelFormatter={(label) => `Periodo: ${label}`}
                />
                <Bar
                  dataKey="desviacion"
                  fill={colores.info}
                  name="Desviación (%)"
                  radius={[2, 2, 0, 0]}
                />
                <ReferenceLine y={0} stroke="#666" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Timeline de Hitos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Timeline de Hitos</h3>
            <p className="text-sm text-gray-600">
              Cronograma de hitos principales del proyecto
            </p>
          </div>
          
          <div className="space-y-4">
            {hitosTimeline.map((hito, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                  hito.estado === 'completado' ? 'bg-green-500' :
                  hito.estado === 'en-proceso' ? 'bg-blue-500' :
                  'bg-gray-300'
                }`} />
                <div className={`h-px flex-1 ${
                  index < hitosTimeline.length - 1 ? 'bg-gray-200' : 'transparent'
                }`} />
                <div className="flex-shrink-0 text-right">
                  <div className="font-medium text-sm text-gray-900">{hito.hito}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(hito.fecha).toLocaleDateString('es-PE')}
                  </div>
                  <div className="text-xs font-medium text-blue-600">
                    {formatearPorcentaje(hito.avance)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Alertas y Recomendaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
              Alertas de Proyecto
            </h3>
            <p className="text-sm text-gray-600">
              Situaciones que requieren atención inmediata
            </p>
          </div>
          
          <div className="space-y-4">
            {datos.alertas.map((alerta) => (
              <div
                key={alerta.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alerta.criticidad === 'CRITICO' ? 'border-red-500 bg-red-50' :
                  alerta.criticidad === 'ALTO' ? 'border-amber-500 bg-amber-50' :
                  alerta.criticidad === 'MEDIO' ? 'border-blue-500 bg-blue-50' :
                  'border-green-500 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{alerta.titulo}</h4>
                    <p className="text-sm text-gray-600 mb-2">{alerta.descripcion}</p>
                    {alerta.accionRequerida && (
                      <p className="text-sm font-medium text-blue-600">
                        Acción: {alerta.accionRequerida}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    alerta.criticidad === 'CRITICO' ? 'bg-red-100 text-red-800' :
                    alerta.criticidad === 'ALTO' ? 'bg-amber-100 text-amber-800' :
                    alerta.criticidad === 'MEDIO' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alerta.criticidad}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Detectado: {new Date(alerta.fechaDeteccion).toLocaleDateString('es-PE')}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recomendaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Target className="w-5 h-5 text-blue-500 mr-2" />
              Recomendaciones
            </h3>
            <p className="text-sm text-gray-600">
              Acciones sugeridas para mejorar el desempeño
            </p>
          </div>
          
          <div className="space-y-4">
            {datos.recomendaciones.map((recomendacion) => (
              <div
                key={recomendacion.id}
                className="p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{recomendacion.titulo}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    recomendacion.prioridad === 'ALTA' ? 'bg-red-100 text-red-800' :
                    recomendacion.prioridad === 'MEDIA' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {recomendacion.prioridad}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{recomendacion.descripcion}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {recomendacion.beneficioEsperado && (
                    <div>
                      <span className="font-medium text-green-600">Beneficio:</span>
                      <p className="text-gray-600">{recomendacion.beneficioEsperado}</p>
                    </div>
                  )}
                  {recomendacion.responsable && (
                    <div>
                      <span className="font-medium text-blue-600">Responsable:</span>
                      <p className="text-gray-600">{recomendacion.responsable}</p>
                    </div>
                  )}
                </div>
                
                {recomendacion.plazoEjecucion && (
                  <div className="mt-2 text-xs">
                    <span className="font-medium text-purple-600">Plazo:</span>
                    <span className="text-gray-600 ml-1">{recomendacion.plazoEjecucion}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Estado de Valorizaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Estado de Valorizaciones</h3>
          <p className="text-sm text-gray-600">
            Seguimiento de valorizaciones presentadas y programadas
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">#</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha Programada</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha Real</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Monto</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Atraso</th>
              </tr>
            </thead>
            <tbody>
              {datos.valorizaciones.map((val, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{val.numero}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(val.fechaProgramada).toLocaleDateString('es-PE')}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {val.fechaReal ? new Date(val.fechaReal).toLocaleDateString('es-PE') : '-'}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {formatearMoneda(val.monto)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      val.estado === 'APROBADA' ? 'bg-green-100 text-green-800' :
                      val.estado === 'PRESENTADA' ? 'bg-blue-100 text-blue-800' :
                      val.estado === 'PROGRAMADA' ? 'bg-gray-100 text-gray-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {val.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {val.diasAtraso > 0 ? (
                      <span className="text-red-600 font-medium">+{val.diasAtraso} días</span>
                    ) : (
                      <span className="text-green-600 font-medium">A tiempo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Footer del Reporte */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center text-sm text-gray-600"
      >
        <p>
          Reporte generado el {new Date().toLocaleDateString('es-PE')} a las {new Date().toLocaleTimeString('es-PE')}
        </p>
        <p className="mt-1">
          Sistema de Gestión de Valorizaciones - Avance de Obra
        </p>
      </motion.div>
    </div>
  );
};

export default ReporteAvanceObra;