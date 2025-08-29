import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Download, Eye, CheckCircle, Clock, AlertCircle, Filter, Building, TrendingUp, DollarSign, Users, Edit3, Archive } from 'lucide-react';
import { useValorizaciones } from '../../hooks/useValorizaciones';
import { useObras } from '../../hooks/useObras';
import { useEntidadesContratistas } from '../../hooks/useEmpresas';
import FormularioValorizacionEjecucion from './components/FormularioValorizacionEjecucion';
import FormularioValorizacionSupervision from './components/FormularioValorizacionSupervision';
import DetalleValorizacion from './components/DetalleValorizacion';
const Valorizaciones = () => {
    // Estados principales
    const [tabActivo, setTabActivo] = useState('ejecucion');
    const [vistaActiva, setVistaActiva] = useState('lista');
    const [valorizacionSeleccionada, setValorizacionSeleccionada] = useState(null);
    // Estados de filtros
    const [filtros, setFiltros] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [obraFiltro, setObraFiltro] = useState();
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [showFiltrosAvanzados, setShowFiltrosAvanzados] = useState(false);
    // Hooks
    const { valorizacionesEjecucion, valorizacionesSupervision, loading, error, estadisticasDashboard, cargarValorizaciones, cambiarEstadoValorizacion, formatearMoneda } = useValorizaciones();
    const { obras } = useObras();
    const { entidades } = useEntidadesContratistas();
    // Funciones de navegación
    const volverALista = useCallback(() => {
        setVistaActiva('lista');
        setValorizacionSeleccionada(null);
        cargarValorizaciones(filtros);
    }, [cargarValorizaciones, filtros]);
    const abrirFormularioEjecucion = useCallback(() => {
        setVistaActiva('crear-ejecucion');
    }, []);
    const abrirFormularioSupervision = useCallback(() => {
        setVistaActiva('crear-supervision');
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
    if (vistaActiva === 'crear-ejecucion') {
        return (_jsx(FormularioValorizacionEjecucion, { onCancel: volverALista, onSuccess: volverALista }));
    }
    if (vistaActiva === 'crear-supervision') {
        return (_jsx(FormularioValorizacionSupervision, { onCancel: volverALista, onSuccess: volverALista }));
    }
    if (vistaActiva === 'detalle' && valorizacionSeleccionada) {
        return (_jsx(DetalleValorizacion, { valorizacionId: valorizacionSeleccionada, tipo: tabActivo === 'ejecucion' ? 'ejecucion' : 'supervision', onBack: volverALista }));
    }
    // Vista principal
    const valorizacionesActuales = tabActivo === 'ejecucion' ? valorizacionesEjecucion : valorizacionesSupervision;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Valorizaciones" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Control y seguimiento de valorizaciones de obras p\u00FAblicas municipales" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: abrirFormularioSupervision, className: "btn-secondary flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5" }), "Nueva Supervisi\u00F3n"] }), _jsxs("button", { onClick: abrirFormularioEjecucion, className: "btn-primary flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), "Nueva Ejecuci\u00F3n"] })] })] }), _jsx("div", { className: "border-b border-gray-200", children: _jsxs("nav", { className: "-mb-px flex space-x-8", children: [_jsx("button", { onClick: () => setTabActivo('ejecucion'), className: `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${tabActivo === 'ejecucion'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Building, { className: "w-5 h-5" }), "Valorizaciones de Ejecuci\u00F3n"] }) }), _jsx("button", { onClick: () => setTabActivo('supervision'), className: `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${tabActivo === 'supervision'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5" }), "Valorizaciones de Supervisi\u00F3n"] }) })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-4", children: [_jsx("div", { className: "card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-blue-600", children: "Total Valorizado" }), _jsx("p", { className: "text-2xl font-bold text-blue-900", children: estadisticasDashboard.totalValorizado })] }), _jsx(TrendingUp, { className: "w-8 h-8 text-blue-500 opacity-50" })] }) }), _jsx("div", { className: "card bg-gradient-to-r from-green-50 to-green-100 border-green-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-green-600", children: "Aprobadas" }), _jsx("p", { className: "text-2xl font-bold text-green-900", children: estadisticasDashboard.aprobadas })] }), _jsx(CheckCircle, { className: "w-8 h-8 text-green-500 opacity-50" })] }) }), _jsx("div", { className: "card bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-yellow-600", children: "Pendientes" }), _jsx("p", { className: "text-2xl font-bold text-yellow-900", children: estadisticasDashboard.pendientes })] }), _jsx(Clock, { className: "w-8 h-8 text-yellow-500 opacity-50" })] }) }), _jsx("div", { className: "card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-purple-600", children: "Pagadas" }), _jsx("p", { className: "text-2xl font-bold text-purple-900", children: estadisticasDashboard.pagadas })] }), _jsx(DollarSign, { className: "w-8 h-8 text-purple-500 opacity-50" })] }) }), _jsx("div", { className: "card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-orange-600", children: "Con Atraso" }), _jsx("p", { className: "text-2xl font-bold text-orange-900", children: estadisticasDashboard.conAtraso })] }), _jsx(AlertCircle, { className: "w-8 h-8 text-orange-500 opacity-50" })] }) })] }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("input", { type: "text", placeholder: "Buscar por n\u00FAmero, obra o empresa...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), onKeyPress: (e) => e.key === 'Enter' && aplicarFiltros(), className: "pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" })] }), _jsxs("select", { value: obraFiltro || '', onChange: (e) => setObraFiltro(e.target.value ? Number(e.target.value) : undefined), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 min-w-[200px]", children: [_jsx("option", { value: "", children: "Todas las obras" }), obras.map(obra => (_jsxs("option", { value: obra.id, children: [obra.numero_contrato, " - ", obra.nombre.substring(0, 50), "..."] }, obra.id)))] }), _jsxs("select", { value: estadoFiltro, onChange: (e) => setEstadoFiltro(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "", children: "Todos los estados" }), _jsx("option", { value: "BORRADOR", children: "Borrador" }), _jsx("option", { value: "PRESENTADA", children: "Presentada" }), _jsx("option", { value: "EN_REVISION", children: "En Revisi\u00F3n" }), _jsx("option", { value: "OBSERVADA", children: "Observada" }), _jsx("option", { value: "APROBADA", children: "Aprobada" }), _jsx("option", { value: "PAGADA", children: "Pagada" }), _jsx("option", { value: "RECHAZADA", children: "Rechazada" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: aplicarFiltros, className: "btn-primary flex items-center gap-2", children: [_jsx(Filter, { className: "w-4 h-4" }), "Filtrar"] }), _jsx("button", { onClick: limpiarFiltros, className: "btn-secondary", children: "Limpiar" }), _jsxs("button", { className: "btn-secondary flex items-center gap-2", children: [_jsx(Download, { className: "w-4 h-4" }), "Exportar"] })] })] }), showFiltrosAvanzados && (_jsxs("div", { className: "border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Fecha desde" }), _jsx("input", { type: "date", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Fecha hasta" }), _jsx("input", { type: "date", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Solo con atraso" }), _jsxs("select", { className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "", children: "Todas" }), _jsx("option", { value: "true", children: "S\u00ED" }), _jsx("option", { value: "false", children: "No" })] })] })] })), _jsxs("button", { onClick: () => setShowFiltrosAvanzados(!showFiltrosAvanzados), className: "text-primary-600 hover:text-primary-800 text-sm font-medium self-start", children: [showFiltrosAvanzados ? 'Ocultar' : 'Mostrar', " filtros avanzados"] })] }) }), _jsx("div", { className: "card", children: loading ? (_jsxs("div", { className: "flex justify-center items-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" }), _jsx("span", { className: "ml-2 text-gray-600", children: "Cargando valorizaciones..." })] })) : error ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-red-500 mx-auto mb-4" }), _jsx("p", { className: "text-red-600 font-medium", children: error })] })) : valorizacionesActuales.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(FileText, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "No hay valorizaciones para mostrar" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "N\u00FAmero / C\u00F3digo" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Obra / Empresa" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Periodo" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Monto" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Avance" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Estado" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Acciones" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: valorizacionesActuales.map((val, index) => (_jsxs(motion.tr, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, className: "hover:bg-gray-50 cursor-pointer", onClick: () => verDetalle(val.id), children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-2", children: [getEstadoIcon(val.estado), _jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-gray-900", children: ["N\u00B0 ", val.numero_valorización] }), _jsx("div", { className: "text-xs text-gray-500", children: 'codigo_valorización' in val ? val.codigo_valorización : `SUP-${val.numero_valorización}` })] })] }) }), _jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-900 max-w-xs truncate", children: getNombreObra(val.obra_id) }), _jsx("div", { className: "text-sm text-gray-500", children: getNombreEjecutora(val.obra_id) })] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsxs("div", { className: "text-sm text-gray-900", children: [new Date(val.periodo_inicio).toLocaleDateString('es-PE'), " - ", ' ', new Date(val.periodo_fin).toLocaleDateString('es-PE')] }), _jsxs("div", { className: "text-xs text-gray-500", children: [('dias_periodo' in val ? val.dias_periodo : 'dias_calendario_periodo' in val ? val.dias_calendario_periodo : 0), " d\u00EDas"] })] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm font-semibold text-gray-900", children: formatearMoneda(val.monto_bruto) }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Neto: ", formatearMoneda(val.monto_neto)] })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: tabActivo === 'ejecucion' ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]", children: _jsx("div", { className: "bg-primary-500 h-2 rounded-full", style: {
                                                                width: `${Math.min('porcentaje_avance_fisico_total' in val ? val.porcentaje_avance_fisico_total : 0, 100)}%`
                                                            } }) }), _jsxs("span", { className: "text-sm font-medium text-gray-700", children: ['porcentaje_avance_fisico_total' in val ? val.porcentaje_avance_fisico_total.toFixed(1) : '0.0', "%"] })] })) : (_jsxs("div", { className: "text-sm text-gray-900", children: ['dias_efectivos_trabajados' in val ? val.dias_efectivos_trabajados : 0, " d\u00EDas"] })) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(val.estado)}`, children: val.estado.charAt(0) + val.estado.slice(1).toLowerCase().replace('_', ' ') }), val.dias_atraso > 0 && (_jsxs("div", { className: "text-xs text-red-600 mt-1", children: [val.dias_atraso, " d\u00EDas atraso"] }))] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: (e) => {
                                                            e.stopPropagation();
                                                            verDetalle(val.id);
                                                        }, className: "text-primary-600 hover:text-primary-900", title: "Ver detalles", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { onClick: (e) => e.stopPropagation(), className: "text-gray-600 hover:text-gray-900", title: "Descargar PDF", children: _jsx(Download, { className: "w-4 h-4" }) })] }) })] }, val.id))) })] }) })) })] }));
};
export default Valorizaciones;
