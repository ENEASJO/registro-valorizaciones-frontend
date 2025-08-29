import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, X, Clock, Eye, EyeOff, Bell } from 'lucide-react';
const AlertPanel = ({ alerts, onMarkAsRead, onDismiss, maxVisible = 5 }) => {
    const [expandedAlert, setExpandedAlert] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const getAlertIcon = (type) => {
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
    const getAlertColors = (type) => {
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
                    icon: 'text-gray-500',
                    title: 'text-gray-800',
                    message: 'text-gray-700',
                    pulse: 'bg-gray-400'
                };
        }
    };
    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (minutes < 1)
            return 'Ahora mismo';
        if (minutes < 60)
            return `${minutes}m`;
        if (hours < 24)
            return `${hours}h`;
        return `${days}d`;
    };
    const visibleAlerts = showAll ? alerts : alerts.slice(0, maxVisible);
    const unreadCount = alerts.filter(alert => !alert.read).length;
    const criticalCount = alerts.filter(alert => alert.type === 'critical' && !alert.read).length;
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(motion.div, { animate: {
                                    scale: criticalCount > 0 ? [1, 1.1, 1] : 1,
                                }, transition: {
                                    duration: 1,
                                    repeat: criticalCount > 0 ? Infinity : 0,
                                    ease: "easeInOut"
                                }, children: _jsx(Bell, { className: "w-5 h-5 text-gray-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Alertas y Notificaciones" }), unreadCount > 0 && (_jsx(motion.span, { initial: { scale: 0 }, animate: { scale: 1 }, className: "px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full", children: unreadCount }))] }), alerts.length > maxVisible && (_jsxs("button", { onClick: () => setShowAll(!showAll), className: "flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors", children: [showAll ? _jsx(EyeOff, { className: "w-4 h-4" }) : _jsx(Eye, { className: "w-4 h-4" }), showAll ? 'Mostrar menos' : `Ver todas (${alerts.length})`] }))] }), _jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto custom-scrollbar", children: _jsx(AnimatePresence, { mode: "popLayout", children: visibleAlerts.map((alert, index) => {
                        const IconComponent = getAlertIcon(alert.type);
                        const colors = getAlertColors(alert.type);
                        const isExpanded = expandedAlert === alert.id;
                        return (_jsxs(motion.div, { layout: true, initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20, height: 0 }, transition: {
                                duration: 0.3,
                                delay: index * 0.05,
                                layout: { duration: 0.2 }
                            }, className: `relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group hover:shadow-md ${colors.bg} ${colors.border} ${!alert.read ? 'ring-2 ring-offset-2 ring-blue-100' : ''}`, onClick: () => {
                                if (!alert.read) {
                                    onMarkAsRead(alert.id);
                                }
                                setExpandedAlert(isExpanded ? null : alert.id);
                            }, children: [!alert.read && (_jsx(motion.div, { className: `absolute -top-1 -right-1 w-3 h-3 rounded-full ${colors.pulse}`, animate: {
                                        scale: [1, 1.3, 1],
                                        opacity: [0.7, 1, 0.7]
                                    }, transition: {
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    } })), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(motion.div, { animate: alert.type === 'critical' && !alert.read ? {
                                                rotate: [0, -5, 5, -5, 5, 0],
                                            } : {}, transition: {
                                                duration: 0.5,
                                                repeat: alert.type === 'critical' && !alert.read ? Infinity : 0,
                                                repeatDelay: 3
                                            }, className: "flex-shrink-0", children: _jsx(IconComponent, { className: `w-5 h-5 ${colors.icon}` }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h4", { className: `font-medium text-sm ${colors.title}`, children: alert.title }), !alert.read && (_jsx("span", { className: "w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" }))] }), _jsx(motion.p, { className: `text-sm leading-relaxed ${colors.message}`, initial: false, animate: {
                                                        opacity: isExpanded ? 1 : 0.8,
                                                        height: isExpanded ? 'auto' : '1.5rem'
                                                    }, style: {
                                                        overflow: isExpanded ? 'visible' : 'hidden',
                                                        textOverflow: isExpanded ? 'clip' : 'ellipsis',
                                                        whiteSpace: isExpanded ? 'normal' : 'nowrap'
                                                    }, children: alert.message }), _jsxs("div", { className: "flex items-center gap-2 mt-2 text-xs text-gray-500", children: [_jsx(Clock, { className: "w-3 h-3" }), _jsx("span", { children: formatTimeAgo(alert.timestamp) })] })] }), onDismiss && (_jsx(motion.button, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: (e) => {
                                                e.stopPropagation();
                                                onDismiss(alert.id);
                                            }, className: "flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/50 transition-colors", children: _jsx(X, { className: "w-4 h-4" }) }))] }), _jsx(motion.div, { className: "absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none", whileHover: { scale: 1.01 } })] }, alert.id));
                    }) }) }), alerts.length === 0 && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "text-center py-8", children: [_jsx(motion.div, { animate: {
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.05, 1]
                        }, transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }, children: _jsx(Bell, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }) }), _jsx("p", { className: "text-gray-500", children: "No hay alertas pendientes" }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "\u00A1Todo est\u00E1 funcionando correctamente!" })] })), alerts.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.5 }, className: "flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-4 text-xs", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-2 h-2 bg-red-400 rounded-full" }), alerts.filter(a => a.type === 'critical').length, " Cr\u00EDticas"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-2 h-2 bg-amber-400 rounded-full" }), alerts.filter(a => a.type === 'warning').length, " Advertencias"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-2 h-2 bg-blue-400 rounded-full" }), alerts.filter(a => a.type === 'info').length, " Informaci\u00F3n"] })] }), _jsxs("div", { className: "text-xs text-gray-500", children: [unreadCount, " sin leer"] })] }))] }));
};
export default AlertPanel;
