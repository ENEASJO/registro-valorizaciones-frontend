// =================================================================
// TIPOS TYPESCRIPT PARA MÓDULO DE OBRAS
// Sistema de Valorizaciones - Frontend
// =================================================================
// =================================================================
// CONSTANTES Y CONFIGURACIONES
// =================================================================
export const ESTADOS_OBRA = {
    REGISTRADA: 'Registrada',
    EN_EJECUCION: 'En Ejecución',
    PARALIZADA: 'Paralizada',
    TERMINADA: 'Terminada',
    LIQUIDADA: 'Liquidada',
    CANCELADA: 'Cancelada'
};
export const ESTADOS_VALORIZACION = {
    PROGRAMADA: 'Programada',
    EN_PROCESO: 'En Proceso',
    APROBADA: 'Aprobada',
    PAGADA: 'Pagada'
};
export const TIPOS_OBRA = {
    CARRETERA: 'Carretera',
    EDIFICACION: 'Edificación',
    SANEAMIENTO: 'Saneamiento',
    ELECTRICIDAD: 'Electricidad',
    PUENTE: 'Puente',
    VEREDAS_PISTAS: 'Veredas y Pistas',
    PARQUES_JARDINES: 'Parques y Jardines',
    DRENAJE_PLUVIAL: 'Drenaje Pluvial',
    OTROS: 'Otros'
};
export const MODALIDADES_EJECUCION = {
    ADMINISTRACION_DIRECTA: 'Administración Directa',
    CONTRATA: 'Contrata',
    ENCARGO: 'Encargo',
    CONVENIO: 'Convenio'
};
export const SISTEMAS_CONTRATACION = {
    SUMA_ALZADA: 'A Suma Alzada (monto fijo global)',
    PRECIOS_UNITARIOS: 'Por Precios Unitarios (cantidades × precios unitarios)',
    TARIFAS: 'Por Tarifas (tarifa por unidad de tiempo)',
    PORCENTAJE_MONTO: 'Por Porcentaje del monto contratado (% del valor ejecutado)',
    LLAVE_EN_MANO: 'Llave en Mano (Design-Build)'
};
// Leyes de contratación pública peruana
export const LEYES_CONTRATACION = {
    LEY_30225: 'Ley N° 30225 (antes del 22/04/2025)',
    LEY_32069: 'Ley N° 32069 (desde el 22/04/2025)'
};
// Procedimientos de selección según Ley 30225
export const PROCEDIMIENTOS_LEY_30225 = {
    LICITACION_PUBLICA: 'Licitación Pública',
    CONCURSO_PUBLICO: 'Concurso Público',
    ADJUDICACION_SIMPLIFICADA: 'Adjudicación Simplificada',
    CONTRATACION_DIRECTA: 'Contratación Directa',
    SUBASTA_INVERSA_ELECTRONICA: 'Subasta Inversa Electrónica',
    COMPARACION_PRECIOS: 'Comparación de Precios',
    SELECCION_CONSULTORES_INDIVIDUALES: 'Selección de Consultores Individuales',
    CATALOGO_ELECTRONICO_ACUERDOS_MARCO: 'Catálogo Electrónico de Acuerdos Marco'
};
// Procedimientos de selección según Ley 32069
export const PROCEDIMIENTOS_LEY_32069 = {
    LICITACION_PUBLICA: 'Licitación Pública',
    CONCURSO_PUBLICO: 'Concurso Público',
    COMPARACION_PRECIOS: 'Comparación de Precios',
    SUBASTA_INVERSA_ELECTRONICA: 'Subasta Inversa Electrónica',
    CONTRATACION_DIRECTA: 'Contratación Directa',
    SELECCION_CONSULTORES_INDIVIDUALES: 'Selección de Consultores Individuales',
    COMPRAS_CENTRALIZADAS: 'Compras Centralizadas',
    COMPRAS_CORPORATIVAS: 'Compras Corporativas',
    COMPRAS_CENTRALIZADAS_EMERGENCIA: 'Compras Centralizadas de Emergencia'
};
// Tooltips explicativos para sistemas de contratación
export const TOOLTIPS_SISTEMAS_CONTRATACION = {
    SUMA_ALZADA: 'El contratista se compromete a ejecutar la obra por un monto fijo e invariable, asumiendo los riesgos de variaciones en costos.',
    PRECIOS_UNITARIOS: 'Se paga según las cantidades realmente ejecutadas multiplicadas por precios unitarios predeterminados.',
    TARIFAS: 'El pago se realiza según una tarifa por unidad de tiempo (hora, día, mes) de servicios prestados.',
    PORCENTAJE_MONTO: 'El pago corresponde a un porcentaje del valor de la obra ejecutada, común en supervisión.',
    LLAVE_EN_MANO: 'El contratista se encarga del diseño y construcción completa, entregando la obra funcionando.'
};
// Configuración para validación de número de contrato
export const CONFIG_NUMERO_CONTRATO = {
    patron: /^N\.º\s+\d{1,3}-\d{4}-MDSM\/GM$/,
    formato: 'N.º XX-YYYY-MDSM/GM',
    ejemplo: 'N.º 01-2025-MDSM/GM',
    descripcion: 'Formato: N.º [número]-[año]-MDSM/GM'
};
// Configuración para formateo de moneda peruana
export const CONFIG_MONEDA = {
    simbolo: 'S/',
    decimales: 2,
    separador_miles: ',',
    separador_decimal: '.'
};
export default {};
