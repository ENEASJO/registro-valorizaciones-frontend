import { useState, useCallback, useMemo } from 'react';
import { API_ENDPOINTS, DEFAULT_HEADERS, API_TIMEOUT } from '../config/api';
import '../types/valorizacion-extended.types'; // Importar extensiones de tipos

// =================================================================
// TIPOS E INTERFACES
// =================================================================

// Tipo base de Valorización desde backend Neon
export interface ValorizacionResponse {
  id: number;
  codigo?: string;
  obra_id: number;
  numero_valorizacion: number;
  periodo: string;  // YYYY-MM
  fecha_inicio: string;
  fecha_fin: string;
  fecha_presentacion?: string;
  fecha_aprobacion?: string;
  tipo_valorizacion: string;
  monto_ejecutado: number;
  monto_materiales?: number;
  monto_mano_obra?: number;
  monto_equipos?: number;
  monto_subcontratos?: number;
  monto_gastos_generales?: number;
  monto_utilidad?: number;
  igv?: number;
  monto_total: number;
  porcentaje_avance_periodo?: number;
  porcentaje_avance_acumulado?: number;
  estado_valorizacion: string;
  observaciones?: string;
  archivos_adjuntos?: any[];
  metrado_ejecutado?: any[];
  partidas_ejecutadas?: any[];
  activo: boolean;
  created_at: string;
  updated_at: string;
  version: number;
}

// Tipo mapeado para frontend 
export interface Valorizacion {
  id: number;
  codigo?: string;
  obra_id: number;
  numero_valorizacion: number;
  periodo: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_presentacion?: string;
  fecha_aprobacion?: string;
  tipo_valorizacion: string;
  monto_ejecutado: number;
  monto_materiales?: number;
  monto_mano_obra?: number;
  monto_equipos?: number;
  monto_subcontratos?: number;
  monto_gastos_generales?: number;
  monto_utilidad?: number;
  igv?: number;
  monto_total: number;
  porcentaje_avance_periodo?: number;
  porcentaje_avance_acumulado?: number;
  estado: string;
  observaciones?: string;
  archivos_adjuntos?: any[];
  metrado_ejecutado?: any[];
  partidas_ejecutadas?: any[];
  activo: boolean;
  created_at: string;
  updated_at: string;
  version: number;

  // Propiedades adicionales para compatibilidad con componentes
  periodo_inicio?: string;
  periodo_fin?: string;
  monto_bruto?: number;
  monto_neto?: number;
  dias_atraso?: number;
  residente_obra?: string;
  supervisor_obra?: string;
  responsable_entidad?: string;
  observaciones_residente?: string;
  observaciones_supervisor?: string;
  observaciones_entidad?: string;
  motivo_rechazo?: string;
  actividades_realizadas?: string;
  motivos_dias_no_trabajados?: string;
  total_deducciones?: number;
  igv_monto?: number;
  adelanto_directo_monto?: number;
  adelanto_directo_porcentaje?: number;
  adelanto_materiales_monto?: number;
  adelanto_materiales_porcentaje?: number;
  retencion_garantia_monto?: number;
  retencion_garantia_porcentaje?: number;
  penalidades_monto?: number;
  otras_deducciones_monto?: number;
  fecha_pago?: string;
  fecha_limite_pago?: string;
  monto_avance_economico_total?: number;
  porcentaje_avance_fisico_total?: number;
}

// Formulario para crear/editar valorización
export interface ValorizacionForm {
  id?: number;
  obra_id: number;
  numero_valorizacion?: number;
  periodo: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_presentacion?: string;
  fecha_aprobacion?: string;
  tipo_valorizacion: string;
  monto_ejecutado: number;
  monto_materiales?: number;
  monto_mano_obra?: number;
  monto_equipos?: number;
  monto_subcontratos?: number;
  monto_gastos_generales?: number;
  monto_utilidad?: number;
  igv?: number;
  monto_total?: number;
  porcentaje_avance_periodo?: number;
  porcentaje_avance_acumulado?: number;
  estado_valorizacion?: string;
  estado?: string;
  observaciones?: string;
  archivos_adjuntos?: any[];
  metrado_ejecutado?: any[];
  partidas_ejecutadas?: any[];
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
  version?: number;
}

// Filtros para búsqueda
export interface FiltrosValorizacion {
  obra_id?: number;
  estado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  periodo?: string;
  tipo_valorizacion?: string;
  solo_con_atraso?: boolean;
}

// Estadísticas
export interface EstadisticasValorizacion {
  total_valorizaciones: number;
  monto_total_valorizado: number;
  monto_total_pagado: number;
  por_estado: Record<string, number>;
  por_mes: Array<{ mes: string; cantidad: number; monto: number }>;
  promedio_dias_aprobacion: number;
  con_atraso: number;
}

