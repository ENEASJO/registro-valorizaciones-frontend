import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, TrendingUp, DollarSign, Building2, Info, Home, Users, Building } from 'lucide-react';

interface DistritoData {
  distrito: string;
  obras: number;
  inversion: number;
  eficiencia: number; // 0-100
  tipo?: string; // Tipo de localidad
}

interface MapaCalorProps {
  data: DistritoData[];
  onDistritoClick?: (distrito: string) => void;
  metric?: 'obras' | 'inversion' | 'eficiencia';
}

const MapaCalor: React.FC<MapaCalorProps> = ({ 
  data, 
  onDistritoClick,
  metric = 'inversion' 
}) => {
  const [selectedDistrito, setSelectedDistrito] = useState<string | null>(null);
  const [hoveredDistrito, setHoveredDistrito] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState(metric);

  // Obtener valor según la métrica activa
  const getValue = (distrito: DistritoData) => {
    switch (activeMetric) {
      case 'obras':
        return distrito.obras;
      case 'eficiencia':
        return distrito.eficiencia;
      case 'inversion':
      default:
        return distrito.inversion;
    }
  };

  // Calcular intensidad del color (0-1)
  const getIntensity = (distrito: DistritoData) => {
    const value = getValue(distrito);
    const maxValue = Math.max(...data.map(d => getValue(d)));
    return maxValue > 0 ? value / maxValue : 0;
  };

  // Obtener color basado en la métrica y intensidad
  const getColor = (distrito: DistritoData) => {
    const intensity = getIntensity(distrito);
    
    switch (activeMetric) {
      case 'obras':
        return {
          bg: `rgba(59, 130, 246, ${0.1 + intensity * 0.8})`, // blue
          border: `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`,
          text: intensity > 0.5 ? 'text-white' : 'text-blue-900'
        };
      case 'eficiencia':
        // Color verde para alta eficiencia, rojo para baja
        const isHighEfficiency = distrito.eficiencia >= 70;
        return {
          bg: isHighEfficiency 
            ? `rgba(34, 197, 94, ${0.1 + intensity * 0.8})` 
            : `rgba(239, 68, 68, ${0.1 + intensity * 0.8})`,
          border: isHighEfficiency 
            ? `rgba(34, 197, 94, ${0.3 + intensity * 0.7})`
            : `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`,
          text: intensity > 0.5 ? 'text-white' : isHighEfficiency ? 'text-green-900' : 'text-red-900'
        };
      case 'inversion':
      default:
        return {
          bg: `rgba(168, 85, 247, ${0.1 + intensity * 0.8})`, // purple
          border: `rgba(168, 85, 247, ${0.3 + intensity * 0.7})`,
          text: intensity > 0.5 ? 'text-white' : 'text-purple-900'
        };
    }
  };

  const formatValue = (distrito: DistritoData) => {
    const value = getValue(distrito);
    switch (activeMetric) {
      case 'obras':
        return `${value} obras`;
      case 'eficiencia':
        return `${value}%`;
      case 'inversion':
        return new Intl.NumberFormat('es-PE', {
          style: 'currency',
          currency: 'PEN',
          notation: 'compact',
          maximumFractionDigits: 1
        }).format(value);
    }
  };

  const getMetricConfig = () => {
    switch (activeMetric) {
      case 'obras':
        return {
          label: 'Número de Obras',
          icon: Building2,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case 'eficiencia':
        return {
          label: 'Eficiencia Promedio',
          icon: TrendingUp,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'inversion':
      default:
        return {
          label: 'Inversión Total',
          icon: DollarSign,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        };
    }
  };

  const config = getMetricConfig();
  const MetricIcon = config.icon;

  // Datos ordenados por valor
  const sortedData = [...data].sort((a, b) => getValue(b) - getValue(a));

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Mapa de Calor - Distrito de San Marcos</h3>
        </div>

        {/* Selector de métrica */}
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
          {['inversion', 'obras', 'eficiencia'].map((m) => {
            const isActive = activeMetric === m;
            return (
              <button
                key={m}
                onClick={() => setActiveMetric(m as any)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {m === 'inversion' && 'Inversión'}
                {m === 'obras' && 'Obras'}
                {m === 'eficiencia' && 'Eficiencia'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Información de la métrica activa */}
      <div className={`p-4 rounded-lg ${config.bgColor} border border-opacity-20`}>
        <div className="flex items-center gap-3 mb-2">
          <MetricIcon className={`w-5 h-5 ${config.color}`} />
          <span className="font-medium text-gray-900">{config.label}</span>
        </div>
        <p className="text-sm text-gray-600">
          {activeMetric === 'inversion' && 'Inversión total acumulada por localidad'}
          {activeMetric === 'obras' && 'Cantidad de obras activas por localidad'}
          {activeMetric === 'eficiencia' && 'Promedio de eficiencia de obras por localidad'}
        </p>
      </div>

      {/* Grid de distritos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {sortedData.map((distrito, index) => {
          const colors = getColor(distrito);
          const intensity = getIntensity(distrito);
          const isSelected = selectedDistrito === distrito.distrito;
          const isHovered = hoveredDistrito === distrito.distrito;

          return (
            <motion.div
              key={distrito.distrito}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                type: "spring",
                stiffness: 100 
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
              onClick={() => {
                setSelectedDistrito(isSelected ? null : distrito.distrito);
                onDistritoClick?.(distrito.distrito);
              }}
              onHoverStart={() => setHoveredDistrito(distrito.distrito)}
              onHoverEnd={() => setHoveredDistrito(null)}
            >
              {/* Card principal */}
              <div
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-blue-300 ring-offset-2' : ''
                } ${isHovered ? 'shadow-lg' : 'shadow-sm'}`}
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border
                }}
              >
                {/* Indicador de intensidad */}
                <div className="absolute top-2 right-2">
                  <div 
                    className="w-3 h-3 rounded-full border border-white/50"
                    style={{ backgroundColor: colors.border }}
                  />
                </div>

                {/* Icono del tipo de localidad */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${colors.text} line-clamp-2`}>
                      {distrito.distrito.replace('C.P. ', '').replace('Zona Urbana - ', '').replace('Caserío ', '')}
                    </h4>
                    {distrito.tipo && (
                      <div className="flex items-center gap-1 mt-1">
                        {distrito.tipo === 'Centro Poblado' && <Users className="w-3 h-3" />}
                        {distrito.tipo === 'Zona Urbana' && <Building className="w-3 h-3" />}
                        {distrito.tipo === 'Caserío' && <Home className="w-3 h-3" />}
                        <span className={`text-xs ${colors.text} opacity-75`}>
                          {distrito.tipo === 'Centro Poblado' && 'C.P.'}
                          {distrito.tipo === 'Zona Urbana' && 'Urbano'}
                          {distrito.tipo === 'Caserío' && 'Caserío'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Valor principal */}
                <div className={`text-lg font-bold ${colors.text} mb-1`}>
                  {formatValue(distrito)}
                </div>

                {/* Ranking */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${colors.text} opacity-75`}>
                    #{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    {/* Barra de intensidad */}
                    <div className="w-8 h-1 bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white/60 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${intensity * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tooltip información adicional */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 10
                  }}
                  className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs p-2 rounded-lg whitespace-nowrap z-10 pointer-events-none"
                >
                  <div className="space-y-1">
                    <div>Obras: {distrito.obras}</div>
                    <div>Inversión: {new Intl.NumberFormat('es-PE', { 
                      style: 'currency', 
                      currency: 'PEN', 
                      notation: 'compact' 
                    }).format(distrito.inversion)}</div>
                    <div>Eficiencia: {distrito.eficiencia}%</div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </motion.div>

                {/* Pulse effect para el distrito con mayor valor */}
                {index === 0 && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2"
                    style={{ borderColor: colors.border }}
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Intensidad del color indica el valor relativo</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
            <span>Menor</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-12 h-2 bg-gradient-to-r from-gray-200 via-blue-300 to-blue-600 rounded-full"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              activeMetric === 'obras' ? 'bg-blue-600' :
              activeMetric === 'eficiencia' ? 'bg-green-600' :
              'bg-purple-600'
            }`}></div>
            <span>Mayor</span>
          </div>
        </div>
      </div>
      
      {/* Leyenda de tipos de localidades */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Estructura Territorial del Distrito de San Marcos</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            <div>
              <span className="text-sm font-medium text-gray-700">Zona Urbana</span>
              <p className="text-xs text-gray-500">Barrios de San Marcos ciudad</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-600" />
            <div>
              <span className="text-sm font-medium text-gray-700">Centros Poblados</span>
              <p className="text-xs text-gray-500">Agrupaciones de caseríos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-orange-600" />
            <div>
              <span className="text-sm font-medium text-gray-700">Caseríos</span>
              <p className="text-xs text-gray-500">Caseríos independientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas resumidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {data.length}
          </div>
          <div className="text-xs text-gray-600">Localidades</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.reduce((sum, d) => sum + d.obras, 0)}
          </div>
          <div className="text-xs text-gray-600">Total Obras</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {new Intl.NumberFormat('es-PE', { 
              notation: 'compact', 
              maximumFractionDigits: 1 
            }).format(data.reduce((sum, d) => sum + d.inversion, 0))}
          </div>
          <div className="text-xs text-gray-600">Inversión Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(data.reduce((sum, d) => sum + d.eficiencia, 0) / data.length)}%
          </div>
          <div className="text-xs text-gray-600">Eficiencia Promedio</div>
        </div>
      </motion.div>
    </div>
  );
};

export default MapaCalor;