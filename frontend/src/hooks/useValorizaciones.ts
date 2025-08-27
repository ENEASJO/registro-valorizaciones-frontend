import { useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  ValorizacionEjecucion,
  ValorizacionSupervision,
  ValorizacionEjecucionForm,
  ValorizacionSupervisionForm,
  Partida,
  PartidaDetalle,
  EstadisticasValorizaciones,
  FiltrosValorizacion,
  CalculosValorizacion,
  ValidacionValorizacion,
  Normativa,
  EstadoValorizacionEjecucion,
} from '../types/valorizacion.types';
import { CONFIG_MONEDA_PERUANA } from '../types/valorizacion.types';
import type { Obra } from '../types/obra.types';

// =================================================================
// DATOS MOCK PARA DESARROLLO
// =================================================================

const mockNormativas: Normativa[] = [
  {
    id: 1,
    codigo: 'LEY_30225',
    nombre: 'Ley de Contrataciones del Estado - Ley N° 30225',
    descripcion: 'Normativa vigente para contratos firmados antes del 22 de abril de 2025',
    fecha_vigencia_inicio: '2014-07-11',
    fecha_vigencia_fin: '2025-04-21',
    porcentaje_adelanto_directo_max: 30.00,
    porcentaje_adelanto_materiales_max: 20.00,
    porcentaje_retencion_garantia: 5.00,
    dias_pago_valorización: 30,
    activo: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    codigo: 'LEY_32069',
    nombre: 'Nueva Ley de Contrataciones del Estado - Ley N° 32069',
    descripcion: 'Normativa vigente para contratos firmados desde el 22 de abril de 2025',
    fecha_vigencia_inicio: '2025-04-22',
    porcentaje_adelanto_directo_max: 30.00,
    porcentaje_adelanto_materiales_max: 20.00,
    porcentaje_retencion_garantia: 5.00,
    dias_pago_valorización: 25,
    activo: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  }
];

const mockPartidas: Partida[] = [
  {
    id: 1,
    obra_id: 1,
    codigo_partida: '01.01.01',
    numero_orden: 1,
    descripcion: 'TRAZO Y REPLANTEO',
    unidad_medida: 'm2',
    metrado_contractual: 2500.00,
    precio_unitario: 2.50,
    monto_contractual: 6250.00,
    categoria: 'OBRAS PRELIMINARES',
    nivel_jerarquia: 1,
    activo: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: 2,
    obra_id: 1,
    codigo_partida: '02.01.01',
    numero_orden: 2,
    descripcion: 'EXCAVACION MASIVA EN MATERIAL SUELTO',
    unidad_medida: 'm3',
    metrado_contractual: 1800.00,
    precio_unitario: 15.80,
    monto_contractual: 28440.00,
    categoria: 'MOVIMIENTO DE TIERRAS',
    nivel_jerarquia: 1,
    activo: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: 3,
    obra_id: 1,
    codigo_partida: '03.01.01',
    numero_orden: 3,
    descripcion: 'CONCRETO fc=210 kg/cm2 PARA VEREDAS',
    unidad_medida: 'm3',
    metrado_contractual: 450.00,
    precio_unitario: 280.00,
    monto_contractual: 126000.00,
    categoria: 'CONCRETO SIMPLE',
    nivel_jerarquia: 1,
    activo: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  }
];

