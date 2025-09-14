// =================================================================
// COMPONENTE INDICADOR DE FUENTE DE DATOS
// Sistema de Valorizaciones - Frontend
// =================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Building2, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Clock,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import type { EmpresaConsolidada } from '../../../../types/empresa.types';

// =================================================================
// INTERFACES
// =================================================================

interface DataSourceIndicatorProps {
  // Datos de fuentes
  fuentesUtilizadas: string[];
  datosOriginales?: EmpresaConsolidada;
  ultimaActualizacion?: string;
  
  // Configuración de visualización
  mostrarDetalles?: boolean;
  compact?: boolean;
  className?: string;
  
  // Estados
  consolidacionExitosa?: boolean;
  advertencias?: string[];
  erroresFuentes?: string[];
}

interface FuenteInfo {
  nombre: string;
  icono: React.ReactNode;
  color: string;
  descripcion: string;
  url?: string;
}

// =================================================================
// CONSTANTES
// =================================================================

const FUENTES_INFO: Record<string, FuenteInfo> = {
  'SUNAT': {
    nombre: 'SUNAT',
    icono: <Building2 className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    descripcion: 'Superintendencia Nacional de Aduanas y de Administración Tributaria',
    url: 'https://www.sunat.gob.pe'
  },
  'OECE': {
    nombre: 'OECE',
    icono: <Award className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    descripcion: 'Organismo Supervisor de las Contrataciones del Estado',
    url: 'https://www.osce.gob.pe'
  },
  'CONSOLIDADO': {
    nombre: 'Consolidado',
    icono: <Database className="w-4 h-4" />,
    color: 'bg-green-100 text-green-800 border-green-200',
    descripcion: 'Sistema consolidado que combina múltiples fuentes oficiales'
  },
  'MANUAL': {
    nombre: 'Manual',
    icono: <FileText className="w-4 h-4" />,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    descripcion: 'Datos ingresados manualmente por el usuario'
  }
};

// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================

