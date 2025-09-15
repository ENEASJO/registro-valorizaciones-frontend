/**
 * Tipos compartidos entre frontend y backend
 * Este archivo debe mantenerse sincronizado en ambos proyectos
 */

export interface ApiEmpresaResponse {
  id: string;  // Siempre string para UUIDs
  codigo: string;
  ruc: string;
  razon_social: string;
  nombre_comercial?: string;
  email?: string;
  telefono?: string;
  celular?: string;
  direccion?: string;
  representante_legal?: string;
  dni_representante?: string;
  estado: string;
  tipo_empresa: string;
  categoria_contratista?: string;
  especialidades?: string[];
  representantes: ApiRepresentanteResponse[];
  total_representantes: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiRepresentanteResponse {
  id: string;  // Siempre string para UUIDs
  nombre: string;
  cargo: string;
  numero_documento: string;
  tipo_documento?: string;
  fuente?: string;
  participacion?: string;
  fecha_desde?: string;
  es_principal: boolean;
  estado: string;
  created_at: string;
}

export interface ApiErrorResponse {
  detail: string;
  error_type?: string;
  timestamp?: string;
  path?: string;
}

// Validadores
export function validateEmpresaResponse(data: any): data is ApiEmpresaResponse {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&  // ID debe ser string
    typeof data.codigo === 'string' &&
    typeof data.ruc === 'string' &&
    typeof data.razon_social === 'string' &&
    Array.isArray(data.representantes) &&
    data.representantes.every((rep: any) => typeof rep.id === 'string')  // Todos los representantes deben tener ID string
  );
}

export function validateRepresentanteResponse(data: any): data is ApiRepresentanteResponse {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&  // ID debe ser string
    typeof data.nombre === 'string' &&
    typeof data.cargo === 'string' &&
    typeof data.numero_documento === 'string'
  );
}