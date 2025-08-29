import { supabase } from '../lib/supabase';
// ==================== EMPRESAS ====================
export const empresasService = {
    // Obtener todas las empresas
    async getAll(tipo) {
        let query = supabase
            .from('empresas')
            .select('*')
            .order('razon_social', { ascending: true });
        if (tipo) {
            query = query.eq('tipo_empresa', tipo);
        }
        const { data, error } = await query;
        if (error) {
            console.error('Error obteniendo empresas:', error);
            throw new Error(error.message);
        }
        return data || [];
    },
    // Obtener empresa por ID
    async getById(id) {
        const { data, error } = await supabase
            .from('empresas')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116') {
            console.error('Error obteniendo empresa:', error);
            throw new Error(error.message);
        }
        return data;
    },
    // Buscar empresa por RUC
    async getByRuc(ruc) {
        const { data, error } = await supabase
            .from('empresas')
            .select('*')
            .eq('ruc', ruc)
            .single();
        if (error && error.code !== 'PGRST116') {
            console.error('Error buscando empresa por RUC:', error);
            throw new Error(error.message);
        }
        return data;
    },
    // Crear nueva empresa
    async create(empresa) {
        const { data, error } = await supabase
            .from('empresas')
            .insert(empresa)
            .select()
            .single();
        if (error) {
            console.error('Error creando empresa:', error);
            throw new Error(error.message);
        }
        return data;
    },
    // Actualizar empresa
    async update(id, empresa) {
        const { data, error } = await supabase
            .from('empresas')
            .update({ ...empresa, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error actualizando empresa:', error);
            throw new Error(error.message);
        }
        return data;
    },
    // Eliminar empresa
    async delete(id) {
        const { error } = await supabase
            .from('empresas')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error eliminando empresa:', error);
            throw new Error(error.message);
        }
    },
    // Buscar empresas por texto
    async search(searchText) {
        const { data, error } = await supabase
            .from('empresas')
            .select('*')
            .or(`ruc.ilike.%${searchText}%,razon_social.ilike.%${searchText}%`)
            .order('razon_social', { ascending: true });
        if (error) {
            console.error('Error buscando empresas:', error);
            throw new Error(error.message);
        }
        return data || [];
    }
};
// ==================== OBRAS ====================
export const obrasService = {
    // Obtener todas las obras
    async getAll() {
        const { data, error } = await supabase
            .from('obras')
            .select(`
        *,
        empresa_ejecutora:empresas!empresa_ejecutora_id(*),
        empresa_supervisora:empresas!empresa_supervisora_id(*)
      `)
            .order('fecha_inicio', { ascending: false });
        if (error) {
            console.error('Error obteniendo obras:', error);
            throw new Error(error.message);
        }
        return data || [];
    },
    // Obtener obra por ID
    async getById(id) {
        const { data, error } = await supabase
            .from('obras')
            .select(`
        *,
        empresa_ejecutora:empresas!empresa_ejecutora_id(*),
        empresa_supervisora:empresas!empresa_supervisora_id(*)
      `)
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116') {
            console.error('Error obteniendo obra:', error);
            throw new Error(error.message);
        }
        return data;
    },
    // Crear nueva obra
    async create(obra) {
        const { data, error } = await supabase
            .from('obras')
            .insert(obra)
            .select()
            .single();
        if (error) {
            console.error('Error creando obra:', error);
            throw new Error(error.message);
        }
        return data;
    },
    // Actualizar obra
    async update(id, obra) {
        const { data, error } = await supabase
            .from('obras')
            .update({ ...obra, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error actualizando obra:', error);
            throw new Error(error.message);
        }
        return data;
    },
    // Eliminar obra
    async delete(id) {
        const { error } = await supabase
            .from('obras')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error eliminando obra:', error);
            throw new Error(error.message);
        }
    }
};
// ==================== VALORIZACIONES ====================
export const valorizacionesService = {
    // Obtener todas las valorizaciones
    async getAll() {
        const { data, error } = await supabase
            .from('valorizaciones')
            .select(`
        *,
        obra:obras(*)
      `)
            .order('periodo', { ascending: false });
        if (error) {
            console.error('Error obteniendo valorizaciones:', error);
            throw new Error(error.message);
        }
        return data || [];
    },
    // Obtener valorizaciones por obra
    async getByObra(obraId) {
        const { data, error } = await supabase
            .from('valorizaciones')
            .select('*')
            .eq('obra_id', obraId)
            .order('numero', { ascending: true });
        if (error) {
            console.error('Error obteniendo valorizaciones por obra:', error);
            throw new Error(error.message);
        }
        return data || [];
    },
    // Obtener valorización por ID
    async getById(id) {
        const { data, error } = await supabase
            .from('valorizaciones')
            .select(`
        *,
        obra:obras(*)
      `)
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116') {
            console.error('Error obteniendo valorización:', error);
            throw new Error(error.message);
        }
        return data;
    },
    // Crear nueva valorización
    async create(valorizacion) {
        const { data, error } = await supabase
            .from('valorizaciones')
            .insert(valorizacion)
            .select()
            .single();
        if (error) {
            console.error('Error creando valorización:', error);
            throw new Error(error.message);
        }
        return data;
    },
    // Actualizar valorización
    async update(id, valorizacion) {
        const { data, error } = await supabase
            .from('valorizaciones')
            .update({ ...valorizacion, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error actualizando valorización:', error);
            throw new Error(error.message);
        }
        return data;
    },
    // Eliminar valorización
    async delete(id) {
        const { error } = await supabase
            .from('valorizaciones')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error eliminando valorización:', error);
            throw new Error(error.message);
        }
    }
};
// ==================== CONSULTA RUC (INTEGRACIÓN EXTERNA) ====================
export const consultaRucService = {
    // Consultar RUC en SUNAT (usando API externa)
    async consultarRuc(ruc) {
        try {
            // Primero verificar si ya existe en la base de datos
            const empresaExistente = await empresasService.getByRuc(ruc);
            if (empresaExistente) {
                return {
                    success: true,
                    data: empresaExistente,
                    source: 'database'
                };
            }
            // Si no existe, consultar API externa (puedes usar cualquier API de consulta RUC)
            const response = await fetch(`https://api.apis.net.pe/v1/ruc?numero=${ruc}`, {
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_APIS_NET_PE_TOKEN || ''}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error en consulta RUC: ${response.status}`);
            }
            const data = await response.json();
            return {
                success: true,
                data: {
                    ruc: data.numeroDocumento,
                    razon_social: data.nombre,
                    direccion: data.direccion,
                    estado: data.estado === 'ACTIVO' ? 'activo' : 'inactivo',
                    fecha_constitucion: data.fechaInscripcion,
                },
                source: 'external'
            };
        }
        catch (error) {
            console.error('Error consultando RUC:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            };
        }
    }
};