const mockValorizacionesEjecucion: ValorizacionEjecucion[] = [
  {
    id: 1,
    obra_id: 1,
    normativa_id: 2,
    numero_valorización: 1,
    codigo_valorización: '001-2025-02',
    numero_expediente: 'EXP-2025-001-OBRAS',
    numero_expediente_siaf: 'SIAF-2025-001',
    periodo_inicio: '2025-02-01',
    periodo_fin: '2025-02-28',
    dias_periodo: 28,
    monto_bruto: 125000.00,
    monto_neto: 108750.00,
    porcentaje_avance_fisico: 15.00,
    monto_avance_economico: 125000.00,
    porcentaje_avance_fisico_anterior: 0.00,
    monto_avance_economico_anterior: 0.00,
    porcentaje_avance_fisico_total: 15.00,
    monto_avance_economico_total: 125000.00,
    adelanto_directo_porcentaje: 10.00,
    adelanto_directo_monto: 12500.00,
    adelanto_materiales_porcentaje: 0.00,
    adelanto_materiales_monto: 0.00,
    penalidades_monto: 0.00,
    retencion_garantia_porcentaje: 5.00,
    retencion_garantia_monto: 6250.00,
    otras_deducciones_monto: 0.00,
    total_deducciones: 18750.00,
    igv_porcentaje: 18.00,
    igv_monto: 19575.00,
    estado: 'APROBADA',
    fecha_presentacion: '2025-03-03',
    fecha_aprobacion: '2025-03-07',
    fecha_pago: '2025-03-15',
    fecha_limite_pago: '2025-04-06',
    dias_atraso: 0,
    residente_obra: 'Juan Carlos Mendoza Silva',
    supervisor_obra: 'Carlos Alberto Ruiz',
    responsable_entidad: 'María González',
    activo: true,
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-03-07T15:30:00Z'
  },
  {
    id: 2,
    obra_id: 1,
    normativa_id: 2,
    numero_valorización: 2,
    codigo_valorización: '002-2025-03',
    numero_expediente: 'EXP-2025-002-OBRAS',
    numero_expediente_siaf: 'SIAF-2025-002',
    periodo_inicio: '2025-03-01',
    periodo_fin: '2025-03-31',
    dias_periodo: 31,
    monto_bruto: 0.00,
    monto_neto: 0.00,
    porcentaje_avance_fisico: 0.00,
    monto_avance_economico: 0.00,
    porcentaje_avance_fisico_anterior: 15.00,
    monto_avance_economico_anterior: 125000.00,
    porcentaje_avance_fisico_total: 15.00,
    monto_avance_economico_total: 125000.00,
    adelanto_directo_porcentaje: 10.00,
    adelanto_directo_monto: 0.00,
    adelanto_materiales_porcentaje: 0.00,
    adelanto_materiales_monto: 0.00,
    penalidades_monto: 0.00,
    retencion_garantia_porcentaje: 5.00,
    retencion_garantia_monto: 0.00,
    otras_deducciones_monto: 0.00,
    total_deducciones: 0.00,
    igv_porcentaje: 18.00,
    igv_monto: 0.00,
    estado: 'BORRADOR',
    dias_atraso: 0,
    activo: true,
    created_at: '2025-03-01T10:00:00Z',
    updated_at: '2025-03-01T10:00:00Z'
  }
];

const mockValorizacionesSupervision: ValorizacionSupervision[] = [
  {
    id: 1,
    obra_id: 1,
    valorizacion_ejecucion_id: 1,
    normativa_id: 2,
    numero_valorización: 1,
    numero_expediente: 'EXP-2025-001-SUPERVISION',
    numero_expediente_siaf: 'SIAF-2025-001-SUP',
    periodo_inicio: '2025-02-01',
    periodo_fin: '2025-02-28',
    dias_calendario_periodo: 28,
    dias_efectivos_trabajados: 26,
    dias_no_trabajados: 2,
    dias_lluvia: 1,
    dias_feriados: 1,
    dias_suspension_obra: 0,
    dias_otros_motivos: 0,
    tarifa_diaria_supervision: 450.00,
    monto_bruto: 11700.00,
    retencion_garantia_porcentaje: 5.00,
    retencion_garantia_monto: 585.00,
    penalidades_monto: 0.00,
    otras_deducciones_monto: 0.00,
    total_deducciones: 585.00,
    monto_neto: 11115.00,
    igv_porcentaje: 18.00,
    igv_monto: 2000.70,
    estado: 'APROBADA',
    fecha_presentacion: '2025-03-03',
    fecha_aprobacion: '2025-03-07',
    fecha_pago: '2025-03-15',
    dias_atraso: 0,
    supervisor_responsable: 'Carlos Alberto Ruiz',
    responsable_entidad: 'María González',
    actividades_realizadas: 'Supervisión continua de obras, control de calidad, verificación de metrados',
    observaciones_periodo: 'Periodo con 1 día de lluvia que impidió trabajos',
    motivos_dias_no_trabajados: '1 día por lluvia, 1 día feriado nacional',
    activo: true,
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-03-07T15:30:00Z'
  }
];

