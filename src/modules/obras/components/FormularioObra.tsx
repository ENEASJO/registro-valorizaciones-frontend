import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Construction, 
  DollarSign, 
  Calendar, 
  MapPin, 
  FileText, 
  Users,
  AlertCircle,
  CheckCircle,
  Calculator,
  Clock,
  Scale,
  HelpCircle
} from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import type { 
  ObraForm, 
  ProfesionalForm, 
  CrearObraParams,
  TipoObra,
  ModalidadEjecucion,
  SistemaContratacion,
  LeyContratacion,
  ProcedimientoSeleccionLey30225,
  ProcedimientoSeleccionLey32069,
  ProcedimientoSeleccion
} from '../../../types/obra.types';
import { 
  TIPOS_OBRA, 
  MODALIDADES_EJECUCION, 
  SISTEMAS_CONTRATACION,
  CONFIG_NUMERO_CONTRATO,
  PROCEDIMIENTOS_LEY_30225,
  PROCEDIMIENTOS_LEY_32069,
  LEYES_CONTRATACION,
  TOOLTIPS_SISTEMAS_CONTRATACION
} from '../../../types/obra.types';
import { useEntidadesContratistas } from '../../../hooks/useEmpresas';
import { useValidacionesObra } from '../../../hooks/useObras';
import PlantelProfesional from './PlantelProfesional';

interface FormularioObraProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: CrearObraParams) => Promise<void>;
  obra?: Partial<ObraForm>;
  loading?: boolean;
  title?: string;
}

interface FormData extends ObraForm {
  errors: Record<string, string>;
}

