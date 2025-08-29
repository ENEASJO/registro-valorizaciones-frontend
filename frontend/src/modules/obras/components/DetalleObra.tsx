import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Construction, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileText,
  BarChart,
  Users,
  Edit,
  Calculator,
  Target,
  Briefcase,
  Phone,
  Mail,
  Award
} from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import type { 
  Obra, 
  ObraProfesional, 
  ObraValorizacion,
  EstadoObra 
} from '../../../types/obra.types';
import { ESTADOS_OBRA, TIPOS_OBRA, CONFIG_MONEDA } from '../../../types/obra.types';
import { useObras, useProfesionales, useValorizaciones } from '../../../hooks/useObras';
import { useEntidadesContratistas } from '../../../hooks/useEmpresas';

interface DetalleObraProps {
  obraId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onEditar?: (obraId: number) => void;
}

const DetalleObra: React.FC<DetalleObraProps> = ({
  obraId,
  isOpen,
  onClose,
  onEditar
}) => {
  const { obtenerObraPorId } = useObras();
  const { profesionales, cargarProfesionalesPorObra } = useProfesionales();
  const { valorizaciones, cargarValorizacionesPorObra } = useValorizaciones();
  const { entidades } = useEntidadesContratistas();

  const [tabActivo, setTabActivo] = useState('general');
  const [obra, setObra] = useState<Obra | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar datos de la obra
  useEffect(() => {
    if (obraId && isOpen) {
      setLoading(true);
      
      obtenerObraPorId(obraId).then(obraData => {
        setObra(obraData);
      }).catch(error => {
        console.error('Error cargando obra:', error);
      });
      
      // Cargar datos relacionados
      cargarProfesionalesPorObra(obraId);
      cargarValorizacionesPorObra(obraId);
      
      setLoading(false);
    }
  }, [obraId, isOpen, obtenerObraPorId, cargarProfesionalesPorObra, cargarValorizacionesPorObra]);

  if (!isOpen || !obra) return null;

  // Obtener información de entidades
  const entidadEjecutora = entidades.find(e => e.id === obra.entidad_ejecutora_id);
  const entidadSupervisora = entidades.find(e => e.id === obra.entidad_supervisora_id);

  // Configuración de estado
  const getEstadoConfig = (estado: EstadoObra) => {
    switch (estado) {
      case 'REGISTRADA':
        return { color: 'text-gray-700 bg-gray-100', icon: Clock };
      case 'EN_EJECUCION':
        return { color: 'text-blue-700 bg-blue-100', icon: Construction };
      case 'PARALIZADA':
        return { color: 'text-yellow-700 bg-yellow-100', icon: AlertCircle };
      case 'TERMINADA':
        return { color: 'text-green-700 bg-green-100', icon: CheckCircle };
      case 'LIQUIDADA':
        return { color: 'text-purple-700 bg-purple-100', icon: Calculator };
      case 'CANCELADA':
        return { color: 'text-red-700 bg-red-100', icon: AlertCircle };
      default:
        return { color: 'text-gray-700 bg-gray-100', icon: Clock };
    }
  };

  const estadoConfig = getEstadoConfig(obra.estado);
  const IconoEstado = estadoConfig.icon;

  // Calcular progreso estimado
  const diasTranscurridos = Math.floor((new Date().getTime() - new Date(obra.fecha_inicio).getTime()) / (1000 * 60 * 60 * 24));
  const progresoTiempo = Math.min((diasTranscurridos / obra.plazo_ejecucion_dias) * 100, 100);
  
  // Calcular progreso financiero (simulado)
  const montoEjecutadoSimulado = valorizaciones
    .filter(v => v.estado === 'APROBADA')
    .reduce((sum, v) => sum + v.monto_ejecutado, 0);
  const progresoFinanciero = (montoEjecutadoSimulado / obra.monto_ejecucion) * 100;

  // Formatear moneda
  const formatearMoneda = (monto: number): string => {
    return `S/ ${monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
  };

  // Calcular días restantes
  const diasRestantes = Math.max(0, obra.plazo_ejecucion_dias - diasTranscurridos);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block w-full max-w-7xl px-6 py-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Construction className="w-6 h-6 text-primary-600" />
                <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  {obra.numero_contrato}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${estadoConfig.color}`}>
                  <IconoEstado className="w-3 h-3" />
                  {ESTADOS_OBRA[obra.estado]}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{obra.nombre}</h2>
              {obra.codigo_interno && (
                <p className="text-sm text-gray-600">Código Interno: {obra.codigo_interno}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              {onEditar && (
                <button
                  onClick={() => onEditar(obra.id)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Resumen Ejecutivo */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-primary-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-8 h-8 text-primary-600" />
                    <div>
                      <p className="text-lg font-bold text-primary-900">
                        {formatearMoneda(obra.monto_total)}
                      </p>
                      <p className="text-sm text-primary-700">Inversión Total</p>
                    </div>
                  </div>
                  <div className="text-xs text-primary-600 mt-2">
                    Ejecución: {formatearMoneda(obra.monto_ejecucion)} | 
                    Supervisión: {formatearMoneda(obra.monto_supervision)}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-lg font-bold text-blue-900">{obra.plazo_ejecucion_dias}</p>
                      <p className="text-sm text-blue-700">Días de Plazo</p>
                    </div>
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    Inicio: {new Date(obra.fecha_inicio).toLocaleDateString('es-PE')}
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-lg font-bold text-green-900">{progresoTiempo.toFixed(1)}%</p>
                      <p className="text-sm text-green-700">Progreso Tiempo</p>
                    </div>
                  </div>
                  <div className="text-xs text-green-600 mt-2">
                    {diasRestantes} días restantes
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-lg font-bold text-purple-900">{obra.numero_valorizaciones}</p>
                      <p className="text-sm text-purple-700">Valorizaciones</p>
                    </div>
                  </div>
                  <div className="text-xs text-purple-600 mt-2">
                    {valorizaciones.filter(v => v.estado === 'APROBADA').length} aprobadas
                  </div>
                </div>
              </div>

              {/* Barra de progreso principal */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Avance General de la Obra</h3>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">{progresoFinanciero.toFixed(1)}%</span>
                    <p className="text-sm text-gray-600">Avance Financiero</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Progreso Financiero</span>
                      <span className="text-sm text-gray-900">{formatearMoneda(montoEjecutadoSimulado)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progresoFinanciero, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Progreso de Tiempo</span>
                      <span className="text-sm text-gray-900">{diasTranscurridos} / {obra.plazo_ejecucion_dias} días</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          progresoTiempo > progresoFinanciero ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(progresoTiempo, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {Math.abs(progresoTiempo - progresoFinanciero) > 10 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        {progresoTiempo > progresoFinanciero ? 
                          'El avance financiero está rezagado respecto al cronograma' :
                          'El avance financiero está adelantado respecto al cronograma'
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs de detalle */}
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
                    value="entidades"
                    className="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Entidades
                  </Tabs.Trigger>
                  <Tabs.Trigger 
                    value="plantel"
                    className="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Plantel ({profesionales.length})
                  </Tabs.Trigger>
                  <Tabs.Trigger 
                    value="valorizaciones"
                    className="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                  >
                    <BarChart className="w-4 h-4" />
                    Valorizaciones ({valorizaciones.length})
                  </Tabs.Trigger>
                </Tabs.List>

                {/* Tab: Información General */}
                <Tabs.Content value="general" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles de la Obra</h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Tipo de Obra</p>
                              <p className="text-gray-600">
                                {obra.tipo_obra ? TIPOS_OBRA[obra.tipo_obra] : 'No especificado'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Modalidad de Ejecución</p>
                              <p className="text-gray-600">{obra.modalidad_ejecucion || 'No especificado'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Calculator className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Sistema de Contratación</p>
                              <p className="text-gray-600">{obra.sistema_contratacion || 'No especificado'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h4>
                        <div className="space-y-3">
                          {obra.ubicacion && (
                            <div className="flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">Ubicación Específica</p>
                                <p className="text-gray-600">{obra.ubicacion}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-900">Departamento</p>
                              <p className="text-gray-600">{obra.departamento || 'No especificado'}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Provincia</p>
                              <p className="text-gray-600">{obra.provincia || 'No especificado'}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Distrito</p>
                              <p className="text-gray-600">{obra.distrito || 'No especificado'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Cronograma</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">Fecha de Inicio</span>
                            <span className="text-gray-700">
                              {new Date(obra.fecha_inicio).toLocaleDateString('es-PE')}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">Fecha de Fin Prevista</span>
                            <span className="text-gray-700">
                              {new Date(obra.fecha_fin_prevista).toLocaleDateString('es-PE')}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">Plazo Total</span>
                            <span className="text-gray-700">{obra.plazo_ejecucion_dias} días</span>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">Días Transcurridos</span>
                            <span className="text-gray-700">{diasTranscurridos} días</span>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">Días Restantes</span>
                            <span className={`font-medium ${
                              diasRestantes < 30 ? 'text-red-600' : 
                              diasRestantes < 90 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {diasRestantes} días
                            </span>
                          </div>

                          {obra.fecha_termino && (
                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                              <span className="font-medium text-purple-900">Fecha de Término</span>
                              <span className="text-purple-700 font-medium">
                                {new Date(obra.fecha_termino).toLocaleDateString('es-PE')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Presupuesto</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="font-medium text-gray-900">Monto de Ejecución</span>
                            <span className="font-bold text-green-700">
                              {formatearMoneda(obra.monto_ejecucion)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <span className="font-medium text-gray-900">Monto de Supervisión</span>
                            <span className="font-bold text-blue-700">
                              {formatearMoneda(obra.monto_supervision)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg border-2 border-primary-200">
                            <span className="font-bold text-primary-900">Monto Total</span>
                            <span className="font-bold text-primary-700 text-lg">
                              {formatearMoneda(obra.monto_total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {obra.descripcion && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h4>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{obra.descripcion}</p>
                    </div>
                  )}

                  {obra.observaciones && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Observaciones</h4>
                      <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        {obra.observaciones}
                      </p>
                    </div>
                  )}
                </Tabs.Content>

                {/* Tab: Entidades */}
                <Tabs.Content value="entidades" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Entidad Ejecutora */}
                    <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Construction className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-blue-900">Entidad Ejecutora</h3>
                          <p className="text-blue-700 text-sm">Responsable de la ejecución</p>
                        </div>
                      </div>
                      
                      {entidadEjecutora ? (
                        <div className="space-y-3">
                          <div>
                            <p className="font-semibold text-blue-900">{entidadEjecutora.nombre_completo}</p>
                            <p className="text-blue-700 text-sm">{entidadEjecutora.tipo_entidad}</p>
                          </div>
                          
                          {entidadEjecutora.ruc_principal && (
                            <div>
                              <p className="text-sm text-blue-700">
                                <span className="font-medium">RUC:</span> {entidadEjecutora.ruc_principal}
                              </p>
                            </div>
                          )}
                          
                          {entidadEjecutora.datos_empresa && (
                            <div className="space-y-2 text-sm">
                              {entidadEjecutora.datos_empresa.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-blue-600" />
                                  <span>{entidadEjecutora.datos_empresa.email}</span>
                                </div>
                              )}
                              
                              {entidadEjecutora.datos_empresa.telefono && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-blue-600" />
                                  <span>{entidadEjecutora.datos_empresa.telefono}</span>
                                </div>
                              )}
                              
                              {entidadEjecutora.datos_empresa.categoria_contratista && (
                                <div className="flex items-center gap-2">
                                  <Award className="w-4 h-4 text-blue-600" />
                                  <span>Categoría: {entidadEjecutora.datos_empresa.categoria_contratista}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {entidadEjecutora.datos_consorcio && (
                            <div className="text-sm">
                              <p className="text-blue-700 mb-2">
                                <span className="font-medium">Empresa Líder:</span> {entidadEjecutora.datos_consorcio.empresa_lider_nombre}
                              </p>
                              {entidadEjecutora.empresas_participantes && (
                                <div>
                                  <p className="font-medium text-blue-700 mb-1">Empresas Participantes:</p>
                                  <ul className="space-y-1">
                                    {entidadEjecutora.empresas_participantes.map((emp, index) => (
                                      <li key={index} className="text-blue-600 text-xs">
                                        • {emp.empresa_nombre} ({emp.porcentaje_participacion}%)
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-blue-600">Información no disponible</p>
                      )}
                    </div>

                    {/* Entidad Supervisora */}
                    <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-purple-900">Entidad Supervisora</h3>
                          <p className="text-purple-700 text-sm">Responsable de la supervisión</p>
                        </div>
                      </div>
                      
                      {entidadSupervisora ? (
                        <div className="space-y-3">
                          <div>
                            <p className="font-semibold text-purple-900">{entidadSupervisora.nombre_completo}</p>
                            <p className="text-purple-700 text-sm">{entidadSupervisora.tipo_entidad}</p>
                          </div>
                          
                          {entidadSupervisora.ruc_principal && (
                            <div>
                              <p className="text-sm text-purple-700">
                                <span className="font-medium">RUC:</span> {entidadSupervisora.ruc_principal}
                              </p>
                            </div>
                          )}
                          
                          {entidadSupervisora.datos_empresa && (
                            <div className="space-y-2 text-sm">
                              {entidadSupervisora.datos_empresa.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-purple-600" />
                                  <span>{entidadSupervisora.datos_empresa.email}</span>
                                </div>
                              )}
                              
                              {entidadSupervisora.datos_empresa.telefono && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-purple-600" />
                                  <span>{entidadSupervisora.datos_empresa.telefono}</span>
                                </div>
                              )}
                              
                              {entidadSupervisora.datos_empresa.categoria_contratista && (
                                <div className="flex items-center gap-2">
                                  <Award className="w-4 h-4 text-purple-600" />
                                  <span>Categoría: {entidadSupervisora.datos_empresa.categoria_contratista}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {entidadSupervisora.datos_consorcio && (
                            <div className="text-sm">
                              <p className="text-purple-700 mb-2">
                                <span className="font-medium">Empresa Líder:</span> {entidadSupervisora.datos_consorcio.empresa_lider_nombre}
                              </p>
                              {entidadSupervisora.empresas_participantes && (
                                <div>
                                  <p className="font-medium text-purple-700 mb-1">Empresas Participantes:</p>
                                  <ul className="space-y-1">
                                    {entidadSupervisora.empresas_participantes.map((emp, index) => (
                                      <li key={index} className="text-purple-600 text-xs">
                                        • {emp.empresa_nombre} ({emp.porcentaje_participacion}%)
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-purple-600">Información no disponible</p>
                      )}
                    </div>
                  </div>
                </Tabs.Content>

                {/* Tab: Plantel Profesional */}
                <Tabs.Content value="plantel" className="space-y-6">
                  {profesionales.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {profesionales.map((profesional) => (
                        <div key={profesional.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900">{profesional.nombre_completo}</h4>
                              <p className="text-sm text-gray-600">{profesional.cargo || 'Cargo no especificado'}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-primary-600">
                                {profesional.porcentaje_participacion}%
                              </span>
                              <p className="text-xs text-gray-500">Participación</p>
                            </div>
                          </div>

                          <div className="space-y-3 text-sm">
                            {profesional.numero_colegiatura && (
                              <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Colegiatura: {profesional.numero_colegiatura}</span>
                              </div>
                            )}
                            
                            {profesional.dni && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">DNI: {profesional.dni}</span>
                              </div>
                            )}

                            {profesional.telefono && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">{profesional.telefono}</span>
                              </div>
                            )}

                            {profesional.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">{profesional.email}</span>
                              </div>
                            )}

                            {profesional.responsabilidades && profesional.responsabilidades.length > 0 && (
                              <div>
                                <p className="font-medium text-gray-900 mb-1">Responsabilidades:</p>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                  {profesional.responsabilidades.map((resp, index) => (
                                    <li key={index}>{resp}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Desde: {new Date(profesional.fecha_inicio_participacion).toLocaleDateString('es-PE')}</span>
                              <span className={`px-2 py-1 rounded-full ${
                                profesional.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {profesional.estado}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Sin plantel profesional asignado</h3>
                      <p className="text-gray-600">
                        No hay profesionales registrados para esta obra
                      </p>
                    </div>
                  )}
                </Tabs.Content>

                {/* Tab: Valorizaciones */}
                <Tabs.Content value="valorizaciones" className="space-y-6">
                  {valorizaciones.length > 0 ? (
                    <div className="space-y-4">
                      {valorizaciones.map((valorizacion) => (
                        <div key={valorizacion.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                Valorización N° {valorizacion.numero_valorizacion}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Período: {new Date(valorizacion.periodo_inicio).toLocaleDateString('es-PE')} - {' '}
                                {new Date(valorizacion.periodo_fin).toLocaleDateString('es-PE')}
                              </p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              valorizacion.estado === 'APROBADA' ? 'bg-green-100 text-green-800' :
                              valorizacion.estado === 'PAGADA' ? 'bg-blue-100 text-blue-800' :
                              valorizacion.estado === 'EN_PROCESO' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {valorizacion.estado}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">Monto Ejecutado</p>
                              <p className="font-bold text-gray-900">
                                {formatearMoneda(valorizacion.monto_ejecutado)}
                              </p>
                            </div>
                            
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">% Avance</p>
                              <p className="font-bold text-gray-900">{valorizacion.porcentaje_avance}%</p>
                            </div>
                            
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">Monto Acumulado</p>
                              <p className="font-bold text-gray-900">
                                {formatearMoneda(valorizacion.monto_acumulado)}
                              </p>
                            </div>
                            
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">% Acumulado</p>
                              <p className="font-bold text-gray-900">{valorizacion.porcentaje_acumulado}%</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Fecha Programada:</p>
                              <p className="font-medium text-gray-900">
                                {new Date(valorizacion.fecha_programada).toLocaleDateString('es-PE')}
                              </p>
                            </div>
                            
                            {valorizacion.fecha_presentacion && (
                              <div>
                                <p className="text-gray-600">Fecha Presentación:</p>
                                <p className="font-medium text-gray-900">
                                  {new Date(valorizacion.fecha_presentacion).toLocaleDateString('es-PE')}
                                </p>
                              </div>
                            )}
                            
                            {valorizacion.fecha_aprobacion && (
                              <div>
                                <p className="text-gray-600">Fecha Aprobación:</p>
                                <p className="font-medium text-gray-900">
                                  {new Date(valorizacion.fecha_aprobacion).toLocaleDateString('es-PE')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Sin valorizaciones registradas</h3>
                      <p className="text-gray-600">
                        Las valorizaciones se generarán automáticamente según el cronograma
                      </p>
                    </div>
                  )}
                </Tabs.Content>
              </Tabs.Root>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DetalleObra;