/**
 * Servicio para gestión de ubicaciones en San Marcos
 */

import { API_ENDPOINTS } from '../config/api';

export interface Ubicacion {
  id: string;
  nombre: string;
  tipo: 'urbana' | 'centro_poblado' | 'caserio';
  departamento: string;
  provincia: string;
  distrito: string;
}

export interface UbicacionesAgrupadasResponse {
  status: 'success' | 'error';
  data?: {
    urbana: Ubicacion[];
    centro_poblado: Ubicacion[];
    caserio: Ubicacion[];
  };
  message?: string;
}

/**
 * Obtiene todas las ubicaciones agrupadas por tipo
 */
export const obtenerUbicacionesAgrupadas = async (): Promise<UbicacionesAgrupadasResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.ubicacionesAgrupadas);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener ubicaciones agrupadas:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Obtiene todas las ubicaciones (sin agrupar)
 */
export const obtenerUbicaciones = async (): Promise<{ status: string; data?: Ubicacion[]; message?: string }> => {
  try {
    const response = await fetch(API_ENDPOINTS.ubicaciones);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};
