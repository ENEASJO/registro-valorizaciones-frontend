import { useState, useEffect, useCallback } from 'react';
import type { 
  Obra,
  ObraForm,
  ObraProfesional,
  ProfesionalForm,
  ObraValorizacion,
  Profesion,
  FiltrosObra,
  CrearObraParams,
  EstadisticasObras,
  ResultadoValidacion,
  ErrorValidacion,
  ResultadoDisponibilidadProfesional,
  ConflictoProfesional,
} from '../types/obra.types';
import { CONFIG_NUMERO_CONTRATO } from '../types/obra.types';
import { API_ENDPOINTS, DEFAULT_HEADERS, API_TIMEOUT } from '../config/api';

// Interfaces para respuesta del backend
interface ObraResponse {
  id: number;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  cliente?: string;
  ubicacion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  modalidad_ejecucion?: string;
  sistema_contratacion?: string;
  tipo_obra?: string;
  monto_contractual?: number;
  monto_adicionales?: number;
  monto_total?: number;
  fecha_inicio?: string;
  fecha_fin_contractual?: string;
  fecha_fin_real?: string;
  plazo_contractual?: number;
  estado_obra: string;
  porcentaje_avance?: number;
  observaciones?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  version: number;
}

interface EstadisticasObrasResponse {
  total_obras: number;
  obras_activas: number;
  obras_terminadas: number;
  obras_paralizadas: number;
  monto_total: number;
  monto_ejecutado: number;
  obras_por_estado: Record<string, number>;
  obras_por_tipo: Record<string, number>;
}

// Función para mapear respuesta del backend a tipo frontend
const mapearObraResponse = (response: ObraResponse): any => ({ // Usando any temporalmente para evitar errores de tipos
  id: response.id,
  numero_contrato: response.codigo || `OBR-${response.id}`, // Mapear codigo a numero_contrato
  nombre: response.nombre,
  codigo_interno: response.codigo,
  entidad_ejecutora_id: String(response.empresa_id), // Mapear empresa_id a entidad_ejecutora_id
  entidad_supervisora_id: '', // Default, se puede ajustar según necesidades
  monto_ejecucion: response.monto_contractual || 0,
  monto_supervision: response.monto_adicionales || 0,
  monto_total: response.monto_total || 0,
  plazo_ejecucion_dias: response.plazo_contractual || 0,
  numero_valorizaciones: response.plazo_contractual ? Math.ceil(response.plazo_contractual / 30) : 0,
  fecha_inicio: response.fecha_inicio || new Date().toISOString().split('T')[0],
  fecha_fin_prevista: response.fecha_fin_contractual || new Date().toISOString().split('T')[0],
  fecha_termino: response.fecha_fin_real,
  ubicacion: response.ubicacion || '',
  distrito: response.distrito || '',
  provincia: response.provincia || '',
  departamento: response.departamento || '',
  tipo_obra: response.tipo_obra as any || 'OTROS',
  modalidad_ejecucion: response.modalidad_ejecucion as any || 'CONTRATA',
  sistema_contratacion: response.sistema_contratacion as any || 'SUMA_ALZADA',
  estado: response.estado_obra as any || 'REGISTRADA',
  descripcion: response.descripcion || '',
  activo: response.activo,
  created_at: response.created_at,
  updated_at: response.updated_at,
  version: response.version,
  // Propiedades adicionales para compatibilidad con dashboard
  empresa_contratista: response.cliente || 'No especificado',
  porcentaje_avance: response.porcentaje_avance || 0,
  monto_contrato: response.monto_contractual || response.monto_total || 0,
  estado_obra: response.estado_obra,
  fecha_fin_contractual: response.fecha_fin_contractual,
  observaciones: response.observaciones
});

// Función para mapear formulario frontend a payload del backend
const mapearObraFormAPayload = (form: ObraForm) => ({
  codigo: form.numero_contrato,
  nombre: form.nombre,
  descripcion: form.descripcion || '',
  empresa_id: form.entidad_ejecutora_id,
  cliente: '', // Se puede agregar al formulario si es necesario
  ubicacion: form.ubicacion || '',
  distrito: form.distrito || '',
  provincia: form.provincia || '',
  departamento: form.departamento || '',
  modalidad_ejecucion: form.modalidad_ejecucion,
  sistema_contratacion: form.sistema_contratacion,
  tipo_obra: form.tipo_obra,
  monto_contractual: form.monto_ejecucion,
  monto_adicionales: form.monto_supervision,
  monto_total: form.monto_ejecucion + form.monto_supervision,
  fecha_inicio: form.fecha_inicio,
  fecha_fin_contractual: form.fecha_termino,
  plazo_contractual: form.plazo_ejecucion_dias,
  estado_obra: 'REGISTRADA', // Valor por defecto - estado se mapea desde el backend
  observaciones: ''
});

// Función helper para manejar errores de API
const manejarErrorAPI = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Error desconocido en la operación';
};

// Función helper para realizar peticiones HTTP
const realizarPeticionHTTP = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Si no se puede parsear el error, usar el mensaje por defecto
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('La operación tardó demasiado tiempo');
    }
    
    throw error;
  }
};

// Hook principal para gestión de obras
interface UseObrasOptions {
  autoLoad?: boolean;
}

export const useObras = (options: UseObrasOptions = {}) => {
  const { autoLoad = true } = options;
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar obras con filtros
  const cargarObras = useCallback(async (filtros?: FiltrosObra) => {
    setLoading(true);
    setError(null);
    
    try {
      // Construir parámetros de consulta para filtros
      const params = new URLSearchParams();
      
      if (filtros?.search) {
        params.append('search', filtros.search);
      }
      
      if (filtros?.estado) {
        params.append('estado_obra', filtros.estado);
      }
      
      if (filtros?.entidad_ejecutora_id) {
        params.append('empresa_id', filtros.entidad_ejecutora_id);
      }
      
      if (filtros?.tipo_obra) {
        params.append('tipo_obra', filtros.tipo_obra);
      }

      // Realizar petición al endpoint
      const url = params.toString() 
        ? `${API_ENDPOINTS.obras}?${params.toString()}`
        : API_ENDPOINTS.obras;
      
      const data = await realizarPeticionHTTP(url);
      
      // Mapear respuestas del backend al tipo frontend
      const obrasMapeadas = Array.isArray(data) 
        ? data.map(mapearObraResponse)
        : [];
      
      setObras(obrasMapeadas);
    } catch (err) {
      const errorMessage = manejarErrorAPI(err);
      setError(`Error al cargar obras: ${errorMessage}`);
      console.error('Error cargando obras:', err);
      setObras([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva obra con plantel profesional
  const crearObra = useCallback(async (params: CrearObraParams): Promise<Obra | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Mapear los datos del formulario al payload del backend
      const payload = mapearObraFormAPayload(params.obra);
      
      // Realizar petición POST al endpoint
      const data = await realizarPeticionHTTP(API_ENDPOINTS.obras, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      // Mapear la respuesta del backend al tipo frontend
      const obraNueva = mapearObraResponse(data);
      
      // TODO: Implementar creación del plantel profesional
      // Nota: Esto requerirá endpoints adicionales para profesionales
      if (params.plantel_profesional.length > 0) {
        console.warn('Creación de plantel profesional no implementada aún. Endpoints de profesionales pendientes.');
      }
      
      // Recargar la lista de obras para mantener sincronización
      await cargarObras();
      
      return obraNueva;
    } catch (err) {
      const errorMessage = manejarErrorAPI(err);
      setError(`Error al crear obra: ${errorMessage}`);
      console.error('Error creando obra:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [cargarObras]);

  // Actualizar obra
  const actualizarObra = useCallback(async (id: string, obraData: Partial<ObraForm>): Promise<Obra | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Crear payload parcial con solo los campos que se van a actualizar
      const payload: Partial<ReturnType<typeof mapearObraFormAPayload>> = {};
      
      if (obraData.numero_contrato !== undefined) payload.codigo = obraData.numero_contrato;
      if (obraData.nombre !== undefined) payload.nombre = obraData.nombre;
      if (obraData.descripcion !== undefined) payload.descripcion = obraData.descripcion;
      if (obraData.entidad_ejecutora_id !== undefined) payload.empresa_id = obraData.entidad_ejecutora_id;
      if (obraData.ubicacion !== undefined) payload.ubicacion = obraData.ubicacion;
      if (obraData.distrito !== undefined) payload.distrito = obraData.distrito;
      if (obraData.provincia !== undefined) payload.provincia = obraData.provincia;
      if (obraData.departamento !== undefined) payload.departamento = obraData.departamento;
      if (obraData.modalidad_ejecucion !== undefined) payload.modalidad_ejecucion = obraData.modalidad_ejecucion;
      if (obraData.sistema_contratacion !== undefined) payload.sistema_contratacion = obraData.sistema_contratacion;
      if (obraData.tipo_obra !== undefined) payload.tipo_obra = obraData.tipo_obra;
      if (obraData.monto_ejecucion !== undefined) payload.monto_contractual = obraData.monto_ejecucion;
      if (obraData.monto_supervision !== undefined) payload.monto_adicionales = obraData.monto_supervision;
      if (obraData.fecha_inicio !== undefined) payload.fecha_inicio = obraData.fecha_inicio;
      if (obraData.fecha_termino !== undefined) payload.fecha_fin_contractual = obraData.fecha_termino;
      if (obraData.plazo_ejecucion_dias !== undefined) payload.plazo_contractual = obraData.plazo_ejecucion_dias;
      // Estado se maneja internamente en el backend
      
      // Calcular monto total si se proporcionan los montos
      if (obraData.monto_ejecucion !== undefined || obraData.monto_supervision !== undefined) {
        const montoEjecucion = obraData.monto_ejecucion ?? 0;
        const montoSupervision = obraData.monto_supervision ?? 0;
        payload.monto_total = montoEjecucion + montoSupervision;
      }
      
      // Realizar petición PUT al endpoint
      const data = await realizarPeticionHTTP(`${API_ENDPOINTS.obras}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      
      // Mapear la respuesta del backend al tipo frontend
      const obraActualizada = mapearObraResponse(data);
      
      // Recargar la lista de obras para mantener sincronización
      await cargarObras();
      
      return obraActualizada;
    } catch (err) {
      const errorMessage = manejarErrorAPI(err);
      setError(`Error al actualizar obra: ${errorMessage}`);
      console.error('Error actualizando obra:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [cargarObras]);

  // Eliminar obra
  const eliminarObra = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Realizar petición DELETE al endpoint
      await realizarPeticionHTTP(`${API_ENDPOINTS.obras}/${id}`, {
        method: 'DELETE',
      });
      
      // Recargar la lista de obras para mantener sincronización
      await cargarObras();
      
      return true;
    } catch (err) {
      const errorMessage = manejarErrorAPI(err);
      setError(`Error al eliminar obra: ${errorMessage}`);
      console.error('Error eliminando obra:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarObras]);

  // Obtener obra por ID con detalles
  const obtenerObraPorId = useCallback(async (id: string): Promise<Obra | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Realizar petición GET al endpoint específico
      const data = await realizarPeticionHTTP(`${API_ENDPOINTS.obras}/${id}`);
      
      // Mapear la respuesta del backend al tipo frontend
      return mapearObraResponse(data);
    } catch (err) {
      const errorMessage = manejarErrorAPI(err);
      setError(`Error al obtener obra: ${errorMessage}`);
      console.error('Error obteniendo obra por ID:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener estadísticas
  const obtenerEstadisticas = useCallback(async (): Promise<EstadisticasObras> => {
    setLoading(true);
    setError(null);
    
    try {
      // Realizar petición GET al endpoint de estadísticas
      const data = await realizarPeticionHTTP(`${API_ENDPOINTS.obras}/stats`);
      
      // Mapear respuesta del backend al formato frontend
      const estadisticas: EstadisticasObras = {
        obras_totales: data.total_obras || 0,
        obras_activas: data.obras_activas || 0,
        obras_terminadas: data.obras_terminadas || 0,
        obras_paralizadas: data.obras_paralizadas || 0,
        monto_total_obras: data.monto_total || 0,
        monto_ejecutado_total: data.monto_ejecutado || 0,
        obras_por_estado: {
          REGISTRADA: data.obras_por_estado?.REGISTRADA || 0,
          EN_EJECUCION: data.obras_por_estado?.EN_EJECUCION || 0,
          PARALIZADA: data.obras_por_estado?.PARALIZADA || 0,
          TERMINADA: data.obras_por_estado?.TERMINADA || 0,
          LIQUIDADA: data.obras_por_estado?.LIQUIDADA || 0,
          CANCELADA: data.obras_por_estado?.CANCELADA || 0
        },
        obras_por_tipo: {
          CARRETERA: data.obras_por_tipo?.CARRETERA || 0,
          EDIFICACION: data.obras_por_tipo?.EDIFICACION || 0,
          SANEAMIENTO: data.obras_por_tipo?.SANEAMIENTO || 0,
          ELECTRICIDAD: data.obras_por_tipo?.ELECTRICIDAD || 0,
          PUENTE: data.obras_por_tipo?.PUENTE || 0,
          VEREDAS_PISTAS: data.obras_por_tipo?.VEREDAS_PISTAS || 0,
          PARQUES_JARDINES: data.obras_por_tipo?.PARQUES_JARDINES || 0,
          DRENAJE_PLUVIAL: data.obras_por_tipo?.DRENAJE_PLUVIAL || 0,
          OTROS: data.obras_por_tipo?.OTROS || 0
        },
        // Valores por defecto para campos que podrían no estar en el backend
        valorizaciones_pendientes: data.valorizaciones_pendientes || 0,
        valorizaciones_vencidas: data.valorizaciones_vencidas || 0,
        profesionales_con_conflictos: data.profesionales_con_conflictos || 0,
        top_ejecutoras: data.top_ejecutoras || []
      };
      
      return estadisticas;
    } catch (err) {
      const errorMessage = manejarErrorAPI(err);
      setError(`Error al obtener estadísticas: ${errorMessage}`);
      console.error('Error obteniendo estadísticas:', err);
      
      // Devolver estadísticas vacías en caso de error
      return {
        obras_totales: 0,
        obras_activas: 0,
        obras_terminadas: 0,
        obras_paralizadas: 0,
        monto_total_obras: 0,
        monto_ejecutado_total: 0,
        obras_por_estado: {
          REGISTRADA: 0,
          EN_EJECUCION: 0,
          PARALIZADA: 0,
          TERMINADA: 0,
          LIQUIDADA: 0,
          CANCELADA: 0
        },
        obras_por_tipo: {
          CARRETERA: 0,
          EDIFICACION: 0,
          SANEAMIENTO: 0,
          ELECTRICIDAD: 0,
          PUENTE: 0,
          VEREDAS_PISTAS: 0,
          PARQUES_JARDINES: 0,
          DRENAJE_PLUVIAL: 0,
          OTROS: 0
        },
        valorizaciones_pendientes: 0,
        valorizaciones_vencidas: 0,
        profesionales_con_conflictos: 0,
        top_ejecutoras: []
      };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoLoad) {
      return;
    }
    cargarObras();
  }, [autoLoad, cargarObras]);

  return {
    obras,
    loading,
    error,
    cargarObras,
    obtenerObras: cargarObras, // Alias para compatibilidad con dashboard
    crearObra,
    actualizarObra,
    eliminarObra,
    obtenerObraPorId,
    obtenerEstadisticas,
    estadisticasObras: obtenerEstadisticas, // Alias para compatibilidad con dashboard
    // Método sincrónico para compatibilidad con componentes
    obtenerObraPorIdSync: (id: string) => {
      return obras.find(obra => obra.id === id) || null;
    }
  };
};

// Hook para gestión de profesionales
// NOTA: Funcionalidad reducida hasta implementar endpoints de profesionales
export const useProfesionales = () => {
  const [profesionales, setProfesionales] = useState<ObraProfesional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder: Cargar profesionales de una obra
  const cargarProfesionalesPorObra = useCallback(async (obraId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar cuando estén disponibles los endpoints de profesionales
      console.warn(`Carga de profesionales para obra ${obraId} no implementada aún. Endpoints pendientes.`);
      setProfesionales([]);
    } catch (err) {
      setError('Error al cargar profesionales');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Placeholder: Agregar profesional a obra
  const agregarProfesional = useCallback(async (obraId: number, profesional: ProfesionalForm): Promise<ObraProfesional | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar cuando estén disponibles los endpoints de profesionales
      console.warn(`Agregar profesional a obra ${obraId} no implementado aún. Endpoints pendientes.`);
      return null;
    } catch (err) {
      const errorMessage = manejarErrorAPI(err);
      setError(`Error al agregar profesional: ${errorMessage}`);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Placeholder: Verificar disponibilidad de profesional
  const verificarDisponibilidad = useCallback(async (
    nombreCompleto: string,
    fechaInicio: string,
    fechaFin: string,
    obraIdExcluir?: number
  ): Promise<ResultadoDisponibilidadProfesional> => {
    // TODO: Implementar cuando estén disponibles los endpoints de profesionales
    console.warn(`Verificación de disponibilidad para ${nombreCompleto} no implementada aún. Endpoints pendientes.`);
    
    return {
      disponible: true,
      conflictos: []
    };
  }, []);

  return {
    profesionales,
    loading,
    error,
    cargarProfesionalesPorObra,
    agregarProfesional,
    verificarDisponibilidad
  };
};

// Hook para gestión de profesiones
// NOTA: Funcionalidad reducida hasta implementar endpoints de profesiones
export const useProfesiones = () => {
  const [profesiones, setProfesiones] = useState<Profesion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarProfesiones = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar cuando estén disponibles los endpoints de profesiones
      console.warn('Carga de profesiones no implementada aún. Endpoints pendientes.');
      setProfesiones([]);
    } catch (err) {
      const errorMessage = manejarErrorAPI(err);
      setError(`Error al cargar profesiones: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarProfesiones();
  }, [cargarProfesiones]);

  return {
    profesiones,
    loading,
    error,
    cargarProfesiones
  };
};

// Hook para validaciones
export const useValidacionesObra = () => {
  const validarNumeroContrato = useCallback((numeroContrato: string): ErrorValidacion | null => {
    if (!numeroContrato) {
      return { campo: 'numero_contrato', mensaje: 'El número de contrato es obligatorio' };
    }
    
    if (!CONFIG_NUMERO_CONTRATO.patron.test(numeroContrato)) {
      return { 
        campo: 'numero_contrato', 
        mensaje: `El formato debe ser: ${CONFIG_NUMERO_CONTRATO.formato}`,
        codigo: 'FORMATO_INVALIDO'
      };
    }
    
    return null;
  }, []);

  const validarMontos = useCallback((montoEjecucion: number, montoSupervision: number): ErrorValidacion[] => {
    const errores: ErrorValidacion[] = [];
    
    if (montoEjecucion <= 0) {
      errores.push({ campo: 'monto_ejecucion', mensaje: 'El monto de ejecución debe ser mayor a cero' });
    }
    
    if (montoSupervision < 0) {
      errores.push({ campo: 'monto_supervision', mensaje: 'El monto de supervisión no puede ser negativo' });
    }
    
    // Validación de proporción de supervisión (típicamente 10-15% del monto de ejecución)
    if (montoSupervision > montoEjecucion * 0.2) {
      errores.push({ 
        campo: 'monto_supervision', 
        mensaje: 'El monto de supervisión no debería exceder el 20% del monto de ejecución' 
      });
    }
    
    return errores;
  }, []);

  const validarFechas = useCallback((fechaInicio: string, plazoDias: number, fechaTermino?: string): ErrorValidacion[] => {
    const errores: ErrorValidacion[] = [];
    
    const fechaInicioDate = new Date(fechaInicio);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaInicioDate < hoy) {
      errores.push({ 
        campo: 'fecha_inicio', 
        mensaje: 'La fecha de inicio no puede ser anterior a hoy' 
      });
    }
    
    if (plazoDias <= 0) {
      errores.push({ 
        campo: 'plazo_ejecucion_dias', 
        mensaje: 'El plazo de ejecución debe ser mayor a cero días' 
      });
    }
    
    if (plazoDias > 1095) { // 3 años
      errores.push({ 
        campo: 'plazo_ejecucion_dias', 
        mensaje: 'El plazo de ejecución no debería exceder los 3 años (1095 días)' 
      });
    }
    
    // Validar fecha de término si está presente
    if (fechaTermino) {
      const fechaTerminoDate = new Date(fechaTermino);
      
      if (fechaTerminoDate <= fechaInicioDate) {
        errores.push({ 
          campo: 'fecha_termino', 
          mensaje: 'La fecha de término debe ser posterior a la fecha de inicio' 
        });
      }
      
      // Validar que la fecha de término no sea muy lejana (más de 5 años)
      const fechaMaxima = new Date(fechaInicioDate);
      fechaMaxima.setFullYear(fechaMaxima.getFullYear() + 5);
      
      if (fechaTerminoDate > fechaMaxima) {
        errores.push({ 
          campo: 'fecha_termino', 
          mensaje: 'La fecha de término no debería exceder los 5 años desde la fecha de inicio' 
        });
      }
    }
    
    return errores;
  }, []);

  const validarEntidadesContratistas = useCallback((
    entidadEjecutoraId: string,
    entidadSupervisoraId: string
  ): ErrorValidacion[] => {
    const errores: ErrorValidacion[] = [];
    
    if (!entidadEjecutoraId) {
      errores.push({ campo: 'entidad_ejecutora_id', mensaje: 'Debe seleccionar una entidad ejecutora' });
    }

    if (!entidadSupervisoraId) {
      errores.push({ campo: 'entidad_supervisora_id', mensaje: 'Debe seleccionar una entidad supervisora' });
    }

    if (entidadEjecutoraId && entidadSupervisoraId && entidadEjecutoraId === entidadSupervisoraId) {
      errores.push({ 
        campo: 'entidad_supervisora_id', 
        mensaje: 'La entidad ejecutora y supervisora deben ser diferentes' 
      });
    }
    
    return errores;
  }, []);

  const validarPorcentajeProfesional = useCallback((
    porcentaje: number
  ): ErrorValidacion[] => {
    const errores: ErrorValidacion[] = [];
    
    if (porcentaje <= 0 || porcentaje > 100) {
      errores.push({ 
        campo: 'porcentaje_participacion', 
        mensaje: 'El porcentaje debe estar entre 1 y 100' 
      });
    }
    
    // La validación de conflictos se hace en el hook de profesionales
    return errores;
  }, []);

  const validarObraForm = useCallback((form: ObraForm): ResultadoValidacion => {
    const errores: ErrorValidacion[] = [];
    
    // Validar número de contrato
    const errorContrato = validarNumeroContrato(form.numero_contrato);
    if (errorContrato) errores.push(errorContrato);
    
    // Validar nombre
    if (!form.nombre?.trim()) {
      errores.push({ campo: 'nombre', mensaje: 'El nombre de la obra es obligatorio' });
    }
    
    // Validar montos
    const erroresMontos = validarMontos(form.monto_ejecucion, form.monto_supervision);
    errores.push(...erroresMontos);
    
    // Validar fechas
    const erroresFechas = validarFechas(form.fecha_inicio, form.plazo_ejecucion_dias, form.fecha_termino);
    errores.push(...erroresFechas);
    
    // Validar entidades
    const erroresEntidades = validarEntidadesContratistas(
      form.entidad_ejecutora_id, 
      form.entidad_supervisora_id
    );
    errores.push(...erroresEntidades);
    
    return {
      valido: errores.length === 0,
      errores
    };
  }, [validarNumeroContrato, validarMontos, validarFechas, validarEntidadesContratistas]);

  return {
    validarNumeroContrato,
    validarMontos,
    validarFechas,
    validarEntidadesContratistas,
    validarPorcentajeProfesional,
    validarObraForm
  };
};

// Hook para gestión de valorizaciones
// NOTA: Funcionalidad reducida hasta implementar endpoints de valorizaciones
export const useValorizaciones = () => {
  const [valorizaciones, setValorizaciones] = useState<ObraValorizacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarValorizacionesPorObra = useCallback(async (obraId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar cuando estén disponibles los endpoints de valorizaciones
      console.warn(`Carga de valorizaciones para obra ${obraId} no implementada aún. Endpoints pendientes.`);
      setValorizaciones([]);
    } catch (err) {
      const errorMessage = manejarErrorAPI(err);
      setError(`Error al cargar valorizaciones: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    valorizaciones,
    loading,
    error,
    cargarValorizacionesPorObra
  };
};
