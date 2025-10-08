import api from '@/config/api';
import type {
  Obra,
  ObraFormulario,
  ObrasResponse,
  ObraResponse,
  FiltrosObra,
  ConsultaMEFResponse,
} from '../types';

/**
 * Servicio para gestión de obras con integración MEF Invierte
 */
class ObrasService {
  private readonly baseURL = '/api/v1/obras';
  private readonly mefURL = '/api/v1/mef-invierte';

  /**
   * Consulta datos de MEF Invierte por CUI
   */
  async consultarMEF(cui: string): Promise<ConsultaMEFResponse> {
    try {
      const response = await api.get<ConsultaMEFResponse>(
        `${this.mefURL}/consultar/${cui}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error consultando MEF:', error);
      throw new Error(
        error.response?.data?.message || 'Error al consultar MEF Invierte'
      );
    }
  }

  /**
   * Obtener todas las obras con filtros opcionales
   */
  async obtenerObras(filtros?: FiltrosObra): Promise<ObrasResponse> {
    try {
      const response = await api.get<ObrasResponse>(this.baseURL, {
        params: filtros,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo obras:', error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener obras'
      );
    }
  }

  /**
   * Obtener una obra por ID
   */
  async obtenerObra(id: string): Promise<ObraResponse> {
    try {
      const response = await api.get<ObraResponse>(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo obra:', error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener obra'
      );
    }
  }

  /**
   * Obtener una obra por CUI
   */
  async obtenerObraPorCUI(cui: string): Promise<ObraResponse> {
    try {
      const response = await api.get<ObraResponse>(
        `${this.baseURL}/cui/${cui}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo obra por CUI:', error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener obra'
      );
    }
  }

  /**
   * Crear una nueva obra
   */
  async crearObra(formulario: ObraFormulario): Promise<ObraResponse> {
    try {
      const response = await api.post<ObraResponse>(this.baseURL, formulario);
      return response.data;
    } catch (error: any) {
      console.error('Error creando obra:', error);
      throw new Error(
        error.response?.data?.message || 'Error al crear obra'
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
      const response = await api.put<ObraResponse>(
        `${this.baseURL}/${id}`,
        formulario
      );
      return response.data;
    } catch (error: any) {
      console.error('Error actualizando obra:', error);
      throw new Error(
        error.response?.data?.message || 'Error al actualizar obra'
      );
    }
  }

  /**
   * Eliminar una obra
   */
  async eliminarObra(id: string): Promise<{ success: boolean }> {
    try {
      const response = await api.delete<{ success: boolean }>(
        `${this.baseURL}/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error eliminando obra:', error);
      throw new Error(
        error.response?.data?.message || 'Error al eliminar obra'
      );
    }
  }

  /**
   * Actualizar datos MEF de una obra existente
   */
  async actualizarDatosMEF(id: string): Promise<ObraResponse> {
    try {
      const response = await api.post<ObraResponse>(
        `${this.baseURL}/${id}/actualizar-mef`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error actualizando datos MEF:', error);
      throw new Error(
        error.response?.data?.message || 'Error al actualizar datos MEF'
      );
    }
  }

  /**
   * Obtener estadísticas de obras
   */
  async obtenerEstadisticas(): Promise<{
    total: number;
    por_estado: Record<string, number>;
    inversion_total: number;
  }> {
    try {
      const response = await api.get<{
        total: number;
        por_estado: Record<string, number>;
        inversion_total: number;
      }>(`${this.baseURL}/estadisticas`);
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo estadísticas:', error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener estadísticas'
      );
    }
  }
}

export const obrasService = new ObrasService();
export default obrasService;
