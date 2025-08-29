import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Shield, Eye, CheckCircle, AlertCircle, FileCheck } from 'lucide-react';
import { useEntidadesContratistas, useEmpresas } from '../../../hooks/useEmpresas';
import ListaEntidades from './ListaEntidades';
import FormularioEmpresa from './FormularioEmpresa';
import DetalleEntidad from './DetalleEntidad';
import BreadcrumbEmpresas from './BreadcrumbEmpresas';
const GestionSupervisoras = ({ onVolverADashboard, onMostrarMensaje } = {}) => {
    const { entidades, loading, error } = useEntidadesContratistas();
    const { crearEmpresa, eliminarEmpresa, loading: loadingEmpresa } = useEmpresas();
    const [modalAbierto, setModalAbierto] = useState(null);
    const [entidadSeleccionada, setEntidadSeleccionada] = useState(null);
    const [empresaEditando, setEmpresaEditando] = useState(null);
    const [filtros, setFiltros] = useState({
        search: '',
        tipo_entidad: undefined,
        estado: undefined,
        categoria: undefined,
        especialidades: []
    });
    // Filtrar entidades para supervisoras (por ahora mostramos todas, en el futuro se filtrarían por rol)
    const entidadesSupervisoras = entidades.filter(() => true); // TODO: Filtrar por rol SUPERVISOR
    // Estadísticas específicas para supervisoras
    const estadisticas = {
        totalSupervisoras: entidadesSupervisoras.length,
        empresasSupervisoras: entidadesSupervisoras.filter(e => e.tipo_entidad === 'EMPRESA').length,
        activasSupervisoras: entidadesSupervisoras.filter(e => e.estado === 'ACTIVO').length
    };
    // Handlers para modales
    const abrirModalEmpresa = (empresa) => {
        if (empresa && empresa.tipo_entidad === 'EMPRESA' && empresa.datos_empresa) {
            const empresaForm = {
                ruc: empresa.datos_empresa.ruc,
                razon_social: empresa.datos_empresa.razon_social,
                nombre_comercial: empresa.datos_empresa.nombre_comercial,
                email: empresa.datos_empresa.email,
                telefono: empresa.datos_empresa.telefono,
                direccion: empresa.datos_empresa.direccion,
                estado: empresa.estado,
                tipo_empresa: 'SAC', // Default
                categoria_contratista: empresa.datos_empresa.categoria_contratista,
                especialidades: empresa.datos_empresa.especialidades
            };
            setEmpresaEditando(empresaForm);
        }
        else {
            setEmpresaEditando(null);
        }
        setModalAbierto('empresa');
    };
    const abrirDetalleEntidad = (entidad) => {
        setEntidadSeleccionada(entidad);
        setModalAbierto('detalle');
    };
    const cerrarModal = () => {
        setModalAbierto(null);
        setEntidadSeleccionada(null);
        setEmpresaEditando(null);
    };
    // Handler para crear/actualizar empresa supervisora
    const handleSubmitEmpresa = async (empresaData) => {
        try {
            if (empresaEditando) {
                onMostrarMensaje?.('success', 'Empresa supervisora actualizada correctamente');
            }
            else {
                await crearEmpresa(empresaData);
                onMostrarMensaje?.('success', 'Empresa supervisora registrada correctamente');
            }
            cerrarModal();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al procesar empresa supervisora';
            onMostrarMensaje?.('error', errorMessage);
            throw error;
        }
    };
    // Handler para eliminar entidad supervisora
    const handleEliminarEntidad = async (entidad) => {
        const tipoEntidad = entidad.tipo_entidad === 'EMPRESA' ? 'empresa supervisora' : 'consorcio supervisor';
        if (!confirm(`¿Estás seguro de que quieres eliminar esta ${tipoEntidad} "${entidad.nombre_completo}"?`)) {
            return;
        }
        try {
            if (entidad.tipo_entidad === 'EMPRESA' && entidad.empresa_id) {
                await eliminarEmpresa(entidad.empresa_id);
                onMostrarMensaje?.('success', 'Empresa supervisora eliminada correctamente');
            }
            else {
                onMostrarMensaje?.('error', 'La eliminación de consorcios aún no está implementada');
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al eliminar';
            onMostrarMensaje?.('error', errorMessage);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center", children: _jsx(Shield, { className: "w-5 h-5 text-white" }) }), _jsx("h1", { className: "text-3xl font-bold text-green-900", children: "Empresas Supervisoras" })] }), _jsx("p", { className: "text-green-700 ml-13", children: "Gesti\u00F3n de empresas consultoras especializadas en supervisi\u00F3n y control de obras" })] }), _jsx("div", { className: "flex gap-3", children: _jsxs("button", { onClick: () => abrirModalEmpresa(), className: "flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 border border-green-300 rounded-lg transition-colors", children: [_jsx(Building2, { className: "w-5 h-5" }), "Nueva Empresa Supervisora"] }) })] }), _jsx(BreadcrumbEmpresas, { tipo: "supervisoras", onNavigate: (ruta) => {
                    if (ruta === 'dashboard') {
                        onVolverADashboard();
                    }
                } }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center", children: _jsx(Eye, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-green-900", children: estadisticas.totalSupervisoras }), _jsx("p", { className: "text-sm text-green-700", children: "Total Supervisoras" })] })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center", children: _jsx(Building2, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-green-900", children: estadisticas.empresasSupervisoras }), _jsx("p", { className: "text-sm text-green-700", children: "Empresas Supervisoras" })] })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center", children: _jsx(CheckCircle, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-green-900", children: estadisticas.activasSupervisoras }), _jsx("p", { className: "text-sm text-green-700", children: "Activas" })] })] }) })] }), _jsx("div", { className: "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0", children: _jsx(Shield, { className: "w-6 h-6 text-green-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-green-900 mb-2", children: "Rol de las Empresas Supervisoras" }), _jsx("p", { className: "text-green-700 mb-4", children: "Las empresas supervisoras son responsables del control t\u00E9cnico, seguimiento y verificaci\u00F3n del cumplimiento de especificaciones t\u00E9cnicas durante la ejecuci\u00F3n de obras p\u00FAblicas." }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-green-600", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), _jsx("span", { children: "Control de calidad en obra" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-green-600", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), _jsx("span", { children: "Verificaci\u00F3n de especificaciones t\u00E9cnicas" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-green-600", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), _jsx("span", { children: "Seguimiento de cronogramas" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-green-600", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), _jsx("span", { children: "Emisi\u00F3n de informes t\u00E9cnicos" })] })] })] })] }) }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center gap-2 text-red-800", children: [_jsx(AlertCircle, { className: "w-5 h-5" }), _jsxs("span", { className: "font-medium", children: ["Error al cargar empresas supervisoras: ", error] })] }) })), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-green-200", children: [_jsxs("div", { className: "border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 rounded-t-xl", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(FileCheck, { className: "w-5 h-5 text-green-600" }), _jsx("h2", { className: "text-lg font-semibold text-green-900", children: "Registro de Empresas Supervisoras" })] }), _jsx("p", { className: "text-sm text-green-700 mt-1", children: "Empresas consultoras y consorcios certificados para supervisi\u00F3n de obras p\u00FAblicas" })] }), _jsx("div", { className: "p-6", children: _jsx(ListaEntidades, { entidades: entidadesSupervisoras, loading: loading, filtros: filtros, onFiltrosChange: setFiltros, onVerDetalle: abrirDetalleEntidad, onEditar: abrirModalEmpresa, onEliminar: handleEliminarEntidad }) })] }), _jsx(FormularioEmpresa, { isOpen: modalAbierto === 'empresa', onClose: cerrarModal, onSubmit: handleSubmitEmpresa, empresa: empresaEditando || undefined, loading: loadingEmpresa, title: empresaEditando ? 'Editar Empresa Supervisora' : 'Nueva Empresa Supervisora' }), _jsx(DetalleEntidad, { entidad: entidadSeleccionada, isOpen: modalAbierto === 'detalle', onClose: cerrarModal, onEditar: () => {
                    if (entidadSeleccionada) {
                        cerrarModal();
                        abrirModalEmpresa(entidadSeleccionada);
                    }
                } })] }));
};
export default GestionSupervisoras;
