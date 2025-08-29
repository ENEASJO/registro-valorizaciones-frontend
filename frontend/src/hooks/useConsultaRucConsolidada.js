// =================================================================
// HOOK PARA CONSULTA RUC CONSOLIDADA
// Sistema de Valorizaciones - Frontend
// =================================================================
import { useState, useCallback, useRef } from 'react';
import { consultarRucConsolidadoConCache, verificarDisponibilidadConsolidada, } from '../services/consultaRucConsolidada';
// =================================================================
// HOOK PRINCIPAL
// =================================================================
export function useConsultaRucConsolidada() {
    // Estados del hook
    const [estado, setEstado] = useState({
        loading: false,
        error: null,
        datos: null,
        datosOriginales: null,
        estado: 'idle',
        advertencias: [],
        fuentesUtilizadas: [],
        representantesDisponibles: [],
        ultimoRucConsultado: null,
        disponibilidadAPI: null,
    });
    // Referencias para controlar consultas
    const abortControllerRef = useRef(null);
    const ultimaConsultaRef = useRef(null);
    // =================================================================
    // FUNCIÓN PRINCIPAL DE CONSULTA
    // =================================================================
    const consultarYAutocompletar = useCallback(async (ruc) => {
        // Validación básica
        const rucLimpio = ruc.replace(/\D/g, '');
        if (!rucLimpio || rucLimpio.length !== 11) {
            const error = `RUC inválido: debe tener 11 dígitos (actual: ${rucLimpio.length})`;
            setEstado(prev => ({
                ...prev,
                error,
                estado: 'error',
                loading: false,
            }));
            return {
                success: false,
                error,
            };
        }
        // Cancelar consulta anterior si existe
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        // Crear nuevo controlador de abort
        abortControllerRef.current = new AbortController();
        ultimaConsultaRef.current = rucLimpio;
        // Iniciar estado de carga
        setEstado(prev => ({
            ...prev,
            loading: true,
            error: null,
            estado: 'loading',
            ultimoRucConsultado: rucLimpio,
        }));
        try {
            // Realizar consulta consolidada
            const resultado = await consultarRucConsolidadoConCache(rucLimpio);
            // Verificar si esta consulta sigue siendo relevante
            if (ultimaConsultaRef.current !== rucLimpio) {
                return { success: false, error: 'Consulta cancelada' };
            }
            if (resultado.success) {
                setEstado(prev => ({
                    ...prev,
                    loading: false,
                    error: null,
                    datos: resultado.datos || null,
                    datosOriginales: resultado.datosOriginales || null,
                    estado: 'success',
                    advertencias: resultado.advertencias,
                    fuentesUtilizadas: resultado.fuentes_utilizadas,
                    representantesDisponibles: resultado.representantes_disponibles,
                }));
                return {
                    success: true,
                    datosFormulario: resultado.datos,
                    advertencias: resultado.advertencias,
                };
            }
            else {
                setEstado(prev => ({
                    ...prev,
                    loading: false,
                    error: resultado.error || 'Error desconocido',
                    estado: 'error',
                    datos: null,
                    datosOriginales: null,
                    advertencias: [],
                    fuentesUtilizadas: [],
                    representantesDisponibles: [],
                }));
                return {
                    success: false,
                    error: resultado.error,
                };
            }
        }
        catch (error) {
            // Verificar si el error es por cancelación
            if (error instanceof Error && error.name === 'AbortError') {
                return { success: false, error: 'Consulta cancelada' };
            }
            const mensajeError = error instanceof Error ? error.message : 'Error inesperado en la consulta';
            setEstado(prev => ({
                ...prev,
                loading: false,
                error: mensajeError,
                estado: 'error',
                datos: null,
                datosOriginales: null,
                advertencias: [],
                fuentesUtilizadas: [],
                representantesDisponibles: [],
            }));
            return {
                success: false,
                error: mensajeError,
            };
        }
    }, []);
    // =================================================================
    // FUNCIÓN PARA LIMPIAR DATOS
    // =================================================================
    const limpiarDatos = useCallback(() => {
        // Cancelar cualquier consulta en curso
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        ultimaConsultaRef.current = null;
        setEstado({
            loading: false,
            error: null,
            datos: null,
            datosOriginales: null,
            estado: 'idle',
            advertencias: [],
            fuentesUtilizadas: [],
            representantesDisponibles: [],
            ultimoRucConsultado: null,
            disponibilidadAPI: null,
        });
    }, []);
    // =================================================================
    // FUNCIÓN PARA VERIFICAR API
    // =================================================================
    const verificarAPI = useCallback(async () => {
        try {
            const disponible = await verificarDisponibilidadConsolidada();
            setEstado(prev => ({
                ...prev,
                disponibilidadAPI: disponible,
            }));
            return disponible;
        }
        catch (error) {
            setEstado(prev => ({
                ...prev,
                disponibilidadAPI: false,
            }));
            return false;
        }
    }, []);
    // =================================================================
    // FUNCIÓN PARA SELECCIONAR REPRESENTANTE
    // =================================================================
    const seleccionarRepresentante = useCallback((indice) => {
        if (!estado.representantesDisponibles || indice < 0 || indice >= estado.representantesDisponibles.length) {
            return;
        }
        const representanteSeleccionado = estado.representantesDisponibles[indice];
        setEstado(prev => {
            if (!prev.datos)
                return prev;
            return {
                ...prev,
                datos: {
                    ...prev.datos,
                    representante_legal: representanteSeleccionado.nombre,
                    dni_representante: representanteSeleccionado.dni,
                },
            };
        });
    }, [estado.representantesDisponibles]);
    // =================================================================
    // FUNCIÓN PARA OBTENER INFO DE FUENTES
    // =================================================================
    const obtenerInfoFuentes = useCallback(() => {
        const sunatDisponible = estado.fuentesUtilizadas.includes('SUNAT');
        const osceDisponible = estado.fuentesUtilizadas.includes('OECE');
        let resumen = '';
        if (sunatDisponible && osceDisponible) {
            resumen = 'Datos consolidados de SUNAT y OSCE';
        }
        else if (sunatDisponible) {
            resumen = 'Solo datos de SUNAT disponibles';
        }
        else if (osceDisponible) {
            resumen = 'Solo datos de OSCE disponibles';
        }
        else {
            resumen = 'No hay datos disponibles';
        }
        return {
            sunatDisponible,
            osceDisponible,
            resumen,
        };
    }, [estado.fuentesUtilizadas]);
    // =================================================================
    // LIMPIEZA AL DESMONTAR
    // =================================================================
    // Limpiar al desmontar el componente
    useState(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    });
    // =================================================================
    // RETORNO DEL HOOK
    // =================================================================
    return {
        // Estados
        loading: estado.loading,
        error: estado.error,
        datos: estado.datos,
        datosOriginales: estado.datosOriginales,
        estado: estado.estado,
        advertencias: estado.advertencias,
        fuentesUtilizadas: estado.fuentesUtilizadas,
        representantesDisponibles: estado.representantesDisponibles,
        ultimoRucConsultado: estado.ultimoRucConsultado,
        disponibilidadAPI: estado.disponibilidadAPI,
        // Acciones
        consultarYAutocompletar,
        limpiarDatos,
        verificarAPI,
        seleccionarRepresentante,
        obtenerInfoFuentes,
    };
}
// =================================================================
// UTILIDADES ADICIONALES DEL HOOK
// =================================================================
/**
 * Hook simplificado que solo expone la funcionalidad básica
 */
export function useConsultaRucBasica() {
    const { loading, error, datos, estado, advertencias, consultarYAutocompletar, limpiarDatos, } = useConsultaRucConsolidada();
    return {
        loading,
        error,
        datos,
        estado,
        advertencias,
        consultarYAutocompletar,
        limpiarDatos,
    };
}
/**
 * Hook que se enfoca solo en la información de representantes
 */
export function useRepresentantesLegales() {
    const { representantesDisponibles, seleccionarRepresentante, datosOriginales, } = useConsultaRucConsolidada();
    const obtenerRepresentanteActual = useCallback(() => {
        if (!datosOriginales || !datosOriginales.miembros.length)
            return null;
        // Buscar el representante principal (GERENTE GENERAL generalmente)
        const principal = datosOriginales.miembros.find(m => m.cargo?.toUpperCase().includes('GERENTE GENERAL'));
        return principal || datosOriginales.miembros[0];
    }, [datosOriginales]);
    return {
        representantesDisponibles,
        seleccionarRepresentante,
        obtenerRepresentanteActual,
        totalRepresentantes: representantesDisponibles.length,
    };
}
export default useConsultaRucConsolidada;
