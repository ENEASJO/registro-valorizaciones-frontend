import React, { useState, useEffect } from 'react';
import { X, Edit, Building, Users, MapPin, Phone, Mail, Globe, Download, Share, ChevronDown, ChevronRight, Briefcase, Star, Award, Crown, User, Calendar, FileText, Tag } from 'lucide-react';
import type { EntidadContratistaDetalle } from '../../../types/empresa.types';

interface DetalleEntidadProps {
  entidad: EntidadContratistaDetalle | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (entidad: EntidadContratistaDetalle) => void;
}

// Componente para initials avatar
const InitialsAvatar: React.FC<{ name: string; size?: 'sm' | 'md' | 'lg' }> = ({ name, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold`}>
      {initials}
    </div>
  );
};

// Tab Panel Component
const TabPanel: React.FC<{ active: boolean; children: React.ReactNode }> = ({ active, children }) => {
  return (
    <div className={`${active ? 'block' : 'hidden'} animate-fadeIn`}>
      {children}
    </div>
  );
};

// Accordion Component
const Accordion: React.FC<{ title: string; icon: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }> = ({
  title,
  icon,
  defaultOpen = false,
  children
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
};

// Info Card Component
const InfoCard: React.FC<{ icon: React.ReactNode; title: string; value: string; className?: string }> = ({
  icon,
  title,
  value,
  className = ''
}) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow ${className}`}>
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 text-gray-400">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-sm text-gray-600 truncate">{value || 'No disponible'}</p>
      </div>
    </div>
  </div>
);

