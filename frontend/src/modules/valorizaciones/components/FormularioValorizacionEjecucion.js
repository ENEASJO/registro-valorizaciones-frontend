import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { useObras } from '../../../hooks/useObras';
import { ArrowLeft, Save, Calculator, AlertTriangle, Building, FileText, Info } from 'lucide-react';
import { useValorizaciones } from '../../../hooks/useValorizaciones';
import TablaPartidas from './TablaPartidas';
const FormularioValorizacionEjecucion = ({ onCancel, onSuccess }) => {
    // Estados del formulario
    const [obraSeleccionada, setObraSeleccionada] = useState(null);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    // Expediente
    const [numeroExpediente, setNumeroExpediente] = useState('');
    const [numeroExpedienteSiaf, setNumeroExpedienteSiaf] = useState('');
    // Deducciones
    const [adelantoDirecto, setAdelantoDirecto] = useState(0);
    const [adelantoMateriales, setAdelantoMateriales] = useState(0);
    const [penalidades, setPenalidades] = useState(0);
    const [otrasDeduccciones, setOtrasDeduccciones] = useState(0);
    // Personal y observaciones
    const [residente, setResidente] = useState('');
    const [supervisor, setSupervisor] = useState('');
    const [observacionesResidente, setObservacionesResidente] = useState('');
    const [observacionesSupervisor, setObservacionesSupervisor] = useState('');
    // Partidas seleccionadas
    const [partidasSeleccionadas, setPartidasSeleccionadas] = useState([]);
    // Estados de cálculo y validación
    const [calculos, setCalculos] = useState(null);
    const [errores, setErrores] = useState([]);
    const [mostrarCalculos, setMostrarCalculos] = useState(false);
    // Hooks
    const { crearValorizacionEjecucion, calcularMontos, validarValorizacion, formatearMoneda, cargarPartidasPorObra, partidas, loading } = useValorizaciones();
    const { obras, obtenerObraPorId } = useObras();
    // Obras activas (en ejecución)
    const obrasActivas = obras.filter(o => o.estado === 'EN_EJECUCION' || o.estado === 'REGISTRADA');
    // Obra actual
    const obraActual = obraSeleccionada ? obtenerObraPorId(obraSeleccionada) : null;
    // Cargar partidas cuando se selecciona una obra
    useEffect(() => {
        if (obraSeleccionada) {
            cargarPartidasPorObra(obraSeleccionada);
            setPartidasSeleccionadas([]);
        }
    }, [obraSeleccionada, cargarPartidasPorObra]);
    // Recalcular montos cuando cambian las partidas o deducciones
    useEffect(() => {
        if (partidasSeleccionadas.length > 0 && obraActual) {
            const nuevosCalculos = calcularMontos(partidasSeleccionadas.map(p => ({
                partida_id: p.partida_id,
                metrado_actual: p.metrado_actual
            })), {
                adelanto_directo_porcentaje: adelantoDirecto,
                adelanto_materiales_porcentaje: adelantoMateriales,
                penalidades_monto: penalidades,
                otras_deducciones_monto: otrasDeduccciones
            });
            setCalculos(nuevosCalculos);
            setErrores(nuevosCalculos.errores_calculo);
        }
        else {
            setCalculos(null);
            setErrores([]);
        }
    }, [partidasSeleccionadas, adelantoDirecto, adelantoMateriales, penalidades, otrasDeduccciones, obraActual, calcularMontos]);
    // Función para agregar partida
    const agregarPartida = useCallback((partidaId, metrado) => {
        const partida = partidas.find(p => p.id === partidaId);
        if (!partida)
            return;
        const nuevaPartida = {
            partida_id: partidaId,
            metrado_actual: metrado,
            fecha_medicion: new Date().toISOString().split('T')[0],
            metodo_medicion: 'MANUAL'
        };
        setPartidasSeleccionadas(prev => {
            const existe = prev.find(p => p.partida_id === partidaId);
            if (existe) {
                return prev.map(p => p.partida_id === partidaId
                    ? { ...p, metrado_actual: metrado }
                    : p);
            }
            return [...prev, nuevaPartida];
        });
    }, [partidas]);
    // Función para quitar partida
    const quitarPartida = useCallback((partidaId) => {
        setPartidasSeleccionadas(prev => prev.filter(p => p.partida_id !== partidaId));
    }, []);
    // Función para calcular días del periodo
    const calcularDiasPeriodo = useCallback(() => {
        if (!fechaInicio || !fechaFin)
            return 0;
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const diferencia = fin.getTime() - inicio.getTime();
        return Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1;
    }, [fechaInicio, fechaFin]);
    // Función para guardar
    const handleGuardar = async () => {
        if (!obraActual) {
            setErrores(['Debe seleccionar una obra']);
            return;
        }
        const form = {
            obra_id: obraActual.id,
            periodo_inicio: fechaInicio,
            periodo_fin: fechaFin,
            numero_expediente: numeroExpediente || undefined,
            numero_expediente_siaf: numeroExpedienteSiaf || undefined,
            adelanto_directo_porcentaje: adelantoDirecto,
            adelanto_materiales_porcentaje: adelantoMateriales,
            penalidades_monto: penalidades,
            otras_deducciones_monto: otrasDeduccciones,
            residente_obra: residente,
            supervisor_obra: supervisor,
            observaciones_residente: observacionesResidente,
            observaciones_supervisor: observacionesSupervisor,
            partidas: partidasSeleccionadas
        };
        try {
            const validacion = validarValorizacion(form, obraActual);
            if (!validacion.valida) {
                setErrores(validacion.errores.filter(e => e.tipo === 'error').map(e => e.mensaje));
                return;
            }
            await crearValorizacionEjecucion(form, obraActual);
            onSuccess();
        }
        catch (error) {
            console.error('Error al crear valorización:', error);
            setErrores([error instanceof Error ? error.message : 'Error desconocido']);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: onCancel, className: "btn-secondary flex items-center gap-2", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Volver"] }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Nueva Valorizaci\u00F3n de Ejecuci\u00F3n" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Crear valorizaci\u00F3n mensual de avance de obra" })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: () => setMostrarCalculos(!mostrarCalculos), className: "btn-secondary flex items-center gap-2", disabled: !calculos, children: [_jsx(Calculator, { className: "w-4 h-4" }), mostrarCalculos ? 'Ocultar' : 'Ver', " C\u00E1lculos"] }), _jsxs("button", { onClick: handleGuardar, disabled: loading || errores.length > 0, className: "btn-primary flex items-center gap-2 disabled:opacity-50", children: [_jsx(Save, { className: "w-4 h-4" }), loading ? 'Guardando...' : 'Guardar Valorización'] })] })] }), errores.length > 0 && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "card border-red-200 bg-red-50", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-red-500 mt-0.5" }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-red-800 mb-1", children: "Errores de Validaci\u00F3n" }), _jsx("ul", { className: "text-sm text-red-700 space-y-1", children: errores.map((error, index) => (_jsxs("li", { children: ["\u2022 ", error] }, index))) })] })] }) })), mostrarCalculos && calculos && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "card border-blue-200 bg-blue-50", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Calculator, { className: "w-5 h-5 text-blue-500 mt-0.5" }), _jsx("h3", { className: "font-medium text-blue-800", children: "Resumen de C\u00E1lculos" })] }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-600", children: "Monto Bruto" }), _jsx("p", { className: "font-semibold text-blue-900", children: formatearMoneda(calculos.monto_bruto) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-600", children: "Total Deducciones" }), _jsx("p", { className: "font-semibold text-blue-900", children: formatearMoneda(calculos.total_deducciones) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-600", children: "Monto Neto" }), _jsx("p", { className: "font-semibold text-blue-900", children: formatearMoneda(calculos.monto_neto) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-600", children: "Avance F\u00EDsico" }), _jsxs("p", { className: "font-semibold text-blue-900", children: [calculos.porcentaje_avance_fisico.toFixed(2), "%"] })] })] }), calculos.advertencias.length > 0 && (_jsx("div", { className: "mt-4 p-3 bg-yellow-100 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Info, { className: "w-4 h-4 text-yellow-600 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-yellow-800", children: "Advertencias:" }), _jsx("ul", { className: "text-sm text-yellow-700 mt-1", children: calculos.advertencias.map((adv, index) => (_jsxs("li", { children: ["\u2022 ", adv] }, index))) })] })] }) }))] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Building, { className: "w-5 h-5 text-gray-500" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Informaci\u00F3n General" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Obra *" }), _jsxs("select", { value: obraSeleccionada || '', onChange: (e) => setObraSeleccionada(e.target.value ? Number(e.target.value) : null), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500", required: true, children: [_jsx("option", { value: "", children: "Seleccionar obra..." }), obrasActivas.map(obra => (_jsxs("option", { value: obra.id, children: [obra.numero_contrato, " - ", obra.nombre] }, obra.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Monto Contractual (de Ejecuci\u00F3n)" }), _jsx("input", { type: "text", value: obraActual ? formatearMoneda(obraActual.monto_ejecucion) : '', className: "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50", readOnly: true }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Obtenido autom\u00E1ticamente de la obra seleccionada" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Fecha Inicio Periodo *" }), _jsx("input", { type: "date", value: fechaInicio, onChange: (e) => setFechaInicio(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Fecha Fin Periodo *" }), _jsx("input", { type: "date", value: fechaFin, onChange: (e) => setFechaFin(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "D\u00EDas del Periodo" }), _jsx("input", { type: "text", value: calcularDiasPeriodo(), className: "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50", readOnly: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Estado de Obra" }), _jsx("input", { type: "text", value: obraActual ? obraActual.estado.replace('_', ' ') : '', className: "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50", readOnly: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "N\u00FAmero de Expediente" }), _jsx("input", { type: "text", value: numeroExpediente, onChange: (e) => setNumeroExpediente(e.target.value), placeholder: "N\u00FAmero de expediente administrativo", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "N\u00FAmero de Expediente SIAF" }), _jsx("input", { type: "text", value: numeroExpedienteSiaf, onChange: (e) => setNumeroExpedienteSiaf(e.target.value), placeholder: "N\u00FAmero de expediente SIAF", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] })] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Personal Responsable" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Residente de Obra" }), _jsx("input", { type: "text", value: residente, onChange: (e) => setResidente(e.target.value), placeholder: "Nombre completo del residente", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Supervisor de Obra" }), _jsx("input", { type: "text", value: supervisor, onChange: (e) => setSupervisor(e.target.value), placeholder: "Nombre completo del supervisor", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] })] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Observaciones" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Observaciones del Residente" }), _jsx("textarea", { value: observacionesResidente, onChange: (e) => setObservacionesResidente(e.target.value), rows: 3, placeholder: "Observaciones t\u00E9cnicas, dificultades encontradas, etc.", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Observaciones del Supervisor" }), _jsx("textarea", { value: observacionesSupervisor, onChange: (e) => setObservacionesSupervisor(e.target.value), rows: 3, placeholder: "Control de calidad, cumplimiento de especificaciones, etc.", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] })] })] })] }), _jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Deducciones Contractuales" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Adelanto Directo (%)" }), _jsx("input", { type: "number", value: adelantoDirecto, onChange: (e) => setAdelantoDirecto(Number(e.target.value) || 0), min: "0", max: "30", step: "0.01", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "M\u00E1ximo 30% seg\u00FAn normativa" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Adelanto Materiales (%)" }), _jsx("input", { type: "number", value: adelantoMateriales, onChange: (e) => setAdelantoMateriales(Number(e.target.value) || 0), min: "0", max: "20", step: "0.01", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "M\u00E1ximo 20% seg\u00FAn normativa" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Penalidades (S/)" }), _jsx("input", { type: "number", value: penalidades, onChange: (e) => setPenalidades(Number(e.target.value) || 0), min: "0", step: "0.01", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Otras Deducciones (S/)" }), _jsx("input", { type: "number", value: otrasDeduccciones, onChange: (e) => setOtrasDeduccciones(Number(e.target.value) || 0), min: "0", step: "0.01", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsx("div", { className: "border-t pt-4", children: _jsxs("div", { className: "text-sm text-gray-600", children: [_jsx("p", { children: "Retenci\u00F3n Garant\u00EDa: 5%" }), _jsx("p", { className: "text-xs mt-1", children: "Se aplica autom\u00E1ticamente seg\u00FAn normativa" })] }) })] })] }) })] }), obraSeleccionada && (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(FileText, { className: "w-5 h-5 text-gray-500" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Partidas a Valorizar" })] }), _jsx(TablaPartidas, { partidas: partidas, partidasSeleccionadas: partidasSeleccionadas, onAgregarPartida: agregarPartida, onQuitarPartida: quitarPartida, readonly: false }), partidasSeleccionadas.length === 0 && (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(FileText, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }), _jsx("p", { children: "Seleccione partidas para valorizar" })] }))] }))] }));
};
export default FormularioValorizacionEjecucion;
