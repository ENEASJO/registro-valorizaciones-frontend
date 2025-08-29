import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Download, Eye, CheckCircle, Clock, AlertCircle, Filter, TrendingUp, DollarSign, Edit3, Archive, Construction } from 'lucide-react';
import { useValorizaciones } from '../../../hooks/useValorizaciones';
import { useObras } from '../../../hooks/useObras';
import { useEntidadesContratistas } from '../../../hooks/useEmpresas';
import FormularioValorizacionEjecucion from './FormularioValorizacionEjecucion';
import DetalleValorizacion from './DetalleValorizacion';
const ValorizacionEjecucion = () => {
    // Estados principales
    const [vistaActiva, setVistaActiva] = useState('lista');
    const [valorizacionSeleccionada, setValorizacionSeleccionada] = useState(null);
    // Estados de filtros
    const [filtros, setFiltros] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [obraFiltro, setObraFiltro] = useState();
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [showFiltrosAvanzados, setShowFiltrosAvanzados] = useState(false);
    // Hooks
    const { valorizacionesEjecucion, loading, error, estadisticasDashboard, cargarValorizaciones, formatearMoneda } = useValorizaciones();
    const { obras } = useObras();
    const { entidades } = useEntidadesContratistas();
    // Funciones de navegación
    const volverALista = useCallback(() => {
        setVistaActiva('lista');
        setValorizacionSeleccionada(null);
        cargarValorizaciones(filtros);
    }, [cargarValorizaciones, filtros]);
    const abrirFormulario = useCallback(() => {
        setVistaActiva('crear');
    }, []);
    const verDetalle = useCallback((id) => {
        setValorizacionSeleccionada(id);
        setVistaActiva('detalle');
    }, []);
    // Función para aplicar filtros
    const aplicarFiltros = useCallback(() => {
        const nuevosFiltros = {
            search: searchTerm || undefined,
            obra_id: obraFiltro,
            estado: estadoFiltro || undefined
        };
        setFiltros(nuevosFiltros);
        cargarValorizaciones(nuevosFiltros);
    }, [searchTerm, obraFiltro, estadoFiltro, cargarValorizaciones]);
    // Función para limpiar filtros
    const limpiarFiltros = useCallback(() => {
        setSearchTerm('');
        setObraFiltro(undefined);
        setEstadoFiltro('');
        setFiltros({});
        cargarValorizaciones();
    }, [cargarValorizaciones]);
    // Función para obtener icono de estado
    const getEstadoIcon = (estado) => {
        switch (estado.toUpperCase()) {
            case 'APROBADA':
                return _jsx(CheckCircle, { className: "w-5 h-5 text-green-500" });
            case 'EN_REVISION':
            case 'PRESENTADA':
                return _jsx(Clock, { className: "w-5 h-5 text-yellow-500" });
            case 'BORRADOR':
                return _jsx(Edit3, { className: "w-5 h-5 text-gray-500" });
            case 'OBSERVADA':
                return _jsx(AlertCircle, { className: "w-5 h-5 text-orange-500" });
            case 'PAGADA':
                return _jsx(DollarSign, { className: "w-5 h-5 text-blue-500" });
            case 'RECHAZADA':
                return _jsx(Archive, { className: "w-5 h-5 text-red-500" });
            default:
                return _jsx(Clock, { className: "w-5 h-5 text-gray-500" });
        }
    };
    // Función para obtener color de estado
    const getEstadoColor = (estado) => {
        switch (estado.toUpperCase()) {
            case 'APROBADA':
                return 'bg-green-100 text-green-800';
            case 'EN_REVISION':
            case 'PRESENTADA':
                return 'bg-yellow-100 text-yellow-800';
            case 'BORRADOR':
                return 'bg-gray-100 text-gray-800';
            case 'OBSERVADA':
                return 'bg-orange-100 text-orange-800';
            case 'PAGADA':
                return 'bg-blue-100 text-blue-800';
            case 'RECHAZADA':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    // Función para obtener nombre de obra
    const getNombreObra = (obraId) => {
        const obra = obras.find(o => o.id === obraId);
        return obra ? obra.nombre : 'Obra no encontrada';
    };
    // Función para obtener nombre de entidad ejecutora
    const getNombreEjecutora = (obraId) => {
        const obra = obras.find(o => o.id === obraId);
        if (!obra)
            return 'No disponible';
        const entidad = entidades.find(e => e.id === obra.entidad_ejecutora_id);
        return entidad ? entidad.nombre_completo : 'Entidad no encontrada';
    };
    // Renderizar vista actual
    if (vistaActiva === 'crear') {
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx("span", { children: "Valorizaciones" }), _jsx("span", { children: "/" }), _jsx("span", { className: "text-blue-600", children: "Valorizaci\u00F3n de Ejecuci\u00F3n" }), _jsx("span", { children: "/" }), _jsx("span", { className: "text-blue-600 font-medium", children: "Nueva Valorizaci\u00F3n" })] }), _jsx(FormularioValorizacionEjecucion, { onCancel: volverALista, onSuccess: volverALista })] }));
    }
    if (vistaActiva === 'detalle' && valorizacionSeleccionada) {
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx("span", { children: "Valorizaciones" }), _jsx("span", { children: "/" }), _jsx("span", { className: "text-blue-600", children: "Valorizaci\u00F3n de Ejecuci\u00F3n" }), _jsx("span", { children: "/" }), _jsx("span", { className: "text-blue-600 font-medium", children: "Detalle" })] }), _jsx(DetalleValorizacion, { valorizacionId: valorizacionSeleccionada, tipo: "ejecucion", onBack: volverALista })] }));
    }
    // Vista principal
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg", children: _jsx(Construction, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Valorizaci\u00F3n de Ejecuci\u00F3n" }), _jsx("p", { className: "text-blue-600 font-medium", children: "Control de valorizaciones de obras ejecutadas" })] })] }), _jsx("p", { className: "text-gray-600 mt-2 ml-15", children: "Gesti\u00F3n y seguimiento de valorizaciones de obras ejecutadas por empresas contratistas" })] }), _jsxs("button", { onClick: abrirFormulario, className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-lg transition-all duration-200 hover:shadow-xl", children: [_jsx(Plus, { className: "w-5 h-5" }), "Nueva Valorizaci\u00F3n"] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-4", children: [_jsx("div", { className: "card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-blue-600", children: "Total Valorizado" }), _jsx("p", { className: "text-2xl font-bold text-blue-900", children: estadisticasDashboard.totalValorizado })] }), _jsx(TrendingUp, { className: "w-8 h-8 text-blue-500 opacity-50" })] }) }), _jsx("div", { className: "card bg-gradient-to-r from-green-50 to-green-100 border-green-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-green-600", children: "Aprobadas" }), _jsx("p", { className: "text-2xl font-bold text-green-900", children: estadisticasDashboard.aprobadas })] }), _jsx(CheckCircle, { className: "w-8 h-8 text-green-500 opacity-50" })] }) }), _jsx("div", { className: "card bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-yellow-600", children: "Pendientes" }), _jsx("p", { className: "text-2xl font-bold text-yellow-900", children: estadisticasDashboard.pendientes })] }), _jsx(Clock, { className: "w-8 h-8 text-yellow-500 opacity-50" })] }) }), _jsx("div", { className: "card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-purple-600", children: "Pagadas" }), _jsx("p", { className: "text-2xl font-bold text-purple-900", children: estadisticasDashboard.pagadas })] }), _jsx(DollarSign, { className: "w-8 h-8 text-purple-500 opacity-50" })] }) })] }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("input", { type: "text", placeholder: "Buscar por n\u00FAmero, obra o empresa...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), onKeyPress: (e) => e.key === 'Enter' && aplicarFiltros(), className: "pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("select", { value: obraFiltro || '', onChange: (e) => setObraFiltro(e.target.value ? Number(e.target.value) : undefined), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-w-[200px]", children: [_jsx("option", { value: "", children: "Todas las obras" }), obras.map(obra => (_jsxs("option", { value: obra.id, children: [obra.numero_contrato, " - ", obra.nombre.substring(0, 50), "..."] }, obra.id)))] }), _jsxs("select", { value: estadoFiltro, onChange: (e) => setEstadoFiltro(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "Todos los estados" }), _jsx("option", { value: "BORRADOR", children: "Borrador" }), _jsx("option", { value: "PRESENTADA", children: "Presentada" }), _jsx("option", { value: "EN_REVISION", children: "En Revisi\u00F3n" }), _jsx("option", { value: "OBSERVADA", children: "Observada" }), _jsx("option", { value: "APROBADA", children: "Aprobada" }), _jsx("option", { value: "PAGADA", children: "Pagada" }), _jsx("option", { value: "RECHAZADA", children: "Rechazada" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: aplicarFiltros, className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors", children: [_jsx(Filter, { className: "w-4 h-4" }), "Filtrar"] }), _jsx("button", { onClick: limpiarFiltros, className: "bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors", children: "Limpiar" }), _jsxs("button", { className: "bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors", children: [_jsx(Download, { className: "w-4 h-4" }), "Exportar"] })] })] }), showFiltrosAvanzados && (_jsxs("div", { className: "border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Fecha desde" }), _jsx("input", { type: "date", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Fecha hasta" }), _jsx("input", { type: "date", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Solo con atraso" }), _jsxs("select", { className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "Todas" }), _jsx("option", { value: "true", children: "S\u00ED" }), _jsx("option", { value: "false", children: "No" })] })] })] })), _jsxs("button", { onClick: () => setShowFiltrosAvanzados(!showFiltrosAvanzados), className: "text-blue-600 hover:text-blue-800 text-sm font-medium self-start", children: [showFiltrosAvanzados ? 'Ocultar' : 'Mostrar', " filtros avanzados"] })] }) }), _jsx("div", { className: "card", children: loading ? (_jsxs("div", { className: "flex justify-center items-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" }), _jsx("span", { className: "ml-2 text-gray-600", children: "Cargando valorizaciones..." })] })) : error ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-red-500 mx-auto mb-4" }), _jsx("p", { className: "text-red-600 font-medium", children: error })] })) : valorizacionesEjecucion.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(FileText, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "No hay valorizaciones de ejecuci\u00F3n para mostrar" }), _jsxs("button", { onClick: abrirFormulario, className: "mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "Crear primera valorizaci\u00F3n"] })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-blue-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider", children: "N\u00FAmero / C\u00F3digo" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider", children: "Obra / Empresa" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider", children: "Periodo" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider", children: "Monto" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider", children: "Avance" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider", children: "Estado" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider", children: "Acciones" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: valorizacionesEjecucion.map((val, index) => (_jsxs(motion.tr, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, className: "hover:bg-blue-50 cursor-pointer transition-colors", onClick: () => verDetalle(val.id), children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-2", children: [getEstadoIcon(val.estado), _jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-gray-900", children: ["N\u00B0 ", val.numero_valorización || 'Sin número'] }), _jsx("div", { className: "text-xs text-gray-500", children: 'codigo_valorización' in val ? val.codigo_valorización : `EJE-${val.numero_valorización}` })] })] }) }), _jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-900 max-w-xs truncate", children: getNombreObra(val.obra_id) }), _jsx("div", { className: "text-sm text-gray-500", children: getNombreEjecutora(val.obra_id) })] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsxs("div", { className: "text-sm text-gray-900", children: [new Date(val.periodo_inicio).toLocaleDateString('es-PE'), " - ", ' ', new Date(val.periodo_fin).toLocaleDateString('es-PE')] }), _jsxs("div", { className: "text-xs text-gray-500", children: ['dias_periodo' in val ? val.dias_periodo : 0, " d\u00EDas"] })] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm font-semibold text-gray-900", children: formatearMoneda(val.monto_bruto) }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Neto: ", formatearMoneda(val.monto_neto)] })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]", children: _jsx("div", { className: "bg-blue-500 h-2 rounded-full", style: {
                                                                width: `${Math.min('porcentaje_avance_fisico_total' in val ? val.porcentaje_avance_fisico_total : 0, 100)}%`
                                                            } }) }), _jsxs("span", { className: "text-sm font-medium text-gray-700", children: ['porcentaje_avance_fisico_total' in val ? val.porcentaje_avance_fisico_total.toFixed(1) : '0.0', "%"] })] }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(val.estado)}`, children: val.estado.charAt(0) + val.estado.slice(1).toLowerCase().replace('_', ' ') }), val.dias_atraso > 0 && (_jsxs("div", { className: "text-xs text-red-600 mt-1", children: [val.dias_atraso, " d\u00EDas atraso"] }))] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: (e) => {
                                                            e.stopPropagation();
                                                            verDetalle(val.id);
                                                        }, className: "text-blue-600 hover:text-blue-900", title: "Ver detalles", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { onClick: (e) => e.stopPropagation(), className: "text-gray-600 hover:text-gray-900", title: "Descargar PDF", children: _jsx(Download, { className: "w-4 h-4" }) })] }) })] }, val.id))) })] }) })) })] }));
};
export default ValorizacionEjecucion;
