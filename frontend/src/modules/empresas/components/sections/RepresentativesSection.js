import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =================================================================
// SECCIÓN DE REPRESENTANTES LEGALES
// Sistema de Valorizaciones - Frontend
// =================================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, Plus, Edit2, Trash2, Check, X, AlertCircle, CheckCircle, Crown, CreditCard } from 'lucide-react';
// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================
export const RepresentativesSection = ({ representante_legal = '', dni_representante = '', representantes = [], representantesDisponibles = [], estado, errores, onChange, onAddRepresentante, onEditRepresentante, onRemoveRepresentante, onSelectFromConsolidated, readonly = false, expandido = true, permitirMultiples = false, mostrarFuentesDatos = false, }) => {
    // =================================================================
    // ESTADO LOCAL
    // =================================================================
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editandoIndice, setEditandoIndice] = useState(null);
    const [mostrarConsolidados, setMostrarConsolidados] = useState(false);
    const [representanteEditando, setRepresentanteEditando] = useState({
        nombre: '',
        cargo: '',
        tipo_documento: 'DNI',
        numero_documento: '',
        fuente: 'MANUAL',
        activo: true,
    });
    // =================================================================
    // HELPERS
    // =================================================================
    const getFieldError = (field) => {
        return errores.find(error => error.campo === field)?.mensaje;
    };
    const obtenerRepresentantePrincipal = () => {
        if (representantes.length > 0) {
            return representantes[0];
        }
        if (representante_legal) {
            return {
                nombre: representante_legal,
                numero_documento: dni_representante,
                cargo: 'Representante Legal',
                fuente: 'MANUAL',
                activo: true,
            };
        }
        return null;
    };
    const manejarGuardarRepresentante = () => {
        if (!representanteEditando.nombre || !representanteEditando.numero_documento) {
            return;
        }
        const nuevoRepresentante = {
            ...representanteEditando,
        };
        if (editandoIndice !== null) {
            // Editando existente
            if (onEditRepresentante) {
                onEditRepresentante(editandoIndice, nuevoRepresentante);
            }
        }
        else {
            // Agregando nuevo
            if (onAddRepresentante) {
                onAddRepresentante(nuevoRepresentante);
            }
            else {
                // Fallback para compatibilidad
                if (!permitirMultiples) {
                    onChange('representante_legal', nuevoRepresentante.nombre);
                    onChange('dni_representante', nuevoRepresentante.numero_documento);
                }
            }
        }
        // Reset formulario
        setRepresentanteEditando({
            nombre: '',
            cargo: '',
            tipo_documento: 'DNI',
            numero_documento: '',
            fuente: 'MANUAL',
            activo: true,
        });
        setMostrarFormulario(false);
        setEditandoIndice(null);
    };
    const manejarCancelarEdicion = () => {
        setRepresentanteEditando({
            nombre: '',
            cargo: '',
            tipo_documento: 'DNI',
            numero_documento: '',
            fuente: 'MANUAL',
            activo: true,
        });
        setMostrarFormulario(false);
        setEditandoIndice(null);
    };
    const manejarEditarRepresentante = (index) => {
        const rep = representantes[index];
        setRepresentanteEditando({
            nombre: rep.nombre,
            cargo: rep.cargo || '',
            tipo_documento: rep.tipo_documento || 'DNI',
            numero_documento: rep.numero_documento || '',
            fuente: 'MANUAL',
            activo: rep.activo ?? true,
        });
        setEditandoIndice(index);
        setMostrarFormulario(true);
    };
    // =================================================================
    // RENDER
    // =================================================================
    if (!expandido)
        return null;
    const representantePrincipal = obtenerRepresentantePrincipal();
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${estado.con_errores
                                    ? 'bg-red-100 text-red-600'
                                    : estado.completado
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-blue-100 text-blue-600'}`, children: _jsx(Users, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Representantes Legales" }), _jsx("p", { className: "text-sm text-gray-600", children: permitirMultiples
                                            ? 'Personas autorizadas para representar la empresa'
                                            : 'Representante legal principal de la empresa' })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [estado.datos_consolidados && (_jsxs("div", { className: "flex items-center gap-1 text-xs text-green-600 font-medium", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), "Datos obtenidos"] })), representantesDisponibles.length > 0 && !readonly && (_jsxs("button", { type: "button", onClick: () => setMostrarConsolidados(true), className: "px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors flex items-center gap-1", children: [_jsx(Users, { className: "w-4 h-4" }), "Ver disponibles (", representantesDisponibles.length, ")"] }))] })] }), !permitirMultiples && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [_jsx(User, { className: "w-4 h-4 inline mr-1" }), "Nombre Completo *"] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", value: representante_legal, onChange: (e) => onChange('representante_legal', e.target.value), readOnly: readonly, className: `w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${getFieldError('representante_legal')
                                                    ? 'border-red-300 bg-red-50'
                                                    : estado.datos_consolidados
                                                        ? 'border-green-300 bg-green-50'
                                                        : 'border-gray-300'} ${readonly ? 'bg-gray-50 cursor-not-allowed' : ''}`, placeholder: "Nombre completo del representante legal" }), estado.datos_consolidados && (_jsx("div", { className: "absolute right-3 top-2 text-green-500", children: _jsx(CheckCircle, { className: "w-4 h-4" }) }))] }), getFieldError('representante_legal') && (_jsxs("p", { className: "text-red-500 text-sm mt-1 flex items-center gap-1", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), getFieldError('representante_legal')] }))] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [_jsx(CreditCard, { className: "w-4 h-4 inline mr-1" }), "Documento de Identidad *"] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", value: dni_representante, onChange: (e) => onChange('dni_representante', e.target.value), readOnly: readonly, maxLength: 8, className: `w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${getFieldError('dni_representante')
                                                    ? 'border-red-300 bg-red-50'
                                                    : estado.datos_consolidados
                                                        ? 'border-green-300 bg-green-50'
                                                        : 'border-gray-300'} ${readonly ? 'bg-gray-50 cursor-not-allowed' : ''}`, placeholder: "12345678" }), estado.datos_consolidados && (_jsx("div", { className: "absolute right-3 top-2 text-green-500", children: _jsx(CheckCircle, { className: "w-4 h-4" }) }))] }), getFieldError('dni_representante') && (_jsxs("p", { className: "text-red-500 text-sm mt-1 flex items-center gap-1", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), getFieldError('dni_representante')] }))] })] }), representantePrincipal && estado.datos_consolidados && mostrarFuentesDatos && (_jsx("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("div", { className: "text-sm text-blue-800", children: [_jsx("span", { className: "font-medium", children: "Cargo:" }), " ", representantePrincipal.cargo || 'No especificado', representantePrincipal.fecha_desde && (_jsxs("span", { className: "ml-3", children: [_jsx("span", { className: "font-medium", children: "Desde:" }), " ", representantePrincipal.fecha_desde] })), _jsxs("div", { className: "mt-1", children: [_jsx("span", { className: "font-medium", children: "Fuente:" }), " ", representantePrincipal.fuente] })] }) }))] })), permitirMultiples && (_jsxs("div", { className: "space-y-4", children: [representantes.length > 0 && (_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-md font-medium text-gray-900", children: "Representantes Registrados" }), representantes.map((representante, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center", children: index === 0 ? (_jsx(Crown, { className: "w-5 h-5 text-blue-600" })) : (_jsx(User, { className: "w-5 h-5 text-blue-600" })) }), _jsxs("div", { children: [_jsx("h5", { className: "font-medium text-gray-900", children: representante.nombre }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [representante.cargo && (_jsxs("span", { children: [_jsx("span", { className: "font-medium", children: "Cargo:" }), " ", representante.cargo] })), representante.numero_documento && (_jsxs("span", { children: [_jsx("span", { className: "font-medium", children: "DNI:" }), " ", representante.numero_documento] }))] }), mostrarFuentesDatos && (_jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${representante.fuente === 'SUNAT'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : representante.fuente === 'OECE'
                                                                        ? 'bg-purple-100 text-purple-800'
                                                                        : representante.fuente === 'AMBOS'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-gray-100 text-gray-800'}`, children: representante.fuente }), index === 0 && (_jsx("span", { className: "px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium", children: "Principal" }))] }))] })] }), !readonly && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "button", onClick: () => manejarEditarRepresentante(index), className: "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors", children: _jsx(Edit2, { className: "w-4 h-4" }) }), representantes.length > 1 && onRemoveRepresentante && (_jsx("button", { type: "button", onClick: () => onRemoveRepresentante(index), className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) }))] }))] }, index)))] })), !readonly && (_jsxs("button", { type: "button", onClick: () => setMostrarFormulario(true), className: "w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600", children: [_jsx(Plus, { className: "w-5 h-5" }), "Agregar Representante"] }))] })), _jsx(AnimatePresence, { children: mostrarFormulario && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, className: "bg-white rounded-xl shadow-xl max-w-md w-full mx-4", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: [editandoIndice !== null ? 'Editar' : 'Agregar', " Representante"] }), _jsx("button", { type: "button", onClick: manejarCancelarEdicion, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-500" }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nombre Completo *" }), _jsx("input", { type: "text", value: representanteEditando.nombre, onChange: (e) => setRepresentanteEditando(prev => ({ ...prev, nombre: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent", placeholder: "Nombre completo" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Cargo" }), _jsx("input", { type: "text", value: representanteEditando.cargo, onChange: (e) => setRepresentanteEditando(prev => ({ ...prev, cargo: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent", placeholder: "Gerente General, Director, etc." })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tipo Doc." }), _jsxs("select", { value: representanteEditando.tipo_documento, onChange: (e) => setRepresentanteEditando(prev => ({ ...prev, tipo_documento: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent", children: [_jsx("option", { value: "DNI", children: "DNI" }), _jsx("option", { value: "CE", children: "C.E." }), _jsx("option", { value: "PASSPORT", children: "Pasaporte" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "N\u00FAmero *" }), _jsx("input", { type: "text", value: representanteEditando.numero_documento, onChange: (e) => setRepresentanteEditando(prev => ({ ...prev, numero_documento: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent", placeholder: "12345678", maxLength: representanteEditando.tipo_documento === 'DNI' ? 8 : 20 })] })] })] }), _jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx("button", { type: "button", onClick: manejarCancelarEdicion, className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", children: "Cancelar" }), _jsxs("button", { type: "button", onClick: manejarGuardarRepresentante, disabled: !representanteEditando.nombre || !representanteEditando.numero_documento, className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: [_jsx(Check, { className: "w-4 h-4" }), editandoIndice !== null ? 'Actualizar' : 'Agregar'] })] })] }) }) })) }), _jsx(AnimatePresence, { children: mostrarConsolidados && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, className: "bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Representantes Disponibles" }), _jsx("button", { type: "button", onClick: () => setMostrarConsolidados(false), className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-500" }) })] }), _jsx("div", { className: "space-y-3", children: representantesDisponibles.map((representante, index) => (_jsx("button", { type: "button", onClick: () => {
                                            if (onSelectFromConsolidated) {
                                                onSelectFromConsolidated(representante);
                                            }
                                            setMostrarConsolidados(false);
                                        }, className: "w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900", children: representante.nombre }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [_jsx("span", { className: "font-medium", children: "Cargo:" }), " ", representante.cargo || 'No especificado'] }), representante.dni && (_jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-medium", children: "DNI:" }), " ", representante.dni] }))] }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${representante.fuente === 'SUNAT'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : representante.fuente === 'OECE'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-green-100 text-green-800'}`, children: representante.fuente })] }) }, index))) })] }) }) })) })] }));
};
export default RepresentativesSection;