// Contact Info Component
const ContactInfo: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  action?: React.ReactNode;
  color?: string
}> = ({ icon, title, value, action, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
        <p className="text-sm text-gray-600 truncate">{value || 'No disponible'}</p>
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

const DetalleEntidad: React.FC<DetalleEntidadProps> = ({ entidad, isOpen, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [empresa, setEmpresa] = useState(entidad);
  const [loading, setLoading] = useState(false);

  // Si no hay entidad o el modal no está abierto, no renderizar nada
  if (!entidad || !isOpen) {
    return null;
  }

  // Actualizar el estado de empresa cuando cambia la prop
  useEffect(() => {
    if (entidad) {
      setEmpresa(entidad);
    }
  }, [entidad]);

  // Determinar si es empresa individual o consorcio
  const esEmpresaIndividual = empresa.tipo_entidad === 'EMPRESA' || !empresa.datos_consorcio?.empresa_lider_id;

  // Componente para mostrar detalles de empresa individual
  const DetalleEmpresa = () => {
    const datos = empresa.datos_empresa;
    return (
      <div className="space-y-6">
        {/* Representantes Legales - Cards Modernas */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Representantes Legales
            {datos?.representantes && datos.representantes.length > 0 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {datos.representantes.length}
              </span>
            )}
          </h3>

          {datos?.representantes && datos.representantes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {datos.representantes.map((representante, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6">
                  {/* Header con avatar y nombre */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <InitialsAvatar name={representante.nombre} size="md" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{representante.nombre}</h4>
                        <p className="text-sm text-gray-600">{representante.cargo}</p>
                      </div>
                    </div>
                    {representante.es_principal && (
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Principal
                      </span>
                    )}
                  </div>

                  {/* Información detallada */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Documento:</span>
                      <span className="font-medium text-gray-900">
                        {representante.tipo_documento || 'DNI'} {representante.numero_documento}
                      </span>
                    </div>

                    {representante.fuente && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Fuente:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          representante.fuente === 'SUNAT' ? 'bg-green-100 text-green-800' :
                          representante.fuente === 'OECE' ? 'bg-purple-100 text-purple-800' :
                          representante.fuente === 'AMBOS' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {representante.fuente}
                        </span>
                      </div>
                    )}

                    {representante.fecha_desde && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Desde:</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {new Date(representante.fecha_desde).toLocaleDateString('es-PE', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    )}

                    {representante.participacion && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Participación:</span>
                        <span className="font-medium text-gray-900">{representante.participacion}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-200">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No hay representantes legales registrados</p>
            </div>
          )}
        </div>

        {/* Contactos Adicionales */}
        {datos?.contactos && datos.contactos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contactos Adicionales
            </h3>
            <div className="space-y-3">
              {datos.contactos.map((contacto, index) => (
                <ContactInfo
                  key={index}
                  icon={<User className="w-5 h-5" />}
                  title={contacto.nombre}
                  value={contacto.cargo || 'Contacto'}
                  action={
                    contacto.email && (
                      <a href={`mailto:${contacto.email}`} className="text-blue-600 hover:text-blue-700">
                        <Mail className="w-4 h-4" />
                      </a>
                    )
                  }
                  color="green"
                />
              ))}
            </div>
          </div>
        )}

        {/* Especialidades */}
        {datos?.especialidades && datos.especialidades.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Especialidades
            </h3>
            <div className="flex flex-wrap gap-3">
              {datos.especialidades.map((especialidad) => (
                <span
                  key={especialidad}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 text-sm rounded-lg font-medium hover:from-blue-100 hover:to-blue-200 transition-colors"
                >
                  {especialidad.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Componente para mostrar información de contacto
  const ContactoYUbicacion = () => {
    const datos = empresa.datos_empresa;
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Información de Contacto</h3>

          <div className="space-y-4">
            {/* Domicilio Fiscal */}
            <ContactInfo
              icon={<MapPin className="w-5 h-5" />}
              title="Domicilio Fiscal"
              value={datos?.direccion || 'No disponible'}
              color="blue"
            />

            {/* Teléfono */}
            <ContactInfo
              icon={<Phone className="w-5 h-5" />}
              title="Teléfono"
              value={datos?.telefono || 'No disponible'}
              action={
                datos?.telefono && (
                  <a href={`tel:${datos.telefono}`} className="text-green-600 hover:text-green-700">
                    <Phone className="w-4 h-4" />
                  </a>
                )
              }
              color="green"
            />

            {/* Email */}
            <ContactInfo
              icon={<Mail className="w-5 h-5" />}
              title="Email"
              value={datos?.email || 'No disponible'}
              action={
                datos?.email && (
                  <a href={`mailto:${datos.email}`} className="text-purple-600 hover:text-purple-700">
                    <Mail className="w-4 h-4" />
                  </a>
                )
              }
              color="purple"
            />

            {/* Sitio Web */}
            {/* Comentado ya que el campo 'web' no existe en el tipo */}
          </div>
        </div>

        {/* Información Adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={<Building className="w-5 h-5" />}
            title="Tipo de Empresa"
            value={datos?.tipo_empresa || 'No especificado'}
          />
          <InfoCard
            icon={<Star className="w-5 h-5" />}
            title="Categoría"
            value={datos?.categoria_contratista ? `Categoría ${datos.categoria_contratista}` : 'No especificada'}
          />
          <InfoCard
            icon={<FileText className="w-5 h-5" />}
            title="Sector Económico"
            value={'No especificado'}
          />
          <InfoCard
            icon={<Calendar className="w-5 h-5" />}
            title="Fecha Constitución"
            value={datos?.fecha_constitucion ?
              new Date(datos.fecha_constitucion).toLocaleDateString('es-PE') :
              'No especificada'
            }
          />
        </div>
      </div>
    );
  };

  // Componente para información SUNAT/OSCE
  const InformacionFiscal = () => {
    const datos = empresa.datos_empresa;
    return (
      <div className="space-y-4">
        {/* Datos SUNAT */}
        {datos?.datos_sunat && (
          <Accordion
            title="Información SUNAT"
            icon={<Building className="w-5 h-5 text-blue-600" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condición del Contribuyente</label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <p className="text-blue-900 font-medium">{datos.datos_sunat.contribuyente_condicion}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contribuyente</label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <p className="text-blue-900 font-medium">{datos.datos_sunat.contribuyente_tipo}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado en SUNAT</label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <p className="text-blue-900 font-medium">{datos.datos_sunat.estado_sunat}</p>
                </div>
              </div>
              {datos.datos_sunat.fecha_inscripcion && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inscripción</label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                    <p className="text-blue-900 font-medium">
                      {new Date(datos.datos_sunat.fecha_inscripcion).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                </div>
              )}
              {datos.datos_sunat.domicilio_fiscal && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domicilio Fiscal SUNAT</label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                    <p className="text-blue-900">{datos.datos_sunat.domicilio_fiscal}</p>
                  </div>
                </div>
              )}
            </div>
          </Accordion>
        )}

        {/* Datos OSCE */}
        {datos?.datos_osce && (
          <Accordion
            title="Información OSCE"
            icon={<Award className="w-5 h-5 text-purple-600" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {datos.datos_osce.estado_osce && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado en OSCE</label>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                    <p className="text-purple-900 font-medium">{datos.datos_osce.estado_osce}</p>
                  </div>
                </div>
              )}
              {datos.datos_osce.condicion_osce && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condición en OSCE</label>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                    <p className="text-purple-900 font-medium">{datos.datos_osce.condicion_osce}</p>
                  </div>
                </div>
              )}
              {datos.datos_osce.capacidad_contratacion && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad de Contratación</label>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                    <p className="text-purple-900 font-medium">{datos.datos_osce.capacidad_contratacion}</p>
                  </div>
                </div>
              )}
              {datos.datos_osce.vigencia && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vigencia</label>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                    <p className="text-purple-900 font-medium">{datos.datos_osce.vigencia}</p>
                  </div>
                </div>
              )}
            </div>
          </Accordion>
        )}

        {/* Fuentes Consultadas */}
        <Accordion
          title="Fuentes Consultadas"
          icon={<FileText className="w-5 h-5 text-green-600" />}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">SUNAT - Superintendencia Nacional de Aduanas y de Administración Tributaria</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">OECE - Organismo Supervisor de las Contrataciones del Estado</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Base de datos interna - Información registrada manualmente</span>
            </div>
          </div>
        </Accordion>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col animate-scaleIn">
          {/* Header con Gradiente */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-t-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Building className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{empresa.nombre_completo}</h2>
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      RUC: {empresa.datos_empresa?.ruc || empresa.ruc_principal}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      empresa.estado === 'ACTIVO'
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                        : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                    }`}>
                      {empresa.estado}
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-sm font-medium rounded-full">
                      {empresa.datos_empresa?.tipo_empresa || 'Empresa'}
                    </span>
                    {empresa.datos_empresa?.categoria_contratista && (
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-400 to-purple-500 text-white text-sm font-medium rounded-full">
                        Categoría {empresa.datos_empresa.categoria_contratista}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(empresa)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Edit className="w-5 h-5 text-white" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gray-50 border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Información General
              </button>
              <button
                onClick={() => setActiveTab('representantes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === 'representantes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Representantes
                {empresa.datos_empresa?.representantes && empresa.datos_empresa.representantes.length > 0 && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    {empresa.datos_empresa.representantes.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('contacto')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'contacto'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contacto y Ubicación
              </button>
              <button
                onClick={() => setActiveTab('fiscal')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'fiscal'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Información Fiscal
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <TabPanel active={activeTab === 'general'}>
              {esEmpresaIndividual ? <DetalleEmpresa /> : <DetalleConsorcio />}
            </TabPanel>

            <TabPanel active={activeTab === 'representantes'}>
              <DetalleEmpresa />
            </TabPanel>

            <TabPanel active={activeTab === 'contacto'}>
              <ContactoYUbicacion />
            </TabPanel>

            <TabPanel active={activeTab === 'fiscal'}>
              <InformacionFiscal />
            </TabPanel>
          </div>

          {/* Footer con Acciones Rápidas */}
          <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                <Edit className="w-4 h-4" />
                Editar Empresa
              </button>
              <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm">
                <Download className="w-4 h-4" />
                Exportar PDF
              </button>
              <button className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm">
                <Share className="w-4 h-4" />
                Compartir
              </button>
              <button className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-sm">
                <FileText className="w-4 h-4" />
                Ver Historial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder para DetalleConsorcio (manteniendo compatibilidad)
const DetalleConsorcio: React.FC = () => (
  <div className="text-center py-12">
    <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Vista de Consorcio</h3>
    <p className="text-gray-500">La vista detallada de consorcios estará disponible próximamente</p>
  </div>
);

export default DetalleEntidad;