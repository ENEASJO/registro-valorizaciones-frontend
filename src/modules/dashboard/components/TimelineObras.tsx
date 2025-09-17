import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Pause,
  Play,
  User,
  TrendingUp,
  Filter
} from 'lucide-react';

interface TimelineItem {
  id: string;
  nombre: string;
  fechaInicio: Date;
  fechaVencimiento: Date;
  avance: number;
  estado: 'En ejecución' | 'Pausada' | 'Finalizada' | 'Retrasada';
  contratista: string;
}

interface TimelineObrasProps {
  obras: TimelineItem[];
  onObracClick?: (obraId: string) => void;
  maxVisible?: number;
}

const TimelineObras: React.FC<TimelineObrasProps> = ({ 
  obras, 
  onObracClick,
  maxVisible = 8 
}) => {
  const [selectedObra, setSelectedObra] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'delayed' | 'completed'>('all');
  const [showAll, setShowAll] = useState(false);

  const getEstadoConfig = (estado: TimelineItem['estado']) => {
    switch (estado) {
      case 'En ejecución':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          icon: Play,
          pulse: true
        };
      case 'Pausada':
        return {
          color: 'bg-amber-500',
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50',
          icon: Pause,
          pulse: false
        };
      case 'Finalizada':
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          icon: CheckCircle,
          pulse: false
        };
      case 'Retrasada':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          icon: AlertTriangle,
          pulse: true
        };
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          icon: Clock,
          pulse: false
        };
    }
  };

  const getDaysRemaining = (fechaVencimiento: Date) => {
    const now = new Date();
    const diff = fechaVencimiento.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getProgressColor = (avance: number, estado: string) => {
    if (estado === 'Retrasada') return 'bg-red-500';
    if (avance >= 80) return 'bg-green-500';
    if (avance >= 50) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  const filteredObras = obras.filter(obra => {
    switch (filter) {
      case 'active':
        return obra.estado === 'En ejecución';
      case 'delayed':
        return obra.estado === 'Retrasada';
      case 'completed':
        return obra.estado === 'Finalizada';
      default:
        return true;
    }
  }).sort((a, b) => a.fechaVencimiento.getTime() - b.fechaVencimiento.getTime());

  const visibleObras = showAll ? filteredObras : filteredObras.slice(0, maxVisible);

  const filterOptions = [
    { key: 'all', label: 'Todas', count: obras.length },
    { key: 'active', label: 'Activas', count: obras.filter(o => o.estado === 'En ejecución').length },
    { key: 'delayed', label: 'Retrasadas', count: obras.filter(o => o.estado === 'Retrasada').length },
    { key: 'completed', label: 'Finalizadas', count: obras.filter(o => o.estado === 'Finalizada').length }
  ];

  return (
    <div className="space-y-4">
      {/* Header con filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Timeline de Obras</h3>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-300" />
          <div className="flex gap-1">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key as any)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                  filter === option.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200"></div>

        {/* Items del timeline */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {visibleObras.map((obra, index) => {
              const config = getEstadoConfig(obra.estado);
              const IconComponent = config.icon;
              const daysRemaining = getDaysRemaining(obra.fechaVencimiento);
              const isSelected = selectedObra === obra.id;
              const progressColor = getProgressColor(obra.avance, obra.estado);

              return (
                <motion.div
                  key={obra.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    layout: { duration: 0.2 }
                  }}
                  className="relative group"
                >
                  {/* Timeline dot con animación */}
                  <motion.div
                    className={`absolute left-4 w-4 h-4 rounded-full border-4 border-white shadow-lg ${config.color} z-10`}
                    animate={config.pulse ? {
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(59, 130, 246, 0)',
                        '0 0 0 10px rgba(59, 130, 246, 0.1)',
                        '0 0 0 0 rgba(59, 130, 246, 0)'
                      ]
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: config.pulse ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Contenido de la tarjeta */}
                  <motion.div
                    className={`ml-12 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected ? 'border-blue-300 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                    } ${config.bgColor} group-hover:shadow-md`}
                    onClick={() => {
                      setSelectedObra(isSelected ? null : obra.id);
                      onObracClick?.(obra.id);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Información principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className={`w-4 h-4 ${config.textColor}`} />
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.bgColor} ${config.textColor} border ${config.textColor.replace('text-', 'border-')}`}>
                            {obra.estado}
                          </span>
                        </div>

                        <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {obra.nombre}
                        </h4>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="truncate">{obra.contratista}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className={daysRemaining < 0 ? 'text-red-600 font-medium' : 
                                           daysRemaining <= 7 ? 'text-amber-600 font-medium' : ''}>
                              {daysRemaining < 0 ? `${Math.abs(daysRemaining)} días vencida` :
                               daysRemaining === 0 ? 'Vence hoy' :
                               `${daysRemaining} días restantes`}
                            </span>
                          </div>
                        </div>

                        {/* Barra de progreso */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-300">Avance</span>
                            <span className="font-medium">{obra.avance}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${progressColor}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${obra.avance}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>

                        {/* Información expandida */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 pt-4 border-t border-gray-200"
                            >
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <span className="text-gray-500 dark:text-gray-300">Fecha inicio:</span>
                                  <div className="font-medium">
                                    {obra.fechaInicio.toLocaleDateString('es-ES')}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-300">Fecha vencimiento:</span>
                                  <div className="font-medium">
                                    {obra.fechaVencimiento.toLocaleDateString('es-ES')}
                                  </div>
                                </div>
                              </div>

                              {/* Métricas adicionales */}
                              <div className="flex items-center justify-between mt-3 p-3 bg-white/50 rounded-lg">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-gray-900">
                                    {Math.round((new Date().getTime() - obra.fechaInicio.getTime()) / (1000 * 60 * 60 * 24))}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-300">Días transcurridos</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-gray-900">
                                    {Math.round((obra.fechaVencimiento.getTime() - obra.fechaInicio.getTime()) / (1000 * 60 * 60 * 24))}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-300">Duración total</div>
                                </div>
                                <div className="text-center">
                                  <div className={`text-lg font-bold ${obra.avance >= 80 ? 'text-green-600' : obra.avance >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                    {((obra.avance / 100) * Math.round((obra.fechaVencimiento.getTime() - obra.fechaInicio.getTime()) / (1000 * 60 * 60 * 24))).toFixed(0)}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-300">Días productivos</div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Indicador de tendencia */}
                      <div className="flex flex-col items-end gap-2">
                        <motion.div
                          animate={{ rotate: obra.avance > 50 ? 0 : 180 }}
                          className={`p-1 rounded-full ${obra.avance > 50 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                        >
                          <TrendingUp className="w-3 h-3" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Botón para mostrar más */}
        {filteredObras.length > maxVisible && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {showAll ? 'Mostrar menos' : `Ver todas (${filteredObras.length - maxVisible} más)`}
            </button>
          </div>
        )}

        {/* Estado vacío */}
        {filteredObras.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-300">No hay obras para mostrar</p>
            <p className="text-sm text-gray-400 dark:text-gray-300 mt-1">
              {filter !== 'all' && 'Prueba cambiando los filtros'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Resumen de estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredObras.filter(o => o.estado === 'En ejecución').length}
          </div>
          <div className="text-xs text-gray-600">En Ejecución</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredObras.filter(o => o.estado === 'Finalizada').length}
          </div>
          <div className="text-xs text-gray-600">Finalizadas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {filteredObras.filter(o => o.estado === 'Retrasada').length}
          </div>
          <div className="text-xs text-gray-600">Retrasadas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">
            {Math.round(filteredObras.reduce((acc, obra) => acc + obra.avance, 0) / filteredObras.length) || 0}%
          </div>
          <div className="text-xs text-gray-600">Avance Promedio</div>
        </div>
      </motion.div>
    </div>
  );
};

export default TimelineObras;