const mockPartidasDetalle: PartidaDetalle[] = [
  {
    id: 1,
    valorizacion_id: 1,
    partida_id: 1,
    metrado_anterior: 0.00,
    metrado_actual: 2500.00,
    metrado_acumulado: 2500.00,
    porcentaje_anterior: 0.00,
    porcentaje_actual: 100.00,
    porcentaje_acumulado: 100.00,
    monto_anterior: 0.00,
    monto_actual: 6250.00,
    monto_acumulado: 6250.00,
    fecha_medicion: '2025-02-28',
    responsable_medicion: 'María Elena Torres Rojas',
    metodo_medicion: 'TOPOGRAFICO',
    estado_medicion: 'APROBADO',
    observaciones_medicion: 'Trazo y replanteo completo según planos',
    activo: true,
    created_at: '2025-02-28T10:00:00Z',
    updated_at: '2025-03-05T14:00:00Z'
  },
  {
    id: 2,
    valorizacion_id: 1,
    partida_id: 2,
    metrado_anterior: 0.00,
    metrado_actual: 900.00,
    metrado_acumulado: 900.00,
    porcentaje_anterior: 0.00,
    porcentaje_actual: 50.00,
    porcentaje_acumulado: 50.00,
    monto_anterior: 0.00,
    monto_actual: 14220.00,
    monto_acumulado: 14220.00,
    fecha_medicion: '2025-02-28',
    responsable_medicion: 'Juan Carlos Mendoza Silva',
    metodo_medicion: 'MANUAL',
    estado_medicion: 'APROBADO',
    observaciones_medicion: 'Excavación ejecutada en 50% del metrado total',
    activo: true,
    created_at: '2025-02-28T10:00:00Z',
    updated_at: '2025-03-05T14:00:00Z'
  }
];

// =================================================================
// FUNCIONES DE UTILIDAD
// =================================================================

const formatearMoneda = (monto: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: CONFIG_MONEDA_PERUANA.decimales,
    maximumFractionDigits: CONFIG_MONEDA_PERUANA.decimales
  }).format(monto).replace('PEN', CONFIG_MONEDA_PERUANA.simbolo);
};

const calcularDiasEntreFechas = (fechaInicio: string, fechaFin: string): number => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diferencia = fin.getTime() - inicio.getTime();
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1;
};

const obtenerNormativaVigente = (fechaContrato: string): Normativa => {
  const fecha = new Date(fechaContrato);
  const normativa = mockNormativas.find(n => {
    const inicio = new Date(n.fecha_vigencia_inicio);
    const fin = n.fecha_vigencia_fin ? new Date(n.fecha_vigencia_fin) : new Date('2099-12-31');
    return fecha >= inicio && fecha <= fin && n.activo;
  });
  return normativa || mockNormativas[0];
};

// =================================================================
// HOOK PRINCIPAL
// =================================================================

