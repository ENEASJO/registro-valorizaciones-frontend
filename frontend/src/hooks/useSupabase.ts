import { useState, useEffect } from 'react'
import { empresasService, obrasService, valorizacionesService, consultaRucService } from '../services/supabaseService'
import type { 
  EmpresaDB, 
  ObraDB, 
  ValorizacionDB,
  FormularioEmpresaSupabase,
  FormularioObraSupabase,
  FormularioValorizacionSupabase,
  FiltrosEmpresaSupabase,
  FiltrosObraSupabase,
  FiltrosValorizacionSupabase,
  RespuestaSupabase,
  EstadisticasDashboard
} from '../types/supabase.types'

// ==================== HOOK DE EMPRESAS ====================

export function useEmpresas(filtros?: FiltrosEmpresaSupabase) {
  const [empresas, setEmpresas] = useState<EmpresaDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarEmpresas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let data: EmpresaDB[]
      
      if (filtros?.search) {
        data = await empresasService.search(filtros.search)
      } else {
        data = await empresasService.getAll(filtros?.tipo_empresa)
      }
      
      // Filtrar por estado si se especifica
      if (filtros?.estado) {
        data = data.filter(empresa => empresa.estado === filtros.estado)
      }
      
      setEmpresas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando empresas')
      setEmpresas([])
    } finally {
      setLoading(false)
    }
  }

  const crearEmpresa = async (empresa: FormularioEmpresaSupabase): Promise<RespuestaSupabase<EmpresaDB>> => {
    try {
      const nuevaEmpresa = await empresasService.create(empresa)
      await cargarEmpresas() // Recargar lista
      return { data: nuevaEmpresa, error: null, success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error creando empresa')
      return { data: null, error, success: false }
    }
  }

  const actualizarEmpresa = async (id: string, empresa: Partial<FormularioEmpresaSupabase>): Promise<RespuestaSupabase<EmpresaDB>> => {
    try {
      const empresaActualizada = await empresasService.update(id, empresa)
      await cargarEmpresas() // Recargar lista
      return { data: empresaActualizada, error: null, success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error actualizando empresa')
      return { data: null, error, success: false }
    }
  }

  const eliminarEmpresa = async (id: string): Promise<RespuestaSupabase<void>> => {
    try {
      await empresasService.delete(id)
      await cargarEmpresas() // Recargar lista
      return { data: null, error: null, success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error eliminando empresa')
      return { data: null, error, success: false }
    }
  }

  const buscarPorRuc = async (ruc: string): Promise<RespuestaSupabase<EmpresaDB | null>> => {
    try {
      const empresa = await empresasService.getByRuc(ruc)
      return { data: empresa, error: null, success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error buscando empresa por RUC')
      return { data: null, error, success: false }
    }
  }

  useEffect(() => {
    cargarEmpresas()
  }, [JSON.stringify(filtros)])

  return {
    empresas,
    loading,
    error,
    crearEmpresa,
    actualizarEmpresa,
    eliminarEmpresa,
    buscarPorRuc,
    recargar: cargarEmpresas
  }
}

// ==================== HOOK DE OBRAS ====================

export function useObras(filtros?: FiltrosObraSupabase) {
  const [obras, setObras] = useState<any[]>([]) // any[] porque incluye relaciones
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarObras = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await obrasService.getAll()
      
      // Aplicar filtros localmente (podrías optimizar esto en el servicio)
      let obrasFiltradas = data
      
      if (filtros?.search) {
        obrasFiltradas = obrasFiltradas.filter(obra => 
          obra.nombre.toLowerCase().includes(filtros.search!.toLowerCase()) ||
          obra.codigo.toLowerCase().includes(filtros.search!.toLowerCase())
        )
      }
      
      if (filtros?.estado) {
        obrasFiltradas = obrasFiltradas.filter(obra => obra.estado === filtros.estado)
      }
      
      if (filtros?.empresa_ejecutora_id) {
        obrasFiltradas = obrasFiltradas.filter(obra => obra.empresa_ejecutora_id === filtros.empresa_ejecutora_id)
      }
      
      setObras(obrasFiltradas)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando obras')
      setObras([])
    } finally {
      setLoading(false)
    }
  }

  const crearObra = async (obra: FormularioObraSupabase): Promise<RespuestaSupabase<ObraDB>> => {
    try {
      const nuevaObra = await obrasService.create(obra)
      await cargarObras() // Recargar lista
      return { data: nuevaObra, error: null, success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error creando obra')
      return { data: null, error, success: false }
    }
  }

  const actualizarObra = async (id: string, obra: Partial<FormularioObraSupabase>): Promise<RespuestaSupabase<ObraDB>> => {
    try {
      const obraActualizada = await obrasService.update(id, obra)
      await cargarObras() // Recargar lista
      return { data: obraActualizada, error: null, success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error actualizando obra')
      return { data: null, error, success: false }
    }
  }

  const eliminarObra = async (id: string): Promise<RespuestaSupabase<void>> => {
    try {
      await obrasService.delete(id)
      await cargarObras() // Recargar lista
      return { data: null, error: null, success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error eliminando obra')
      return { data: null, error, success: false }
    }
  }

  useEffect(() => {
    cargarObras()
  }, [JSON.stringify(filtros)])

  return {
    obras,
    loading,
    error,
    crearObra,
    actualizarObra,
    eliminarObra,
    recargar: cargarObras
  }
}

// ==================== HOOK DE VALORIZACIONES ====================

export function useValorizaciones(filtros?: FiltrosValorizacionSupabase) {
  const [valorizaciones, setValorizaciones] = useState<any[]>([]) // any[] porque incluye relaciones
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarValorizaciones = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let data
      
      if (filtros?.obra_id) {
        data = await valorizacionesService.getByObra(filtros.obra_id)
        // Agregar información de la obra a cada valorización
        data = data.map(val => ({ ...val, obra: null })) // Simplificado por ahora
      } else {
        data = await valorizacionesService.getAll()
      }
      
      // Aplicar filtros adicionales
      if (filtros?.tipo) {
        data = data.filter(val => val.tipo === filtros.tipo)
      }
      
      if (filtros?.estado) {
        data = data.filter(val => val.estado === filtros.estado)
      }
      
      if (filtros?.periodo) {
        data = data.filter(val => val.periodo === filtros.periodo)
      }
      
      setValorizaciones(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando valorizaciones')
      setValorizaciones([])
    } finally {
      setLoading(false)
    }
  }

  const crearValorizacion = async (valorizacion: FormularioValorizacionSupabase): Promise<RespuestaSupabase<ValorizacionDB>> => {
    try {
      const nuevaValorizacion = await valorizacionesService.create(valorizacion)
      await cargarValorizaciones() // Recargar lista
      return { data: nuevaValorizacion, error: null, success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error creando valorización')
      return { data: null, error, success: false }
    }
  }

  const actualizarValorizacion = async (id: string, valorizacion: Partial<FormularioValorizacionSupabase>): Promise<RespuestaSupabase<ValorizacionDB>> => {
    try {
      const valorizacionActualizada = await valorizacionesService.update(id, valorizacion)
      await cargarValorizaciones() // Recargar lista
      return { data: valorizacionActualizada, error: null, success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error actualizando valorización')
      return { data: null, error, success: false }
    }
  }

  const eliminarValorizacion = async (id: string): Promise<RespuestaSupabase<void>> => {
    try {
      await valorizacionesService.delete(id)
      await cargarValorizaciones() // Recargar lista
      return { data: null, error: null, success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error eliminando valorización')
      return { data: null, error, success: false }
    }
  }

  useEffect(() => {
    cargarValorizaciones()
  }, [JSON.stringify(filtros)])

  return {
    valorizaciones,
    loading,
    error,
    crearValorizacion,
    actualizarValorizacion,
    eliminarValorizacion,
    recargar: cargarValorizaciones
  }
}

// ==================== HOOK DE CONSULTA RUC ====================

export function useConsultaRuc() {
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const consultarRuc = async (ruc: string) => {
    try {
      setLoading(true)
      setError(null)
      setResultado(null)
      
      const respuesta = await consultaRucService.consultarRuc(ruc)
      
      if (respuesta.success) {
        setResultado(respuesta)
      } else {
        setError(respuesta.error || 'Error consultando RUC')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error consultando RUC')
    } finally {
      setLoading(false)
    }
  }

  const limpiar = () => {
    setResultado(null)
    setError(null)
  }

  return {
    loading,
    resultado,
    error,
    consultarRuc,
    limpiar
  }
}

// ==================== HOOK DE DASHBOARD ====================

export function useDashboard() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarEstadisticas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Cargar datos de todas las tablas en paralelo
      const [empresas, obras, valorizaciones] = await Promise.all([
        empresasService.getAll(),
        obrasService.getAll(),
        valorizacionesService.getAll()
      ])
      
      // Calcular estadísticas
      const stats: EstadisticasDashboard = {
        total_empresas: empresas.length,
        total_obras: obras.length,
        total_valorizaciones: valorizaciones.length,
        empresas_activas: empresas.filter(e => e.estado === 'activo').length,
        obras_en_ejecucion: obras.filter(o => o.estado === 'en_ejecucion').length,
        valorizaciones_pendientes: valorizaciones.filter(v => v.estado === 'borrador' || v.estado === 'presentada').length,
        monto_total_contratos: obras.reduce((sum, obra) => sum + obra.monto_contrato, 0),
        monto_total_ejecutado: valorizaciones.reduce((sum, val) => sum + val.monto_ejecutado, 0)
      }
      
      setEstadisticas(stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando estadísticas')
      setEstadisticas(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  return {
    estadisticas,
    loading,
    error,
    recargar: cargarEstadisticas
  }
}