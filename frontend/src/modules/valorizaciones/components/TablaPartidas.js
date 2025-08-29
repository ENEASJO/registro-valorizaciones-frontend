import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { Plus, Minus, Search, Calculator, CheckCircle } from 'lucide-react';
const TablaPartidas = ({ partidas, partidasSeleccionadas, onAgregarPartida, onQuitarPartida, readonly = false, showCalculations = true }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [metradosTemporales, setMetradosTemporales] = useState({});
    const [metadatosTemporales, setMetadatosTemporales] = useState({});
    // Formatear moneda
    const formatearMoneda = (monto) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(monto).replace('PEN', 'S/');
    };
    // Formatear número con separador de miles
    const formatearNumero = (numero, decimales = 4) => {
        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: decimales,
            maximumFractionDigits: decimales
        }).format(numero);
    };
    // Filtrar partidas
    const partidasFiltradas = useMemo(() => {
        let resultado = partidas;
        if (searchTerm) {
            resultado = resultado.filter(p => p.codigo_partida.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (categoriaFiltro) {
            resultado = resultado.filter(p => p.categoria === categoriaFiltro);
        }
        return resultado.sort((a, b) => a.numero_orden - b.numero_orden);
    }, [partidas, searchTerm, categoriaFiltro]);
    // Obtener categorías únicas
    const categorias = useMemo(() => {
        const cats = Array.from(new Set(partidas.map(p => p.categoria).filter(Boolean)));
        return cats.sort();
    }, [partidas]);
    // Verificar si una partida está seleccionada
    const estaSeleccionada = useCallback((partidaId) => {
        return partidasSeleccionadas.some(p => p.partida_id === partidaId);
    }, [partidasSeleccionadas]);
    // Obtener metrado actual de una partida seleccionada
    const getMetradoActual = useCallback((partidaId) => {
        const partida = partidasSeleccionadas.find(p => p.partida_id === partidaId);
        return partida?.metrado_actual || 0;
    }, [partidasSeleccionadas]);
    // Manejar cambio en metrado temporal
    const handleMetradoChange = useCallback((partidaId, valor) => {
        setMetradosTemporales(prev => ({
            ...prev,
            [partidaId]: valor
        }));
    }, []);
    // Manejar agregar partida
    const handleAgregar = useCallback((partidaId) => {
        const metradoStr = metradosTemporales[partidaId] || '0';
        const metrado = parseFloat(metradoStr);
        if (isNaN(metrado) || metrado <= 0) {
            alert('Ingrese un metrado válido mayor a cero');
            return;
        }
        onAgregarPartida(partidaId, metrado);
        // Limpiar metrado temporal
        setMetradosTemporales(prev => {
            const nuevo = { ...prev };
            delete nuevo[partidaId];
            return nuevo;
        });
    }, [metradosTemporales, onAgregarPartida]);
    // Manejar actualizar partida existente
    const handleActualizar = useCallback((partidaId) => {
        const metradoStr = metradosTemporales[partidaId] || getMetradoActual(partidaId).toString();
        const metrado = parseFloat(metradoStr);
        if (isNaN(metrado) || metrado < 0) {
            alert('Ingrese un metrado válido');
            return;
        }
        onAgregarPartida(partidaId, metrado);
        // Limpiar metrado temporal
        setMetradosTemporales(prev => {
            const nuevo = { ...prev };
            delete nuevo[partidaId];
            return nuevo;
        });
    }, [metradosTemporales, getMetradoActual, onAgregarPartida]);
    // Calcular totales
    const totales = useMemo(() => {
        let montoTotal = 0;
        let metradoTotalContractual = 0;
        let metradoTotalEjecutado = 0;
        let porcentajePromedioAvance = 0;
        partidasSeleccionadas.forEach(ps => {
            const partida = partidas.find(p => p.id === ps.partida_id);
            if (partida) {
                const montoPartida = ps.metrado_actual * partida.precio_unitario;
                montoTotal += montoPartida;
                metradoTotalContractual += partida.metrado_contractual;
                metradoTotalEjecutado += ps.metrado_actual;
            }
        });
        if (metradoTotalContractual > 0) {
            porcentajePromedioAvance = (metradoTotalEjecutado / metradoTotalContractual) * 100;
        }
        return {
            montoTotal,
            metradoTotalContractual,
            metradoTotalEjecutado,
            porcentajePromedioAvance,
            cantidadPartidas: partidasSeleccionadas.length
        };
    }, [partidasSeleccionadas, partidas]);
    // Validar metrado
    const validarMetrado = useCallback((partidaId, metrado) => {
        const partida = partidas.find(p => p.id === partidaId);
        if (!partida)
            return { valido: false, mensaje: 'Partida no encontrada' };
        if (metrado <= 0) {
            return { valido: false, mensaje: 'El metrado debe ser mayor a cero', tipo: 'error' };
        }
        if (metrado > partida.metrado_contractual * 1.05) {
            return {
                valido: false,
                mensaje: 'Metrado excede contractual + 5% de tolerancia',
                tipo: 'error'
            };
        }
        if (metrado > partida.metrado_contractual) {
            return {
                valido: true,
                mensaje: 'Metrado en tolerancia del 5%',
                tipo: 'warning'
            };
        }
        return { valido: true };
    }, [partidas]);
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-4 items-center", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx("input", { type: "text", placeholder: "Buscar por c\u00F3digo o descripci\u00F3n...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("select", { value: categoriaFiltro, onChange: (e) => setCategoriaFiltro(e.target.value), className: "px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 min-w-[200px]", children: [_jsx("option", { value: "", children: "Todas las categor\u00EDas" }), categorias.map(categoria => (_jsx("option", { value: categoria, children: categoria }, categoria)))] }), _jsxs("div", { className: "text-sm text-gray-600", children: [partidasFiltradas.length, " partidas"] })] }), showCalculations && partidasSeleccionadas.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Calculator, { className: "w-5 h-5 text-blue-500" }), _jsx("h3", { className: "font-medium text-blue-800", children: "Resumen de Partidas Seleccionadas" })] }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-blue-600 font-medium", children: "Partidas" }), _jsx("p", { className: "text-lg font-bold text-blue-900", children: totales.cantidadPartidas })] }), _jsxs("div", { children: [_jsx("p", { className: "text-blue-600 font-medium", children: "Monto Total" }), _jsx("p", { className: "text-lg font-bold text-blue-900", children: formatearMoneda(totales.montoTotal) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-blue-600 font-medium", children: "Metrado Ejecutado" }), _jsx("p", { className: "text-lg font-bold text-blue-900", children: formatearNumero(totales.metradoTotalEjecutado, 2) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-blue-600 font-medium", children: "Avance Promedio" }), _jsxs("p", { className: "text-lg font-bold text-blue-900", children: [totales.porcentajePromedioAvance.toFixed(2), "%"] })] })] })] })), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 text-sm", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "C\u00F3digo / Descripci\u00F3n" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Unidad" }), _jsx("th", { className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Metrado Contractual" }), _jsx("th", { className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Precio Unitario" }), _jsx("th", { className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Monto Contractual" }), !readonly && (_jsx("th", { className: "px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Metrado a Ejecutar" })), readonly && (_jsx("th", { className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Metrado Ejecutado" })), _jsx("th", { className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Monto Parcial" }), _jsx("th", { className: "px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Acciones" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: partidasFiltradas.map((partida, index) => {
                                const estaSeleccionadaPartida = estaSeleccionada(partida.id);
                                const metradoActual = getMetradoActual(partida.id);
                                const metradoTemporal = metradosTemporales[partida.id] || '';
                                const metradoParaCalculo = metradoTemporal ? parseFloat(metradoTemporal) : metradoActual;
                                const montoParial = !isNaN(metradoParaCalculo) ? metradoParaCalculo * partida.precio_unitario : 0;
                                const porcentajeAvance = partida.metrado_contractual > 0 ? (metradoActual / partida.metrado_contractual) * 100 : 0;
                                const validacion = metradoTemporal ? validarMetrado(partida.id, parseFloat(metradoTemporal) || 0) : { valido: true };
                                return (_jsxs(motion.tr, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: index * 0.02 }, className: `hover:bg-gray-50 ${estaSeleccionadaPartida ? 'bg-blue-50' : ''}`, children: [_jsx("td", { className: "px-4 py-4", children: _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: partida.codigo_partida }), _jsx("div", { className: "text-gray-600 text-xs mt-1 max-w-xs", children: partida.descripcion }), partida.categoria && (_jsx("div", { className: "text-xs text-blue-600 mt-1", children: partida.categoria }))] }) }), _jsx("td", { className: "px-4 py-4 text-gray-900 font-mono", children: partida.unidad_medida }), _jsx("td", { className: "px-4 py-4 text-right font-mono text-gray-900", children: formatearNumero(partida.metrado_contractual) }), _jsx("td", { className: "px-4 py-4 text-right font-mono text-gray-900", children: formatearMoneda(partida.precio_unitario) }), _jsx("td", { className: "px-4 py-4 text-right font-mono font-medium text-gray-900", children: formatearMoneda(partida.monto_contractual) }), !readonly && (_jsxs("td", { className: "px-4 py-4", children: [estaSeleccionadaPartida ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "number", value: metradoTemporal || metradoActual, onChange: (e) => handleMetradoChange(partida.id, e.target.value), step: "0.0001", min: "0", className: `w-24 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-primary-500 ${!validacion.valido && metradoTemporal
                                                                ? 'border-red-300 focus:ring-red-500'
                                                                : validacion.tipo === 'warning' && metradoTemporal
                                                                    ? 'border-yellow-300 focus:ring-yellow-500'
                                                                    : 'border-gray-300'}` }), metradoTemporal && (_jsx("button", { onClick: () => handleActualizar(partida.id), disabled: !validacion.valido, className: "text-blue-600 hover:text-blue-800 disabled:opacity-50", title: "Actualizar metrado", children: _jsx(CheckCircle, { className: "w-4 h-4" }) }))] })) : (_jsx("input", { type: "number", value: metradoTemporal, onChange: (e) => handleMetradoChange(partida.id, e.target.value), placeholder: "0.0000", step: "0.0001", min: "0", className: `w-24 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-primary-500 ${!validacion.valido && metradoTemporal
                                                        ? 'border-red-300 focus:ring-red-500'
                                                        : validacion.tipo === 'warning' && metradoTemporal
                                                            ? 'border-yellow-300 focus:ring-yellow-500'
                                                            : 'border-gray-300'}` })), metradoTemporal && validacion.mensaje && (_jsx("div", { className: `text-xs mt-1 ${validacion.tipo === 'error' ? 'text-red-600' : 'text-yellow-600'}`, children: validacion.mensaje }))] })), readonly && (_jsxs("td", { className: "px-4 py-4 text-right", children: [_jsx("div", { className: "font-mono text-gray-900", children: formatearNumero(metradoActual) }), porcentajeAvance > 0 && (_jsxs("div", { className: "text-xs text-blue-600", children: [porcentajeAvance.toFixed(1), "%"] }))] })), _jsxs("td", { className: "px-4 py-4 text-right", children: [_jsx("div", { className: "font-mono font-medium text-gray-900", children: formatearMoneda(montoParial) }), estaSeleccionadaPartida && (_jsxs("div", { className: "text-xs text-blue-600", children: ["Avance: ", ((metradoActual / partida.metrado_contractual) * 100).toFixed(1), "%"] }))] }), _jsx("td", { className: "px-4 py-4 text-center", children: !readonly && (_jsx("div", { className: "flex justify-center gap-1", children: estaSeleccionadaPartida ? (_jsx("button", { onClick: () => onQuitarPartida(partida.id), className: "text-red-600 hover:text-red-800", title: "Quitar partida", children: _jsx(Minus, { className: "w-4 h-4" }) })) : (_jsx("button", { onClick: () => handleAgregar(partida.id), disabled: !metradoTemporal || !validacion.valido, className: "text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed", title: "Agregar partida", children: _jsx(Plus, { className: "w-4 h-4" }) })) })) })] }, partida.id));
                            }) })] }) }), partidasFiltradas.length === 0 && (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Search, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }), _jsx("p", { children: "No se encontraron partidas con los filtros aplicados" })] }))] }));
};
export default TablaPartidas;
