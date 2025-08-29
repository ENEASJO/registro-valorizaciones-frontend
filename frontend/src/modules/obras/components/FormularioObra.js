import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Construction, DollarSign, Calendar, MapPin, FileText, Users, AlertCircle, CheckCircle, Calculator, Clock, Scale, HelpCircle } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { TIPOS_OBRA, MODALIDADES_EJECUCION, SISTEMAS_CONTRATACION, CONFIG_NUMERO_CONTRATO, PROCEDIMIENTOS_LEY_30225, PROCEDIMIENTOS_LEY_32069, LEYES_CONTRATACION, TOOLTIPS_SISTEMAS_CONTRATACION } from '../../../types/obra.types';
import { useEntidadesContratistas } from '../../../hooks/useEmpresas';
import { useValidacionesObra } from '../../../hooks/useObras';
import PlantelProfesional from './PlantelProfesional';
const FormularioObra = ({ isOpen, onClose, onSubmit, obra, loading = false, title = "Nueva Obra" }) => {
    const { entidades } = useEntidadesContratistas();
    const { validarObraForm } = useValidacionesObra();
    const [tabActivo, setTabActivo] = useState('general');
    const [formData, setFormData] = useState({
        numero_contrato: '',
        nombre: '',
        codigo_interno: '',
        entidad_ejecutora_id: 0,
        entidad_supervisora_id: 0,
        monto_ejecucion: 0,
        monto_supervision: 0,
        plazo_ejecucion_dias: 0,
        fecha_inicio: '',
        fecha_termino: '',
        ubicacion: '',
        distrito: '',
        provincia: 'Lima',
        departamento: 'Lima',
        tipo_obra: undefined,
        modalidad_ejecucion: 'CONTRATA',
        sistema_contratacion: 'SUMA_ALZADA',
        descripcion: '',
        observaciones: '',
        errors: {}
    });
    const [plantelProfesional, setPlantelProfesional] = useState([]);
    const [mensaje, setMensaje] = useState(null);
    // Inicializar formulario con datos de obra existente
    useEffect(() => {
        if (obra && isOpen) {
            setFormData({
                ...obra,
                provincia: obra.provincia || 'Lima',
                departamento: obra.departamento || 'Lima',
                modalidad_ejecucion: obra.modalidad_ejecucion || 'CONTRATA',
                sistema_contratacion: obra.sistema_contratacion || 'SUMA_ALZADA',
                errors: {}
            });
            // Resetear plantel profesional para obra nueva
            if (!obra.numero_contrato) {
                setPlantelProfesional([]);
            }
        }
        else if (isOpen) {
            // Resetear formulario para obra nueva
            setFormData({
                numero_contrato: '',
                nombre: '',
                codigo_interno: '',
                entidad_ejecutora_id: 0,
                entidad_supervisora_id: 0,
                monto_ejecucion: 0,
                monto_supervision: 0,
                plazo_ejecucion_dias: 0,
                fecha_inicio: '',
                fecha_termino: '',
                ubicacion: '',
                distrito: '',
                provincia: 'Lima',
                departamento: 'Lima',
                tipo_obra: undefined,
                modalidad_ejecucion: 'CONTRATA',
                sistema_contratacion: 'SUMA_ALZADA',
                descripcion: '',
                observaciones: '',
                errors: {}
            });
            setPlantelProfesional([]);
        }
        // Enfocar el primer campo cuando se abre el modal
        if (isOpen) {
            setTimeout(() => {
                const firstInput = document.querySelector('#numero_contrato_input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 100);
        }
    }, [obra, isOpen]);
    // Manejar tecla ESC para cerrar modal
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevenir scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);
    // Mostrar mensaje temporal
    const mostrarMensaje = (tipo, texto) => {
        setMensaje({ tipo, texto });
        setTimeout(() => setMensaje(null), 5000);
    };
    // Actualizar campo del formulario
    const actualizarCampo = (campo, valor) => {
        setFormData(prev => {
            const newErrors = { ...prev.errors };
            delete newErrors[campo]; // Limpiar error del campo
            let newData = {
                ...prev,
                [campo]: valor,
                errors: newErrors
            };
            // Determinar automáticamente la ley aplicable según fecha de contrato
            if (campo === 'fecha_contrato' && valor) {
                const fechaContrato = new Date(valor);
                const fechaCorteLey32069 = new Date('2025-04-22'); // 22 de abril de 2025
                newData.ley_aplicable = fechaContrato >= fechaCorteLey32069 ? 'LEY_32069' : 'LEY_30225';
                // Limpiar procedimiento de selección si hay cambio de ley
                if (prev.ley_aplicable !== newData.ley_aplicable) {
                    newData.procedimiento_seleccion = undefined;
                }
            }
            return newData;
        });
    };
    // Validar formulario en tiempo real
    const validarFormulario = () => {
        const resultado = validarObraForm(formData);
        const errorsObj = {};
        resultado.errores.forEach(error => {
            errorsObj[error.campo] = error.mensaje;
        });
        setFormData(prev => ({
            ...prev,
            errors: errorsObj
        }));
        return resultado.valido;
    };
    // Calcular valores automáticos
    const calcularNumeroValorizaciones = (plazoDias) => {
        return Math.ceil(plazoDias / 30);
    };
    const calcularFechaFin = (fechaInicio, plazoDias) => {
        if (!fechaInicio || !plazoDias)
            return '';
        const fecha = new Date(fechaInicio);
        fecha.setDate(fecha.getDate() + plazoDias);
        return fecha.toISOString().split('T')[0];
    };
    const calcularMontoTotal = () => {
        return formData.monto_ejecucion + formData.monto_supervision;
    };
    // Obtener procedimientos disponibles según ley aplicable
    const getProcedimientosDisponibles = () => {
        if (formData.ley_aplicable === 'LEY_32069') {
            return PROCEDIMIENTOS_LEY_32069;
        }
        else if (formData.ley_aplicable === 'LEY_30225') {
            return PROCEDIMIENTOS_LEY_30225;
        }
        return {};
    };
    // Validar coherencia entre sistema de contratación y tipo de obra
    const esSistemaCoherente = (sistema, tipoObra) => {
        // Definir recomendaciones por tipo de obra
        const recomendaciones = {
            'CARRETERA': ['PRECIOS_UNITARIOS', 'SUMA_ALZADA'],
            'EDIFICACION': ['SUMA_ALZADA', 'PRECIOS_UNITARIOS', 'LLAVE_EN_MANO'],
            'SANEAMIENTO': ['PRECIOS_UNITARIOS', 'SUMA_ALZADA'],
            'ELECTRICIDAD': ['SUMA_ALZADA', 'PRECIOS_UNITARIOS'],
            'PUENTE': ['SUMA_ALZADA', 'PRECIOS_UNITARIOS'],
            'VEREDAS_PISTAS': ['SUMA_ALZADA', 'PRECIOS_UNITARIOS'],
            'PARQUES_JARDINES': ['SUMA_ALZADA', 'PRECIOS_UNITARIOS'],
            'DRENAJE_PLUVIAL': ['PRECIOS_UNITARIOS', 'SUMA_ALZADA'],
            'OTROS': ['SUMA_ALZADA', 'PRECIOS_UNITARIOS', 'LLAVE_EN_MANO']
        };
        return recomendaciones[tipoObra]?.includes(sistema) ?? true;
    };
    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) {
            mostrarMensaje('error', 'Por favor corrige los errores en el formulario');
            return;
        }
        try {
            const { errors, ...obraData } = formData;
            const params = {
                obra: obraData,
                plantel_profesional: plantelProfesional
            };
            await onSubmit(params);
            mostrarMensaje('success', 'Obra creada correctamente');
            // Pequeño delay antes de cerrar para mostrar el mensaje
            setTimeout(onClose, 1000);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al crear obra';
            mostrarMensaje('error', errorMessage);
        }
    };
    // Generar número de contrato sugerido
    const generarNumeroContrato = () => {
        const año = new Date().getFullYear();
        const numeroSugerido = `N.º 01-${año}-MDSM/GM`;
        actualizarCampo('numero_contrato', numeroSugerido);
    };
    // Calcular monto de supervisión sugerido (10% del monto de ejecución)
    const calcularSupervisionSugerida = () => {
        const supervisionSugerida = Math.round(formData.monto_ejecucion * 0.1);
        actualizarCampo('monto_supervision', supervisionSugerida);
    };
    if (!isOpen)
        return null;
    const fechaFinCalculada = calcularFechaFin(formData.fecha_inicio, formData.plazo_ejecucion_dias);
    const numeroValorizaciones = calcularNumeroValorizaciones(formData.plazo_ejecucion_dias);
    const montoTotal = calcularMontoTotal();
    return (_jsx("div", { className: "fixed inset-0 z-[9999] overflow-y-auto", role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0", children: [_jsx("div", { className: "fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity", onClick: onClose, "aria-hidden": "true" }), _jsx("div", { className: "inline-block w-full max-w-6xl my-8 text-left align-middle transition-all transform relative z-10", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white shadow-2xl rounded-lg px-6 py-4 relative overflow-hidden", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-6 pb-4 border-b border-gray-200", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Construction, { className: "w-6 h-6 text-primary-600" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900", children: title })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), mensaje && (_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: `mb-4 p-4 rounded-lg flex items-center gap-3 ${mensaje.tipo === 'success'
                                    ? 'bg-green-50 border border-green-200 text-green-800'
                                    : mensaje.tipo === 'warning'
                                        ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                                        : 'bg-red-50 border border-red-200 text-red-800'}`, children: [mensaje.tipo === 'success' ? (_jsx(CheckCircle, { className: "w-5 h-5 text-green-600" })) : (_jsx(AlertCircle, { className: "w-5 h-5" })), _jsx("span", { className: "font-medium", children: mensaje.texto })] })), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs(Tabs.Root, { value: tabActivo, onValueChange: setTabActivo, children: [_jsxs(Tabs.List, { className: "flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6", children: [_jsxs(Tabs.Trigger, { value: "general", className: "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 flex items-center gap-2", children: [_jsx(FileText, { className: "w-4 h-4" }), "Informaci\u00F3n General"] }), _jsxs(Tabs.Trigger, { value: "financiero", className: "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 flex items-center gap-2", children: [_jsx(DollarSign, { className: "w-4 h-4" }), "Informaci\u00F3n Financiera"] }), _jsxs(Tabs.Trigger, { value: "cronograma", className: "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4" }), "Cronograma"] }), _jsxs(Tabs.Trigger, { value: "plantel", className: "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 flex items-center gap-2", children: [_jsx(Users, { className: "w-4 h-4" }), "Plantel Profesional"] })] }), _jsxs(Tabs.Content, { value: "general", className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "N\u00FAmero de Contrato *" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { id: "numero_contrato_input", type: "text", value: formData.numero_contrato, onChange: (e) => actualizarCampo('numero_contrato', e.target.value), className: `input-field flex-1 ${formData.errors.numero_contrato ? 'border-red-300' : ''}`, placeholder: CONFIG_NUMERO_CONTRATO.ejemplo, autoComplete: "off" }), _jsx("button", { type: "button", onClick: generarNumeroContrato, className: "btn-secondary px-3", title: "Generar n\u00FAmero sugerido", children: _jsx(Calculator, { className: "w-4 h-4" }) })] }), formData.errors.numero_contrato && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: formData.errors.numero_contrato })), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Formato: ", CONFIG_NUMERO_CONTRATO.formato] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nombre de la Obra *" }), _jsx("input", { type: "text", value: formData.nombre, onChange: (e) => actualizarCampo('nombre', e.target.value), className: `input-field ${formData.errors.nombre ? 'border-red-300' : ''}`, placeholder: "Nombre completo y descriptivo de la obra" }), formData.errors.nombre && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: formData.errors.nombre }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "C\u00F3digo Interno" }), _jsx("input", { type: "text", value: formData.codigo_interno || '', onChange: (e) => actualizarCampo('codigo_interno', e.target.value), className: "input-field", placeholder: "OBR001" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipo de Obra" }), _jsxs("select", { value: formData.tipo_obra || '', onChange: (e) => actualizarCampo('tipo_obra', e.target.value), className: "input-field", children: [_jsx("option", { value: "", children: "Seleccionar tipo de obra" }), Object.entries(TIPOS_OBRA).map(([key, label]) => (_jsx("option", { value: key, children: label }, key)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Modalidad de Ejecuci\u00F3n" }), _jsx("select", { value: formData.modalidad_ejecucion, onChange: (e) => actualizarCampo('modalidad_ejecucion', e.target.value), className: "input-field", children: Object.entries(MODALIDADES_EJECUCION).map(([key, label]) => (_jsx("option", { value: key, children: label }, key))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fecha de Contrato *" }), _jsx("input", { type: "date", value: formData.fecha_contrato, onChange: (e) => actualizarCampo('fecha_contrato', e.target.value), className: `input-field ${formData.errors.fecha_contrato ? 'border-red-300' : ''}` }), formData.errors.fecha_contrato && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: formData.errors.fecha_contrato })), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Determina autom\u00E1ticamente la ley aplicable" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-lg font-medium text-gray-900 border-b border-gray-200 pb-2", children: [_jsx(Scale, { className: "w-5 h-5 inline mr-2" }), "Normativa de Contrataci\u00F3n P\u00FAblica"] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Ley Aplicable", _jsx(HelpCircle, { className: "w-4 h-4 inline ml-1 text-gray-400" })] }), _jsx("div", { className: `input-field bg-gray-50 border-dashed ${formData.ley_aplicable === 'LEY_32069'
                                                                                    ? 'border-green-300 text-green-800 bg-green-50'
                                                                                    : 'border-blue-300 text-blue-800 bg-blue-50'}`, children: formData.ley_aplicable
                                                                                    ? LEYES_CONTRATACION[formData.ley_aplicable]
                                                                                    : 'Seleccione fecha de contrato' }), formData.fecha_contrato && (_jsx("p", { className: `text-xs mt-1 ${formData.ley_aplicable === 'LEY_32069'
                                                                                    ? 'text-green-600'
                                                                                    : 'text-blue-600'}`, children: formData.ley_aplicable === 'LEY_32069'
                                                                                    ? '✓ Nueva ley desde 22/04/2025'
                                                                                    : 'ℹ Ley anterior al 22/04/2025' }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Procedimiento de Selecci\u00F3n" }), _jsxs("select", { value: formData.procedimiento_seleccion || '', onChange: (e) => actualizarCampo('procedimiento_seleccion', e.target.value), className: `input-field ${!formData.ley_aplicable ? 'bg-gray-50 text-gray-400' : ''}`, disabled: !formData.ley_aplicable, children: [_jsx("option", { value: "", children: formData.ley_aplicable
                                                                                            ? 'Seleccionar procedimiento'
                                                                                            : 'Primero seleccione fecha de contrato' }), Object.entries(getProcedimientosDisponibles()).map(([key, label]) => (_jsx("option", { value: key, children: label }, key)))] }), formData.ley_aplicable && (_jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Procedimientos disponibles seg\u00FAn ", LEYES_CONTRATACION[formData.ley_aplicable]] }))] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 border-b border-gray-200 pb-2", children: "Sistema de Contrataci\u00F3n" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Sistema de Contrataci\u00F3n *" }), _jsx("select", { value: formData.sistema_contratacion, onChange: (e) => actualizarCampo('sistema_contratacion', e.target.value), className: `input-field ${formData.tipo_obra && formData.sistema_contratacion && !esSistemaCoherente(formData.sistema_contratacion, formData.tipo_obra)
                                                                            ? 'border-yellow-300 bg-yellow-50'
                                                                            : ''}`, children: Object.entries(SISTEMAS_CONTRATACION).map(([key, label]) => (_jsx("option", { value: key, children: label }, key))) }), formData.sistema_contratacion && (_jsxs("div", { className: "mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md", children: [_jsx("p", { className: "text-sm text-blue-800 font-medium mb-1", children: SISTEMAS_CONTRATACION[formData.sistema_contratacion] }), _jsx("p", { className: "text-xs text-blue-700", children: TOOLTIPS_SISTEMAS_CONTRATACION[formData.sistema_contratacion] || 'Información no disponible' })] })), formData.tipo_obra && formData.sistema_contratacion && !esSistemaCoherente(formData.sistema_contratacion, formData.tipo_obra) && (_jsxs("div", { className: "mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md", children: [_jsxs("p", { className: "text-sm text-yellow-800 font-medium flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), "Revise la coherencia"] }), _jsx("p", { className: "text-xs text-yellow-700", children: "Este sistema de contrataci\u00F3n puede no ser el m\u00E1s adecuado para el tipo de obra seleccionado." })] }))] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 border-b border-gray-200 pb-2", children: "Entidades Contratistas" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Entidad Ejecutora *" }), _jsxs("select", { value: formData.entidad_ejecutora_id, onChange: (e) => actualizarCampo('entidad_ejecutora_id', parseInt(e.target.value)), className: `input-field ${formData.errors.entidad_ejecutora_id ? 'border-red-300' : ''}`, children: [_jsx("option", { value: 0, children: "Seleccionar entidad ejecutora" }), entidades.map(entidad => (_jsxs("option", { value: entidad.id, children: [entidad.nombre_completo, " (", entidad.tipo_entidad, ")"] }, entidad.id)))] }), formData.errors.entidad_ejecutora_id && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: formData.errors.entidad_ejecutora_id }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Entidad Supervisora *" }), _jsxs("select", { value: formData.entidad_supervisora_id, onChange: (e) => actualizarCampo('entidad_supervisora_id', parseInt(e.target.value)), className: `input-field ${formData.errors.entidad_supervisora_id ? 'border-red-300' : ''}`, children: [_jsx("option", { value: 0, children: "Seleccionar entidad supervisora" }), entidades
                                                                                        .filter(entidad => entidad.id !== formData.entidad_ejecutora_id)
                                                                                        .map(entidad => (_jsxs("option", { value: entidad.id, children: [entidad.nombre_completo, " (", entidad.tipo_entidad, ")"] }, entidad.id)))] }), formData.errors.entidad_supervisora_id && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: formData.errors.entidad_supervisora_id }))] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-lg font-medium text-gray-900 border-b border-gray-200 pb-2", children: [_jsx(MapPin, { className: "w-5 h-5 inline mr-2" }), "Ubicaci\u00F3n"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Departamento" }), _jsx("input", { type: "text", value: formData.departamento, onChange: (e) => actualizarCampo('departamento', e.target.value), className: "input-field", placeholder: "Lima" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Provincia" }), _jsx("input", { type: "text", value: formData.provincia, onChange: (e) => actualizarCampo('provincia', e.target.value), className: "input-field", placeholder: "Lima" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Distrito" }), _jsx("input", { type: "text", value: formData.distrito, onChange: (e) => actualizarCampo('distrito', e.target.value), className: "input-field", placeholder: "San Mart\u00EDn de Porres" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Ubicaci\u00F3n Espec\u00EDfica" }), _jsx("textarea", { value: formData.ubicacion || '', onChange: (e) => actualizarCampo('ubicacion', e.target.value), className: "input-field", rows: 2, placeholder: "Descripci\u00F3n detallada de la ubicaci\u00F3n de la obra" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Descripci\u00F3n de la Obra" }), _jsx("textarea", { value: formData.descripcion || '', onChange: (e) => actualizarCampo('descripcion', e.target.value), className: "input-field", rows: 4, placeholder: "Descripci\u00F3n t\u00E9cnica detallada de la obra, objetivos y alcance" })] })] }), _jsx(Tabs.Content, { value: "financiero", className: "space-y-6", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-lg font-medium text-gray-900 border-b border-gray-200 pb-2", children: [_jsx(DollarSign, { className: "w-5 h-5 inline mr-2" }), "Montos del Contrato"] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Monto de Ejecuci\u00F3n (S/) *" }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500", children: "S/" }), _jsx("input", { type: "number", min: "0", step: "0.01", value: formData.monto_ejecucion, onChange: (e) => actualizarCampo('monto_ejecucion', parseFloat(e.target.value) || 0), className: `input-field pl-10 ${formData.errors.monto_ejecucion ? 'border-red-300' : ''}`, placeholder: "0.00" })] }), formData.errors.monto_ejecucion && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: formData.errors.monto_ejecucion }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Monto de Supervisi\u00F3n (S/) *" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500", children: "S/" }), _jsx("input", { type: "number", min: "0", step: "0.01", value: formData.monto_supervision, onChange: (e) => actualizarCampo('monto_supervision', parseFloat(e.target.value) || 0), className: `input-field pl-10 ${formData.errors.monto_supervision ? 'border-red-300' : ''}`, placeholder: "0.00" })] }), _jsx("button", { type: "button", onClick: calcularSupervisionSugerida, className: "btn-secondary px-3", title: "Calcular 10% del monto de ejecuci\u00F3n", children: "10%" })] }), formData.errors.monto_supervision && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: formData.errors.monto_supervision }))] })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-6", children: [_jsx("h4", { className: "font-medium text-gray-900 mb-4", children: "Resumen Financiero" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Monto de Ejecuci\u00F3n:" }), _jsxs("span", { className: "font-medium", children: ["S/ ", formData.monto_ejecucion.toLocaleString('es-PE', { minimumFractionDigits: 2 })] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Monto de Supervisi\u00F3n:" }), _jsxs("span", { className: "font-medium", children: ["S/ ", formData.monto_supervision.toLocaleString('es-PE', { minimumFractionDigits: 2 })] })] }), _jsx("div", { className: "border-t border-gray-300 pt-2", children: _jsxs("div", { className: "flex justify-between text-base font-semibold", children: [_jsx("span", { className: "text-gray-900", children: "Monto Total:" }), _jsxs("span", { className: "text-primary-600", children: ["S/ ", montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })] })] }) })] }), formData.monto_supervision > 0 && formData.monto_ejecucion > 0 && (_jsx("div", { className: "mt-4 pt-4 border-t border-gray-300", children: _jsxs("div", { className: "text-sm text-gray-600", children: ["Porcentaje de supervisi\u00F3n: ", _jsxs("span", { className: "font-medium", children: [((formData.monto_supervision / formData.monto_ejecucion) * 100).toFixed(1), "%"] }), formData.monto_supervision / formData.monto_ejecucion > 0.2 && (_jsx("span", { className: "ml-2 text-yellow-600", children: "(Excede recomendaci\u00F3n del 20%)" }))] }) }))] })] }) }), _jsx(Tabs.Content, { value: "cronograma", className: "space-y-6", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-lg font-medium text-gray-900 border-b border-gray-200 pb-2", children: [_jsx(Calendar, { className: "w-5 h-5 inline mr-2" }), "Programaci\u00F3n de la Obra"] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fecha de Inicio de Obra *" }), _jsx("input", { type: "date", value: formData.fecha_inicio, onChange: (e) => actualizarCampo('fecha_inicio', e.target.value), className: `input-field ${formData.errors.fecha_inicio ? 'border-red-300' : ''}`, min: formData.fecha_contrato || new Date().toISOString().split('T')[0] }), formData.errors.fecha_inicio && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: formData.errors.fecha_inicio })), formData.fecha_contrato && (_jsx("p", { className: "text-xs text-gray-500 mt-1", children: "No puede ser anterior a la fecha del contrato" }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Plazo de Ejecuci\u00F3n (d\u00EDas) *" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", min: "1", value: formData.plazo_ejecucion_dias, onChange: (e) => actualizarCampo('plazo_ejecucion_dias', parseInt(e.target.value) || 0), className: `input-field pr-12 ${formData.errors.plazo_ejecucion_dias ? 'border-red-300' : ''}`, placeholder: "180" }), _jsx("span", { className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500", children: "d\u00EDas" })] }), formData.errors.plazo_ejecucion_dias && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: formData.errors.plazo_ejecucion_dias }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fecha de T\u00E9rmino/Culminaci\u00F3n" }), _jsx("input", { type: "date", value: formData.fecha_termino || '', onChange: (e) => actualizarCampo('fecha_termino', e.target.value), className: `input-field ${formData.errors.fecha_termino ? 'border-red-300' : ''}`, min: formData.fecha_inicio || new Date().toISOString().split('T')[0] }), formData.errors.fecha_termino && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: formData.errors.fecha_termino })), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Fecha planificada de t\u00E9rmino de la obra (opcional)" })] })] }), _jsxs("div", { className: "bg-blue-50 rounded-lg p-6", children: [_jsxs("h4", { className: "font-medium text-blue-900 mb-4 flex items-center gap-2", children: [_jsx(Clock, { className: "w-5 h-5" }), "Informaci\u00F3n Calculada"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-blue-700", children: "Fecha de Fin Prevista" }), _jsx("div", { className: "font-semibold text-blue-900", children: fechaFinCalculada ?
                                                                                        new Date(fechaFinCalculada).toLocaleDateString('es-PE') :
                                                                                        '-' })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-blue-700", children: "N\u00FAmero de Valorizaciones" }), _jsx("div", { className: "font-semibold text-blue-900", children: numeroValorizaciones || 0 })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-blue-700", children: "Plazo en Meses" }), _jsx("div", { className: "font-semibold text-blue-900", children: formData.plazo_ejecucion_dias ?
                                                                                        (formData.plazo_ejecucion_dias / 30).toFixed(1) :
                                                                                        '0' })] })] }), numeroValorizaciones > 0 && (_jsxs("div", { className: "mt-4 pt-4 border-t border-blue-200", children: [_jsxs("div", { className: "text-sm text-blue-700 mb-2", children: ["Se generar\u00E1n ", numeroValorizaciones, " valorizaciones programadas autom\u00E1ticamente"] }), _jsx("div", { className: "text-xs text-blue-600", children: "* Una valorizaci\u00F3n cada 30 d\u00EDas calendario" })] }))] })] }) }), _jsx(Tabs.Content, { value: "plantel", className: "space-y-6", children: _jsx(PlantelProfesional, { profesionales: plantelProfesional, onProfesionalesChange: setPlantelProfesional, fechaInicio: formData.fecha_inicio, fechaFin: fechaFinCalculada }) })] }), _jsxs("div", { className: "mt-6 pt-6 border-t border-gray-200", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Observaciones Generales" }), _jsx("textarea", { value: formData.observaciones || '', onChange: (e) => actualizarCampo('observaciones', e.target.value), className: "input-field", rows: 3, placeholder: "Observaciones adicionales sobre la obra" })] }), _jsxs("div", { className: "flex gap-4 mt-8 pt-6 border-t border-gray-200", children: [_jsxs("button", { type: "submit", disabled: loading, className: "btn-primary flex items-center gap-2 min-w-[120px] justify-center", children: [loading ? (_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" })) : (_jsx(CheckCircle, { className: "w-4 h-4" })), loading ? 'Creando...' : 'Crear Obra'] }), _jsx("button", { type: "button", onClick: onClose, className: "btn-secondary", disabled: loading, children: "Cancelar" })] })] })] }) })] }) }));
};
export default FormularioObra;
