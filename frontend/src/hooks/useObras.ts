import { useState, useEffect, useCallback } from 'react';
import type { 
  Obra,
  ObraForm,
  ObraProfesional,
  ProfesionalForm,
  ObraValorizacion,
  Profesion,
  FiltrosObra,
  CrearObraParams,
  EstadisticasObras,
  ResultadoValidacion,
  ErrorValidacion,
  ResultadoDisponibilidadProfesional,
  ConflictoProfesional,
} from '../types/obra.types';
import { CONFIG_NUMERO_CONTRATO } from '../types/obra.types';

// Mock data temporal hasta implementar la API
const mockProfesiones: Profesion[] = [
  {
    id: 1,
    codigo: 'ING_CIVIL',
    nombre: 'Ingeniero Civil',
    abreviatura: 'Ing. Civil',
    area_especialidad: 'Construcción y Estructuras',
    activo: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    codigo: 'ARQUITECTO',
    nombre: 'Arquitecto',
    abreviatura: 'Arq.',
    area_especialidad: 'Diseño Arquitectónico',
    activo: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  },
  {
    id: 3,
    codigo: 'ING_SANITARIO',
    nombre: 'Ingeniero Sanitario',
    abreviatura: 'Ing. Sanit.',
    area_especialidad: 'Saneamiento e Hidráulica',
    activo: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  },
  {
    id: 4,
    codigo: 'TOPOGRAFO',
    nombre: 'Topógrafo',
    abreviatura: 'Top.',
    area_especialidad: 'Topografía y Geodesia',
    activo: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  },
  {
    id: 5,
    codigo: 'SEGURIDAD',
    nombre: 'Ingeniero de Seguridad',
    abreviatura: 'Ing. Seg.',
    area_especialidad: 'Seguridad y Salud Ocupacional',
    activo: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  }
];

const mockObras: Obra[] = [
  {
    id: 1,
    numero_contrato: 'N.º 01-2025-MDSM/GM',
    nombre: 'MEJORAMIENTO DE LA INFRAESTRUCTURA VIAL DE LA AV. PRINCIPAL',
    codigo_interno: 'OBR001',
    entidad_ejecutora_id: 1,
    entidad_supervisora_id: 2,
    monto_ejecucion: 850000,
    monto_supervision: 85000,
    monto_total: 935000,
    plazo_ejecucion_dias: 180,
    numero_valorizaciones: 6,
    fecha_inicio: '2025-02-01',
    fecha_fin_prevista: '2025-07-30',
    fecha_termino: '2025-07-28',
    ubicacion: 'Av. Principal del distrito',
    distrito: 'San Martín de Porres',
    provincia: 'Lima',
    departamento: 'Lima',
    tipo_obra: 'VEREDAS_PISTAS',
    modalidad_ejecucion: 'CONTRATA',
    sistema_contratacion: 'SUMA_ALZADA',
    estado: 'EN_EJECUCION',
    descripcion: 'Mejoramiento integral de infraestructura vial incluyendo pavimento, veredas y señalización',
    activo: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
    version: 1
  },
  {
    id: 2,
    numero_contrato: 'N.º 02-2025-MDSM/GM',
    nombre: 'CONSTRUCCION DE PARQUE RECREACIONAL EN EL AA.HH. LOS JARDINES',
    codigo_interno: 'OBR002',
    entidad_ejecutora_id: 2,
    entidad_supervisora_id: 1,
    monto_ejecucion: 450000,
    monto_supervision: 45000,
    monto_total: 495000,
    plazo_ejecucion_dias: 120,
    numero_valorizaciones: 4,
    fecha_inicio: '2025-03-01',
    fecha_fin_prevista: '2025-06-29',
    fecha_termino: '2025-06-25',
    ubicacion: 'AA.HH. Los Jardines',
    distrito: 'San Martín de Porres',
    provincia: 'Lima',
    departamento: 'Lima',
    tipo_obra: 'PARQUES_JARDINES',
    modalidad_ejecucion: 'CONTRATA',
    sistema_contratacion: 'PRECIOS_UNITARIOS',
    estado: 'REGISTRADA',
    descripcion: 'Construcción de parque recreacional con áreas verdes, juegos infantiles y área de ejercicios',
    activo: true,
    created_at: '2025-01-20T14:00:00Z',
    updated_at: '2025-01-20T14:00:00Z',
    version: 1
  }
];

const mockProfesionales: ObraProfesional[] = [
  {
    id: 1,
    obra_id: 1,
    profesion_id: 1,
    nombre_completo: 'Juan Carlos Mendoza Silva',
    numero_colegiatura: 'CIP-12345',
    dni: '12345678',
    telefono: '987654321',
    email: 'jmendoza@email.com',
    porcentaje_participacion: 100,
    fecha_inicio_participacion: '2025-02-01',
    cargo: 'Residente de Obra',
    responsabilidades: ['Dirección técnica', 'Control de calidad', 'Supervisión de personal'],
    estado: 'ACTIVO',
    activo: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: 2,
    obra_id: 1,
    profesion_id: 4,
    nombre_completo: 'María Elena Torres Rojas',
    numero_colegiatura: 'CTP-98765',
    dni: '87654321',
    telefono: '912345678',
    email: 'mtorres@email.com',
    porcentaje_participacion: 50,
    fecha_inicio_participacion: '2025-02-01',
    cargo: 'Topógrafa',
    responsabilidades: ['Levantamientos topográficos', 'Control de cotas'],
    estado: 'ACTIVO',
    activo: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  }
];

const mockValorizaciones: ObraValorizacion[] = [
  {
    id: 1,
    obra_id: 1,
    numero_valorizacion: 1,
    periodo_inicio: '2025-02-01',
    periodo_fin: '2025-02-28',
    monto_ejecutado: 125000,
    porcentaje_avance: 15,
    monto_acumulado: 125000,
    porcentaje_acumulado: 15,
    estado: 'APROBADA',
    fecha_programada: '2025-03-05',
    fecha_presentacion: '2025-03-03',
    fecha_aprobacion: '2025-03-07',
    fecha_pago: '2025-03-15',
    activo: true,
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-03-07T15:30:00Z'
  },
  {
    id: 2,
    obra_id: 1,
    numero_valorizacion: 2,
    periodo_inicio: '2025-03-01',
    periodo_fin: '2025-03-31',
    monto_ejecutado: 0,
    porcentaje_avance: 0,
    monto_acumulado: 125000,
    porcentaje_acumulado: 15,
    estado: 'PROGRAMADA',
    fecha_programada: '2025-04-05',
    activo: true,
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-01T10:00:00Z'
  }
];

// Hook principal para gestión de obras
export const useObras = () => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar obras con filtros
  const cargarObras = useCallback(async (filtros?: FiltrosObra) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let obrasFiltradas = [...mockObras];
      
      if (filtros?.search) {
        const searchTerm = filtros.search.toLowerCase();
        obrasFiltradas = obrasFiltradas.filter(obra =>
          obra.nombre.toLowerCase().includes(searchTerm) ||
          obra.numero_contrato.toLowerCase().includes(searchTerm) ||
          obra.codigo_interno?.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filtros?.estado) {
        obrasFiltradas = obrasFiltradas.filter(obra => obra.estado === filtros.estado);
      }
      
      if (filtros?.entidad_ejecutora_id) {
        obrasFiltradas = obrasFiltradas.filter(obra => 
          obra.entidad_ejecutora_id === filtros.entidad_ejecutora_id
        );
      }
      
      if (filtros?.entidad_supervisora_id) {
        obrasFiltradas = obrasFiltradas.filter(obra => 
          obra.entidad_supervisora_id === filtros.entidad_supervisora_id
        );
      }
      
      if (filtros?.tipo_obra) {
        obrasFiltradas = obrasFiltradas.filter(obra => obra.tipo_obra === filtros.tipo_obra);
      }
      
      setObras(obrasFiltradas);
    } catch (err) {
      setError('Error al cargar obras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva obra con plantel profesional
  const crearObra = useCallback(async (params: CrearObraParams): Promise<Obra | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Validar número de contrato único
      const contratoExistente = mockObras.find(o => o.numero_contrato === params.obra.numero_contrato);
      if (contratoExistente) {
        throw new Error('Ya existe una obra con este número de contrato');
      }
      
      const nuevaObra: Obra = {
        id: Math.max(...mockObras.map(o => o.id)) + 1,
        ...params.obra,
        monto_total: params.obra.monto_ejecucion + params.obra.monto_supervision,
        numero_valorizaciones: Math.ceil(params.obra.plazo_ejecucion_dias / 30),
        fecha_fin_prevista: new Date(
          new Date(params.obra.fecha_inicio).getTime() + 
          params.obra.plazo_ejecucion_dias * 24 * 60 * 60 * 1000
        ).toISOString().split('T')[0],
        estado: 'REGISTRADA',
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1
      };
      
      mockObras.push(nuevaObra);
      
      // Crear profesionales del plantel
      if (params.plantel_profesional.length > 0) {
        params.plantel_profesional.forEach(prof => {
          const nuevoProfesional: ObraProfesional = {
            id: Math.max(0, ...mockProfesionales.map(p => p.id)) + 1,
            obra_id: nuevaObra.id,
            ...prof,
            estado: 'ACTIVO',
            activo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          mockProfesionales.push(nuevoProfesional);
        });
      }
      
      setObras([...mockObras]);
      return nuevaObra;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear obra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar obra
  const actualizarObra = useCallback(async (id: number, obraData: Partial<ObraForm>): Promise<Obra | null> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const obraIndex = mockObras.findIndex(o => o.id === id);
      if (obraIndex === -1) {
        throw new Error('Obra no encontrada');
      }
      
      const obraActualizada: Obra = {
        ...mockObras[obraIndex],
        ...obraData,
        monto_total: (obraData.monto_ejecucion || mockObras[obraIndex].monto_ejecucion) +
                     (obraData.monto_supervision || mockObras[obraIndex].monto_supervision),
        numero_valorizaciones: obraData.plazo_ejecucion_dias ? 
          Math.ceil(obraData.plazo_ejecucion_dias / 30) : 
          mockObras[obraIndex].numero_valorizaciones,
        updated_at: new Date().toISOString(),
        version: (mockObras[obraIndex]?.version ?? 0) + 1
      };
      
      if (obraData.fecha_inicio && obraData.plazo_ejecucion_dias) {
        obraActualizada.fecha_fin_prevista = new Date(
          new Date(obraData.fecha_inicio).getTime() + 
          obraData.plazo_ejecucion_dias * 24 * 60 * 60 * 1000
        ).toISOString().split('T')[0];
      }
      
      mockObras[obraIndex] = obraActualizada;
      setObras([...mockObras]);
      
      return obraActualizada;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar obra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener obra por ID con detalles
  const obtenerObraPorId = useCallback((id: number): Obra | null => {
    return mockObras.find(o => o.id === id) || null;
  }, []);

  // Obtener estadísticas
  const obtenerEstadisticas = useCallback(async (): Promise<EstadisticasObras> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const estadisticas: EstadisticasObras = {
      obras_totales: mockObras.length,
      obras_activas: mockObras.filter(o => o.estado === 'EN_EJECUCION').length,
      obras_terminadas: mockObras.filter(o => o.estado === 'TERMINADA').length,
      obras_paralizadas: mockObras.filter(o => o.estado === 'PARALIZADA').length,
      monto_total_obras: mockObras.reduce((sum, o) => sum + o.monto_total, 0),
      monto_ejecutado_total: mockValorizaciones
        .filter(v => v.estado === 'APROBADA')
        .reduce((sum, v) => sum + v.monto_ejecutado, 0),
      obras_por_estado: {
        REGISTRADA: mockObras.filter(o => o.estado === 'REGISTRADA').length,
        EN_EJECUCION: mockObras.filter(o => o.estado === 'EN_EJECUCION').length,
        PARALIZADA: mockObras.filter(o => o.estado === 'PARALIZADA').length,
        TERMINADA: mockObras.filter(o => o.estado === 'TERMINADA').length,
        LIQUIDADA: mockObras.filter(o => o.estado === 'LIQUIDADA').length,
        CANCELADA: mockObras.filter(o => o.estado === 'CANCELADA').length
      },
      obras_por_tipo: {
        CARRETERA: mockObras.filter(o => o.tipo_obra === 'CARRETERA').length,
        EDIFICACION: mockObras.filter(o => o.tipo_obra === 'EDIFICACION').length,
        SANEAMIENTO: mockObras.filter(o => o.tipo_obra === 'SANEAMIENTO').length,
        ELECTRICIDAD: mockObras.filter(o => o.tipo_obra === 'ELECTRICIDAD').length,
        PUENTE: mockObras.filter(o => o.tipo_obra === 'PUENTE').length,
        VEREDAS_PISTAS: mockObras.filter(o => o.tipo_obra === 'VEREDAS_PISTAS').length,
        PARQUES_JARDINES: mockObras.filter(o => o.tipo_obra === 'PARQUES_JARDINES').length,
        DRENAJE_PLUVIAL: mockObras.filter(o => o.tipo_obra === 'DRENAJE_PLUVIAL').length,
        OTROS: mockObras.filter(o => o.tipo_obra === 'OTROS').length
      },
      valorizaciones_pendientes: mockValorizaciones.filter(v => v.estado === 'PROGRAMADA').length,
      valorizaciones_vencidas: mockValorizaciones.filter(v => 
        v.estado === 'PROGRAMADA' && new Date(v.fecha_programada) < new Date()
      ).length,
      profesionales_con_conflictos: 0,
      top_ejecutoras: []
    };
    
    return estadisticas;
  }, []);

  useEffect(() => {
    cargarObras();
  }, [cargarObras]);

  return {
    obras,
    loading,
    error,
    cargarObras,
    crearObra,
    actualizarObra,
    obtenerObraPorId,
    obtenerEstadisticas
  };
};

// Hook para gestión de profesionales
export const useProfesionales = () => {
  const [profesionales, setProfesionales] = useState<ObraProfesional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar profesionales de una obra
  const cargarProfesionalesPorObra = useCallback(async (obraId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const profesionalesObra = mockProfesionales.filter(p => p.obra_id === obraId);
      setProfesionales(profesionalesObra);
    } catch (err) {
      setError('Error al cargar profesionales');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Agregar profesional a obra
  const agregarProfesional = useCallback(async (obraId: number, profesional: ProfesionalForm): Promise<ObraProfesional | null> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const nuevoProfesional: ObraProfesional = {
        id: Math.max(0, ...mockProfesionales.map(p => p.id)) + 1,
        obra_id: obraId,
        ...profesional,
        estado: 'ACTIVO',
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockProfesionales.push(nuevoProfesional);
      setProfesionales([...mockProfesionales.filter(p => p.obra_id === obraId)]);
      
      return nuevoProfesional;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar profesional';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar disponibilidad de profesional
  const verificarDisponibilidad = useCallback(async (
    nombreCompleto: string,
    fechaInicio: string,
    fechaFin: string,
    obraIdExcluir?: number
  ): Promise<ResultadoDisponibilidadProfesional> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const conflictos: ConflictoProfesional[] = [];
    
    // Buscar conflictos con profesionales que tengan 100% en otras obras activas
    mockProfesionales.forEach(prof => {
      if (prof.nombre_completo === nombreCompleto && 
          prof.porcentaje_participacion === 100 && 
          prof.estado === 'ACTIVO' &&
          prof.obra_id !== obraIdExcluir) {
        
        const obra = mockObras.find(o => o.id === prof.obra_id);
        if (obra && (obra.estado === 'REGISTRADA' || obra.estado === 'EN_EJECUCION')) {
          // Verificar superposición de fechas
          const fechaInicioProf = new Date(prof.fecha_inicio_participacion);
          const fechaFinProf = prof.fecha_fin_participacion ? 
            new Date(prof.fecha_fin_participacion) : 
            new Date(obra.fecha_fin_prevista);
          
          const fechaInicioNueva = new Date(fechaInicio);
          const fechaFinNueva = new Date(fechaFin);
          
          if (fechaInicioNueva <= fechaFinProf && fechaFinNueva >= fechaInicioProf) {
            conflictos.push({
              obra_id: obra.id,
              obra_nombre: obra.nombre,
              numero_contrato: obra.numero_contrato,
              fecha_inicio: obra.fecha_inicio,
              fecha_fin_prevista: obra.fecha_fin_prevista,
              porcentaje_participacion: prof.porcentaje_participacion
            });
          }
        }
      }
    });
    
    return {
      disponible: conflictos.length === 0,
      conflictos
    };
  }, []);

  return {
    profesionales,
    loading,
    error,
    cargarProfesionalesPorObra,
    agregarProfesional,
    verificarDisponibilidad
  };
};

// Hook para gestión de profesiones
export const useProfesiones = () => {
  const [profesiones, setProfesiones] = useState<Profesion[]>(mockProfesiones);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarProfesiones = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProfesiones(mockProfesiones);
    } catch (err) {
      setError('Error al cargar profesiones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarProfesiones();
  }, [cargarProfesiones]);

  return {
    profesiones,
    loading,
    error,
    cargarProfesiones
  };
};

// Hook para validaciones
export const useValidacionesObra = () => {
  const validarNumeroContrato = useCallback((numeroContrato: string): ErrorValidacion | null => {
    if (!numeroContrato) {
      return { campo: 'numero_contrato', mensaje: 'El número de contrato es obligatorio' };
    }
    
    if (!CONFIG_NUMERO_CONTRATO.patron.test(numeroContrato)) {
      return { 
        campo: 'numero_contrato', 
        mensaje: `El formato debe ser: ${CONFIG_NUMERO_CONTRATO.formato}`,
        codigo: 'FORMATO_INVALIDO'
      };
    }
    
    return null;
  }, []);

  const validarMontos = useCallback((montoEjecucion: number, montoSupervision: number): ErrorValidacion[] => {
    const errores: ErrorValidacion[] = [];
    
    if (montoEjecucion <= 0) {
      errores.push({ campo: 'monto_ejecucion', mensaje: 'El monto de ejecución debe ser mayor a cero' });
    }
    
    if (montoSupervision < 0) {
      errores.push({ campo: 'monto_supervision', mensaje: 'El monto de supervisión no puede ser negativo' });
    }
    
    // Validación de proporción de supervisión (típicamente 10-15% del monto de ejecución)
    if (montoSupervision > montoEjecucion * 0.2) {
      errores.push({ 
        campo: 'monto_supervision', 
        mensaje: 'El monto de supervisión no debería exceder el 20% del monto de ejecución' 
      });
    }
    
    return errores;
  }, []);

  const validarFechas = useCallback((fechaInicio: string, plazoDias: number, fechaTermino?: string): ErrorValidacion[] => {
    const errores: ErrorValidacion[] = [];
    
    const fechaInicioDate = new Date(fechaInicio);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaInicioDate < hoy) {
      errores.push({ 
        campo: 'fecha_inicio', 
        mensaje: 'La fecha de inicio no puede ser anterior a hoy' 
      });
    }
    
    if (plazoDias <= 0) {
      errores.push({ 
        campo: 'plazo_ejecucion_dias', 
        mensaje: 'El plazo de ejecución debe ser mayor a cero días' 
      });
    }
    
    if (plazoDias > 1095) { // 3 años
      errores.push({ 
        campo: 'plazo_ejecucion_dias', 
        mensaje: 'El plazo de ejecución no debería exceder los 3 años (1095 días)' 
      });
    }
    
    // Validar fecha de término si está presente
    if (fechaTermino) {
      const fechaTerminoDate = new Date(fechaTermino);
      
      if (fechaTerminoDate <= fechaInicioDate) {
        errores.push({ 
          campo: 'fecha_termino', 
          mensaje: 'La fecha de término debe ser posterior a la fecha de inicio' 
        });
      }
      
      // Validar que la fecha de término no sea muy lejana (más de 5 años)
      const fechaMaxima = new Date(fechaInicioDate);
      fechaMaxima.setFullYear(fechaMaxima.getFullYear() + 5);
      
      if (fechaTerminoDate > fechaMaxima) {
        errores.push({ 
          campo: 'fecha_termino', 
          mensaje: 'La fecha de término no debería exceder los 5 años desde la fecha de inicio' 
        });
      }
    }
    
    return errores;
  }, []);

  const validarEntidadesContratistas = useCallback((
    entidadEjecutoraId: number, 
    entidadSupervisoraId: number
  ): ErrorValidacion[] => {
    const errores: ErrorValidacion[] = [];
    
    if (!entidadEjecutoraId) {
      errores.push({ campo: 'entidad_ejecutora_id', mensaje: 'Debe seleccionar una entidad ejecutora' });
    }
    
    if (!entidadSupervisoraId) {
      errores.push({ campo: 'entidad_supervisora_id', mensaje: 'Debe seleccionar una entidad supervisora' });
    }
    
    if (entidadEjecutoraId && entidadSupervisoraId && entidadEjecutoraId === entidadSupervisoraId) {
      errores.push({ 
        campo: 'entidad_supervisora_id', 
        mensaje: 'La entidad ejecutora y supervisora deben ser diferentes' 
      });
    }
    
    return errores;
  }, []);

  const validarPorcentajeProfesional = useCallback((
    porcentaje: number
  ): ErrorValidacion[] => {
    const errores: ErrorValidacion[] = [];
    
    if (porcentaje <= 0 || porcentaje > 100) {
      errores.push({ 
        campo: 'porcentaje_participacion', 
        mensaje: 'El porcentaje debe estar entre 1 y 100' 
      });
    }
    
    // La validación de conflictos se hace en el hook de profesionales
    return errores;
  }, []);

  const validarObraForm = useCallback((form: ObraForm): ResultadoValidacion => {
    const errores: ErrorValidacion[] = [];
    
    // Validar número de contrato
    const errorContrato = validarNumeroContrato(form.numero_contrato);
    if (errorContrato) errores.push(errorContrato);
    
    // Validar nombre
    if (!form.nombre?.trim()) {
      errores.push({ campo: 'nombre', mensaje: 'El nombre de la obra es obligatorio' });
    }
    
    // Validar montos
    const erroresMontos = validarMontos(form.monto_ejecucion, form.monto_supervision);
    errores.push(...erroresMontos);
    
    // Validar fechas
    const erroresFechas = validarFechas(form.fecha_inicio, form.plazo_ejecucion_dias, form.fecha_termino);
    errores.push(...erroresFechas);
    
    // Validar entidades
    const erroresEntidades = validarEntidadesContratistas(
      form.entidad_ejecutora_id, 
      form.entidad_supervisora_id
    );
    errores.push(...erroresEntidades);
    
    return {
      valido: errores.length === 0,
      errores
    };
  }, [validarNumeroContrato, validarMontos, validarFechas, validarEntidadesContratistas]);

  return {
    validarNumeroContrato,
    validarMontos,
    validarFechas,
    validarEntidadesContratistas,
    validarPorcentajeProfesional,
    validarObraForm
  };
};

// Hook para gestión de valorizaciones
export const useValorizaciones = () => {
  const [valorizaciones, setValorizaciones] = useState<ObraValorizacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarValorizacionesPorObra = useCallback(async (obraId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const valorizacionesObra = mockValorizaciones.filter(v => v.obra_id === obraId);
      setValorizaciones(valorizacionesObra);
    } catch (err) {
      setError('Error al cargar valorizaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    valorizaciones,
    loading,
    error,
    cargarValorizacionesPorObra
  };
};