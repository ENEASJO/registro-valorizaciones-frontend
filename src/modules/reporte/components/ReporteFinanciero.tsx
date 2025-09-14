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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Target,
  AlertCircle,
  CheckCircle,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Calculator,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import type { DatosReporteFinanciero, FiltrosReporte } from '../../../types/reporte.types';

interface ReporteFinancieroProps {
  datos: DatosReporteFinanciero;
  filtros: FiltrosReporte;
}

const ReporteFinanciero: React.FC<ReporteFinancieroProps> = ({ datos, filtros }) => {
  // Configuración de colores para gráficos
  const colores = {
    ingresos: '#10B981',
    egresos: '#EF4444',
    saldo: '#3B82F6',
    proyeccion: '#F59E0B',
    objetivo: '#8B5CF6',
    critico: '#EF4444',
    alerta: '#F59E0B',
    exito: '#10B981',
    neutro: '#6B7280'
  };

  // Datos para flujo de efectivo
  const datosFlujoCaja = datos.flujoEfectivo.map(item => ({
    ...item,
    saldoPositivo: item.saldo > 0 ? item.saldo : 0,
    saldoNegativo: item.saldo < 0 ? Math.abs(item.saldo) : 0
  }));

  // Datos para distribución de deducciones
  const datosDeduccionesChart = [
    { name: 'Adelantos Directos', value: datos.deducciones.adelantosDirectos, color: colores.critico },
    { name: 'Adelantos Materiales', value: datos.deducciones.adelantosMateriales, color: colores.alerta },
    { name: 'Retención Garantía', value: datos.deducciones.retencionesGarantia, color: colores.ingresos },
    { name: 'Penalidades', value: datos.deducciones.penalidades, color: colores.neutro },
    { name: 'Otras', value: datos.deducciones.otras, color: colores.saldo }
  ].filter(item => item.value > 0);

  // Datos para análisis de liquidez
  const datosLiquidez = datos.proyecciones.liquidezProyectada.map(item => ({
    periodo: item.periodo,
    disponible: item.disponible / 1000, // Convertir a miles
    requerido: item.requerido / 1000,
    gap: item.gap / 1000,
    gapPositivo: item.gap > 0 ? item.gap / 1000 : 0,
    gapNegativo: item.gap < 0 ? Math.abs(item.gap) / 1000 : 0
  }));

  // Función para formatear números como moneda
  const formatearMoneda = (valor: number) => 
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 0 }).format(valor);

  // Función para formatear números como porcentaje
  const formatearPorcentaje = (valor: number) => `${valor.toFixed(1)}%`;

  // Función para formatear números con separadores de miles
  const formatearNumero = (valor: number) => 
    new Intl.NumberFormat('es-PE', { minimumFractionDigits: 0 }).format(valor);

  // Función para determinar el color de tendencia
  const obtenerColorTendencia = (valor: number) => {
    if (valor > 0) return 'text-green-600';
    if (valor < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Custom tooltip para gráficos de moneda
  const TooltipMoneda = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatearMoneda(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip para análisis de liquidez
  const TooltipLiquidez = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`Periodo: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatearMoneda(entry.value * 1000)}`}
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
        className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Reporte Financiero Consolidado</h2>
            <p className="text-green-100 mt-1">
              Análisis integral de la situación financiera - {filtros.fechaInicio} al {filtros.fechaFin}
            </p>
            <p className="text-green-200 text-sm mt-1">
              Inversión Total: {formatearMoneda(datos.resumenEjecutivo.inversionTotal)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{formatearPorcentaje(datos.resumenEjecutivo.porcentajeEjecucion)}</div>
            <div className="text-sm text-green-100">Ejecución Presupuestal</div>
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
              <p className="text-sm text-gray-600">Inversión Ejecutada</p>
              <p className="text-2xl font-bold text-green-600">
                {formatearMoneda(datos.resumenEjecutivo.inversionEjecutada)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatearPorcentaje(datos.resumenEjecutivo.porcentajeEjecucion)} del total
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Saldo por Ejecutar</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatearMoneda(datos.resumenEjecutivo.saldoPorEjecutar)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatearPorcentaje(100 - datos.resumenEjecutivo.porcentajeEjecucion)} restante
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Obras Activas</p>
              <p className="text-2xl font-bold text-purple-600">{datos.resumenEjecutivo.obrasActivas}</p>
              <p className="text-sm text-gray-500 mt-1">
                {datos.resumenEjecutivo.obrasTerminadas} terminadas
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChartIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">ROI</p>
              <p className="text-2xl font-bold text-amber-600">{formatearPorcentaje(datos.indicadores.roi)}</p>
              <p className="text-sm text-gray-500 mt-1">
                TIR: {formatearPorcentaje(datos.indicadores.tir)}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resumen Ejecutivo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <DollarSign className="w-5 h-5 text-green-600 mr-2" />
            Resumen Ejecutivo de Inversión
          </h3>
          <p className="text-sm text-gray-600">
            Indicadores clave del estado financiero del portafolio de obras
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Inversión Total</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Programado:</span>
                <span className="font-medium text-blue-900">
                  {formatearMoneda(datos.resumenEjecutivo.inversionTotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Ejecutado:</span>
                <span className="font-medium text-blue-900">
                  {formatearMoneda(datos.resumenEjecutivo.inversionEjecutada)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Por Ejecutar:</span>
                <span className="font-medium text-blue-900">
                  {formatearMoneda(datos.resumenEjecutivo.saldoPorEjecutar)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-3">Estado de Obras</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-700">En Ejecución:</span>
                <span className="font-medium text-green-900">{datos.resumenEjecutivo.obrasActivas}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Terminadas:</span>
                <span className="font-medium text-green-900">{datos.resumenEjecutivo.obrasTerminadas}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Paralizadas:</span>
                <span className="font-medium text-green-900">{datos.resumenEjecutivo.obrasParalizadas}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-3">Indicadores</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-amber-700">Monto Promedio:</span>
                <span className="font-medium text-amber-900">
                  {formatearMoneda(datos.resumenEjecutivo.montoPromedioPorObra)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-amber-700">Eficiencia:</span>
                <span className="font-medium text-amber-900">
                  {formatearPorcentaje(datos.resumenEjecutivo.porcentajeEjecucion)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-amber-700">Ciclo Efectivo:</span>
                <span className="font-medium text-amber-900">{datos.indicadores.cicloEfectivo} días</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Flujo de Efectivo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Flujo de Efectivo Histórico</h3>
          <p className="text-sm text-gray-600">
            Análisis de ingresos, egresos y saldo neto por periodo
          </p>
        </div>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={datosFlujoCaja}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="periodo" 
                stroke="#666"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => formatearNumero(value / 1000) + 'k'}
              />
              <Tooltip content={<TooltipMoneda />} />
              <Legend />
              
              {/* Barras de ingresos */}
              <Bar
                dataKey="ingresos"
                fill={colores.ingresos}
                name="Ingresos"
                radius={[2, 2, 0, 0]}
              />
              
              {/* Barras de egresos */}
              <Bar
                dataKey="egresos"
                fill={colores.egresos}
                name="Egresos"
                radius={[2, 2, 0, 0]}
              />
              
              {/* Línea de saldo */}
              <Line
                type="monotone"
                dataKey="saldo"
                stroke={colores.saldo}
                strokeWidth={3}
                dot={{ fill: colores.saldo, strokeWidth: 2, r: 5 }}
                name="Saldo Neto"
              />
              
              {/* Línea de acumulado */}
              <Line
                type="monotone"
                dataKey="acumulado"
                stroke={colores.proyeccion}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: colores.proyeccion, strokeWidth: 2, r: 4 }}
                name="Acumulado"
              />
              
              <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Análisis de Liquidez */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis de Liquidez Proyectada</h3>
            <p className="text-sm text-gray-600">
              Comparación entre recursos disponibles y requerimientos futuros
            </p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosLiquidez}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="periodo" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => formatearNumero(value) + 'k'}
                />
                <Tooltip content={<TooltipLiquidez />} />
                <Legend />
                
                <Bar dataKey="disponible" fill={colores.ingresos} name="Disponible" />
                <Bar dataKey="requerido" fill={colores.egresos} name="Requerido" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {datosLiquidez.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.periodo}:</span>
                <span className={`font-medium ${
                  item.gap > 0 ? 'text-green-600' : item.gap < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {item.gap > 0 ? '+' : ''}{formatearMoneda(item.gap * 1000)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Distribución de Deducciones */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Distribución de Deducciones</h3>
            <p className="text-sm text-gray-600">
              Composición de las deducciones aplicadas en el periodo
            </p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosDeduccionesChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosDeduccionesChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatearMoneda(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">
                Total: {formatearMoneda(datos.deducciones.total)}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {datosDeduccionesChart.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatearMoneda(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Estado de Pagos por Obra */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Estado de Pagos por Obra</h3>
          <p className="text-sm text-gray-600">
            Situación financiera detallada de cada proyecto en ejecución
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Obra</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Monto Contratado</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Ejecutado</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Pagado</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Saldo Pendiente</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Prom. Aprobación</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Prom. Pago</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Estado</th>
              </tr>
            </thead>
            <tbody>
              {datos.estadoPagos.map((obra, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{obra.obraNombre}</div>
                    <div className="text-xs text-gray-500">ID: {obra.obraId}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900">
                    {formatearMoneda(obra.montoContratado)}
                  </td>
                  <td className="py-3 px-4 text-right text-blue-600 font-medium">
                    {formatearMoneda(obra.montoEjecutado)}
                  </td>
                  <td className="py-3 px-4 text-right text-green-600 font-medium">
                    {formatearMoneda(obra.montoPagado)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-medium ${
                      obra.saldoPorPagar > 0 ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {formatearMoneda(obra.saldoPorPagar)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">
                    {obra.diasPromedioAprobacion} días
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">
                    {obra.diasPromedioPago} días
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      obra.morosidad === 0 ? 'bg-green-100 text-green-800' :
                      obra.morosidad <= 5 ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {obra.morosidad === 0 ? 'Al día' : `${obra.morosidad}d atraso`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td className="py-3 px-4 font-bold text-gray-900">TOTALES</td>
                <td className="py-3 px-4 text-right font-bold text-gray-900">
                  {formatearMoneda(datos.estadoPagos.reduce((sum, obra) => sum + obra.montoContratado, 0))}
                </td>
                <td className="py-3 px-4 text-right font-bold text-blue-600">
                  {formatearMoneda(datos.estadoPagos.reduce((sum, obra) => sum + obra.montoEjecutado, 0))}
                </td>
                <td className="py-3 px-4 text-right font-bold text-green-600">
                  {formatearMoneda(datos.estadoPagos.reduce((sum, obra) => sum + obra.montoPagado, 0))}
                </td>
                <td className="py-3 px-4 text-right font-bold text-amber-600">
                  {formatearMoneda(datos.estadoPagos.reduce((sum, obra) => sum + obra.saldoPorPagar, 0))}
                </td>
                <td colSpan={3} className="py-3 px-4 text-center text-gray-600">
                  Promedio: {Math.round(datos.estadoPagos.reduce((sum, obra) => sum + obra.diasPromedioPago, 0) / datos.estadoPagos.length)} días
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>

      {/* KPIs Financieros Avanzados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <Calculator className="w-5 h-5 text-blue-600 mr-2" />
            Indicadores Financieros Avanzados
          </h3>
          <p className="text-sm text-gray-600">
            Métricas de rentabilidad, eficiencia y gestión financiera
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Rentabilidad
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">ROI:</span>
                <span className="font-bold text-purple-900">{formatearPorcentaje(datos.indicadores.roi)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">TIR:</span>
                <span className="font-bold text-purple-900">{formatearPorcentaje(datos.indicadores.tir)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">VAN:</span>
                <span className="font-bold text-purple-900">{formatearMoneda(datos.indicadores.van)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-900 mb-3 flex items-center">
              <BarChartIcon className="w-4 h-4 mr-2" />
              Eficiencia Operativa
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-700">Margen Operativo:</span>
                <span className="font-bold text-indigo-900">{formatearPorcentaje(datos.indicadores.margenOperativo)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-indigo-700">Rotación Activos:</span>
                <span className="font-bold text-indigo-900">{datos.indicadores.rotacionActivos.toFixed(1)}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-indigo-700">Ciclo Efectivo:</span>
                <span className="font-bold text-indigo-900">{datos.indicadores.cicloEfectivo} días</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
            <h4 className="font-medium text-emerald-900 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Gestión de Flujos
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-emerald-700">Flujo Mensual Prom.:</span>
                <span className="font-bold text-emerald-900">
                  {formatearMoneda(
                    datos.flujoEfectivo.reduce((sum, f) => sum + f.saldo, 0) / datos.flujoEfectivo.length
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-700">Mejor Mes:</span>
                <span className="font-bold text-emerald-900">
                  {formatearMoneda(Math.max(...datos.flujoEfectivo.map(f => f.saldo)))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-700">Tendencia:</span>
                <span className={`font-bold flex items-center ${
                  datos.flujoEfectivo[datos.flujoEfectivo.length - 1].saldo > datos.flujoEfectivo[0].saldo 
                    ? 'text-emerald-900' : 'text-red-600'
                }`}>
                  {datos.flujoEfectivo[datos.flujoEfectivo.length - 1].saldo > datos.flujoEfectivo[0].saldo ? (
                    <>Mejorando <ArrowUpRight className="w-3 h-3 ml-1" /></>
                  ) : (
                    <>Decreciendo <ArrowDownRight className="w-3 h-3 ml-1" /></>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Proyecciones Futuras */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Proyecciones de Flujo Futuro</h3>
          <p className="text-sm text-gray-600">
            Estimación de ingresos futuros basada en avance de obras y probabilidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {datos.proyecciones.flujoProyectado.map((proyeccion, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{proyeccion.periodo}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  proyeccion.probabilidad >= 0.8 ? 'bg-green-100 text-green-800' :
                  proyeccion.probabilidad >= 0.6 ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {formatearPorcentaje(proyeccion.probabilidad * 100)} prob.
                </span>
              </div>
              <p className="text-xl font-bold text-blue-600">
                {formatearMoneda(proyeccion.montoProyectado)}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Resumen de Proyecciones</h4>
          <p className="text-sm text-blue-700">
            Total proyectado (próximos 3 meses): <span className="font-bold">
              {formatearMoneda(datos.proyecciones.flujoProyectado.reduce((sum, p) => sum + p.montoProyectado, 0))}
            </span>
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Probabilidad promedio de éxito: <span className="font-bold">
              {formatearPorcentaje(datos.proyecciones.flujoProyectado.reduce((sum, p) => sum + p.probabilidad, 0) / datos.proyecciones.flujoProyectado.length * 100)}
            </span>
          </p>
        </div>
      </motion.div>

      {/* Footer del Reporte */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center text-sm text-gray-600"
      >
        <p>
          Reporte generado el {new Date().toLocaleDateString('es-PE')} a las {new Date().toLocaleTimeString('es-PE')}
        </p>
        <p className="mt-1">
          Sistema de Gestión de Valorizaciones - Análisis Financiero Consolidado
        </p>
      </motion.div>
    </div>
  );
};

export default ReporteFinanciero;