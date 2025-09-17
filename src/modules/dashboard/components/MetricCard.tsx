import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { 
  Building2, DollarSign, FileText, TrendingUp, CheckCircle, Clock,
  ArrowUp, ArrowDown, Minus 
} from 'lucide-react';
import type { DashboardMetric } from '../../../hooks/useDashboard';

interface MetricCardProps {
  metric: DashboardMetric;
  index: number;
  onClick?: () => void;
}

const iconComponents = {
  Building2,
  DollarSign,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock
};

const MetricCard: React.FC<MetricCardProps> = ({ metric, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  
  // Animación del contador
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  useSpring(count, { duration: 2000 });

  // Configurar el valor inicial y animar hacia el valor real
  useEffect(() => {
    const numericValue = typeof metric.value === 'number' ? metric.value : 0;
    count.set(numericValue);
  }, [metric.value, count]);

  // Actualizar el display value
  useEffect(() => {
    return rounded.onChange((v) => setDisplayValue(v));
  }, [rounded]);

  const IconComponent = iconComponents[metric.icon as keyof typeof iconComponents] || Building2;

  const formatDisplayValue = (value: number) => {
    switch (metric.format) {
      case 'currency':
        return new Intl.NumberFormat('es-PE', {
          style: 'currency',
          currency: 'PEN',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          notation: value >= 1000000 ? 'compact' : 'standard',
          compactDisplay: 'short'
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'number':
        return new Intl.NumberFormat('es-PE', {
          notation: value >= 1000 ? 'compact' : 'standard',
          compactDisplay: 'short'
        }).format(value);
      default:
        return value.toString();
    }
  };

  const getChangeIcon = () => {
    if (metric.changeType === 'increase') return ArrowUp;
    if (metric.changeType === 'decrease') return ArrowDown;
    return Minus;
  };

  const getChangeColor = () => {
    if (metric.changeType === 'increase') return 'text-green-600';
    if (metric.changeType === 'decrease') return 'text-red-600';
    return 'text-gray-500 dark:text-gray-300';
  };

  const ChangeIcon = getChangeIcon();

  // Datos para el sparkline
  const sparklineData = metric.sparklineData.map((value, i) => ({
    index: i,
    value
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.5,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2, type: "spring", stiffness: 300 }
      }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Background con glassmorphism */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl" />
      
      {/* Gradiente animado en hover */}
      <motion.div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(45deg, ${metric.color.replace('bg-gradient-to-r from-', '').replace(' to-', ', ')})`,
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
          zIndex: -1
        }}
      />

      {/* Contenido principal */}
      <div className="relative p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300">
        
        {/* Header con icon */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0
            }}
            transition={{ duration: 0.2 }}
            className={`p-3 rounded-xl ${metric.color} shadow-lg`}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </motion.div>
          
          {/* Badge de cambio */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 ${getChangeColor()}`}
          >
            <ChangeIcon className="w-3 h-3" />
            <span className="text-xs font-medium">
              {Math.abs(metric.change).toFixed(1)}%
            </span>
          </motion.div>
        </div>

        {/* Título */}
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          {metric.title}
        </h3>

        {/* Valor principal animado */}
        <motion.div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">
            {formatDisplayValue(displayValue)}
          </span>
        </motion.div>

        {/* Sparkline */}
        <div className="h-12 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={metric.color.includes('blue') ? '#3B82F6' :
                       metric.color.includes('emerald') ? '#10B981' :
                       metric.color.includes('purple') ? '#8B5CF6' :
                       metric.color.includes('orange') ? '#F59E0B' :
                       metric.color.includes('teal') ? '#14B8A6' :
                       '#6366F1'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: 'currentColor' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Información de cambio */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-300">vs. período anterior</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className={`font-medium ${getChangeColor()}`}
          >
            {metric.changeType === 'increase' ? '+' : metric.changeType === 'decrease' ? '-' : ''}
            {Math.abs(metric.change).toFixed(1)}%
          </motion.span>
        </div>

        {/* Pulse indicator para actualizaciones en tiempo real */}
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Hover overlay effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />
      </div>
    </motion.div>
  );
};

export default MetricCard;