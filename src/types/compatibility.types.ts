// =================================================================
// TIPOS TEMPORALES PARA COMPATIBILIDAD CON COMPONENTES LEGACY
// Sistema de Valorizaciones - Frontend  
// =================================================================

// Extensión temporal de Obra para compatibilidad con dashboard
export interface ObraExtendida {
  id: string;
  nombre: string;
  empresa_contratista?: string;
  porcentaje_avance?: number;
  monto_contrato?: number;
  estado_obra?: string;
  fecha_inicio?: string;
  fecha_fin_prevista?: string;
  ubicacion?: string;
  tipo_obra?: string;
  observaciones?: string;
  entidad_ejecutora_id?: string;
  entidad_supervisora_id?: string;
  monto_ejecucion?: number;
  monto_supervision?: number;
  numero_contrato?: string;
  plazo_ejecucion_dias?: number;
  estado?: string;
}

// Declaración global para compatibilidad temporal
declare global {
  namespace App {
    interface Obra extends ObraExtendida {}
  }
}

export {};