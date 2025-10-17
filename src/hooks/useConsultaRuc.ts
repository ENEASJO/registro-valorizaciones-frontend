// =================================================================
// HOOK PERSONALIZADO PARA CONSULTA RUC
// Sistema de Valorizaciones - Frontend
// =================================================================

import { useState, useCallback, useRef } from 'react';
import {
  consultarRucConCache,
  validarFormatoRuc,
  limpiarRuc,
  verificarDisponibilidadAPI,
  type DatosEmpresaFormulario,
  type DatosRucConsulta,
  type ResultadoConsultaFormulario,
} from '../services/consultaRucService';

// =================================================================
// TIPOS DEL HOOK
// =================================================================

export type EstadoConsulta = 'idle' | 'loading' | 'success' | 'error';

export interface EstadoConsultaRuc {
  // Estados
  estado: EstadoConsulta;
  loading: boolean;
  
  // Datos
  datos: DatosEmpresaFormulario | null;
  datosOriginales: DatosRucConsulta | null;
  
  // Mensajes
  error: string | null;
  advertencias: string[];
  
  // Información adicional
  ultimoRucConsultado: string | null;
  tiempoConsulta: number | null;
  apiDisponible: boolean | null;
}

export interface AccionesConsultaRuc {
  // Consulta principal
  consultarRuc: (ruc: string) => Promise<boolean>;
  
  // Autocompletar formulario
  consultarYAutocompletar: (ruc: string, autorellenarCallback?: (datos: DatosEmpresaFormulario) => void) => Promise<{
    success: boolean;
    datosFormulario?: DatosEmpresaFormulario;
    datosOriginales?: DatosRucConsulta;
    error?: string;
    advertencias: string[];
  }>;
  
  // Validación
  validarRuc: (ruc: string) => { valido: boolean; error?: string };
  
  // Gestión de estados
  limpiarDatos: () => void;
  verificarAPI: () => Promise<void>;
  
  // Utilidades
  formatearRuc: (ruc: string) => string;
  esRucValido: (ruc: string) => boolean;
}

// =================================================================
// CONFIGURACIÓN DEL HOOK
// =================================================================

const ESTADO_INICIAL: EstadoConsultaRuc = {
  estado: 'idle',
  loading: false,
  datos: null,
  datosOriginales: null,
  error: null,
  advertencias: [],
  ultimoRucConsultado: null,
  tiempoConsulta: null,
  apiDisponible: null,
};

// =================================================================
// HOOK PRINCIPAL
// =================================================================

