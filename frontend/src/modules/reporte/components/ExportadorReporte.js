import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, FileSpreadsheet, File, Download, Mail, Printer, Settings, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import { FORMATOS_EXPORTACION } from '../../../types/reporte.types';
const ExportadorReporte = ({ onExportar, nombreReporteBase, className = '' }) => {
    const [configuracion, setConfiguracion] = useState({
        formato: 'PDF',
        nombreArchivo: nombreReporteBase,
        incluirPortada: true,
        incluirIndice: true,
        incluirGraficos: true,
        incluirAnexos: false,
        configuracionPDF: {
            orientacion: 'portrait',
            tamaño: 'A4',
            margen: 20,
            fuente: 'Arial',
            tamañoFuente: 12,
            numerarPaginas: true
        },
        configuracionExcel: {
            incluirFormulas: true,
            incluirGraficos: true,
            protegerHojas: false
        }
    });
    const [exportando, setExportando] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
    const iconosFormato = {
        PDF: _jsx(FileText, { className: "w-6 h-6" }),
        EXCEL: _jsx(FileSpreadsheet, { className: "w-6 h-6" }),
        WORD: _jsx(File, { className: "w-6 h-6" }),
        CSV: _jsx(FileSpreadsheet, { className: "w-6 h-6" })
    };
    const coloresFormato = {
        PDF: 'text-red-600 bg-red-100 border-red-200',
        EXCEL: 'text-green-600 bg-green-100 border-green-200',
        WORD: 'text-blue-600 bg-blue-100 border-blue-200',
        CSV: 'text-gray-600 bg-gray-100 border-gray-200'
    };
    const actualizarConfiguracion = (campo, valor) => {
        setConfiguracion(prev => ({ ...prev, [campo]: valor }));
    };
    const actualizarConfiguracionPDF = (campo, valor) => {
        setConfiguracion(prev => ({
            ...prev,
            configuracionPDF: {
                ...prev.configuracionPDF,
                [campo]: valor
            }
        }));
    };
    const actualizarConfiguracionExcel = (campo, valor) => {
        setConfiguracion(prev => ({
            ...prev,
            configuracionExcel: {
                ...prev.configuracionExcel,
                [campo]: valor
            }
        }));
    };
    const handleExportar = async () => {
        setExportando(true);
        setResultado(null);
        try {
            const resultado = await onExportar(configuracion);
            setResultado(resultado);
            if (resultado.exito && resultado.urlDescarga) {
                // Iniciar descarga automática
                const link = document.createElement('a');
                link.href = resultado.urlDescarga;
                link.download = configuracion.nombreArchivo;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        catch (error) {
            setResultado({
                exito: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
        finally {
            setExportando(false);
        }
    };
    const formatearTamaño = (bytes) => {
        if (bytes < 1024)
            return `${bytes} B`;
        if (bytes < 1024 * 1024)
            return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    return (_jsxs("div", { className: `bg-white rounded-xl shadow-lg border border-gray-200 ${className}`, children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: _jsx(Download, { className: "w-5 h-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Exportar Reporte" }), _jsx("p", { className: "text-sm text-gray-600", children: "Configure las opciones de exportaci\u00F3n" })] })] }), _jsxs("button", { onClick: () => setMostrarConfiguracion(!mostrarConfiguracion), className: "flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors", children: [_jsx(Settings, { className: "w-4 h-4" }), "Configuraci\u00F3n"] })] }) }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Formato de Exportaci\u00F3n" }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: Object.entries(FORMATOS_EXPORTACION).map(([key, label]) => (_jsx("button", { onClick: () => actualizarConfiguracion('formato', key), className: `p-4 border-2 rounded-lg transition-all ${configuracion.formato === key
                                        ? `${coloresFormato[key]} border-current`
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800'}`, children: _jsxs("div", { className: "flex flex-col items-center gap-2", children: [iconosFormato[key], _jsx("span", { className: "text-sm font-medium", children: label })] }) }, key))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nombre del Archivo" }), _jsx("input", { type: "text", value: configuracion.nombreArchivo, onChange: (e) => actualizarConfiguracion('nombreArchivo', e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Nombre del archivo sin extensi\u00F3n" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Contenido a Incluir" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: configuracion.incluirPortada, onChange: (e) => actualizarConfiguracion('incluirPortada', e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Incluir portada" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: configuracion.incluirIndice, onChange: (e) => actualizarConfiguracion('incluirIndice', e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Incluir \u00EDndice" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: configuracion.incluirGraficos, onChange: (e) => actualizarConfiguracion('incluirGraficos', e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Incluir gr\u00E1ficos" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: configuracion.incluirAnexos, onChange: (e) => actualizarConfiguracion('incluirAnexos', e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Incluir anexos" })] })] })] }), mostrarConfiguracion && (_jsxs(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "border-t border-gray-200 pt-6 space-y-6", children: [configuracion.formato === 'PDF' && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 mb-3", children: "Configuraci\u00F3n PDF" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Orientaci\u00F3n" }), _jsxs("select", { value: configuracion.configuracionPDF?.orientacion, onChange: (e) => actualizarConfiguracionPDF('orientacion', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm", children: [_jsx("option", { value: "portrait", children: "Vertical" }), _jsx("option", { value: "landscape", children: "Horizontal" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Tama\u00F1o de P\u00E1gina" }), _jsxs("select", { value: configuracion.configuracionPDF?.tamaño, onChange: (e) => actualizarConfiguracionPDF('tamaño', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm", children: [_jsx("option", { value: "A4", children: "A4" }), _jsx("option", { value: "A3", children: "A3" }), _jsx("option", { value: "Letter", children: "Letter" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Margen (mm)" }), _jsx("input", { type: "number", value: configuracion.configuracionPDF?.margen, onChange: (e) => actualizarConfiguracionPDF('margen', Number(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm", min: "10", max: "50" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Tama\u00F1o de Fuente" }), _jsx("input", { type: "number", value: configuracion.configuracionPDF?.tamañoFuente, onChange: (e) => actualizarConfiguracionPDF('tamañoFuente', Number(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm", min: "8", max: "16" })] })] }), _jsx("div", { className: "mt-3", children: _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: configuracion.configuracionPDF?.numerarPaginas, onChange: (e) => actualizarConfiguracionPDF('numerarPaginas', e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Numerar p\u00E1ginas" })] }) }), _jsxs("div", { className: "mt-3", children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Marca de Agua (opcional)" }), _jsx("input", { type: "text", value: configuracion.configuracionPDF?.marcaAgua || '', onChange: (e) => actualizarConfiguracionPDF('marcaAgua', e.target.value || undefined), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm", placeholder: "Texto de marca de agua" })] })] })), configuracion.formato === 'EXCEL' && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 mb-3", children: "Configuraci\u00F3n Excel" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: configuracion.configuracionExcel?.incluirFormulas, onChange: (e) => actualizarConfiguracionExcel('incluirFormulas', e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Incluir f\u00F3rmulas" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: configuracion.configuracionExcel?.incluirGraficos, onChange: (e) => actualizarConfiguracionExcel('incluirGraficos', e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Incluir gr\u00E1ficos en hojas separadas" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: configuracion.configuracionExcel?.protegerHojas, onChange: (e) => actualizarConfiguracionExcel('protegerHojas', e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Proteger hojas contra modificaci\u00F3n" })] })] })] }))] })), (exportando || resultado) && (_jsxs("div", { className: "border-t border-gray-200 pt-6", children: [exportando && (_jsxs("div", { className: "flex items-center gap-3 p-4 bg-blue-50 rounded-lg", children: [_jsx(Clock, { className: "w-5 h-5 text-blue-600 animate-spin" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-blue-900", children: "Generando reporte..." }), _jsx("div", { className: "text-sm text-blue-600", children: "Esto puede tomar unos momentos" })] })] })), resultado && (_jsxs("div", { className: `flex items-start gap-3 p-4 rounded-lg ${resultado.exito
                                    ? 'bg-green-50 text-green-900'
                                    : 'bg-red-50 text-red-900'}`, children: [resultado.exito ? (_jsx(CheckCircle, { className: "w-5 h-5 text-green-600 mt-0.5" })) : (_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 mt-0.5" })), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium", children: resultado.exito ? 'Reporte generado exitosamente' : 'Error al generar reporte' }), _jsx("div", { className: "text-sm mt-1", children: resultado.exito ? (_jsxs("div", { className: "space-y-1", children: [resultado.tamaño && _jsxs("div", { children: ["Tama\u00F1o: ", formatearTamaño(resultado.tamaño)] }), resultado.tiempoGeneracion && _jsxs("div", { children: ["Tiempo: ", resultado.tiempoGeneracion, "s"] }), _jsx("div", { children: "La descarga deber\u00EDa iniciarse autom\u00E1ticamente" })] })) : (_jsx("div", { children: resultado.error })) })] }), _jsx("button", { onClick: () => setResultado(null), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-4 h-4" }) })] }))] })), _jsx("div", { className: "border-t border-gray-200 pt-6", children: _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: handleExportar, disabled: exportando || !configuracion.nombreArchivo, className: "flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: [_jsx(Download, { className: "w-5 h-5" }), exportando ? 'Generando...' : 'Exportar Reporte'] }), _jsxs("button", { className: "flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors", children: [_jsx(Mail, { className: "w-5 h-5" }), "Enviar por Email"] }), _jsxs("button", { className: "flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors", children: [_jsx(Printer, { className: "w-5 h-5" }), "Imprimir"] })] }) })] })] }));
};
export default ExportadorReporte;
