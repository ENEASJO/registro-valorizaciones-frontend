import { API_ENDPOINTS, DEFAULT_HEADERS, API_TIMEOUT } from '../../../config/api';
import type {
  Obra,
  ObraFormulario,
  ObrasResponse,
  ObraResponse,
  FiltrosObra,
  ConsultaMEFResponse,
} from '../types';

/**
 * Función helper para realizar peticiones HTTP
 */
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

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('La petición ha excedido el tiempo de espera');
    }

    throw error;
  }
};

/**
 * Servicio para gestión de obras con integración MEF Invierte
 */
class ObrasService {
  private readonly baseURL = API_ENDPOINTS.obras;

  /**
   * Consulta datos de MEF Invierte por CUI
   */
  async consultarMEF(cui: string): Promise<ConsultaMEFResponse> {
    try {
      const response = await realizarPeticionHTTP(
        API_ENDPOINTS.mefConsultar(cui)
      );
      return response;
    } catch (error: any) {
      console.error('Error consultando MEF:', error);
      throw new Error(
        error.message || 'Error al consultar MEF Invierte'
      );
    }
  }

  /**
   * Obtener todas las obras con filtros opcionales
   */
  async obtenerObras(filtros?: FiltrosObra): Promise<ObrasResponse> {
    try {
      const params = new URLSearchParams();

      if (filtros?.busqueda) {
        params.append('busqueda', filtros.busqueda);
      }
      if (filtros?.estado_obra) {
        params.append('estado_obra', filtros.estado_obra);
      }
      if (filtros?.estado_mef) {
        params.append('estado_mef', filtros.estado_mef);
      }
      if (filtros?.zona_tipo) {
        params.append('ubicacion_tipo', filtros.zona_tipo);
      }

      const url = `${this.baseURL}?${params.toString()}`;
      const response = await realizarPeticionHTTP(url);
      return response;
    } catch (error: any) {
      console.error('Error obteniendo obras:', error);
      throw new Error(
        error.message || 'Error al obtener obras'
      );
    }
  }

  /**
   * Obtener una obra por ID
   */
  async obtenerObraPorId(id: string): Promise<ObraResponse> {
    try {
      const response = await realizarPeticionHTTP(`${this.baseURL}/${id}`);
      return response;
    } catch (error: any) {
      console.error('Error obteniendo obra:', error);
      throw new Error(
        error.message || 'Error al obtener la obra'
      );
    }
  }

  /**
   * Obtener una obra por CUI
   */
  async obtenerObraPorCUI(cui: string): Promise<ObraResponse> {
    try {
      const response = await realizarPeticionHTTP(`${this.baseURL}/cui/${cui}`);
      return response;
    } catch (error: any) {
      console.error('Error obteniendo obra por CUI:', error);
      throw new Error(
        error.message || 'Error al obtener la obra'
      );
    }
  }

  /**
   * Crear una nueva obra
   */
  async crearObra(formulario: ObraFormulario): Promise<ObraResponse> {
    try {
      const response = await realizarPeticionHTTP(this.baseURL, {
        method: 'POST',
        body: JSON.stringify(formulario),
      });
      return response;
    } catch (error: any) {
      console.error('Error creando obra:', error);
      throw new Error(
        error.message || 'Error al crear la obra'
      );
    }
  }

  /**
   * Actualizar una obra existente
   */
  async actualizarObra(
    id: string,
    formulario: Partial<ObraFormulario>
  ): Promise<ObraResponse> {
    try {
      const response = await realizarPeticionHTTP(`${this.baseURL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formulario),
      });
      return response;
    } catch (error: any) {
      console.error('Error actualizando obra:', error);
      throw new Error(
        error.message || 'Error al actualizar la obra'
      );
    }
  }

  /**
   * Actualizar datos MEF de una obra
   */
  async actualizarDatosMEF(id: string): Promise<ObraResponse> {
    try {
      const response = await realizarPeticionHTTP(
        `${this.baseURL}/${id}/actualizar-mef`,
        {
          method: 'POST',
        }
      );
      return response;
    } catch (error: any) {
      console.error('Error actualizando datos MEF:', error);
      throw new Error(
        error.message || 'Error al actualizar datos de MEF'
      );
    }
  }

  /**
   * Eliminar una obra
   */
  async eliminarObra(id: string): Promise<void> {
    try {
      await realizarPeticionHTTP(`${this.baseURL}/${id}`, {
        method: 'DELETE',
      });
    } catch (error: any) {
      console.error('Error eliminando obra:', error);
      throw new Error(
        error.message || 'Error al eliminar la obra'
      );
    }
  }

  /**
   * Obtener estadísticas de obras
   */
  async obtenerEstadisticas(): Promise<any> {
    try {
      const response = await realizarPeticionHTTP(
        `${this.baseURL}/estadisticas`
      );
      return response;
    } catch (error: any) {
      console.error('Error obteniendo estadísticas:', error);
      throw new Error(
        error.message || 'Error al obtener estadísticas'
      );
    }
  }
}

// Exportar instancia única del servicio
export const obrasService = new ObrasService();
export default obrasService;
