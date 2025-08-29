import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertTriangle, Pause, Play, User, TrendingUp, Filter } from 'lucide-react';
const TimelineObras = ({ obras, onObracClick, maxVisible = 8 }) => {
    const [selectedObra, setSelectedObra] = useState(null);
    const [filter, setFilter] = useState('all');
    const [showAll, setShowAll] = useState(false);
    const getEstadoConfig = (estado) => {
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
    const getDaysRemaining = (fechaVencimiento) => {
        const now = new Date();
        const diff = fechaVencimiento.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };
    const getProgressColor = (avance, estado) => {
        if (estado === 'Retrasada')
            return 'bg-red-500';
        if (avance >= 80)
            return 'bg-green-500';
        if (avance >= 50)
            return 'bg-amber-500';
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
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Calendar, { className: "w-5 h-5 text-blue-600" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Timeline de Obras" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "w-4 h-4 text-gray-500" }), _jsx("div", { className: "flex gap-1", children: filterOptions.map((option) => (_jsxs("button", { onClick: () => setFilter(option.key), className: `px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${filter === option.key
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: [option.label, " (", option.count, ")"] }, option.key))) })] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200" }), _jsx("div", { className: "space-y-4", children: _jsx(AnimatePresence, { mode: "popLayout", children: visibleObras.map((obra, index) => {
                                const config = getEstadoConfig(obra.estado);
                                const IconComponent = config.icon;
                                const daysRemaining = getDaysRemaining(obra.fechaVencimiento);
                                const isSelected = selectedObra === obra.id;
                                const progressColor = getProgressColor(obra.avance, obra.estado);
                                return (_jsxs(motion.div, { layout: true, initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: {
                                        duration: 0.3,
                                        delay: index * 0.05,
                                        layout: { duration: 0.2 }
                                    }, className: "relative group", children: [_jsx(motion.div, { className: `absolute left-4 w-4 h-4 rounded-full border-4 border-white shadow-lg ${config.color} z-10`, animate: config.pulse ? {
                                                scale: [1, 1.2, 1],
                                                boxShadow: [
                                                    '0 0 0 0 rgba(59, 130, 246, 0)',
                                                    '0 0 0 10px rgba(59, 130, 246, 0.1)',
                                                    '0 0 0 0 rgba(59, 130, 246, 0)'
                                                ]
                                            } : {}, transition: {
                                                duration: 2,
                                                repeat: config.pulse ? Infinity : 0,
                                                ease: "easeInOut"
                                            } }), _jsxs(motion.div, { className: `ml-12 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${isSelected ? 'border-blue-300 shadow-lg' : 'border-gray-200 hover:border-gray-300'} ${config.bgColor} group-hover:shadow-md`, onClick: () => {
                                                setSelectedObra(isSelected ? null : obra.id);
                                                onObracClick?.(obra.id);
                                            }, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(IconComponent, { className: `w-4 h-4 ${config.textColor}` }), _jsx("span", { className: `text-xs font-medium px-2 py-1 rounded-full ${config.bgColor} ${config.textColor} border ${config.textColor.replace('text-', 'border-')}`, children: obra.estado })] }), _jsx("h4", { className: "font-medium text-gray-900 mb-1 line-clamp-2", children: obra.nombre }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600 mb-3", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(User, { className: "w-3 h-3" }), _jsx("span", { className: "truncate", children: obra.contratista })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), _jsx("span", { className: daysRemaining < 0 ? 'text-red-600 font-medium' :
                                                                                        daysRemaining <= 7 ? 'text-amber-600 font-medium' : '', children: daysRemaining < 0 ? `${Math.abs(daysRemaining)} días vencida` :
                                                                                        daysRemaining === 0 ? 'Vence hoy' :
                                                                                            `${daysRemaining} días restantes` })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "text-gray-500", children: "Avance" }), _jsxs("span", { className: "font-medium", children: [obra.avance, "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 overflow-hidden", children: _jsx(motion.div, { className: `h-full rounded-full ${progressColor}`, initial: { width: 0 }, animate: { width: `${obra.avance}%` }, transition: { duration: 1, delay: index * 0.1 } }) })] }), _jsx(AnimatePresence, { children: isSelected && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.3 }, className: "mt-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4 text-xs", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Fecha inicio:" }), _jsx("div", { className: "font-medium", children: obra.fechaInicio.toLocaleDateString('es-ES') })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Fecha vencimiento:" }), _jsx("div", { className: "font-medium", children: obra.fechaVencimiento.toLocaleDateString('es-ES') })] })] }), _jsxs("div", { className: "flex items-center justify-between mt-3 p-3 bg-white/50 rounded-lg", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-bold text-gray-900", children: Math.round((new Date().getTime() - obra.fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) }), _jsx("div", { className: "text-xs text-gray-500", children: "D\u00EDas transcurridos" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-bold text-gray-900", children: Math.round((obra.fechaVencimiento.getTime() - obra.fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) }), _jsx("div", { className: "text-xs text-gray-500", children: "Duraci\u00F3n total" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: `text-lg font-bold ${obra.avance >= 80 ? 'text-green-600' : obra.avance >= 50 ? 'text-amber-600' : 'text-red-600'}`, children: ((obra.avance / 100) * Math.round((obra.fechaVencimiento.getTime() - obra.fechaInicio.getTime()) / (1000 * 60 * 60 * 24))).toFixed(0) }), _jsx("div", { className: "text-xs text-gray-500", children: "D\u00EDas productivos" })] })] })] })) })] }), _jsx("div", { className: "flex flex-col items-end gap-2", children: _jsx(motion.div, { animate: { rotate: obra.avance > 50 ? 0 : 180 }, className: `p-1 rounded-full ${obra.avance > 50 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`, children: _jsx(TrendingUp, { className: "w-3 h-3" }) }) })] }), _jsx(motion.div, { className: "absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" })] })] }, obra.id));
                            }) }) }), filteredObras.length > maxVisible && (_jsx("div", { className: "flex justify-center mt-6", children: _jsx("button", { onClick: () => setShowAll(!showAll), className: "px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors", children: showAll ? 'Mostrar menos' : `Ver todas (${filteredObras.length - maxVisible} más)` }) })), filteredObras.length === 0 && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-center py-12", children: [_jsx(Calendar, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), _jsx("p", { className: "text-gray-500", children: "No hay obras para mostrar" }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: filter !== 'all' && 'Prueba cambiando los filtros' })] }))] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, className: "grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: filteredObras.filter(o => o.estado === 'En ejecución').length }), _jsx("div", { className: "text-xs text-gray-600", children: "En Ejecuci\u00F3n" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: filteredObras.filter(o => o.estado === 'Finalizada').length }), _jsx("div", { className: "text-xs text-gray-600", children: "Finalizadas" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-red-600", children: filteredObras.filter(o => o.estado === 'Retrasada').length }), _jsx("div", { className: "text-xs text-gray-600", children: "Retrasadas" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-gray-600", children: [Math.round(filteredObras.reduce((acc, obra) => acc + obra.avance, 0) / filteredObras.length) || 0, "%"] }), _jsx("div", { className: "text-xs text-gray-600", children: "Avance Promedio" })] })] })] }));
};
export default TimelineObras;
