import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { useObras } from '../../../hooks/useObras';
import { ArrowLeft, Save, Calculator, AlertTriangle, CheckCircle, Calendar, Users, Info, Cloud, Pause, MoreHorizontal } from 'lucide-react';
import { useValorizaciones } from '../../../hooks/useValorizaciones';
const FormularioValorizacionSupervision = ({ onCancel, onSuccess }) => {
    // Estados del formulario
    const [obraSeleccionada, setObraSeleccionada] = useState(null);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    // Expediente
    const [numeroExpediente, setNumeroExpediente] = useState('');
    const [numeroExpedienteSiaf, setNumeroExpedienteSiaf] = useState('');
    // Días trabajados
    const [diasEfectivos, setDiasEfectivos] = useState(0);
    const [diasLluvia, setDiasLluvia] = useState(0);
    const [diasFeriados, setDiasFeriados] = useState(0);
    const [diasSuspension, setDiasSuspension] = useState(0);
    const [diasOtros, setDiasOtros] = useState(0);
    // Deducciones
    const [penalidades, setPenalidades] = useState(0);
    const [otrasDeduccciones, setOtrasDeduccciones] = useState(0);
    // Documentación
    const [supervisorResponsable, setSupervisorResponsable] = useState('');
    const [actividadesRealizadas, setActividadesRealizadas] = useState('');
    const [observacionesPeriodo, setObservacionesPeriodo] = useState('');
    const [motivosDiasNoTrabajados, setMotivosDiasNoTrabajados] = useState('');
    // Estados de cálculo y validación
    const [errores, setErrores] = useState([]);
    const [mostrarCalculos, setMostrarCalculos] = useState(false);
    // Hooks
    const { crearValorizacionSupervision, valorizacionesEjecucion, formatearMoneda, loading } = useValorizaciones();
    const { obras, obtenerObraPorId } = useObras();
    // Obras activas con supervisor asignado
    const obrasConSupervisor = obras.filter(o => (o.estado === 'EN_EJECUCION' || o.estado === 'REGISTRADA') &&
        o.entidad_supervisora_id);
    // Obra actual
    const obraActual = obraSeleccionada ? obtenerObraPorId(obraSeleccionada) : null;
    // Calcular días del periodo
    const diasPeriodo = useMemo(() => {
        if (!fechaInicio || !fechaFin)
            return 0;
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const diferencia = fin.getTime() - inicio.getTime();
        return Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1;
    }, [fechaInicio, fechaFin]);
    // Calcular días no trabajados totales
    const diasNoTrabajados = diasLluvia + diasFeriados + diasSuspension + diasOtros;
    // Tarifa diaria de supervisión (calculada desde el contrato)
    const tarifaDiaria = useMemo(() => {
        if (!obraActual)
            return 0;
        return obraActual.monto_supervision / obraActual.plazo_ejecucion_dias;
    }, [obraActual]);
    // Cálculos de montos
    const calculos = useMemo(() => {
        if (!obraActual || diasEfectivos === 0) {
            return {
                montoBruto: 0,
                retencionMonto: 0,
                totalDeducciones: 0,
                montoNeto: 0,
                igvMonto: 0,
                montoTotal: 0
            };
        }
        const montoBruto = diasEfectivos * tarifaDiaria;
        const retencionMonto = montoBruto * 0.05; // 5% retención garantía
        const totalDeducciones = retencionMonto + penalidades + otrasDeduccciones;
        const montoNeto = montoBruto - totalDeducciones;
        const igvMonto = montoNeto * 0.18; // IGV 18%
        const montoTotal = montoNeto + igvMonto;
        return {
            montoBruto,
            retencionMonto,
            totalDeducciones,
            montoNeto,
            igvMonto,
            montoTotal
        };
    }, [obraActual, diasEfectivos, tarifaDiaria, penalidades, otrasDeduccciones]);
    // Porcentaje de días trabajados
    const porcentajeDiasTrabajados = diasPeriodo > 0 ? (diasEfectivos / diasPeriodo) * 100 : 0;
    // Validaciones en tiempo real
    useEffect(() => {
        const nuevosErrores = [];
        if (!obraSeleccionada) {
            nuevosErrores.push('Debe seleccionar una obra');
        }
        if (!fechaInicio || !fechaFin) {
            nuevosErrores.push('Debe especificar el periodo de supervisión');
        }
        else if (new Date(fechaInicio) > new Date(fechaFin)) {
            nuevosErrores.push('La fecha de inicio no puede ser posterior a la fecha fin');
        }
        if (diasEfectivos + diasNoTrabajados > diasPeriodo) {
            nuevosErrores.push('La suma de días trabajados y no trabajados excede los días del periodo');
        }
        if (diasEfectivos < 0) {
            nuevosErrores.push('Los días efectivos no pueden ser negativos');
        }
        if (diasLluvia < 0 || diasFeriados < 0 || diasSuspension < 0 || diasOtros < 0) {
            nuevosErrores.push('Los días no trabajados no pueden ser negativos');
        }
        if (!supervisorResponsable.trim()) {
            nuevosErrores.push('Debe especificar el supervisor responsable');
        }
        // Validar fechas dentro del plazo de la obra
        if (obraActual && fechaInicio && fechaFin) {
            const obraInicio = new Date(obraActual.fecha_inicio);
            const obraFin = new Date(obraActual.fecha_fin_prevista);
            const periodoInicio = new Date(fechaInicio);
            const periodoFin = new Date(fechaFin);
            if (periodoInicio < obraInicio) {
                nuevosErrores.push('El periodo no puede ser anterior al inicio de la obra');
            }
            if (periodoFin > obraFin) {
                nuevosErrores.push('El periodo no puede ser posterior a la fecha prevista de fin');
            }
        }
        setErrores(nuevosErrores);
    }, [
        obraSeleccionada, fechaInicio, fechaFin, diasEfectivos, diasNoTrabajados,
        diasPeriodo, diasLluvia, diasFeriados, diasSuspension, diasOtros,
        supervisorResponsable, obraActual
    ]);
    // Autocompletar días cuando cambia el periodo
    useEffect(() => {
        if (diasPeriodo > 0 && diasEfectivos === 0 && diasNoTrabajados === 0) {
            setDiasEfectivos(diasPeriodo);
        }
    }, [diasPeriodo]);
    // Función para buscar valorización de ejecución asociada
    const buscarValorizacionEjecucion = useCallback(() => {
        if (!obraSeleccionada || !fechaInicio || !fechaFin)
            return null;
        return valorizacionesEjecucion.find(ve => ve.obra_id === obraSeleccionada &&
            ve.periodo_inicio === fechaInicio &&
            ve.periodo_fin === fechaFin);
    }, [obraSeleccionada, fechaInicio, fechaFin, valorizacionesEjecucion]);
    // Función para guardar
    const handleGuardar = async () => {
        if (!obraActual)
            return;
        if (errores.length > 0)
            return;
        const valorizacionEjecucion = buscarValorizacionEjecucion();
        if (!valorizacionEjecucion) {
            setErrores(['No se encontró una valorización de ejecución para el mismo periodo']);
            return;
        }
        const form = {
            obra_id: obraActual.id,
            periodo_inicio: fechaInicio,
            periodo_fin: fechaFin,
            numero_expediente: numeroExpediente || undefined,
            numero_expediente_siaf: numeroExpedienteSiaf || undefined,
            dias_efectivos_trabajados: diasEfectivos,
            dias_lluvia: diasLluvia,
            dias_feriados: diasFeriados,
            dias_suspension_obra: diasSuspension,
            dias_otros_motivos: diasOtros,
            penalidades_monto: penalidades,
            otras_deducciones_monto: otrasDeduccciones,
            supervisor_responsable: supervisorResponsable,
            actividades_realizadas: actividadesRealizadas,
            observaciones_periodo: observacionesPeriodo,
            motivos_dias_no_trabajados: motivosDiasNoTrabajados
        };
        try {
            await crearValorizacionSupervision(form, obraActual, valorizacionEjecucion.id);
            onSuccess();
        }
        catch (error) {
            console.error('Error al crear valorización de supervisión:', error);
            setErrores([error instanceof Error ? error.message : 'Error desconocido']);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: onCancel, className: "btn-secondary flex items-center gap-2", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Volver"] }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Nueva Valorizaci\u00F3n de Supervisi\u00F3n" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Crear valorizaci\u00F3n de supervisi\u00F3n basada en d\u00EDas efectivos trabajados" })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: () => setMostrarCalculos(!mostrarCalculos), className: "btn-secondary flex items-center gap-2", disabled: !obraActual || diasEfectivos === 0, children: [_jsx(Calculator, { className: "w-4 h-4" }), mostrarCalculos ? 'Ocultar' : 'Ver', " C\u00E1lculos"] }), _jsxs("button", { onClick: handleGuardar, disabled: loading || errores.length > 0, className: "btn-primary flex items-center gap-2 disabled:opacity-50", children: [_jsx(Save, { className: "w-4 h-4" }), loading ? 'Guardando...' : 'Guardar Valorización'] })] })] }), errores.length > 0 && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "card border-red-200 bg-red-50", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-red-500 mt-0.5" }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-red-800 mb-1", children: "Errores de Validaci\u00F3n" }), _jsx("ul", { className: "text-sm text-red-700 space-y-1", children: errores.map((error, index) => (_jsxs("li", { children: ["\u2022 ", error] }, index))) })] })] }) })), mostrarCalculos && obraActual && diasEfectivos > 0 && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "card border-blue-200 bg-blue-50", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Calculator, { className: "w-5 h-5 text-blue-500 mt-0.5" }), _jsx("h3", { className: "font-medium text-blue-800", children: "Resumen de C\u00E1lculos" })] }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-600", children: "Monto Bruto" }), _jsx("p", { className: "font-semibold text-blue-900", children: formatearMoneda(calculos.montoBruto) }), _jsxs("p", { className: "text-xs text-blue-600", children: [diasEfectivos, " d\u00EDas \u00D7 ", formatearMoneda(tarifaDiaria)] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-600", children: "Deducciones" }), _jsx("p", { className: "font-semibold text-blue-900", children: formatearMoneda(calculos.totalDeducciones) }), _jsx("p", { className: "text-xs text-blue-600", children: "Retenci\u00F3n + Penalidades" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-600", children: "Monto Neto" }), _jsx("p", { className: "font-semibold text-blue-900", children: formatearMoneda(calculos.montoNeto) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-600", children: "D\u00EDas Trabajados" }), _jsxs("p", { className: "font-semibold text-blue-900", children: [porcentajeDiasTrabajados.toFixed(1), "%"] }), _jsxs("p", { className: "text-xs text-blue-600", children: [diasEfectivos, " de ", diasPeriodo, " d\u00EDas"] })] })] }), _jsxs("div", { className: "mt-4 pt-4 border-t border-blue-200", children: [_jsx("p", { className: "text-sm text-blue-600 mb-2", children: "Desglose de Deducciones:" }), _jsxs("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-blue-600", children: "Retenci\u00F3n Garant\u00EDa (5%):" }), _jsx("span", { className: "font-medium text-blue-800 ml-2", children: formatearMoneda(calculos.retencionMonto) })] }), penalidades > 0 && (_jsxs("div", { children: [_jsx("span", { className: "text-blue-600", children: "Penalidades:" }), _jsx("span", { className: "font-medium text-blue-800 ml-2", children: formatearMoneda(penalidades) })] })), otrasDeduccciones > 0 && (_jsxs("div", { children: [_jsx("span", { className: "text-blue-600", children: "Otras Deducciones:" }), _jsx("span", { className: "font-medium text-blue-800 ml-2", children: formatearMoneda(otrasDeduccciones) })] }))] })] })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Users, { className: "w-5 h-5 text-gray-500" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Informaci\u00F3n General" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Obra *" }), _jsxs("select", { value: obraSeleccionada || '', onChange: (e) => setObraSeleccionada(e.target.value ? Number(e.target.value) : null), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500", required: true, children: [_jsx("option", { value: "", children: "Seleccionar obra con supervisor..." }), obrasConSupervisor.map(obra => (_jsxs("option", { value: obra.id, children: [obra.numero_contrato, " - ", obra.nombre] }, obra.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Monto Supervisi\u00F3n" }), _jsx("input", { type: "text", value: obraActual ? formatearMoneda(obraActual.monto_supervision) : '', className: "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50", readOnly: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Fecha Inicio Periodo *" }), _jsx("input", { type: "date", value: fechaInicio, onChange: (e) => setFechaInicio(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Fecha Fin Periodo *" }), _jsx("input", { type: "date", value: fechaFin, onChange: (e) => setFechaFin(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "D\u00EDas Calendario del Periodo" }), _jsx("input", { type: "text", value: diasPeriodo, className: "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50", readOnly: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tarifa Diaria de Supervisi\u00F3n" }), _jsx("input", { type: "text", value: formatearMoneda(tarifaDiaria), className: "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50", readOnly: true }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Calculada autom\u00E1ticamente: Monto supervisi\u00F3n / D\u00EDas plazo" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "N\u00FAmero de Expediente" }), _jsx("input", { type: "text", value: numeroExpediente, onChange: (e) => setNumeroExpediente(e.target.value), placeholder: "N\u00FAmero de expediente administrativo", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "N\u00FAmero de Expediente SIAF" }), _jsx("input", { type: "text", value: numeroExpedienteSiaf, onChange: (e) => setNumeroExpedienteSiaf(e.target.value), placeholder: "N\u00FAmero de expediente SIAF", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] })] })] }), _jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Calendar, { className: "w-5 h-5 text-gray-500" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Control de D\u00EDas Trabajados" })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "md:col-span-3", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "D\u00EDas Efectivos Trabajados *" }), _jsx("input", { type: "number", value: diasEfectivos, onChange: (e) => setDiasEfectivos(Number(e.target.value) || 0), min: "0", max: diasPeriodo, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500", required: true }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["D\u00EDas reales de supervisi\u00F3n efectiva (m\u00E1ximo ", diasPeriodo, " d\u00EDas)"] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1", children: [_jsx(Cloud, { className: "w-4 h-4 text-blue-500" }), "D\u00EDas de Lluvia"] }), _jsx("input", { type: "number", value: diasLluvia, onChange: (e) => setDiasLluvia(Number(e.target.value) || 0), min: "0", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1", children: [_jsx(Calendar, { className: "w-4 h-4 text-green-500" }), "D\u00EDas Feriados"] }), _jsx("input", { type: "number", value: diasFeriados, onChange: (e) => setDiasFeriados(Number(e.target.value) || 0), min: "0", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1", children: [_jsx(Pause, { className: "w-4 h-4 text-orange-500" }), "D\u00EDas Suspensi\u00F3n"] }), _jsx("input", { type: "number", value: diasSuspension, onChange: (e) => setDiasSuspension(Number(e.target.value) || 0), min: "0", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1", children: [_jsx(MoreHorizontal, { className: "w-4 h-4 text-gray-500" }), "Otros Motivos"] }), _jsx("input", { type: "number", value: diasOtros, onChange: (e) => setDiasOtros(Number(e.target.value) || 0), min: "0", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Total No Trabajados" }), _jsx("input", { type: "text", value: diasNoTrabajados, className: "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50", readOnly: true })] })] }), _jsxs("div", { className: "mt-4 p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-700", children: "D\u00EDas del periodo:" }), _jsx("span", { className: "font-medium", children: diasPeriodo })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-700", children: "D\u00EDas efectivos:" }), _jsx("span", { className: "font-medium text-green-600", children: diasEfectivos })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-700", children: "D\u00EDas no trabajados:" }), _jsx("span", { className: "font-medium text-orange-600", children: diasNoTrabajados })] }), _jsxs("div", { className: "flex items-center justify-between text-sm border-t pt-2 mt-2", children: [_jsx("span", { className: "text-gray-700", children: "Total asignado:" }), _jsxs("span", { className: `font-medium ${diasEfectivos + diasNoTrabajados <= diasPeriodo
                                                            ? 'text-green-600'
                                                            : 'text-red-600'}`, children: [diasEfectivos + diasNoTrabajados, " / ", diasPeriodo] })] })] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Supervisor y Actividades" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Supervisor Responsable *" }), _jsx("input", { type: "text", value: supervisorResponsable, onChange: (e) => setSupervisorResponsable(e.target.value), placeholder: "Nombre completo del supervisor responsable", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Actividades Realizadas" }), _jsx("textarea", { value: actividadesRealizadas, onChange: (e) => setActividadesRealizadas(e.target.value), rows: 3, placeholder: "Descripci\u00F3n de las actividades de supervisi\u00F3n realizadas durante el periodo...", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Observaciones del Periodo" }), _jsx("textarea", { value: observacionesPeriodo, onChange: (e) => setObservacionesPeriodo(e.target.value), rows: 3, placeholder: "Observaciones generales sobre el periodo de supervisi\u00F3n...", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Motivos de D\u00EDas No Trabajados" }), _jsx("textarea", { value: motivosDiasNoTrabajados, onChange: (e) => setMotivosDiasNoTrabajados(e.target.value), rows: 2, placeholder: "Explicaci\u00F3n detallada de los motivos de los d\u00EDas no trabajados...", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Deducciones" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Penalidades (S/)" }), _jsx("input", { type: "number", value: penalidades, onChange: (e) => setPenalidades(Number(e.target.value) || 0), min: "0", step: "0.01", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Penalidades aplicables por incumplimientos" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Otras Deducciones (S/)" }), _jsx("input", { type: "number", value: otrasDeduccciones, onChange: (e) => setOtrasDeduccciones(Number(e.target.value) || 0), min: "0", step: "0.01", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" })] }), _jsx("div", { className: "border-t pt-4", children: _jsxs("div", { className: "text-sm text-gray-600", children: [_jsx("p", { children: "Retenci\u00F3n Garant\u00EDa: 5%" }), _jsx("p", { className: "text-xs mt-1", children: "Se aplica autom\u00E1ticamente sobre el monto bruto" })] }) })] })] }), obraSeleccionada && fechaInicio && fechaFin && (_jsxs("div", { className: "card border-blue-200 bg-blue-50", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Info, { className: "w-5 h-5 text-blue-500" }), _jsx("h3", { className: "font-medium text-blue-800", children: "Valorizaci\u00F3n Relacionada" })] }), buscarValorizacionEjecucion() ? (_jsxs("div", { className: "text-sm text-blue-700", children: [_jsx(CheckCircle, { className: "w-4 h-4 text-green-500 inline mr-2" }), "Se encontr\u00F3 valorizaci\u00F3n de ejecuci\u00F3n para el mismo periodo"] })) : (_jsxs("div", { className: "text-sm text-orange-700", children: [_jsx(AlertTriangle, { className: "w-4 h-4 text-orange-500 inline mr-2" }), "No se encontr\u00F3 valorizaci\u00F3n de ejecuci\u00F3n para este periodo"] }))] }))] })] })] }));
};
export default FormularioValorizacionSupervision;
