import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, User, AlertTriangle, Check, Edit3, Trash, Phone, Mail, Percent } from 'lucide-react';
import { useProfesiones, useProfesionales, useValidacionesObra } from '../../../hooks/useObras';
const PlantelProfesional = ({ obraId, profesionales, onProfesionalesChange, fechaInicio, fechaFin, readonly = false, className = "" }) => {
    const { profesiones } = useProfesiones();
    const { verificarDisponibilidad } = useProfesionales();
    const { validarPorcentajeProfesional } = useValidacionesObra();
    const [profesionalesForm, setProfesionalesForm] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [profesionalEditando, setProfesionalEditando] = useState(null);
    const [loading, setLoading] = useState({});
    // Sincronizar con props
    useEffect(() => {
        const formData = profesionales.map((prof, index) => ({
            ...prof,
            id: `prof-${index}`,
            isEditing: false,
            errors: {}
        }));
        setProfesionalesForm(formData);
    }, [profesionales]);
    // Crear nuevo profesional vacío
    const crearProfesionalVacio = () => ({
        id: `new-${Date.now()}`,
        profesion_id: 0,
        nombre_completo: '',
        numero_colegiatura: '',
        dni: '',
        telefono: '',
        email: '',
        porcentaje_participacion: 0,
        fecha_inicio_participacion: fechaInicio,
        fecha_fin_participacion: fechaFin,
        cargo: '',
        responsabilidades: [],
        observaciones: '',
        isEditing: true,
        errors: {}
    });
    // Validar profesional
    const validarProfesional = async (profesional) => {
        const errors = {};
        // Validaciones básicas
        if (!profesional.profesion_id) {
            errors.profesion_id = 'Debe seleccionar una profesión';
        }
        if (!profesional.nombre_completo.trim()) {
            errors.nombre_completo = 'El nombre completo es obligatorio';
        }
        if (profesional.porcentaje_participacion <= 0 || profesional.porcentaje_participacion > 100) {
            errors.porcentaje_participacion = 'El porcentaje debe estar entre 1 y 100';
        }
        // Validar email si se proporciona
        if (profesional.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profesional.email)) {
            errors.email = 'Formato de email inválido';
        }
        // Validar DNI si se proporciona
        if (profesional.dni && (profesional.dni.length !== 8 || !/^\d{8}$/.test(profesional.dni))) {
            errors.dni = 'El DNI debe tener 8 dígitos';
        }
        // Validar teléfono si se proporciona
        if (profesional.telefono && (profesional.telefono.length < 7 || profesional.telefono.length > 15)) {
            errors.telefono = 'El teléfono debe tener entre 7 y 15 dígitos';
        }
        return errors;
    };
    // Verificar disponibilidad del profesional
    const verificarDisponibilidadProfesional = async (profesional) => {
        if (!profesional.nombre_completo.trim() || profesional.porcentaje_participacion !== 100) {
            return;
        }
        setLoading(prev => ({ ...prev, [profesional.id]: true }));
        try {
            const resultado = await verificarDisponibilidad(profesional.nombre_completo, profesional.fecha_inicio_participacion, profesional.fecha_fin_participacion || fechaFin, obraId);
            setProfesionalesForm(prev => prev.map(p => p.id === profesional.id
                ? { ...p, disponibilidad: resultado }
                : p));
        }
        catch (error) {
            console.error('Error verificando disponibilidad:', error);
        }
        finally {
            setLoading(prev => ({ ...prev, [profesional.id]: false }));
        }
    };
    // Agregar nuevo profesional
    const agregarProfesional = () => {
        const nuevoProfesional = crearProfesionalVacio();
        setProfesionalesForm(prev => [...prev, nuevoProfesional]);
        setMostrarFormulario(true);
        setProfesionalEditando(nuevoProfesional.id);
    };
    // Guardar profesional
    const guardarProfesional = async (profesionalId) => {
        const profesional = profesionalesForm.find(p => p.id === profesionalId);
        if (!profesional)
            return;
        const errors = await validarProfesional(profesional);
        if (Object.keys(errors).length > 0) {
            setProfesionalesForm(prev => prev.map(p => p.id === profesionalId
                ? { ...p, errors }
                : p));
            return;
        }
        // Verificar disponibilidad si tiene 100%
        if (profesional.porcentaje_participacion === 100) {
            await verificarDisponibilidadProfesional(profesional);
            const profesionalActualizado = profesionalesForm.find(p => p.id === profesionalId);
            if (profesionalActualizado?.disponibilidad && !profesionalActualizado.disponibilidad.disponible) {
                // Mostrar advertencia pero permitir guardar
            }
        }
        // Actualizar el estado
        const profesionalesActualizados = profesionalesForm.map(p => p.id === profesionalId
            ? { ...p, isEditing: false, errors: {} }
            : p);
        setProfesionalesForm(profesionalesActualizados);
        setProfesionalEditando(null);
        setMostrarFormulario(false);
        // Notificar cambios al padre
        const profesionalesSinTemporal = profesionalesActualizados
            .filter(p => !p.id?.startsWith('new-'))
            .map(({ id, isEditing, errors, disponibilidad, ...prof }) => prof);
        onProfesionalesChange(profesionalesSinTemporal);
    };
    // Editar profesional
    const editarProfesional = (profesionalId) => {
        setProfesionalesForm(prev => prev.map(p => p.id === profesionalId
            ? { ...p, isEditing: true, errors: {} }
            : p));
        setProfesionalEditando(profesionalId);
        setMostrarFormulario(true);
    };
    // Cancelar edición
    const cancelarEdicion = (profesionalId) => {
        const profesional = profesionalesForm.find(p => p.id === profesionalId);
        if (profesional?.id?.startsWith('new-')) {
            // Eliminar profesional nuevo
            setProfesionalesForm(prev => prev.filter(p => p.id !== profesionalId));
        }
        else {
            // Revertir cambios
            setProfesionalesForm(prev => prev.map(p => p.id === profesionalId
                ? { ...p, isEditing: false, errors: {} }
                : p));
        }
        setProfesionalEditando(null);
        setMostrarFormulario(false);
    };
    // Eliminar profesional
    const eliminarProfesional = (profesionalId) => {
        const profesional = profesionalesForm.find(p => p.id === profesionalId);
        if (!profesional)
            return;
        if (confirm(`¿Estás seguro de que quieres eliminar a ${profesional.nombre_completo}?`)) {
            const profesionalesActualizados = profesionalesForm.filter(p => p.id !== profesionalId);
            setProfesionalesForm(profesionalesActualizados);
            const profesionalesSinTemporal = profesionalesActualizados
                .filter(p => !p.id?.startsWith('new-'))
                .map(({ id, isEditing, errors, disponibilidad, ...prof }) => prof);
            onProfesionalesChange(profesionalesSinTemporal);
        }
    };
    // Actualizar campo de profesional
    const actualizarCampo = (profesionalId, campo, valor) => {
        setProfesionalesForm(prev => prev.map(p => p.id === profesionalId
            ? {
                ...p,
                [campo]: valor,
                errors: { ...p.errors, [campo]: undefined } // Limpiar error del campo
            }
            : p));
        // Verificar disponibilidad automáticamente si cambia el nombre y tiene 100%
        if (campo === 'nombre_completo' || campo === 'porcentaje_participacion') {
            setTimeout(() => {
                const profesional = profesionalesForm.find(p => p.id === profesionalId);
                if (profesional && profesional.porcentaje_participacion === 100) {
                    verificarDisponibilidadProfesional({ ...profesional, [campo]: valor });
                }
            }, 500); // Debounce
        }
    };
    // Calcular estadísticas
    const totalPorcentajes = profesionalesForm.reduce((sum, p) => sum + p.porcentaje_participacion, 0);
    const profesionalesConConflictos = profesionalesForm.filter(p => p.disponibilidad && !p.disponibilidad.disponible).length;
    const getProfesionNombre = (profesionId) => {
        const profesion = profesiones.find(p => p.id === profesionId);
        return profesion ? profesion.nombre : 'Profesión no encontrada';
    };
    return (_jsxs("div", { className: `space-y-6 ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Plantel Profesional" }), _jsx("p", { className: "text-sm text-gray-600", children: "Asignaci\u00F3n de profesionales responsables de la obra" })] }), !readonly && (_jsxs("button", { type: "button", onClick: agregarProfesional, className: "btn-primary flex items-center gap-2", disabled: mostrarFormulario, children: [_jsx(Plus, { className: "w-4 h-4" }), "Agregar Profesional"] }))] }), profesionalesForm.length > 0 && (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsx("div", { className: "bg-blue-50 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "w-5 h-5 text-blue-600" }), _jsxs("span", { className: "font-medium text-blue-900", children: [profesionalesForm.length, " Profesional", profesionalesForm.length !== 1 ? 'es' : ''] })] }) }), _jsx("div", { className: `rounded-lg p-4 ${totalPorcentajes > 100 ? 'bg-red-50' :
                            totalPorcentajes < 100 ? 'bg-yellow-50' : 'bg-green-50'}`, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Percent, { className: `w-5 h-5 ${totalPorcentajes > 100 ? 'text-red-600' :
                                        totalPorcentajes < 100 ? 'text-yellow-600' : 'text-green-600'}` }), _jsxs("span", { className: `font-medium ${totalPorcentajes > 100 ? 'text-red-900' :
                                        totalPorcentajes < 100 ? 'text-yellow-900' : 'text-green-900'}`, children: [totalPorcentajes, "% Total"] })] }) }), profesionalesConConflictos > 0 && (_jsx("div", { className: "bg-orange-50 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-orange-600" }), _jsxs("span", { className: "font-medium text-orange-900", children: [profesionalesConConflictos, " Conflicto", profesionalesConConflictos !== 1 ? 's' : ''] })] }) }))] })), _jsx("div", { className: "space-y-4", children: _jsx(AnimatePresence, { children: profesionalesForm.map((profesional) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "bg-white border border-gray-200 rounded-lg overflow-hidden", children: profesional.isEditing ? (
                        // Formulario de edición
                        _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Profesi\u00F3n *" }), _jsxs("select", { value: profesional.profesion_id, onChange: (e) => actualizarCampo(profesional.id, 'profesion_id', parseInt(e.target.value)), className: `input-field ${profesional.errors?.profesion_id ? 'border-red-300' : ''}`, children: [_jsx("option", { value: 0, children: "Seleccionar profesi\u00F3n" }), profesiones.map(prof => (_jsxs("option", { value: prof.id, children: [prof.nombre, " (", prof.abreviatura, ")"] }, prof.id)))] }), profesional.errors?.profesion_id && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: profesional.errors.profesion_id }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nombre Completo *" }), _jsx("input", { type: "text", value: profesional.nombre_completo, onChange: (e) => actualizarCampo(profesional.id, 'nombre_completo', e.target.value), className: `input-field ${profesional.errors?.nombre_completo ? 'border-red-300' : ''}`, placeholder: "Nombres y apellidos completos" }), profesional.errors?.nombre_completo && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: profesional.errors.nombre_completo }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "N\u00B0 Colegiatura" }), _jsx("input", { type: "text", value: profesional.numero_colegiatura || '', onChange: (e) => actualizarCampo(profesional.id, 'numero_colegiatura', e.target.value), className: "input-field", placeholder: "CIP-12345" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "DNI" }), _jsx("input", { type: "text", value: profesional.dni || '', onChange: (e) => actualizarCampo(profesional.id, 'dni', e.target.value), className: `input-field ${profesional.errors?.dni ? 'border-red-300' : ''}`, placeholder: "12345678", maxLength: 8 }), profesional.errors?.dni && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: profesional.errors.dni }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tel\u00E9fono" }), _jsx("input", { type: "tel", value: profesional.telefono || '', onChange: (e) => actualizarCampo(profesional.id, 'telefono', e.target.value), className: `input-field ${profesional.errors?.telefono ? 'border-red-300' : ''}`, placeholder: "987654321" }), profesional.errors?.telefono && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: profesional.errors.telefono }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }), _jsx("input", { type: "email", value: profesional.email || '', onChange: (e) => actualizarCampo(profesional.id, 'email', e.target.value), className: `input-field ${profesional.errors?.email ? 'border-red-300' : ''}`, placeholder: "profesional@email.com" }), profesional.errors?.email && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: profesional.errors.email }))] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Porcentaje de Participaci\u00F3n * ", loading[profesional.id] && '(Verificando...)'] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", min: "1", max: "100", value: profesional.porcentaje_participacion, onChange: (e) => actualizarCampo(profesional.id, 'porcentaje_participacion', parseFloat(e.target.value) || 0), className: `input-field pr-8 ${profesional.errors?.porcentaje_participacion ? 'border-red-300' : ''}`, placeholder: "100" }), _jsx("span", { className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500", children: "%" })] }), profesional.errors?.porcentaje_participacion && (_jsx("p", { className: "text-sm text-red-600 mt-1", children: profesional.errors.porcentaje_participacion }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Cargo" }), _jsx("input", { type: "text", value: profesional.cargo || '', onChange: (e) => actualizarCampo(profesional.id, 'cargo', e.target.value), className: "input-field", placeholder: "Residente de Obra" })] })] }), profesional.disponibilidad && !profesional.disponibilidad.disponible && (_jsx("div", { className: "bg-orange-50 border border-orange-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-orange-900", children: "Conflicto de Disponibilidad" }), _jsx("p", { className: "text-sm text-orange-800 mt-1", children: "Este profesional ya tiene 100% de participaci\u00F3n en las siguientes obras:" }), _jsx("ul", { className: "text-sm text-orange-800 mt-2 space-y-1", children: profesional.disponibilidad.conflictos.map((conflicto, index) => (_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-1.5 h-1.5 bg-orange-600 rounded-full flex-shrink-0" }), _jsxs("span", { children: [conflicto.obra_nombre, " (", conflicto.numero_contrato, ") - ", conflicto.fecha_inicio, " a ", conflicto.fecha_fin_prevista] })] }, index))) })] })] }) })), _jsxs("div", { className: "flex gap-3 pt-4 border-t", children: [_jsxs("button", { type: "button", onClick: () => guardarProfesional(profesional.id), className: "btn-primary flex items-center gap-2", children: [_jsx(Check, { className: "w-4 h-4" }), "Guardar"] }), _jsxs("button", { type: "button", onClick: () => cancelarEdicion(profesional.id), className: "btn-secondary flex items-center gap-2", children: [_jsx(X, { className: "w-4 h-4" }), "Cancelar"] })] })] })) : (
                        // Vista de lectura
                        _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900", children: profesional.nombre_completo }), _jsx("p", { className: "text-sm text-gray-600", children: getProfesionNombre(profesional.profesion_id) }), profesional.cargo && (_jsx("p", { className: "text-sm text-gray-600", children: profesional.cargo }))] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "text-right", children: [_jsxs("span", { className: "text-lg font-semibold text-gray-900", children: [profesional.porcentaje_participacion, "%"] }), _jsx("p", { className: "text-xs text-gray-500", children: "Participaci\u00F3n" })] }), profesional.disponibilidad && (_jsx("div", { className: "flex items-center gap-1", children: profesional.disponibilidad.disponible ? (_jsx(Check, { className: "w-4 h-4 text-green-600" })) : (_jsx(AlertTriangle, { className: "w-4 h-4 text-orange-600" })) })), !readonly && (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => editarProfesional(profesional.id), className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(Edit3, { className: "w-4 h-4" }) }), _jsx("button", { type: "button", onClick: () => eliminarProfesional(profesional.id), className: "p-2 text-gray-400 hover:text-red-600 transition-colors", children: _jsx(Trash, { className: "w-4 h-4" }) })] }))] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600", children: [profesional.numero_colegiatura && (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Colegiatura:" }), " ", profesional.numero_colegiatura] })), profesional.dni && (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "DNI:" }), " ", profesional.dni] })), profesional.telefono && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Phone, { className: "w-3 h-3" }), profesional.telefono] })), profesional.email && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Mail, { className: "w-3 h-3" }), profesional.email] }))] })] })) }, profesional.id))) }) }), profesionalesForm.length === 0 && !mostrarFormulario && (_jsxs("div", { className: "text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300", children: [_jsx(User, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Sin profesionales asignados" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Agrega profesionales al plantel t\u00E9cnico de la obra" }), !readonly && (_jsxs("button", { type: "button", onClick: agregarProfesional, className: "btn-primary flex items-center gap-2 mx-auto", children: [_jsx(Plus, { className: "w-4 h-4" }), "Agregar Primer Profesional"] }))] }))] }));
};
export default PlantelProfesional;
