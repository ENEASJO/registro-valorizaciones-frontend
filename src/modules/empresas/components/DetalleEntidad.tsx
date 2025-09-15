import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  Users,
  Mail,
  Phone,
  Smartphone,
  MapPin,
  Calendar,
  Crown,
  User,
  FileText,
  Hash,
  Star,
  Award,
  Briefcase,
  Edit,
  Database
} from 'lucide-react';
import type { EntidadContratistaDetalle } from '../../../types/empresa.types';

interface DetalleEntidadProps {
  entidad: EntidadContratistaDetalle | null;
  isOpen: boolean;
  onClose: () => void;
  onEditar?: () => void;
}

const DetalleEntidad = ({ entidad, isOpen, onClose, onEditar }: DetalleEntidadProps) => {
  if (!entidad || !isOpen) return null;


  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-green-100 text-green-800';
      case 'INACTIVO':
        return 'bg-gray-100 text-gray-800';
      case 'SUSPENDIDO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                entidad.tipo_entidad === 'EMPRESA' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-purple-100 text-purple-600'
              }`}>
                {entidad.tipo_entidad === 'EMPRESA' ? (
                  <Building2 className="w-6 h-6" />
                ) : (
                  <Users className="w-6 h-6" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{entidad.nombre_completo}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    entidad.tipo_entidad === 'EMPRESA' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {entidad.tipo_entidad === 'EMPRESA' ? 'Empresa Individual' : 'Consorcio'}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(entidad.estado)}`}>
                    {entidad.estado}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {onEditar && (
                <button
                  onClick={onEditar}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {entidad.tipo_entidad === 'EMPRESA' && entidad.datos_empresa ? (
              <DetalleEmpresa entidad={entidad} />
            ) : entidad.tipo_entidad === 'CONSORCIO' && entidad.datos_consorcio ? (
              <DetalleConsorcio entidad={entidad} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No se pudo cargar la información de la entidad</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Componente para mostrar detalle de empresa
const DetalleEmpresa = ({ entidad }: { entidad: EntidadContratistaDetalle }) => {
  const empresa = entidad.datos_empresa!;

  // Debug: Log de representantes
  console.log('🔍 DEBUG - Empresa en DetalleEmpresa:', empresa);
  console.log('🔍 DEBUG - Representantes:', empresa.representantes);
  console.log('🔍 DEBUG - Total representantes:', empresa.representantes?.length || 0);

  return (
    <div className="space-y-8">
      {/* Información básica */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Datos generales */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">RUC</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 font-mono">{empresa.ruc}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Categoría</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">
                      {empresa.categoria_contratista ? `Categoría ${empresa.categoria_contratista}` : 'No especificada'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Razón Social</label>
                <p className="mt-1 text-gray-900 font-medium">{empresa.razon_social}</p>
              </div>

              {empresa.nombre_comercial && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Nombre Comercial</label>
                  <p className="mt-1 text-gray-900">{empresa.nombre_comercial}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500">Fechas</label>
                <div className="mt-1 space-y-1">
                  {empresa.fecha_constitucion && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      Constitución: {new Date(empresa.fecha_constitucion).toLocaleDateString('es-PE')}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Registrado: {new Date(entidad.created_at).toLocaleDateString('es-PE')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Actualizado: {new Date(entidad.updated_at).toLocaleDateString('es-PE')}
                  </div>
                </div>
              </div>

              {empresa.capital_social && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Capital Social</label>
                  <p className="mt-1 text-gray-900 font-medium">
                    S/ {empresa.capital_social.toLocaleString('es-PE')}
                  </p>
                </div>
              )}

              {empresa.numero_registro_nacional && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Número de Registro Nacional</label>
                  <p className="mt-1 text-gray-900 font-mono">{empresa.numero_registro_nacional}</p>
                </div>
              )}
            </div>
          </div>

          {/* Representantes Legales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Representantes Legales</h3>

            {empresa.representantes && empresa.representantes.length > 0 ? (
              <div className="space-y-3">
                {empresa.representantes.map((representante, index) => (
                  <div key={representante.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        representante.es_principal
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {representante.es_principal ? (
                          <Crown className="w-5 h-5" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">
                            {representante.nombre}
                          </p>
                          {representante.es_principal && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              <Crown className="w-3 h-3" />
                              Principal
                            </span>
                          )}
                        </div>

                        {representante.cargo && (
                          <p className="text-sm text-gray-600 mb-1">
                            Cargo: {representante.cargo}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          <p className="text-gray-600">
                            {representante.tipo_documento || 'DNI'}: {representante.numero_documento}
                          </p>

                          {representante.fuente && (
                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {representante.fuente}
                            </span>
                          )}

                          {representante.participacion && (
                            <span className="text-gray-600">
                              Participación: {representante.participacion}
                            </span>
                          )}
                        </div>

                        {representante.fecha_desde && (
                          <p className="text-xs text-gray-500 mt-1">
                            Desde: {new Date(representante.fecha_desde).toLocaleDateString('es-PE')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No hay representantes legales registrados</p>
              </div>
            )}
          </div>
        </div>

          {/* Contactos de la empresa */}
          {empresa.contactos && empresa.contactos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactos Adicionales</h3>
              <div className="space-y-3">
                {empresa.contactos.map((contacto, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">{contacto.nombre}</h4>
                          {contacto.cargo && (
                            <span className="text-sm text-gray-600">({contacto.cargo})</span>
                          )}
                        </div>

                        <div className="space-y-2">
                          {contacto.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <a href={`mailto:${contacto.email}`} className="text-primary-600 hover:text-primary-700 text-sm">
                                {contacto.email}
                              </a>
                            </div>
                          )}

                          {contacto.telefono && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <a href={`tel:${contacto.telefono}`} className="text-primary-600 hover:text-primary-700 text-sm">
                                {contacto.telefono}
                              </a>
                            </div>
                          )}

                          {contacto.celular && (
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4 text-gray-400" />
                              <a href={`tel:${contacto.celular}`} className="text-primary-600 hover:text-primary-700 text-sm">
                                {contacto.celular}
                              </a>
                            </div>
                          )}
                        </div>

                        {contacto.departamento && (
                          <p className="text-xs text-gray-500 mt-2">
                            Ubicación: {[contacto.departamento, contacto.provincia, contacto.distrito].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>

                      {contacto.fuente && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {contacto.fuente}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Datos de contacto y ubicación */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacto</h3>
              <div className="space-y-3">
                {empresa.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <a href={`mailto:${empresa.email}`} className="text-primary-600 hover:text-primary-700">
                        {empresa.email}
                      </a>
                    </div>
                  </div>
                )}

                {empresa.telefono && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <a href={`tel:${empresa.telefono}`} className="text-primary-600 hover:text-primary-700">
                        {empresa.telefono}
                      </a>
                    </div>
                  </div>
                )}

                {empresa.direccion && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-900">{empresa.direccion}</p>
                      {(empresa.distrito || empresa.provincia || empresa.departamento) && (
                        <p className="text-sm text-gray-600">
                          {[empresa.distrito, empresa.provincia, empresa.departamento].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          {/* Especialidades */}
          {empresa.especialidades && empresa.especialidades.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Especialidades</h3>
              <div className="flex flex-wrap gap-2">
                {empresa.especialidades.map((especialidad) => (
                  <span
                    key={especialidad}
                    className="px-3 py-2 bg-primary-100 text-primary-800 text-sm rounded-lg font-medium"
                  >
                    {especialidad.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Información adicional en tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">Tipo de Empresa</h4>
              <p className="text-blue-700 text-sm">
                {empresa.tipo_empresa || 'No especificado'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-900">Estado</h4>
              <p className="text-green-700 text-sm">{entidad.estado}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8 text-purple-600" />
            <div>
              <h4 className="font-semibold text-purple-900">Categoría</h4>
              <p className="text-purple-700 text-sm">
                {empresa.categoria_contratista ? `Categoría ${empresa.categoria_contratista}` : 'No especificada'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Datos de SUNAT */}
      {empresa.datos_sunat && (
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Información SUNAT</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {empresa.datos_sunat.contribuyente_condicion && (
              <div>
                <label className="block text-sm font-medium text-blue-700">Condición del Contribuyente</label>
                <p className="mt-1 text-blue-900">{empresa.datos_sunat.contribuyente_condicion}</p>
              </div>
            )}
            {empresa.datos_sunat.contribuyente_tipo && (
              <div>
                <label className="block text-sm font-medium text-blue-700">Tipo de Contribuyente</label>
                <p className="mt-1 text-blue-900">{empresa.datos_sunat.contribuyente_tipo}</p>
              </div>
            )}
            {empresa.datos_sunat.estado_sunat && (
              <div>
                <label className="block text-sm font-medium text-blue-700">Estado en SUNAT</label>
                <p className="mt-1 text-blue-900">{empresa.datos_sunat.estado_sunat}</p>
              </div>
            )}
            {empresa.datos_sunat.fecha_inscripcion && (
              <div>
                <label className="block text-sm font-medium text-blue-700">Fecha de Inscripción</label>
                <p className="mt-1 text-blue-900">
                  {new Date(empresa.datos_sunat.fecha_inscripcion).toLocaleDateString('es-PE')}
                </p>
              </div>
            )}
            {empresa.datos_sunat.domicilio_fiscal && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-700">Domicilio Fiscal</label>
                <p className="mt-1 text-blue-900">{empresa.datos_sunat.domicilio_fiscal}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Datos de OSCE */}
      {empresa.datos_osce && (
        <div className="bg-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">Información OSCE</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {empresa.datos_osce.estado_osce && (
              <div>
                <label className="block text-sm font-medium text-purple-700">Estado en OSCE</label>
                <p className="mt-1 text-purple-900">{empresa.datos_osce.estado_osce}</p>
              </div>
            )}
            {empresa.datos_osce.fecha_inscripcion && (
              <div>
                <label className="block text-sm font-medium text-purple-700">Fecha de Inscripción</label>
                <p className="mt-1 text-purple-900">
                  {new Date(empresa.datos_osce.fecha_inscripcion).toLocaleDateString('es-PE')}
                </p>
              </div>
            )}
            {empresa.datos_osce.fecha_baja && (
              <div>
                <label className="block text-sm font-medium text-purple-700">Fecha de Baja</label>
                <p className="mt-1 text-purple-900">
                  {new Date(empresa.datos_osce.fecha_baja).toLocaleDateString('es-PE')}
                </p>
              </div>
            )}
            {empresa.datos_osce.cantidad_trabajadores && (
              <div>
                <label className="block text-sm font-medium text-purple-700">Cantidad de Trabajadores</label>
                <p className="mt-1 text-purple-900">{empresa.datos_osce.cantidad_trabajadores}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fuentes consultadas */}
      {empresa.fuentes_consultadas && empresa.fuentes_consultadas.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuentes Consultadas</h3>
          <div className="space-y-2">
            {empresa.fuentes_consultadas.map((fuente, index) => (
              <div key={index} className="flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{fuente}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para mostrar detalle de consorcio
const DetalleConsorcio = ({ entidad }: { entidad: EntidadContratistaDetalle }) => {
  const consorcio = entidad.datos_consorcio!;
  const empresasParticipantes = entidad.empresas_participantes || [];
  
  return (
    <div className="space-y-8">
      {/* Información básica */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Datos generales */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nombre del Consorcio</label>
                <p className="mt-1 text-gray-900 font-medium">{consorcio.nombre}</p>
              </div>

              {consorcio.descripcion && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Descripción</label>
                  <p className="mt-1 text-gray-700">{consorcio.descripcion}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Fecha de Constitución</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(consorcio.fecha_constitucion).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Total de Empresas</label>
                  <span className="text-2xl font-bold text-primary-600">{empresasParticipantes.length}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Fechas de Sistema</label>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Registrado: {new Date(entidad.created_at).toLocaleDateString('es-PE')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Actualizado: {new Date(entidad.updated_at).toLocaleDateString('es-PE')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empresa líder */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Empresa Líder</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{consorcio.empresa_lider_nombre}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Empresa que lidera y representa al consorcio
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Especialidades del consorcio */}
          {consorcio.especialidades && consorcio.especialidades.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Especialidades del Consorcio</h3>
              <div className="flex flex-wrap gap-2">
                {consorcio.especialidades.map((especialidad) => (
                  <span
                    key={especialidad}
                    className="px-3 py-2 bg-primary-100 text-primary-800 text-sm rounded-lg font-medium"
                  >
                    {especialidad.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empresas participantes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Empresas Participantes</h3>
        
        {empresasParticipantes.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No hay empresas participantes registradas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {empresasParticipantes.map((ep) => (
              <div 
                key={ep.empresa_id}
                className={`border rounded-lg p-6 ${
                  ep.es_lider 
                    ? 'border-yellow-200 bg-yellow-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      ep.es_lider 
                        ? 'bg-yellow-100 text-yellow-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {ep.es_lider ? <Crown className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{ep.empresa_nombre}</h4>
                        {ep.es_lider && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            <Crown className="w-3 h-3" />
                            Líder
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">RUC: {ep.empresa_ruc}</p>
                      
                      {ep.responsabilidades && ep.responsabilidades.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Responsabilidades:</p>
                          <div className="flex flex-wrap gap-1">
                            {ep.responsabilidades.map((resp) => (
                              <span 
                                key={resp}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {resp.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Porcentaje de participación */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {ep.porcentaje_participacion}%
                    </div>
                    <p className="text-sm text-gray-500">Participación</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Resumen de participación */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Total de participación:</span>
                <span className="text-lg font-bold text-primary-600">
                  {empresasParticipantes.reduce((sum, ep) => sum + ep.porcentaje_participacion, 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleEntidad;