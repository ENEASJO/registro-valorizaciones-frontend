import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X, 
  Clock,
  Eye,
  EyeOff,
  Bell
} from 'lucide-react';
import type { Alert } from '../../../hooks/useDashboard';

interface AlertPanelProps {
  alerts: Alert[];
  onMarkAsRead: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  maxVisible?: number;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ 
  alerts, 
  onMarkAsRead, 
  onDismiss,
  maxVisible = 5 
}) => {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return AlertTriangle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return Info;
      default:
        return Bell;
    }
  };

  const getAlertColors = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-500',
          title: 'text-red-800',
          message: 'text-red-700',
          pulse: 'bg-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: 'text-amber-500',
          title: 'text-amber-800',
          message: 'text-amber-700',
          pulse: 'bg-amber-400'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-500',
          title: 'text-blue-800',
          message: 'text-blue-700',
          pulse: 'bg-blue-400'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'text-gray-500 dark:text-gray-300',
          title: 'text-gray-800',
          message: 'text-gray-700',
          pulse: 'bg-gray-400'
        };
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const visibleAlerts = showAll ? alerts : alerts.slice(0, maxVisible);
  const unreadCount = alerts.filter(alert => !alert.read).length;
  const criticalCount = alerts.filter(alert => alert.type === 'critical' && !alert.read).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: criticalCount > 0 ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: criticalCount > 0 ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <Bell className="w-5 h-5 text-gray-600" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900">
            Alertas y Notificaciones
          </h3>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full"
            >
              {unreadCount}
            </motion.span>
          )}
        </div>

        {alerts.length > maxVisible && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAll ? 'Mostrar menos' : `Ver todas (${alerts.length})`}
          </button>
        )}
      </div>

      {/* Lista de alertas */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {visibleAlerts.map((alert, index) => {
            const IconComponent = getAlertIcon(alert.type);
            const colors = getAlertColors(alert.type);
            const isExpanded = expandedAlert === alert.id;

            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.05,
                  layout: { duration: 0.2 }
                }}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group hover:shadow-md ${colors.bg} ${colors.border} ${!alert.read ? 'ring-2 ring-offset-2 ring-blue-100' : ''}`}
                onClick={() => {
                  if (!alert.read) {
                    onMarkAsRead(alert.id);
                  }
                  setExpandedAlert(isExpanded ? null : alert.id);
                }}
              >
                {/* Pulse indicator para alertas no leídas */}
                {!alert.read && (
                  <motion.div
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${colors.pulse}`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                <div className="flex items-start gap-3">
                  {/* Icono con animación */}
                  <motion.div
                    animate={alert.type === 'critical' && !alert.read ? {
                      rotate: [0, -5, 5, -5, 5, 0],
                    } : {}}
                    transition={{
                      duration: 0.5,
                      repeat: alert.type === 'critical' && !alert.read ? Infinity : 0,
                      repeatDelay: 3
                    }}
                    className="flex-shrink-0"
                  >
                    <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                  </motion.div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium text-sm ${colors.title}`}>
                        {alert.title}
                      </h4>
                      {!alert.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>

                    <motion.p
                      className={`text-sm leading-relaxed ${colors.message}`}
                      initial={false}
                      animate={{
                        opacity: isExpanded ? 1 : 0.8,
                        height: isExpanded ? 'auto' : '1.5rem'
                      }}
                      style={{
                        overflow: isExpanded ? 'visible' : 'hidden',
                        textOverflow: isExpanded ? 'clip' : 'ellipsis',
                        whiteSpace: isExpanded ? 'normal' : 'nowrap'
                      }}
                    >
                      {alert.message}
                    </motion.p>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-300">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(alert.timestamp)}</span>
                    </div>
                  </div>

                  {/* Botón de cerrar */}
                  {onDismiss && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismiss(alert.id);
                      }}
                      className="flex-shrink-0 p-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  whileHover={{ scale: 1.01 }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Estado vacío */}
      {alerts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          </motion.div>
          <p className="text-gray-500 dark:text-gray-300">No hay alertas pendientes</p>
          <p className="text-sm text-gray-400 dark:text-gray-300 mt-1">¡Todo está funcionando correctamente!</p>
        </motion.div>
      )}

      {/* Resumen de alertas */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              {alerts.filter(a => a.type === 'critical').length} Críticas
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              {alerts.filter(a => a.type === 'warning').length} Advertencias
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              {alerts.filter(a => a.type === 'info').length} Información
            </span>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-300">
            {unreadCount} sin leer
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AlertPanel;