import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =================================================================
// SECCIÓN DE REGISTRO Y ESPECIALIDADES
// Sistema de Valorizaciones - Frontend
// =================================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Building2, CheckCircle2, AlertCircle, Info, Star, Briefcase, Shield, ChevronDown, ChevronUp } from 'lucide-react';
// =================================================================
// CONSTANTES
// =================================================================
const ESPECIALIDADES_OPTIONS = [
    { value: 'EDIFICACIONES', label: 'Edificaciones', categoria: 'Construcción Civil', codigo: 'ED' },
    { value: 'CARRETERAS', label: 'Carreteras y Vías', categoria: 'Infraestructura Vial', codigo: 'CR' },
    { value: 'SANEAMIENTO', label: 'Saneamiento', categoria: 'Servicios Públicos', codigo: 'SA' },
    { value: 'ELECTRICIDAD', label: 'Instalaciones Eléctricas', categoria: 'Servicios Públicos', codigo: 'EL' },
    { value: 'TELECOMUNICACIONES', label: 'Telecomunicaciones', categoria: 'Servicios Públicos', codigo: 'TC' },
    { value: 'PUENTES', label: 'Puentes', categoria: 'Infraestructura Vial', codigo: 'PU' },
    { value: 'TUNELES', label: 'Túneles', categoria: 'Infraestructura Vial', codigo: 'TU' },
    { value: 'AEROPUERTOS', label: 'Aeropuertos', categoria: 'Infraestructura Especializada', codigo: 'AE' },
    { value: 'PUERTOS', label: 'Puertos', categoria: 'Infraestructura Especializada', codigo: 'PO' },
    { value: 'FERROCARRILES', label: 'Ferrocarriles', categoria: 'Infraestructura Vial', codigo: 'FC' },
    { value: 'IRRIGACION', label: 'Irrigación', categoria: 'Recursos Hídricos', codigo: 'IR' },
    { value: 'HIDROENERGETICA', label: 'Hidroenergética', categoria: 'Recursos Hídricos', codigo: 'HE' }
];
const CATEGORIAS_INFO = {
    'A': { label: 'Categoría A', descripcion: 'Obras de máxima complejidad técnica', color: 'bg-purple-100 text-purple-800' },
    'B': { label: 'Categoría B', descripcion: 'Obras de alta complejidad técnica', color: 'bg-blue-100 text-blue-800' },
    'C': { label: 'Categoría C', descripcion: 'Obras de mediana complejidad técnica', color: 'bg-green-100 text-green-800' },
    'D': { label: 'Categoría D', descripcion: 'Obras de baja complejidad técnica', color: 'bg-yellow-100 text-yellow-800' },
    'E': { label: 'Categoría E', descripcion: 'Obras de mínima complejidad técnica', color: 'bg-gray-100 text-gray-800' }
};
// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================
export const RegistrationSection = ({ estado, categoria_contratista, especialidades = [], estado_oece, categoria_oece, especialidades_oece = [], capacidad_contratacion, vigencia_registro_desde, vigencia_registro_hasta, especialidades_consolidadas = [], estado_registro, estadoSeccion, errores, onChange, onEspecialidadChange, readonly = false, expandido = true, mostrarFuentesDatos = false, tipoEmpresa = 'GENERAL', }) => {
    // =================================================================
    // ESTADO LOCAL
    // =================================================================
    const [mostrarDetallesOECE, setMostrarDetallesOECE] = useState(false);
    const [categoriaExpandida, setCategoriaExpandida] = useState(null);
    // =================================================================
    // HELPERS
    // =================================================================
    const getFieldError = (field) => {
        return errores.find(error => error.campo === field)?.mensaje;
    };
    const obtenerColorEstado = (estado) => {
        if (estado.includes('ACTIVO') || estado.includes('HABILITADO'))
            return 'text-green-600 bg-green-100';
        if (estado.includes('SUSPENDIDO'))
            return 'text-yellow-600 bg-yellow-100';
        if (estado.includes('INACTIVO') || estado.includes('INHABILITADO'))
            return 'text-red-600 bg-red-100';
        return 'text-gray-600 bg-gray-100';
    };
    const manejarCambioEspecialidad = (especialidad, checked) => {
        if (onEspecialidadChange) {
            onEspecialidadChange(especialidad, checked);
        }
        else {
            // Fallback para compatibilidad
            const nuevasEspecialidades = checked
                ? [...especialidades, especialidad]
                : especialidades.filter(e => e !== especialidad);
            onChange('especialidades', nuevasEspecialidades);
        }
    };
    const agruparEspecialidadesPorCategoria = () => {
        const grupos = {};
        ESPECIALIDADES_OPTIONS.forEach(opcion => {
            if (!grupos[opcion.categoria]) {
                grupos[opcion.categoria] = [];
            }
            grupos[opcion.categoria].push(opcion);
        });
        return grupos;
    };
    // =================================================================
    // RENDER
    // =================================================================
    if (!expandido)
        return null;
    const gruposEspecialidades = agruparEspecialidadesPorCategoria();
    const tieneEspecialidadesOECE = especialidades_oece.length > 0 || especialidades_consolidadas.length > 0;
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${estadoSeccion.con_errores
                            ? 'bg-red-100 text-red-600'
                            : estadoSeccion.completado
                                ? 'bg-green-100 text-green-600'
                                : 'bg-blue-100 text-blue-600'}`, children: _jsx(Award, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Registro y Especialidades" }), _jsx("p", { className: "text-sm text-gray-600", children: tipoEmpresa === 'EJECUTORA'
                                    ? 'Especialidades de construcción y capacidades técnicas'
                                    : tipoEmpresa === 'SUPERVISORA'
                                        ? 'Especialidades de supervisión y control de obras'
                                        : 'Registro oficial y especialidades técnicas' })] }), estadoSeccion.datos_consolidados && (_jsxs("div", { className: "flex items-center gap-1 text-xs text-green-600 font-medium", children: [_jsx(CheckCircle2, { className: "w-4 h-4" }), "Datos OECE"] }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [_jsx(Shield, { className: "w-4 h-4 inline mr-1" }), "Estado General"] }), _jsxs("select", { value: estado, onChange: (e) => onChange('estado', e.target.value), disabled: readonly, className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${readonly ? 'bg-gray-50 cursor-not-allowed' : 'border-gray-300'}`, children: [_jsx("option", { value: "ACTIVO", children: "Activo" }), _jsx("option", { value: "INACTIVO", children: "Inactivo" }), _jsx("option", { value: "SUSPENDIDO", children: "Suspendido" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [_jsx(Star, { className: "w-4 h-4 inline mr-1" }), "Categor\u00EDa de Contratista"] }), _jsxs("select", { value: categoria_contratista || '', onChange: (e) => onChange('categoria_contratista', e.target.value), disabled: readonly, className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${readonly ? 'bg-gray-50 cursor-not-allowed' : 'border-gray-300'}`, children: [_jsx("option", { value: "", children: "Seleccionar..." }), Object.entries(CATEGORIAS_INFO).map(([categoria, info]) => (_jsxs("option", { value: categoria, children: [info.label, " - ", info.descripcion] }, categoria)))] }), categoria_contratista && (_jsx("p", { className: "text-xs text-gray-600 mt-1", children: CATEGORIAS_INFO[categoria_contratista]?.descripcion }))] })] }), (estado_oece || categoria_oece || estado_registro || capacidad_contratacion) && (_jsxs("div", { className: "bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center", children: _jsx(Building2, { className: "w-4 h-4 text-purple-600" }) }), _jsx("h4", { className: "text-md font-semibold text-purple-800", children: "Registro OECE (Organismo Supervisor)" })] }), _jsx("button", { type: "button", onClick: () => setMostrarDetallesOECE(!mostrarDetallesOECE), className: "p-1 hover:bg-purple-100 rounded transition-colors", children: mostrarDetallesOECE ? (_jsx(ChevronUp, { className: "w-4 h-4 text-purple-600" })) : (_jsx(ChevronDown, { className: "w-4 h-4 text-purple-600" })) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [estado_oece && (_jsxs("div", { children: [_jsx("span", { className: "font-medium text-purple-700", children: "Estado OECE:" }), _jsx("span", { className: `ml-2 px-2 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(estado_oece)}`, children: estado_oece })] })), categoria_oece && (_jsxs("div", { children: [_jsx("span", { className: "font-medium text-purple-700", children: "Categor\u00EDa:" }), _jsx("span", { className: "ml-2 text-purple-800", children: categoria_oece })] })), capacidad_contratacion && (_jsxs("div", { className: "md:col-span-2", children: [_jsx("span", { className: "font-medium text-purple-700", children: "Capacidad de Contrataci\u00F3n:" }), _jsx("span", { className: "ml-2 text-purple-800", children: capacidad_contratacion })] }))] }), _jsx(AnimatePresence, { children: mostrarDetallesOECE && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "mt-4 pt-4 border-t border-purple-200", children: [estado_registro && (_jsxs("div", { className: "mb-4", children: [_jsx("span", { className: "font-medium text-purple-700 block mb-2", children: "Estado de Registro Detallado:" }), _jsx("div", { className: "bg-white rounded p-3 text-sm text-gray-700 whitespace-pre-line border", children: estado_registro })] })), vigencia_registro_desde && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium text-purple-700", children: "Vigencia desde:" }), _jsx("span", { className: "ml-2 text-purple-800", children: vigencia_registro_desde })] }), vigencia_registro_hasta && (_jsxs("div", { children: [_jsx("span", { className: "font-medium text-purple-700", children: "Vigencia hasta:" }), _jsx("span", { className: "ml-2 text-purple-800", children: vigencia_registro_hasta })] }))] }))] })) })] })), tieneEspecialidadesOECE && (_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Briefcase, { className: "w-5 h-5 text-blue-600" }), _jsx("h4", { className: "text-md font-semibold text-blue-800", children: "Especialidades Registradas en OECE" })] }), especialidades_oece.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mb-3", children: especialidades_oece.map((especialidad, index) => (_jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium", children: especialidad }, index))) })), especialidades_consolidadas.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-700 mb-2 font-medium", children: "Especialidades Detalladas:" }), _jsx("div", { className: "space-y-2", children: especialidades_consolidadas.map((esp, index) => (_jsxs("div", { className: "flex items-center justify-between bg-white rounded p-2 border", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-900", children: esp.nombre }), esp.categoria && (_jsxs("span", { className: "ml-2 text-xs text-gray-600", children: ["(", esp.categoria, ")"] }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [esp.activa && (_jsx(CheckCircle2, { className: "w-4 h-4 text-green-500" })), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${esp.fuente === 'OECE' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`, children: esp.fuente })] })] }, index))) })] }))] })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "text-md font-semibold text-gray-900", children: "Especialidades del Sistema" }), tipoEmpresa === 'EJECUTORA' && (_jsx("span", { className: "text-sm text-blue-600", children: "( Especialidades de construcci\u00F3n )" })), tipoEmpresa === 'SUPERVISORA' && (_jsx("span", { className: "text-sm text-green-600", children: "( Especialidades de supervisi\u00F3n )" }))] }), _jsx("div", { className: "space-y-4", children: Object.entries(gruposEspecialidades).map(([categoria, opciones]) => (_jsxs("div", { className: "border border-gray-200 rounded-lg", children: [_jsxs("button", { type: "button", onClick: () => setCategoriaExpandida(categoriaExpandida === categoria ? null : categoria), className: "w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-colors", children: [_jsx("span", { className: "font-medium text-gray-900", children: categoria }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-sm text-gray-600", children: [opciones.filter(op => especialidades.includes(op.value)).length, " de ", opciones.length] }), categoriaExpandida === categoria ? (_jsx(ChevronUp, { className: "w-4 h-4 text-gray-600" })) : (_jsx(ChevronDown, { className: "w-4 h-4 text-gray-600" }))] })] }), _jsx(AnimatePresence, { children: categoriaExpandida === categoria && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "border-t border-gray-200", children: _jsx("div", { className: "p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: opciones.map((opcion) => (_jsxs("label", { className: "flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: especialidades.includes(opcion.value), onChange: (e) => manejarCambioEspecialidad(opcion.value, e.target.checked), disabled: readonly, className: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: opcion.label }), opcion.codigo && (_jsxs("div", { className: "text-xs text-gray-500", children: ["C\u00F3digo: ", opcion.codigo] }))] })] }, opcion.value))) }) })) })] }, categoria))) }), getFieldError('especialidades') && (_jsxs("p", { className: "text-red-500 text-sm flex items-center gap-1", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), getFieldError('especialidades')] }))] }), especialidades.length > 0 && (_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(CheckCircle2, { className: "w-5 h-5 text-green-600" }), _jsxs("h4", { className: "text-md font-semibold text-green-800", children: ["Especialidades Seleccionadas (", especialidades.length, ")"] })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: especialidades.map((especialidad) => {
                            const opcion = ESPECIALIDADES_OPTIONS.find(op => op.value === especialidad);
                            return (_jsx("span", { className: "px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium", children: opcion?.label || especialidad }, especialidad));
                        }) })] })), mostrarFuentesDatos && estadoSeccion.datos_consolidados && (_jsxs("div", { className: "p-4 bg-gray-50 border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Info, { className: "w-4 h-4 text-gray-600" }), _jsx("h4", { className: "text-sm font-medium text-gray-800", children: "Informaci\u00F3n de Fuentes" })] }), _jsxs("div", { className: "text-xs text-gray-600 space-y-1", children: [_jsx("p", { children: "\u2022 Los datos de registro provienen del sistema consolidado OECE" }), _jsx("p", { children: "\u2022 Las especialidades mostradas est\u00E1n validadas oficialmente" }), _jsx("p", { children: "\u2022 La capacidad de contrataci\u00F3n es la registrada oficialmente" })] })] }))] }));
};
export default RegistrationSection;
