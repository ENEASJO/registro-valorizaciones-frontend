import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
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
    '#6B7280' // Gray
];
// Función para formatear valores según el tipo
const formatearValor = (value, formato) => {
    if (value === null || value === undefined)
        return '';
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
const CustomTooltip = ({ active, payload, label, formato }) => {
    if (active && payload && payload.length) {
        return (_jsxs("div", { className: "bg-white p-3 border border-gray-300 rounded-lg shadow-lg", children: [_jsx("p", { className: "font-medium text-gray-900 mb-2", children: label }), payload.map((entry, index) => (_jsx("p", { style: { color: entry.color }, className: "text-sm", children: `${entry.name}: ${formatearValor(entry.value, formato)}` }, index)))] }));
    }
    return null;
};
// Componente para gráfico de líneas
const GraficoLinea = ({ config }) => {
    const { datos, configuracion } = config;
    const colores = configuracion.colores || COLORES_DEFAULT;
    return (_jsx(ResponsiveContainer, { width: "100%", height: configuracion.height || 300, children: _jsxs(LineChart, { data: datos, margin: configuracion.margin || { top: 5, right: 30, left: 20, bottom: 5 }, children: [configuracion.mostrarGrid && _jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: configuracion.ejeX?.dataKey, label: configuracion.ejeX?.label ? { value: configuracion.ejeX.label, position: 'insideBottom', offset: -10 } : undefined }), _jsx(YAxis, { label: configuracion.ejeY?.label ? { value: configuracion.ejeY.label, angle: -90, position: 'insideLeft' } : undefined, tickFormatter: (value) => formatearValor(value, configuracion.ejeY?.formato) }), _jsx(Tooltip, { content: _jsx(CustomTooltip, { formato: configuracion.formatoTooltip }) }), configuracion.mostrarLeyenda && _jsx(Legend, {}), datos.length > 0 && Object.keys(datos[0])
                    .filter(key => key !== configuracion.ejeX?.dataKey && typeof datos[0][key] === 'number')
                    .map((key, index) => (_jsx(Line, { type: "monotone", dataKey: key, stroke: colores[index % colores.length], strokeWidth: 2, dot: { r: 4 }, activeDot: { r: 6 } }, key)))] }) }));
};
// Componente para gráfico de área
const GraficoArea = ({ config }) => {
    const { datos, configuracion } = config;
    const colores = configuracion.colores || COLORES_DEFAULT;
    return (_jsx(ResponsiveContainer, { width: "100%", height: configuracion.height || 300, children: _jsxs(AreaChart, { data: datos, margin: configuracion.margin || { top: 5, right: 30, left: 20, bottom: 5 }, children: [configuracion.mostrarGrid && _jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: configuracion.ejeX?.dataKey, label: configuracion.ejeX?.label ? { value: configuracion.ejeX.label, position: 'insideBottom', offset: -10 } : undefined }), _jsx(YAxis, { label: configuracion.ejeY?.label ? { value: configuracion.ejeY.label, angle: -90, position: 'insideLeft' } : undefined, tickFormatter: (value) => formatearValor(value, configuracion.ejeY?.formato) }), _jsx(Tooltip, { content: _jsx(CustomTooltip, { formato: configuracion.formatoTooltip }) }), configuracion.mostrarLeyenda && _jsx(Legend, {}), datos.length > 0 && Object.keys(datos[0])
                    .filter(key => key !== configuracion.ejeX?.dataKey && typeof datos[0][key] === 'number')
                    .map((key, index) => (_jsx(Area, { type: "monotone", dataKey: key, stackId: "1", stroke: colores[index % colores.length], fill: colores[index % colores.length], fillOpacity: 0.6 }, key)))] }) }));
};
// Componente para gráfico de barras
const GraficoBarra = ({ config }) => {
    const { datos, configuracion } = config;
    const colores = configuracion.colores || COLORES_DEFAULT;
    return (_jsx(ResponsiveContainer, { width: "100%", height: configuracion.height || 300, children: _jsxs(BarChart, { data: datos, margin: configuracion.margin || { top: 5, right: 30, left: 20, bottom: 5 }, children: [configuracion.mostrarGrid && _jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: configuracion.ejeX?.dataKey, label: configuracion.ejeX?.label ? { value: configuracion.ejeX.label, position: 'insideBottom', offset: -10 } : undefined }), _jsx(YAxis, { label: configuracion.ejeY?.label ? { value: configuracion.ejeY.label, angle: -90, position: 'insideLeft' } : undefined, tickFormatter: (value) => formatearValor(value, configuracion.ejeY?.formato) }), _jsx(Tooltip, { content: _jsx(CustomTooltip, { formato: configuracion.formatoTooltip }) }), configuracion.mostrarLeyenda && _jsx(Legend, {}), datos.length > 0 && Object.keys(datos[0])
                    .filter(key => key !== configuracion.ejeX?.dataKey && typeof datos[0][key] === 'number')
                    .map((key, index) => (_jsx(Bar, { dataKey: key, fill: colores[index % colores.length], radius: [2, 2, 0, 0] }, key)))] }) }));
};
// Componente para gráfico circular (pie)
const GraficoPie = ({ config }) => {
    const { datos, configuracion } = config;
    const colores = configuracion.colores || COLORES_DEFAULT;
    return (_jsx(ResponsiveContainer, { width: "100%", height: configuracion.height || 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: datos, cx: "50%", cy: "50%", labelLine: false, label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: datos.map((entry, index) => (_jsx(Cell, { fill: entry.color || colores[index % colores.length] }, `cell-${index}`))) }), _jsx(Tooltip, { formatter: (value) => formatearValor(value, configuracion.formatoTooltip) }), configuracion.mostrarLeyenda && _jsx(Legend, {})] }) }));
};
// Componente para gráfico radar
const GraficoRadar = ({ config }) => {
    const { datos, configuracion } = config;
    const colores = configuracion.colores || COLORES_DEFAULT;
    return (_jsx(ResponsiveContainer, { width: "100%", height: configuracion.height || 300, children: _jsxs(RadarChart, { data: datos, children: [_jsx(PolarGrid, {}), _jsx(PolarAngleAxis, { dataKey: "subject" }), _jsx(PolarRadiusAxis, { angle: 90, domain: [0, 100], tickFormatter: (value) => formatearValor(value, configuracion.ejeY?.formato) }), datos.length > 0 && Object.keys(datos[0])
                    .filter(key => key !== 'subject' && typeof datos[0][key] === 'number')
                    .map((key, index) => (_jsx(Radar, { name: key, dataKey: key, stroke: colores[index % colores.length], fill: colores[index % colores.length], fillOpacity: 0.3 }, key))), _jsx(Tooltip, { formatter: (value) => formatearValor(value, configuracion.formatoTooltip) }), configuracion.mostrarLeyenda && _jsx(Legend, {})] }) }));
};
// Componente principal
const GraficosAnalisis = ({ configuraciones, className = '' }) => {
    const renderizarGrafico = (config) => {
        switch (config.tipo) {
            case 'LINE':
                return _jsx(GraficoLinea, { config: config });
            case 'AREA':
                return _jsx(GraficoArea, { config: config });
            case 'BAR':
                return _jsx(GraficoBarra, { config: config });
            case 'PIE':
                return _jsx(GraficoPie, { config: config });
            case 'RADAR':
                return _jsx(GraficoRadar, { config: config });
            case 'SCATTER':
                // Implementación similar para scatter plot si es necesario
                return _jsx(GraficoLinea, { config: config });
            default:
                return _jsx("div", { className: "text-center text-gray-500 py-8", children: "Tipo de gr\u00E1fico no soportado" });
        }
    };
    return (_jsxs("div", { className: `space-y-6 ${className}`, children: [configuraciones.map((config) => (_jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-200 shadow-sm", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: config.titulo }), config.descripcion && (_jsx("p", { className: "text-sm text-gray-600 mt-1", children: config.descripcion }))] }), _jsx("div", { className: "w-full", children: renderizarGrafico(config) })] }, config.id))), configuraciones.length === 0 && (_jsx("div", { className: "text-center py-12 bg-gray-50 rounded-xl border border-gray-200", children: _jsxs("div", { className: "text-gray-500", children: [_jsx("div", { className: "text-lg font-medium", children: "No hay gr\u00E1ficos disponibles" }), _jsx("div", { className: "text-sm mt-1", children: "Configure los filtros para generar gr\u00E1ficos" })] }) }))] }));
};
export default GraficosAnalisis;
