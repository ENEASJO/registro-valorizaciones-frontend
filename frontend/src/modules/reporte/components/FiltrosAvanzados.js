import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building, MapPin, DollarSign, Filter, X, ChevronDown, Search, Settings } from 'lucide-react';
import { PERIODOS_REPORTE } from '../../../types/reporte.types';
const FiltrosAvanzados = ({ filtros, onFiltrosChange, tipoReporte, onAplicar, onReset }) => {
    const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
    const [busquedaObra, setBusquedaObra] = useState('');
    const [busquedaContratista, setBusquedaContratista] = useState('');
    // Mock data para opciones
    const obras = [
        { id: 1, nombre: 'CONSTRUCCION DE CARRETERA PRINCIPAL', codigo: 'N.º 001-2025' },
        { id: 2, nombre: 'MEJORAMIENTO DE SISTEMA DE AGUA POTABLE', codigo: 'N.º 002-2025' },
        { id: 3, nombre: 'CONSTRUCCION DE CENTRO DE SALUD', codigo: 'N.º 003-2025' }
    ];
    const contratistas = [
        { id: 1, nombre: 'CONSTRUCTORA ABC S.A.C.', ruc: '20123456789' },
        { id: 2, nombre: 'INGENIERIA XYZ E.I.R.L.', ruc: '20987654321' },
        { id: 3, nombre: 'GRUPO CONSTRUCTOR PERU S.A.', ruc: '20456789123' }
    ];
    const tiposObra = [
        'CARRETERA',
        'EDIFICACION',
        'SANEAMIENTO',
        'ELECTRICIDAD',
        'PUENTE',
        'OTROS'
    ];
    const estadosObra = [
        'REGISTRADA',
        'EN_EJECUCION',
        'PARALIZADA',
        'TERMINADA',
        'LIQUIDADA',
        'CANCELADA'
    ];
    const departamentos = [
        'Lima',
        'Cusco',
        'Arequipa',
        'Piura',
        'Ancash',
        'Junín'
    ];
    const actualizarFiltro = (campo, valor) => {
        onFiltrosChange({ ...filtros, [campo]: valor });
    };
    const toggleArrayValue = (array, value) => {
        const currentArray = array || [];
        return currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];
    };
    const obtenerRangoFechasPredefinido = (periodo) => {
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = hoy.getMonth();
        switch (periodo) {
            case 'MENSUAL':
                return {
                    inicio: new Date(año, mes, 1).toISOString().split('T')[0],
                    fin: new Date(año, mes + 1, 0).toISOString().split('T')[0]
                };
            case 'TRIMESTRAL':
                const trimestreInicio = Math.floor(mes / 3) * 3;
                return {
                    inicio: new Date(año, trimestreInicio, 1).toISOString().split('T')[0],
                    fin: new Date(año, trimestreInicio + 3, 0).toISOString().split('T')[0]
                };
            case 'SEMESTRAL':
                const semestreInicio = mes < 6 ? 0 : 6;
                return {
                    inicio: new Date(año, semestreInicio, 1).toISOString().split('T')[0],
                    fin: new Date(año, semestreInicio + 6, 0).toISOString().split('T')[0]
                };
            case 'ANUAL':
                return {
                    inicio: new Date(año, 0, 1).toISOString().split('T')[0],
                    fin: new Date(año, 11, 31).toISOString().split('T')[0]
                };
            default:
                return { inicio: filtros.fechaInicio, fin: filtros.fechaFin };
        }
    };
    const handlePeriodoChange = (periodo) => {
        const fechas = obtenerRangoFechasPredefinido(periodo);
        onFiltrosChange({
            ...filtros,
            periodo,
            fechaInicio: fechas.inicio,
            fechaFin: fechas.fin
        });
    };
    return (_jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: _jsx(Filter, { className: "w-5 h-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Filtros de Reporte" }), _jsx("p", { className: "text-sm text-gray-600", children: "Configura los par\u00E1metros para generar el reporte" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados), className: "flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors", children: [_jsx(Settings, { className: "w-4 h-4" }), "Avanzados", _jsx(ChevronDown, { className: `w-4 h-4 transition-transform ${mostrarFiltrosAvanzados ? 'rotate-180' : ''}` })] }), _jsxs("button", { onClick: onReset, className: "flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors", children: [_jsx(X, { className: "w-4 h-4" }), "Limpiar"] })] })] }) }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "lg:col-span-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(Calendar, { className: "inline w-4 h-4 mr-1" }), "Per\u00EDodo"] }), _jsx("select", { value: filtros.periodo, onChange: (e) => handlePeriodoChange(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: Object.entries(PERIODOS_REPORTE).map(([key, label]) => (_jsx("option", { value: key, children: label }, key))) })] }), _jsxs("div", { className: "lg:col-span-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fecha Inicio" }), _jsx("input", { type: "date", value: filtros.fechaInicio, onChange: (e) => actualizarFiltro('fechaInicio', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }), _jsxs("div", { className: "lg:col-span-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fecha Fin" }), _jsx("input", { type: "date", value: filtros.fechaFin, onChange: (e) => actualizarFiltro('fechaFin', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Nivel de Detalle" }), _jsx("div", { className: "flex gap-4", children: [
                                    { value: 'RESUMEN', label: 'Resumen', desc: 'Información básica y totalizadores' },
                                    { value: 'DETALLADO', label: 'Detallado', desc: 'Incluye desgloses y análisis' },
                                    { value: 'COMPLETO', label: 'Completo', desc: 'Toda la información disponible' }
                                ].map((nivel) => (_jsxs("label", { className: "flex items-start gap-3 cursor-pointer", children: [_jsx("input", { type: "radio", name: "nivelDetalle", value: nivel.value, checked: filtros.niveLDetalle === nivel.value, onChange: (e) => actualizarFiltro('niveLDetalle', e.target.value), className: "mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: nivel.label }), _jsx("div", { className: "text-sm text-gray-600", children: nivel.desc })] })] }, nivel.value))) })] })] }), mostrarFiltrosAvanzados && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.3 }, className: "border-t border-gray-200 overflow-hidden", children: _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(Building, { className: "inline w-4 h-4 mr-1" }), "Obras Espec\u00EDficas"] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Buscar obra por nombre o c\u00F3digo...", value: busquedaObra, onChange: (e) => setBusquedaObra(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }), _jsx("div", { className: "mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg", children: obras
                                        .filter(obra => obra.nombre.toLowerCase().includes(busquedaObra.toLowerCase()) ||
                                        obra.codigo.toLowerCase().includes(busquedaObra.toLowerCase()))
                                        .map((obra) => (_jsxs("label", { className: "flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filtros.obraIds?.includes(obra.id) || false, onChange: () => actualizarFiltro('obraIds', toggleArrayValue(filtros.obraIds, obra.id)), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: obra.codigo }), _jsx("div", { className: "text-sm text-gray-600", children: obra.nombre })] })] }, obra.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Contratistas" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Buscar contratista por nombre o RUC...", value: busquedaContratista, onChange: (e) => setBusquedaContratista(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }), _jsx("div", { className: "mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg", children: contratistas
                                        .filter(contratista => contratista.nombre.toLowerCase().includes(busquedaContratista.toLowerCase()) ||
                                        contratista.ruc.includes(busquedaContratista))
                                        .map((contratista) => (_jsxs("label", { className: "flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filtros.contratistaIds?.includes(contratista.id) || false, onChange: () => actualizarFiltro('contratistaIds', toggleArrayValue(filtros.contratistaIds, contratista.id)), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: contratista.nombre }), _jsxs("div", { className: "text-sm text-gray-600", children: ["RUC: ", contratista.ruc] })] })] }, contratista.id))) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipos de Obra" }), _jsx("div", { className: "space-y-2", children: tiposObra.map((tipo) => (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filtros.tiposObra?.includes(tipo) || false, onChange: () => actualizarFiltro('tiposObra', toggleArrayValue(filtros.tiposObra, tipo)), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: tipo })] }, tipo))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Estados de Obra" }), _jsx("div", { className: "space-y-2", children: estadosObra.map((estado) => (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filtros.estadosObra?.includes(estado) || false, onChange: () => actualizarFiltro('estadosObra', toggleArrayValue(filtros.estadosObra, estado)), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: estado.replace('_', ' ') })] }, estado))) })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(MapPin, { className: "inline w-4 h-4 mr-1" }), "Ubicaci\u00F3n"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Departamentos" }), _jsx("select", { multiple: true, value: filtros.departamentos || [], onChange: (e) => {
                                                        const valores = Array.from(e.target.selectedOptions, option => option.value);
                                                        actualizarFiltro('departamentos', valores);
                                                    }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm", size: 4, children: departamentos.map((dept) => (_jsx("option", { value: dept, children: dept }, dept))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Provincias" }), _jsx("input", { type: "text", placeholder: "Escribir provincias...", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Distritos" }), _jsx("input", { type: "text", placeholder: "Escribir distritos...", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" })] })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(DollarSign, { className: "inline w-4 h-4 mr-1" }), "Rango de Montos (S/)"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Monto M\u00EDnimo" }), _jsx("input", { type: "number", placeholder: "0.00", value: filtros.rangoMontoMin || '', onChange: (e) => actualizarFiltro('rangoMontoMin', Number(e.target.value) || undefined), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Monto M\u00E1ximo" }), _jsx("input", { type: "number", placeholder: "999,999,999.00", value: filtros.rangoMontoMax || '', onChange: (e) => actualizarFiltro('rangoMontoMax', Number(e.target.value) || undefined), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Filtros Adicionales" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filtros.incluirCompletadas || false, onChange: (e) => actualizarFiltro('incluirCompletadas', e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Incluir obras completadas" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filtros.incluirParalizadas || false, onChange: (e) => actualizarFiltro('incluirParalizadas', e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Incluir obras paralizadas" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filtros.soloConAlertas || false, onChange: (e) => actualizarFiltro('soloConAlertas', e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Solo obras con alertas" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filtros.soloConRetrasos || false, onChange: (e) => actualizarFiltro('soloConRetrasos', e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700", children: "Solo obras con retrasos" })] })] })] })] }) })), _jsx("div", { className: "px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "text-sm text-gray-600", children: [filtros.obraIds?.length ? `${filtros.obraIds.length} obras seleccionadas` : 'Todas las obras', filtros.contratistaIds?.length ? ` • ${filtros.contratistaIds.length} contratistas` : ''] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: onReset, className: "px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors", children: "Restaurar" }), _jsx("button", { onClick: onAplicar, className: "px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors", children: "Aplicar Filtros" })] })] }) })] }));
};
export default FiltrosAvanzados;
