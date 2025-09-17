// =================================================================
// SECCIÓN DE REGISTRO Y ESPECIALIDADES
// Sistema de Valorizaciones - Frontend
// =================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award,
  Building2,
  CheckCircle2,
  AlertCircle,
  Info,
  Star,
  Briefcase,
  Calendar,
  Shield,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { 
  EspecialidadEmpresa, 
  CategoriaContratista,
  EspecialidadConsolidada,
  ErrorValidacion, 
  EstadoSeccionFormulario 
} from '../../../../types/empresa.types';

// =================================================================
// INTERFACES
// =================================================================

interface RegistrationSectionProps {
  // Estados básicos
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  categoria_contratista?: CategoriaContratista;
  especialidades?: EspecialidadEmpresa[];
  
  // Datos específicos de OECE
  estado_oece?: string;
  categoria_oece?: string;
  especialidades_oece?: string[];
  capacidad_contratacion?: string;
  vigencia_registro_desde?: string;
  vigencia_registro_hasta?: string;
  
  // Datos consolidados
  especialidades_consolidadas?: EspecialidadConsolidada[];
  estado_registro?: string; // Estado multilinea de OECE
  
  // Estado de la sección
  estadoSeccion: EstadoSeccionFormulario;
  
  // Errores
  errores: ErrorValidacion[];
  
  // Handlers
  onChange: (field: string, value: any) => void;
  onEspecialidadChange?: (especialidad: EspecialidadEmpresa, checked: boolean) => void;
  
  // Configuración
  readonly?: boolean;
  expandido?: boolean;
  mostrarFuentesDatos?: boolean;
  tipoEmpresa?: 'EJECUTORA' | 'SUPERVISORA' | 'GENERAL';
}

// =================================================================
// CONSTANTES
// =================================================================

const ESPECIALIDADES_OPTIONS: { value: EspecialidadEmpresa; label: string; categoria: string; codigo?: string }[] = [
  { value: 'EDIFICACIONES', label: 'Edificaciones', categoria: 'Construcción Civil', codigo: 'ED' },
  { value: 'CARRETERAS', label: 'Carreteras y Vías', categoria: 'Infraestructura Vial', codigo: 'CR' },
  { value: 'SANEAMIENTO', label: 'Saneamiento', categoria: 'Servicios Públicos', codigo: 'SA' },
  { value: 'ELECTRICIDAD', label: 'Instalaciones Eléctricas', categoria: 'Servicios Públicos', codigo: 'EL' },
  { value: 'TELECOMUNICACIONES', label: 'Telecomunicaciones', categoria: 'Servicios Públicos', codigo: 'TC' },
  { value: 'PUENTES', label: 'Puentes', categoria: 'Infraestructura Vial', codigo: 'PU' },
  { value: 'TUNELES', label: 'Túneles', categoria: 'Infraestructura Vial', codigo: 'TU' },
  { value: 'AEROPUERTOS', label: 'Aeropuertos', categoria: 'Infraestructura Especializada', codigo: 'AE' },
  { value: 'PUERTOS', label: 'Puertos', categoria: 'Infraestructura Especializada', codigo: 'PO' },
  { value: 'FERROCARRILES', label: 'Ferrocarriles', categoria: 'Infraestructura Vial', codigo: 'FC' },
  { value: 'IRRIGACION', label: 'Irrigación', categoria: 'Recursos Hídricos', codigo: 'IR' },
  { value: 'HIDROENERGETICA', label: 'Hidroenergética', categoria: 'Recursos Hídricos', codigo: 'HE' }
];

const CATEGORIAS_INFO = {
  'A': { label: 'Categoría A', descripcion: 'Obras de máxima complejidad técnica', color: 'bg-purple-100 text-purple-800' },
  'B': { label: 'Categoría B', descripcion: 'Obras de alta complejidad técnica', color: 'bg-blue-100 text-blue-800' },
  'C': { label: 'Categoría C', descripcion: 'Obras de mediana complejidad técnica', color: 'bg-green-100 text-green-800' },
  'D': { label: 'Categoría D', descripcion: 'Obras de baja complejidad técnica', color: 'bg-yellow-100 text-yellow-800' },
  'E': { label: 'Categoría E', descripcion: 'Obras de mínima complejidad técnica', color: 'bg-gray-100 text-gray-800' }
};

// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  estado,
  categoria_contratista,
  especialidades = [],
  estado_oece,
  categoria_oece,
  especialidades_oece = [],
  capacidad_contratacion,
  vigencia_registro_desde,
  vigencia_registro_hasta,
  especialidades_consolidadas = [],
  estado_registro,
  estadoSeccion,
  errores,
  onChange,
  onEspecialidadChange,
  readonly = false,
  expandido = true,
  mostrarFuentesDatos = false,
  tipoEmpresa = 'GENERAL',
}) => {
  
  // =================================================================
  // ESTADO LOCAL
  // =================================================================
  
  const [mostrarDetallesOECE, setMostrarDetallesOECE] = useState(false);
  const [categoriaExpandida, setCategoriaExpandida] = useState<string | null>(null);
  
  // =================================================================
  // HELPERS
  // =================================================================
  
  const getFieldError = (field: string): string | undefined => {
    return errores.find(error => error.campo === field)?.mensaje;
  };
  
  const obtenerColorEstado = (estado: string): string => {
    if (estado.includes('ACTIVO') || estado.includes('HABILITADO')) return 'text-green-600 bg-green-100';
    if (estado.includes('SUSPENDIDO')) return 'text-yellow-600 bg-yellow-100';
    if (estado.includes('INACTIVO') || estado.includes('INHABILITADO')) return 'text-red-600 bg-red-100';
    return 'text-gray-600 dark:text-gray-300 bg-gray-100';
  };
  
  const manejarCambioEspecialidad = (especialidad: EspecialidadEmpresa, checked: boolean) => {
    if (onEspecialidadChange) {
      onEspecialidadChange(especialidad, checked);
    } else {
      // Fallback para compatibilidad
      const nuevasEspecialidades = checked 
        ? [...especialidades, especialidad]
        : especialidades.filter(e => e !== especialidad);
      onChange('especialidades', nuevasEspecialidades);
    }
  };
  
  const agruparEspecialidadesPorCategoria = () => {
    const grupos: { [categoria: string]: typeof ESPECIALIDADES_OPTIONS } = {};
    
    ESPECIALIDADES_OPTIONS.forEach(opcion => {
      if (!grupos[opcion.categoria]) {
        grupos[opcion.categoria] = [];
      }
      grupos[opcion.categoria].push(opcion);
    });
    
    return grupos;
  };
  
  // =================================================================
  // RENDER
  // =================================================================
  
  if (!expandido) return null;
  
  const gruposEspecialidades = agruparEspecialidadesPorCategoria();
  const tieneEspecialidadesOECE = especialidades_oece.length > 0 || especialidades_consolidadas.length > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header de sección */}
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
          estadoSeccion.con_errores 
            ? 'bg-red-100 text-red-600' 
            : estadoSeccion.completado 
              ? 'bg-green-100 text-green-600'
              : 'bg-blue-100 text-blue-600'
        }`}>
          <Award className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Registro y Especialidades</h3>
          <p className="text-sm text-gray-600">
            {tipoEmpresa === 'EJECUTORA' 
              ? 'Especialidades de construcción y capacidades técnicas'
              : tipoEmpresa === 'SUPERVISORA'
                ? 'Especialidades de supervisión y control de obras'
                : 'Registro oficial y especialidades técnicas'
            }
          </p>
        </div>
        {estadoSeccion.datos_consolidados && (
          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Datos OECE
          </div>
        )}
      </div>
      
      {/* Estado y categoría */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estado general */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Shield className="w-4 h-4 inline mr-1" />
            Estado General
          </label>
          <select
            value={estado}
            onChange={(e) => onChange('estado', e.target.value)}
            disabled={readonly}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              readonly ? 'bg-gray-50 cursor-not-allowed' : 'border-gray-300'
            }`}
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
            <option value="SUSPENDIDO">Suspendido</option>
          </select>
        </div>
        
        {/* Categoría de contratista */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Star className="w-4 h-4 inline mr-1" />
            Categoría de Contratista
          </label>
          <select
            value={categoria_contratista || ''}
            onChange={(e) => onChange('categoria_contratista', e.target.value as CategoriaContratista)}
            disabled={readonly}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              readonly ? 'bg-gray-50 cursor-not-allowed' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar...</option>
            {Object.entries(CATEGORIAS_INFO).map(([categoria, info]) => (
              <option key={categoria} value={categoria}>
                {info.label} - {info.descripcion}
              </option>
            ))}
          </select>
          {categoria_contratista && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {CATEGORIAS_INFO[categoria_contratista]?.descripcion}
            </p>
          )}
        </div>
      </div>
      
      {/* Información de OECE */}
      {(estado_oece || categoria_oece || estado_registro || capacidad_contratacion) && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Building2 className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="text-md font-semibold text-purple-800">
                Registro OECE (Organismo Supervisor)
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setMostrarDetallesOECE(!mostrarDetallesOECE)}
              className="p-1 hover:bg-purple-100 rounded transition-colors"
            >
              {mostrarDetallesOECE ? (
                <ChevronUp className="w-4 h-4 text-purple-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-purple-600" />
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {estado_oece && (
              <div>
                <span className="font-medium text-purple-700">Estado OECE:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(estado_oece)}`}>
                  {estado_oece}
                </span>
              </div>
            )}
            
            {categoria_oece && (
              <div>
                <span className="font-medium text-purple-700">Categoría:</span>
                <span className="ml-2 text-purple-800">{categoria_oece}</span>
              </div>
            )}
            
            {capacidad_contratacion && (
              <div className="md:col-span-2">
                <span className="font-medium text-purple-700">Capacidad de Contratación:</span>
                <span className="ml-2 text-purple-800">{capacidad_contratacion}</span>
              </div>
            )}
          </div>
          
          {/* Detalles expandidos */}
          <AnimatePresence>
            {mostrarDetallesOECE && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-purple-200"
              >
                {estado_registro && (
                  <div className="mb-4">
                    <span className="font-medium text-purple-700 block mb-2">Estado de Registro Detallado:</span>
                    <div className="bg-white rounded p-3 text-sm text-gray-700 whitespace-pre-line border">
                      {estado_registro}
                    </div>
                  </div>
                )}
                
                {vigencia_registro_desde && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-purple-700">Vigencia desde:</span>
                      <span className="ml-2 text-purple-800">{vigencia_registro_desde}</span>
                    </div>
                    {vigencia_registro_hasta && (
                      <div>
                        <span className="font-medium text-purple-700">Vigencia hasta:</span>
                        <span className="ml-2 text-purple-800">{vigencia_registro_hasta}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Especialidades OECE */}
      {tieneEspecialidadesOECE && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h4 className="text-md font-semibold text-blue-800">Especialidades Registradas en OECE</h4>
          </div>
          
          {especialidades_oece.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {especialidades_oece.map((especialidad, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {especialidad}
                </span>
              ))}
            </div>
          )}
          
          {especialidades_consolidadas.length > 0 && (
            <div>
              <p className="text-sm text-blue-700 mb-2 font-medium">Especialidades Detalladas:</p>
              <div className="space-y-2">
                {especialidades_consolidadas.map((esp, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded p-2 border">
                    <div>
                      <span className="font-medium text-gray-900">{esp.nombre}</span>
                      {esp.categoria && (
                        <span className="ml-2 text-xs text-gray-600">({esp.categoria})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {esp.activa && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        esp.fuente === 'OECE' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {esp.fuente}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Selección de especialidades locales */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h4 className="text-md font-semibold text-gray-900">Especialidades del Sistema</h4>
          {tipoEmpresa === 'EJECUTORA' && (
            <span className="text-sm text-blue-600">( Especialidades de construcción )</span>
          )}
          {tipoEmpresa === 'SUPERVISORA' && (
            <span className="text-sm text-green-600">( Especialidades de supervisión )</span>
          )}
        </div>
        
        <div className="space-y-4">
          {Object.entries(gruposEspecialidades).map(([categoria, opciones]) => (
            <div key={categoria} className="border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => setCategoriaExpandida(categoriaExpandida === categoria ? null : categoria)}
                className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-colors"
              >
                <span className="font-medium text-gray-900">{categoria}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {opciones.filter(op => especialidades.includes(op.value)).length} de {opciones.length}
                  </span>
                  {categoriaExpandida === categoria ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {categoriaExpandida === categoria && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {opciones.map((opcion) => (
                        <label 
                          key={opcion.value} 
                          className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={especialidades.includes(opcion.value)}
                            onChange={(e) => manejarCambioEspecialidad(opcion.value, e.target.checked)}
                            disabled={readonly}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {opcion.label}
                            </div>
                            {opcion.codigo && (
                              <div className="text-xs text-gray-500">
                                Código: {opcion.codigo}
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        {getFieldError('especialidades') && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {getFieldError('especialidades')}
          </p>
        )}
      </div>
      
      {/* Resumen de especialidades seleccionadas */}
      {especialidades.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h4 className="text-md font-semibold text-green-800">
              Especialidades Seleccionadas ({especialidades.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {especialidades.map((especialidad) => {
              const opcion = ESPECIALIDADES_OPTIONS.find(op => op.value === especialidad);
              return (
                <span
                  key={especialidad}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {opcion?.label || especialidad}
                </span>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Información adicional */}
      {mostrarFuentesDatos && estadoSeccion.datos_consolidados && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-gray-600" />
            <h4 className="text-sm font-medium text-gray-800">Información de Fuentes</h4>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
            <p>• Los datos de registro provienen del sistema consolidado OECE</p>
            <p>• Las especialidades mostradas están validadas oficialmente</p>
            <p>• La capacidad de contratación es la registrada oficialmente</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RegistrationSection;