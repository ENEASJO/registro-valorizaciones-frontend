import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { 
  Sun, 
  Moon, 
  RefreshCw, 
  Calendar,
  Clock,
  Zap,
  Award,
  Target,
  Users,
  Activity,
  Settings
} from 'lucide-react';

// Importar componentes personalizados
import { 
  MetricCard, 
  AlertPanel, 
  PerformanceGauge, 
  TimelineObras, 
  MapaCalor 
} from './components';

// Importar hook personalizado
import useDashboard from '../../hooks/useDashboard';

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Usar el hook personalizado para obtener todos los datos
  const {
    lastUpdate,
    currentPeriod,
    setCurrentPeriod,
    metrics,
    alerts,
    contratistasRanking,
    valorizacionesProximas,
    inversionTiempo,
    distributionData,
    markAlertAsRead,
    getDistrictHeatMapData,
    formatCurrency,
    getTimelineData,
    totalInversion,
    obrasActivas,
    eficienciaGeneral,
    alertasCriticas
  } = useDashboard();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Datos para gráficos
  const timelineData = getTimelineData();
  const heatMapData = getDistrictHeatMapData();
  
  // Colores para gráfico de distribución
  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  // Función para saludar según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const containerClass = `min-h-screen transition-colors duration-300 ${
    isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
  }`;

  return (
    <div className={containerClass}>
      <div className="space-y-8 p-6">
        {/* Header espectacular */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden">
          
          {/* Background animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-10 animate-pulse" />
          
          <div className="relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              
              {/* Saludo y fecha */}
              <div className="space-y-2">
                <motion.h1 
                  className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {getGreeting()}, Administrador
                </motion.h1>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {new Date().toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}</span>
                  </div>
                </div>
              </div>

              {/* Controles */}
              <div className="flex items-center gap-3">
                {/* Filtro de período */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                  {['today', 'week', 'month', 'year'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setCurrentPeriod(period as any)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                        currentPeriod === period
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                      }`}
                    >
                      {period === 'today' && 'Hoy'}
                      {period === 'week' && 'Semana'}
                      {period === 'month' && 'Mes'}
                      {period === 'year' && 'Año'}
                    </button>
                  ))}
                </div>

                {/* Botón de actualizar */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </motion.button>

                {/* Toggle modo oscuro */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className="p-3 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-xl shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>

            {/* Quick stats en el header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
            >
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="text-xl font-bold text-blue-600">{eficienciaGeneral}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Eficiencia</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <div className="text-xl font-bold text-purple-600">{obrasActivas}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Obras Activas</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(Number(totalInversion)).replace('PEN', '').trim()}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Inversión Total</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <Activity className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <div className="text-xl font-bold text-red-600">{alertasCriticas}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Alertas Críticas</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Grid principal de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              index={index}
            />
          ))}
        </div>

        {/* Sección principal con gráficos */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Gráfico principal de inversión */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="xl:col-span-2 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Evolución de Inversión</h3>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Presupuestado</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Ejecutado</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Valorizado</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={inversionTiempo}>
                  <defs>
                    <linearGradient id="colorPresupuestado" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorEjecutado" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorValorizacion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="mes" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value) => [formatCurrency(Number(value)), '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="presupuestado"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPresupuestado)"
                  />
                  <Area
                    type="monotone"
                    dataKey="ejecutado"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorEjecutado)"
                  />
                  <Area
                    type="monotone"
                    dataKey="valorizacion"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValorizacion)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Velocímetro de eficiencia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <PerformanceGauge 
              value={eficienciaGeneral}
              title="Eficiencia General"
              subtitle="Obras en tiempo vs total"
              size="md"
              animated={true}
            />
          </motion.div>
        </div>

        {/* Segunda fila - Gráficos de distribución y ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Gráfico de distribución por categoría */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Distribución por Categoría</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="valor"
                    label={({ categoria, porcentaje }) => `${categoria} ${porcentaje}%`}
                    labelLine={false}
                  >
                    {distributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Inversión']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Ranking de contratistas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Top 5 Contratistas</h3>
            <div className="space-y-4">
              {contratistasRanking.map((contratista, index) => (
                <motion.div
                  key={contratista.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-600' :
                    'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{contratista.nombre}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {contratista.obrasCompletadas} obras • {contratista.eficiencia}% eficiencia
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(contratista.valorTotal)}
                    </p>
                    <div className={`text-xs flex items-center gap-1 ${
                      contratista.change > 0 ? 'text-green-600' :
                      contratista.change < 0 ? 'text-red-600' :
                      'text-gray-500'
                    }`}>
                      {contratista.change !== 0 && (
                        <span>{contratista.change > 0 ? '↑' : '↓'} {Math.abs(contratista.change)}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tercera fila - Alertas y Timeline */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Panel de alertas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <AlertPanel
              alerts={alerts}
              onMarkAsRead={markAlertAsRead}
              maxVisible={4}
            />
          </motion.div>

          {/* Timeline de obras */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="xl:col-span-2 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <TimelineObras
              obras={timelineData}
              maxVisible={6}
            />
          </motion.div>
        </div>

        {/* Cuarta fila - Mapa de calor y próximas valorizaciones */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Mapa de calor por distritos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="xl:col-span-2 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <MapaCalor
              data={heatMapData}
              metric="inversion"
            />
          </motion.div>

          {/* Próximas valorizaciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Próximas Valorizaciones
            </h3>
            <div className="space-y-4">
              {valorizacionesProximas.slice(0, 5).map((valorizacion, index) => (
                <motion.div
                  key={valorizacion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  className={`p-4 rounded-xl border-l-4 ${
                    valorizacion.estado === 'Vencida' ? 'bg-red-50 border-red-500' :
                    valorizacion.estado === 'Crítica' ? 'bg-amber-50 border-amber-500' :
                    'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{valorizacion.obra}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      valorizacion.estado === 'Vencida' ? 'bg-red-100 text-red-700' :
                      valorizacion.estado === 'Crítica' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {valorizacion.estado}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{valorizacion.contratista}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(valorizacion.monto)}
                    </span>
                    <span className={`text-xs font-medium ${
                      valorizacion.diasRestantes < 0 ? 'text-red-600' :
                      valorizacion.diasRestantes <= 1 ? 'text-amber-600' :
                      'text-blue-600'
                    }`}>
                      {valorizacion.diasRestantes < 0 
                        ? `${Math.abs(valorizacion.diasRestantes)} días vencida`
                        : valorizacion.diasRestantes === 0 
                        ? 'Vence hoy'
                        : `${valorizacion.diasRestantes} días restantes`}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer con acciones rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Centro de Comando Activo</h3>
              <p className="text-blue-100">Sistema de monitoreo en tiempo real • Actualización automática cada 30 segundos</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Gestionar Equipos</span>
              </button>
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Configuración</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Indicador de loading overlay */}
        {false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="p-6 bg-white rounded-2xl shadow-xl flex items-center gap-4">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-gray-900 dark:text-gray-100 font-medium">Actualizando datos...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;