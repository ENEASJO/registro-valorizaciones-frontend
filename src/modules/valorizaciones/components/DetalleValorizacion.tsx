import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  Download,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  Building,
  Calculator,
  GitBranch,
  Paperclip,
  Eye,
  MessageSquare,
  TrendingUp,
  Archive
} from 'lucide-react';
import { useValorizaciones } from '../../../hooks/useValorizaciones';
import { useObras } from '../../../hooks/useObras';
import { useEntidadesContratistas } from '../../../hooks/useEmpresas';
import TablaPartidas from './TablaPartidas';
import type { EstadoValorizacionEjecucion } from '../../../types/valorizacion.types';

interface Props {
  valorizacionId: string;
  tipo: 'ejecucion' | 'supervision';
  onBack: () => void;
}
const DetalleValorizacion = ({ valorizacionId, tipo, onBack }: Props) => {
  const [showCambioEstado, setShowCambioEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<string>('');
  const [observaciones, setObservaciones] = useState('');
  const [showPartidas, setShowPartidas] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'partidas' | 'historial' | 'documentos'>('general');
  // Hooks
  const {
    valorizacionesEjecucion,
    valorizacionesSupervision,
    cambiarEstadoValorizacion,
    formatearMoneda,
    partidas,
    cargarPartidasPorObra,
    loading
  } = useValorizaciones();
  const { obtenerObraPorId } = useObras();
  const { entidades } = useEntidadesContratistas();
  const [obra, setObra] = useState<any>(null);
  
  // Buscar la valorización
  const valorizacion = tipo === 'ejecucion' 
    ? valorizacionesEjecucion.find(v => v.id === valorizacionId)
    : valorizacionesSupervision.find(v => v.id === valorizacionId);

  // Cargar obra
  useEffect(() => {
    if (valorizacion) {
      obtenerObraPorId(valorizacion.obra_id).then(obraData => {
        setObra(obraData);
      }).catch(error => {
        console.error('Error cargando obra:', error);
      });
    }
  }, [valorizacion, obtenerObraPorId]);
  // Cargar partidas si es valorización de ejecución
  useEffect(() => {
    if (valorizacion && tipo === 'ejecucion') {
      cargarPartidasPorObra(valorizacion.obra_id);
    }
  }, [valorizacion, tipo, cargarPartidasPorObra]);
  // Obtener entidad ejecutora
  const entidadEjecutora = obra ? entidades.find(e => e.id === obra.entidad_ejecutora_id) : null;
  const entidadSupervisora = obra ? entidades.find(e => e.id === obra.entidad_supervisora_id) : null;
  // Función para obtener icono de estado
  const getEstadoIcon = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'APROBADA':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'EN_REVISION':
      case 'PRESENTADA':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'BORRADOR':
        return <Edit className="w-5 h-5 text-gray-500 dark:text-gray-300" />;
      case 'OBSERVADA':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'PAGADA':
        return <DollarSign className="w-5 h-5 text-blue-500" />;
      case 'RECHAZADA':
        return <Archive className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500 dark:text-gray-300" />;
    }
  };
  // Función para obtener color de estado
  const getEstadoColor = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'APROBADA':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EN_REVISION':
      case 'PRESENTADA':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'BORRADOR':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'OBSERVADA':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'PAGADA':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RECHAZADA':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  // Función para cambiar estado
  const handleCambiarEstado = async () => {
    if (!valorizacion || !nuevoEstado) return;
    try {
      await cambiarEstadoValorizacion(
        valorizacion.id, 
        nuevoEstado as EstadoValorizacionEjecucion
      );
      setShowCambioEstado(false);
      setNuevoEstado('');
      setObservaciones('');
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };
  // Obtener estados disponibles para transición
  const getEstadosDisponibles = () => {
    if (!valorizacion) return [];
    const estadoActual = valorizacion.estado;
    if (tipo === 'ejecucion') {
      switch (estadoActual) {
        case 'BORRADOR':
          return ['PRESENTADA'];
        case 'PRESENTADA':
          return ['EN_REVISION', 'OBSERVADA'];
        case 'EN_REVISION':
          return ['APROBADA', 'OBSERVADA'];
        case 'OBSERVADA':
          return ['PRESENTADA', 'RECHAZADA'];
        case 'APROBADA':
          return ['PAGADA'];
        default:
          return [];
      }
    } else {
      switch (estadoActual) {
        case 'BORRADOR':
          return ['PRESENTADA'];
        case 'PRESENTADA':
          return ['APROBADA', 'RECHAZADA'];
        case 'APROBADA':
          return ['PAGADA'];
        default:
          return [];
      }
    }
  };
  if (!valorizacion || !obra) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Valorización no encontrada</p>
          <button onClick={onBack} className="btn-primary mt-4">
            Volver
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Valorización N° {valorizacion.numero_valorizacion}
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getEstadoColor(valorizacion.estado)}`}>
                {getEstadoIcon(valorizacion.estado)}
                <span className="ml-2">{valorizacion.estado.replace('_', ' ')}</span>
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {tipo === 'ejecucion' ? 'Valorización de Ejecución' : 'Valorización de Supervisión'} - 
              {obra.numero_contrato}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {getEstadosDisponibles().length > 0 && (
            <button
              onClick={() => setShowCambioEstado(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Cambiar Estado
            </button>
          )}
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
          <button className="btn-primary flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Ver Expediente
          </button>
        </div>
      </div>
      {/* Alertas de atraso */}
      {valorizacion.dias_atraso > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-red-200 bg-red-50"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Valorización con Atraso</h3>
              <p className="text-sm text-red-700 mt-1">
                Esta valorización tiene {valorizacion.dias_atraso} días de atraso en el proceso de pago.
              </p>
            </div>
          </div>
        </motion.div>
      )}
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Información General
          </button>
          {tipo === 'ejecucion' && (
            <button
              onClick={() => setActiveTab('partidas')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'partidas'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Partidas Valorizadas
            </button>
          )}
          <button
            onClick={() => setActiveTab('historial')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'historial'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Historial
          </button>
          <button
            onClick={() => setActiveTab('documentos')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documentos'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Documentos
          </button>
        </nav>
      </div>
      {/* Contenido de tabs */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos de la obra */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-900">Información de la Obra</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre de la Obra</label>
                  <p className="mt-1 text-sm text-gray-900">{obra.nombre}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número de Contrato</label>
                  <p className="mt-1 text-sm text-gray-900">{obra.numero_contrato}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Entidad Ejecutora</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {entidadEjecutora?.nombre_completo || 'No disponible'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Entidad Supervisora</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {entidadSupervisora?.nombre_completo || 'No disponible'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monto Contractual</label>
                  <p className="mt-1 text-sm text-gray-900 font-semibold">
                    {tipo === 'ejecucion' 
                      ? formatearMoneda(obra.monto_ejecucion)
                      : formatearMoneda(obra.monto_supervision)
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado de la Obra</label>
                  <p className="mt-1 text-sm text-gray-900">{obra.estado.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
            {/* Datos del periodo */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-900">Periodo de Valorización</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(valorizacion.periodo_inicio).toLocaleDateString('es-PE')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(valorizacion.periodo_fin).toLocaleDateString('es-PE')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Días del Periodo</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {String('dias_periodo' in valorizacion 
                      ? valorizacion.dias_periodo 
                      : 'dias_calendario_periodo' in valorizacion
                      ? valorizacion.dias_calendario_periodo
                      : 0
                    )} días
                  </p>
                </div>
                {tipo === 'supervision' && 'dias_efectivos_trabajados' in valorizacion && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Días Efectivos</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">
                      {String(valorizacion.dias_efectivos_trabajados || 0)} días
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Personal responsable */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-900">Personal Responsable</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tipo === 'ejecucion' && 'residente_obra' in valorizacion && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Residente de Obra</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {valorizacion.residente_obra || 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Supervisor de Obra</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {valorizacion.supervisor_obra || 'No especificado'}
                      </p>
                    </div>
                  </>
                )}
                {tipo === 'supervision' && 'supervisor_responsable' in valorizacion && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Supervisor Responsable</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {String(valorizacion.supervisor_responsable || 'No especificado')}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Responsable de Entidad</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {valorizacion.responsable_entidad || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>
            {/* Observaciones */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-900">Observaciones</h2>
              </div>
              <div className="space-y-4">
                {tipo === 'ejecucion' && 'observaciones_residente' in valorizacion && (
                  <>
                    {valorizacion.observaciones_residente && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Observaciones del Residente</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {valorizacion.observaciones_residente}
                        </p>
                      </div>
                    )}
                    {valorizacion.observaciones_supervisor && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Observaciones del Supervisor</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {valorizacion.observaciones_supervisor}
                        </p>
                      </div>
                    )}
                    {valorizacion.observaciones_entidad && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Observaciones de la Entidad</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {valorizacion.observaciones_entidad}
                        </p>
                      </div>
                    )}
                    {valorizacion.motivo_rechazo && (
                      <div>
                        <label className="block text-sm font-medium text-red-700">Motivo de Rechazo</label>
                        <p className="mt-1 text-sm text-red-800 bg-red-50 p-3 rounded-lg border border-red-200">
                          {valorizacion.motivo_rechazo}
                        </p>
                      </div>
                    )}
                  </>
                )}
                {tipo === 'supervision' && 'observaciones_periodo' in valorizacion && (
                  <>
                    {valorizacion.observaciones_periodo && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Observaciones del Periodo</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {String(valorizacion.observaciones_periodo)}
                        </p>
                      </div>
                    )}
                    {valorizacion.actividades_realizadas && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Actividades Realizadas</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {valorizacion.actividades_realizadas}
                        </p>
                      </div>
                    )}
                    {valorizacion.motivos_dias_no_trabajados && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Motivos Días No Trabajados</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {valorizacion.motivos_dias_no_trabajados}
                        </p>
                      </div>
                    )}
                  </>
                )}
                {!('observaciones_residente' in valorizacion) && 
                 !('observaciones_periodo' in valorizacion) && (
                  <p className="text-sm text-gray-500 dark:text-gray-300 italic">No hay observaciones registradas</p>
                )}
              </div>
            </div>
          </div>
          {/* Panel lateral con montos */}
          <div className="space-y-6">
            {/* Montos principales */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900">Resumen Económico</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monto Bruto</span>
                  <span className="font-semibold text-gray-900">
                    {formatearMoneda(valorizacion.monto_bruto)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Deducciones</span>
                  <span className="font-semibold text-red-600">
                    - {formatearMoneda(valorizacion.total_deducciones)}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Monto Neto</span>
                  <span className="font-bold text-green-600">
                    {formatearMoneda(valorizacion.monto_neto)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">IGV (18%)</span>
                  <span className="font-semibold text-gray-900">
                    {formatearMoneda(valorizacion.igv_monto)}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-900">Total con IGV</span>
                  <span className="font-bold text-blue-600 text-lg">
                    {formatearMoneda(valorizacion.monto_neto + valorizacion.igv_monto)}
                  </span>
                </div>
              </div>
            </div>
            {/* Desglose de deducciones */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Desglose de Deducciones</h3>
              <div className="space-y-3">
                {tipo === 'ejecucion' && 'adelanto_directo_monto' in valorizacion && (
                  <>
                    {valorizacion.adelanto_directo_monto > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          Adelanto Directo ({valorizacion.adelanto_directo_porcentaje}%)
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatearMoneda(valorizacion.adelanto_directo_monto)}
                        </span>
                      </div>
                    )}
                    {valorizacion.adelanto_materiales_monto > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          Adelanto Materiales ({valorizacion.adelanto_materiales_porcentaje}%)
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatearMoneda(valorizacion.adelanto_materiales_monto)}
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    Retención Garantía ({valorizacion.retencion_garantia_porcentaje}%)
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatearMoneda(valorizacion.retencion_garantia_monto)}
                  </span>
                </div>
                {valorizacion.penalidades_monto > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Penalidades</span>
                    <span className="font-medium text-gray-900">
                      {formatearMoneda(valorizacion.penalidades_monto)}
                    </span>
                  </div>
                )}
                {valorizacion.otras_deducciones_monto > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Otras Deducciones</span>
                    <span className="font-medium text-gray-900">
                      {formatearMoneda(valorizacion.otras_deducciones_monto)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Fechas importantes */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <GitBranch className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900">GitBranch del Proceso</h3>
              </div>
              <div className="space-y-3">
                {valorizacion.fecha_presentacion && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Presentación</span>
                    <span className="font-medium text-gray-900">
                      {new Date(valorizacion.fecha_presentacion).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                )}
                {tipo === 'ejecucion' && 'fecha_revision' in valorizacion && valorizacion.fecha_revision && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Revisión</span>
                    <span className="font-medium text-gray-900">
                      {new Date(String(valorizacion.fecha_revision)).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                )}
                {valorizacion.fecha_aprobacion && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Aprobación</span>
                    <span className="font-medium text-gray-900">
                      {new Date(valorizacion.fecha_aprobacion).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                )}
                {tipo === 'ejecucion' && 'fecha_limite_pago' in valorizacion && valorizacion.fecha_limite_pago && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Límite de Pago</span>
                    <span className={`font-medium ${
                      new Date(String(valorizacion.fecha_limite_pago)) < new Date() && !valorizacion.fecha_pago
                        ? 'text-red-600'
                        : 'text-gray-900'
                    }`}>
                      {new Date(String(valorizacion.fecha_limite_pago)).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                )}
                {valorizacion.fecha_pago && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Pago</span>
                    <span className="font-medium text-green-600">
                      {new Date(valorizacion.fecha_pago).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Información de avance (solo ejecución) */}
            {tipo === 'ejecucion' && 'porcentaje_avance_fisico_total' in valorizacion && (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900">Avance de Obra</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Avance Físico Total</span>
                      <span className="font-semibold text-gray-900">
                        {Number(valorizacion.porcentaje_avance_fisico_total || 0).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                        style={{ width: `${Math.min(Number(valorizacion.porcentaje_avance_fisico_total || 0), 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Avance Económico</span>
                      <span className="font-semibold text-gray-900">
                        {formatearMoneda(Number(valorizacion.monto_avance_economico_total || 0))}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      de {formatearMoneda(obra.monto_ejecucion)} contractuales
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Tab de partidas (solo ejecución) */}
      {activeTab === 'partidas' && tipo === 'ejecucion' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900">Partidas Valorizadas</h2>
          </div>
          <TablaPartidas
            partidas={partidas}
            partidasSeleccionadas={[]} // TODO: Implementar carga desde valorización
            onAgregarPartida={() => {}}
            onQuitarPartida={() => {}}
            readonly={true}
            showCalculations={false}
          />
        </div>
      )}
      {/* Tab de historial */}
      {activeTab === 'historial' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900">Historial de Cambios</h2>
          </div>
          <div className="text-center py-8 text-gray-500 dark:text-gray-300">
            <GitBranch className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Historial de cambios no implementado aún</p>
          </div>
        </div>
      )}
      {/* Tab de documentos */}
      {activeTab === 'documentos' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900">Documentos Adjuntos</h2>
          </div>
          <div className="text-center py-8 text-gray-500 dark:text-gray-300">
            <Paperclip className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Gestión de documentos no implementada aún</p>
          </div>
        </div>
      )}
      {/* Modal cambio de estado */}
      {showCambioEstado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cambiar Estado de Valorización
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nuevo Estado
                </label>
                <select
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Seleccionar estado...</option>
                  {getEstadosDisponibles().map(estado => (
                    <option key={estado} value={estado}>
                      {estado.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                  placeholder="Motivo del cambio de estado..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCambioEstado(false)}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleCambiarEstado}
                disabled={!nuevoEstado || loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Cambiando...' : 'Confirmar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default DetalleValorizacion;