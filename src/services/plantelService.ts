/**
 * Servicio para gestión de plantel profesional de obras
 */

import { API_ENDPOINTS } from '../config/api';

export interface Profesional {
  id: string;
  obra_id: string;
  nombres: string;
  apellidos: string;
  cargo_categoria: string;
  cargo_tecnico: string;
  fecha_registro?: string;
}

export interface ProfesionalCreate {
  obra_id: string;
  nombres: string;
  apellidos: string;
  cargo_categoria: string;
  cargo_tecnico: string;
}

export interface ProfesionalUpdate {
  nombres?: string;
  apellidos?: string;
  cargo_categoria?: string;
  cargo_tecnico?: string;
}

export interface CatalogoResponse {
  status: 'success' | 'error';
  data?: Record<string, string[]>;
  message?: string;
}

export interface PlantelResponse {
  status: 'success' | 'error';
  data?: Profesional[];
  message?: string;
}

export interface ProfesionalResponse {
  status: 'success' | 'error';
  data?: Profesional;
  message?: string;
}

/**
 * Obtiene el catálogo completo de categorías y cargos técnicos
 */
export const obtenerCatalogoCargos = async (): Promise<CatalogoResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.plantelCargos);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener catálogo de cargos:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Obtiene el plantel profesional de una obra específica
 */
export const obtenerPlantelPorObra = async (obraId: string): Promise<PlantelResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.plantelPorObra(obraId));

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener plantel de obra:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Agrega un nuevo profesional al plantel de una obra
 */
export const agregarProfesional = async (profesional: ProfesionalCreate): Promise<ProfesionalResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.plantel, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profesional),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al agregar profesional:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Actualiza los datos de un profesional del plantel
 */
export const actualizarProfesional = async (
  profesionalId: string,
  actualizacion: ProfesionalUpdate
): Promise<ProfesionalResponse> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.plantel}/${profesionalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(actualizacion),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar profesional:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Elimina un profesional del plantel
 */
export const eliminarProfesional = async (profesionalId: string): Promise<ProfesionalResponse> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.plantel}/${profesionalId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al eliminar profesional:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};