export const useValorizaciones = () => {
  const [valorizacionesEjecucion, setValorizacionesEjecucion] = useState<ValorizacionEjecucion[]>([]);
  const [valorizacionesSupervision, setValorizacionesSupervision] = useState<ValorizacionSupervision[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =================================================================
  // FUNCIONES DE CARGA DE DATOS
  // =================================================================

  const cargarValorizaciones = useCallback(async (filtros?: FiltrosValorizacion) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let ejecucionFiltradas = [...mockValorizacionesEjecucion];
      let supervisionFiltradas = [...mockValorizacionesSupervision];
      
      if (filtros?.obra_id) {
        ejecucionFiltradas = ejecucionFiltradas.filter(v => v.obra_id === filtros.obra_id);
        supervisionFiltradas = supervisionFiltradas.filter(v => v.obra_id === filtros.obra_id);
      }
      
      if (filtros?.estado) {
        ejecucionFiltradas = ejecucionFiltradas.filter(v => v.estado === filtros.estado);
        supervisionFiltradas = supervisionFiltradas.filter(v => v.estado === filtros.estado);
      }
      
      if (filtros?.fecha_desde) {
        ejecucionFiltradas = ejecucionFiltradas.filter(v => v.periodo_inicio >= filtros.fecha_desde!);
        supervisionFiltradas = supervisionFiltradas.filter(v => v.periodo_inicio >= filtros.fecha_desde!);
      }
      
      if (filtros?.fecha_hasta) {
        ejecucionFiltradas = ejecucionFiltradas.filter(v => v.periodo_fin <= filtros.fecha_hasta!);
        supervisionFiltradas = supervisionFiltradas.filter(v => v.periodo_fin <= filtros.fecha_hasta!);
      }
      
      if (filtros?.solo_con_atraso) {
        ejecucionFiltradas = ejecucionFiltradas.filter(v => v.dias_atraso > 0);
      }
      
      setValorizacionesEjecucion(ejecucionFiltradas);
      setValorizacionesSupervision(supervisionFiltradas);
    } catch (err) {
      setError('Error al cargar valorizaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarPartidasPorObra = useCallback(async (obraId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const partidasObra = mockPartidas.filter(p => p.obra_id === obraId);
      setPartidas(partidasObra);
    } catch (err) {
      setError('Error al cargar partidas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // =================================================================
  // FUNCIONES DE CÁLCULO
  // =================================================================

  const calcularMontos = useCallback((
    partidasValorizadas: Array<{ partida_id: number; metrado_actual: number }>,
    deducciones: {
      adelanto_directo_porcentaje?: number;
      adelanto_materiales_porcentaje?: number;
      penalidades_monto?: number;
      otras_deducciones_monto?: number;
    },
    normativa?: Normativa
  ): CalculosValorizacion => {
    const norm = normativa || mockNormativas[0];
    const errores: string[] = [];
    const advertencias: string[] = [];

    // Calcular monto bruto desde partidas
    let monto_bruto = 0;
    let porcentaje_avance_fisico = 0;
    let metrado_total_contractual = 0;
    let metrado_total_ejecutado = 0;

    partidasValorizadas.forEach(pv => {
      const partida = partidas.find(p => p.id === pv.partida_id);
      if (partida) {
        const monto_partida = pv.metrado_actual * partida.precio_unitario;
        monto_bruto += monto_partida;
        
        metrado_total_contractual += partida.metrado_contractual;
        metrado_total_ejecutado += pv.metrado_actual;
        
        // Validar que no exceda metrado contractual (con 5% de tolerancia)
        if (pv.metrado_actual > partida.metrado_contractual * 1.05) {
          errores.push(`La partida ${partida.codigo_partida} excede el metrado contractual`);
        } else if (pv.metrado_actual > partida.metrado_contractual) {
          advertencias.push(`La partida ${partida.codigo_partida} está en tolerancia del 5%`);
        }
      }
    });

    // Calcular porcentaje de avance físico
    if (metrado_total_contractual > 0) {
      porcentaje_avance_fisico = (metrado_total_ejecutado / metrado_total_contractual) * 100;
    }

    // Validar deducciones contra límites de normativa
    const adelanto_directo_porcentaje = deducciones.adelanto_directo_porcentaje || 0;
    const adelanto_materiales_porcentaje = deducciones.adelanto_materiales_porcentaje || 0;

    if (adelanto_directo_porcentaje > norm.porcentaje_adelanto_directo_max) {
      errores.push(`El adelanto directo (${adelanto_directo_porcentaje}%) excede el máximo permitido (${norm.porcentaje_adelanto_directo_max}%)`);
    }

    if (adelanto_materiales_porcentaje > norm.porcentaje_adelanto_materiales_max) {
      errores.push(`El adelanto de materiales (${adelanto_materiales_porcentaje}%) excede el máximo permitido (${norm.porcentaje_adelanto_materiales_max}%)`);
    }

    // Calcular deducciones
    const adelanto_directo_monto = monto_bruto * adelanto_directo_porcentaje / 100;
    const adelanto_materiales_monto = monto_bruto * adelanto_materiales_porcentaje / 100;
    const retencion_garantia_monto = monto_bruto * norm.porcentaje_retencion_garantia / 100;
    const penalidades_monto = deducciones.penalidades_monto || 0;
    const otras_deducciones_monto = deducciones.otras_deducciones_monto || 0;

    const total_deducciones = adelanto_directo_monto + adelanto_materiales_monto + 
                             retencion_garantia_monto + penalidades_monto + otras_deducciones_monto;

    const monto_neto = monto_bruto - total_deducciones;
    const igv_monto = monto_neto * 0.18; // IGV 18%
    const monto_total_con_igv = monto_neto + igv_monto;

    if (monto_neto < 0) {
      errores.push('El monto neto no puede ser negativo');
    }

    return {
      monto_bruto,
      total_deducciones,
      monto_neto,
      igv_monto,
      monto_total_con_igv,
      porcentaje_avance_fisico,
      porcentaje_avance_economico: porcentaje_avance_fisico, // Simplificado
      errores_calculo: errores,
      advertencias
    };
  }, [partidas]);

  const validarValorizacion = useCallback((
    form: ValorizacionEjecucionForm,
    obra: Obra
  ): ValidacionValorizacion => {
    const errores: Array<{ campo: string; mensaje: string; tipo: 'error' | 'warning' }> = [];

    // Validar obra
    if (!form.obra_id) {
      errores.push({ campo: 'obra_id', mensaje: 'Debe seleccionar una obra', tipo: 'error' });
    }

    // Validar fechas
    if (!form.periodo_inicio || !form.periodo_fin) {
      errores.push({ campo: 'periodo', mensaje: 'Debe especificar el periodo de valorización', tipo: 'error' });
    } else {
      const inicio = new Date(form.periodo_inicio);
      const fin = new Date(form.periodo_fin);
      
      if (inicio > fin) {
        errores.push({ campo: 'periodo_fin', mensaje: 'La fecha fin no puede ser anterior al inicio', tipo: 'error' });
      }
      
      // Verificar que esté dentro del plazo de la obra
      const obraInicio = new Date(obra.fecha_inicio);
      const obraFin = new Date(obra.fecha_fin_prevista);
      
      if (inicio < obraInicio) {
        errores.push({ campo: 'periodo_inicio', mensaje: 'El periodo no puede ser anterior al inicio de la obra', tipo: 'error' });
      }
      
      if (fin > obraFin) {
        errores.push({ campo: 'periodo_fin', mensaje: 'El periodo no puede ser posterior a la fecha prevista de fin', tipo: 'warning' });
      }
    }

    // Validar partidas
    if (!form.partidas || form.partidas.length === 0) {
      errores.push({ campo: 'partidas', mensaje: 'Debe incluir al menos una partida', tipo: 'error' });
    } else {
      form.partidas.forEach((partida, index) => {
        if (partida.metrado_actual <= 0) {
          errores.push({ 
            campo: `partidas.${index}.metrado_actual`, 
            mensaje: 'El metrado debe ser mayor a cero', 
            tipo: 'error' 
          });
        }
      });
    }

    const tieneErrores = errores.some(e => e.tipo === 'error');

    return {
      valida: !tieneErrores,
      errores,
      puede_presentar: !tieneErrores,
      puede_aprobar: !tieneErrores && errores.length === 0
    };
  }, []);

  // =================================================================
  // FUNCIONES CRUD
  // =================================================================

  const crearValorizacionEjecucion = useCallback(async (
    form: ValorizacionEjecucionForm,
    obra: Obra
  ): Promise<ValorizacionEjecucion | null> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const normativa = obtenerNormativaVigente(obra.fecha_inicio);
      const validacion = validarValorizacion(form, obra);

      if (!validacion.valida) {
        const erroresTexto = validacion.errores
          .filter(e => e.tipo === 'error')
          .map(e => e.mensaje)
          .join(', ');
        throw new Error(`Errores de validación: ${erroresTexto}`);
      }

      // Obtener siguiente número de valorización
      const valorizacionesObra = mockValorizacionesEjecucion.filter(v => v.obra_id === form.obra_id);
      const siguienteNumero = Math.max(0, ...valorizacionesObra.map(v => v.numero_valorización)) + 1;

      // Calcular montos
      const calculos = calcularMontos(
        form.partidas.map(p => ({ partida_id: p.partida_id, metrado_actual: p.metrado_actual })),
        {
          adelanto_directo_porcentaje: form.adelanto_directo_porcentaje,
          adelanto_materiales_porcentaje: form.adelanto_materiales_porcentaje,
          penalidades_monto: form.penalidades_monto,
          otras_deducciones_monto: form.otras_deducciones_monto
        },
        normativa
      );

      if (calculos.errores_calculo.length > 0) {
        throw new Error(`Errores de cálculo: ${calculos.errores_calculo.join(', ')}`);
      }

      const nuevaValorizacion: ValorizacionEjecucion = {
        id: Math.max(...mockValorizacionesEjecucion.map(v => v.id)) + 1,
        obra_id: form.obra_id,
        normativa_id: normativa.id,
        numero_valorización: siguienteNumero,
        codigo_valorización: `${String(siguienteNumero).padStart(3, '0')}-${new Date(form.periodo_inicio).getFullYear()}-${String(new Date(form.periodo_inicio).getMonth() + 1).padStart(2, '0')}`,
        numero_expediente: form.numero_expediente,
        numero_expediente_siaf: form.numero_expediente_siaf,
        periodo_inicio: form.periodo_inicio,
        periodo_fin: form.periodo_fin,
        dias_periodo: calcularDiasEntreFechas(form.periodo_inicio, form.periodo_fin),
        monto_bruto: calculos.monto_bruto,
        monto_neto: calculos.monto_neto,
        porcentaje_avance_fisico: calculos.porcentaje_avance_fisico,
        monto_avance_economico: calculos.monto_bruto,
        porcentaje_avance_fisico_anterior: 0, // TODO: Calcular desde valorizaciones anteriores
        monto_avance_economico_anterior: 0,
        porcentaje_avance_fisico_total: calculos.porcentaje_avance_fisico,
        monto_avance_economico_total: calculos.monto_bruto,
        adelanto_directo_porcentaje: form.adelanto_directo_porcentaje || 0,
        adelanto_directo_monto: calculos.monto_bruto * (form.adelanto_directo_porcentaje || 0) / 100,
        adelanto_materiales_porcentaje: form.adelanto_materiales_porcentaje || 0,
        adelanto_materiales_monto: calculos.monto_bruto * (form.adelanto_materiales_porcentaje || 0) / 100,
        penalidades_monto: form.penalidades_monto || 0,
        retencion_garantia_porcentaje: normativa.porcentaje_retencion_garantia,
        retencion_garantia_monto: calculos.monto_bruto * normativa.porcentaje_retencion_garantia / 100,
        otras_deducciones_monto: form.otras_deducciones_monto || 0,
        total_deducciones: calculos.total_deducciones,
        igv_porcentaje: 18.00,
        igv_monto: calculos.igv_monto,
        estado: 'BORRADOR',
        dias_atraso: 0,
        residente_obra: form.residente_obra,
        supervisor_obra: form.supervisor_obra,
        observaciones_residente: form.observaciones_residente,
        observaciones_supervisor: form.observaciones_supervisor,
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      mockValorizacionesEjecucion.push(nuevaValorizacion);

      // Crear detalles de partidas
      form.partidas.forEach(partidaForm => {
        const partida = partidas.find(p => p.id === partidaForm.partida_id);
        if (partida) {
          const nuevoDetalle: PartidaDetalle = {
            id: Math.max(0, ...mockPartidasDetalle.map(pd => pd.id)) + 1,
            valorizacion_id: nuevaValorizacion.id,
            partida_id: partidaForm.partida_id,
            metrado_anterior: 0, // TODO: Calcular desde valorizaciones anteriores
            metrado_actual: partidaForm.metrado_actual,
            metrado_acumulado: partidaForm.metrado_actual,
            porcentaje_anterior: 0,
            porcentaje_actual: (partidaForm.metrado_actual / partida.metrado_contractual) * 100,
            porcentaje_acumulado: (partidaForm.metrado_actual / partida.metrado_contractual) * 100,
            monto_anterior: 0,
            monto_actual: partidaForm.metrado_actual * partida.precio_unitario,
            monto_acumulado: partidaForm.metrado_actual * partida.precio_unitario,
            fecha_medicion: partidaForm.fecha_medicion,
            responsable_medicion: partidaForm.responsable_medicion,
            metodo_medicion: partidaForm.metodo_medicion,
            estado_medicion: 'PENDIENTE',
            observaciones_medicion: partidaForm.observaciones_medicion,
            activo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          mockPartidasDetalle.push(nuevoDetalle);
        }
      });

      setValorizacionesEjecucion([...mockValorizacionesEjecucion]);
      return nuevaValorizacion;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear valorización';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [partidas, calcularMontos, validarValorizacion]);

  const crearValorizacionSupervision = useCallback(async (
    form: ValorizacionSupervisionForm,
    obra: Obra,
    valorizacionEjecucionId: number
  ): Promise<ValorizacionSupervision | null> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const normativa = obtenerNormativaVigente(obra.fecha_inicio);
      const diasPeriodo = calcularDiasEntreFechas(form.periodo_inicio, form.periodo_fin);

      // Validaciones básicas
      if (form.dias_efectivos_trabajados > diasPeriodo) {
        throw new Error('Los días trabajados no pueden exceder los días del periodo');
      }

      const diasNoTrabajados = (form.dias_lluvia || 0) + (form.dias_feriados || 0) + 
                              (form.dias_suspension_obra || 0) + (form.dias_otros_motivos || 0);

      if (form.dias_efectivos_trabajados + diasNoTrabajados > diasPeriodo) {
        throw new Error('La suma de días trabajados y no trabajados excede el periodo');
      }

      // Obtener tarifa de supervisión del contrato (mock)
      const tarifaSupervision = obra.monto_supervision / obra.plazo_ejecucion_dias;

      const montoBruto = form.dias_efectivos_trabajados * tarifaSupervision;
      const retencionMonto = montoBruto * normativa.porcentaje_retencion_garantia / 100;
      const totalDeducciones = retencionMonto + (form.penalidades_monto || 0) + (form.otras_deducciones_monto || 0);
      const montoNeto = montoBruto - totalDeducciones;
      const igvMonto = montoNeto * 0.18;

      const siguienteNumero = Math.max(0, ...mockValorizacionesSupervision
        .filter(v => v.obra_id === form.obra_id)
        .map(v => v.numero_valorización)) + 1;

      const nuevaValorizacion: ValorizacionSupervision = {
        id: Math.max(...mockValorizacionesSupervision.map(v => v.id)) + 1,
        obra_id: form.obra_id,
        valorizacion_ejecucion_id: valorizacionEjecucionId,
        normativa_id: normativa.id,
        numero_valorización: siguienteNumero,
        numero_expediente: form.numero_expediente,
        numero_expediente_siaf: form.numero_expediente_siaf,
        periodo_inicio: form.periodo_inicio,
        periodo_fin: form.periodo_fin,
        dias_calendario_periodo: diasPeriodo,
        dias_efectivos_trabajados: form.dias_efectivos_trabajados,
        dias_no_trabajados: diasNoTrabajados,
        dias_lluvia: form.dias_lluvia || 0,
        dias_feriados: form.dias_feriados || 0,
        dias_suspension_obra: form.dias_suspension_obra || 0,
        dias_otros_motivos: form.dias_otros_motivos || 0,
        tarifa_diaria_supervision: tarifaSupervision,
        monto_bruto: montoBruto,
        retencion_garantia_porcentaje: normativa.porcentaje_retencion_garantia,
        retencion_garantia_monto: retencionMonto,
        penalidades_monto: form.penalidades_monto || 0,
        otras_deducciones_monto: form.otras_deducciones_monto || 0,
        total_deducciones: totalDeducciones,
        monto_neto: montoNeto,
        igv_porcentaje: 18.00,
        igv_monto: igvMonto,
        estado: 'BORRADOR',
        dias_atraso: 0,
        supervisor_responsable: form.supervisor_responsable,
        responsable_entidad: form.supervisor_responsable, // Temporal
        actividades_realizadas: form.actividades_realizadas,
        observaciones_periodo: form.observaciones_periodo,
        motivos_dias_no_trabajados: form.motivos_dias_no_trabajados,
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      mockValorizacionesSupervision.push(nuevaValorizacion);
      setValorizacionesSupervision([...mockValorizacionesSupervision]);
      return nuevaValorizacion;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear valorización de supervisión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cambiarEstadoValorizacion = useCallback(async (
    id: number,
    nuevoEstado: EstadoValorizacionEjecucion,
    observaciones?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const valorizacionIndex = mockValorizacionesEjecucion.findIndex(v => v.id === id);
      if (valorizacionIndex === -1) {
        throw new Error('Valorización no encontrada');
      }

      const valorizacion = { ...mockValorizacionesEjecucion[valorizacionIndex] };
      const fechaActual = new Date().toISOString().split('T')[0];

      valorizacion.estado = nuevoEstado;
      valorizacion.updated_at = new Date().toISOString();

      // Actualizar fechas según el estado
      switch (nuevoEstado) {
        case 'PRESENTADA':
          valorizacion.fecha_presentacion = fechaActual;
          break;
        case 'EN_REVISION':
          valorizacion.fecha_revision = fechaActual;
          break;
        case 'OBSERVADA':
          valorizacion.fecha_observacion = fechaActual;
          valorizacion.observaciones_entidad = observaciones;
          break;
        case 'APROBADA':
          valorizacion.fecha_aprobacion = fechaActual;
          // Calcular fecha límite de pago
          const normativa = mockNormativas.find(n => n.id === valorizacion.normativa_id);
          if (normativa) {
            const fechaAprobacion = new Date(fechaActual);
            fechaAprobacion.setDate(fechaAprobacion.getDate() + normativa.dias_pago_valorización);
            valorizacion.fecha_limite_pago = fechaAprobacion.toISOString().split('T')[0];
          }
          break;
        case 'PAGADA':
          valorizacion.fecha_pago = fechaActual;
          break;
        case 'RECHAZADA':
          valorizacion.motivo_rechazo = observaciones;
          break;
      }

      mockValorizacionesEjecucion[valorizacionIndex] = valorizacion;
      setValorizacionesEjecucion([...mockValorizacionesEjecucion]);
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // =================================================================
  // ESTADÍSTICAS Y REPORTES
  // =================================================================

  const obtenerEstadisticas = useCallback(async (): Promise<EstadisticasValorizaciones> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const estadisticas: EstadisticasValorizaciones = {
      total_valorizaciones_ejecucion: mockValorizacionesEjecucion.length,
      total_valorizaciones_supervision: mockValorizacionesSupervision.length,
      monto_total_valorizado: mockValorizacionesEjecucion.reduce((sum, v) => sum + v.monto_bruto, 0),
      monto_total_pagado: mockValorizacionesEjecucion
        .filter(v => v.estado === 'PAGADA')
        .reduce((sum, v) => sum + v.monto_neto, 0),
      valorizaciones_por_estado: mockValorizacionesEjecucion.reduce((acc, v) => {
        acc[v.estado] = (acc[v.estado] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      valorizaciones_por_mes: [],
      top_obras_valorizadas: [],
      promedio_dias_aprobacion: 0,
      promedio_dias_pago: 0,
      valorizaciones_con_atraso: mockValorizacionesEjecucion.filter(v => v.dias_atraso > 0).length
    };

    return estadisticas;
  }, []);

  // =================================================================
  // EFECTOS
  // =================================================================

  useEffect(() => {
    cargarValorizaciones();
  }, [cargarValorizaciones]);

  // =================================================================
  // VALORES CALCULADOS
  // =================================================================

  const estadisticasDashboard = useMemo(() => {
    const totalValorizado = valorizacionesEjecucion.reduce((sum, v) => sum + v.monto_bruto, 0);
    const totalPagado = valorizacionesEjecucion
      .filter(v => v.estado === 'PAGADA')
      .reduce((sum, v) => sum + v.monto_neto, 0);
    
    const estadosCounts = valorizacionesEjecucion.reduce((acc, v) => {
      acc[v.estado] = (acc[v.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalValorizado: formatearMoneda(totalValorizado),
      totalPagado: formatearMoneda(totalPagado),
      pendientes: estadosCounts['BORRADOR'] || 0 + estadosCounts['PRESENTADA'] || 0 + estadosCounts['EN_REVISION'] || 0,
      aprobadas: estadosCounts['APROBADA'] || 0,
      pagadas: estadosCounts['PAGADA'] || 0,
      conAtraso: valorizacionesEjecucion.filter(v => v.dias_atraso > 0).length
    };
  }, [valorizacionesEjecucion]);

  return {
    // Estados
    valorizacionesEjecucion,
    valorizacionesSupervision,
    partidas,
    loading,
    error,
    estadisticasDashboard,
    
    // Funciones de carga
    cargarValorizaciones,
    cargarPartidasPorObra,
    
    // Funciones CRUD
    crearValorizacionEjecucion,
    crearValorizacionSupervision,
    cambiarEstadoValorizacion,
    
    // Funciones de cálculo
    calcularMontos,
    validarValorizacion,
    
    // Estadísticas
    obtenerEstadisticas,
    
    // Utilities
    formatearMoneda,
    obtenerNormativaVigente
  };
};

export default useValorizaciones;