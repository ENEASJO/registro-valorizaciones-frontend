// =================================================================
// TIPOS TYPESCRIPT PARA MÓDULO DE VALORIZACIONES
// Sistema de Valorizaciones - Frontend
// Normativa: Ley N° 30225 (anterior) y Ley N° 32069 (desde 22/04/2025)
// =================================================================
// =================================================================
// CONSTANTES Y MAPEOS
// =================================================================
export const ESTADOS_VALORIZACION_EJECUCION = {
    BORRADOR: 'Borrador',
    PRESENTADA: 'Presentada',
    EN_REVISION: 'En Revisión',
    OBSERVADA: 'Observada',
    APROBADA: 'Aprobada',
    PAGADA: 'Pagada',
    RECHAZADA: 'Rechazada'
};
export const ESTADOS_VALORIZACION_SUPERVISION = {
    BORRADOR: 'Borrador',
    PRESENTADA: 'Presentada',
    APROBADA: 'Aprobada',
    PAGADA: 'Pagada',
    RECHAZADA: 'Rechazada'
};
export const ESTADOS_PARTIDA = {
    PENDIENTE: 'Pendiente',
    MEDIDO: 'Medido',
    VERIFICADO: 'Verificado',
    APROBADO: 'Aprobado',
    RECHAZADO: 'Rechazado'
};
export const TIPOS_DOCUMENTO_VALORIZACION = {
    METRADO: 'Metrado',
    PANEL_FOTOGRAFICO: 'Panel Fotográfico',
    PLANO_REPLANTEO: 'Plano de Replanteo',
    INFORME_CALIDAD: 'Informe de Calidad',
    CERTIFICADO_CALIDAD: 'Certificado de Calidad',
    COMPROBANTE_PAGO: 'Comprobante de Pago',
    OTROS: 'Otros'
};
export const METODOS_MEDICION = {
    TOPOGRAFICO: 'Topográfico',
    MANUAL: 'Manual',
    ESTIMADO: 'Estimado',
    CALCULO: 'Cálculo',
    OTROS: 'Otros'
};
// Configuración para formateo de moneda peruana
export const CONFIG_MONEDA_PERUANA = {
    simbolo: 'S/',
    decimales: 2,
    separador_miles: ',',
    separador_decimal: '.'
};
export default {};
