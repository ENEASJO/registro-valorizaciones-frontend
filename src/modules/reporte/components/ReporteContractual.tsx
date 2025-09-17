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
  Cell
} from 'recharts';
import {
  FileText,
  Calendar,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Hammer,
  Eye,
  Award,
  AlertCircle
} from 'lucide-react';
import type { DatosReporteContractual, FiltrosReporte } from '../../../types/reporte.types';

interface ReporteContractualProps {
  datos: DatosReporteContractual;
  filtros: FiltrosReporte;
}

const ReporteContractual: React.FC<ReporteContractualProps> = ({ datos, filtros }) => {
  // Configuración de colores para gráficos
  const colores = {
    vigente: '#10B981',
    critico: '#EF4444',
    alerta: '#F59E0B',
    normal: '#3B82F6',
    exito: '#10B981',
    neutro: '#6B7280',
    garantia: '#8B5CF6',
    adicional: '#06B6D4'
  };

  // Datos para distribución de contratos por estado
  const datosEstadosContratos = [
    { name: 'Vigentes', value: datos.contratosVigentes.length, color: colores.vigente },
    { name: 'Por Vencer', value: datos.contratosVigentes.filter(c => c.diasRestantes <= 90).length, color: colores.alerta },
    { name: 'Críticos', value: datos.contratosVigentes.filter(c => c.diasRestantes <= 30).length, color: colores.critico }
  ].filter(item => item.value > 0);

  // Datos para timeline de vencimientos
  const vencimientosPorMes = datos.vencimientos.reduce((acc, venc) => {
    const mes = new Date(venc.fechaVencimiento).toLocaleDateString('es-PE', { month: 'short', year: 'numeric' });
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const datosVencimientos = Object.entries(vencimientosPorMes).map(([mes, cantidad]) => ({
    mes,
    cantidad,
    criticos: datos.vencimientos.filter(v => 
      new Date(v.fechaVencimiento).toLocaleDateString('es-PE', { month: 'short', year: 'numeric' }) === mes &&
      v.criticidad === 'CRITICO'
    ).length
  })).slice(0, 6);

  // Datos para distribución de garantías
  const garantiasPorTipo = datos.garantias.reduce((acc, garantia) => {
    acc[garantia.tipoGarantia] = (acc[garantia.tipoGarantia] || 0) + garantia.montoGarantia;
    return acc;
  }, {} as Record<string, number>);

  const datosGarantias = Object.entries(garantiasPorTipo).map(([tipo, monto]) => ({
    name: tipo,
    value: monto,
    color: colores.garantia
  }));

  // Función para formatear números como moneda
  const formatearMoneda = (valor: number) => 
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 0 }).format(valor);

  // Función para formatear números con separadores de miles
  const formatearNumero = (valor: number) => 
    new Intl.NumberFormat('es-PE', { minimumFractionDigits: 0 }).format(valor);

  // Función para obtener el color de criticidad
  const obtenerColorCriticidad = (criticidad: string) => {
    switch (criticidad) {
      case 'CRITICO': return 'bg-red-100 text-red-800 border-red-200';
      case 'ALTO': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIO': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'BAJO': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener el ícono de riesgo
  const obtenerIconoRiesgo = (riesgo: string) => {
    switch (riesgo) {
      case 'CRITICO': return <XCircle className="w-4 h-4" />;
      case 'ALTO': return <AlertTriangle className="w-4 h-4" />;
      case 'MEDIO': return <AlertCircle className="w-4 h-4" />;
      case 'BAJO': return <CheckCircle className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  // Custom tooltip para gráficos
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
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
        className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Reporte de Control Contractual</h2>
            <p className="text-purple-100 mt-1">
              Seguimiento integral de contratos, garantías y obligaciones - {filtros.fechaInicio} al {filtros.fechaFin}
            </p>
            <p className="text-purple-200 text-sm mt-1">
              {datos.contratosVigentes.length} contratos vigentes en seguimiento
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{datos.contratosVigentes.length}</div>
            <div className="text-sm text-purple-100">Contratos Activos</div>
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
              <p className="text-sm text-gray-600">Contratos Vigentes</p>
              <p className="text-2xl font-bold text-purple-600">{datos.contratosVigentes.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                {datos.contratosVigentes.filter(c => c.diasRestantes <= 90).length} próximos a vencer
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor Total Garantías</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatearMoneda(datos.garantias.reduce((sum, g) => sum + g.montoGarantia, 0))}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                {datos.garantias.length} garantías activas
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vencimientos Próximos</p>
              <p className="text-2xl font-bold text-amber-600">
                {datos.vencimientos.filter(v => v.diasParaVencer <= 30).length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                en los próximos 30 días
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Adicionales/Deductivos</p>
              <p className="text-2xl font-bold text-green-600">
                {formatearMoneda(datos.adicionalesDeductivos.reduce((sum, ad) => sum + ad.montoAprobado, 0))}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                {datos.adicionalesDeductivos.length} modificaciones
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Estado de Contratos Vigentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <Building className="w-5 h-5 text-purple-600 mr-2" />
            Estado de Contratos Vigentes
          </h3>
          <p className="text-sm text-gray-600">
            Situación detallada de todos los contratos en ejecución
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Contrato</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Obra</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Contratista</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Monto</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Avance</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Días Restantes</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Riesgo</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Estado</th>
              </tr>
            </thead>
            <tbody>
              {datos.contratosVigentes.map((contrato, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{contrato.numeroContrato}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      {new Date(contrato.fechaInicio).toLocaleDateString('es-PE')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 max-w-xs truncate">
                      {contrato.nombreObra}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">ID: {contrato.obraId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900">{contrato.contratista}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900">
                    {formatearMoneda(contrato.montoContrato)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, contrato.avanceFisico)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {contrato.avanceFisico.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-medium ${
                      contrato.diasRestantes <= 30 ? 'text-red-600' :
                      contrato.diasRestantes <= 90 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {contrato.diasRestantes} días
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      {new Date(contrato.fechaFinPrevista).toLocaleDateString('es-PE')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${
                      obtenerColorCriticidad(contrato.riesgoIncumplimiento)
                    }`}>
                      {obtenerIconoRiesgo(contrato.riesgoIncumplimiento)}
                      <span className="ml-1">{contrato.riesgoIncumplimiento}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {contrato.estadoContrato}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline de Vencimientos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Calendar className="w-5 h-5 text-amber-600 mr-2" />
              Timeline de Vencimientos
            </h3>
            <p className="text-sm text-gray-600">
              Distribución temporal de vencimientos próximos
            </p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosVencimientos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="mes" 
                  stroke="#666"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="cantidad" fill={colores.alerta} name="Total Vencimientos" />
                <Bar dataKey="criticos" fill={colores.critico} name="Críticos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Distribución de Garantías */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Shield className="w-5 h-5 text-blue-600 mr-2" />
              Distribución de Garantías
            </h3>
            <p className="text-sm text-gray-600">
              Composición del portafolio de garantías vigentes
            </p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosGarantias}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosGarantias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatearMoneda(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4">
            <div className="text-center mb-3">
              <p className="text-lg font-bold text-gray-900">
                Total: {formatearMoneda(datos.garantias.reduce((sum, g) => sum + g.montoGarantia, 0))}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              {datosGarantias.map((item, index) => (
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

      {/* Seguimiento de Vencimientos Críticos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <Clock className="w-5 h-5 text-red-600 mr-2" />
            Seguimiento de Vencimientos Críticos
          </h3>
          <p className="text-sm text-gray-600">
            Documentos, garantías y obligaciones que requieren atención inmediata
          </p>
        </div>

        <div className="space-y-4">
          {datos.vencimientos
            .sort((a, b) => a.diasParaVencer - b.diasParaVencer)
            .slice(0, 10)
            .map((vencimiento, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                vencimiento.diasParaVencer <= 7 ? 'border-red-500 bg-red-50' :
                vencimiento.diasParaVencer <= 30 ? 'border-amber-500 bg-amber-50' :
                vencimiento.diasParaVencer <= 60 ? 'border-blue-500 bg-blue-50' :
                'border-green-500 bg-green-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{vencimiento.descripcion}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      obtenerColorCriticidad(vencimiento.criticidad)
                    }`}>
                      {vencimiento.tipo}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {vencimiento.accionRequerida}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500 dark:text-gray-300">
                      Vence: {new Date(vencimiento.fechaVencimiento).toLocaleDateString('es-PE')}
                    </span>
                    <span className={`font-medium ${
                      vencimiento.diasParaVencer <= 7 ? 'text-red-600' :
                      vencimiento.diasParaVencer <= 30 ? 'text-amber-600' :
                      'text-blue-600'
                    }`}>
                      {vencimiento.diasParaVencer <= 0 ? 'VENCIDO' : `${vencimiento.diasParaVencer} días`}
                    </span>
                  </div>
                </div>
                <div className={`p-2 rounded-full ${
                  vencimiento.diasParaVencer <= 7 ? 'bg-red-100' :
                  vencimiento.diasParaVencer <= 30 ? 'bg-amber-100' :
                  'bg-blue-100'
                }`}>
                  {vencimiento.diasParaVencer <= 7 ? (
                    <XCircle className="w-5 h-5 text-red-600" />
                  ) : vencimiento.diasParaVencer <= 30 ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Penalidades y Adicionales/Deductivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Penalidades */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Hammer className="w-5 h-5 text-red-600 mr-2" />
              Penalidades Aplicadas
            </h3>
            <p className="text-sm text-gray-600">
              Registro de penalidades por incumplimientos contractuales
            </p>
          </div>

          {datos.penalidades.length > 0 ? (
            <div className="space-y-4">
              {datos.penalidades.map((penalidad, index) => (
                <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-red-900">{penalidad.tipoIncumplimiento}</h4>
                    <span className="text-sm font-bold text-red-600">
                      {formatearMoneda(penalidad.montoAplicado)}
                    </span>
                  </div>
                  <p className="text-sm text-red-700 mb-1">
                    Obra: {penalidad.obraNombre}
                  </p>
                  <p className="text-sm text-red-600">
                    Fecha: {new Date(penalidad.fechaIncumplimiento).toLocaleDateString('es-PE')}
                  </p>
                  {penalidad.observaciones && (
                    <p className="text-xs text-red-600 mt-1">
                      {penalidad.observaciones}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900">Sin Penalidades</h4>
              <p className="text-gray-600">No se han aplicado penalidades en el periodo</p>
            </div>
          )}
        </motion.div>

        {/* Adicionales y Deductivos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              Adicionales y Deductivos
            </h3>
            <p className="text-sm text-gray-600">
              Modificaciones contractuales aprobadas y en proceso
            </p>
          </div>

          <div className="space-y-4">
            {datos.adicionalesDeductivos.map((modificacion, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  modificacion.tipo === 'ADICIONAL' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      modificacion.tipo === 'ADICIONAL' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {modificacion.tipo}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      modificacion.estado === 'APROBADO' ? 'bg-green-100 text-green-800' :
                      modificacion.estado === 'PENDIENTE' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {modificacion.estado}
                    </span>
                  </div>
                  <span className={`text-sm font-bold ${
                    modificacion.tipo === 'ADICIONAL' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {formatearMoneda(modificacion.montoAprobado)}
                  </span>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-1">
                  {modificacion.concepto}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {modificacion.obraNombre}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-300">
                  <span>
                    Solicitado: {new Date(modificacion.fechaSolicitud).toLocaleDateString('es-PE')}
                  </span>
                  {modificacion.fechaAprobacion && (
                    <span>
                      Aprobado: {new Date(modificacion.fechaAprobacion).toLocaleDateString('es-PE')}
                    </span>
                  )}
                </div>
                
                {modificacion.montoOriginal !== modificacion.montoAprobado && (
                  <p className="text-xs text-amber-600 mt-1">
                    Monto original: {formatearMoneda(modificacion.montoOriginal)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Estado de Garantías Detallado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <Award className="w-5 h-5 text-purple-600 mr-2" />
            Estado Detallado de Garantías
          </h3>
          <p className="text-sm text-gray-600">
            Seguimiento completo de todas las garantías vigentes
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Obra</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo Garantía</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Entidad Emisora</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Monto</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Fecha Emisión</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Vencimiento</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Días Para Vencer</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Estado</th>
              </tr>
            </thead>
            <tbody>
              {datos.garantias.map((garantia, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 max-w-xs truncate">
                      {garantia.obraNombre}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">ID: {garantia.obraId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      {garantia.tipoGarantia}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {garantia.entidadEmisora}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900">
                    {formatearMoneda(garantia.montoGarantia)}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">
                    {new Date(garantia.fechaEmision).toLocaleDateString('es-PE')}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">
                    {new Date(garantia.fechaVencimiento).toLocaleDateString('es-PE')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-medium ${
                      garantia.diasParaVencer <= 30 ? 'text-red-600' :
                      garantia.diasParaVencer <= 90 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {garantia.diasParaVencer} días
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      garantia.estado === 'VIGENTE' ? 'bg-green-100 text-green-800' :
                      garantia.estado === 'POR_VENCER' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {garantia.estado}
                    </span>
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
        transition={{ delay: 0.9 }}
        className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center text-sm text-gray-600"
      >
        <p>
          Reporte generado el {new Date().toLocaleDateString('es-PE')} a las {new Date().toLocaleTimeString('es-PE')}
        </p>
        <p className="mt-1">
          Sistema de Gestión de Valorizaciones - Control Contractual y Legal
        </p>
      </motion.div>
    </div>
  );
};

export default ReporteContractual;