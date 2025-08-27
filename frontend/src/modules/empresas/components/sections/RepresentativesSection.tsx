// =================================================================
// SECCIÓN DE REPRESENTANTES LEGALES
// Sistema de Valorizaciones - Frontend
// =================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  User, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle,
  Crown,
  Building2,
  CreditCard
} from 'lucide-react';
import type { MiembroConsolidado, ErrorValidacion, EstadoSeccionFormulario } from '../../../../types/empresa.types';

// =================================================================
// INTERFACES
// =================================================================

interface RepresentativesSectionProps {
  // Datos actuales
  representante_legal?: string;
  dni_representante?: string;
  representantes?: MiembroConsolidado[];
  
  // Representantes disponibles del sistema consolidado
  representantesDisponibles?: Array<{
    nombre: string;
    dni: string;
    cargo: string;
    fuente: string;
  }>;
  
  // Estado de la sección
  estado: EstadoSeccionFormulario;
  
  // Errores
  errores: ErrorValidacion[];
  
  // Handlers
  onChange: (field: string, value: any) => void;
  onAddRepresentante?: (representante: MiembroConsolidado) => void;
  onEditRepresentante?: (index: number, representante: MiembroConsolidado) => void;
  onRemoveRepresentante?: (index: number) => void;
  onSelectFromConsolidated?: (representante: { nombre: string; dni: string; cargo: string; fuente: string }) => void;
  
  // Configuración
  readonly?: boolean;
  expandido?: boolean;
  permitirMultiples?: boolean;
  mostrarFuentesDatos?: boolean;
}

interface RepresentanteEditando {
  nombre: string;
  cargo: string;
  tipo_documento: 'DNI' | 'CE' | 'PASSPORT';
  numero_documento: string;
  fuente: 'MANUAL';
  activo: boolean;
}

// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================