// =================================================================
// FUNCIONES DE UTILIDAD Y MAPEO
// =================================================================

// Mapear respuesta del backend a tipo del frontend
const mapearValorizacion = (backendData: ValorizacionResponse): Valorizacion => ({
  ...backendData,
  estado: backendData.estado_valorizacion,
});

// Mapear formulario del frontend a datos del backend
const mapearFormulario = (formData: ValorizacionForm): Partial<ValorizacionResponse> => ({
  obra_id: formData.obra_id,
  numero_valorizacion: formData.numero_valorizacion,
  periodo: formData.periodo,
  fecha_inicio: formData.fecha_inicio,
  fecha_fin: formData.fecha_fin,
  fecha_presentacion: formData.fecha_presentacion,
  tipo_valorizacion: formData.tipo_valorizacion,
  monto_ejecutado: formData.monto_ejecutado,
  monto_materiales: formData.monto_materiales,
  monto_mano_obra: formData.monto_mano_obra,
  monto_equipos: formData.monto_equipos,
  monto_subcontratos: formData.monto_subcontratos,
  monto_gastos_generales: formData.monto_gastos_generales,
  monto_utilidad: formData.monto_utilidad,
  observaciones: formData.observaciones,
  archivos_adjuntos: formData.archivos_adjuntos,
  metrado_ejecutado: formData.metrado_ejecutado,
  partidas_ejecutadas: formData.partidas_ejecutadas,
  estado_valorizacion: 'BORRADOR',
  activo: true
});

// Calcular totales automáticamente
const calcularTotales = (data: ValorizacionForm): ValorizacionForm => {
  const montoBase = data.monto_ejecutado || 0;
  const materiales = data.monto_materiales || 0;
  const manoObra = data.monto_mano_obra || 0;
  const equipos = data.monto_equipos || 0;
  const subcontratos = data.monto_subcontratos || 0;
  const gastosGenerales = data.monto_gastos_generales || 0;
  const utilidad = data.monto_utilidad || 0;

  // El monto ejecutado es la suma de componentes si no se especifica
  const montoEjecutado = montoBase > 0 ? montoBase : (materiales + manoObra + equipos + subcontratos + gastosGenerales + utilidad);
  const igv = montoEjecutado * 0.18;
  const montoTotal = montoEjecutado + igv;

  return {
    ...data,
    monto_ejecutado: montoEjecutado,
    igv,
    monto_total: montoTotal
  };
};

// Validar formato de período (YYYY-MM)
const validarPeriodo = (periodo: string): boolean => {
  if (!periodo) return false;
  const regex = /^\d{4}-\d{2}$/;
  if (!regex.test(periodo)) return false;
  
  const [year, month] = periodo.split('-').map(Number);
  return year >= 2020 && year <= 2030 && month >= 1 && month <= 12;
};

// Validar fechas
const validarFechas = (fechaInicio: string, fechaFin: string): boolean => {
  if (!fechaInicio || !fechaFin) return false;
  return new Date(fechaInicio) <= new Date(fechaFin);
};

// =================================================================
// HOOK PRINCIPAL
// =================================================================

export const useValorizaciones = () => {
  // Estados
  const [valorizaciones, setValorizaciones] = useState<Valorizacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =================================================================
  // FUNCIONES DE API
  // =================================================================

  // Función helper para hacer requests
  const apiRequest = async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          ...DEFAULT_HEADERS,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Request timeout - El servidor tardó demasiado en responder');
      }
      throw err;
    }
  };

  // =================================================================
  // FUNCIONES CRUD
  // =================================================================

  const cargarValorizaciones = useCallback(async (filtros?: FiltrosValorizacion) => {
    setLoading(true);
    setError(null);

    try {
      // Construir query parameters
      const params = new URLSearchParams();
      if (filtros?.obra_id) params.append('obra_id', filtros.obra_id.toString());
      if (filtros?.estado) params.append('estado', filtros.estado);
      if (filtros?.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
      if (filtros?.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
      if (filtros?.periodo) params.append('periodo', filtros.periodo);
      if (filtros?.tipo_valorizacion) params.append('tipo_valorizacion', filtros.tipo_valorizacion);
      if (filtros?.solo_con_atraso) params.append('solo_con_atraso', 'true');

      const queryString = params.toString();
      const endpoint = queryString ? `${API_ENDPOINTS.valorizaciones}?${queryString}` : API_ENDPOINTS.valorizaciones;

      const response = await apiRequest(endpoint);
      const valorizacionesMapeadas = response.map(mapearValorizacion);
      
      setValorizaciones(valorizacionesMapeadas);
      return valorizacionesMapeadas;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar valorizaciones';
      setError(errorMessage);
      console.error('Error cargando valorizaciones:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const crearValorizacion = useCallback(async (data: ValorizacionForm): Promise<Valorizacion> => {
    setLoading(true);
    setError(null);

    try {
      // Validaciones
      if (!data.obra_id) {
        throw new Error('ID de obra es requerido');
      }
      
      if (!validarPeriodo(data.periodo)) {
        throw new Error('Período debe estar en formato YYYY-MM');
      }
      
      if (!validarFechas(data.fecha_inicio, data.fecha_fin)) {
        throw new Error('Las fechas no son válidas');
      }

      // Calcular totales antes de enviar
      const dataConTotales = calcularTotales(data);
      const datosBackend = mapearFormulario(dataConTotales);

      const response = await apiRequest(API_ENDPOINTS.valorizaciones, {
        method: 'POST',
        body: JSON.stringify(datosBackend),
      });

      const nuevaValorizacion = mapearValorizacion(response);
      
      // Actualizar estado local
      setValorizaciones(prev => [nuevaValorizacion, ...prev]);
      
      return nuevaValorizacion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear valorización';
      setError(errorMessage);
      console.error('Error creando valorización:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarValorizacion = useCallback(async (
    id: number, 
    data: Partial<ValorizacionForm>
  ): Promise<Valorizacion> => {
    setLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ID de valorización es requerido');
      }

      // Obtener valorización actual
      const valorizacionActual = valorizaciones.find(v => v.id === id);
      if (!valorizacionActual) {
        throw new Error('Valorización no encontrada');
      }

      // Combinar datos actuales con actualizaciones
      const datosCompletos = { ...valorizacionActual, ...data };
      
      // Validar período si se está actualizando
      if (data.periodo && !validarPeriodo(data.periodo)) {
        throw new Error('Período debe estar en formato YYYY-MM');
      }

      // Validar fechas si se están actualizando
      if (data.fecha_inicio || data.fecha_fin) {
        const fechaInicio = data.fecha_inicio || valorizacionActual.fecha_inicio;
        const fechaFin = data.fecha_fin || valorizacionActual.fecha_fin;
        if (!validarFechas(fechaInicio, fechaFin)) {
          throw new Error('Las fechas no son válidas');
        }
      }

      // Recalcular totales si hay cambios en montos
      const recalcular = ['monto_ejecutado', 'monto_materiales', 'monto_mano_obra', 'monto_equipos', 
                         'monto_subcontratos', 'monto_gastos_generales', 'monto_utilidad']
                         .some(campo => campo in data);

      let datosFinales = datosCompletos;
      if (recalcular) {
        datosFinales = calcularTotales(datosCompletos as ValorizacionForm) as typeof datosCompletos;
      }

      const datosBackend = mapearFormulario(datosFinales);

      const response = await apiRequest(`${API_ENDPOINTS.valorizaciones}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datosBackend),
      });

      const valorizacionActualizada = mapearValorizacion(response);
      
      // Actualizar estado local
      setValorizaciones(prev => 
        prev.map(v => v.id === id ? valorizacionActualizada : v)
      );
      
      return valorizacionActualizada as any;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar valorización';
      setError(errorMessage);
      console.error('Error actualizando valorización:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [valorizaciones]);

  const eliminarValorizacion = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ID de valorización es requerido');
      }

      await apiRequest(`${API_ENDPOINTS.valorizaciones}/${id}`, {
        method: 'DELETE',
      });

      // Actualizar estado local
      setValorizaciones(prev => prev.filter(v => v.id !== id));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar valorización';
      setError(errorMessage);
      console.error('Error eliminando valorización:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerValorizacionPorId = useCallback(async (id: number): Promise<Valorizacion> => {
    setLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ID de valorización es requerido');
      }

      // Primero buscar en estado local
      const valorizacionLocal = valorizaciones.find(v => v.id === id);
      if (valorizacionLocal) {
        setLoading(false);
        return valorizacionLocal;
      }

      // Si no está en local, hacer request al backend
      const response = await apiRequest(`${API_ENDPOINTS.valorizaciones}/${id}`);
      const valorizacion = mapearValorizacion(response);
      
      // Actualizar estado local
      setValorizaciones(prev => {
        const existe = prev.find(v => v.id === id);
        if (existe) return prev;
        return [valorizacion, ...prev];
      });
      
      return valorizacion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener valorización';
      setError(errorMessage);
      console.error('Error obteniendo valorización:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [valorizaciones]);

  const obtenerEstadisticas = useCallback(async (): Promise<EstadisticasValorizacion> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest(`${API_ENDPOINTS.valorizaciones}/stats`);
      
      // El backend debe retornar las estadísticas en el formato esperado
      // Si no, mapear según la estructura esperada
      const estadisticas: EstadisticasValorizacion = {
        total_valorizaciones: response.total_valorizaciones || 0,
        monto_total_valorizado: response.monto_total_valorizado || 0,
        monto_total_pagado: response.monto_total_pagado || 0,
        por_estado: response.por_estado || {},
        por_mes: response.por_mes || [],
        promedio_dias_aprobacion: response.promedio_dias_aprobacion || 0,
        con_atraso: response.con_atraso || 0
      };
      
      return estadisticas;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener estadísticas';
      setError(errorMessage);
      console.error('Error obteniendo estadísticas:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // =================================================================
  // FUNCIONES DE UTILIDAD EXPUESTAS
  // =================================================================

  const calcularTotalesValorizacion = useCallback((data: ValorizacionForm): ValorizacionForm => {
    return calcularTotales(data);
  }, []);

  const validarPeriodoValorizacion = useCallback((periodo: string): boolean => {
    return validarPeriodo(periodo);
  }, []);

  // =================================================================
  // VALORES CALCULADOS
  // =================================================================

  const estadisticasLocales = useMemo(() => {
    if (!valorizaciones.length) {
      return {
        total: 0,
        montoTotal: 0,
        porEstado: {},
        promedioDias: 0
      };
    }

    const total = valorizaciones.length;
    const montoTotal = valorizaciones.reduce((sum, v) => sum + (v.monto_total || 0), 0);
    
    const porEstado = valorizaciones.reduce((acc, v) => {
      const estado = v.estado || 'BORRADOR';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calcular promedio de días para aprobación (simplificado)
    const conFechaAprobacion = valorizaciones.filter(v => 
      v.fecha_aprobacion && v.fecha_presentacion
    );
    
    let promedioDias = 0;
    if (conFechaAprobacion.length > 0) {
      const totalDias = conFechaAprobacion.reduce((sum, v) => {
        const inicio = new Date(v.fecha_presentacion!).getTime();
        const fin = new Date(v.fecha_aprobacion!).getTime();
        return sum + Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
      }, 0);
      promedioDias = totalDias / conFechaAprobacion.length;
    }

    return {
      total,
      montoTotal,
      porEstado,
      promedioDias
    };
  }, [valorizaciones]);

  // =================================================================
  // RETURN DEL HOOK
  // =================================================================

  return {
    // Estados
    valorizaciones,
    loading,
    error,

    // Funciones CRUD
    cargarValorizaciones,
    obtenerValorizaciones: cargarValorizaciones, // Alias para compatibilidad con dashboard
    crearValorizacion,
    actualizarValorizacion,
    eliminarValorizacion,
    obtenerValorizacionPorId,
    obtenerEstadisticas,
    obtenerEstadisticasValorizaciones: obtenerEstadisticas, // Alias para compatibilidad con dashboard

    // Funciones de utilidad
    calcularTotales: calcularTotalesValorizacion,
    validarPeriodo: validarPeriodoValorizacion,

    // Estadísticas locales
    estadisticasLocales,

    // Funciones de validación
    validarFechas: (inicio: string, fin: string) => validarFechas(inicio, fin),
    
    // Compatibilidad con componentes legacy
    valorizacionesEjecucion: valorizaciones, // Para componentes que esperan esta propiedad
    valorizacionesSupervision: valorizaciones.filter(v => v.tipo_valorizacion === 'SUPERVISION'),
    estadisticasDashboard: {
      ...estadisticasLocales,
      totalValorizado: estadisticasLocales.montoTotal,
      aprobadas: estadisticasLocales.porEstado.APROBADA || 0,
      pendientes: estadisticasLocales.porEstado.PRESENTADA || 0,
      pagadas: estadisticasLocales.porEstado.PAGADA || 0,
      conAtraso: 0 // Placeholder
    },
    cambiarEstadoValorizacion: async (id: number, nuevoEstado: string) => {
      return await actualizarValorizacion(id, { estado_valorizacion: nuevoEstado });
    },
    formatearMoneda: (monto: number) => new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto),
    partidas: [], // Placeholder para compatibilidad
    cargarPartidasPorObra: async (obraId: number) => {
      console.warn(`Carga de partidas para obra ${obraId} no implementada aún`);
    },
    crearValorizacionEjecucion: crearValorizacion,
    crearValorizacionSupervision: crearValorizacion,
    calcularMontos: calcularTotalesValorizacion,
    validarValorizacion: (form: ValorizacionForm) => {
      // Validación básica
      if (!form.obra_id) return { valido: false, errores: ['Obra requerida'] };
      if (!form.periodo) return { valido: false, errores: ['Período requerido'] };
      if (!form.fecha_inicio || !form.fecha_fin) return { valido: false, errores: ['Fechas requeridas'] };
      if (!validarFechas(form.fecha_inicio, form.fecha_fin)) return { valido: false, errores: ['Fechas inválidas'] };
      return { valido: true, errores: [] };
    }
  };
};

export default useValorizaciones;