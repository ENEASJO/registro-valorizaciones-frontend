import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Activity, TrendingUp, AlertTriangle } from 'lucide-react';
const PerformanceGauge = ({ value, title = "Eficiencia General", subtitle = "Obras en tiempo vs total", size = 'md', showLabels = true, animated = true }) => {
    const [isHovered, setIsHovered] = useState(false);
    // Validar y sanitizar el valor de entrada
    const sanitizedValue = typeof value === 'number' && !isNaN(value) && isFinite(value)
        ? Math.min(Math.max(value, 0), 100)
        : 0;
    // Configuración de tamaños
    const sizeConfig = {
        sm: { radius: 80, strokeWidth: 8, fontSize: 'text-xl' },
        md: { radius: 100, strokeWidth: 10, fontSize: 'text-3xl' },
        lg: { radius: 120, strokeWidth: 12, fontSize: 'text-4xl' }
    };
    const config = sizeConfig[size];
    const { radius, strokeWidth } = config;
    // Cálculos del círculo
    const circumference = 2 * Math.PI * radius;
    const center = radius + strokeWidth;
    const viewBoxSize = (radius + strokeWidth) * 2;
    // Animación del valor
    const progress = useMotionValue(0);
    const springProgress = useSpring(progress, {
        stiffness: 50,
        damping: 15,
        duration: 2000
    });
    const animatedStrokeDasharray = useTransform(springProgress, [0, 100], [0, circumference * 0.75] // 3/4 del círculo
    );
    const animatedValue = useTransform(springProgress, Math.round);
    useEffect(() => {
        if (animated) {
            progress.set(sanitizedValue);
        }
    }, [sanitizedValue, progress, animated]);
    // Determinar color basado en el valor
    const getPerformanceColor = (val) => {
        if (val >= 80)
            return {
                primary: '#10B981', // green-500
                secondary: '#D1FAE5', // green-100
                gradient: 'from-green-400 to-emerald-500',
                text: 'text-green-600'
            };
        if (val >= 60)
            return {
                primary: '#F59E0B', // amber-500
                secondary: '#FEF3C7', // amber-100
                gradient: 'from-amber-400 to-orange-500',
                text: 'text-amber-600'
            };
        return {
            primary: '#EF4444', // red-500
            secondary: '#FEE2E2', // red-100
            gradient: 'from-red-400 to-red-600',
            text: 'text-red-600'
        };
    };
    const colors = getPerformanceColor(sanitizedValue);
    const getPerformanceIcon = (val) => {
        if (val >= 80)
            return TrendingUp;
        if (val >= 60)
            return Activity;
        return AlertTriangle;
    };
    const PerformanceIcon = getPerformanceIcon(sanitizedValue);
    const getPerformanceLabel = (val) => {
        if (val >= 90)
            return 'Excelente';
        if (val >= 80)
            return 'Muy Bueno';
        if (val >= 70)
            return 'Bueno';
        if (val >= 60)
            return 'Regular';
        if (val >= 40)
            return 'Bajo';
        return 'Crítico';
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.6, type: "spring", stiffness: 100 }, className: "flex flex-col items-center p-6", onHoverStart: () => setIsHovered(true), onHoverEnd: () => setIsHovered(false), children: [showLabels && (_jsxs("div", { className: "text-center mb-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-1", children: title }), _jsx("p", { className: "text-sm text-gray-600", children: subtitle })] })), _jsxs("div", { className: "relative", children: [_jsxs("svg", { width: viewBoxSize, height: viewBoxSize, viewBox: `0 0 ${viewBoxSize} ${viewBoxSize}`, className: "transform -rotate-90", children: [_jsx("circle", { cx: center, cy: center, r: radius, stroke: "#F3F4F6", strokeWidth: strokeWidth, fill: "none", strokeDasharray: `${circumference * 0.75} ${circumference * 0.25}`, strokeLinecap: "round", className: "opacity-30" }), _jsxs("defs", { children: [_jsxs("linearGradient", { id: `gradient-${title}`, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: colors.primary, stopOpacity: "0.8" }), _jsx("stop", { offset: "100%", stopColor: colors.primary, stopOpacity: "1" })] }), _jsxs("filter", { id: `glow-${title}`, x: "-50%", y: "-50%", width: "200%", height: "200%", children: [_jsx("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }), _jsxs("feMerge", { children: [_jsx("feMergeNode", { in: "coloredBlur" }), _jsx("feMergeNode", { in: "SourceGraphic" })] })] })] }), _jsx(motion.circle, { cx: center, cy: center, r: radius, stroke: `url(#gradient-${title})`, strokeWidth: strokeWidth, fill: "none", strokeDasharray: `${animatedStrokeDasharray} ${circumference}`, strokeLinecap: "round", filter: isHovered ? `url(#glow-${title})` : 'none', className: "transition-all duration-300", initial: { strokeDasharray: `0 ${circumference}` }, animate: {
                                    strokeDasharray: animated
                                        ? `${animatedStrokeDasharray} ${circumference}`
                                        : `${(sanitizedValue / 100) * circumference * 0.75} ${circumference}`
                                }, transition: { duration: 2, ease: "easeInOut" } }), animated && (_jsx(motion.circle, { cx: center, cy: center, r: radius, stroke: colors.primary, strokeWidth: 1, fill: "none", opacity: 0, animate: {
                                    r: [radius, radius + 10],
                                    opacity: [0.5, 0]
                                }, transition: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                } }))] }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [_jsx(motion.div, { animate: {
                                    scale: isHovered ? 1.2 : 1,
                                    rotate: isHovered ? 360 : 0
                                }, transition: {
                                    duration: 0.3,
                                    rotate: { duration: 0.6 }
                                }, className: `mb-2 p-2 rounded-full bg-gradient-to-br ${colors.gradient} shadow-lg`, children: _jsx(PerformanceIcon, { className: "w-6 h-6 text-white" }) }), _jsxs(motion.div, { className: `font-bold ${colors.text} ${config.fontSize}`, children: [animated ? (_jsx(motion.span, { children: animatedValue })) : (_jsx("span", { children: sanitizedValue })), _jsx("span", { className: "text-lg", children: "%" })] }), _jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 1.5 }, className: `text-xs font-medium ${colors.text} mt-1`, children: getPerformanceLabel(sanitizedValue) })] }), _jsx(motion.div, { className: `absolute inset-0 rounded-full border-2 border-dashed ${colors.text.replace('text-', 'border-')} opacity-0`, animate: {
                            opacity: isHovered ? 0.3 : 0,
                            scale: isHovered ? 1.1 : 1
                        }, transition: { duration: 0.3 } })] }), showLabels && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.8 }, className: "flex justify-between w-full max-w-xs mt-4 text-xs", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-2 h-2 bg-red-400 rounded-full mx-auto mb-1" }), _jsx("span", { className: "text-gray-500", children: "0-40" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-2 h-2 bg-amber-400 rounded-full mx-auto mb-1" }), _jsx("span", { className: "text-gray-500", children: "40-80" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-2 h-2 bg-green-400 rounded-full mx-auto mb-1" }), _jsx("span", { className: "text-gray-500", children: "80-100" })] })] })), _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 1 }, className: "mt-4 text-center", children: _jsxs("div", { className: "grid grid-cols-3 gap-4 text-xs", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: Math.round(sanitizedValue * 0.24) }), _jsx("div", { className: "text-gray-500", children: "En tiempo" })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: Math.round((100 - sanitizedValue) * 0.24) }), _jsx("div", { className: "text-gray-500", children: "Retrasadas" })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: "24" }), _jsx("div", { className: "text-gray-500", children: "Total" })] })] }) })] }));
};
export default PerformanceGauge;