export function useConsultaRuc(): EstadoConsultaRuc & AccionesConsultaRuc {
  const [estado, setEstado] = useState<EstadoConsultaRuc>(ESTADO_INICIAL);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // =================================================================
  // FUNCIONES AUXILIARES
  // =================================================================
  
  const actualizarEstado = useCallback((updates: Partial<EstadoConsultaRuc>) => {
    setEstado(prev => ({ ...prev, ...updates }));
  }, []);
  
  const iniciarConsulta = useCallback((ruc: string) => {
    // Cancelar consulta anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    actualizarEstado({
      estado: 'loading',
      loading: true,
      error: null,
      datos: null,
      datosOriginales: null,
      advertencias: [],
      ultimoRucConsultado: ruc,
      tiempoConsulta: Date.now(),
    });
  }, [actualizarEstado]);
  
  const finalizarConsulta = useCallback((resultado: ResultadoConsultaFormulario, tiempoInicio: number) => {
    const tiempoTranscurrido = Date.now() - tiempoInicio;
    
    if (resultado.success && resultado.datos) {
      actualizarEstado({
        estado: 'success',
        loading: false,
        datos: resultado.datos,
        datosOriginales: resultado.datosOriginales || null,
        advertencias: resultado.advertencias,
        tiempoConsulta: tiempoTranscurrido,
      });
    } else {
      actualizarEstado({
        estado: 'error',
        loading: false,
        error: resultado.error || 'Error desconocido en la consulta',
        tiempoConsulta: tiempoTranscurrido,
      });
    }
    
    abortControllerRef.current = null;
  }, [actualizarEstado]);
  
  // =================================================================
  // FUNCIONES DE VALIDACIÓN
  // =================================================================
  
  const validarRuc = useCallback((ruc: string): { valido: boolean; error?: string } => {
    if (!ruc || typeof ruc !== 'string') {
      return { valido: false, error: 'Debe ingresar un RUC' };
    }
    
    const rucLimpio = limpiarRuc(ruc);
    
    if (rucLimpio.length === 0) {
      return { valido: false, error: 'Debe ingresar un RUC' };
    }
    
    if (rucLimpio.length < 11) {
      return { valido: false, error: `El RUC debe tener 11 dígitos (actual: ${rucLimpio.length})` };
    }
    
    if (rucLimpio.length > 11) {
      return { valido: false, error: `El RUC debe tener 11 dígitos (actual: ${rucLimpio.length})` };
    }
    
    if (!validarFormatoRuc(rucLimpio)) {
      const prefijo = rucLimpio.substring(0, 2);
      return { valido: false, error: `RUC inválido. Debe comenzar con 10, 15, 17, 20 o 25 (actual: ${prefijo})` };
    }
    
    return { valido: true };
  }, []);
  
  const esRucValido = useCallback((ruc: string): boolean => {
    return validarRuc(ruc).valido;
  }, [validarRuc]);
  
  // =================================================================
  // FUNCIONES DE CONSULTA
  // =================================================================
  
  const consultarRuc = useCallback(async (ruc: string): Promise<boolean> => {
    // Validar RUC
    const validacion = validarRuc(ruc);
    if (!validacion.valido) {
      actualizarEstado({
        estado: 'error',
        loading: false,
        error: validacion.error!,
      });
      return false;
    }
    
    const rucLimpio = limpiarRuc(ruc);
    const tiempoInicio = Date.now();
    
    iniciarConsulta(rucLimpio);
    
    try {
      const resultado = await consultarRucConCache(rucLimpio);
      finalizarConsulta(resultado, tiempoInicio);
      return resultado.success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      actualizarEstado({
        estado: 'error',
        loading: false,
        error: errorMessage,
        tiempoConsulta: Date.now() - tiempoInicio,
      });
      
      abortControllerRef.current = null;
      return false;
    }
  }, [validarRuc, actualizarEstado, iniciarConsulta, finalizarConsulta]);
  
  const consultarYAutocompletar = useCallback(async (
    ruc: string,
    autorellenarCallback?: (datos: DatosEmpresaFormulario) => void
  ): Promise<{
    success: boolean;
    datosFormulario?: DatosEmpresaFormulario;
    datosOriginales?: DatosRucConsulta;
    error?: string;
    advertencias: string[];
  }> => {
    // Validar RUC
    const validacion = validarRuc(ruc);
    if (!validacion.valido) {
      actualizarEstado({
        estado: 'error',
        loading: false,
        error: validacion.error!,
      });
      return {
        success: false,
        error: validacion.error!,
        advertencias: [],
      };
    }

    const rucLimpio = limpiarRuc(ruc);
    const tiempoInicio = Date.now();

    iniciarConsulta(rucLimpio);

    try {
      const resultado = await consultarRucConCache(rucLimpio);
      finalizarConsulta(resultado, tiempoInicio);

      if (resultado.success && resultado.datos && autorellenarCallback) {
        // Ejecutar callback para auto-rellenar formulario
        try {
          autorellenarCallback(resultado.datos);
          // console.log('Formulario auto-completado exitosamente');
        } catch (error) {
          console.error('Error al auto-completar formulario:', error);
        }
      }

      return {
        success: resultado.success,
        datosFormulario: resultado.datos,
        datosOriginales: resultado.datosOriginales,
        error: resultado.error,
        advertencias: resultado.advertencias,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

      actualizarEstado({
        estado: 'error',
        loading: false,
        error: errorMessage,
        tiempoConsulta: Date.now() - tiempoInicio,
      });

      abortControllerRef.current = null;

      return {
        success: false,
        error: errorMessage,
        advertencias: [],
      };
    }
  }, [validarRuc, actualizarEstado, iniciarConsulta, finalizarConsulta]);
  
  // =================================================================
  // FUNCIONES DE GESTIÓN
  // =================================================================
  
  const limpiarDatos = useCallback(() => {
    // Cancelar consulta en progreso
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setEstado(ESTADO_INICIAL);
  }, []);
  
  const verificarAPI = useCallback(async () => {
    try {
      const disponible = await verificarDisponibilidadAPI();
      actualizarEstado({ apiDisponible: disponible });
    } catch {
      actualizarEstado({ apiDisponible: false });
    }
  }, [actualizarEstado]);
  
  // =================================================================
  // FUNCIONES DE UTILIDAD
  // =================================================================
  
  const formatearRuc = useCallback((ruc: string): string => {
    const rucLimpio = limpiarRuc(ruc);
    if (rucLimpio.length === 11) {
      return `${rucLimpio.substring(0, 2)}-${rucLimpio.substring(2, 10)}-${rucLimpio.substring(10)}`;
    }
    return ruc;
  }, []);
  
  // =================================================================
  // CLEANUP
  // =================================================================
  
  // Limpiar al desmontar el componente
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);
  
  // =================================================================
  // RETORNO DEL HOOK
  // =================================================================
  
  return {
    // Estado
    ...estado,
    
    // Acciones
    consultarRuc,
    consultarYAutocompletar,
    validarRuc,
    limpiarDatos,
    verificarAPI,
    formatearRuc,
    esRucValido,
    
    // Cleanup (para uso en useEffect)
    cleanup,
  } as EstadoConsultaRuc & AccionesConsultaRuc & { cleanup: () => void };
}

