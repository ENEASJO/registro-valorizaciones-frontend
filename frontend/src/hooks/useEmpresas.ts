import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/api';
import type { 
  Empresa, 
  EntidadContratistaDetalle,
  EmpresaForm,
  FiltrosEntidadContratista,
  ErrorValidacion,
  CrearConsorcioParams,
  ConsorcioCompleto
} from '../types/empresa.types';

// Mock data temporal hasta implementar la API
const mockEmpresas: Empresa[] = [
  {
    id: 1,
    codigo: 'EMP001',
    ruc: '20123456789',
    razon_social: 'CONSTRUCTORA ABC SOCIEDAD ANONIMA CERRADA',
    nombre_comercial: 'Constructora ABC',
    email: 'contacto@abc.com',
    telefono: '987654321',
    direccion: 'Av. Principal 123, Lima',
    distrito: 'Lima',
    provincia: 'Lima',
    departamento: 'Lima',
    representante_legal: 'Juan Pérez García',
    dni_representante: '12345678',
    estado: 'ACTIVO',
    tipo_empresa: 'SAC',
    categoria_contratista: 'A',
    especialidades: ['EDIFICACIONES', 'CARRETERAS'],
    activo: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    codigo: 'EMP002',
    ruc: '20987654321',
    razon_social: 'INGENIERIA XYZ EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA',
    nombre_comercial: 'Ingeniería XYZ',
    email: 'info@xyz.com',
    telefono: '912345678',
    direccion: 'Jr. Secundario 456, Cusco',
    distrito: 'Cusco',
    provincia: 'Cusco',
    departamento: 'Cusco',
    representante_legal: 'María López Silva',
    dni_representante: '87654321',
    estado: 'ACTIVO',
    tipo_empresa: 'EIRL',
    categoria_contratista: 'B',
    especialidades: ['SANEAMIENTO', 'ELECTRICIDAD'],
    activo: true,
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 3,
    codigo: 'EMP003',
    ruc: '20456789123',
    razon_social: 'GRUPO CONSTRUCTOR PERU SOCIEDAD ANONIMA',
    nombre_comercial: 'GCP',
    email: 'ventas@gcp.pe',
    telefono: '998877665',
    direccion: 'Calle Comercial 789, Arequipa',
    distrito: 'Arequipa',
    provincia: 'Arequipa',
    departamento: 'Arequipa',
    representante_legal: 'Carlos Rodriguez Mendoza',
    dni_representante: '11223344',
    estado: 'ACTIVO',
    tipo_empresa: 'SA',
    categoria_contratista: 'A',
    especialidades: ['EDIFICACIONES', 'PUENTES', 'CARRETERAS'],
    activo: true,
    created_at: '2024-02-10T09:15:00Z',
    updated_at: '2024-02-10T09:15:00Z'
  }
];

const mockConsorcios: ConsorcioCompleto[] = [
  {
    id: 1,
    codigo: 'CON001',
    nombre: 'CONSORCIO OBRAS PUBLICAS 2024',
    descripcion: 'Consorcio para ejecución de obras de infraestructura pública',
    fecha_constitucion: '2024-01-15',
    empresa_lider_id: 1,
    representante_consorcio: 'Juan Pérez García',
    estado: 'ACTIVO',
    especialidades: ['EDIFICACIONES', 'CARRETERAS', 'SANEAMIENTO'],
    activo: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    empresa_lider: mockEmpresas[0],
    empresas_participantes: [
      {
        empresa: mockEmpresas[0],
        participacion: {
          id: 1,
          consorcio_id: 1,
          empresa_id: 1,
          porcentaje_participacion: 60,
          es_lider: true,
          responsabilidades: ['EJECUCIÓN', 'DIRECCIÓN_TÉCNICA'],
          fecha_ingreso: '2024-01-15',
          estado: 'ACTIVO',
          activo: true,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        }
      },
      {
        empresa: mockEmpresas[1],
        participacion: {
          id: 2,
          consorcio_id: 1,
          empresa_id: 2,
          porcentaje_participacion: 40,
          es_lider: false,
          responsabilidades: ['SUPERVISIÓN', 'CONTROL_CALIDAD'],
          fecha_ingreso: '2024-01-15',
          estado: 'ACTIVO',
          activo: true,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        }
      }
    ],
    total_empresas: 2,
    suma_porcentajes: 100,
    estado_porcentajes: 'CORRECTO'
  }
];

export const useEmpresas = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar empresas
  const cargarEmpresas = useCallback(async (filtros?: FiltrosEntidadContratista) => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the real API to get empresas
      const response = await fetch(API_ENDPOINTS.empresas);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Convert API response to Empresa format
        const empresasFromAPI: Empresa[] = result.data.map((apiEmpresa: any) => ({
          id: apiEmpresa.id,
          codigo: apiEmpresa.codigo,
          ruc: apiEmpresa.ruc,
          razon_social: apiEmpresa.razon_social,
          nombre_comercial: apiEmpresa.razon_social,
          email: apiEmpresa.email,
          telefono: apiEmpresa.celular,
          direccion: apiEmpresa.direccion,
          distrito: undefined,
          provincia: undefined,
          departamento: undefined,
          representante_legal: apiEmpresa.representante_legal,
          dni_representante: apiEmpresa.dni_representante,
          estado: apiEmpresa.estado,
          tipo_empresa: 'SAC',
          categoria_contratista: undefined,
          especialidades: apiEmpresa.especialidades || [],
          activo: true,
          created_at: apiEmpresa.created_at,
          updated_at: apiEmpresa.updated_at
        }));

        let empresasFiltradas = [...empresasFromAPI];
      
      if (filtros?.search) {
        const searchTerm = filtros.search.toLowerCase();
        empresasFiltradas = empresasFiltradas.filter(empresa =>
          empresa.razon_social.toLowerCase().includes(searchTerm) ||
          empresa.nombre_comercial?.toLowerCase().includes(searchTerm) ||
          empresa.ruc.includes(searchTerm)
        );
      }
      
      if (filtros?.estado) {
        empresasFiltradas = empresasFiltradas.filter(empresa => 
          empresa.estado === filtros.estado
        );
      }
      
      if (filtros?.categoria) {
        empresasFiltradas = empresasFiltradas.filter(empresa => 
          empresa.categoria_contratista === filtros.categoria
        );
      }
      
        if (filtros?.especialidades && filtros.especialidades.length > 0) {
          empresasFiltradas = empresasFiltradas.filter(empresa =>
            empresa.especialidades?.some(esp => 
              filtros.especialidades!.includes(esp)
            )
          );
        }
        
        setEmpresas(empresasFiltradas);
      } else {
        // If no data from API, fall back to empty array
        setEmpresas([]);
      }
    } catch (err) {
      // If API fails, show empty list instead of mock data
      console.error('Error loading empresas from API:', err);
      setError('Error al cargar empresas desde el servidor');
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva empresa
  const crearEmpresa = useCallback(async (empresaData: EmpresaForm): Promise<Empresa | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the real API endpoint
      const response = await fetch(API_ENDPOINTS.empresas, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empresaData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Convert API response to Empresa format
        const nuevaEmpresa: Empresa = {
          id: result.data.id,
          codigo: result.data.codigo,
          ruc: result.data.ruc,
          razon_social: result.data.razon_social,
          nombre_comercial: result.data.razon_social, // Use same as razon_social if not provided
          email: result.data.email || undefined,
          telefono: result.data.celular || undefined,
          direccion: result.data.direccion || undefined,
          distrito: undefined, // Not provided by API
          provincia: undefined,
          departamento: undefined,
          representante_legal: result.data.representante_legal || undefined,
          dni_representante: result.data.dni_representante || undefined,
          estado: result.data.estado,
          tipo_empresa: 'SAC', // Default, could be improved
          categoria_contratista: undefined,
          especialidades: result.data.especialidades || [],
          activo: true,
          created_at: result.data.created_at,
          updated_at: result.data.updated_at
        };
        
        // Refresh the list after successful creation
        await cargarEmpresas();
        
        return nuevaEmpresa;
      } else {
        throw new Error(result.message || 'Error en la respuesta del servidor');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear empresa';
      setError(errorMessage);
      console.error('Error creating empresa:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar empresa
  const actualizarEmpresa = useCallback(async (id: number, empresaData: Partial<EmpresaForm>): Promise<Empresa | null> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const empresaIndex = mockEmpresas.findIndex(e => e.id === id);
      if (empresaIndex === -1) {
        throw new Error('Empresa no encontrada');
      }
      
      const empresaActualizada = {
        ...mockEmpresas[empresaIndex],
        ...empresaData,
        updated_at: new Date().toISOString()
      };
      
      mockEmpresas[empresaIndex] = empresaActualizada;
      setEmpresas([...mockEmpresas]);
      
      return empresaActualizada;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar empresa';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar empresa
  const eliminarEmpresa = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const empresaIndex = mockEmpresas.findIndex(e => e.id === id);
      if (empresaIndex === -1) {
        throw new Error('Empresa no encontrada');
      }
      
      // Verificar si la empresa participa en consorcios activos
      const participaEnConsorcios = mockConsorcios.some(consorcio =>
        consorcio.empresas_participantes.some(ep => ep.empresa.id === id && ep.participacion.estado === 'ACTIVO')
      );
      
      if (participaEnConsorcios) {
        throw new Error('No se puede eliminar la empresa porque participa en consorcios activos');
      }
      
      mockEmpresas.splice(empresaIndex, 1);
      setEmpresas([...mockEmpresas]);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar empresa';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener empresa por ID
  const obtenerEmpresaPorId = useCallback((id: number): Empresa | null => {
    return mockEmpresas.find(e => e.id === id) || null;
  }, []);

  useEffect(() => {
    cargarEmpresas();
  }, [cargarEmpresas]);

  return {
    empresas,
    loading,
    error,
    cargarEmpresas,
    crearEmpresa,
    actualizarEmpresa,
    eliminarEmpresa,
    obtenerEmpresaPorId
  };
};

export const useConsorcios = () => {
  const [consorcios, setConsorcios] = useState<ConsorcioCompleto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar consorcios
  const cargarConsorcios = useCallback(async (filtros?: FiltrosEntidadContratista) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let consorciosFiltrados = [...mockConsorcios];
      
      if (filtros?.search) {
        const searchTerm = filtros.search.toLowerCase();
        consorciosFiltrados = consorciosFiltrados.filter(consorcio =>
          consorcio.nombre.toLowerCase().includes(searchTerm) ||
          consorcio.codigo.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filtros?.estado) {
        consorciosFiltrados = consorciosFiltrados.filter(consorcio => 
          consorcio.estado === filtros.estado
        );
      }
      
      setConsorcios(consorciosFiltrados);
    } catch (err) {
      setError('Error al cargar consorcios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nuevo consorcio
  const crearConsorcio = useCallback(async (params: CrearConsorcioParams): Promise<ConsorcioCompleto | null> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Validar que la suma de porcentajes sea 100%
      const sumaPortcentajes = params.empresas_participacion.reduce((sum, ep) => sum + ep.porcentaje, 0);
      if (Math.abs(sumaPortcentajes - 100) > 0.01) {
        throw new Error(`La suma de porcentajes debe ser 100%. Actual: ${sumaPortcentajes}%`);
      }
      
      // Validar que todas las empresas existan
      const empresasValidas = params.empresas_participacion.every(ep =>
        mockEmpresas.find(e => e.id === ep.empresa_id)
      );
      if (!empresasValidas) {
        throw new Error('Una o más empresas especificadas no existen');
      }
      
      // Encontrar empresa líder
      const empresaLider = mockEmpresas.find(e => e.id === params.consorcio.empresa_lider_id);
      if (!empresaLider) {
        throw new Error('La empresa líder especificada no existe');
      }
      
      const nuevoConsorcio: ConsorcioCompleto = {
        id: Math.max(...mockConsorcios.map(c => c.id)) + 1,
        codigo: params.consorcio.codigo || `CON${Date.now().toString().slice(-3)}`,
        ...params.consorcio,
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        empresa_lider: empresaLider,
        empresas_participantes: params.empresas_participacion.map((ep, index) => ({
          empresa: mockEmpresas.find(e => e.id === ep.empresa_id)!,
          participacion: {
            id: index + 1,
            consorcio_id: mockConsorcios.length + 1,
            empresa_id: ep.empresa_id,
            porcentaje_participacion: ep.porcentaje,
            es_lider: ep.empresa_id === params.consorcio.empresa_lider_id,
            responsabilidades: ep.responsabilidades,
            fecha_ingreso: new Date().toISOString().split('T')[0],
            estado: 'ACTIVO',
            activo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        })),
        total_empresas: params.empresas_participacion.length,
        suma_porcentajes: 100,
        estado_porcentajes: 'CORRECTO'
      };
      
      mockConsorcios.push(nuevoConsorcio);
      setConsorcios([...mockConsorcios]);
      
      return nuevoConsorcio;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear consorcio';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener consorcio por ID
  const obtenerConsorcioPorId = useCallback((id: number): ConsorcioCompleto | null => {
    return mockConsorcios.find(c => c.id === id) || null;
  }, []);

  useEffect(() => {
    cargarConsorcios();
  }, [cargarConsorcios]);

  return {
    consorcios,
    loading,
    error,
    cargarConsorcios,
    crearConsorcio,
    obtenerConsorcioPorId
  };
};

// Hook para gestionar entidades contratistas (empresas y consorcios unificados)
export const useEntidadesContratistas = () => {
  const { empresas, loading: loadingEmpresas, error: errorEmpresas } = useEmpresas();
  const { consorcios, loading: loadingConsorcios, error: errorConsorcios } = useConsorcios();

  // Combinar empresas y consorcios en una vista unificada
  const entidades: EntidadContratistaDetalle[] = [
    ...empresas.map(empresa => ({
      id: empresa.id,
      tipo_entidad: 'EMPRESA' as const,
      empresa_id: empresa.id,
      consorcio_id: undefined,
      nombre_completo: empresa.razon_social,
      ruc_principal: empresa.ruc,
      capacidad_contratacion_anual: undefined,
      experiencia_anos: undefined,
      estado: empresa.estado,
      activo: empresa.activo,
      created_at: empresa.created_at,
      updated_at: empresa.updated_at,
      datos_empresa: {
        ruc: empresa.ruc,
        razon_social: empresa.razon_social,
        nombre_comercial: empresa.nombre_comercial,
        email: empresa.email,
        telefono: empresa.telefono,
        direccion: empresa.direccion,
        distrito: empresa.distrito,
        provincia: empresa.provincia,
        departamento: empresa.departamento,
        representante_legal: empresa.representante_legal,
        dni_representante: empresa.dni_representante,
        tipo_empresa: empresa.tipo_empresa,
        categoria_contratista: empresa.categoria_contratista,
        especialidades: empresa.especialidades
      },
      datos_consorcio: undefined,
      empresas_participantes: undefined
    })),
    ...consorcios.map(consorcio => ({
      id: consorcio.id + 1000, // Offset para evitar conflictos de ID
      tipo_entidad: 'CONSORCIO' as const,
      empresa_id: undefined,
      consorcio_id: consorcio.id,
      nombre_completo: consorcio.nombre,
      ruc_principal: consorcio.empresa_lider.ruc,
      capacidad_contratacion_anual: undefined,
      experiencia_anos: undefined,
      estado: consorcio.estado,
      activo: consorcio.activo,
      created_at: consorcio.created_at,
      updated_at: consorcio.updated_at,
      datos_empresa: undefined,
      datos_consorcio: {
        nombre: consorcio.nombre,
        descripcion: consorcio.descripcion,
        fecha_constitucion: consorcio.fecha_constitucion,
        empresa_lider_id: consorcio.empresa_lider_id,
        empresa_lider_nombre: consorcio.empresa_lider.razon_social,
        especialidades: consorcio.especialidades
      },
      empresas_participantes: consorcio.empresas_participantes.map(ep => ({
        empresa_id: ep.empresa.id,
        empresa_nombre: ep.empresa.razon_social,
        empresa_ruc: ep.empresa.ruc,
        porcentaje_participacion: ep.participacion.porcentaje_participacion,
        es_lider: ep.participacion.es_lider,
        responsabilidades: ep.participacion.responsabilidades
      }))
    }))
  ];

  const loading = loadingEmpresas || loadingConsorcios;
  const error = errorEmpresas || errorConsorcios;

  return {
    entidades,
    loading,
    error
  };
};

// Hook para validaciones
export const useValidacionesEmpresa = () => {
  const validarRuc = useCallback((ruc: string): ErrorValidacion | null => {
    if (!ruc) {
      return { campo: 'ruc', mensaje: 'El RUC es obligatorio' };
    }
    
    if (ruc.length !== 11) {
      return { campo: 'ruc', mensaje: 'El RUC debe tener 11 dígitos' };
    }
    
    if (!/^\d{11}$/.test(ruc)) {
      return { campo: 'ruc', mensaje: 'El RUC debe contener solo números' };
    }
    
    // Validación básica de tipo de RUC (20 = empresa)
    if (!ruc.startsWith('20')) {
      return { campo: 'ruc', mensaje: 'El RUC debe comenzar con 20 para empresas' };
    }
    
    return null;
  }, []);

  const validarEmail = useCallback((email?: string): ErrorValidacion | null => {
    if (!email) return null; // Email es opcional
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { campo: 'email', mensaje: 'El formato del email no es válido' };
    }
    
    return null;
  }, []);

  const validarTelefono = useCallback((telefono?: string): ErrorValidacion | null => {
    if (!telefono) return null; // Teléfono es opcional
    
    if (telefono.length < 7 || telefono.length > 15) {
      return { campo: 'telefono', mensaje: 'El teléfono debe tener entre 7 y 15 dígitos' };
    }
    
    if (!/^\d+$/.test(telefono.replace(/[\s\-\(\)]/g, ''))) {
      return { campo: 'telefono', mensaje: 'El teléfono debe contener solo números' };
    }
    
    return null;
  }, []);

  const validarPorcentajesConsorcio = useCallback((participaciones: Array<{ porcentaje: number }>): ErrorValidacion | null => {
    const suma = participaciones.reduce((acc, p) => acc + p.porcentaje, 0);
    
    if (Math.abs(suma - 100) > 0.01) {
      return { 
        campo: 'porcentajes', 
        mensaje: `La suma de porcentajes debe ser 100%. Actual: ${suma.toFixed(2)}%` 
      };
    }
    
    return null;
  }, []);

  const validarEmpresaForm = useCallback((form: EmpresaForm): ErrorValidacion[] => {
    const errores: ErrorValidacion[] = [];
    
    // Validar RUC
    const errorRuc = validarRuc(form.ruc);
    if (errorRuc) errores.push(errorRuc);
    
    // Validar razón social
    if (!form.razon_social?.trim()) {
      errores.push({ campo: 'razon_social', mensaje: 'La razón social es obligatoria' });
    }
    
    // Validar email
    const errorEmail = validarEmail(form.email);
    if (errorEmail) errores.push(errorEmail);
    
    // Validar teléfono
    const errorTelefono = validarTelefono(form.telefono);
    if (errorTelefono) errores.push(errorTelefono);
    
    return errores;
  }, [validarRuc, validarEmail, validarTelefono]);

  return {
    validarRuc,
    validarEmail,
    validarTelefono,
    validarPorcentajesConsorcio,
    validarEmpresaForm
  };
};