import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { X, Users, Save, AlertCircle, Trash, Search, CheckCircle, Building, Building2, Percent, Loader } from 'lucide-react';
import { useEmpresas } from '../../../hooks/useEmpresas';
import { useConsultaRuc } from '../../../hooks/useConsultaRuc';
const FormularioConsorcio = ({ isOpen, onClose, onSubmit, loading = false, title = "Nuevo Consorcio" }) => {
    const { crearEmpresa } = useEmpresas();
    // Hook de consulta RUC
    const { loading: loadingConsultaRuc, datos: datosConsultaRuc, datosOriginales: datosOriginalesRuc, error: errorConsultaRuc, advertencias: advertenciasRuc, consultarYAutocompletar, limpiarDatos: limpiarDatosRuc, validarRuc } = useConsultaRuc();
    // Estados principales
    const [consorcio, setConsorcio] = useState(null);
    const [integrantes, setIntegrantes] = useState([]);
    const [errors, setErrors] = useState([]);
    // Estados para modales
    const [modalAgregarConsorcio, setModalAgregarConsorcio] = useState(false);
    const [modalAgregarIntegrante, setModalAgregarIntegrante] = useState(false);
    // Estados para formularios
    const [rucConsorcio, setRucConsorcio] = useState('');
    const [rucIntegrante, setRucIntegrante] = useState('');
    const [porcentajeIntegrante, setPorcentajeIntegrante] = useState(0);
    // Estados de carga específicos
    const [consultandoTipo, setConsultandoTipo] = useState(null);
    useEffect(() => {
        if (isOpen) {
            // Reset completo del formulario
            setConsorcio(null);
            setIntegrantes([]);
            setErrors([]);
            setModalAgregarConsorcio(false);
            setModalAgregarIntegrante(false);
            setRucConsorcio('');
            setRucIntegrante('');
            setPorcentajeIntegrante(0);
            setConsultandoTipo(null);
            limpiarDatosRuc();
        }
    }, [isOpen, limpiarDatosRuc]);
    // Función para consultar RUC del consorcio
    const handleConsultarRucConsorcio = async () => {
        if (!rucConsorcio) {
            setErrors([{ campo: 'ruc_consorcio', mensaje: 'Ingrese un RUC para consultar' }]);
            return;
        }
        const validacion = validarRuc(rucConsorcio);
        if (!validacion.valido) {
            setErrors([{ campo: 'ruc_consorcio', mensaje: validacion.error || 'RUC inválido' }]);
            return;
        }
        setConsultandoTipo('consorcio');
        try {
            const resultado = await consultarYAutocompletar(rucConsorcio);
            if (resultado.success && resultado.datosFormulario) {
                // Limpiar errores cuando la consulta es exitosa
                setErrors([]);
            }
            else {
                setErrors([{
                        campo: 'ruc_consorcio',
                        mensaje: resultado.error || 'No se pudo consultar la información del RUC'
                    }]);
            }
        }
        catch (error) {
            console.error('Error en consulta RUC consorcio:', error);
            setErrors([{
                    campo: 'ruc_consorcio',
                    mensaje: 'Error de conexión. Verifique su conexión a internet e intente nuevamente.'
                }]);
        }
        finally {
            setConsultandoTipo(null);
        }
    };
    // Función para confirmar agregar consorcio
    const confirmarAgregarConsorcio = () => {
        if (!datosOriginalesRuc)
            return;
        const nuevoConsorcio = {
            id: Date.now().toString(),
            ruc: rucConsorcio,
            razonSocial: datosOriginalesRuc.razon_social,
            direccion: datosOriginalesRuc.direccion_completa,
            domicilioFiscal: datosOriginalesRuc.domicilio_fiscal,
            representanteLegal: datosOriginalesRuc.representantes_legales?.[0]?.nombre_completo,
            datosCompletos: datosOriginalesRuc
        };
        setConsorcio(nuevoConsorcio);
        setModalAgregarConsorcio(false);
        setRucConsorcio('');
        limpiarDatosRuc();
    };
    // Función para consultar RUC del integrante
    const handleConsultarRucIntegrante = async () => {
        if (!rucIntegrante) {
            setErrors([{ campo: 'ruc_integrante', mensaje: 'Ingrese un RUC para consultar' }]);
            return;
        }
        const validacion = validarRuc(rucIntegrante);
        if (!validacion.valido) {
            setErrors([{ campo: 'ruc_integrante', mensaje: validacion.error || 'RUC inválido' }]);
            return;
        }
        // Verificar que no esté ya agregado
        if (integrantes.some(i => i.ruc === rucIntegrante) || consorcio?.ruc === rucIntegrante) {
            setErrors([{ campo: 'ruc_integrante', mensaje: 'Este RUC ya está agregado' }]);
            return;
        }
        setConsultandoTipo('integrante');
        try {
            const resultado = await consultarYAutocompletar(rucIntegrante);
            if (resultado.success && resultado.datosFormulario) {
                // Limpiar errores cuando la consulta es exitosa
                setErrors([]);
            }
            else {
                setErrors([{
                        campo: 'ruc_integrante',
                        mensaje: resultado.error || 'No se pudo consultar la información del RUC'
                    }]);
            }
        }
        catch (error) {
            console.error('Error en consulta RUC integrante:', error);
            setErrors([{
                    campo: 'ruc_integrante',
                    mensaje: 'Error de conexión. Verifique su conexión a internet e intente nuevamente.'
                }]);
        }
        finally {
            setConsultandoTipo(null);
        }
    };
    // Función para confirmar agregar integrante
    const confirmarAgregarIntegrante = () => {
        if (!datosOriginalesRuc)
            return;
        const nuevoIntegrante = {
            id: Date.now().toString(),
            ruc: rucIntegrante,
            razonSocial: datosOriginalesRuc.razon_social,
            direccion: datosOriginalesRuc.direccion_completa,
            domicilioFiscal: datosOriginalesRuc.domicilio_fiscal,
            porcentajeParticipacion: porcentajeIntegrante || 0,
            datosCompletos: datosOriginalesRuc
        };
        setIntegrantes(prev => [...prev, nuevoIntegrante]);
        setModalAgregarIntegrante(false);
        setRucIntegrante('');
        setPorcentajeIntegrante(0);
        limpiarDatosRuc();
    };
    // Función para eliminar consorcio
    const eliminarConsorcio = () => {
        setConsorcio(null);
    };
    // Función para eliminar integrante
    const eliminarIntegrante = (id) => {
        setIntegrantes(prev => prev.filter(i => i.id !== id));
    };
    // Función para actualizar porcentaje de integrante
    const actualizarPorcentajeIntegrante = (id, porcentaje) => {
        setIntegrantes(prev => prev.map(i => i.id === id ? { ...i, porcentajeParticipacion: porcentaje } : i));
    };
    // Función para validar formulario completo
    const validarFormulario = () => {
        const errores = [];
        if (!consorcio) {
            errores.push({ campo: 'consorcio', mensaje: 'Debe agregar la información del consorcio principal' });
        }
        if (integrantes.length === 0) {
            errores.push({ campo: 'integrantes', mensaje: 'Debe agregar al menos un integrante al consorcio' });
        }
        // Validar porcentajes si hay integrantes
        if (integrantes.length > 0) {
            const totalPorcentajes = integrantes.reduce((sum, i) => sum + (i.porcentajeParticipacion || 0), 0);
            if (totalPorcentajes !== 100) {
                errores.push({
                    campo: 'porcentajes',
                    mensaje: `Los porcentajes de participación deben sumar 100%. Actual: ${totalPorcentajes.toFixed(1)}%`
                });
            }
            // Verificar que todos tengan porcentajes > 0
            const sinPorcentaje = integrantes.filter(i => (i.porcentajeParticipacion || 0) <= 0);
            if (sinPorcentaje.length > 0) {
                errores.push({
                    campo: 'porcentajes',
                    mensaje: 'Todos los integrantes deben tener un porcentaje de participación mayor a 0'
                });
            }
        }
        return errores;
    };
    // Función para enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const erroresValidacion = validarFormulario();
        setErrors(erroresValidacion);
        if (erroresValidacion.length > 0) {
            return;
        }
        if (!consorcio)
            return;
        try {
            // Crear empresa consorcio si no existe
            let empresaConsorcio;
            const empresaConsorcioData = {
                ruc: consorcio.ruc,
                razon_social: consorcio.razonSocial,
                nombre_comercial: consorcio.datosCompletos.nombre_comercial || '',
                direccion: consorcio.datosCompletos.direccion || '',
                distrito: consorcio.datosCompletos.distrito || '',
                provincia: consorcio.datosCompletos.provincia || '',
                departamento: consorcio.datosCompletos.departamento || '',
                representante_legal: consorcio.representanteLegal || '',
                dni_representante: consorcio.datosCompletos.representantes_legales?.[0]?.numero_documento || '',
                email: '',
                telefono: '',
                celular: '',
                estado: 'ACTIVO',
                tipo_empresa: 'SAC',
                categoria_contratista: 'A',
                especialidades: []
            };
            empresaConsorcio = await crearEmpresa(empresaConsorcioData);
            // Crear empresas integrantes
            const empresasParticipantes = [];
            for (const integrante of integrantes) {
                const empresaIntegranteData = {
                    ruc: integrante.ruc,
                    razon_social: integrante.razonSocial,
                    nombre_comercial: integrante.datosCompletos.nombre_comercial || '',
                    direccion: integrante.datosCompletos.direccion || '',
                    distrito: integrante.datosCompletos.distrito || '',
                    provincia: integrante.datosCompletos.provincia || '',
                    departamento: integrante.datosCompletos.departamento || '',
                    representante_legal: integrante.datosCompletos.representantes_legales?.[0]?.nombre_completo || '',
                    dni_representante: integrante.datosCompletos.representantes_legales?.[0]?.numero_documento || '',
                    email: '',
                    telefono: '',
                    celular: '',
                    estado: 'ACTIVO',
                    tipo_empresa: 'SAC',
                    categoria_contratista: 'B',
                    especialidades: []
                };
                const empresaIntegrante = await crearEmpresa(empresaIntegranteData);
                if (empresaIntegrante) {
                    empresasParticipantes.push({
                        empresa_id: empresaIntegrante.id,
                        porcentaje: integrante.porcentajeParticipacion || 0,
                        responsabilidades: []
                    });
                }
            }
            // Crear datos del consorcio
            const formDataConsorcio = {
                nombre: consorcio.razonSocial,
                descripcion: `Consorcio formado por ${integrantes.length} empresas integrantes`,
                fecha_constitucion: new Date().toISOString().split('T')[0],
                empresa_lider_id: empresaConsorcio?.id || 0,
                representante_consorcio: consorcio.representanteLegal || '',
                estado: 'ACTIVO',
                especialidades: []
            };
            const params = {
                consorcio: formDataConsorcio,
                empresas_participacion: empresasParticipantes
            };
            await onSubmit(params);
            onClose();
        }
        catch (error) {
            console.error('Error al crear consorcio:', error);
            setErrors([{ campo: 'general', mensaje: 'Error al crear el consorcio. Intente nuevamente.' }]);
        }
    };
    const getSumaPorcentajes = () => {
        return integrantes.reduce((sum, i) => sum + (i.porcentajeParticipacion || 0), 0);
    };
    if (!isOpen)
        return null;
    return (_jsx(AnimatePresence, { children: _jsxs("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: [_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, className: "bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white", children: _jsx(Users, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: title }), _jsx("p", { className: "text-sm text-gray-600", children: "Configure el consorcio y sus empresas integrantes" })] })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-500" }) })] }), _jsxs("div", { className: "px-6 py-6 space-y-8", children: [!consorcio && integrantes.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx(Users, { className: "w-8 h-8 text-blue-600" }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Crear Nuevo Consorcio" }), _jsx("p", { className: "text-gray-600 mb-8 max-w-lg mx-auto", children: "Primero agregue la informaci\u00F3n del consorcio principal. Una vez creado, podr\u00E1 a\u00F1adir las empresas integrantes." }), _jsx("div", { className: "flex justify-center", children: _jsxs("button", { onClick: () => setModalAgregarConsorcio(true), className: "flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105", children: [_jsx(Building, { className: "w-6 h-6" }), _jsx("span", { children: "A\u00F1adir Consorcio" })] }) })] })), (consorcio || integrantes.length > 0) && (_jsxs("div", { className: "flex flex-wrap gap-4 justify-center", children: [!consorcio && (_jsxs("button", { onClick: () => setModalAgregarConsorcio(true), className: "flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all", children: [_jsx(Building, { className: "w-5 h-5" }), _jsx("span", { children: "A\u00F1adir Consorcio" })] })), consorcio && (_jsxs("button", { onClick: () => setModalAgregarIntegrante(true), className: "flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all", children: [_jsx(Building2, { className: "w-5 h-5" }), _jsx("span", { children: "A\u00F1adir Integrante" })] }))] })), consorcio && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Building, { className: "w-6 h-6 text-blue-600" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Consorcio Principal" })] }), integrantes.length === 0 && (_jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm text-green-600 font-medium", children: "\u2713 Consorcio creado" }), _jsx("p", { className: "text-xs text-gray-500", children: "Ahora puede agregar integrantes" })] }))] }), _jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg", children: consorcio.razonSocial.charAt(0) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-xl font-bold text-gray-900", children: consorcio.razonSocial }), _jsxs("p", { className: "text-blue-700 font-medium", children: ["RUC: ", consorcio.ruc] }), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [consorcio.datosCompletos.estado_contribuyente && (_jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${consorcio.datosCompletos.estado_contribuyente === 'ACTIVO'
                                                                                            ? 'bg-green-100 text-green-800'
                                                                                            : 'bg-red-100 text-red-800'}`, children: consorcio.datosCompletos.estado_contribuyente })), consorcio.datosCompletos.condicion_domicilio && (_jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${consorcio.datosCompletos.condicion_domicilio === 'HABIDO'
                                                                                            ? 'bg-green-100 text-green-800'
                                                                                            : 'bg-yellow-100 text-yellow-800'}`, children: consorcio.datosCompletos.condicion_domicilio }))] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [consorcio.datosCompletos.tipo_contribuyente && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 font-medium", children: "Tipo Contribuyente:" }), _jsx("p", { className: "text-gray-900 font-semibold", children: consorcio.datosCompletos.tipo_contribuyente })] })), consorcio.datosCompletos.fecha_inscripcion && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 font-medium", children: "Fecha Inscripci\u00F3n:" }), _jsx("p", { className: "text-gray-900", children: consorcio.datosCompletos.fecha_inscripcion })] })), consorcio.direccion && (_jsxs("div", { className: "md:col-span-2", children: [_jsx("p", { className: "text-sm text-gray-600 font-medium", children: "Direcci\u00F3n:" }), _jsx("p", { className: "text-gray-900", children: consorcio.direccion })] })), consorcio.datosCompletos.tipo_persona !== 'NATURAL' && consorcio.datosCompletos.representantes_legales && consorcio.datosCompletos.representantes_legales.length > 0 && (_jsxs("div", { className: "md:col-span-2", children: [_jsx("p", { className: "text-sm text-gray-600 font-medium", children: "Representantes Legales:" }), _jsx("div", { className: "space-y-2 mt-2", children: consorcio.datosCompletos.representantes_legales.map((representante, index) => (_jsxs("div", { className: "bg-gray-50 p-2 rounded-lg border", children: [_jsx("p", { className: "text-gray-900 font-semibold text-sm", children: representante.nombre_completo }), representante.cargo && (_jsx("p", { className: "text-blue-600 text-xs font-medium", children: representante.cargo })), representante.numero_documento && (_jsxs("p", { className: "text-gray-600 text-xs", children: [representante.tipo_documento || 'DNI', ": ", representante.numero_documento] }))] }, index))) })] })), consorcio.datosCompletos.actividades_economicas && consorcio.datosCompletos.actividades_economicas.length > 0 && (_jsxs("div", { className: "md:col-span-2", children: [_jsx("p", { className: "text-sm text-gray-600 font-medium", children: "Actividades Econ\u00F3micas:" }), _jsxs("div", { className: "mt-2 space-y-2", children: [consorcio.datosCompletos.actividades_economicas.slice(0, 3).map((actividad, index) => (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: `inline-block px-2 py-1 text-xs rounded flex-shrink-0 ${actividad.principal
                                                                                                    ? 'bg-blue-100 text-blue-800 font-medium'
                                                                                                    : 'bg-gray-100 text-gray-700'}`, children: actividad.principal ? 'Principal' : 'Secundaria' }), _jsxs("div", { className: "flex-1 min-w-0", children: [actividad.ciiu && (_jsxs("p", { className: "text-xs text-gray-500", children: ["CIIU: ", actividad.ciiu] })), _jsx("p", { className: "text-sm text-gray-900 break-words", children: actividad.descripcion })] })] }, index))), consorcio.datosCompletos.actividades_economicas.length > 3 && (_jsxs("p", { className: "text-xs text-gray-500 italic", children: ["+ ", consorcio.datosCompletos.actividades_economicas.length - 3, " actividades m\u00E1s"] }))] })] }))] }), _jsxs("div", { className: "flex items-center gap-2 text-green-700 text-sm", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), _jsx("span", { children: "Datos validados con SUNAT" })] })] }), _jsx("button", { onClick: eliminarConsorcio, className: "p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors", title: "Eliminar consorcio", children: _jsx(Trash, { className: "w-5 h-5" }) })] }) })] })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Building2, { className: "w-6 h-6 text-green-600" }), _jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: ["Integrantes (", integrantes.length, ")"] })] }), integrantes.length > 0 && (_jsxs("div", { className: "text-right", children: [_jsxs("div", { className: `text-lg font-bold ${getSumaPorcentajes() === 100
                                                                ? 'text-green-600'
                                                                : getSumaPorcentajes() > 100
                                                                    ? 'text-red-600'
                                                                    : 'text-amber-600'}`, children: [getSumaPorcentajes().toFixed(1), "%", getSumaPorcentajes() === 100 && (_jsx("span", { className: "ml-2 text-green-600", children: "\u2713 Completo" })), getSumaPorcentajes() < 100 && getSumaPorcentajes() > 0 && (_jsxs("span", { className: "ml-2 text-amber-600", children: ["\u26A0\uFE0F Faltan ", (100 - getSumaPorcentajes()).toFixed(1), "%"] })), getSumaPorcentajes() > 100 && (_jsxs("span", { className: "ml-2 text-red-600", children: ["\u274C Excede ", (getSumaPorcentajes() - 100).toFixed(1), "%"] }))] }), _jsx("div", { className: "w-48 bg-gray-200 rounded-full h-2 mt-2", children: _jsx("div", { className: `h-full rounded-full transition-all duration-300 ${getSumaPorcentajes() === 100
                                                                    ? 'bg-green-500'
                                                                    : getSumaPorcentajes() > 100
                                                                        ? 'bg-red-500'
                                                                        : 'bg-amber-500'}`, style: { width: `${Math.min(getSumaPorcentajes(), 100)}%` } }) })] }))] }), integrantes.length === 0 && (_jsxs("div", { className: "text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300", children: [_jsx(Building2, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-500 font-medium", children: "No hay integrantes agregados" }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Use el bot\u00F3n \"A\u00F1adir Integrante\" para agregar empresas" })] })), integrantes.map((integrante, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, className: "bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg", children: integrante.razonSocial.charAt(0) }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-bold text-gray-900", children: integrante.razonSocial }), _jsxs("p", { className: "text-green-700 font-medium", children: ["RUC: ", integrante.ruc] })] })] }), integrante.direccion && (_jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm text-gray-600 font-medium", children: "Direcci\u00F3n:" }), _jsx("p", { className: "text-gray-900", children: integrante.direccion })] })), _jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Percent, { className: "w-4 h-4 text-gray-600" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Participaci\u00F3n:" })] }), _jsx("input", { type: "number", min: "0", max: "100", step: "0.1", value: integrante.porcentajeParticipacion || '', onChange: (e) => actualizarPorcentajeIntegrante(integrante.id, parseFloat(e.target.value) || 0), className: "w-24 px-3 py-1 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-bold", placeholder: "0.0" }), _jsx("span", { className: "text-sm font-bold text-gray-700", children: "%" }), _jsx("div", { className: "flex-1 max-w-xs", children: _jsx("div", { className: "bg-gray-200 rounded-full h-3", children: _jsx("div", { className: "h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-300", style: { width: `${Math.min(integrante.porcentajeParticipacion || 0, 100)}%` } }) }) })] }), _jsxs("div", { className: "flex items-center gap-2 text-green-700 text-sm", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), _jsx("span", { children: "Datos validados con SUNAT" })] })] }), _jsx("button", { onClick: () => eliminarIntegrante(integrante.id), className: "p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors", title: "Eliminar integrante", children: _jsx(Trash, { className: "w-5 h-5" }) })] }) }, integrante.id)))] }), errors.length > 0 && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-red-800 font-medium mb-2", children: [_jsx(AlertCircle, { className: "w-5 h-5" }), "Por favor corrige los siguientes errores:"] }), _jsx("ul", { className: "text-red-700 text-sm space-y-1", children: errors.map((error, index) => (_jsxs("li", { children: ["\u2022 ", error.mensaje] }, index))) })] })), (consorcio || integrantes.length > 0) && (_jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-200", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", disabled: loading, children: "Cancelar" }), _jsxs("button", { onClick: handleSubmit, disabled: loading, className: "flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: [loading ? (_jsx(Loader, { className: "w-4 h-4 animate-spin" })) : (_jsx(Save, { className: "w-4 h-4" })), loading ? 'Creando Consorcio...' : 'Crear Consorcio'] })] }))] })] }), modalAgregarConsorcio && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10", children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.9, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9, y: 20 }, className: "bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(Building, { className: "w-5 h-5 text-blue-600" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Agregar Consorcio" })] }), _jsx("button", { onClick: () => {
                                                setModalAgregarConsorcio(false);
                                                setRucConsorcio('');
                                                limpiarDatosRuc();
                                                setErrors([]);
                                            }, className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "RUC del Consorcio" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("input", { type: "text", value: rucConsorcio, onChange: (e) => {
                                                                const valor = e.target.value.replace(/\D/g, '').substring(0, 11);
                                                                setRucConsorcio(valor);
                                                                setErrors(prev => prev.filter(error => error.campo !== 'ruc_consorcio'));
                                                            }, className: `flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.find(e => e.campo === 'ruc_consorcio') ? 'border-red-300' : 'border-gray-300'}`, placeholder: "20123456789", maxLength: 11 }), _jsxs("button", { onClick: handleConsultarRucConsorcio, disabled: consultandoTipo === 'consorcio' || !rucConsorcio || rucConsorcio.length !== 11, className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: [consultandoTipo === 'consorcio' ? (_jsx(Loader, { className: "w-4 h-4 animate-spin" })) : (_jsx(Search, { className: "w-4 h-4" })), consultandoTipo === 'consorcio' ? 'Obteniendo datos...' : 'OBTENER DATOS'] })] }), errors.find(e => e.campo === 'ruc_consorcio') && (_jsxs("p", { className: "text-red-500 text-sm mt-1 flex items-center gap-1", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), errors.find(e => e.campo === 'ruc_consorcio')?.mensaje] }))] }), consultandoTipo !== 'consorcio' && datosOriginalesRuc && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "bg-green-50 border border-green-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-green-800 font-medium mb-3", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Informaci\u00F3n encontrada en SUNAT"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("span", { className: "font-medium text-gray-700", children: datosOriginalesRuc.tipo_persona === 'NATURAL' ? 'Nombre:' : 'Razón Social:' }), _jsx("p", { className: "text-gray-900 font-semibold text-lg", children: datosOriginalesRuc.razon_social }), _jsxs("p", { className: "text-gray-600 text-sm mt-1", children: ["RUC: ", datosOriginalesRuc.ruc] }), datosOriginalesRuc.tipo_persona === 'NATURAL' && datosOriginalesRuc.representantes_legales?.[0]?.numero_documento && (_jsxs("p", { className: "text-gray-600 text-sm", children: ["DNI: ", datosOriginalesRuc.representantes_legales[0].numero_documento] }))] }), datosOriginalesRuc.tipo_contribuyente && (_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Tipo Contribuyente:" }), _jsx("p", { className: "text-gray-900 font-medium", children: datosOriginalesRuc.tipo_contribuyente })] })), datosOriginalesRuc.fecha_inscripcion && (_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Fecha Inscripci\u00F3n:" }), _jsx("p", { className: "text-gray-900", children: datosOriginalesRuc.fecha_inscripcion })] })), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Estado:" }), _jsx("span", { className: `ml-2 px-2 py-1 rounded-full text-xs font-medium ${datosOriginalesRuc.estado_contribuyente === 'ACTIVO'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-red-100 text-red-800'}`, children: datosOriginalesRuc.estado_contribuyente })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Condici\u00F3n:" }), _jsx("span", { className: `ml-2 px-2 py-1 rounded-full text-xs font-medium ${datosOriginalesRuc.condicion_domicilio === 'HABIDO'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-yellow-100 text-yellow-800'}`, children: datosOriginalesRuc.condicion_domicilio })] }), datosOriginalesRuc.direccion_completa && (_jsxs("div", { className: "md:col-span-2", children: [_jsx("span", { className: "font-medium text-gray-700", children: "Direcci\u00F3n:" }), _jsx("p", { className: "text-gray-900", children: datosOriginalesRuc.direccion_completa })] })), datosOriginalesRuc.tipo_persona !== 'NATURAL' && datosOriginalesRuc.representantes_legales && datosOriginalesRuc.representantes_legales.length > 0 && (_jsxs("div", { className: "md:col-span-2", children: [_jsx("span", { className: "font-medium text-gray-700", children: "Representantes Legales:" }), _jsx("div", { className: "space-y-3 mt-2", children: datosOriginalesRuc.representantes_legales.map((representante, index) => (_jsxs("div", { className: "bg-gray-50 p-3 rounded-lg border", children: [_jsx("p", { className: "text-gray-900 font-semibold", children: representante.nombre_completo }), representante.cargo && (_jsx("p", { className: "text-blue-600 text-sm font-medium", children: representante.cargo })), representante.numero_documento && (_jsxs("p", { className: "text-gray-600 text-xs mt-1", children: [representante.tipo_documento || 'DNI', ": ", representante.numero_documento] })), representante.fecha_desde && (_jsxs("p", { className: "text-gray-500 text-xs", children: ["Desde: ", representante.fecha_desde] }))] }, index))) })] })), datosOriginalesRuc.actividades_economicas && datosOriginalesRuc.actividades_economicas.length > 0 && (_jsxs("div", { className: "md:col-span-2", children: [_jsx("span", { className: "font-medium text-gray-700", children: "Actividades Econ\u00F3micas:" }), _jsxs("div", { className: "mt-1 space-y-1", children: [datosOriginalesRuc.actividades_economicas.slice(0, 2).map((actividad, index) => (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: `inline-block px-2 py-1 text-xs rounded ${actividad.principal
                                                                                        ? 'bg-blue-100 text-blue-800 font-medium'
                                                                                        : 'bg-gray-100 text-gray-700'}`, children: actividad.principal ? 'Principal' : 'Secundaria' }), _jsxs("div", { className: "flex-1", children: [actividad.ciiu && (_jsxs("p", { className: "text-xs text-gray-500", children: ["CIIU: ", actividad.ciiu] })), _jsx("p", { className: "text-sm text-gray-900", children: actividad.descripcion })] })] }, index))), datosOriginalesRuc.actividades_economicas.length > 2 && (_jsxs("p", { className: "text-xs text-gray-500 italic", children: ["+ ", datosOriginalesRuc.actividades_economicas.length - 2, " actividades m\u00E1s"] }))] })] }))] }), _jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx("button", { onClick: () => {
                                                                setModalAgregarConsorcio(false);
                                                                setRucConsorcio('');
                                                                limpiarDatosRuc();
                                                            }, className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50", children: "Cancelar" }), _jsxs("button", { onClick: confirmarAgregarConsorcio, className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), "Confirmar"] })] })] }))] })] }) }) })), modalAgregarIntegrante && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10", children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.9, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9, y: 20 }, className: "bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(Building2, { className: "w-5 h-5 text-green-600" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Agregar Integrante" })] }), _jsx("button", { onClick: () => {
                                                setModalAgregarIntegrante(false);
                                                setRucIntegrante('');
                                                setPorcentajeIntegrante(0);
                                                limpiarDatosRuc();
                                                setErrors([]);
                                            }, className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "RUC del Integrante" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("input", { type: "text", value: rucIntegrante, onChange: (e) => {
                                                                const valor = e.target.value.replace(/\D/g, '').substring(0, 11);
                                                                setRucIntegrante(valor);
                                                                setErrors(prev => prev.filter(error => error.campo !== 'ruc_integrante'));
                                                            }, className: `flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.find(e => e.campo === 'ruc_integrante') ? 'border-red-300' : 'border-gray-300'}`, placeholder: "20123456789", maxLength: 11 }), _jsxs("button", { onClick: handleConsultarRucIntegrante, disabled: consultandoTipo === 'integrante' || !rucIntegrante || rucIntegrante.length !== 11, className: "px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: [consultandoTipo === 'integrante' ? (_jsx(Loader, { className: "w-4 h-4 animate-spin" })) : (_jsx(Search, { className: "w-4 h-4" })), consultandoTipo === 'integrante' ? 'Obteniendo datos...' : 'OBTENER DATOS'] })] }), errors.find(e => e.campo === 'ruc_integrante') && (_jsxs("p", { className: "text-red-500 text-sm mt-1 flex items-center gap-1", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), errors.find(e => e.campo === 'ruc_integrante')?.mensaje] }))] }), consultandoTipo !== 'integrante' && datosOriginalesRuc && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Porcentaje de Participaci\u00F3n (%)" }), _jsx("input", { type: "number", min: "0", max: "100", step: "0.1", value: porcentajeIntegrante || '', onChange: (e) => setPorcentajeIntegrante(parseFloat(e.target.value) || 0), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent", placeholder: "0.0" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Porcentaje asignado en el consorcio (opcional, se puede ajustar despu\u00E9s)" })] })), consultandoTipo !== 'integrante' && datosOriginalesRuc && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "bg-green-50 border border-green-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-green-800 font-medium mb-3", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Informaci\u00F3n encontrada en SUNAT"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("span", { className: "font-medium text-gray-700", children: datosOriginalesRuc.tipo_persona === 'NATURAL' ? 'Nombre:' : 'Razón Social:' }), _jsx("p", { className: "text-gray-900 font-semibold text-lg", children: datosOriginalesRuc.razon_social }), _jsxs("p", { className: "text-gray-600 text-sm mt-1", children: ["RUC: ", datosOriginalesRuc.ruc] }), datosOriginalesRuc.tipo_persona === 'NATURAL' && datosOriginalesRuc.representantes_legales?.[0]?.numero_documento && (_jsxs("p", { className: "text-gray-600 text-sm", children: ["DNI: ", datosOriginalesRuc.representantes_legales[0].numero_documento] }))] }), datosOriginalesRuc.tipo_contribuyente && (_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Tipo Contribuyente:" }), _jsx("p", { className: "text-gray-900 font-medium", children: datosOriginalesRuc.tipo_contribuyente })] })), datosOriginalesRuc.fecha_inscripcion && (_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Fecha Inscripci\u00F3n:" }), _jsx("p", { className: "text-gray-900", children: datosOriginalesRuc.fecha_inscripcion })] })), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Estado:" }), _jsx("span", { className: `ml-2 px-2 py-1 rounded-full text-xs font-medium ${datosOriginalesRuc.estado_contribuyente === 'ACTIVO'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-red-100 text-red-800'}`, children: datosOriginalesRuc.estado_contribuyente })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Condici\u00F3n:" }), _jsx("span", { className: `ml-2 px-2 py-1 rounded-full text-xs font-medium ${datosOriginalesRuc.condicion_domicilio === 'HABIDO'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-yellow-100 text-yellow-800'}`, children: datosOriginalesRuc.condicion_domicilio })] }), datosOriginalesRuc.direccion_completa && (_jsxs("div", { className: "md:col-span-2", children: [_jsx("span", { className: "font-medium text-gray-700", children: "Direcci\u00F3n:" }), _jsx("p", { className: "text-gray-900", children: datosOriginalesRuc.direccion_completa })] })), datosOriginalesRuc.tipo_persona !== 'NATURAL' && datosOriginalesRuc.representantes_legales && datosOriginalesRuc.representantes_legales.length > 0 && (_jsxs("div", { className: "md:col-span-2", children: [_jsx("span", { className: "font-medium text-gray-700", children: "Representantes Legales:" }), _jsx("div", { className: "space-y-3 mt-2", children: datosOriginalesRuc.representantes_legales.map((representante, index) => (_jsxs("div", { className: "bg-gray-50 p-3 rounded-lg border", children: [_jsx("p", { className: "text-gray-900 font-semibold", children: representante.nombre_completo }), representante.cargo && (_jsx("p", { className: "text-blue-600 text-sm font-medium", children: representante.cargo })), representante.numero_documento && (_jsxs("p", { className: "text-gray-600 text-xs mt-1", children: [representante.tipo_documento || 'DNI', ": ", representante.numero_documento] })), representante.fecha_desde && (_jsxs("p", { className: "text-gray-500 text-xs", children: ["Desde: ", representante.fecha_desde] }))] }, index))) })] })), datosOriginalesRuc.actividades_economicas && datosOriginalesRuc.actividades_economicas.length > 0 && (_jsxs("div", { className: "md:col-span-2", children: [_jsx("span", { className: "font-medium text-gray-700", children: "Actividades Econ\u00F3micas:" }), _jsxs("div", { className: "mt-1 space-y-1", children: [datosOriginalesRuc.actividades_economicas.slice(0, 2).map((actividad, index) => (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: `inline-block px-2 py-1 text-xs rounded ${actividad.principal
                                                                                        ? 'bg-blue-100 text-blue-800 font-medium'
                                                                                        : 'bg-gray-100 text-gray-700'}`, children: actividad.principal ? 'Principal' : 'Secundaria' }), _jsxs("div", { className: "flex-1", children: [actividad.ciiu && (_jsxs("p", { className: "text-xs text-gray-500", children: ["CIIU: ", actividad.ciiu] })), _jsx("p", { className: "text-sm text-gray-900", children: actividad.descripcion })] })] }, index))), datosOriginalesRuc.actividades_economicas.length > 2 && (_jsxs("p", { className: "text-xs text-gray-500 italic", children: ["+ ", datosOriginalesRuc.actividades_economicas.length - 2, " actividades m\u00E1s"] }))] })] }))] }), _jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx("button", { onClick: () => {
                                                                setModalAgregarIntegrante(false);
                                                                setRucIntegrante('');
                                                                setPorcentajeIntegrante(0);
                                                                limpiarDatosRuc();
                                                            }, className: "px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50", children: "Cancelar" }), _jsxs("button", { onClick: confirmarAgregarIntegrante, className: "px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), "Confirmar"] })] })] }))] })] }) }) }))] }) }));
};
export default FormularioConsorcio;