// =================================================================
// HOOK SIMPLIFICADO PARA CASOS BÁSICOS
// =================================================================

/**
 * Hook simplificado para consulta rápida de RUC
 */
export function useConsultaRucSimple() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const consultarRapido = useCallback(async (ruc: string): Promise<DatosEmpresaFormulario | null> => {
    const rucLimpio = limpiarRuc(ruc);
    if (!validarFormatoRuc(rucLimpio)) {
      if (rucLimpio.length !== 11) {
        setError(`El RUC debe tener 11 dígitos (actual: ${rucLimpio.length})`);
      } else {
        const prefijo = rucLimpio.substring(0, 2);
        setError(`RUC inválido. Debe comenzar con 10, 15, 17, 20 o 25 (actual: ${prefijo})`);
      }
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await consultarRucConCache(ruc);
      
      if (resultado.success && resultado.datos) {
        return resultado.datos;
      } else {
        setError(resultado.error || 'Error en la consulta');
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    consultarRapido,
    loading,
    error,
    limpiarError: () => setError(null),
  };
}

// =================================================================
// HOOKS DE UTILIDAD
// =================================================================

/**
 * Hook para validación en tiempo real de RUC
 */
export function useValidacionRuc() {
  const [ruc, setRuc] = useState('');
  const [esValido, setEsValido] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const actualizarRuc = useCallback((nuevoRuc: string) => {
    const rucLimpio = limpiarRuc(nuevoRuc);
    setRuc(rucLimpio);
    
    if (rucLimpio.length === 0) {
      setEsValido(false);
      setError(null);
      return;
    }
    
    const validacion = validarFormatoRuc(rucLimpio);
    setEsValido(validacion);
    
    if (!validacion && rucLimpio.length > 0) {
      if (rucLimpio.length < 11) {
        setError(`El RUC debe tener 11 dígitos (actual: ${rucLimpio.length})`);
      } else if (rucLimpio.length > 11) {
        setError(`El RUC debe tener 11 dígitos (actual: ${rucLimpio.length})`);
      } else {
        const prefijo = rucLimpio.substring(0, 2);
        setError(`RUC inválido. Debe comenzar con 10, 15, 17, 20 o 25 (actual: ${prefijo})`);
      }
    } else {
      setError(null);
    }
  }, []);
  
  return {
    ruc,
    actualizarRuc,
    esValido,
    error,
    limpiar: () => {
      setRuc('');
      setEsValido(false);
      setError(null);
    },
  };
}

export default useConsultaRuc;