const FormularioObra: React.FC<FormularioObraProps> = ({
  isOpen,
  onClose,
  onSubmit,
  obra,
  loading = false,
  title = "Nueva Obra"
}) => {
  const { entidades } = useEntidadesContratistas();
  const { validarObraForm } = useValidacionesObra();


  const [tabActivo, setTabActivo] = useState('general');
  const [formData, setFormData] = useState<FormData>({
    numero_contrato: '',
    nombre: '',
    codigo_interno: '',
    entidad_ejecutora_id: '',
    entidad_supervisora_id: '',
    monto_ejecucion: 0,
    monto_supervision: 0,
    plazo_ejecucion_dias: 0,
    fecha_inicio: '',
    fecha_termino: '',
    ubicacion: '',
    distrito: '',
    provincia: 'Lima',
    departamento: 'Lima',
    tipo_obra: undefined,
    modalidad_ejecucion: 'CONTRATA',
    sistema_contratacion: 'SUMA_ALZADA',
    descripcion: '',
    observaciones: '',
    errors: {}
  });

  const [plantelProfesional, setPlantelProfesional] = useState<ProfesionalForm[]>([]);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error' | 'warning'; texto: string } | null>(null);

  // Inicializar formulario con datos de obra existente
  useEffect(() => {
    if (obra && isOpen) {
      setFormData({
        ...obra,
        provincia: obra.provincia || 'Lima',
        departamento: obra.departamento || 'Lima',
        modalidad_ejecucion: obra.modalidad_ejecucion || 'CONTRATA',
        sistema_contratacion: obra.sistema_contratacion || 'SUMA_ALZADA',
        errors: {}
      } as FormData);
      
      // Resetear plantel profesional para obra nueva
      if (!obra.numero_contrato) {
        setPlantelProfesional([]);
      }
    } else if (isOpen) {
      // Resetear formulario para obra nueva
      setFormData({
        numero_contrato: '',
        nombre: '',
        codigo_interno: '',
        entidad_ejecutora_id: '',
        entidad_supervisora_id: '',
        monto_ejecucion: 0,
        monto_supervision: 0,
        plazo_ejecucion_dias: 0,
        fecha_inicio: '',
        fecha_termino: '',
        ubicacion: '',
        distrito: '',
        provincia: 'Lima',
        departamento: 'Lima',
        tipo_obra: undefined,
        modalidad_ejecucion: 'CONTRATA',
        sistema_contratacion: 'SUMA_ALZADA',
        descripcion: '',
        observaciones: '',
        errors: {}
      });
      setPlantelProfesional([]);
    }

    // Enfocar el primer campo cuando se abre el modal
    if (isOpen) {
      setTimeout(() => {
        const firstInput = document.querySelector('#numero_contrato_input') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }
  }, [obra, isOpen]);

  // Manejar tecla ESC para cerrar modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Mostrar mensaje temporal
  const mostrarMensaje = (tipo: 'success' | 'error' | 'warning', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 5000);
  };

  // Actualizar campo del formulario
  const actualizarCampo = (campo: keyof ObraForm, valor: any) => {
    setFormData(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[campo]; // Limpiar error del campo
      
      let newData = {
        ...prev,
        [campo]: valor,
        errors: newErrors
      } as FormData;

      // Determinar automáticamente la ley aplicable según fecha de contrato
      if (campo === 'fecha_contrato' && valor) {
        const fechaContrato = new Date(valor);
        const fechaCorteLey32069 = new Date('2025-04-22'); // 22 de abril de 2025
        
        newData.ley_aplicable = fechaContrato >= fechaCorteLey32069 ? 'LEY_32069' : 'LEY_30225';
        
        // Limpiar procedimiento de selección si hay cambio de ley
        if (prev.ley_aplicable !== newData.ley_aplicable) {
          newData.procedimiento_seleccion = undefined;
        }
      }
      
      return newData;
    });
  };

  // Validar formulario en tiempo real
  const validarFormulario = (): boolean => {
    const resultado = validarObraForm(formData);
    
    const errorsObj: Record<string, string> = {};
    resultado.errores.forEach(error => {
      errorsObj[error.campo] = error.mensaje;
    });

    setFormData(prev => ({ 
      ...prev, 
      errors: errorsObj
    } as FormData));
    return resultado.valido;
  };

  // Calcular valores automáticos
  const calcularNumeroValorizaciones = (plazoDias: number): number => {
    return Math.ceil(plazoDias / 30);
  };

  const calcularFechaFin = (fechaInicio: string, plazoDias: number): string => {
    if (!fechaInicio || !plazoDias) return '';
    
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() + plazoDias);
    return fecha.toISOString().split('T')[0];
  };

  const calcularMontoTotal = (): number => {
    return formData.monto_ejecucion + formData.monto_supervision;
  };

  // Obtener procedimientos disponibles según ley aplicable
  const getProcedimientosDisponibles = () => {
    if (formData.ley_aplicable === 'LEY_32069') {
      return PROCEDIMIENTOS_LEY_32069;
    } else if (formData.ley_aplicable === 'LEY_30225') {
      return PROCEDIMIENTOS_LEY_30225;
    }
    return {};
  };

  // Validar coherencia entre sistema de contratación y tipo de obra
  const esSistemaCoherente = (sistema: SistemaContratacion, tipoObra: TipoObra): boolean => {
    // Definir recomendaciones por tipo de obra
    const recomendaciones: Record<TipoObra, SistemaContratacion[]> = {
      'CARRETERA': ['PRECIOS_UNITARIOS', 'SUMA_ALZADA'],
      'EDIFICACION': ['SUMA_ALZADA', 'PRECIOS_UNITARIOS', 'LLAVE_EN_MANO'],
      'SANEAMIENTO': ['PRECIOS_UNITARIOS', 'SUMA_ALZADA'],
      'ELECTRICIDAD': ['SUMA_ALZADA', 'PRECIOS_UNITARIOS'],
      'PUENTE': ['SUMA_ALZADA', 'PRECIOS_UNITARIOS'],
      'VEREDAS_PISTAS': ['SUMA_ALZADA', 'PRECIOS_UNITARIOS'],
      'PARQUES_JARDINES': ['SUMA_ALZADA', 'PRECIOS_UNITARIOS'],
      'DRENAJE_PLUVIAL': ['PRECIOS_UNITARIOS', 'SUMA_ALZADA'],
      'OTROS': ['SUMA_ALZADA', 'PRECIOS_UNITARIOS', 'LLAVE_EN_MANO']
    };

    return recomendaciones[tipoObra]?.includes(sistema) ?? true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      mostrarMensaje('error', 'Por favor corrige los errores en el formulario');
      return;
    }

    try {
      const { errors, ...obraData } = formData;
      
      const params: CrearObraParams = {
        obra: obraData,
        plantel_profesional: plantelProfesional
      };

      await onSubmit(params);
      mostrarMensaje('success', 'Obra creada correctamente');
      
      // Pequeño delay antes de cerrar para mostrar el mensaje
      setTimeout(onClose, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear obra';
      mostrarMensaje('error', errorMessage);
    }
  };

  // Generar número de contrato sugerido
  const generarNumeroContrato = () => {
    const año = new Date().getFullYear();
    const numeroSugerido = `N.º 01-${año}-MDSM/GM`;
    actualizarCampo('numero_contrato', numeroSugerido);
  };

  // Calcular monto de supervisión sugerido (10% del monto de ejecución)
  const calcularSupervisionSugerida = () => {
    const supervisionSugerida = Math.round(formData.monto_ejecucion * 0.1);
    actualizarCampo('monto_supervision', supervisionSugerida);
  };

  if (!isOpen) return null;

  const fechaFinCalculada = calcularFechaFin(formData.fecha_inicio, formData.plazo_ejecucion_dias);
  const numeroValorizaciones = calcularNumeroValorizaciones(formData.plazo_ejecucion_dias);
  const montoTotal = calcularMontoTotal();

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay - Fondo semitransparente */}
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Modal Container - Contenedor del modal */}
        <div className="inline-block w-full max-w-6xl my-8 text-left align-middle transition-all transform relative z-10">
          {/* Modal Content - Contenido del modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white shadow-2xl rounded-lg px-6 py-4 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Construction className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mensaje de estado */}
          {mensaje && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
                mensaje.tipo === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : mensaje.tipo === 'warning'
                  ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {mensaje.tipo === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{mensaje.texto}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Tabs */}
            <Tabs.Root value={tabActivo} onValueChange={setTabActivo}>
              <Tabs.List className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                <Tabs.Trigger 
                  value="general"
                  className="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Información General
                </Tabs.Trigger>
                <Tabs.Trigger 
                  value="financiero"
                  className="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Información Financiera
                </Tabs.Trigger>
                <Tabs.Trigger 
                  value="cronograma"
                  className="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Cronograma
                </Tabs.Trigger>
                <Tabs.Trigger 
                  value="plantel"
                  className="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Plantel Profesional
                </Tabs.Trigger>
              </Tabs.List>

              {/* Tab: Información General */}
              <Tabs.Content value="general" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Número de contrato */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Contrato *
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="numero_contrato_input"
                        type="text"
                        value={formData.numero_contrato}
                        onChange={(e) => actualizarCampo('numero_contrato', e.target.value)}
                        className={`input-field flex-1 ${formData.errors.numero_contrato ? 'border-red-300' : ''}`}
                        placeholder={CONFIG_NUMERO_CONTRATO.ejemplo}
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={generarNumeroContrato}
                        className="btn-secondary px-3"
                        title="Generar número sugerido"
                      >
                        <Calculator className="w-4 h-4" />
                      </button>
                    </div>
                    {formData.errors.numero_contrato && (
                      <p className="text-sm text-red-600 mt-1">{formData.errors.numero_contrato}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Formato: {CONFIG_NUMERO_CONTRATO.formato}
                    </p>
                  </div>

                  {/* Nombre de la obra */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Obra *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => actualizarCampo('nombre', e.target.value)}
                      className={`input-field ${formData.errors.nombre ? 'border-red-300' : ''}`}
                      placeholder="Nombre completo y descriptivo de la obra"
                    />
                    {formData.errors.nombre && (
                      <p className="text-sm text-red-600 mt-1">{formData.errors.nombre}</p>
                    )}
                  </div>

                  {/* Código interno */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Interno
                    </label>
                    <input
                      type="text"
                      value={formData.codigo_interno || ''}
                      onChange={(e) => actualizarCampo('codigo_interno', e.target.value)}
                      className="input-field"
                      placeholder="OBR001"
                    />
                  </div>

                  {/* Tipo de obra */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Obra
                    </label>
                    <select
                      value={formData.tipo_obra || ''}
                      onChange={(e) => actualizarCampo('tipo_obra', e.target.value as TipoObra)}
                      className="input-field"
                    >
                      <option value="">Seleccionar tipo de obra</option>
                      {Object.entries(TIPOS_OBRA).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Modalidad de ejecución */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modalidad de Ejecución
                    </label>
                    <select
                      value={formData.modalidad_ejecucion}
                      onChange={(e) => actualizarCampo('modalidad_ejecucion', e.target.value as ModalidadEjecucion)}
                      className="input-field"
                    >
                      {Object.entries(MODALIDADES_EJECUCION).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fecha de contrato */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Contrato *
                    </label>
                    <input
                      type="date"
                      value={formData.fecha_contrato}
                      onChange={(e) => actualizarCampo('fecha_contrato', e.target.value)}
                      className={`input-field ${formData.errors.fecha_contrato ? 'border-red-300' : ''}`}
                    />
                    {formData.errors.fecha_contrato && (
                      <p className="text-sm text-red-600 mt-1">{formData.errors.fecha_contrato}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Determina automáticamente la ley aplicable
                    </p>
                  </div>
                </div>
                
                {/* Normativa Peruana */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    <Scale className="w-5 h-5 inline mr-2" />
                    Normativa de Contratación Pública
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ley aplicable (readonly) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ley Aplicable
                        <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                      </label>
                      <div className={`input-field bg-gray-50 border-dashed ${
                        formData.ley_aplicable === 'LEY_32069' 
                          ? 'border-green-300 text-green-800 bg-green-50' 
                          : 'border-blue-300 text-blue-800 bg-blue-50'
                      }`}>
                        {formData.ley_aplicable 
                          ? LEYES_CONTRATACION[formData.ley_aplicable]
                          : 'Seleccione fecha de contrato'
                        }
                      </div>
                      {formData.fecha_contrato && (
                        <p className={`text-xs mt-1 ${
                          formData.ley_aplicable === 'LEY_32069' 
                            ? 'text-green-600' 
                            : 'text-blue-600'
                        }`}>
                          {formData.ley_aplicable === 'LEY_32069' 
                            ? '✓ Nueva ley desde 22/04/2025' 
                            : 'ℹ Ley anterior al 22/04/2025'
                          }
                        </p>
                      )}
                    </div>

                    {/* Procedimiento de selección */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Procedimiento de Selección
                      </label>
                      <select
                        value={formData.procedimiento_seleccion || ''}
                        onChange={(e) => actualizarCampo('procedimiento_seleccion', e.target.value as ProcedimientoSeleccion)}
                        className={`input-field ${!formData.ley_aplicable ? 'bg-gray-50 text-gray-400' : ''}`}
                        disabled={!formData.ley_aplicable}
                      >
                        <option value="">
                          {formData.ley_aplicable 
                            ? 'Seleccionar procedimiento'
                            : 'Primero seleccione fecha de contrato'
                          }
                        </option>
                        {Object.entries(getProcedimientosDisponibles()).map(([key, label]) => (
                          <option key={key} value={key}>{label as string}</option>
                        ))}
                      </select>
                      {formData.ley_aplicable && (
                        <p className="text-xs text-gray-500 mt-1">
                          Procedimientos disponibles según {LEYES_CONTRATACION[formData.ley_aplicable]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Sistema de contratación */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Sistema de Contratación
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sistema de Contratación *
                    </label>
                    <select
                      value={formData.sistema_contratacion}
                      onChange={(e) => actualizarCampo('sistema_contratacion', e.target.value as SistemaContratacion)}
                      className={`input-field ${
                        formData.tipo_obra && formData.sistema_contratacion && !esSistemaCoherente(formData.sistema_contratacion, formData.tipo_obra)
                          ? 'border-yellow-300 bg-yellow-50'
                          : ''
                      }`}
                    >
                      {Object.entries(SISTEMAS_CONTRATACION).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    
                    {/* Tooltip explicativo */}
                    {formData.sistema_contratacion && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-800 font-medium mb-1">
                          {SISTEMAS_CONTRATACION[formData.sistema_contratacion]}
                        </p>
                        <p className="text-xs text-blue-700">
                          {TOOLTIPS_SISTEMAS_CONTRATACION[formData.sistema_contratacion] || 'Información no disponible'}
                        </p>
                      </div>
                    )}
                    
                    {/* Advertencia de coherencia */}
                    {formData.tipo_obra && formData.sistema_contratacion && !esSistemaCoherente(formData.sistema_contratacion, formData.tipo_obra) && (
                      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800 font-medium flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Revise la coherencia
                        </p>
                        <p className="text-xs text-yellow-700">
                          Este sistema de contratación puede no ser el más adecuado para el tipo de obra seleccionado.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Entidades contratistas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Entidades Contratistas
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Entidad ejecutora */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entidad Ejecutora *
                      </label>
                      <select
                        value={formData.entidad_ejecutora_id}
                        onChange={(e) => actualizarCampo('entidad_ejecutora_id', e.target.value)}
                        className={`input-field ${formData.errors.entidad_ejecutora_id ? 'border-red-300' : ''}`}
                      >
                        <option value="">Seleccionar entidad ejecutora</option>
                        {entidades.map(entidad => (
                          <option key={entidad.id} value={entidad.id}>
                            {entidad.nombre_completo} ({entidad.tipo_entidad})
                          </option>
                        ))}
                      </select>
                      {formData.errors.entidad_ejecutora_id && (
                        <p className="text-sm text-red-600 mt-1">{formData.errors.entidad_ejecutora_id}</p>
                      )}
                    </div>

                    {/* Entidad supervisora */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entidad Supervisora *
                      </label>
                      <select
                        value={formData.entidad_supervisora_id}
                        onChange={(e) => actualizarCampo('entidad_supervisora_id', e.target.value)}
                        className={`input-field ${formData.errors.entidad_supervisora_id ? 'border-red-300' : ''}`}
                      >
                        <option value="">Seleccionar entidad supervisora</option>
                        {entidades
                          .filter(entidad => entidad.id !== formData.entidad_ejecutora_id)
                          .map(entidad => (
                          <option key={entidad.id} value={entidad.id}>
                            {entidad.nombre_completo} ({entidad.tipo_entidad})
                          </option>
                        ))}
                      </select>
                      {formData.errors.entidad_supervisora_id && (
                        <p className="text-sm text-red-600 mt-1">{formData.errors.entidad_supervisora_id}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    <MapPin className="w-5 h-5 inline mr-2" />
                    Ubicación
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Departamento
                      </label>
                      <input
                        type="text"
                        value={formData.departamento}
                        onChange={(e) => actualizarCampo('departamento', e.target.value)}
                        className="input-field"
                        placeholder="Lima"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provincia
                      </label>
                      <input
                        type="text"
                        value={formData.provincia}
                        onChange={(e) => actualizarCampo('provincia', e.target.value)}
                        className="input-field"
                        placeholder="Lima"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Distrito
                      </label>
                      <input
                        type="text"
                        value={formData.distrito}
                        onChange={(e) => actualizarCampo('distrito', e.target.value)}
                        className="input-field"
                        placeholder="San Martín de Porres"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación Específica
                    </label>
                    <textarea
                      value={formData.ubicacion || ''}
                      onChange={(e) => actualizarCampo('ubicacion', e.target.value)}
                      className="input-field"
                      rows={2}
                      placeholder="Descripción detallada de la ubicación de la obra"
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción de la Obra
                  </label>
                  <textarea
                    value={formData.descripcion || ''}
                    onChange={(e) => actualizarCampo('descripcion', e.target.value)}
                    className="input-field"
                    rows={4}
                    placeholder="Descripción técnica detallada de la obra, objetivos y alcance"
                  />
                </div>
              </Tabs.Content>

              {/* Tab: Información Financiera */}
              <Tabs.Content value="financiero" className="space-y-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    <DollarSign className="w-5 h-5 inline mr-2" />
                    Montos del Contrato
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monto de ejecución */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto de Ejecución (S/) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          S/
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.monto_ejecucion}
                          onChange={(e) => actualizarCampo('monto_ejecucion', parseFloat(e.target.value) || 0)}
                          className={`input-field pl-10 ${formData.errors.monto_ejecucion ? 'border-red-300' : ''}`}
                          placeholder="0.00"
                        />
                      </div>
                      {formData.errors.monto_ejecucion && (
                        <p className="text-sm text-red-600 mt-1">{formData.errors.monto_ejecucion}</p>
                      )}
                    </div>

                    {/* Monto de supervisión */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto de Supervisión (S/) *
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            S/
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.monto_supervision}
                            onChange={(e) => actualizarCampo('monto_supervision', parseFloat(e.target.value) || 0)}
                            className={`input-field pl-10 ${formData.errors.monto_supervision ? 'border-red-300' : ''}`}
                            placeholder="0.00"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={calcularSupervisionSugerida}
                          className="btn-secondary px-3"
                          title="Calcular 10% del monto de ejecución"
                        >
                          10%
                        </button>
                      </div>
                      {formData.errors.monto_supervision && (
                        <p className="text-sm text-red-600 mt-1">{formData.errors.monto_supervision}</p>
                      )}
                    </div>
                  </div>

                  {/* Resumen de montos */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Resumen Financiero</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monto de Ejecución:</span>
                        <span className="font-medium">S/ {formData.monto_ejecucion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monto de Supervisión:</span>
                        <span className="font-medium">S/ {formData.monto_supervision.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-2">
                        <div className="flex justify-between text-base font-semibold">
                          <span className="text-gray-900">Monto Total:</span>
                          <span className="text-primary-600">S/ {montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>

                    {formData.monto_supervision > 0 && formData.monto_ejecucion > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <div className="text-sm text-gray-600">
                          Porcentaje de supervisión: <span className="font-medium">
                            {((formData.monto_supervision / formData.monto_ejecucion) * 100).toFixed(1)}%
                          </span>
                          {formData.monto_supervision / formData.monto_ejecucion > 0.2 && (
                            <span className="ml-2 text-yellow-600">
                              (Excede recomendación del 20%)
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Tabs.Content>

              {/* Tab: Cronograma */}
              <Tabs.Content value="cronograma" className="space-y-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    <Calendar className="w-5 h-5 inline mr-2" />
                    Programación de la Obra
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Fecha de inicio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Inicio de Obra *
                      </label>
                      <input
                        type="date"
                        value={formData.fecha_inicio}
                        onChange={(e) => actualizarCampo('fecha_inicio', e.target.value)}
                        className={`input-field ${formData.errors.fecha_inicio ? 'border-red-300' : ''}`}
                        min={formData.fecha_contrato || new Date().toISOString().split('T')[0]}
                      />
                      {formData.errors.fecha_inicio && (
                        <p className="text-sm text-red-600 mt-1">{formData.errors.fecha_inicio}</p>
                      )}
                      {formData.fecha_contrato && (
                        <p className="text-xs text-gray-500 mt-1">
                          No puede ser anterior a la fecha del contrato
                        </p>
                      )}
                    </div>

                    {/* Plazo de ejecución */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Plazo de Ejecución (días) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          value={formData.plazo_ejecucion_dias}
                          onChange={(e) => actualizarCampo('plazo_ejecucion_dias', parseInt(e.target.value) || 0)}
                          className={`input-field pr-12 ${formData.errors.plazo_ejecucion_dias ? 'border-red-300' : ''}`}
                          placeholder="180"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          días
                        </span>
                      </div>
                      {formData.errors.plazo_ejecucion_dias && (
                        <p className="text-sm text-red-600 mt-1">{formData.errors.plazo_ejecucion_dias}</p>
                      )}
                    </div>

                    {/* Fecha de término */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Término/Culminación
                      </label>
                      <input
                        type="date"
                        value={formData.fecha_termino || ''}
                        onChange={(e) => actualizarCampo('fecha_termino', e.target.value)}
                        className={`input-field ${formData.errors.fecha_termino ? 'border-red-300' : ''}`}
                        min={formData.fecha_inicio || new Date().toISOString().split('T')[0]}
                      />
                      {formData.errors.fecha_termino && (
                        <p className="text-sm text-red-600 mt-1">{formData.errors.fecha_termino}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Fecha planificada de término de la obra (opcional)
                      </p>
                    </div>
                  </div>

                  {/* Información calculada */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-medium text-blue-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Información Calculada
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-blue-700">Fecha de Fin Prevista</div>
                        <div className="font-semibold text-blue-900">
                          {fechaFinCalculada ? 
                            new Date(fechaFinCalculada).toLocaleDateString('es-PE') : 
                            '-'
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-700">Número de Valorizaciones</div>
                        <div className="font-semibold text-blue-900">
                          {numeroValorizaciones || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-700">Plazo en Meses</div>
                        <div className="font-semibold text-blue-900">
                          {formData.plazo_ejecucion_dias ? 
                            (formData.plazo_ejecucion_dias / 30).toFixed(1) : 
                            '0'
                          }
                        </div>
                      </div>
                    </div>

                    {numeroValorizaciones > 0 && (
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="text-sm text-blue-700 mb-2">
                          Se generarán {numeroValorizaciones} valorizaciones programadas automáticamente
                        </div>
                        <div className="text-xs text-blue-600">
                          * Una valorización cada 30 días calendario
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Tabs.Content>

              {/* Tab: Plantel Profesional */}
              <Tabs.Content value="plantel" className="space-y-6">
                <PlantelProfesional
                  profesionales={plantelProfesional}
                  onProfesionalesChange={setPlantelProfesional}
                  fechaInicio={formData.fecha_inicio}
                  fechaFin={fechaFinCalculada}
                />
              </Tabs.Content>
            </Tabs.Root>

            {/* Observaciones generales */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones Generales
              </label>
              <textarea
                value={formData.observaciones || ''}
                onChange={(e) => actualizarCampo('observaciones', e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Observaciones adicionales sobre la obra"
              />
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 min-w-[120px] justify-center"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {loading ? 'Creando...' : 'Crear Obra'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FormularioObra;