export const RepresentativesSection: React.FC<RepresentativesSectionProps> = ({
  representante_legal = '',
  dni_representante = '',
  representantes = [],
  representantesDisponibles = [],
  estado,
  errores,
  onChange,
  onAddRepresentante,
  onEditRepresentante,
  onRemoveRepresentante,
  onSelectFromConsolidated,
  readonly = false,
  expandido = true,
  permitirMultiples = false,
  mostrarFuentesDatos = false,
}) => {
  
  // =================================================================
  // ESTADO LOCAL
  // =================================================================
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoIndice, setEditandoIndice] = useState<number | null>(null);
  const [mostrarConsolidados, setMostrarConsolidados] = useState(false);
  const [representanteEditando, setRepresentanteEditando] = useState<RepresentanteEditando>({
    nombre: '',
    cargo: '',
    tipo_documento: 'DNI',
    numero_documento: '',
    fuente: 'MANUAL',
    activo: true,
  });
  
  // =================================================================
  // HELPERS
  // =================================================================
  
  const getFieldError = (field: string): string | undefined => {
    return errores.find(error => error.campo === field)?.mensaje;
  };
  
  const obtenerRepresentantePrincipal = (): MiembroConsolidado | null => {
    if (representantes.length > 0) {
      return representantes[0];
    }
    if (representante_legal) {
      return {
        nombre: representante_legal,
        numero_documento: dni_representante,
        cargo: 'Representante Legal',
        fuente: 'MANUAL',
        activo: true,
      };
    }
    return null;
  };
  
  const manejarGuardarRepresentante = () => {
    if (!representanteEditando.nombre || !representanteEditando.numero_documento) {
      return;
    }
    
    const nuevoRepresentante: MiembroConsolidado = {
      ...representanteEditando,
    };
    
    if (editandoIndice !== null) {
      // Editando existente
      if (onEditRepresentante) {
        onEditRepresentante(editandoIndice, nuevoRepresentante);
      }
    } else {
      // Agregando nuevo
      if (onAddRepresentante) {
        onAddRepresentante(nuevoRepresentante);
      } else {
        // Fallback para compatibilidad
        if (!permitirMultiples) {
          onChange('representante_legal', nuevoRepresentante.nombre);
          onChange('dni_representante', nuevoRepresentante.numero_documento);
        }
      }
    }
    
    // Reset formulario
    setRepresentanteEditando({
      nombre: '',
      cargo: '',
      tipo_documento: 'DNI',
      numero_documento: '',
      fuente: 'MANUAL',
      activo: true,
    });
    setMostrarFormulario(false);
    setEditandoIndice(null);
  };
  
  const manejarCancelarEdicion = () => {
    setRepresentanteEditando({
      nombre: '',
      cargo: '',
      tipo_documento: 'DNI',
      numero_documento: '',
      fuente: 'MANUAL',
      activo: true,
    });
    setMostrarFormulario(false);
    setEditandoIndice(null);
  };
  
  const manejarEditarRepresentante = (index: number) => {
    const rep = representantes[index];
    setRepresentanteEditando({
      nombre: rep.nombre,
      cargo: rep.cargo || '',
      tipo_documento: (rep.tipo_documento as any) || 'DNI',
      numero_documento: rep.numero_documento || '',
      fuente: 'MANUAL',
      activo: rep.activo ?? true,
    });
    setEditandoIndice(index);
    setMostrarFormulario(true);
  };
  
  // =================================================================
  // RENDER
  // =================================================================
  
  if (!expandido) return null;
  
  const representantePrincipal = obtenerRepresentantePrincipal();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header de sección */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
            estado.con_errores 
              ? 'bg-red-100 text-red-600' 
              : estado.completado 
                ? 'bg-green-100 text-green-600'
                : 'bg-blue-100 text-blue-600'
          }`}>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Representantes Legales</h3>
            <p className="text-sm text-gray-600">
              {permitirMultiples 
                ? 'Personas autorizadas para representar la empresa'
                : 'Representante legal principal de la empresa'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {estado.datos_consolidados && (
            <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle className="w-4 h-4" />
              Datos obtenidos
            </div>
          )}
          
          {/* Mostrar representantes consolidados disponibles */}
          {representantesDisponibles.length > 0 && !readonly && (
            <button
              type="button"
              onClick={() => setMostrarConsolidados(true)}
              className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors flex items-center gap-1"
            >
              <Users className="w-4 h-4" />
              Ver disponibles ({representantesDisponibles.length})
            </button>
          )}
        </div>
      </div>
      
      {/* Representante principal (modo simple) */}
      {!permitirMultiples && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Nombre Completo *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={representante_legal}
                  onChange={(e) => onChange('representante_legal', e.target.value)}
                  readOnly={readonly}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    getFieldError('representante_legal') 
                      ? 'border-red-300 bg-red-50' 
                      : estado.datos_consolidados
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300'
                  } ${readonly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="Nombre completo del representante legal"
                />
                {estado.datos_consolidados && (
                  <div className="absolute right-3 top-2 text-green-500">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
              {getFieldError('representante_legal') && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError('representante_legal')}
                </p>
              )}
            </div>
            
            {/* DNI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <CreditCard className="w-4 h-4 inline mr-1" />
                Documento de Identidad *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dni_representante}
                  onChange={(e) => onChange('dni_representante', e.target.value)}
                  readOnly={readonly}
                  maxLength={8}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    getFieldError('dni_representante') 
                      ? 'border-red-300 bg-red-50' 
                      : estado.datos_consolidados
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300'
                  } ${readonly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="12345678"
                />
                {estado.datos_consolidados && (
                  <div className="absolute right-3 top-2 text-green-500">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
              {getFieldError('dni_representante') && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError('dni_representante')}
                </p>
              )}
            </div>
          </div>
          
          {/* Información del representante actual desde datos consolidados */}
          {representantePrincipal && estado.datos_consolidados && mostrarFuentesDatos && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Cargo:</span> {representantePrincipal.cargo || 'No especificado'}
                {representantePrincipal.fecha_desde && (
                  <span className="ml-3">
                    <span className="font-medium">Desde:</span> {representantePrincipal.fecha_desde}
                  </span>
                )}
                <div className="mt-1">
                  <span className="font-medium">Fuente:</span> {representantePrincipal.fuente}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Lista de representantes (modo múltiple) */}
      {permitirMultiples && (
        <div className="space-y-4">
          {/* Lista actual de representantes */}
          {representantes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-md font-medium text-gray-900">Representantes Registrados</h4>
              {representantes.map((representante, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {index === 0 ? (
                        <Crown className="w-5 h-5 text-blue-600" />
                      ) : (
                        <User className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{representante.nombre}</h5>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {representante.cargo && (
                          <span><span className="font-medium">Cargo:</span> {representante.cargo}</span>
                        )}
                        {representante.numero_documento && (
                          <span><span className="font-medium">DNI:</span> {representante.numero_documento}</span>
                        )}
                      </div>
                      {mostrarFuentesDatos && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            representante.fuente === 'SUNAT' 
                              ? 'bg-blue-100 text-blue-800'
                              : representante.fuente === 'OECE'
                                ? 'bg-purple-100 text-purple-800'
                                : representante.fuente === 'AMBOS'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}>
                            {representante.fuente}
                          </span>
                          {index === 0 && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                              Principal
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!readonly && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => manejarEditarRepresentante(index)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {representantes.length > 1 && onRemoveRepresentante && (
                        <button
                          type="button"
                          onClick={() => onRemoveRepresentante(index)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Botón para agregar representante */}
          {!readonly && (
            <button
              type="button"
              onClick={() => setMostrarFormulario(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <Plus className="w-5 h-5" />
              Agregar Representante
            </button>
          )}
        </div>
      )}
      
      {/* Modal para agregar/editar representante */}
      <AnimatePresence>
        {mostrarFormulario && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editandoIndice !== null ? 'Editar' : 'Agregar'} Representante
                  </h3>
                  <button
                    type="button"
                    onClick={manejarCancelarEdicion}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={representanteEditando.nombre}
                      onChange={(e) => setRepresentanteEditando(prev => ({ ...prev, nombre: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nombre completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={representanteEditando.cargo}
                      onChange={(e) => setRepresentanteEditando(prev => ({ ...prev, cargo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Gerente General, Director, etc."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo Doc.
                      </label>
                      <select
                        value={representanteEditando.tipo_documento}
                        onChange={(e) => setRepresentanteEditando(prev => ({ ...prev, tipo_documento: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="DNI">DNI</option>
                        <option value="CE">C.E.</option>
                        <option value="PASSPORT">Pasaporte</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={representanteEditando.numero_documento}
                        onChange={(e) => setRepresentanteEditando(prev => ({ ...prev, numero_documento: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="12345678"
                        maxLength={representanteEditando.tipo_documento === 'DNI' ? 8 : 20}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={manejarCancelarEdicion}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={manejarGuardarRepresentante}
                    disabled={!representanteEditando.nombre || !representanteEditando.numero_documento}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {editandoIndice !== null ? 'Actualizar' : 'Agregar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modal para mostrar representantes consolidados */}
      <AnimatePresence>
        {mostrarConsolidados && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Representantes Disponibles
                  </h3>
                  <button
                    type="button"
                    onClick={() => setMostrarConsolidados(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {representantesDisponibles.map((representante, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (onSelectFromConsolidated) {
                          onSelectFromConsolidated(representante);
                        }
                        setMostrarConsolidados(false);
                      }}
                      className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{representante.nombre}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Cargo:</span> {representante.cargo || 'No especificado'}
                          </p>
                          {representante.dni && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">DNI:</span> {representante.dni}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          representante.fuente === 'SUNAT' 
                            ? 'bg-blue-100 text-blue-800'
                            : representante.fuente === 'OECE'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {representante.fuente}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RepresentativesSection;