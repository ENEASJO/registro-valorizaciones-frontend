// =================================================================
// EXTENSIONES TEMPORALES PARA COMPATIBILIDAD CON COMPONENTES
// Sistema de Valorizaciones - Frontend
// =================================================================

import { Valorizacion } from '../hooks/useValorizaciones';

// Extensión de Valorizacion con todas las propiedades que necesitan los componentes
export interface ValorizacionExtended extends Valorizacion {
  // Propiedades adicionales para compatibilidad
  numero_valorización?: number;
  periodo_inicio?: string;
  periodo_fin?: string;
  monto_bruto?: number;
  monto_neto?: number;
  total_deducciones?: number;
  igv_monto?: number;
  dias_atraso?: number;
  
  // Adelantos
  adelanto_directo_monto?: number;
  adelanto_directo_porcentaje?: number;
  adelanto_materiales_monto?: number;
  adelanto_materiales_porcentaje?: number;
  
  // Retenciones y deducciones
  retencion_garantia_porcentaje?: number;
  retencion_garantia_monto?: number;
  penalidades_monto?: number;
  otras_deducciones_monto?: number;
  
  // Fechas adicionales
  fecha_limite_pago?: string;
  fecha_pago?: string;
  
  // Responsables y observaciones
  residente_obra?: string;
  supervisor_obra?: string;
  responsable_entidad?: string;
  observaciones_residente?: string;
  observaciones_supervisor?: string;
  observaciones_entidad?: string;
  observaciones_periodo?: string;
  motivo_rechazo?: string;
  actividades_realizadas?: string;
  motivos_dias_no_trabajados?: string;
  
  // Porcentajes de avance
  porcentaje_avance_fisico_total?: number;
  monto_avance_economico_total?: number;
}

// Declaración global para compatibilidad
declare global {
  namespace App {
    interface Valorizacion extends ValorizacionExtended {}
  }
}

export {};