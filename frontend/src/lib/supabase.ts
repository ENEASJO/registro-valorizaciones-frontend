import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Las variables de entorno de Supabase no están configuradas')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Tipos para la base de datos
export type Database = {
  public: {
    Tables: {
      empresas: {
        Row: {
          id: string
          ruc: string
          razon_social: string
          tipo_empresa: 'ejecutora' | 'supervisora' | 'consultora'
          estado: 'activo' | 'inactivo'
          direccion: string | null
          telefono: string | null
          email: string | null
          representante_legal: string | null
          fecha_constitucion: string | null
          capital_social: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ruc: string
          razon_social: string
          tipo_empresa: 'ejecutora' | 'supervisora' | 'consultora'
          estado?: 'activo' | 'inactivo'
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          representante_legal?: string | null
          fecha_constitucion?: string | null
          capital_social?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ruc?: string
          razon_social?: string
          tipo_empresa?: 'ejecutora' | 'supervisora' | 'consultora'
          estado?: 'activo' | 'inactivo'
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          representante_legal?: string | null
          fecha_constitucion?: string | null
          capital_social?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      obras: {
        Row: {
          id: string
          nombre: string
          codigo: string
          descripcion: string | null
          monto_contrato: number
          fecha_inicio: string
          fecha_fin: string | null
          estado: 'planificada' | 'en_ejecucion' | 'suspendida' | 'terminada'
          empresa_ejecutora_id: string
          empresa_supervisora_id: string | null
          ubicacion: string | null
          tipo_obra: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          codigo: string
          descripcion?: string | null
          monto_contrato: number
          fecha_inicio: string
          fecha_fin?: string | null
          estado?: 'planificada' | 'en_ejecucion' | 'suspendida' | 'terminada'
          empresa_ejecutora_id: string
          empresa_supervisora_id?: string | null
          ubicacion?: string | null
          tipo_obra?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          codigo?: string
          descripcion?: string | null
          monto_contrato?: number
          fecha_inicio?: string
          fecha_fin?: string | null
          estado?: 'planificada' | 'en_ejecucion' | 'suspendida' | 'terminada'
          empresa_ejecutora_id?: string
          empresa_supervisora_id?: string | null
          ubicacion?: string | null
          tipo_obra?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      valorizaciones: {
        Row: {
          id: string
          obra_id: string
          numero: number
          periodo: string
          tipo: 'ejecucion' | 'supervision'
          monto_ejecutado: number
          monto_acumulado: number
          porcentaje_avance: number
          estado: 'borrador' | 'presentada' | 'aprobada' | 'rechazada'
          fecha_presentacion: string | null
          fecha_aprobacion: string | null
          observaciones: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          obra_id: string
          numero: number
          periodo: string
          tipo: 'ejecucion' | 'supervision'
          monto_ejecutado: number
          monto_acumulado: number
          porcentaje_avance: number
          estado?: 'borrador' | 'presentada' | 'aprobada' | 'rechazada'
          fecha_presentacion?: string | null
          fecha_aprobacion?: string | null
          observaciones?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          obra_id?: string
          numero?: number
          periodo?: string
          tipo?: 'ejecucion' | 'supervision'
          monto_ejecutado?: number
          monto_acumulado?: number
          porcentaje_avance?: number
          estado?: 'borrador' | 'presentada' | 'aprobada' | 'rechazada'
          fecha_presentacion?: string | null
          fecha_aprobacion?: string | null
          observaciones?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}