import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// =================================================================
// COMPONENTE INDICADOR DE FUENTE DE DATOS
// Sistema de Valorizaciones - Frontend
// =================================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Building2, FileText, CheckCircle, AlertCircle, Info, Clock, Users, Award, ChevronDown, ChevronUp, X } from 'lucide-react';
// =================================================================
// CONSTANTES
// =================================================================
const FUENTES_INFO = {
    'SUNAT': {
        nombre: 'SUNAT',
        icono: _jsx(Building2, { className: "w-4 h-4" }),
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        descripcion: 'Superintendencia Nacional de Aduanas y de Administración Tributaria',
        url: 'https://www.sunat.gob.pe'
    },
    'OECE': {
        nombre: 'OECE',
        icono: _jsx(Award, { className: "w-4 h-4" }),
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        descripcion: 'Organismo Supervisor de las Contrataciones del Estado',
        url: 'https://www.osce.gob.pe'
    },
    'CONSOLIDADO': {
        nombre: 'Consolidado',
        icono: _jsx(Database, { className: "w-4 h-4" }),
        color: 'bg-green-100 text-green-800 border-green-200',
        descripcion: 'Sistema consolidado que combina múltiples fuentes oficiales'
    },
    'MANUAL': {
        nombre: 'Manual',
        icono: _jsx(FileText, { className: "w-4 h-4" }),
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        descripcion: 'Datos ingresados manualmente por el usuario'
    }
};
// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================
export const DataSourceIndicator = ({ fuentesUtilizadas = [], datosOriginales, ultimaActualizacion, mostrarDetalles = false, compact = false, className = '', consolidacionExitosa = true, advertencias = [], erroresFuentes = [], }) => {
    // =================================================================
    // ESTADO LOCAL
    // =================================================================
    const [mostrarModal, setMostrarModal] = useState(false);
    const [seccionExpandida, setSeccionExpandida] = useState(null);
    // =================================================================
    // HELPERS
    // =================================================================
    const obtenerEstadoConsolidacion = () => {
        if (!consolidacionExitosa)
            return { tipo: 'error', texto: 'Error en consolidación' };
        if (erroresFuentes.length > 0)
            return { tipo: 'warning', texto: 'Consolidación parcial' };
        if (fuentesUtilizadas.length > 1)
            return { tipo: 'success', texto: 'Consolidación exitosa' };
        if (fuentesUtilizadas.length === 1)
            return { tipo: 'info', texto: 'Una fuente consultada' };
        return { tipo: 'neutral', texto: 'Sin datos' };
    };
    const formatearFecha = (fecha) => {
        if (!fecha)
            return 'No disponible';
        try {
            return new Date(fecha).toLocaleString('es-PE', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        catch {
            return fecha;
        }
    };
    // =================================================================
    // RENDER COMPACT
    // =================================================================
    if (compact) {
        const estado = obtenerEstadoConsolidacion();
        return (_jsxs("div", { className: `inline-flex items-center gap-2 ${className}`, children: [_jsx("div", { className: "flex items-center gap-1", children: fuentesUtilizadas.map((fuente, index) => {
                        const info = FUENTES_INFO[fuente];
                        return (_jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${info?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`, title: info?.descripcion || fuente, children: [info?.icono, info?.nombre || fuente] }, index));
                    }) }), estado.tipo === 'error' && _jsx(AlertCircle, { className: "w-4 h-4 text-red-500" }), estado.tipo === 'warning' && _jsx(AlertCircle, { className: "w-4 h-4 text-yellow-500" }), estado.tipo === 'success' && _jsx(CheckCircle, { className: "w-4 h-4 text-green-500" }), estado.tipo === 'info' && _jsx(Info, { className: "w-4 h-4 text-blue-500" }), mostrarDetalles && (_jsx("button", { type: "button", onClick: () => setMostrarModal(true), className: "p-1 hover:bg-gray-100 rounded transition-colors", title: "Ver detalles de fuentes", children: _jsx(Info, { className: "w-4 h-4 text-gray-500" }) }))] }));
    }
    // =================================================================
    // RENDER COMPLETO
    // =================================================================
    const estado = obtenerEstadoConsolidacion();
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: `bg-white border border-gray-200 rounded-lg p-4 ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Database, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "text-md font-semibold text-gray-900", children: "Fuentes de Datos" })] }), _jsxs("div", { className: `flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${estado.tipo === 'error' ? 'bg-red-100 text-red-800' :
                                    estado.tipo === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                        estado.tipo === 'success' ? 'bg-green-100 text-green-800' :
                                            estado.tipo === 'info' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'}`, children: [estado.tipo === 'error' && _jsx(AlertCircle, { className: "w-4 h-4" }), estado.tipo === 'warning' && _jsx(AlertCircle, { className: "w-4 h-4" }), estado.tipo === 'success' && _jsx(CheckCircle, { className: "w-4 h-4" }), estado.tipo === 'info' && _jsx(Info, { className: "w-4 h-4" }), estado.texto] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: "Sistemas Consultados" }), _jsx("div", { className: "flex flex-wrap gap-2", children: fuentesUtilizadas.map((fuente, index) => {
                                            const info = FUENTES_INFO[fuente];
                                            return (_jsxs("div", { className: `flex items-center gap-2 px-3 py-2 rounded-lg border ${info?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`, children: [info?.icono, _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: info?.nombre || fuente }), _jsx("p", { className: "text-xs opacity-80", children: info?.descripcion })] })] }, index));
                                        }) })] }), ultimaActualizacion && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsxs("span", { children: ["\u00DAltima actualizaci\u00F3n: ", formatearFecha(ultimaActualizacion)] })] })), datosOriginales && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-200", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-4 h-4 text-blue-500" }), _jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-gray-900", children: datosOriginales.total_miembros }), _jsx("p", { className: "text-xs text-gray-600", children: "Representantes" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Award, { className: "w-4 h-4 text-purple-500" }), _jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-gray-900", children: datosOriginales.total_especialidades || 0 }), _jsx("p", { className: "text-xs text-gray-600", children: "Especialidades" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Database, { className: "w-4 h-4 text-green-500" }), _jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-gray-900", children: fuentesUtilizadas.length }), _jsx("p", { className: "text-xs text-gray-600", children: "Fuentes" })] })] })] })), advertencias.length > 0 && (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded p-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-yellow-800 text-sm font-medium mb-2", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), "Advertencias"] }), _jsxs("ul", { className: "text-yellow-700 text-sm space-y-1", children: [advertencias.slice(0, 3).map((advertencia, index) => (_jsxs("li", { children: ["\u2022 ", advertencia] }, index))), advertencias.length > 3 && (_jsxs("li", { className: "font-medium", children: ["y ", advertencias.length - 3, " m\u00E1s..."] }))] })] })), erroresFuentes.length > 0 && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded p-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-red-800 text-sm font-medium mb-2", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), "Errores en Fuentes"] }), _jsx("ul", { className: "text-red-700 text-sm space-y-1", children: erroresFuentes.map((error, index) => (_jsxs("li", { children: ["\u2022 ", error] }, index))) })] })), mostrarDetalles && datosOriginales && (_jsxs("button", { type: "button", onClick: () => setMostrarModal(true), className: "w-full mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2", children: [_jsx(Info, { className: "w-4 h-4" }), "Ver Detalles T\u00E9cnicos"] }))] })] }), _jsx(AnimatePresence, { children: mostrarModal && datosOriginales && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, className: "bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Detalles T\u00E9cnicos de Consolidaci\u00F3n" }), _jsx("button", { type: "button", onClick: () => setMostrarModal(false), className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-500" }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "border border-gray-200 rounded-lg", children: [_jsxs("button", { type: "button", onClick: () => setSeccionExpandida(seccionExpandida === 'general' ? null : 'general'), className: "w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors", children: [_jsx("span", { className: "font-medium text-gray-900", children: "Informaci\u00F3n General" }), seccionExpandida === 'general' ? (_jsx(ChevronUp, { className: "w-5 h-5 text-gray-500" })) : (_jsx(ChevronDown, { className: "w-5 h-5 text-gray-500" }))] }), _jsx(AnimatePresence, { children: seccionExpandida === 'general' && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "border-t border-gray-200 p-4 space-y-3", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "RUC:" }), _jsx("span", { className: "ml-2", children: datosOriginales.ruc })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Consolidaci\u00F3n:" }), _jsx("span", { className: "ml-2", children: datosOriginales.consolidacion_exitosa ? 'Exitosa' : 'Con errores' })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Timestamp:" }), _jsx("span", { className: "ml-2", children: formatearFecha(datosOriginales.timestamp) })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Tipo:" }), _jsx("span", { className: "ml-2", children: datosOriginales.tipo_persona || 'No especificado' })] })] }), datosOriginales.observaciones && datosOriginales.observaciones.length > 0 && (_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700 block mb-2", children: "Observaciones:" }), _jsx("ul", { className: "list-disc list-inside space-y-1 text-gray-600", children: datosOriginales.observaciones.map((obs, index) => (_jsx("li", { children: obs }, index))) })] }))] })) })] }), fuentesUtilizadas.map((fuente) => (_jsxs("div", { className: "border border-gray-200 rounded-lg", children: [_jsxs("button", { type: "button", onClick: () => setSeccionExpandida(seccionExpandida === fuente ? null : fuente), className: "w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3", children: [FUENTES_INFO[fuente]?.icono, _jsxs("span", { className: "font-medium text-gray-900", children: ["Detalles de ", FUENTES_INFO[fuente]?.nombre || fuente] })] }), seccionExpandida === fuente ? (_jsx(ChevronUp, { className: "w-5 h-5 text-gray-500" })) : (_jsx(ChevronDown, { className: "w-5 h-5 text-gray-500" }))] }), _jsx(AnimatePresence, { children: seccionExpandida === fuente && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "border-t border-gray-200 p-4", children: _jsxs("div", { className: "text-sm text-gray-600", children: [_jsxs("p", { children: ["Informaci\u00F3n t\u00E9cnica detallada de ", fuente] }), _jsx("p", { className: "mt-2", children: FUENTES_INFO[fuente]?.descripcion })] }) })) })] }, fuente)))] })] }) }) })) })] }));
};
export default DataSourceIndicator;