export const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({
  fuentesUtilizadas = [],
  datosOriginales,
  ultimaActualizacion,
  mostrarDetalles = false,
  compact = false,
  className = '',
  consolidacionExitosa = true,
  advertencias = [],
  erroresFuentes = [],
}) => {
  
  // =================================================================
  // ESTADO LOCAL
  // =================================================================
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [seccionExpandida, setSeccionExpandida] = useState<string | null>(null);
  
  // =================================================================
  // HELPERS
  // =================================================================
  
  const obtenerEstadoConsolidacion = () => {
    if (!consolidacionExitosa) return { tipo: 'error', texto: 'Error en consolidación' };
    if (erroresFuentes.length > 0) return { tipo: 'warning', texto: 'Consolidación parcial' };
    if (fuentesUtilizadas.length > 1) return { tipo: 'success', texto: 'Consolidación exitosa' };
    if (fuentesUtilizadas.length === 1) return { tipo: 'info', texto: 'Una fuente consultada' };
    return { tipo: 'neutral', texto: 'Sin datos' };
  };
  
  const formatearFecha = (fecha?: string) => {
    if (!fecha) return 'No disponible';
    try {
      return new Date(fecha).toLocaleString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fecha;
    }
  };
  
  // =================================================================
  // RENDER COMPACT
  // =================================================================
  
  if (compact) {
    const estado = obtenerEstadoConsolidacion();
    
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {/* Indicador de fuentes */}
        <div className="flex items-center gap-1">
          {fuentesUtilizadas.map((fuente: any, index: number) => {
            const info = FUENTES_INFO[fuente];
            return (
              <span
                key={index}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${info?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}
                title={info?.descripcion || fuente}
              >
                {info?.icono}
                {info?.nombre || fuente}
              </span>
            );
          })}
        </div>
        
        {/* Indicador de estado */}
        {estado.tipo === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
        {estado.tipo === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
        {estado.tipo === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
        {estado.tipo === 'info' && <Info className="w-4 h-4 text-blue-500" />}
        
        {/* Botón de detalles */}
        {mostrarDetalles && (
          <button
            type="button"
            onClick={() => setMostrarModal(true)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Ver detalles de fuentes"
          >
            <Info className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    );
  }
  
  // =================================================================
  // RENDER COMPLETO
  // =================================================================
  
  const estado = obtenerEstadoConsolidacion();
  
  return (
    <>
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-600" />
            <h3 className="text-md font-semibold text-gray-900">Fuentes de Datos</h3>
          </div>
          
          {/* Estado general */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            estado.tipo === 'error' ? 'bg-red-100 text-red-800' :
            estado.tipo === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            estado.tipo === 'success' ? 'bg-green-100 text-green-800' :
            estado.tipo === 'info' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {estado.tipo === 'error' && <AlertCircle className="w-4 h-4" />}
            {estado.tipo === 'warning' && <AlertCircle className="w-4 h-4" />}
            {estado.tipo === 'success' && <CheckCircle className="w-4 h-4" />}
            {estado.tipo === 'info' && <Info className="w-4 h-4" />}
            {estado.texto}
          </div>
        </div>
        
        {/* Fuentes utilizadas */}
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sistemas Consultados</h4>
            <div className="flex flex-wrap gap-2">
              {fuentesUtilizadas.map((fuente: any, index: number) => {
                const info = FUENTES_INFO[fuente];
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${info?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}
                  >
                    {info?.icono}
                    <div>
                      <span className="font-medium">{info?.nombre || fuente}</span>
                      <p className="text-xs opacity-80">{info?.descripcion}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Información temporal */}
          {ultimaActualizacion && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Última actualización: {formatearFecha(ultimaActualizacion)}</span>
            </div>
          )}
          
          {/* Resumen de datos */}
          {datosOriginales && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900">{datosOriginales.total_miembros}</span>
                  <p className="text-xs text-gray-600">Representantes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900">{datosOriginales.total_especialidades || 0}</span>
                  <p className="text-xs text-gray-600">Especialidades</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-green-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900">{fuentesUtilizadas.length}</span>
                  <p className="text-xs text-gray-600">Fuentes</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Advertencias */}
          {advertencias.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <div className="flex items-center gap-2 text-yellow-800 text-sm font-medium mb-2">
                <AlertCircle className="w-4 h-4" />
                Advertencias
              </div>
              <ul className="text-yellow-700 text-sm space-y-1">
                {advertencias.slice(0, 3).map((advertencia: any, index: number) => (
                  <li key={index}>• {advertencia}</li>
                ))}
                {advertencias.length > 3 && (
                  <li className="font-medium">y {advertencias.length - 3} más...</li>
                )}
              </ul>
            </div>
          )}
          
          {/* Errores de fuentes */}
          {erroresFuentes.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <div className="flex items-center gap-2 text-red-800 text-sm font-medium mb-2">
                <AlertCircle className="w-4 h-4" />
                Errores en Fuentes
              </div>
              <ul className="text-red-700 text-sm space-y-1">
                {erroresFuentes.map((error: any, index: number) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Botón para ver detalles completos */}
          {mostrarDetalles && datosOriginales && (
            <button
              type="button"
              onClick={() => setMostrarModal(true)}
              className="w-full mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Info className="w-4 h-4" />
              Ver Detalles Técnicos
            </button>
          )}
        </div>
      </div>
      
      {/* Modal de detalles */}
      <AnimatePresence>
        {mostrarModal && datosOriginales && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header del modal */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Detalles Técnicos de Consolidación</h2>
                  <button
                    type="button"
                    onClick={() => setMostrarModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                {/* Contenido del modal con secciones expandibles */}
                <div className="space-y-4">
                  {/* Información general */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSeccionExpandida(seccionExpandida === 'general' ? null : 'general')}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">Información General</span>
                      {seccionExpandida === 'general' ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {seccionExpandida === 'general' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-200 p-4 space-y-3"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">RUC:</span>
                              <span className="ml-2">{datosOriginales.ruc}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Consolidación:</span>
                              <span className="ml-2">{datosOriginales.consolidacion_exitosa ? 'Exitosa' : 'Con errores'}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Timestamp:</span>
                              <span className="ml-2">{formatearFecha(datosOriginales.timestamp)}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Tipo:</span>
                              <span className="ml-2">{datosOriginales.tipo_persona || 'No especificado'}</span>
                            </div>
                          </div>
                          
                          {datosOriginales.observaciones && datosOriginales.observaciones.length > 0 && (
                            <div>
                              <span className="font-medium text-gray-700 block mb-2">Observaciones:</span>
                              <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {datosOriginales.observaciones.map((obs: any, index: number) => (
                                  <li key={index}>{obs}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Información de fuentes específicas */}
                  {fuentesUtilizadas.map((fuente: any) => (
                    <div key={fuente} className="border border-gray-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setSeccionExpandida(seccionExpandida === fuente ? null : fuente)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {FUENTES_INFO[fuente]?.icono}
                          <span className="font-medium text-gray-900">
                            Detalles de {FUENTES_INFO[fuente]?.nombre || fuente}
                          </span>
                        </div>
                        {seccionExpandida === fuente ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {seccionExpandida === fuente && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-gray-200 p-4"
                          >
                            {/* Aquí se mostrarían los detalles específicos de cada fuente */}
                            <div className="text-sm text-gray-600">
                              <p>Información técnica detallada de {fuente}</p>
                              <p className="mt-2">{FUENTES_INFO[fuente]?.descripcion}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DataSourceIndicator;