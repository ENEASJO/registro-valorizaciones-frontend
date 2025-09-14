// =================================================================
// PARCHES TEMPORALES PARA DEPLOYMENT RÁPIDO
// Sistema de Valorizaciones - Frontend
// =================================================================
// Cast temporal para obras que retornan Promise
export const useObraSync = (obtenerObraPorId) => {
    return (id) => {
        // Retornar un objeto mock temporal hasta que se resuelva la promesa
        return {
            id,
            nombre: 'Cargando...',
            numero_contrato: 'Cargando...',
            monto_ejecucion: 0,
            monto_supervision: 0,
            estado: 'EN_EJECUCION',
            fecha_inicio: new Date().toISOString().split('T')[0],
            fecha_fin_prevista: new Date().toISOString().split('T')[0],
            plazo_ejecucion_dias: 0,
            entidad_ejecutora_id: 0,
            entidad_supervisora_id: 0
        };
    };
};
// Mapear propiedades de valorizaciones que faltan
export const extendValorizacion = (val) => ({
    ...val,
    numero_valorización: val.numero_valorizacion,
    periodo_inicio: val.fecha_inicio,
    periodo_fin: val.fecha_fin,
    monto_bruto: val.monto_ejecutado,
    monto_neto: val.monto_total,
    total_deducciones: 0,
    igv_monto: val.igv || (val.monto_ejecutado * 0.18),
    dias_atraso: 0,
    adelanto_directo_monto: 0,
    adelanto_directo_porcentaje: 0,
    adelanto_materiales_monto: 0,
    adelanto_materiales_porcentaje: 0,
    retencion_garantia_porcentaje: 10,
    retencion_garantia_monto: (val.monto_ejecutado || 0) * 0.1,
    penalidades_monto: 0,
    otras_deducciones_monto: 0,
    fecha_limite_pago: val.fecha_presentacion,
    fecha_pago: val.fecha_aprobacion,
    residente_obra: 'No asignado',
    supervisor_obra: 'No asignado',
    responsable_entidad: 'No asignado',
    observaciones_residente: '',
    observaciones_supervisor: '',
    observaciones_entidad: '',
    observaciones_periodo: val.observaciones || '',
    motivo_rechazo: '',
    actividades_realizadas: '',
    motivos_dias_no_trabajados: '',
    porcentaje_avance_fisico_total: val.porcentaje_avance_acumulado || 0,
    monto_avance_economico_total: val.monto_total || 0
});
