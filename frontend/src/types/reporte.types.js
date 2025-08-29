// =================================================================
// TIPOS TYPESCRIPT PARA MÓDULO DE REPORTES PROFESIONAL
// Sistema de Valorizaciones - Frontend
// =================================================================
// =================================================================
// CONSTANTES Y CONFIGURACIONES
// =================================================================
export const TIPOS_REPORTE = {
    VALORIZACION_MENSUAL: 'Reporte de Valorización Mensual',
    AVANCE_OBRA: 'Reporte de Avance de Obra',
    FINANCIERO_CONSOLIDADO: 'Reporte Financiero Consolidado',
    CONTROL_CONTRACTUAL: 'Reporte de Control Contractual',
    GERENCIAL_EJECUTIVO: 'Reporte Gerencial Ejecutivo'
};
export const ESTADOS_REPORTE = {
    GENERANDO: 'Generando',
    COMPLETADO: 'Completado',
    ERROR: 'Error',
    CANCELADO: 'Cancelado'
};
export const FORMATOS_EXPORTACION = {
    PDF: 'PDF',
    EXCEL: 'Excel',
    WORD: 'Word',
    CSV: 'CSV'
};
export const PERIODOS_REPORTE = {
    MENSUAL: 'Mensual',
    TRIMESTRAL: 'Trimestral',
    SEMESTRAL: 'Semestral',
    ANUAL: 'Anual',
    PERSONALIZADO: 'Personalizado'
};
export const COLORES_GRAFICOS = {
    PRIMARY: ['#3B82F6', '#1E40AF', '#1D4ED8', '#2563EB'],
    SUCCESS: ['#10B981', '#059669', '#047857', '#065F46'],
    WARNING: ['#F59E0B', '#D97706', '#B45309', '#92400E'],
    DANGER: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B'],
    INFO: ['#06B6D4', '#0891B2', '#0E7490', '#155E75'],
    NEUTRAL: ['#6B7280', '#4B5563', '#374151', '#1F2937']
};
export const CONFIGURACION_DEFECTO_EXPORTACION = {
    formato: 'PDF',
    nombreArchivo: '',
    incluirPortada: true,
    incluirIndice: true,
    incluirGraficos: true,
    incluirAnexos: false,
    configuracionPDF: {
        orientacion: 'portrait',
        tamaño: 'A4',
        margen: 20,
        fuente: 'Arial',
        tamañoFuente: 12,
        numerarPaginas: true
    },
    configuracionExcel: {
        incluirFormulas: true,
        incluirGraficos: true,
        protegerHojas: false
    }
};
export default {};
