import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS, API_BASE_URL, EMPRESAS_ENDPOINT } from '../config/api';
import type { 
  Empresa, 
  EntidadContratistaDetalle,
  EmpresaForm,
  FiltrosEntidadContratista,
  ErrorValidacion,
  CrearConsorcioParams,
  ConsorcioCompleto,
  EstadoGeneral,
  EspecialidadEmpresa,
  CategoriaContratista
} from '../types/empresa.types';

// Interfaces para respuestas de la API de Neon
interface NeonApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  message?: string;
}

// Interface específica para la respuesta de empresas
interface EmpresasResponse {
  empresas: EmpresaNeonResponse[];
  total: number;
}

interface EmpresaNeonResponse {
  id: string;
  codigo: string;
  ruc: string;
  razon_social: string;
  email?: string;
  celular?: string;
  direccion?: string;
  representante_legal?: string;
  dni_representante?: string;
  estado: string;
  categoria_contratista?: string; // Añadir el campo que viene del backend
  especialidades?: string[];
  created_at: string;
  updated_at: string;
}

interface EstadisticasEmpresas {
  total_empresas: number;
  empresas_activas: number;
  empresas_inactivas: number;
  por_estado: Record<string, number>;
}

// Función auxiliar para mapear respuesta de API a tipo Empresa
const mapearEmpresaFromAPI = (apiEmpresa: EmpresaNeonResponse): Empresa => ({
  id: apiEmpresa.id, // Mantener el UUID original
  codigo: apiEmpresa.codigo || `EMP${apiEmpresa.id.slice(-3).padStart(3, '0')}`,
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
  estado: (apiEmpresa.estado as EstadoGeneral) || 'ACTIVO',
  tipo_empresa: 'SAC', // Valor por defecto, podría mejorarse
  categoria_contratista: apiEmpresa.categoria_contratista as CategoriaContratista, // Función: EJECUTORA/SUPERVISORA
  categoria_contratista_capacidad: undefined, // Para las categorías A, B, C, D, E (futuro)
  especialidades: (apiEmpresa.especialidades as EspecialidadEmpresa[]) || [],
  activo: true,
  created_at: apiEmpresa.created_at,
  updated_at: apiEmpresa.updated_at
});

