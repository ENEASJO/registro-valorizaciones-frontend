import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, TrendingUp, DollarSign, Building2, Info, Home, Users, Building } from 'lucide-react';
const MapaCalor = ({ data, onDistritoClick, metric = 'inversion' }) => {
    const [selectedDistrito, setSelectedDistrito] = useState(null);
    const [hoveredDistrito, setHoveredDistrito] = useState(null);
    const [activeMetric, setActiveMetric] = useState(metric);
    // Obtener valor según la métrica activa
    const getValue = (distrito) => {
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
    const getIntensity = (distrito) => {
        const value = getValue(distrito);
        const maxValue = Math.max(...data.map(d => getValue(d)));
        return maxValue > 0 ? value / maxValue : 0;
    };
    // Obtener color basado en la métrica y intensidad
    const getColor = (distrito) => {
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
    const formatValue = (distrito) => {
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(MapPin, { className: "w-5 h-5 text-blue-600" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Mapa de Calor - Distrito de San Marcos" })] }), _jsx("div", { className: "flex items-center gap-2 p-1 bg-gray-100 rounded-lg", children: ['inversion', 'obras', 'eficiencia'].map((m) => {
                            const isActive = activeMetric === m;
                            return (_jsxs("button", { onClick: () => setActiveMetric(m), className: `px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${isActive
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'}`, children: [m === 'inversion' && 'Inversión', m === 'obras' && 'Obras', m === 'eficiencia' && 'Eficiencia'] }, m));
                        }) })] }), _jsxs("div", { className: `p-4 rounded-lg ${config.bgColor} border border-opacity-20`, children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(MetricIcon, { className: `w-5 h-5 ${config.color}` }), _jsx("span", { className: "font-medium text-gray-900", children: config.label })] }), _jsxs("p", { className: "text-sm text-gray-600", children: [activeMetric === 'inversion' && 'Inversión total acumulada por localidad', activeMetric === 'obras' && 'Cantidad de obras activas por localidad', activeMetric === 'eficiencia' && 'Promedio de eficiencia de obras por localidad'] })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3", children: sortedData.map((distrito, index) => {
                    const colors = getColor(distrito);
                    const intensity = getIntensity(distrito);
                    const isSelected = selectedDistrito === distrito.distrito;
                    const isHovered = hoveredDistrito === distrito.distrito;
                    return (_jsx(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: {
                            duration: 0.3,
                            delay: index * 0.05,
                            type: "spring",
                            stiffness: 100
                        }, whileHover: {
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }, whileTap: { scale: 0.95 }, className: "relative group cursor-pointer", onClick: () => {
                            setSelectedDistrito(isSelected ? null : distrito.distrito);
                            onDistritoClick?.(distrito.distrito);
                        }, onHoverStart: () => setHoveredDistrito(distrito.distrito), onHoverEnd: () => setHoveredDistrito(null), children: _jsxs("div", { className: `relative p-4 rounded-xl border-2 transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-300 ring-offset-2' : ''} ${isHovered ? 'shadow-lg' : 'shadow-sm'}`, style: {
                                backgroundColor: colors.bg,
                                borderColor: colors.border
                            }, children: [_jsx("div", { className: "absolute top-2 right-2", children: _jsx("div", { className: "w-3 h-3 rounded-full border border-white/50", style: { backgroundColor: colors.border } }) }), _jsx("div", { className: "flex items-start justify-between mb-2", children: _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: `font-medium text-sm ${colors.text} line-clamp-2`, children: distrito.distrito.replace('C.P. ', '').replace('Zona Urbana - ', '').replace('Caserío ', '') }), distrito.tipo && (_jsxs("div", { className: "flex items-center gap-1 mt-1", children: [distrito.tipo === 'Centro Poblado' && _jsx(Users, { className: "w-3 h-3" }), distrito.tipo === 'Zona Urbana' && _jsx(Building, { className: "w-3 h-3" }), distrito.tipo === 'Caserío' && _jsx(Home, { className: "w-3 h-3" }), _jsxs("span", { className: `text-xs ${colors.text} opacity-75`, children: [distrito.tipo === 'Centro Poblado' && 'C.P.', distrito.tipo === 'Zona Urbana' && 'Urbano', distrito.tipo === 'Caserío' && 'Caserío'] })] }))] }) }), _jsx("div", { className: `text-lg font-bold ${colors.text} mb-1`, children: formatValue(distrito) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: `text-xs ${colors.text} opacity-75`, children: ["#", index + 1] }), _jsx("div", { className: "flex items-center gap-1", children: _jsx("div", { className: "w-8 h-1 bg-white/30 rounded-full overflow-hidden", children: _jsx(motion.div, { className: "h-full bg-white/60 rounded-full", initial: { width: 0 }, animate: { width: `${intensity * 100}%` }, transition: { duration: 1, delay: index * 0.05 } }) }) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: {
                                        opacity: isHovered ? 1 : 0,
                                        y: isHovered ? 0 : 10
                                    }, className: "absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs p-2 rounded-lg whitespace-nowrap z-10 pointer-events-none", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { children: ["Obras: ", distrito.obras] }), _jsxs("div", { children: ["Inversi\u00F3n: ", new Intl.NumberFormat('es-PE', {
                                                            style: 'currency',
                                                            currency: 'PEN',
                                                            notation: 'compact'
                                                        }).format(distrito.inversion)] }), _jsxs("div", { children: ["Eficiencia: ", distrito.eficiencia, "%"] })] }), _jsx("div", { className: "absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" })] }), index === 0 && (_jsx(motion.div, { className: "absolute inset-0 rounded-xl border-2", style: { borderColor: colors.border }, animate: {
                                        scale: [1, 1.05, 1],
                                        opacity: [0.5, 0.8, 0.5]
                                    }, transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    } }))] }) }, distrito.distrito));
                }) }), _jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Info, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { className: "text-sm text-gray-600", children: "Intensidad del color indica el valor relativo" })] }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-gray-500", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-gray-200 rounded-full" }), _jsx("span", { children: "Menor" })] }), _jsx("div", { className: "flex items-center gap-1", children: _jsx("div", { className: "w-12 h-2 bg-gradient-to-r from-gray-200 via-blue-300 to-blue-600 rounded-full" }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${activeMetric === 'obras' ? 'bg-blue-600' :
                                            activeMetric === 'eficiencia' ? 'bg-green-600' :
                                                'bg-purple-600'}` }), _jsx("span", { children: "Mayor" })] })] })] }), _jsxs("div", { className: "p-4 bg-blue-50 rounded-lg border border-blue-200", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 mb-3", children: "Estructura Territorial del Distrito de San Marcos" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Building, { className: "w-4 h-4 text-blue-600" }), _jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Zona Urbana" }), _jsx("p", { className: "text-xs text-gray-500", children: "Barrios de San Marcos ciudad" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-4 h-4 text-green-600" }), _jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Centros Poblados" }), _jsx("p", { className: "text-xs text-gray-500", children: "Agrupaciones de caser\u00EDos" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Home, { className: "w-4 h-4 text-orange-600" }), _jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Caser\u00EDos" }), _jsx("p", { className: "text-xs text-gray-500", children: "Caser\u00EDos independientes" })] })] })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, className: "grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: data.length }), _jsx("div", { className: "text-xs text-gray-600", children: "Localidades" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: data.reduce((sum, d) => sum + d.obras, 0) }), _jsx("div", { className: "text-xs text-gray-600", children: "Total Obras" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: new Intl.NumberFormat('es-PE', {
                                    notation: 'compact',
                                    maximumFractionDigits: 1
                                }).format(data.reduce((sum, d) => sum + d.inversion, 0)) }), _jsx("div", { className: "text-xs text-gray-600", children: "Inversi\u00F3n Total" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: [Math.round(data.reduce((sum, d) => sum + d.eficiencia, 0) / data.length), "%"] }), _jsx("div", { className: "text-xs text-gray-600", children: "Eficiencia Promedio" })] })] })] }));
};
export default MapaCalor;
