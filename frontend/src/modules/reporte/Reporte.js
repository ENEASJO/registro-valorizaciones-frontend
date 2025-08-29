import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, BarChart, FileCheck, Presentation, Filter, Download, History, Settings, Eye, Trash, AlertCircle, CheckCircle } from 'lucide-react';
import { useReportes, useEstadisticasReportes } from '../../hooks/useReportes';
import { TIPOS_REPORTE } from '../../types/reporte.types';
// Componentes
import FiltrosAvanzados from './components/FiltrosAvanzados';
import ExportadorReporte from './components/ExportadorReporte';
import ReporteValorizacion from './components/ReporteValorizacion';
import ReporteAvanceObra from './components/ReporteAvanceObra';
import ReporteFinanciero from './components/ReporteFinanciero';
import ReporteContractual from './components/ReporteContractual';
import ReporteGerencial from './components/ReporteGerencial';
const Reporte = () => {
    const [tipoReporteActivo, setTipoReporteActivo] = useState('GERENCIAL_EJECUTIVO');
    const [vistaActiva, setVistaActiva] = useState('configuracion');
    const [mostrarExportador, setMostrarExportador] = useState(false);
    const { reportes, loading, error, generarReporte, obtenerDatosReporte, eliminarReporte, descargarReporte } = useReportes();
    const estadisticas = useEstadisticasReportes();
    // Estado de filtros y opciones
    const [filtros, setFiltros] = useState({
        periodo: 'MENSUAL',
        fechaInicio: new Date().toISOString().split('T')[0].replace(/-(\d{2})$/, '-01'),
        fechaFin: new Date().toISOString().split('T')[0],
        niveLDetalle: 'DETALLADO'
    });
    const [opciones, setOpciones] = useState({
        incluirGraficos: true,
        incluirResumenEjecutivo: true,
        incluirAnalisisComparativo: true,
        incluirRecomendaciones: true,
        incluirAnexos: false,
        incluirFotos: false,
        numerarPaginas: true
    });
    // Configuración de tipos de reporte con iconos y colores
    const configuracionTipos = useMemo(() => ({
        'VALORIZACION_MENSUAL': {
            icon: FileText,
            color: 'bg-blue-100 text-blue-700 border-blue-200',
            colorHover: 'hover:bg-blue-200',
            colorActivo: 'bg-blue-600 text-white'
        },
        'AVANCE_OBRA': {
            icon: BarChart,
            color: 'bg-green-100 text-green-700 border-green-200',
            colorHover: 'hover:bg-green-200',
            colorActivo: 'bg-green-600 text-white'
        },
        'FINANCIERO_CONSOLIDADO': {
            icon: TrendingUp,
            color: 'bg-amber-100 text-amber-700 border-amber-200',
            colorHover: 'hover:bg-amber-200',
            colorActivo: 'bg-amber-600 text-white'
        },
        'CONTROL_CONTRACTUAL': {
            icon: FileCheck,
            color: 'bg-purple-100 text-purple-700 border-purple-200',
            colorHover: 'hover:bg-purple-200',
            colorActivo: 'bg-purple-600 text-white'
        },
        'GERENCIAL_EJECUTIVO': {
            icon: Presentation,
            color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            colorHover: 'hover:bg-indigo-200',
            colorActivo: 'bg-indigo-600 text-white'
        }
    }), []);
    // Generar reporte
    const handleGenerarReporte = useCallback(async (configuracionExportacion) => {
        try {
            const solicitud = {
                tipo: tipoReporteActivo,
                nombre: `${TIPOS_REPORTE[tipoReporteActivo]} - ${new Date().toLocaleDateString('es-PE')}`,
                filtros,
                opciones,
                configuracionExportacion
            };
            const resultado = await generarReporte(solicitud);
            if (resultado.estado === 'COMPLETADO') {
                setVistaActiva('historial');
            }
            return {
                exito: true,
                rutaArchivo: resultado.rutaArchivo,
                urlDescarga: resultado.urlDescarga,
                tamaño: resultado.tamaño,
                tiempoGeneracion: resultado.tiempoGeneracion
            };
        }
        catch (error) {
            return {
                exito: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            };
        }
    }, [tipoReporteActivo, filtros, opciones, generarReporte]);
    // Obtener datos para vista previa
    const datosVistaPrevia = useMemo(() => {
        try {
            return obtenerDatosReporte(tipoReporteActivo, filtros);
        }
        catch (error) {
            console.error('Error al obtener datos:', error);
            return null;
        }
    }, [tipoReporteActivo, filtros, obtenerDatosReporte]);
    // Renderizar componente de reporte específico
    const renderizarVistaPrevia = () => {
        if (!datosVistaPrevia) {
            return (_jsxs("div", { className: "text-center py-12", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-red-500 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Error al cargar datos" }), _jsx("p", { className: "text-gray-600", children: "No se pudieron obtener los datos para la vista previa" })] }));
        }
        switch (tipoReporteActivo) {
            case 'VALORIZACION_MENSUAL':
                return _jsx(ReporteValorizacion, { datos: datosVistaPrevia, filtros: filtros });
            case 'AVANCE_OBRA':
                return _jsx(ReporteAvanceObra, { datos: datosVistaPrevia, filtros: filtros });
            case 'FINANCIERO_CONSOLIDADO':
                return _jsx(ReporteFinanciero, { datos: datosVistaPrevia, filtros: filtros });
            case 'CONTROL_CONTRACTUAL':
                return _jsx(ReporteContractual, { datos: datosVistaPrevia, filtros: filtros });
            case 'GERENCIAL_EJECUTIVO':
                return _jsx(ReporteGerencial, { datos: datosVistaPrevia, filtros: filtros });
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b border-gray-200", children: _jsx("div", { className: "max-w-7xl mx-auto px-6 py-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Centro de Reportes" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Sistema profesional de generaci\u00F3n y an\u00E1lisis de reportes" })] }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs("div", { className: "hidden lg:flex items-center gap-6 text-sm", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: estadisticas.totalReportes }), _jsx("div", { className: "text-gray-600", children: "Reportes" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: estadisticas.totalDescargas }), _jsx("div", { className: "text-gray-600", children: "Descargas" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-amber-600", children: [estadisticas.tiempoPromedioGeneracion.toFixed(1), "s"] }), _jsx("div", { className: "text-gray-600", children: "Tiempo Prom." })] })] }) })] }) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-6 py-6", children: _jsxs("div", { className: "flex gap-6", children: [_jsxs("div", { className: "w-80 space-y-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200", children: [_jsxs("div", { className: "p-6 border-b border-gray-200", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-1", children: "Tipo de Reporte" }), _jsx("p", { className: "text-sm text-gray-600", children: "Selecciona el tipo de an\u00E1lisis que necesitas" })] }), _jsx("div", { className: "p-4 space-y-2", children: Object.entries(TIPOS_REPORTE).map(([tipo, nombre]) => {
                                                const config = configuracionTipos[tipo];
                                                const IconComponent = config.icon;
                                                const esActivo = tipoReporteActivo === tipo;
                                                return (_jsxs("button", { onClick: () => setTipoReporteActivo(tipo), className: `w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${esActivo
                                                        ? config.colorActivo
                                                        : `${config.color} ${config.colorHover}`}`, children: [_jsx(IconComponent, { className: "w-5 h-5" }), _jsx("div", { children: _jsx("div", { className: "font-medium text-sm", children: nombre }) })] }, tipo));
                                            }) })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Navegaci\u00F3n" }) }), _jsx("div", { className: "p-4 space-y-2", children: [
                                                { id: 'configuracion', label: 'Configuración', icon: Filter },
                                                { id: 'vista-previa', label: 'Vista Previa', icon: Eye },
                                                { id: 'historial', label: 'Historial', icon: History }
                                            ].map(({ id, label, icon: Icon }) => (_jsxs("button", { onClick: () => setVistaActiva(id), className: `w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${vistaActiva === id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'}`, children: [_jsx(Icon, { className: "w-5 h-5" }), _jsx("span", { className: "font-medium", children: label })] }, id))) })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Acciones" }) }), _jsxs("div", { className: "p-4 space-y-3", children: [_jsxs("button", { onClick: () => setMostrarExportador(true), className: "w-full flex items-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: [_jsx(Download, { className: "w-5 h-5" }), _jsx("span", { className: "font-medium", children: "Generar Reporte" })] }), _jsxs("button", { className: "w-full flex items-center gap-3 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors", children: [_jsx(Settings, { className: "w-5 h-5" }), _jsx("span", { className: "font-medium", children: "Configurar Plantilla" })] })] })] })] }), _jsxs("div", { className: "flex-1", children: [vistaActiva === 'configuracion' && (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "space-y-6", children: [_jsx(FiltrosAvanzados, { filtros: filtros, onFiltrosChange: setFiltros, tipoReporte: tipoReporteActivo, onAplicar: () => setVistaActiva('vista-previa'), onReset: () => setFiltros({
                                                periodo: 'MENSUAL',
                                                fechaInicio: new Date().toISOString().split('T')[0].replace(/-(\d{2})$/, '-01'),
                                                fechaFin: new Date().toISOString().split('T')[0],
                                                niveLDetalle: 'DETALLADO'
                                            }) }), _jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200", children: [_jsxs("div", { className: "p-6 border-b border-gray-200", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Opciones de Presentaci\u00F3n" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Personaliza el contenido de tu reporte" })] }), _jsx("div", { className: "p-6 space-y-4", children: [
                                                        { key: 'incluirGraficos', label: 'Incluir gráficos y visualizaciones' },
                                                        { key: 'incluirResumenEjecutivo', label: 'Incluir resumen ejecutivo' },
                                                        { key: 'incluirAnalisisComparativo', label: 'Incluir análisis comparativo' },
                                                        { key: 'incluirRecomendaciones', label: 'Incluir recomendaciones' },
                                                        { key: 'incluirAnexos', label: 'Incluir anexos y documentación' },
                                                        { key: 'numerarPaginas', label: 'Numerar páginas' }
                                                    ].map(({ key, label }) => (_jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: opciones[key], onChange: (e) => setOpciones(prev => ({
                                                                    ...prev,
                                                                    [key]: e.target.checked
                                                                })), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: label })] }, key))) })] })] })), vistaActiva === 'vista-previa' && (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: ["Vista Previa - ", TIPOS_REPORTE[tipoReporteActivo]] }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [filtros.fechaInicio, " al ", filtros.fechaFin] })] }), _jsxs("button", { onClick: () => setMostrarExportador(true), className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: [_jsx(Download, { className: "w-4 h-4" }), "Exportar"] })] }) }), _jsx("div", { className: "max-h-[calc(100vh-300px)] overflow-y-auto", children: loading ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) })) : (renderizarVistaPrevia()) })] })), vistaActiva === 'historial' && (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "bg-white rounded-xl shadow-lg border border-gray-200", children: [_jsxs("div", { className: "p-6 border-b border-gray-200", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Historial de Reportes" }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [reportes.length, " reportes generados"] })] }), _jsxs("div", { className: "divide-y divide-gray-200", children: [reportes.map((reporte) => (_jsx("div", { className: "p-6 hover:bg-gray-50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `p-2 rounded-lg ${configuracionTipos[reporte.tipo].color}`, children: (() => {
                                                                                const IconComponent = configuracionTipos[reporte.tipo].icon;
                                                                                return _jsx(IconComponent, { className: "w-5 h-5" });
                                                                            })() }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900", children: reporte.nombre }), _jsxs("p", { className: "text-sm text-gray-600", children: [TIPOS_REPORTE[reporte.tipo], " \u2022 ", reporte.formato] })] })] }) }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [_jsxs("div", { className: "text-right", children: [_jsx("div", { className: "font-medium", children: new Date(reporte.fechaGeneracion).toLocaleDateString('es-PE') }), _jsxs("div", { className: "text-xs", children: [reporte.numeroDescargas, " descargas"] })] }), _jsx("div", { className: "flex items-center gap-1", children: reporte.estado === 'COMPLETADO' ? (_jsx(CheckCircle, { className: "w-4 h-4 text-green-600" })) : (_jsx(AlertCircle, { className: "w-4 h-4 text-amber-600" })) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => descargarReporte(reporte.id), className: "p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors", children: _jsx(Download, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => eliminarReporte(reporte.id), className: "p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors", children: _jsx(Trash, { className: "w-4 h-4" }) })] })] })] }) }, reporte.id))), reportes.length === 0 && (_jsxs("div", { className: "p-12 text-center", children: [_jsx(History, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "No hay reportes generados" }), _jsx("p", { className: "text-gray-600", children: "Genera tu primer reporte para verlo aqu\u00ED" })] }))] })] }))] })] }) }), mostrarExportador && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6", children: _jsxs("div", { className: "bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: ["Exportar ", TIPOS_REPORTE[tipoReporteActivo]] }), _jsx("button", { onClick: () => setMostrarExportador(false), className: "text-gray-400 hover:text-gray-600", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("div", { className: "p-6", children: _jsx(ExportadorReporte, { onExportar: handleGenerarReporte, nombreReporteBase: `${TIPOS_REPORTE[tipoReporteActivo]} ${new Date().toLocaleDateString('es-PE')}` }) })] }) })), error && (_jsx("div", { className: "fixed bottom-6 right-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5" }), _jsx("span", { children: error })] }) }))] }));
};
export default Reporte;
