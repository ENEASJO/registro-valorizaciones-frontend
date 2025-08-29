import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash, MapPin, Calendar, DollarSign, Building2, AlertCircle, CheckCircle, TrendingUp, Clock, BarChart, Eye, Filter, Construction, Calculator } from 'lucide-react';
import { ESTADOS_OBRA, TIPOS_OBRA } from '../../types/obra.types';
import { useObras } from '../../hooks/useObras';
import { useEntidadesContratistas } from '../../hooks/useEmpresas';
import FormularioObra from './components/FormularioObra';
import DetalleObra from './components/DetalleObra';
const Obras = () => {
    const { obras, loading, error, cargarObras, crearObra, obtenerEstadisticas } = useObras();
    const { entidades } = useEntidadesContratistas();
    const [modalAbierto, setModalAbierto] = useState(null);
    const [obraSeleccionada, setObraSeleccionada] = useState(null);
    const [loadingModal, setLoadingModal] = useState(false);
    const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [filtros, setFiltros] = useState({
        search: '',
        estado: undefined,
        entidad_ejecutora_id: undefined,
        entidad_supervisora_id: undefined,
        tipo_obra: undefined
    });
    // Función para mostrar mensajes temporales
    const mostrarMensaje = (tipo, texto) => {
        setMensaje({ tipo, texto });
        setTimeout(() => setMensaje(null), 5000);
    };
    // Handlers para modales
    const abrirModalCrear = () => {
        setModalAbierto('crear');
    };
    const abrirModalEditar = (obraId) => {
        setObraSeleccionada(obraId);
        setModalAbierto('editar');
    };
    const abrirDetalleObra = (obraId) => {
        setObraSeleccionada(obraId);
        setModalAbierto('detalle');
    };
    const cerrarModal = () => {
        setModalAbierto(null);
        setObraSeleccionada(null);
    };
    // Handler para crear obra
    const handleSubmitObra = async (params) => {
        setLoadingModal(true);
        try {
            await crearObra(params);
            mostrarMensaje('success', 'Obra creada correctamente');
            cerrarModal();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al crear obra';
            mostrarMensaje('error', errorMessage);
            throw error; // Re-throw para que el modal maneje el error
        }
        finally {
            setLoadingModal(false);
        }
    };
    // Handler para eliminar obra
    const handleEliminarObra = async (obraId) => {
        const obra = obras.find(o => o.id === obraId);
        if (!obra)
            return;
        if (!confirm(`¿Estás seguro de que quieres eliminar la obra "${obra.nombre}"?`)) {
            return;
        }
        try {
            // TODO: Implementar eliminación
            mostrarMensaje('success', 'Obra eliminada correctamente');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al eliminar obra';
            mostrarMensaje('error', errorMessage);
        }
    };
    // Función para actualizar filtros
    const actualizarFiltros = (nuevosFiltros) => {
        const filtrosActualizados = { ...filtros, ...nuevosFiltros };
        setFiltros(filtrosActualizados);
        cargarObras(filtrosActualizados);
    };
    const getEstadoConfig = (estado) => {
        switch (estado) {
            case 'REGISTRADA':
                return { color: 'bg-gray-100 text-gray-800', icon: Clock };
            case 'EN_EJECUCION':
                return { color: 'bg-blue-100 text-blue-800', icon: Construction };
            case 'PARALIZADA':
                return { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
            case 'TERMINADA':
                return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
            case 'LIQUIDADA':
                return { color: 'bg-purple-100 text-purple-800', icon: Calculator };
            case 'CANCELADA':
                return { color: 'bg-red-100 text-red-800', icon: AlertCircle };
            default:
                return { color: 'bg-gray-100 text-gray-800', icon: Clock };
        }
    };
    const getAvanceColor = (avance) => {
        if (avance < 25)
            return 'bg-red-500';
        if (avance < 50)
            return 'bg-yellow-500';
        if (avance < 75)
            return 'bg-blue-500';
        return 'bg-green-500';
    };
    // Obtener nombre de entidad
    const getNombreEntidad = (entidadId) => {
        const entidad = entidades.find(e => e.id === entidadId);
        return entidad ? entidad.nombre_completo : 'Entidad no encontrada';
    };
    // Calcular estadísticas básicas
    const estadisticas = {
        total: obras.length,
        activas: obras.filter(o => o.estado === 'EN_EJECUCION').length,
        terminadas: obras.filter(o => o.estado === 'TERMINADA').length,
        paralizadas: obras.filter(o => o.estado === 'PARALIZADA').length,
        montoTotal: obras.reduce((sum, o) => sum + o.monto_total, 0)
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Obras P\u00FAblicas" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Gesti\u00F3n integral de obras de infraestructura municipal" })] }), _jsxs("button", { onClick: abrirModalCrear, className: "btn-primary flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), "Nueva Obra"] })] }), _jsx(AnimatePresence, { children: mensaje && (_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: `p-4 rounded-lg flex items-center gap-3 ${mensaje.tipo === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'}`, children: [mensaje.tipo === 'success' ? (_jsx(CheckCircle, { className: "w-5 h-5 text-green-600" })) : (_jsx(AlertCircle, { className: "w-5 h-5 text-red-600" })), _jsx("span", { className: "font-medium", children: mensaje.texto }), _jsx("button", { onClick: () => setMensaje(null), className: "ml-auto p-1 hover:bg-black hover:bg-opacity-5 rounded", children: "\u00D7" })] })) }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4", children: [_jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center", children: _jsx(Construction, { className: "w-6 h-6 text-primary-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-gray-900", children: estadisticas.total }), _jsx("p", { className: "text-sm text-gray-600", children: "Total Obras" })] })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(TrendingUp, { className: "w-6 h-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-gray-900", children: estadisticas.activas }), _jsx("p", { className: "text-sm text-gray-600", children: "En Ejecuci\u00F3n" })] })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(CheckCircle, { className: "w-6 h-6 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-gray-900", children: estadisticas.terminadas }), _jsx("p", { className: "text-sm text-gray-600", children: "Terminadas" })] })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center", children: _jsx(AlertCircle, { className: "w-6 h-6 text-yellow-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-gray-900", children: estadisticas.paralizadas }), _jsx("p", { className: "text-sm text-gray-600", children: "Paralizadas" })] })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center", children: _jsx(DollarSign, { className: "w-6 h-6 text-purple-600" }) }), _jsxs("div", { children: [_jsxs("p", { className: "text-lg font-bold text-gray-900", children: ["S/ ", (estadisticas.montoTotal / 1000000).toFixed(1), "M"] }), _jsx("p", { className: "text-sm text-gray-600", children: "Inversi\u00F3n Total" })] })] }) })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center gap-2 text-red-800", children: [_jsx(AlertCircle, { className: "w-5 h-5" }), _jsxs("span", { className: "font-medium", children: ["Error al cargar datos: ", error] })] }) })), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [_jsxs("div", { className: "flex flex-col lg:flex-row gap-4 mb-6", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("input", { type: "text", placeholder: "Buscar por n\u00FAmero de contrato, nombre o ubicaci\u00F3n...", value: filtros.search, onChange: (e) => actualizarFiltros({ search: e.target.value }), className: "pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" })] }), _jsxs("select", { value: filtros.estado || '', onChange: (e) => actualizarFiltros({ estado: e.target.value || undefined }), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "", children: "Todos los estados" }), Object.entries(ESTADOS_OBRA).map(([key, label]) => (_jsx("option", { value: key, children: label }, key)))] }), _jsxs("button", { onClick: () => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados), className: "btn-secondary flex items-center gap-2", children: [_jsx(Filter, { className: "w-4 h-4" }), "M\u00E1s Filtros"] })] }), _jsx(AnimatePresence, { children: mostrarFiltrosAvanzados && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "border-t border-gray-200 pt-4 mt-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tipo de Obra" }), _jsxs("select", { value: filtros.tipo_obra || '', onChange: (e) => actualizarFiltros({ tipo_obra: e.target.value || undefined }), className: "input-field", children: [_jsx("option", { value: "", children: "Todos los tipos" }), Object.entries(TIPOS_OBRA).map(([key, label]) => (_jsx("option", { value: key, children: label }, key)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Entidad Ejecutora" }), _jsxs("select", { value: filtros.entidad_ejecutora_id || '', onChange: (e) => actualizarFiltros({ entidad_ejecutora_id: parseInt(e.target.value) || undefined }), className: "input-field", children: [_jsx("option", { value: "", children: "Todas las ejecutoras" }), entidades.map(entidad => (_jsx("option", { value: entidad.id, children: entidad.nombre_completo }, entidad.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Entidad Supervisora" }), _jsxs("select", { value: filtros.entidad_supervisora_id || '', onChange: (e) => actualizarFiltros({ entidad_supervisora_id: parseInt(e.target.value) || undefined }), className: "input-field", children: [_jsx("option", { value: "", children: "Todas las supervisoras" }), entidades.map(entidad => (_jsx("option", { value: entidad.id, children: entidad.nombre_completo }, entidad.id)))] })] })] }) })) }), loading ? (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" }) })) : obras.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Construction, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No hay obras registradas" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Comienza creando la primera obra del sistema" }), _jsxs("button", { onClick: abrirModalCrear, className: "btn-primary flex items-center gap-2 mx-auto", children: [_jsx(Plus, { className: "w-4 h-4" }), "Crear Primera Obra"] })] })) : (_jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6", children: obras.map((obra, index) => {
                            const estadoConfig = getEstadoConfig(obra.estado);
                            const IconoEstado = estadoConfig.icon;
                            return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, className: "bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("span", { className: "text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded", children: obra.numero_contrato }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mt-2 line-clamp-2", children: obra.nombre }), obra.codigo_interno && (_jsx("p", { className: "text-sm text-gray-500 mt-1", children: obra.codigo_interno }))] }), _jsxs("span", { className: `px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${estadoConfig.color}`, children: [_jsx(IconoEstado, { className: "w-3 h-3" }), ESTADOS_OBRA[obra.estado]] })] }), _jsxs("div", { className: "space-y-3 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Building2, { className: "w-4 h-4 text-gray-400 flex-shrink-0" }), _jsxs("span", { className: "truncate", children: ["Ejecutora: ", getNombreEntidad(obra.entidad_ejecutora_id)] })] }), obra.ubicacion && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-400 flex-shrink-0" }), _jsx("span", { className: "truncate", children: obra.ubicacion })] })), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Calendar, { className: "w-4 h-4 text-gray-400 flex-shrink-0" }), _jsxs("span", { children: [new Date(obra.fecha_inicio).toLocaleDateString('es-PE'), " - ", ' ', new Date(obra.fecha_fin_prevista).toLocaleDateString('es-PE')] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(DollarSign, { className: "w-4 h-4 text-gray-400 flex-shrink-0" }), _jsxs("span", { className: "font-medium", children: ["S/ ", obra.monto_total.toLocaleString('es-PE', { minimumFractionDigits: 2 })] })] }), _jsxs("div", { className: "flex items-center justify-between text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4 text-gray-400" }), _jsxs("span", { children: [obra.plazo_ejecucion_dias, " d\u00EDas"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BarChart, { className: "w-4 h-4 text-gray-400" }), _jsxs("span", { children: [obra.numero_valorizaciones, " valorizaciones"] })] })] })] }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Avance Estimado" }), _jsx("span", { className: "text-sm font-semibold text-gray-900", children: "15%" })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full transition-all duration-300 ${getAvanceColor(15)}`, style: { width: '15%' } }) })] }), _jsxs("div", { className: "flex gap-2 pt-4 border-t border-gray-200", children: [_jsxs("button", { onClick: () => abrirDetalleObra(obra.id), className: "flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-1", children: [_jsx(Eye, { className: "w-4 h-4" }), "Ver Detalles"] }), _jsx("button", { onClick: () => abrirModalEditar(obra.id), className: "p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors", title: "Editar obra", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleEliminarObra(obra.id), className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors", title: "Eliminar obra", children: _jsx(Trash, { className: "w-4 h-4" }) })] })] }) }, obra.id));
                        }) }))] }), _jsx(FormularioObra, { isOpen: modalAbierto === 'crear', onClose: cerrarModal, onSubmit: handleSubmitObra, loading: loadingModal, title: "Nueva Obra" }), _jsx(DetalleObra, { obraId: obraSeleccionada, isOpen: modalAbierto === 'detalle', onClose: cerrarModal, onEditar: abrirModalEditar })] }));
};
export default Obras;
