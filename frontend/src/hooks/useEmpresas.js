import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { waitForServiceWorker, isServiceWorkerReady, debugServiceWorkerStatus } from '../utils/service-worker-manager';
// Función auxiliar para mapear respuesta de API a tipo Empresa
const mapearEmpresaFromAPI = (apiEmpresa) => ({
    id: apiEmpresa.id,
    codigo: apiEmpresa.codigo || `EMP${apiEmpresa.id.toString().padStart(3, '0')}`,
    ruc: apiEmpresa.ruc,
    razon_social: apiEmpresa.razon_social,
    nombre_comercial: apiEmpresa.razon_social, // Usar razón social como nombre comercial por defecto
    email: apiEmpresa.email,
    telefono: apiEmpresa.celular,
    direccion: apiEmpresa.direccion,
    distrito: undefined,
    provincia: undefined,
    departamento: undefined,
    representante_legal: apiEmpresa.representante_legal,
    dni_representante: apiEmpresa.dni_representante,
    estado: apiEmpresa.estado || 'ACTIVO',
    tipo_empresa: 'SAC', // Valor por defecto, podría mejorarse
    categoria_contratista: apiEmpresa.categoria_contratista,
    especialidades: apiEmpresa.especialidades || [],
    activo: true,
    created_at: apiEmpresa.created_at,
    updated_at: apiEmpresa.updated_at
});
export const useEmpresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Cargar empresas guardadas desde la base de datos
    const cargarEmpresas = useCallback(async (filtros) => {
        setLoading(true);
        setError(null);
        
        // Debug: Log Service Worker status before making API calls
        if (import.meta.env.PROD) {
            console.log('🔍 Service Worker status before API call:');
            debugServiceWorkerStatus();
            console.log('⏰ API call timestamp:', new Date().toISOString());
        }
        
        // Wait for Service Worker to be ready in production
        if (import.meta.env.PROD) {
            try {
                console.log('⏳ Waiting for Service Worker before loading empresas...');
                await waitForServiceWorker(5000); // 5 second timeout
                console.log('✅ Service Worker ready, proceeding with API call');
            } catch (error) {
                console.warn('⚠️ Service Worker not ready, proceeding anyway:', error);
            }
        }
        
        try {
            console.log('🌐 Making API call to:', API_ENDPOINTS.empresasGuardadas);
            const response = await fetch(API_ENDPOINTS.empresasGuardadas);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success && result.data) {
                // Convertir respuesta de API a formato Empresa
                let empresasFromAPI = result.data.map(mapearEmpresaFromAPI);
                // Aplicar filtros localmente
                if (filtros?.search) {
                    const searchTerm = filtros.search.toLowerCase();
                    empresasFromAPI = empresasFromAPI.filter(empresa => empresa.razon_social.toLowerCase().includes(searchTerm) ||
                        empresa.nombre_comercial?.toLowerCase().includes(searchTerm) ||
                        empresa.ruc.includes(searchTerm));
                }
                if (filtros?.estado) {
                    empresasFromAPI = empresasFromAPI.filter(empresa => empresa.estado === filtros.estado);
                }
                if (filtros?.categoria) {
                    empresasFromAPI = empresasFromAPI.filter(empresa => empresa.categoria_contratista === filtros.categoria);
                }
                if (filtros?.especialidades && filtros.especialidades.length > 0) {
                    empresasFromAPI = empresasFromAPI.filter(empresa => empresa.especialidades?.some(esp => filtros.especialidades.includes(esp)));
                }
                setEmpresas(empresasFromAPI);
            }
            else {
                setEmpresas([]);
            }
        }
        catch (err) {
            console.error('Error loading empresas from database:', err);
            setError('Error al cargar empresas desde el servidor');
            setEmpresas([]);
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Crear nueva empresa usando el endpoint de la API
    const crearEmpresa = useCallback(async (empresaData) => {
        setLoading(true);
        setError(null);
        
        // Wait for Service Worker to be ready in production
        if (import.meta.env.PROD) {
            try {
                console.log('⏳ Waiting for Service Worker before creating empresa...');
                await waitForServiceWorker(5000);
                console.log('✅ Service Worker ready, proceeding with create API call');
            } catch (error) {
                console.warn('⚠️ Service Worker not ready for create, proceeding anyway:', error);
            }
        }
        
        try {
            console.log('🌐 Making create API call to:', API_ENDPOINTS.empresas);
            const response = await fetch(API_ENDPOINTS.empresas, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(empresaData),
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success && result.data) {
                const nuevaEmpresa = mapearEmpresaFromAPI(result.data);
                // Refrescar la lista después de la creación exitosa
                await cargarEmpresas();
                return nuevaEmpresa;
            }
            else {
                throw new Error(result.message || 'Error en la respuesta del servidor');
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear empresa';
            setError(errorMessage);
            console.error('Error creating empresa:', err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [cargarEmpresas]);
    // Actualizar empresa usando PUT al endpoint de la API
    const actualizarEmpresa = useCallback(async (id, empresaData) => {
        setLoading(true);
        setError(null);
        
        // Wait for Service Worker to be ready in production
        if (import.meta.env.PROD) {
            try {
                console.log('⏳ Waiting for Service Worker before updating empresa...');
                await waitForServiceWorker(5000);
                console.log('✅ Service Worker ready, proceeding with update API call');
            } catch (error) {
                console.warn('⚠️ Service Worker not ready for update, proceeding anyway:', error);
            }
        }
        
        try {
            console.log('🌐 Making update API call to:', `${API_ENDPOINTS.empresas}/${id}`);
            const response = await fetch(`${API_ENDPOINTS.empresas}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(empresaData),
            });
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Empresa no encontrada');
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success && result.data) {
                const empresaActualizada = mapearEmpresaFromAPI(result.data);
                // Refrescar la lista después de la actualización
                await cargarEmpresas();
                return empresaActualizada;
            }
            else {
                throw new Error(result.message || 'Error en la respuesta del servidor');
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar empresa';
            setError(errorMessage);
            console.error('Error updating empresa:', err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [cargarEmpresas]);
    // Eliminar empresa por RUC usando el endpoint de la API
    const eliminarEmpresa = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            // Primero obtener el RUC de la empresa
            const empresa = empresas.find(e => e.id === id);
            if (!empresa) {
                throw new Error('Empresa no encontrada');
            }
            const response = await fetch(`${API_ENDPOINTS.empresasGuardadas}/${empresa.ruc}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Empresa no encontrada');
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success) {
                // Refrescar la lista después de la eliminación
                await cargarEmpresas();
                return true;
            }
            else {
                throw new Error(result.message || 'Error al eliminar empresa');
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar empresa';
            setError(errorMessage);
            console.error('Error deleting empresa:', err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [empresas, cargarEmpresas]);
    // Obtener empresa por RUC usando el endpoint de la API
    const obtenerEmpresaPorId = useCallback(async (id) => {
        // Primero buscar en la lista local
        const empresaLocal = empresas.find(e => e.id === id);
        if (empresaLocal) {
            return empresaLocal;
        }
        // Si no está en la lista local, buscar por RUC en el servidor
        // Nota: Esta función necesitaría el RUC, pero mantenemos la interfaz por compatibilidad
        console.warn('obtenerEmpresaPorId: Empresa no encontrada en lista local, considere usar obtenerEmpresaPorRuc');
        return null;
    }, [empresas]);
    // Obtener empresa por RUC (nuevo método)
    const obtenerEmpresaPorRuc = useCallback(async (ruc) => {
        setLoading(true);
        setError(null);
        
        // Wait for Service Worker to be ready in production
        if (import.meta.env.PROD) {
            try {
                console.log('⏳ Waiting for Service Worker before getting empresa by RUC...');
                await waitForServiceWorker(5000);
                console.log('✅ Service Worker ready, proceeding with get API call');
            } catch (error) {
                console.warn('⚠️ Service Worker not ready for get, proceeding anyway:', error);
            }
        }
        
        try {
            console.log('🌐 Making get API call to:', `${API_ENDPOINTS.empresasGuardadas}/${ruc}`);
            const response = await fetch(`${API_ENDPOINTS.empresasGuardadas}/${ruc}`);
            if (!response.ok) {
                if (response.status === 404) {
                    return null; // Empresa no encontrada
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success && result.data) {
                return mapearEmpresaFromAPI(result.data);
            }
            return null;
        }
        catch (err) {
            console.error('Error getting empresa by RUC:', err);
            setError('Error al obtener empresa por RUC');
            return null;
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Buscar empresas usando el endpoint de búsqueda de la API
    const buscarEmpresas = useCallback(async (query) => {
        if (!query.trim()) {
            return [];
        }
        setLoading(true);
        setError(null);
        
        // Wait for Service Worker to be ready in production
        if (import.meta.env.PROD) {
            try {
                console.log('⏳ Waiting for Service Worker before searching empresas...');
                await waitForServiceWorker(5000);
                console.log('✅ Service Worker ready, proceeding with search API call');
            } catch (error) {
                console.warn('⚠️ Service Worker not ready for search, proceeding anyway:', error);
            }
        }
        
        try {
            console.log('🌐 Making search API call to:', `${API_ENDPOINTS.empresasSearch}?q=${encodeURIComponent(query)}`);
            const response = await fetch(`${API_ENDPOINTS.empresasSearch}?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success && result.data) {
                return result.data.map(mapearEmpresaFromAPI);
            }
            return [];
        }
        catch (err) {
            console.error('Error searching empresas:', err);
            setError('Error al buscar empresas');
            return [];
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Obtener estadísticas usando el endpoint de la API
    const obtenerEstadisticas = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        // Wait for Service Worker to be ready in production
        if (import.meta.env.PROD) {
            try {
                console.log('⏳ Waiting for Service Worker before getting stats...');
                await waitForServiceWorker(5000);
                console.log('✅ Service Worker ready, proceeding with stats API call');
            } catch (error) {
                console.warn('⚠️ Service Worker not ready for stats, proceeding anyway:', error);
            }
        }
        
        try {
            console.log('🌐 Making stats API call to:', API_ENDPOINTS.empresasStats);
            const response = await fetch(API_ENDPOINTS.empresasStats);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success && result.data) {
                return result.data;
            }
            return null;
        }
        catch (err) {
            console.error('Error getting empresas stats:', err);
            setError('Error al obtener estadísticas de empresas');
            return null;
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        // Delay initial load to ensure Service Worker is ready
        const loadEmpresas = async () => {
            if (import.meta.env.PROD) {
                console.log('⏳ useEmpresas: Waiting for Service Worker before initial load...');
                try {
                    await waitForServiceWorker(5000);
                    console.log('✅ useEmpresas: Service Worker ready, loading empresas...');
                } catch (error) {
                    console.warn('⚠️ useEmpresas: Service Worker not ready, loading anyway:', error);
                }
            } else {
                console.log('🔧 useEmpresas: Development mode, loading empresas immediately');
            }
            
            await cargarEmpresas();
        };
        
        loadEmpresas();
    }, []); // Empty dependency array to prevent infinite loops
    return {
        empresas,
        loading,
        error,
        cargarEmpresas,
        crearEmpresa,
        actualizarEmpresa,
        eliminarEmpresa,
        obtenerEmpresaPorId,
        obtenerEmpresaPorRuc,
        buscarEmpresas,
        obtenerEstadisticas
    };
};
// Mock data temporal para consorcios (mantenido para compatibilidad)
const mockConsorcios = [];
export const useConsorcios = () => {
    const [consorcios, setConsorcios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Cargar consorcios (actualmente usando mock - pendiente de implementación en la API)
    const cargarConsorcios = useCallback(async (filtros) => {
        setLoading(true);
        setError(null);
        try {
            // TODO: Implementar endpoint de consorcios en la API
            // Por ahora retornamos lista vacía
            setConsorcios([]);
        }
        catch (err) {
            setError('Error al cargar consorcios');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Crear nuevo consorcio (pendiente de implementación)
    const crearConsorcio = useCallback(async (params) => {
        setLoading(true);
        setError(null);
        try {
            // TODO: Implementar creación de consorcios en la API
            throw new Error('Funcionalidad de consorcios no implementada aún');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear consorcio';
            setError(errorMessage);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Obtener consorcio por ID (pendiente de implementación)
    const obtenerConsorcioPorId = useCallback((id) => {
        return null; // TODO: Implementar búsqueda de consorcios en la API
    }, []);
    useEffect(() => {
        cargarConsorcios();
    }, [cargarConsorcios]);
    return {
        consorcios,
        loading,
        error,
        cargarConsorcios,
        crearConsorcio,
        obtenerConsorcioPorId
    };
};
// Hook para gestionar entidades contratistas (empresas y consorcios unificados)
export const useEntidadesContratistas = () => {
    const { empresas, loading: loadingEmpresas, error: errorEmpresas } = useEmpresas();
    const { consorcios, loading: loadingConsorcios, error: errorConsorcios } = useConsorcios();
    // Combinar empresas y consorcios en una vista unificada
    const entidades = [
        ...empresas.map(empresa => ({
            id: empresa.id,
            tipo_entidad: 'EMPRESA',
            empresa_id: empresa.id,
            consorcio_id: undefined,
            nombre_completo: empresa.razon_social,
            ruc_principal: empresa.ruc,
            capacidad_contratacion_anual: undefined,
            experiencia_anos: undefined,
            estado: empresa.estado,
            activo: empresa.activo,
            created_at: empresa.created_at,
            updated_at: empresa.updated_at,
            datos_empresa: {
                ruc: empresa.ruc,
                razon_social: empresa.razon_social,
                nombre_comercial: empresa.nombre_comercial,
                email: empresa.email,
                telefono: empresa.telefono,
                direccion: empresa.direccion,
                distrito: empresa.distrito,
                provincia: empresa.provincia,
                departamento: empresa.departamento,
                representante_legal: empresa.representante_legal,
                dni_representante: empresa.dni_representante,
                tipo_empresa: empresa.tipo_empresa,
                categoria_contratista: empresa.categoria_contratista,
                especialidades: empresa.especialidades
            },
            datos_consorcio: undefined,
            empresas_participantes: undefined
        })),
        ...consorcios.map(consorcio => ({
            id: consorcio.id + 1000, // Offset para evitar conflictos de ID
            tipo_entidad: 'CONSORCIO',
            empresa_id: undefined,
            consorcio_id: consorcio.id,
            nombre_completo: consorcio.nombre,
            ruc_principal: consorcio.empresa_lider.ruc,
            capacidad_contratacion_anual: undefined,
            experiencia_anos: undefined,
            estado: consorcio.estado,
            activo: consorcio.activo,
            created_at: consorcio.created_at,
            updated_at: consorcio.updated_at,
            datos_empresa: undefined,
            datos_consorcio: {
                nombre: consorcio.nombre,
                descripcion: consorcio.descripcion,
                fecha_constitucion: consorcio.fecha_constitucion,
                empresa_lider_id: consorcio.empresa_lider_id,
                empresa_lider_nombre: consorcio.empresa_lider.razon_social,
                especialidades: consorcio.especialidades
            },
            empresas_participantes: consorcio.empresas_participantes.map(ep => ({
                empresa_id: ep.empresa.id,
                empresa_nombre: ep.empresa.razon_social,
                empresa_ruc: ep.empresa.ruc,
                porcentaje_participacion: ep.participacion.porcentaje_participacion,
                es_lider: ep.participacion.es_lider,
                responsabilidades: ep.participacion.responsabilidades
            }))
        }))
    ];
    const loading = loadingEmpresas || loadingConsorcios;
    const error = errorEmpresas || errorConsorcios;
    return {
        entidades,
        loading,
        error
    };
};
// Hook para validaciones
export const useValidacionesEmpresa = () => {
    const validarRuc = useCallback((ruc) => {
        if (!ruc) {
            return { campo: 'ruc', mensaje: 'El RUC es obligatorio' };
        }
        if (ruc.length !== 11) {
            return { campo: 'ruc', mensaje: 'El RUC debe tener 11 dígitos' };
        }
        if (!/^\d{11}$/.test(ruc)) {
            return { campo: 'ruc', mensaje: 'El RUC debe contener solo números' };
        }
        // Validación básica de tipo de RUC (20 = empresa)
        if (!ruc.startsWith('20')) {
            return { campo: 'ruc', mensaje: 'El RUC debe comenzar con 20 para empresas' };
        }
        return null;
    }, []);
    const validarEmail = useCallback((email) => {
        if (!email)
            return null; // Email es opcional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { campo: 'email', mensaje: 'El formato del email no es válido' };
        }
        return null;
    }, []);
    const validarTelefono = useCallback((telefono) => {
        if (!telefono)
            return null; // Teléfono es opcional
        if (telefono.length < 7 || telefono.length > 15) {
            return { campo: 'telefono', mensaje: 'El teléfono debe tener entre 7 y 15 dígitos' };
        }
        if (!/^\d+$/.test(telefono.replace(/[\s\-\(\)]/g, ''))) {
            return { campo: 'telefono', mensaje: 'El teléfono debe contener solo números' };
        }
        return null;
    }, []);
    const validarPorcentajesConsorcio = useCallback((participaciones) => {
        const suma = participaciones.reduce((acc, p) => acc + p.porcentaje, 0);
        if (Math.abs(suma - 100) > 0.01) {
            return {
                campo: 'porcentajes',
                mensaje: `La suma de porcentajes debe ser 100%. Actual: ${suma.toFixed(2)}%`
            };
        }
        return null;
    }, []);
    const validarEmpresaForm = useCallback((form) => {
        const errores = [];
        // Validar RUC
        const errorRuc = validarRuc(form.ruc);
        if (errorRuc)
            errores.push(errorRuc);
        // Validar razón social
        if (!form.razon_social?.trim()) {
            errores.push({ campo: 'razon_social', mensaje: 'La razón social es obligatoria' });
        }
        // Validar email
        const errorEmail = validarEmail(form.email);
        if (errorEmail)
            errores.push(errorEmail);
        // Validar teléfono
        const errorTelefono = validarTelefono(form.telefono);
        if (errorTelefono)
            errores.push(errorTelefono);
        return errores;
    }, [validarRuc, validarEmail, validarTelefono]);
    return {
        validarRuc,
        validarEmail,
        validarTelefono,
        validarPorcentajesConsorcio,
        validarEmpresaForm
    };
};
