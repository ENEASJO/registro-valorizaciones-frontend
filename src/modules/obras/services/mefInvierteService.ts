/**
 * Servicio para consultar datos desde MEF Invierte
 * Integración con backend para scraping de inversiones públicas
 */

import { API_ENDPOINTS } from '../../../config/api';
import type { ObraForm, ModalidadEjecucion } from '../../../types/obra.types';

// Tipos para la respuesta de MEF
export interface DatosMEF {
  cui: string;
  nombre: string;
  estado: string;
  etapa: string;
  fecha_registro: string;
  responsabilidad_funcional: {
    funcion: string;
    division_funcional: string;
    grupo_funcional: string;
    sector_responsable: string;
  };
  articulacion_pmi: {
    servicio_publico: string;
    indicador_brecha: string;
    espacio_geografico: string;
    contribucion_brecha: number;
  };
  institucionalidad: {
    opmi: { codigo: string; responsable: string };
    uf: { codigo: string; responsable: string };
    uei: { codigo: string; responsable: string };
    uep: { codigo: string; nombre: string };
  };
  expediente_tecnico: {
    metas: Array<{
      tipo: string;
      naturaleza: string;
      factor_productivo: string;
      activo: string;
      unidad: string;
      cantidad: number;
    }>;
    modalidad_ejecucion: string;
    fechas_muro: { inicio: string; termino: string; entrega: string } | null;
    fechas_ptar: { inicio: string; termino: string; entrega: string } | null;
    fechas_expediente: { inicio: string; termino: string } | null;
    fechas_supervision: { inicio: string; termino: string } | null;
    fechas_liquidacion: { inicio: string; termino: string } | null;
    subtotal_metas: number;
    costo_expediente_tecnico: number;
    costo_supervision: number;
    costo_liquidacion: number;
    costo_inversion_actualizado: number;
  };
  modificaciones_ejecucion: {
    documentos: Array<{
      tipo: string;
      numero: string;
      fecha?: string;
      descripcion: string;
    }>;
    fechas_muro_modificado: { inicio: string; termino_vigente: string; entrega: string } | null;
    fechas_ptar_modificado: { inicio: string; termino_vigente: string; entrega: string } | null;
    fechas_supervision_modificado: { inicio: string; termino_vigente: string } | null;
    fechas_liquidacion_modificado: { inicio: string; termino_vigente: string } | null;
    subtotal_modificado: number;
    costo_supervision_modificado: number;
    costo_liquidacion_modificado: number;
    costo_inversion_modificado: number;
  };
  costos_finales: {
    costo_total_actualizado: number;
    costo_control_concurrente: number;
    costo_controversias: number;
    monto_carta_fianza: number;
  };
  fuente: string;
}

export interface RespuestaMEF {
  success: boolean;
  found?: boolean;
  cui?: string;
  data?: DatosMEF;
  cache_info?: {
    ultima_actualizacion: string;
    fuente: string;
  };
  error?: string;
  message?: string;
}

/**
 * Consultar datos de inversión pública desde MEF Invierte (desde caché)
 */
