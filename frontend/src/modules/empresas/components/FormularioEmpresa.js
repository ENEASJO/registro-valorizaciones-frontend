import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { X, Building2, Save, Search, CheckCircle, AlertTriangle, Loader2, Users, MapPin, Mail, Phone, Shield, Award, Database, FileText, Globe, Star, Crown, UserCheck } from 'lucide-react';
import { API_ENDPOINTS } from '../../../config/api';
// Utility functions for RUC type detection
const getRucType = (ruc) => {
    if (ruc.startsWith('10'))
        return 'NATURAL';
    if (ruc.startsWith('20'))
        return 'JURIDICA';
    return 'UNKNOWN';
};
const isPersonaNatural = (ruc) => getRucType(ruc) === 'NATURAL';
const isPersonaJuridica = (ruc) => getRucType(ruc) === 'JURIDICA';
// Extract DNI from RUC for natural persons (remove first and last digit)
const extractDniFromRuc = (ruc) => {
    if (ruc.length === 11 && ruc.startsWith('10')) {
        return ruc.substring(2, 10); // Remove first 2 digits (10) and last digit (check)
    }
    return '';
};
// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================
const FormularioEmpresa = ({ isOpen, onClose, onSubmit, loading = false, title = "Nueva Empresa Ejecutora" }) => {
    // Estados del formulario
    const [formData, setFormData] = useState({
        ruc: '',
        razon_social: '',
        dni: '',
        tipo_empresa: 'SAC',
        email: '',
        celular: '',
        direccion: '',
        representantes: [],
        representante_principal_id: 0,
        estado: 'ACTIVO',
        especialidades_oece: [],
        fuentes_consultadas: []
    });
    // Estados del proceso
    const [consultando, setConsultando] = useState(false);
    const [datosObtenidos, setDatosObtenidos] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [tipoConsultaRealizada, setTipoConsultaRealizada] = useState('');
    const [renderKey, setRenderKey] = useState(0);
    const formInitializedRef = useRef(false);
    // Reset form cuando se abre
    useEffect(() => {
        if (isOpen && !formInitializedRef.current) {
            formInitializedRef.current = true;
            setFormData({
                ruc: '',
                razon_social: '',
                dni: '',
                tipo_empresa: 'SAC',
                email: '',
                celular: '',
                direccion: '',
                representantes: [],
                representante_principal_id: 0,
                estado: 'ACTIVO',
                especialidades_oece: [],
                fuentes_consultadas: []
            });
            setDatosObtenidos(false);
            setError('');
            setCurrentStep(1);
            setTipoConsultaRealizada('');
            setRenderKey(0);
        }
    }, [isOpen]);
    // Reset form initialized flag when dialog closes
    useEffect(() => {
        if (!isOpen) {
            formInitializedRef.current = false;
        }
    }, [isOpen]);
    // Enhanced form update function
    const updateFormDataWithApiResponse = useCallback((data, tipoRespuesta) => {
        if (!formInitializedRef.current) {
            formInitializedRef.current = true;
        }
        // Process data based on person type
        const isPersonaNatural = data.tipo_persona === 'NATURAL' || data.ruc?.startsWith('10');
        let email = '';
        let celular = '';
        let direccion = '';
        let dni = '';
        if (isPersonaNatural) {
            email = data.email || '';
            celular = data.telefono || '';
            direccion = data.direccion || '';
            dni = data.dni || '';
        }
        else {
            email = data.contacto?.email || '';
            // Clean phone field
            let telefonoRaw = data.contacto?.telefono || '';
            celular = telefonoRaw.replace(/^[^:]*:\s*/, '').replace(/\n/g, '').trim();
            // Use fiscal address as main address
            direccion = data.contacto?.domicilio_fiscal || data.contacto?.direccion || '';
        }
        const newFormData = {
            ruc: data.ruc || '',
            razon_social: data.razon_social || '',
            dni: dni,
            email: email,
            celular: celular,
            direccion: direccion,
            representantes: (data.miembros || []).map(miembro => ({
                nombre: miembro.nombre || '',
                cargo: miembro.cargo || 'REPRESENTANTE',
                numero_documento: miembro.numero_documento || '',
                tipo_documento: miembro.tipo_documento || 'DNI',
                fuente: miembro.fuente || 'SUNAT',
                es_principal: false,
                activo: true
            })),
            representante_principal_id: 0,
            especialidades_oece: data.especialidades || [],
            estado_sunat: data.registro?.estado_sunat,
            estado_osce: data.registro?.estado_osce,
            fuentes_consultadas: data.fuentes_consultadas || [],
            capacidad_contratacion: data.registro?.capacidad_contratacion
        };
        React.startTransition(() => {
            setFormData(prev => ({ ...prev, ...newFormData }));
            setDatosObtenidos(true);
            setCurrentStep(2);
            setTipoConsultaRealizada('CONSOLIDADO');
            setError('');
            setRenderKey(Date.now() + Math.random());
        });
    }, []);
    // =================================================================
    // FUNCIONES DE NEGOCIO
    // =================================================================
    const handleObtenerDatosV2V2 = async () => {
        if (!formData.ruc || formData.ruc.length !== 11) {
            setError('Ingrese un RUC válido de 11 dígitos');
            return;
        }
        setConsultando(true);
        setError('');
        try {
            // Detectar tipo de RUC
            const esPersonaNatural = formData.ruc.startsWith('10');
            const esPersonaJuridica = formData.ruc.startsWith('20');
            if (!esPersonaNatural && !esPersonaJuridica) {
                setError('RUC debe comenzar con 10 (persona natural) o 20 (persona jurídica)');
                return;
            }
            let endpoint = '';
            let tipoConsulta = '';
            if (esPersonaNatural) {
                // Para personas naturales, usar SOLO SUNAT
                endpoint = `${API_ENDPOINTS.consultaRuc}/${formData.ruc}`;
                tipoConsulta = 'SUNAT-ONLY';
            }
            else {
                // Para personas jurídicas, usar endpoint consolidado (SUNAT + OSCE)
                endpoint = `${API_ENDPOINTS.consultaRucConsolidada}/${formData.ruc}`;
                tipoConsulta = 'CONSOLIDADO';
            }
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (esPersonaNatural) {
                // Procesar respuesta SUNAT-only para persona natural
                if (result.ruc && result.razon_social) {
                    const dniExtracted = extractDniFromRuc(result.ruc);
                    setFormData(prev => ({
                        ...prev,
                        ruc: result.ruc,
                        razon_social: result.razon_social,
                        dni: dniExtracted,
                        email: '',
                        celular: '',
                        direccion: result.domicilio_fiscal || '',
                        representantes: [], // Natural persons don't have separate representatives
                        representante_principal_id: 0,
                        especialidades_oece: [],
                        estado_sunat: 'ACTIVO',
                        fuentes_consultadas: ['SUNAT'],
                        capacidad_contratacion: undefined
                    }));
                    setDatosObtenidos(true);
                    setCurrentStep(2);
                    setTipoConsultaRealizada('SUNAT');
                    setError('');
                }
                else {
                    setError(result.message || 'No se pudo obtener información de SUNAT para este RUC');
                }
            }
            else {
                // Procesar respuesta consolidada para persona jurídica
                // Verificar si la respuesta tiene la estructura anidada (sunat/osce)
                if (result.sunat || result.osce) {
                    // Extraer datos de las fuentes anidadas
                    const sunatData = result.sunat || {};
                    const osceData = result.osce || {};
                    // Combinar representantes de ambas fuentes
                    const representantesCombinados = [
                        ...(sunatData.representantes || []),
                        ...(osceData.representantes || [])
                    ];
                    setFormData(prev => ({
                        ...prev,
                        ruc: result.ruc || sunatData.ruc || osceData.ruc || '',
                        razon_social: sunatData.razon_social || osceData.razon_social || '',
                        email: osceData.datos_contacto?.email || sunatData.email || osceData.email || '',
                        celular: osceData.datos_contacto?.telefono || sunatData.telefono || osceData.telefono || '',
                        direccion: sunatData.domicilio_fiscal || osceData.domicilio_fiscal || '',
                        representantes: representantesCombinados.map(rep => ({
                            nombre: rep.nombre || '',
                            cargo: rep.cargo || 'REPRESENTANTE',
                            numero_documento: rep.numero_doc || rep.numero_documento || '',
                            tipo_documento: 'DNI',
                            fuente: rep.fuente || 'SUNAT',
                            es_principal: false,
                            activo: true
                        })),
                        representante_principal_id: 0,
                        especialidades_oece: osceData.especialidades || [],
                        estado_sunat: 'ACTIVO',
                        estado_osce: osceData.estado_registro || '',
                        fuentes_consultadas: ['SUNAT', 'OSCE'].filter(fuente => (fuente === 'SUNAT' && result.sunat) || (fuente === 'OSCE' && result.osce)),
                        capacidad_contratacion: osceData.capacidad_contratacion || ''
                    }));
                    setDatosObtenidos(true);
                    setCurrentStep(2);
                    setTipoConsultaRealizada('CONSOLIDADO');
                    setError('');
                }
                else if (result.data) {
                    // Estructura consolidada original
                    const data = result.data;
                    // Use the enhanced form update function
                    updateFormDataWithApiResponse(data, 'CONSOLIDADO_ESTRUCTURA_ORIGINAL');
                }
                else {
                    setError(result.message || 'Error en la respuesta del servidor');
                }
            }
        }
        catch (err) {
            setError('Error de conexión. Verifique que la API esté ejecutándose.');
        }
        finally {
            setConsultando(false);
        }
    };
    const handleRepresentanteSelect = (index) => {
        setFormData(prev => ({
            ...prev,
            representante_principal_id: index
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.ruc || !formData.razon_social) {
            setError('RUC y Razón Social son obligatorios');
            return;
        }
        // For juridical entities, require representatives; natural persons represent themselves
        if (isPersonaJuridica(formData.ruc) && formData.representantes.length === 0) {
            setError('Debe obtener los datos y tener al menos un representante para personas jurídicas');
            return;
        }
        try {
            // Transform data to match backend API schema
            const apiData = {
                ruc: formData.ruc,
                razon_social: formData.razon_social,
                dni: formData.dni || null,
                tipo_empresa: formData.tipo_empresa,
                email: formData.email || null,
                celular: formData.celular || null,
                direccion: formData.direccion || null,
                representantes: isPersonaNatural(formData.ruc) ? [] : formData.representantes.map(rep => ({
                    nombre: rep.nombre,
                    cargo: rep.cargo || 'REPRESENTANTE',
                    numero_documento: rep.numero_documento,
                    tipo_documento: rep.tipo_documento || 'DNI',
                    fuente: rep.fuente || 'MANUAL',
                    es_principal: rep.es_principal || false,
                    activo: rep.activo ?? true
                })),
                representante_principal_id: isPersonaNatural(formData.ruc) ? 0 : formData.representante_principal_id,
                estado: formData.estado,
                especialidades_oece: formData.especialidades_oece || [],
                estado_sunat: formData.estado_sunat || null,
                estado_osce: formData.estado_osce || null,
                fuentes_consultadas: formData.fuentes_consultadas || [],
                capacidad_contratacion: formData.capacidad_contratacion || null
            };
            console.log('📤 Enviando datos al backend:', apiData);
            await onSubmit(apiData);
            onClose();
        }
        catch (error) {
            setError('Error al guardar la empresa');
        }
    };
    // =================================================================
    // COMPONENTES UI
    // =================================================================
    const StepIndicator = () => (_jsx("div", { className: "flex items-center justify-between mb-8", children: [1, 2, 3].map((step) => (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
            ${currentStep >= step
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-200 text-gray-600'}
          `, children: step }), _jsx("div", { className: `ml-3 ${currentStep >= step ? 'text-blue-600' : 'text-gray-500'}`, children: _jsxs("div", { className: "font-medium", children: [step === 1 && 'Consultar RUC', step === 2 && 'Verificar Datos', step === 3 && 'Guardar'] }) }), step < 3 && (_jsx("div", { className: `w-16 h-0.5 mx-4 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}` }))] }, step))) }));
    const ConsolidationBanner = () => {
        const isPartialConsolidation = error && error.startsWith('⚠️ Consolidación parcial:');
        return (_jsx(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: `rounded-xl p-6 mb-6 ${isPartialConsolidation
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
                : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'}`, children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "flex-shrink-0", children: isPartialConsolidation ? (_jsx(AlertTriangle, { className: "w-8 h-8 text-amber-600" })) : (_jsx(CheckCircle, { className: "w-8 h-8 text-green-600" })) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: `font-bold text-lg mb-2 ${isPartialConsolidation ? 'text-amber-800' : 'text-green-800'}`, children: isPartialConsolidation
                                    ? '⚠️ Datos Parciales Obtenidos'
                                    : '🎉 ¡Datos Obtenidos Exitosamente!' }), _jsxs("div", { className: "mb-4", children: [tipoConsultaRealizada === 'SUNAT' && (_jsxs("div", { className: "flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium", children: [_jsx(Database, { className: "w-4 h-4" }), "Consulta \u00FAnicamente (Persona Natural)"] })), tipoConsultaRealizada === 'CONSOLIDADO' && (_jsxs("div", { className: "flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium", children: [_jsx(Globe, { className: "w-4 h-4" }), "Consulta Consolidada + OSCE (Persona Jur\u00EDdica)"] }))] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 text-sm", children: [isPersonaJuridica(formData.ruc) && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-4 h-4 text-purple-600" }), _jsxs("span", { className: isPartialConsolidation ? "text-amber-700" : "text-green-700", children: [formData.representantes.length, " Representantes"] })] })), isPersonaNatural(formData.ruc) && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-4 h-4 text-blue-600" }), _jsx("span", { className: isPartialConsolidation ? "text-amber-700" : "text-green-700", children: "Persona Natural" })] })), tipoConsultaRealizada === 'CONSOLIDADO' && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Award, { className: "w-4 h-4 text-orange-600" }), _jsxs("span", { className: isPartialConsolidation ? "text-amber-700" : "text-green-700", children: [formData.especialidades_oece.length, " Especialidades"] })] })), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "w-4 h-4 text-red-600" }), _jsxs("span", { className: isPartialConsolidation ? "text-amber-700" : "text-green-700", children: ["Estado: ", isPartialConsolidation ? 'Parcial' : 'Verificado'] })] })] })] })] }) }));
    };
    const RepresentantesGrid = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Users, { className: "w-6 h-6 text-purple-600" }), _jsxs("h3", { className: "text-xl font-bold text-gray-900", children: ["Representantes Legales (", formData.representantes.length, ")"] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: formData.representantes.map((rep, index) => (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { delay: index * 0.1 }, onClick: () => handleRepresentanteSelect(index), className: `
              relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300
              ${formData.representante_principal_id === index
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg ring-4 ring-blue-100'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}
            `, children: [formData.representante_principal_id === index && (_jsx("div", { className: "absolute -top-3 left-6", children: _jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1", children: [_jsx(Crown, { className: "w-3 h-3" }), "REPRESENTANTE PRINCIPAL"] }) })), _jsxs("div", { className: "pt-2", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("h4", { className: "font-bold text-gray-900 text-lg leading-tight", children: rep.nombre }), _jsx(UserCheck, { className: `w-5 h-5 ${formData.representante_principal_id === index ? 'text-blue-600' : 'text-gray-400'}` })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-bold ${rep.cargo === 'GERENTE GENERAL' ? 'bg-blue-100 text-blue-800' :
                                                    rep.cargo === 'SOCIO' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-green-100 text-green-800'}`, children: rep.cargo || 'SOCIO' }) }), _jsxs("p", { className: "text-sm text-gray-600 font-mono", children: ["DNI: ", rep.numero_documento] }), rep.fecha_desde && (_jsxs("p", { className: "text-xs text-gray-500", children: ["Desde: ", rep.fecha_desde] }))] })] })] }, index))) }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: _jsxs("p", { className: "text-sm text-blue-800 flex items-center gap-2", children: [_jsx(Star, { className: "w-4 h-4" }), "Selecciona el representante que actuar\u00E1 como representante legal principal de la empresa."] }) })] }));
    const OECEInformation = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Award, { className: "w-6 h-6 text-orange-600" }), _jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Especialidades y Capacidades" })] }), _jsxs("div", { className: "bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6", children: [formData.estado_osce && (_jsxs("div", { className: "mb-6", children: [_jsxs("h4", { className: "font-bold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx(FileText, { className: "w-5 h-5 text-orange-600" }), "Estado de Registro"] }), _jsx("div", { className: "bg-white rounded-lg p-4 border border-orange-200", children: _jsx("pre", { className: "text-sm text-gray-800 whitespace-pre-wrap font-medium leading-relaxed", children: formData.estado_osce }) })] })), _jsxs("div", { children: [_jsxs("h4", { className: "font-bold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx(Award, { className: "w-5 h-5 text-orange-600" }), "Especialidades (", formData.especialidades_oece.length, ")"] }), _jsx("div", { className: "flex flex-wrap gap-3", children: formData.especialidades_oece.map((esp, index) => (_jsx(motion.span, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { delay: index * 0.05 }, className: "px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-bold shadow-md", children: esp }, index))) }), formData.capacidad_contratacion && (_jsx("div", { className: "mt-4 p-3 bg-white rounded-lg border border-orange-200", children: _jsxs("span", { className: "text-sm text-gray-600 font-medium", children: ["Capacidad: ", formData.capacidad_contratacion] }) }))] })] })] }));
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.9, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9, y: 20 }, className: "bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden", children: [_jsxs("div", { className: "relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-8", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors", children: _jsx(X, { className: "w-6 h-6" }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 bg-white/20 rounded-xl", children: _jsx(Building2, { className: "w-8 h-8" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold", children: title }), _jsx("p", { className: "text-blue-100 mt-1", children: "Registro de empresa con datos autom\u00E1ticos" })] })] }), _jsx("div", { className: "mt-6", children: _jsx(StepIndicator, {}) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-8 space-y-8 overflow-y-auto max-h-[calc(95vh-280px)]", children: [_jsx(AnimatePresence, { children: datosObtenidos && _jsx(ConsolidationBanner, {}) }), _jsx(AnimatePresence, { children: error && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "bg-red-50 border border-red-200 rounded-xl p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-red-600" }), _jsx("p", { className: "text-red-800 font-medium", children: error })] }) })) }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Search, { className: "w-6 h-6 text-blue-600" }), _jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Consulta de RUC" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "RUC Empresarial *" }), _jsx("input", { type: "text", value: formData.ruc, onChange: (e) => setFormData(prev => ({
                                                        ...prev,
                                                        ruc: e.target.value.replace(/\D/g, '').slice(0, 11)
                                                    })), className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg font-mono", placeholder: "10123456789 \u00F3 20123456789", maxLength: 11 }), formData.ruc.length >= 2 && (_jsxs("div", { className: "mt-2", children: [formData.ruc.startsWith('10') && (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }), _jsx("span", { className: "text-blue-600 font-medium", children: "Persona Natural - Consulta directa \u00FAnicamente" })] })), formData.ruc.startsWith('20') && (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full" }), _jsx("span", { className: "text-purple-600 font-medium", children: "Persona Jur\u00EDdica - Consulta Consolidada + OSCE" })] })), !formData.ruc.startsWith('10') && !formData.ruc.startsWith('20') && formData.ruc.length >= 2 && (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("div", { className: "w-2 h-2 bg-red-500 rounded-full" }), _jsx("span", { className: "text-red-600 font-medium", children: "RUC inv\u00E1lido - Debe comenzar con 10 \u00F3 20" })] }))] }))] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: [isPersonaNatural(formData.ruc) ? 'NOMBRE:' : 'Razón Social', " *"] }), _jsx("input", { type: "text", value: formData.razon_social, onChange: (e) => {
                                                        setFormData(prev => ({ ...prev, razon_social: e.target.value }));
                                                    }, className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500", placeholder: "Se completar\u00E1 autom\u00E1ticamente..." }, `razon-social-${renderKey}`)] }), isPersonaNatural(formData.ruc) && datosObtenidos && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "DNI:" }), _jsx("input", { type: "text", value: formData.dni, onChange: (e) => setFormData(prev => ({ ...prev, dni: e.target.value.replace(/\D/g, '').slice(0, 8) })), className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-mono", placeholder: "12345678", maxLength: 8 }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Extra\u00EDdo autom\u00E1ticamente del RUC o ingrese manualmente" })] }))] }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { type: "button", onClick: handleObtenerDatosV2V2, disabled: consultando || !formData.ruc, className: "px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-bold shadow-lg hover:shadow-xl transition-all text-lg", children: consultando ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-6 h-6 animate-spin" }), "Consultando..."] })) : (_jsxs(_Fragment, { children: [_jsx(Database, { className: "w-6 h-6" }), "OBTENER DATOS"] })) }) })] }), datosObtenidos && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Mail, { className: "w-6 h-6 text-green-600" }), _jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Informaci\u00F3n de Contacto" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Email Corporativo" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => {
                                                                setFormData(prev => ({ ...prev, email: e.target.value }));
                                                            }, className: "w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500", placeholder: "contacto@empresa.com" }, `email-${renderKey}`)] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Tel\u00E9fono / Celular" }), _jsxs("div", { className: "relative", children: [_jsx(Phone, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), _jsx("input", { type: "text", value: formData.celular, onChange: (e) => {
                                                                setFormData(prev => ({ ...prev, celular: e.target.value }));
                                                            }, className: "w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500", placeholder: "912345678" }, `celular-${renderKey}`)] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: isPersonaNatural(formData.ruc) ? 'DIRECCIÓN:' : 'Dirección Completa' }), _jsxs("div", { className: "relative", children: [_jsx(MapPin, { className: "absolute left-3 top-4 w-5 h-5 text-gray-400" }), _jsx("textarea", { value: formData.direccion, onChange: (e) => {
                                                        setFormData(prev => ({ ...prev, direccion: e.target.value }));
                                                    }, rows: 3, className: "w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 resize-none", placeholder: "Direcci\u00F3n completa obtenida autom\u00E1ticamente..." }, `direccion-${renderKey}`)] })] })] })), isPersonaJuridica(formData.ruc) && formData.representantes.length > 0 && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: _jsx(RepresentantesGrid, {}) })), isPersonaJuridica(formData.ruc) && tipoConsultaRealizada === 'CONSOLIDADO' && formData.especialidades_oece.length > 0 && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: _jsx(OECEInformation, {}) })), isPersonaNatural(formData.ruc) && tipoConsultaRealizada === 'SUNAT' && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-blue-50 border border-blue-200 rounded-xl p-6", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Award, { className: "w-6 h-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-blue-900 text-lg mb-2", children: "Informaci\u00F3n para Personas Naturales" }), _jsxs("p", { className: "text-blue-800 text-sm leading-relaxed", children: [_jsx("span", { className: "font-semibold", children: "Personas Naturales:" }), " Como persona natural, usted act\u00FAa como su propio representante legal. La informaci\u00F3n de especialidades y capacidades est\u00E1 disponible principalmente para personas jur\u00EDdicas y empresas."] }), _jsx("div", { className: "mt-3 text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block", children: "\uD83D\uDCA1 Para especialidades OSCE, se requiere registro como persona jur\u00EDdica" })] })] }) })), datosObtenidos && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Shield, { className: "w-6 h-6 text-indigo-600" }), _jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Clasificaci\u00F3n Local" })] }), _jsx("div", { className: "grid grid-cols-1 gap-6", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Estado" }), _jsxs("select", { value: formData.estado, onChange: (e) => setFormData(prev => ({ ...prev, estado: e.target.value })), className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500", children: [_jsx("option", { value: "ACTIVO", children: "\u2705 Activo" }), _jsx("option", { value: "INACTIVO", children: "\u23F8\uFE0F Inactivo" }), _jsx("option", { value: "SUSPENDIDO", children: "\u26A0\uFE0F Suspendido" })] })] }) })] }))] }), _jsxs("div", { className: "bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-between", children: [_jsx("div", { className: "text-sm text-gray-600", children: datosObtenidos ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4 text-green-600" }), "Datos consolidados listos para guardar"] })) : ('Complete la consulta RUC para continuar') }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors", children: "Cancelar" }), _jsx("button", { type: "submit", onClick: handleSubmit, disabled: loading || !datosObtenidos, className: "px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transition-all", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), "Guardando..."] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { className: "w-5 h-5" }), "Guardar Empresa"] })) })] })] })] }) }));
};
export default FormularioEmpresa;