export const useEmpresas = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar empresas guardadas desde Neon
  const cargarEmpresas = useCallback(async (filtros?: FiltrosEntidadContratista) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.empresasGuardadas);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: NeonApiResponse<EmpresasResponse> = await response.json();

      // Debug: Verificar la estructura de la respuesta
      console.log('📊 DEBUG: Estructura completa de la respuesta:', result);
      console.log('📊 DEBUG: Tipo de result.data:', typeof result.data);
      console.log('📊 DEBUG: result.data es array?:', Array.isArray(result.data));
      console.log('📊 DEBUG: result.data:', result.data);

      if (result.success && result.data) {
        // La API devuelve data como objeto con propiedades 'empresas' y 'total'
        const dataArray = result.data.empresas || [];
        console.log('📊 DEBUG: Array de empresas extraído:', dataArray);
        console.log('📊 DEBUG: IDs de empresas disponibles:', dataArray.map(e => e.id));

        // Convertir respuesta de API a formato Empresa
        let empresasFromAPI: Empresa[] = dataArray.map(mapearEmpresaFromAPI);
      
        // Aplicar filtros localmente
        if (filtros?.search) {
          const searchTerm = filtros.search.toLowerCase();
          empresasFromAPI = empresasFromAPI.filter(empresa =>
            empresa.razon_social.toLowerCase().includes(searchTerm) ||
            empresa.nombre_comercial?.toLowerCase().includes(searchTerm) ||
            empresa.ruc.includes(searchTerm)
          );
        }
        
        if (filtros?.estado) {
          empresasFromAPI = empresasFromAPI.filter(empresa => 
            empresa.estado === filtros.estado
          );
        }
        
        if (filtros?.categoria) {
          // Filtrar por categoría tradicional (A, B, C, D, E)
          empresasFromAPI = empresasFromAPI.filter(empresa => 
            empresa.categoria_contratista_capacidad === filtros.categoria
          );
        }
        
        // Nuevo filtro por función (EJECUTORA/SUPERVISORA)
        if (filtros?.categoria_contratista) {
          empresasFromAPI = empresasFromAPI.filter(empresa => 
            empresa.categoria_contratista === filtros.categoria_contratista
          );
        }
        
        if (filtros?.especialidades && filtros.especialidades.length > 0) {
          empresasFromAPI = empresasFromAPI.filter(empresa =>
            empresa.especialidades?.some(esp => 
              filtros.especialidades!.includes(esp)
            )
          );
        }
        
        setEmpresas(empresasFromAPI);
      } else {
        setEmpresas([]);
      }
    } catch (err) {
      console.error('Error loading empresas from Neon:', err);
      setError('Error al cargar empresas desde el servidor');
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva empresa usando el endpoint de Neon
  const crearEmpresa = useCallback(async (empresaData: EmpresaForm): Promise<Empresa | null> => {
    setLoading(true);
    setError(null);
    
    try {
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

      const result: NeonApiResponse<EmpresaNeonResponse> = await response.json();
      
      if (result.success && result.data) {
        const nuevaEmpresa = mapearEmpresaFromAPI(result.data);
        
        // Refrescar la lista después de la creación exitosa
        await cargarEmpresas();
        
        return nuevaEmpresa;
      } else {
        throw new Error(result.message || 'Error en la respuesta del servidor');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear empresa';
      setError(errorMessage);
      console.error('Error creating empresa:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cargarEmpresas]);

  // Actualizar empresa usando PUT al endpoint de Neon
  const actualizarEmpresa = useCallback(async (id: string, empresaData: Partial<EmpresaForm>): Promise<Empresa | null> => {
    setLoading(true);
    setError(null);
    
    try {
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

      const result: NeonApiResponse<EmpresaNeonResponse> = await response.json();
      
      if (result.success && result.data) {
        const empresaActualizada = mapearEmpresaFromAPI(result.data);
        
        // Refrescar la lista después de la actualización
        await cargarEmpresas();
        
        return empresaActualizada;
      } else {
        throw new Error(result.message || 'Error en la respuesta del servidor');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar empresa';
      setError(errorMessage);
      console.error('Error updating empresa:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cargarEmpresas]);

  // Eliminar empresa usando el endpoint correcto de Neon
  const eliminarEmpresa = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Construir URL hardcoded para evitar cualquier interceptor o modificación
      const baseUrl = 'https://registro-valorizaciones-backend-503600768755.southamerica-west1.run.app';
      const deleteUrl = `${baseUrl}/api/empresas/${id}`;

      // Debug: Mostrar la URL antes del fetch
      console.log('🔍 DELETE URL antes de fetch:', deleteUrl);
      console.log('🔍 Intentando eliminar empresa con ID:', id);

      const response = await fetch(deleteUrl, {
        method: 'DELETE'
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Empresa no encontrada');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Para status 204 (No Content), no hay cuerpo de respuesta
      if (response.status === 204) {
        // Refrescar la lista después de la eliminación
        await cargarEmpresas();
        return true;
      }
      
      // Si hay respuesta JSON, procesarla
      try {
        const result = await response.json();
        if (result.message) {
          console.log('✅ Eliminación exitosa:', result.message);
        }
        // Refrescar la lista después de la eliminación
        await cargarEmpresas();
        return true;
      } catch {
        // Si no hay JSON válido, asumir que fue exitoso
        await cargarEmpresas();
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar empresa';
      setError(errorMessage);
      console.error('Error deleting empresa:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [empresas, cargarEmpresas]);

  // Obtener empresa por RUC usando el endpoint de Neon
  const obtenerEmpresaPorId = useCallback(async (id: string): Promise<Empresa | null> => {
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
  const obtenerEmpresaPorRuc = useCallback(async (ruc: string): Promise<Empresa | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_ENDPOINTS.empresasGuardadas}/${ruc}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Empresa no encontrada
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: NeonApiResponse<EmpresaNeonResponse> = await response.json();
      
      if (result.success && result.data) {
        return mapearEmpresaFromAPI(result.data);
      }
      
      return null;
    } catch (err) {
      console.error('Error getting empresa by RUC:', err);
      setError('Error al obtener empresa por RUC');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Buscar empresas usando el endpoint de búsqueda de Neon
  const buscarEmpresas = useCallback(async (query: string): Promise<Empresa[]> => {
    if (!query.trim()) {
      return [];
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_ENDPOINTS.empresasSearch}?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: NeonApiResponse<EmpresaNeonResponse[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data.map(mapearEmpresaFromAPI);
      }
      
      return [];
    } catch (err) {
      console.error('Error searching empresas:', err);
      setError('Error al buscar empresas');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Obtener estadísticas usando el endpoint de Neon
  const obtenerEstadisticas = useCallback(async (): Promise<EstadisticasEmpresas | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.empresasStats);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: NeonApiResponse<EstadisticasEmpresas> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return null;
    } catch (err) {
      console.error('Error getting empresas stats:', err);
      setError('Error al obtener estadísticas de empresas');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Cargar empresas al montar el componente
    cargarEmpresas();
  }, []);

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
const mockConsorcios: ConsorcioCompleto[] = [];

export const useConsorcios = () => {
  const [consorcios, setConsorcios] = useState<ConsorcioCompleto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar consorcios (actualmente usando mock - pendiente de implementación en Neon)
  const cargarConsorcios = useCallback(async (filtros?: FiltrosEntidadContratista) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar endpoint de consorcios en Neon
      // Por ahora retornamos lista vacía
      setConsorcios([]);
    } catch (err) {
      setError('Error al cargar consorcios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nuevo consorcio (pendiente de implementación)
  const crearConsorcio = useCallback(async (params: CrearConsorcioParams): Promise<ConsorcioCompleto | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar creación de consorcios en Neon
      throw new Error('Funcionalidad de consorcios no implementada aún');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear consorcio';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener consorcio por ID (pendiente de implementación)
  const obtenerConsorcioPorId = useCallback((id: string): ConsorcioCompleto | null => {
    return null; // TODO: Implementar búsqueda de consorcios en Neon
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
  const entidades: EntidadContratistaDetalle[] = [
    ...empresas.map(empresa => ({
      id: empresa.id,
      tipo_entidad: 'EMPRESA' as const,
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
        categoria_contratista_capacidad: empresa.categoria_contratista_capacidad,
        especialidades: empresa.especialidades,
        representantes: empresa.representantes
      },
      datos_consorcio: undefined,
      empresas_participantes: undefined
    })),
    ...consorcios.map(consorcio => ({
      id: consorcio.id + 1000, // Offset para evitar conflictos de ID
      tipo_entidad: 'CONSORCIO' as const,
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
  const validarRuc = useCallback((ruc: string): ErrorValidacion | null => {
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

  const validarEmail = useCallback((email?: string): ErrorValidacion | null => {
    if (!email) return null; // Email es opcional
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { campo: 'email', mensaje: 'El formato del email no es válido' };
    }
    
    return null;
  }, []);

  const validarTelefono = useCallback((telefono?: string): ErrorValidacion | null => {
    if (!telefono) return null; // Teléfono es opcional
    
    if (telefono.length < 7 || telefono.length > 15) {
      return { campo: 'telefono', mensaje: 'El teléfono debe tener entre 7 y 15 dígitos' };
    }
    
    if (!/^\d+$/.test(telefono.replace(/[\s\-\(\)]/g, ''))) {
      return { campo: 'telefono', mensaje: 'El teléfono debe contener solo números' };
    }
    
    return null;
  }, []);

  const validarPorcentajesConsorcio = useCallback((participaciones: Array<{ porcentaje: number }>): ErrorValidacion | null => {
    const suma = participaciones.reduce((acc, p) => acc + p.porcentaje, 0);
    
    if (Math.abs(suma - 100) > 0.01) {
      return { 
        campo: 'porcentajes', 
        mensaje: `La suma de porcentajes debe ser 100%. Actual: ${suma.toFixed(2)}%` 
      };
    }
    
    return null;
  }, []);

  const validarEmpresaForm = useCallback((form: EmpresaForm): ErrorValidacion[] => {
    const errores: ErrorValidacion[] = [];
    
    // Validar RUC
    const errorRuc = validarRuc(form.ruc);
    if (errorRuc) errores.push(errorRuc);
    
    // Validar razón social
    if (!form.razon_social?.trim()) {
      errores.push({ campo: 'razon_social', mensaje: 'La razón social es obligatoria' });
    }
    
    // Validar email
    const errorEmail = validarEmail(form.email);
    if (errorEmail) errores.push(errorEmail);
    
    // Validar teléfono
    const errorTelefono = validarTelefono(form.telefono);
    if (errorTelefono) errores.push(errorTelefono);
    
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