export const consultarCUI = async (cui: string): Promise<RespuestaMEF> => {
  try {
    const response = await fetch(API_ENDPOINTS.mefConsultar(cui), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const data: RespuestaMEF = await response.json();
    return data;
  } catch (error) {
    console.error('Error consultando MEF Invierte:', error);
    throw error;
  }
};

/**
 * Mapear modalidad de ejecución MEF a enum del sistema
 */
const mapearModalidadEjecucion = (modalidadMEF: string): ModalidadEjecucion => {
  if (modalidadMEF?.includes('CONTRATA')) {
    return 'CONTRATA';
  } else if (modalidadMEF?.includes('DIRECTA')) {
    return 'ADMINISTRACION_DIRECTA';
  } else if (modalidadMEF?.includes('ENCARGO')) {
    return 'ENCARGO';
  }
  return 'CONTRATA'; // Default
};

/**
 * Convertir fecha MEF (DD/MM/YYYY) a formato ISO (YYYY-MM-DD)
 */
const convertirFechaMEF = (fechaMEF: string | null): string => {
  if (!fechaMEF) return '';

  try {
    const partes = fechaMEF.split('/');
    if (partes.length === 3) {
      const [dia, mes, año] = partes;
      return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
  } catch (error) {
    console.error('Error convirtiendo fecha MEF:', fechaMEF, error);
  }

  return '';
};

/**
 * Calcular plazo en días desde fechas
 */
const calcularPlazoDias = (fechaInicio: string, fechaTermino: string): number => {
  if (!fechaInicio || !fechaTermino) return 0;

  try {
    const inicio = new Date(fechaInicio);
    const termino = new Date(fechaTermino);
    const diff = termino.getTime() - inicio.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('Error calculando plazo:', error);
    return 0;
  }
};

/**
 * Construir descripción desde metas MEF
 */
const construirDescripcion = (datos: DatosMEF): string => {
  const partes: string[] = [];

  // Agregar nombre básico
  partes.push(datos.nombre);

  // Agregar metas físicas
  if (datos.expediente_tecnico?.metas?.length > 0) {
    partes.push('\n\nMETAS FÍSICAS:');
    datos.expediente_tecnico.metas.forEach((meta, index) => {
      partes.push(`\n${index + 1}. ${meta.tipo} - ${meta.naturaleza}`);
      partes.push(`   ${meta.factor_productivo}: ${meta.activo}`);
      partes.push(`   Cantidad: ${meta.cantidad} ${meta.unidad}`);
    });
  }

  // Agregar información institucional
  if (datos.institucionalidad) {
    partes.push('\n\nUNIDAD EJECUTORA:');
    partes.push(`UEP: ${datos.institucionalidad.uep?.nombre || 'N/A'}`);
  }

  return partes.join('');
};

/**
 * Mapear datos MEF a campos del formulario de obra
 */
export const mapearDatosMEFAFormulario = (datosMEF: DatosMEF): Partial<ObraForm> => {
  // Obtener fechas prioritarias (modificadas o expediente)
  const fechasVigentes = datosMEF.modificaciones_ejecucion?.fechas_muro_modificado ||
                         datosMEF.expediente_tecnico?.fechas_muro ||
                         datosMEF.modificaciones_ejecucion?.fechas_ptar_modificado ||
                         datosMEF.expediente_tecnico?.fechas_ptar;

  const fechaInicio = convertirFechaMEF(fechasVigentes?.inicio || '');
  const fechaTermino = convertirFechaMEF(fechasVigentes?.termino_vigente || fechasVigentes?.termino || '');

  // Calcular plazo
  const plazoDias = calcularPlazoDias(fechaInicio, fechaTermino);

  // Obtener costos finales
  const costoEjecucion = datosMEF.costos_finales?.costo_total_actualizado ||
                         datosMEF.modificaciones_ejecucion?.costo_inversion_modificado ||
                         datosMEF.expediente_tecnico?.costo_inversion_actualizado ||
                         0;

  const costoSupervision = datosMEF.modificaciones_ejecucion?.costo_supervision_modificado ||
                           datosMEF.expediente_tecnico?.costo_supervision ||
                           0;

  return {
    cui: datosMEF.cui,
    nombre: datosMEF.nombre,
    monto_ejecucion: costoEjecucion,
    monto_supervision: costoSupervision,
    plazo_ejecucion_dias: plazoDias,
    fecha_inicio: fechaInicio,
    fecha_termino: fechaTermino,
    modalidad_ejecucion: mapearModalidadEjecucion(datosMEF.expediente_tecnico?.modalidad_ejecucion || ''),
    descripcion: construirDescripcion(datosMEF),
    // Guardar datos completos MEF (se enviará a backend)
    datos_mef: datosMEF as any
  };
};

/**
 * Formatear montos para visualización
 */
export const formatearMonto = (monto: number | null): string => {
  if (monto === null || monto === undefined) return 'N/A';
  return `S/ ${monto.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Formatear fecha MEF para visualización
 */
export const formatearFechaMEF = (fechaMEF: string | null): string => {
  if (!fechaMEF) return 'N/A';

  const fechaISO = convertirFechaMEF(fechaMEF);
  if (!fechaISO) return fechaMEF;

  try {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return fechaMEF;
  }
};
