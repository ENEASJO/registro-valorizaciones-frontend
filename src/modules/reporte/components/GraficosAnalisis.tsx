import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import type { ConfiguracionGrafico } from '../../../types/reporte.types';

interface GraficosAnalisisProps {
  configuraciones: ConfiguracionGrafico[];
  className?: string;
}

// Colores personalizados para gráficos
const COLORES_DEFAULT = [
  '#3B82F6', // Blue
  '#10B981', // Emerald  
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6B7280'  // Gray
];

// Función para formatear valores según el tipo
const formatearValor = (value: any, formato?: string) => {
  if (value === null || value === undefined) return '';
  
  switch (formato) {
    case 'moneda':
      return `S/ ${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    case 'porcentaje':
      return `${Number(value).toFixed(1)}%`;
    case 'numero':
      return Number(value).toLocaleString('es-PE');
    case 'fecha':
      return new Date(value).toLocaleDateString('es-PE');
    default:
      return value.toString();
  }
};

// Tooltip personalizado
const CustomTooltip = ({ active, payload, label, formato }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${formatearValor(entry.value, formato)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Componente para gráfico de líneas
const GraficoLinea = ({ config }: { config: ConfiguracionGrafico }) => {
  const { datos, configuracion } = config;
  const colores = configuracion.colores || COLORES_DEFAULT;

  return (
    <ResponsiveContainer width="100%" height={configuracion.height || 300}>
      <LineChart data={datos} margin={configuracion.margin || { top: 5, right: 30, left: 20, bottom: 5 }}>
        {configuracion.mostrarGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis 
          dataKey={configuracion.ejeX?.dataKey} 
          label={configuracion.ejeX?.label ? { value: configuracion.ejeX.label, position: 'insideBottom', offset: -10 } : undefined}
        />
        <YAxis 
          label={configuracion.ejeY?.label ? { value: configuracion.ejeY.label, angle: -90, position: 'insideLeft' } : undefined}
          tickFormatter={(value) => formatearValor(value, configuracion.ejeY?.formato)}
        />
        <Tooltip content={<CustomTooltip formato={configuracion.formatoTooltip} />} />
        {configuracion.mostrarLeyenda && <Legend />}
        
        {/* Determinar las líneas automáticamente basado en los datos */}
        {datos.length > 0 && Object.keys(datos[0])
          .filter(key => key !== configuracion.ejeX?.dataKey && typeof datos[0][key] === 'number')
          .map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colores[index % colores.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))
        }
      </LineChart>
    </ResponsiveContainer>
  );
};

// Componente para gráfico de área
const GraficoArea = ({ config }: { config: ConfiguracionGrafico }) => {
  const { datos, configuracion } = config;
  const colores = configuracion.colores || COLORES_DEFAULT;

  return (
    <ResponsiveContainer width="100%" height={configuracion.height || 300}>
      <AreaChart data={datos} margin={configuracion.margin || { top: 5, right: 30, left: 20, bottom: 5 }}>
        {configuracion.mostrarGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis 
          dataKey={configuracion.ejeX?.dataKey}
          label={configuracion.ejeX?.label ? { value: configuracion.ejeX.label, position: 'insideBottom', offset: -10 } : undefined}
        />
        <YAxis 
          label={configuracion.ejeY?.label ? { value: configuracion.ejeY.label, angle: -90, position: 'insideLeft' } : undefined}
          tickFormatter={(value) => formatearValor(value, configuracion.ejeY?.formato)}
        />
        <Tooltip content={<CustomTooltip formato={configuracion.formatoTooltip} />} />
        {configuracion.mostrarLeyenda && <Legend />}
        
        {datos.length > 0 && Object.keys(datos[0])
          .filter(key => key !== configuracion.ejeX?.dataKey && typeof datos[0][key] === 'number')
          .map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={colores[index % colores.length]}
              fill={colores[index % colores.length]}
              fillOpacity={0.6}
            />
          ))
        }
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Componente para gráfico de barras
const GraficoBarra = ({ config }: { config: ConfiguracionGrafico }) => {
  const { datos, configuracion } = config;
  const colores = configuracion.colores || COLORES_DEFAULT;

  return (
    <ResponsiveContainer width="100%" height={configuracion.height || 300}>
      <BarChart data={datos} margin={configuracion.margin || { top: 5, right: 30, left: 20, bottom: 5 }}>
        {configuracion.mostrarGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis 
          dataKey={configuracion.ejeX?.dataKey}
          label={configuracion.ejeX?.label ? { value: configuracion.ejeX.label, position: 'insideBottom', offset: -10 } : undefined}
        />
        <YAxis 
          label={configuracion.ejeY?.label ? { value: configuracion.ejeY.label, angle: -90, position: 'insideLeft' } : undefined}
          tickFormatter={(value) => formatearValor(value, configuracion.ejeY?.formato)}
        />
        <Tooltip content={<CustomTooltip formato={configuracion.formatoTooltip} />} />
        {configuracion.mostrarLeyenda && <Legend />}
        
        {datos.length > 0 && Object.keys(datos[0])
          .filter(key => key !== configuracion.ejeX?.dataKey && typeof datos[0][key] === 'number')
          .map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colores[index % colores.length]}
              radius={[2, 2, 0, 0]}
            />
          ))
        }
      </BarChart>
    </ResponsiveContainer>
  );
};

// Componente para gráfico circular (pie)
const GraficoPie = ({ config }: { config: ConfiguracionGrafico }) => {
  const { datos, configuracion } = config;
  const colores = configuracion.colores || COLORES_DEFAULT;

  return (
    <ResponsiveContainer width="100%" height={configuracion.height || 300}>
      <PieChart>
        <Pie
          data={datos}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {datos.map((entry: any, index: number) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || colores[index % colores.length]} 
            />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => formatearValor(value, configuracion.formatoTooltip)} />
        {configuracion.mostrarLeyenda && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  );
};

// Componente para gráfico radar
const GraficoRadar = ({ config }: { config: ConfiguracionGrafico }) => {
  const { datos, configuracion } = config;
  const colores = configuracion.colores || COLORES_DEFAULT;

  return (
    <ResponsiveContainer width="100%" height={configuracion.height || 300}>
      <RadarChart data={datos}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]}
          tickFormatter={(value) => formatearValor(value, configuracion.ejeY?.formato)}
        />
        
        {datos.length > 0 && Object.keys(datos[0])
          .filter(key => key !== 'subject' && typeof datos[0][key] === 'number')
          .map((key, index) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={colores[index % colores.length]}
              fill={colores[index % colores.length]}
              fillOpacity={0.3}
            />
          ))
        }
        
        <Tooltip formatter={(value: any) => formatearValor(value, configuracion.formatoTooltip)} />
        {configuracion.mostrarLeyenda && <Legend />}
      </RadarChart>
    </ResponsiveContainer>
  );
};

// Componente principal
const GraficosAnalisis = ({ configuraciones, className = '' }: GraficosAnalisisProps) => {
  const renderizarGrafico = (config: ConfiguracionGrafico) => {
    switch (config.tipo) {
      case 'LINE':
        return <GraficoLinea config={config} />;
      case 'AREA':
        return <GraficoArea config={config} />;
      case 'BAR':
        return <GraficoBarra config={config} />;
      case 'PIE':
        return <GraficoPie config={config} />;
      case 'RADAR':
        return <GraficoRadar config={config} />;
      case 'SCATTER':
        // Implementación similar para scatter plot si es necesario
        return <GraficoLinea config={config} />;
      default:
        return <div className="text-center text-gray-500 dark:text-gray-300 py-8">Tipo de gráfico no soportado</div>;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {configuraciones.map((config) => (
        <div key={config.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{config.titulo}</h3>
            {config.descripcion && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{config.descripcion}</p>
            )}
          </div>
          
          <div className="w-full">
            {renderizarGrafico(config)}
          </div>
        </div>
      ))}
      
      {configuraciones.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-gray-500 dark:text-gray-300">
            <div className="text-lg font-medium">No hay gráficos disponibles</div>
            <div className="text-sm mt-1">Configure los filtros para generar gráficos</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraficosAnalisis;