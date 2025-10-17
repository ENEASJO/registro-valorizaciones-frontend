import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { 
  X, 
  Users, 
  Save, 
  AlertCircle, 
  Plus, 
  Trash, 
  Search, 
  CheckCircle, 
  Building,
  Building2,
  Percent,
  Loader
} from 'lucide-react';
import type { 
  ConsorcioForm, 
  CrearConsorcioParams,
  ErrorValidacion 
} from '../../../types/empresa.types';
import { useEmpresas } from '../../../hooks/useEmpresas';
import { useConsultaRucConsolidada } from '../../../hooks/useConsultaRucConsolidada';
interface FormularioConsorcioProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CrearConsorcioParams) => Promise<void>;
  loading?: boolean;
  title?: string;
}
interface ConsorcioData {
  id: string;
  ruc: string;
  razonSocial: string;
  direccion?: string;
  domicilioFiscal?: string;
  representanteLegal?: string;
  datosCompletos: any;
}
interface IntegranteData {
  id: string;
  ruc: string;
  razonSocial: string;
  direccion?: string;
  domicilioFiscal?: string;
  porcentajeParticipacion?: number;
  datosCompletos: any;
}
const FormularioConsorcio = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  title = "Nuevo Consorcio"
}: FormularioConsorcioProps) => {
  const { crearEmpresa, empresas } = useEmpresas();
  // Hook de consulta RUC consolidada (SUNAT + OSCE)
  const {
    loading: loadingConsultaRuc,
    datos: datosConsultaRuc,
    datosOriginales: datosOriginalesRuc,
    error: errorConsultaRuc,
    advertencias: advertenciasRuc,
    representantesDisponibles,
    fuentesUtilizadas,
    consultarYAutocompletar,
    limpiarDatos: limpiarDatosRuc
  } = useConsultaRucConsolidada();

  // Función local de validación de RUC
  const validarRuc = (ruc: string): { valido: boolean; error?: string } => {
    const rucLimpio = ruc.replace(/\D/g, '');
    if (!rucLimpio || rucLimpio.length === 0) {
      return { valido: false, error: 'Debe ingresar un RUC' };
    }
    if (rucLimpio.length < 11) {
      return { valido: false, error: `El RUC debe tener 11 dígitos (actual: ${rucLimpio.length})` };
    }
    if (rucLimpio.length > 11) {
      return { valido: false, error: `El RUC debe tener 11 dígitos (actual: ${rucLimpio.length})` };
    }
    const prefijo = rucLimpio.substring(0, 2);
    const prefijoValidos = ['10', '15', '17', '20', '25'];
    if (!prefijoValidos.includes(prefijo)) {
      return { valido: false, error: `RUC inválido. Debe comenzar con 10, 15, 17, 20 o 25 (actual: ${prefijo})` };
    }
    return { valido: true };
  };

  // Estados principales
  const [consorcio, setConsorcio] = useState<ConsorcioData | null>(null);
  const [integrantes, setIntegrantes] = useState<IntegranteData[]>([]);
  const [errors, setErrors] = useState<ErrorValidacion[]>([]);
  // Estados para modales
  const [modalAgregarConsorcio, setModalAgregarConsorcio] = useState(false);
  const [modalAgregarIntegrante, setModalAgregarIntegrante] = useState(false);
  // Estados para formularios
  const [rucConsorcio, setRucConsorcio] = useState('');
  const [empresaSeleccionadaId, setEmpresaSeleccionadaId] = useState<string>('');
  const [porcentajeIntegrante, setPorcentajeIntegrante] = useState<number>(0);
  // Estados de carga específicos
  const [consultandoTipo, setConsultandoTipo] = useState<'consorcio' | 'integrante' | null>(null);
  // Estados para agregar integrante por RUC
  const [rucIntegrante, setRucIntegrante] = useState('');
  const [modoIntegrante, setModoIntegrante] = useState<'seleccionar' | 'consultar'>('seleccionar');
  const [guardandoEmpresa, setGuardandoEmpresa] = useState(false);
  useEffect(() => {
    if (isOpen) {
      // Reset completo del formulario
      setConsorcio(null);
      setIntegrantes([]);
      setErrors([]);
      setModalAgregarConsorcio(false);
      setModalAgregarIntegrante(false);
      setRucConsorcio('');
      setEmpresaSeleccionadaId('');
      setPorcentajeIntegrante(0);
      setConsultandoTipo(null);
      setRucIntegrante('');
      setModoIntegrante('seleccionar');
      setGuardandoEmpresa(false);
      limpiarDatosRuc();
    }
  }, [isOpen, limpiarDatosRuc]);
  // Función para consultar RUC del consorcio
  const handleConsultarRucConsorcio = async () => {
    if (!rucConsorcio) {
      setErrors([{ campo: 'ruc_consorcio', mensaje: 'Ingrese un RUC para consultar' }]);
      return;
    }
    const validacion = validarRuc(rucConsorcio);
    if (!validacion.valido) {
      setErrors([{ campo: 'ruc_consorcio', mensaje: validacion.error || 'RUC inválido' }]);
      return;
    }
    setConsultandoTipo('consorcio');
    try {
      const resultado = await consultarYAutocompletar(rucConsorcio);
      if (resultado.success && resultado.datosFormulario) {
        // Limpiar errores cuando la consulta es exitosa
        setErrors([]);
      } else {
        setErrors([{ 
          campo: 'ruc_consorcio', 
          mensaje: resultado.error || 'No se pudo consultar la información del RUC' 
        }]);
      }
    } catch (error) {
      console.error('Error en consulta RUC consorcio:', error);
      setErrors([{ 
        campo: 'ruc_consorcio', 
        mensaje: 'Error de conexión. Verifique su conexión a internet e intente nuevamente.' 
      }]);
    } finally {
      setConsultandoTipo(null);
    }
  };
  // Función para confirmar agregar consorcio
  const confirmarAgregarConsorcio = () => {
    if (!datosOriginalesRuc) return;
    const nuevoConsorcio: ConsorcioData = {
      id: Date.now().toString(),
      ruc: rucConsorcio,
      razonSocial: datosOriginalesRuc.razon_social,
      direccion: datosOriginalesRuc.contacto.direccion || datosOriginalesRuc.contacto.domicilio_fiscal || '',
      domicilioFiscal: datosOriginalesRuc.contacto.domicilio_fiscal,
      representanteLegal: datosOriginalesRuc.representantes?.[0]?.nombre,
      datosCompletos: datosOriginalesRuc
    };
    setConsorcio(nuevoConsorcio);
    setModalAgregarConsorcio(false);
    setRucConsorcio('');
    limpiarDatosRuc();
  };
  // Función para consultar RUC de integrante y guardarlo en tabla empresas
  const handleConsultarRucIntegrante = async () => {
    if (!rucIntegrante) {
      setErrors([{ campo: 'ruc_integrante', mensaje: 'Ingrese un RUC para consultar' }]);
      return;
    }

    const validacion = validarRuc(rucIntegrante);
    if (!validacion.valido) {
      setErrors([{ campo: 'ruc_integrante', mensaje: validacion.error || 'RUC inválido' }]);
      return;
    }

    // Verificar que no esté ya agregado
    if (integrantes.some(i => i.ruc === rucIntegrante) || consorcio?.ruc === rucIntegrante) {
      setErrors([{ campo: 'ruc_integrante', mensaje: 'Esta empresa ya está agregada al consorcio' }]);
      return;
    }

    setConsultandoTipo('integrante');
    try {
      // 1. Consultar datos de SUNAT usando el hook (para UI feedback)
      const resultado = await consultarYAutocompletar(rucIntegrante);

      if (!resultado.success || !resultado.datosFormulario) {
        setErrors([{
          campo: 'ruc_integrante',
          mensaje: resultado.error || 'No se pudo consultar la información del RUC'
        }]);
        setConsultandoTipo(null);
        return;
      }

      // 2. Guardar automáticamente en tabla empresas
      setGuardandoEmpresa(true);
      const datosFormulario = resultado.datosFormulario;

      // DEBUG: Verificar datos originales (usar estado del hook, no resultado)
      console.log('🔍 DEBUG - datosOriginalesRuc:', datosOriginalesRuc);
      console.log('🔍 DEBUG - representantes array:', datosOriginalesRuc?.representantes);

      // Transformar representantes de EmpresaConsolidada a RepresentanteFormulario[]
      const representantesTransformados = datosOriginalesRuc?.representantes
        ? datosOriginalesRuc.representantes.map((miembro, index) => ({
            nombre: miembro.nombre,
            cargo: miembro.cargo || '',
            numero_documento: miembro.numero_documento || miembro.documento || '',
            tipo_documento: (miembro.tipo_documento as 'DNI' | 'CE' | 'PASSPORT') || 'DNI',
            es_principal: index === 0, // Primer representante es principal
            fuente: miembro.fuente,
            activo: true
          }))
        : undefined;

      // DEBUG: Verificar transformación
      console.log('🔍 DEBUG - representantesTransformados:', representantesTransformados);

      const empresaData = {
        ruc: datosFormulario.ruc,
        razon_social: datosFormulario.razon_social,
        nombre_comercial: datosFormulario.nombre_comercial || '',
        direccion: datosFormulario.direccion || '',
        distrito: datosFormulario.distrito || '',
        provincia: datosFormulario.provincia || '',
        departamento: datosFormulario.departamento || '',
        representante_legal: datosFormulario.representante_legal || '',
        dni_representante: datosFormulario.dni_representante || '',
        email: datosFormulario.email || '',
        telefono: datosFormulario.telefono || '',
        celular: '',
        estado: 'ACTIVO' as const,
        tipo_empresa: 'SAC' as const,
        categoria_contratista: 'EJECUTORA' as const,
        especialidades: [],
        representantes: representantesTransformados // ← NEW: Include representantes from OSCE
      };

      // DEBUG: Verificar payload completo antes de enviar
      console.log('🔍 DEBUG - empresaData completo:', empresaData);
      console.log('🔍 DEBUG - empresaData.representantes:', empresaData.representantes);

      const empresaCreada = await crearEmpresa(empresaData);

      // DEBUG: Verificar respuesta
      console.log('🔍 DEBUG - empresaCreada response:', empresaCreada);
      setGuardandoEmpresa(false);

      if (empresaCreada) {
        // 3. Usar datos originales del estado del hook o crear fallback desde datosFormulario
        let datosCompletosIntegrante;

        if (datosOriginalesRuc) {
          // Caso ideal: usar datos originales del estado del hook
          datosCompletosIntegrante = datosOriginalesRuc;
        } else {
          // Fallback: construir datos completos desde datosFormulario
          datosCompletosIntegrante = {
            ruc: datosFormulario.ruc,
            razon_social: datosFormulario.razon_social,
            tipo_persona: 'JURIDICA' as 'NATURAL' | 'JURIDICA',
            contacto: {
              direccion: datosFormulario.direccion,
              domicilio_fiscal: datosFormulario?.domicilio_fiscal,
              departamento: datosFormulario.departamento,
              email: datosFormulario.email,
              telefono: datosFormulario.telefono
            },
            representantes: datosFormulario.representante_legal ? [{
              nombre: datosFormulario.representante_legal,
              cargo: '',
              numero_documento: datosFormulario.dni_representante || '',
              tipo_documento: 'DNI',
              fuente: 'SUNAT' as 'SUNAT' | 'OECE' | 'AMBOS',
              fuentes_detalle: {}
            }] : [],
            especialidades: [],
            especialidades_detalle: [],
            registro: {
              estado_sunat: 'ACTIVO',
              estado_osce: ''
            },
            timestamp: new Date().toISOString()
          };
        }

        // Agregar al integrante
        const nuevoIntegrante: IntegranteData = {
          id: Date.now().toString(),
          ruc: datosCompletosIntegrante.ruc,
          razonSocial: datosCompletosIntegrante.razon_social,
          direccion: datosCompletosIntegrante.contacto.direccion || datosCompletosIntegrante.contacto.domicilio_fiscal || '',
          domicilioFiscal: datosCompletosIntegrante.contacto.domicilio_fiscal || '',
          porcentajeParticipacion: porcentajeIntegrante || 0,
          datosCompletos: datosCompletosIntegrante
        };

        setIntegrantes(prev => [...prev, nuevoIntegrante]);
        setModalAgregarIntegrante(false);
        setRucIntegrante('');
        setPorcentajeIntegrante(0);
        setModoIntegrante('seleccionar');
        limpiarDatosRuc();
        setErrors([]);
      }
    } catch (error) {
      console.error('Error consultando RUC integrante:', error);
      setErrors([{
        campo: 'ruc_integrante',
        mensaje: 'Error al guardar la empresa. Intente nuevamente.'
      }]);
    } finally {
      setConsultandoTipo(null);
      setGuardandoEmpresa(false);
    }
  };

  // Función para confirmar agregar integrante desde empresa seleccionada
  const confirmarAgregarIntegrante = () => {
    if (!empresaSeleccionadaId) {
      setErrors([{ campo: 'empresa_integrante', mensaje: 'Seleccione una empresa' }]);
      return;
    }

    const empresaSeleccionada = empresas.find(e => e.id.toString() === empresaSeleccionadaId);
    if (!empresaSeleccionada || !empresaSeleccionada.datos_empresa) return;

    const datosEmpresa = empresaSeleccionada.datos_empresa;

    // Verificar que no esté ya agregado
    if (integrantes.some(i => i.ruc === datosEmpresa.ruc) || consorcio?.ruc === datosEmpresa.ruc) {
      setErrors([{ campo: 'empresa_integrante', mensaje: 'Esta empresa ya está agregada al consorcio' }]);
      return;
    }

    const nuevoIntegrante: IntegranteData = {
      id: Date.now().toString(),
      ruc: datosEmpresa.ruc,
      razonSocial: datosEmpresa.razon_social,
      direccion: datosEmpresa.direccion || '',
      domicilioFiscal: datosEmpresa.direccion || '',
      porcentajeParticipacion: porcentajeIntegrante || 0,
      datosCompletos: datosEmpresa // Guardar datos de empresa
    };
    setIntegrantes(prev => [...prev, nuevoIntegrante]);
    setModalAgregarIntegrante(false);
    setEmpresaSeleccionadaId('');
    setPorcentajeIntegrante(0);
    setErrors([]);
  };
  // Función para eliminar consorcio
  const eliminarConsorcio = () => {
    setConsorcio(null);
  };
  // Función para eliminar integrante
  const eliminarIntegrante = (id: string) => {
    setIntegrantes(prev => prev.filter(i => i.id !== id));
  };
  // Función para actualizar porcentaje de integrante
  const actualizarPorcentajeIntegrante = (id: string, porcentaje: number) => {
    setIntegrantes(prev => 
      prev.map(i => 
        i.id === id ? { ...i, porcentajeParticipacion: porcentaje } : i
      )
    );
  };
  // Función para validar formulario completo
  const validarFormulario = (): ErrorValidacion[] => {
    const errores: ErrorValidacion[] = [];
    if (!consorcio) {
      errores.push({ campo: 'consorcio', mensaje: 'Debe agregar la información del consorcio principal' });
    }
    if (integrantes.length === 0) {
      errores.push({ campo: 'integrantes', mensaje: 'Debe agregar al menos un integrante al consorcio' });
    }
    // Validar porcentajes si hay integrantes
    if (integrantes.length > 0) {
      const totalPorcentajes = integrantes.reduce((sum, i) => sum + (i.porcentajeParticipacion || 0), 0);
      if (totalPorcentajes !== 100) {
        errores.push({ 
          campo: 'porcentajes', 
          mensaje: `Los porcentajes de participación deben sumar 100%. Actual: ${totalPorcentajes.toFixed(1)}%` 
        });
      }
      // Verificar que todos tengan porcentajes > 0
      const sinPorcentaje = integrantes.filter(i => (i.porcentajeParticipacion || 0) <= 0);
      if (sinPorcentaje.length > 0) {
        errores.push({ 
          campo: 'porcentajes', 
          mensaje: 'Todos los integrantes deben tener un porcentaje de participación mayor a 0' 
        });
      }
    }
    return errores;
  };
  // Función para enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const erroresValidacion = validarFormulario();
    setErrors(erroresValidacion);
    if (erroresValidacion.length > 0) {
      return;
    }
    if (!consorcio) return;
    try {
      // Crear empresa consorcio si no existe
      let empresaConsorcio;
      const empresaConsorcioData = {
        ruc: consorcio.ruc,
        razon_social: consorcio.razonSocial,
        nombre_comercial: '',
        direccion: consorcio.datosCompletos.contacto.direccion || '',
        distrito: '',
        provincia: '',
        departamento: consorcio.datosCompletos.contacto.departamento || '',
        representante_legal: consorcio.representanteLegal || '',
        dni_representante: consorcio.datosCompletos.representantes?.[0]?.numero_documento || '',
        email: consorcio.datosCompletos.contacto.email || '',
        telefono: consorcio.datosCompletos.contacto.telefono || '',
        celular: '',
        estado: 'ACTIVO' as const,
        tipo_empresa: 'SAC' as const,
        categoria_contratista: 'EJECUTORA' as const,
        especialidades: []
      };
      empresaConsorcio = await crearEmpresa(empresaConsorcioData);
      // Usar empresas integrantes ya existentes (NO crear nuevas)
      const empresasParticipantes = [];
      for (const integrante of integrantes) {
        // Los integrantes ya son empresas existentes, usar su ID directamente
        const empresaExistente = empresas.find(e => e.datos_empresa?.ruc === integrante.ruc);
        if (empresaExistente) {
          empresasParticipantes.push({
            empresa_id: empresaExistente.id,
            porcentaje: integrante.porcentajeParticipacion || 0,
            responsabilidades: []
          });
        }
      }
      // Crear datos del consorcio
      const formDataConsorcio: ConsorcioForm = {
        nombre: consorcio.razonSocial,
        descripcion: `Consorcio formado por ${integrantes.length} empresas integrantes`,
        fecha_constitucion: new Date().toISOString().split('T')[0],
        empresa_lider_id: empresaConsorcio?.id || 0,
        representante_consorcio: consorcio.representanteLegal || '',
        estado: 'ACTIVO',
        especialidades: []
      };
      const params: CrearConsorcioParams = {
        consorcio: formDataConsorcio,
        empresas_participacion: empresasParticipantes
      };
      await onSubmit(params);
      onClose();
    } catch (error) {
      console.error('Error al crear consorcio:', error);
      setErrors([{ campo: 'general', mensaje: 'Error al crear el consorcio. Intente nuevamente.' }]);
    }
  };
  const getSumaPorcentajes = () => {
    return integrantes.reduce((sum, i) => sum + (i.porcentajeParticipacion || 0), 0);
  };
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-600">Configure el consorcio y sus empresas integrantes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="px-6 py-6 space-y-8">
            {/* Botones Principales */}
            {!consorcio && integrantes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Crear Nuevo Consorcio</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                  Primero agregue la información del consorcio principal. Una vez creado, podrá añadir las empresas integrantes.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setModalAgregarConsorcio(true)}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <Building className="w-6 h-6" />
                    <span>Añadir Consorcio</span>
                  </button>
                </div>
              </div>
            )}
            {/* Botones cuando ya hay datos */}
            {(consorcio || integrantes.length > 0) && (
              <div className="flex flex-wrap gap-4 justify-center">
                {!consorcio && (
                  <button
                    onClick={() => setModalAgregarConsorcio(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <Building className="w-5 h-5" />
                    <span>Añadir Consorcio</span>
                  </button>
                )}
                {/* Solo mostrar botón Añadir Integrante si ya existe consorcio */}
                {consorcio && (
                  <button
                    onClick={() => setModalAgregarIntegrante(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Añadir Integrante</span>
                  </button>
                )}
              </div>
            )}
            {/* Sección Consorcio Principal */}
            {consorcio && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Consorcio Principal</h3>
                  </div>
                  {integrantes.length === 0 && (
                    <div className="text-right">
                      <p className="text-sm text-green-600 font-medium">✓ Consorcio creado</p>
                      <p className="text-xs text-gray-500">Ahora puede agregar integrantes</p>
                    </div>
                  )}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {consorcio.razonSocial.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900">{consorcio.razonSocial}</h4>
                          <p className="text-blue-700 font-medium">RUC: {consorcio.ruc}</p>
                          {/* Badges de Estado */}
                          <div className="flex items-center gap-2 mt-2">
                            {consorcio.datosCompletos.registro?.estado_sunat && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                consorcio.datosCompletos.registro.estado_sunat.includes('ACTIVO')
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {consorcio.datosCompletos.registro.estado_sunat}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Información adicional en grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {consorcio.direccion && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Dirección:</p>
                            <p className="text-gray-900">{consorcio.direccion}</p>
                          </div>
                        )}
                        {consorcio.datosCompletos.tipo_persona !== 'NATURAL' && consorcio.datosCompletos.representantes && consorcio.datosCompletos.representantes.length > 0 && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Representantes Legales:</p>
                            <div className="space-y-2 mt-2">
                              {consorcio.datosCompletos.representantes.map((representante: any, index: number) => (
                                <div key={index} className="bg-gray-50 p-2 rounded-lg border">
                                  <p className="text-gray-900 font-semibold text-sm">{representante.nombre}</p>
                                  {representante.cargo && (
                                    <p className="text-blue-600 text-xs font-medium">{representante.cargo}</p>
                                  )}
                                  {representante.numero_documento && (
                                    <p className="text-gray-600 dark:text-gray-300 text-xs">
                                      {representante.tipo_documento || 'DNI'}: {representante.numero_documento}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Especialidades */}
                        {consorcio.datosCompletos.especialidades && consorcio.datosCompletos.especialidades.length > 0 && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Especialidades:</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {consorcio.datosCompletos.especialidades.map((esp: string, index: number) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                  {esp}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-green-700 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Datos validados con SUNAT</span>
                      </div>
                    </div>
                    <button
                      onClick={eliminarConsorcio}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar consorcio"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
            {/* Sección Integrantes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Integrantes ({integrantes.length})
                  </h3>
                </div>
                {integrantes.length > 0 && (
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      getSumaPorcentajes() === 100 
                        ? 'text-green-600' 
                        : getSumaPorcentajes() > 100 
                          ? 'text-red-600' 
                          : 'text-amber-600'
                    }`}>
                      {getSumaPorcentajes().toFixed(1)}%
                      {getSumaPorcentajes() === 100 && (
                        <span className="ml-2 text-green-600">✓ Completo</span>
                      )}
                      {getSumaPorcentajes() < 100 && getSumaPorcentajes() > 0 && (
                        <span className="ml-2 text-amber-600">
                          ⚠️ Faltan {(100 - getSumaPorcentajes()).toFixed(1)}%
                        </span>
                      )}
                      {getSumaPorcentajes() > 100 && (
                        <span className="ml-2 text-red-600">
                          ❌ Excede {(getSumaPorcentajes() - 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    {/* Barra de progreso */}
                    <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          getSumaPorcentajes() === 100 
                            ? 'bg-green-500' 
                            : getSumaPorcentajes() > 100 
                              ? 'bg-red-500' 
                              : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(getSumaPorcentajes(), 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              {integrantes.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <Building2 className="w-12 h-12 text-gray-400 dark:text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-300 font-medium">No hay integrantes agregados</p>
                  <p className="text-sm text-gray-400 dark:text-gray-300 mt-1">Use el botón "Añadir Integrante" para agregar empresas</p>
                </div>
              )}
              {integrantes.map((integrante: any, index: number) => (
                <motion.div
                  key={integrante.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {integrante.razonSocial.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{integrante.razonSocial}</h4>
                          <p className="text-green-700 font-medium">RUC: {integrante.ruc}</p>
                        </div>
                      </div>
                      {integrante.direccion && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Dirección:</p>
                          <p className="text-gray-900">{integrante.direccion}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Participación:</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={integrante.porcentajeParticipacion || ''}
                          onChange={(e: any) => actualizarPorcentajeIntegrante(
                            integrante.id, 
                            parseFloat(e.target.value) || 0
                          )}
                          className="w-24 px-3 py-1 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-bold"
                          placeholder="0.0"
                        />
                        <span className="text-sm font-bold text-gray-700">%</span>
                        {/* Barra visual individual */}
                        <div className="flex-1 max-w-xs">
                          <div className="bg-gray-200 rounded-full h-3">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(integrante.porcentajeParticipacion || 0, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-green-700 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Datos validados con SUNAT</span>
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarIntegrante(integrante.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar integrante"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Errores de validación */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                  <AlertCircle className="w-5 h-5" />
                  Por favor corrige los siguientes errores:
                </div>
                <ul className="text-red-700 text-sm space-y-1">
                  {errors.map((error: any, index: number) => (
                    <li key={index}>• {error.mensaje}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Botones de acción */}
            {(consorcio || integrantes.length > 0) && (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {loading ? 'Creando Consorcio...' : 'Crear Consorcio'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
        {/* Modal Agregar Consorcio */}
        {modalAgregarConsorcio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Agregar Consorcio</h3>
                  </div>
                  <button
                    onClick={() => {
                      setModalAgregarConsorcio(false);
                      setRucConsorcio('');
                      limpiarDatosRuc();
                      setErrors([]);
                    }}
                    className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RUC del Consorcio
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={rucConsorcio}
                        onChange={(e: any) => {
                          const valor = e.target.value.replace(/\D/g, '').substring(0, 11);
                          setRucConsorcio(valor);
                          setErrors(prev => prev.filter(error => error.campo !== 'ruc_consorcio'));
                        }}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.find(e => e.campo === 'ruc_consorcio') ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="20123456789"
                        maxLength={11}
                      />
                      <button
                        onClick={handleConsultarRucConsorcio}
                        disabled={consultandoTipo === 'consorcio' || !rucConsorcio || rucConsorcio.length !== 11}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {consultandoTipo === 'consorcio' ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                        {consultandoTipo === 'consorcio' ? 'Obteniendo datos...' : 'OBTENER DATOS'}
                      </button>
                    </div>
                    {errors.find(e => e.campo === 'ruc_consorcio') && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.find(e => e.campo === 'ruc_consorcio')?.mensaje}
                      </p>
                    )}
                  </div>
                  {/* Mostrar datos consultados */}
                  {consultandoTipo !== 'consorcio' && datosOriginalesRuc && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 text-green-800 font-medium mb-3">
                        <CheckCircle className="w-5 h-5" />
                        Información encontrada en SUNAT
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-700">
                            {datosOriginalesRuc.tipo_persona === 'NATURAL' ? 'Nombre:' : 'Razón Social:'}
                          </span>
                          <p className="text-gray-900 font-semibold text-lg">{datosOriginalesRuc.razon_social}</p>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">RUC: {datosOriginalesRuc.ruc}</p>
                          {/* Show DNI for persona natural */}
                          {datosOriginalesRuc.tipo_persona === 'NATURAL' && datosOriginalesRuc.representantes?.[0]?.numero_documento && (
                            <p className="text-gray-600 dark:text-gray-300 text-sm">DNI: {datosOriginalesRuc.representantes[0].numero_documento}</p>
                          )}
                        </div>
                        {/* Estado */}
                        {datosOriginalesRuc.registro?.estado_sunat && (
                          <div>
                            <span className="font-medium text-gray-700">Estado:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              datosOriginalesRuc.registro.estado_sunat.includes('ACTIVO')
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {datosOriginalesRuc.registro.estado_sunat}
                            </span>
                          </div>
                        )}
                        {/* Dirección */}
                        {(datosOriginalesRuc.contacto.direccion || datosOriginalesRuc.contacto.domicilio_fiscal) && (
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-700">Dirección:</span>
                            <p className="text-gray-900">{datosOriginalesRuc.contacto.direccion || datosOriginalesRuc.contacto.domicilio_fiscal}</p>
                          </div>
                        )}
                        {/* Representantes */}
                        {datosOriginalesRuc.tipo_persona !== 'NATURAL' && datosOriginalesRuc.representantes && datosOriginalesRuc.representantes.length > 0 && (
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-700">Representantes Legales:</span>
                            <div className="space-y-3 mt-2">
                              {datosOriginalesRuc.representantes.map((representante: any, index: number) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                                  <p className="text-gray-900 font-semibold">{representante.nombre}</p>
                                  {representante.cargo && (
                                    <p className="text-blue-600 text-sm font-medium">{representante.cargo}</p>
                                  )}
                                  {representante.numero_documento && (
                                    <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                                      {representante.tipo_documento || 'DNI'}: {representante.numero_documento}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Especialidades */}
                        {datosOriginalesRuc.especialidades && datosOriginalesRuc.especialidades.length > 0 && (
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-700">Especialidades:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {datosOriginalesRuc.especialidades.slice(0, 5).map((esp: string, index: number) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                  {esp}
                                </span>
                              ))}
                              {datosOriginalesRuc.especialidades.length > 5 && (
                                <span className="text-xs text-gray-500 dark:text-gray-300 italic px-2 py-1">
                                  + {datosOriginalesRuc.especialidades.length - 5} más
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => {
                            setModalAgregarConsorcio(false);
                            setRucConsorcio('');
                            limpiarDatosRuc();
                          }}
                          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={confirmarAgregarConsorcio}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Confirmar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Modal Agregar Integrante */}
        {modalAgregarIntegrante && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Agregar Integrante</h3>
                  </div>
                  <button
                    onClick={() => {
                      setModalAgregarIntegrante(false);
                      setEmpresaSeleccionadaId('');
                      setPorcentajeIntegrante(0);
                      setErrors([]);
                    }}
                    className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-6">
                  {/* Selector de Modo: Seleccionar Existente o Consultar Nuevo */}
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <button
                      onClick={() => {
                        setModoIntegrante('seleccionar');
                        setRucIntegrante('');
                        limpiarDatosRuc();
                        setErrors(prev => prev.filter(e => e.campo !== 'ruc_integrante'));
                      }}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                        modoIntegrante === 'seleccionar'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Seleccionar Empresa Existente
                    </button>
                    <button
                      onClick={() => {
                        setModoIntegrante('consultar');
                        setEmpresaSeleccionadaId('');
                        setErrors(prev => prev.filter(e => e.campo !== 'empresa_integrante'));
                      }}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                        modoIntegrante === 'consultar'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Consultar RUC Nuevo
                    </button>
                  </div>

                  {/* Modo: Seleccionar Empresa Existente */}
                  {modoIntegrante === 'seleccionar' && (
                    <>
                      {/* Selector de Empresa */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Seleccionar Empresa del Módulo Empresas
                        </label>
                        <select
                      value={empresaSeleccionadaId}
                      onChange={(e) => {
                        setEmpresaSeleccionadaId(e.target.value);
                        setErrors(prev => prev.filter(error => error.campo !== 'empresa_integrante'));
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.find(e => e.campo === 'empresa_integrante') ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">-- Seleccione una empresa --</option>
                      {empresas.filter(entidad => {
                        // Solo mostrar empresas (no consorcios)
                        if (entidad.tipo_entidad !== 'EMPRESA' || !entidad.datos_empresa) return false;

                        // Filtrar empresas que no estén ya agregadas
                        const yaAgregada = integrantes.some(i => i.ruc === entidad.datos_empresa!.ruc) || consorcio?.ruc === entidad.datos_empresa!.ruc;
                        return !yaAgregada;
                      }).map(entidad => (
                        <option key={entidad.id} value={entidad.id.toString()}>
                          {entidad.datos_empresa!.razon_social} - RUC: {entidad.datos_empresa!.ruc}
                        </option>
                      ))}
                    </select>
                    {errors.find(e => e.campo === 'empresa_integrante') && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.find(e => e.campo === 'empresa_integrante')?.mensaje}
                      </p>
                    )}
                  </div>

                  {/* Campo porcentaje */}
                  {empresaSeleccionadaId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Porcentaje de Participación (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={porcentajeIntegrante || ''}
                        onChange={(e: any) => setPorcentajeIntegrante(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0.0"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                        Porcentaje asignado en el consorcio (opcional, se puede ajustar después)
                      </p>
                    </div>
                  )}

                  {/* Mostrar datos de empresa seleccionada */}
                  {empresaSeleccionadaId && (() => {
                    const entidadSeleccionada = empresas.find(e => e.id.toString() === empresaSeleccionadaId);
                    const datosEmpresa = entidadSeleccionada?.datos_empresa;
                    return entidadSeleccionada && datosEmpresa ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-2 text-green-800 font-medium mb-3">
                          <CheckCircle className="w-5 h-5" />
                          Empresa registrada en el sistema
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-700">Razón Social:</span>
                            <p className="text-gray-900 font-semibold text-lg">{datosEmpresa.razon_social}</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">RUC: {datosEmpresa.ruc}</p>
                          </div>
                          {datosEmpresa.categoria_contratista && (
                            <div>
                              <span className="font-medium text-gray-700">Categoría:</span>
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                datosEmpresa.categoria_contratista === 'EJECUTORA'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {datosEmpresa.categoria_contratista}
                              </span>
                            </div>
                          )}
                          {entidadSeleccionada.estado && (
                            <div>
                              <span className="font-medium text-gray-700">Estado:</span>
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                entidadSeleccionada.estado === 'ACTIVO'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {entidadSeleccionada.estado}
                              </span>
                            </div>
                          )}
                          {datosEmpresa.direccion && (
                            <div className="md:col-span-2">
                              <span className="font-medium text-gray-700">Dirección:</span>
                              <p className="text-gray-900">{datosEmpresa.direccion}</p>
                            </div>
                          )}
                          {datosEmpresa.representante_legal && (
                            <div className="md:col-span-2">
                              <span className="font-medium text-gray-700">Representante Legal:</span>
                              <p className="text-gray-900">{datosEmpresa.representante_legal}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : null;
                  })()}
                    </>
                  )}

                  {/* Modo: Consultar RUC Nuevo */}
                  {modoIntegrante === 'consultar' && (
                    <>
                      {/* Campo RUC con botón OBTENER DATOS */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          RUC del Integrante
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={rucIntegrante}
                            onChange={(e: any) => {
                              const valor = e.target.value.replace(/\D/g, '').substring(0, 11);
                              setRucIntegrante(valor);
                              setErrors(prev => prev.filter(error => error.campo !== 'ruc_integrante'));
                            }}
                            className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                              errors.find(e => e.campo === 'ruc_integrante') ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="20123456789"
                            maxLength={11}
                            disabled={consultandoTipo === 'integrante' || guardandoEmpresa}
                          />
                          <button
                            onClick={handleConsultarRucIntegrante}
                            disabled={consultandoTipo === 'integrante' || guardandoEmpresa || !rucIntegrante || rucIntegrante.length !== 11}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[180px]"
                          >
                            {consultandoTipo === 'integrante' ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Consultando...
                              </>
                            ) : guardandoEmpresa ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Guardando...
                              </>
                            ) : (
                              <>
                                <Search className="w-4 h-4" />
                                OBTENER DATOS
                              </>
                            )}
                          </button>
                        </div>
                        {errors.find(e => e.campo === 'ruc_integrante') && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.find(e => e.campo === 'ruc_integrante')?.mensaje}
                          </p>
                        )}
                      </div>

                      {/* Campo porcentaje para modo consultar */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Porcentaje de Participación (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={porcentajeIntegrante || ''}
                          onChange={(e: any) => setPorcentajeIntegrante(parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="0.0"
                          disabled={consultandoTipo === 'integrante' || guardandoEmpresa}
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                          Porcentaje asignado en el consorcio (opcional, se puede ajustar después)
                        </p>
                      </div>

                      {/* Indicador de guardado exitoso */}
                      {!guardandoEmpresa && !consultandoTipo && datosOriginalesRuc && rucIntegrante === datosOriginalesRuc.ruc && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-green-50 border-2 border-green-200 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                            <CheckCircle className="w-5 h-5" />
                            Empresa registrada exitosamente
                          </div>
                          <p className="text-sm text-green-700">
                            La empresa ha sido guardada en el módulo Empresas y agregada como integrante del consorcio.
                          </p>
                        </motion.div>
                      )}
                    </>
                  )}

                  {/* Botones de acción */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setModalAgregarIntegrante(false);
                        setEmpresaSeleccionadaId('');
                        setPorcentajeIntegrante(0);
                        setRucIntegrante('');
                        setModoIntegrante('seleccionar');
                        limpiarDatosRuc();
                        setErrors([]);
                      }}
                      disabled={consultandoTipo === 'integrante' || guardandoEmpresa}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </button>

                    {/* Solo mostrar botón Agregar en modo seleccionar */}
                    {modoIntegrante === 'seleccionar' && (
                      <button
                        onClick={confirmarAgregarIntegrante}
                        disabled={!empresaSeleccionadaId}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Agregar Integrante
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
export default FormularioConsorcio;