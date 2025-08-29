import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Search, Filter, Eye, Edit, Trash, Mail, Phone, MapPin, Crown, MoreVertical, Calendar } from 'lucide-react';
const ESTADOS_OPTIONS = [
    { value: 'ACTIVO', label: 'Activo', color: 'bg-green-100 text-green-800' },
    { value: 'INACTIVO', label: 'Inactivo', color: 'bg-gray-100 text-gray-800' },
    { value: 'SUSPENDIDO', label: 'Suspendido', color: 'bg-red-100 text-red-800' }
];
const CATEGORIAS_OPTIONS = [
    { value: 'A', label: 'Categoría A' },
    { value: 'B', label: 'Categoría B' },
    { value: 'C', label: 'Categoría C' },
    { value: 'D', label: 'Categoría D' },
    { value: 'E', label: 'Categoría E' }
];
const ESPECIALIDADES_OPTIONS = [
    'EDIFICACIONES',
    'CARRETERAS',
    'SANEAMIENTO',
    'ELECTRICIDAD',
    'TELECOMUNICACIONES',
    'PUENTES'
];
const ListaEntidades = ({ entidades, loading, filtros, onFiltrosChange, onVerDetalle, onEditar, onEliminar }) => {
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(null);
    // Filtrar entidades localmente
    const entidadesFiltradas = useMemo(() => {
        return entidades.filter(entidad => {
            // Filtro por búsqueda
            if (filtros.search) {
                const searchTerm = filtros.search.toLowerCase();
                const cumpleBusqueda = entidad.nombre_completo.toLowerCase().includes(searchTerm) ||
                    entidad.ruc_principal?.toLowerCase().includes(searchTerm) ||
                    entidad.datos_empresa?.razon_social?.toLowerCase().includes(searchTerm) ||
                    entidad.datos_empresa?.nombre_comercial?.toLowerCase().includes(searchTerm) ||
                    entidad.datos_consorcio?.nombre?.toLowerCase().includes(searchTerm);
                if (!cumpleBusqueda)
                    return false;
            }
            // Filtro por tipo
            if (filtros.tipo_entidad && entidad.tipo_entidad !== filtros.tipo_entidad) {
                return false;
            }
            // Filtro por estado
            if (filtros.estado && entidad.estado !== filtros.estado) {
                return false;
            }
            // Filtro por categoría (solo empresas)
            if (filtros.categoria && entidad.tipo_entidad === 'EMPRESA') {
                if (entidad.datos_empresa?.categoria_contratista !== filtros.categoria) {
                    return false;
                }
            }
            // Filtro por especialidades
            if (filtros.especialidades && filtros.especialidades.length > 0) {
                const especialidadesEntidad = entidad.tipo_entidad === 'EMPRESA'
                    ? entidad.datos_empresa?.especialidades || []
                    : entidad.datos_consorcio?.especialidades || [];
                const tieneEspecialidad = filtros.especialidades.some(esp => especialidadesEntidad.includes(esp));
                if (!tieneEspecialidad)
                    return false;
            }
            return true;
        });
    }, [entidades, filtros]);
    const handleFiltroChange = (campo, valor) => {
        onFiltrosChange({
            ...filtros,
            [campo]: valor
        });
    };
    const toggleEspecialidad = (especialidad) => {
        const especialidadesActuales = filtros.especialidades || [];
        const nuevasEspecialidades = especialidadesActuales.includes(especialidad)
            ? especialidadesActuales.filter(e => e !== especialidad)
            : [...especialidadesActuales, especialidad];
        handleFiltroChange('especialidades', nuevasEspecialidades);
    };
    const limpiarFiltros = () => {
        onFiltrosChange({
            search: '',
            tipo_entidad: undefined,
            estado: undefined,
            categoria: undefined,
            especialidades: []
        });
    };
    const getEstadoColor = (estado) => {
        return ESTADOS_OPTIONS.find(e => e.value === estado)?.color || 'bg-gray-100 text-gray-800';
    };
    if (loading) {
        return (_jsx("div", { className: "space-y-4", children: [...Array(6)].map((_, i) => (_jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: _jsx("div", { className: "animate-pulse", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-gray-200 rounded-lg" }), _jsxs("div", { className: "flex-1 space-y-3", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4" }), _jsx("div", { className: "h-3 bg-gray-200 rounded w-1/2" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "h-6 bg-gray-200 rounded w-16" }), _jsx("div", { className: "h-6 bg-gray-200 rounded w-20" })] })] })] }) }) }, i))) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("input", { type: "text", placeholder: "Buscar por nombre, RUC o raz\u00F3n social...", value: filtros.search || '', onChange: (e) => handleFiltroChange('search', e.target.value), className: "pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" })] }), _jsxs("button", { onClick: () => setMostrarFiltros(!mostrarFiltros), className: `px-4 py-3 border border-gray-300 rounded-lg flex items-center gap-2 transition-colors ${mostrarFiltros ? 'bg-primary-50 border-primary-300 text-primary-700' : 'hover:bg-gray-50'}`, children: [_jsx(Filter, { className: "w-5 h-5" }), "Filtros"] })] }), mostrarFiltros && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipo de Entidad" }), _jsxs("select", { value: filtros.tipo_entidad || '', onChange: (e) => handleFiltroChange('tipo_entidad', e.target.value || undefined), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Todos" }), _jsx("option", { value: "EMPRESA", children: "Empresas" }), _jsx("option", { value: "CONSORCIO", children: "Consorcios" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Estado" }), _jsxs("select", { value: filtros.estado || '', onChange: (e) => handleFiltroChange('estado', e.target.value || undefined), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Todos" }), ESTADOS_OPTIONS.map(estado => (_jsx("option", { value: estado.value, children: estado.label }, estado.value)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Categor\u00EDa" }), _jsxs("select", { value: filtros.categoria || '', onChange: (e) => handleFiltroChange('categoria', e.target.value || undefined), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Todas" }), CATEGORIAS_OPTIONS.map(categoria => (_jsx("option", { value: categoria.value, children: categoria.label }, categoria.value)))] })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: limpiarFiltros, className: "w-full px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors", children: "Limpiar Filtros" }) }), _jsxs("div", { className: "lg:col-span-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Especialidades" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ESPECIALIDADES_OPTIONS.map(especialidad => (_jsx("button", { onClick: () => toggleEspecialidad(especialidad), className: `px-3 py-1 text-sm rounded-full transition-colors ${filtros.especialidades?.includes(especialidad)
                                                    ? 'bg-primary-100 text-primary-800 border border-primary-300'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: especialidad }, especialidad))) })] })] }))] }) }), _jsx("div", { className: "flex items-center justify-between", children: _jsxs("p", { className: "text-gray-600", children: [entidadesFiltradas.length, " ", entidadesFiltradas.length === 1 ? 'resultado' : 'resultados'] }) }), entidadesFiltradas.length === 0 ? (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center", children: _jsx(Search, { className: "w-8 h-8 text-gray-400" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No se encontraron resultados" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Intenta ajustar los filtros de b\u00FAsqueda para encontrar lo que buscas." }), _jsx("button", { onClick: limpiarFiltros, className: "btn-secondary", children: "Limpiar Filtros" })] })) : (_jsx("div", { className: "space-y-4", children: entidadesFiltradas.map((entidad, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200", children: _jsx("div", { className: "p-6", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start gap-4 flex-1", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: `flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${entidad.tipo_entidad === 'EMPRESA'
                                                        ? 'bg-blue-100 text-blue-600'
                                                        : 'bg-purple-100 text-purple-600'}`, children: entidad.tipo_entidad === 'EMPRESA' ? (_jsx(Building2, { className: "w-6 h-6" })) : (_jsx(Users, { className: "w-6 h-6" })) }), Math.random() > 0.5 ? (_jsx("div", { className: "absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center", title: "Empresa Ejecutora", children: _jsx("span", { className: "text-white text-xs font-bold", children: "E" }) })) : (_jsx("div", { className: "absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center", title: "Empresa Supervisora", children: _jsx("span", { className: "text-white text-xs font-bold", children: "S" }) }))] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 truncate", children: entidad.nombre_completo }), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${entidad.tipo_entidad === 'EMPRESA' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`, children: entidad.tipo_entidad === 'EMPRESA' ? 'Empresa' : 'Consorcio' }), Math.random() > 0.5 ? (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white", children: "EJECUTORA" })) : (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white", children: "SUPERVISORA" })), entidad.tipo_entidad === 'CONSORCIO' && entidad.empresas_participantes?.some(ep => ep.es_lider) && (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full", children: [_jsx(Crown, { className: "w-3 h-3" }), "Con L\u00EDder"] }))] }), entidad.tipo_entidad === 'EMPRESA' && entidad.datos_empresa && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [_jsxs("span", { className: "font-mono", children: ["RUC: ", entidad.datos_empresa.ruc] }), entidad.datos_empresa.categoria_contratista && (_jsxs("span", { className: "px-2 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 rounded text-xs font-medium border border-orange-200", children: ["Categor\u00EDa ", entidad.datos_empresa.categoria_contratista] })), Math.random() > 0.7 && (_jsx("span", { className: "px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded text-xs font-medium border border-purple-200", children: "\u2B50 Especializada" }))] }), _jsxs("div", { className: "flex items-center gap-6 text-sm text-gray-600", children: [entidad.datos_empresa.email && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Mail, { className: "w-4 h-4" }), entidad.datos_empresa.email] })), entidad.datos_empresa.telefono && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Phone, { className: "w-4 h-4" }), entidad.datos_empresa.telefono] })), entidad.datos_empresa.direccion && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "w-4 h-4" }), entidad.datos_empresa.direccion] }))] }), entidad.datos_empresa.especialidades && entidad.datos_empresa.especialidades.length > 0 && (_jsxs("div", { className: "flex flex-wrap gap-1 mt-2", children: [entidad.datos_empresa.especialidades.slice(0, 3).map((esp, index) => (_jsx("span", { className: `px-2 py-1 text-xs rounded font-medium ${index === 0 ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                                        index === 1 ? 'bg-green-100 text-green-800 border border-green-200' :
                                                                            'bg-purple-100 text-purple-800 border border-purple-200'}`, children: esp.replace('_', ' ') }, esp))), entidad.datos_empresa.especialidades.length > 3 && (_jsxs("span", { className: "px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded font-medium border border-gray-300", children: ["+", entidad.datos_empresa.especialidades.length - 3, " m\u00E1s"] }))] }))] })), entidad.tipo_entidad === 'CONSORCIO' && entidad.datos_consorcio && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Users, { className: "w-4 h-4" }), _jsx("span", { className: "font-medium", children: entidad.empresas_participantes?.length || 0 }), " empresas"] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-4 h-4" }), "Constituido: ", _jsx("span", { className: "font-medium", children: new Date(entidad.datos_consorcio.fecha_constitucion).toLocaleDateString() })] })] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["L\u00EDder: ", entidad.datos_consorcio.empresa_lider_nombre] }), entidad.datos_consorcio.descripcion && (_jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: entidad.datos_consorcio.descripcion })), entidad.empresas_participantes && entidad.empresas_participantes.length > 0 && (_jsxs("div", { className: "flex flex-wrap gap-1 mt-2", children: [entidad.empresas_participantes.slice(0, 2).map(ep => (_jsxs("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center gap-1", children: [ep.es_lider && _jsx(Crown, { className: "w-3 h-3 text-yellow-600" }), ep.empresa_nombre, " (", ep.porcentaje_participacion, "%)"] }, ep.empresa_id))), entidad.empresas_participantes.length > 2 && (_jsxs("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded", children: ["+", entidad.empresas_participantes.length - 2, " m\u00E1s"] }))] }))] }))] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(entidad.estado)}`, children: entidad.estado }), _jsxs("div", { className: "relative", children: [_jsx("button", { onClick: () => setMenuAbierto(menuAbierto === entidad.id ? null : entidad.id), className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(MoreVertical, { className: "w-4 h-4" }) }), menuAbierto === entidad.id && (_jsx("div", { className: "absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10", children: _jsxs("div", { className: "py-1", children: [_jsxs("button", { onClick: () => {
                                                                    onVerDetalle(entidad);
                                                                    setMenuAbierto(null);
                                                                }, className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(Eye, { className: "w-4 h-4" }), "Ver Detalle"] }), onEditar && (_jsxs("button", { onClick: () => {
                                                                    onEditar(entidad);
                                                                    setMenuAbierto(null);
                                                                }, className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(Edit, { className: "w-4 h-4" }), "Editar"] })), onEliminar && (_jsxs("button", { onClick: () => {
                                                                    onEliminar(entidad);
                                                                    setMenuAbierto(null);
                                                                }, className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50", children: [_jsx(Trash, { className: "w-4 h-4" }), "Eliminar"] }))] }) }))] })] })] }) }) }, entidad.id))) }))] }));
};
export default ListaEntidades;
