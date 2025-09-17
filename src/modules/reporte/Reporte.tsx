import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  TrendingUp,
  BarChart,
  FileCheck,
  Presentation,
  Filter,
  Download,
  History,
  Settings,
  Eye,
  Trash,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

import { useReportes, useEstadisticasReportes } from '../../hooks/useReportes';
import type {
  TipoReporte,
  FiltrosReporte,
  OpcionesPresentacion,
  ConfiguracionExportacion,
  SolicitudReporte
} from '../../types/reporte.types';
import { TIPOS_REPORTE } from '../../types/reporte.types';

// Componentes
import FiltrosAvanzados from './components/FiltrosAvanzados';
import ExportadorReporte from './components/ExportadorReporte';
import ReporteValorizacion from './components/ReporteValorizacion';
import ReporteAvanceObra from './components/ReporteAvanceObra';
import ReporteFinanciero from './components/ReporteFinanciero';
import ReporteContractual from './components/ReporteContractual';
import ReporteGerencial from './components/ReporteGerencial';

const Reporte = () => {
  const [tipoReporteActivo, setTipoReporteActivo] = useState<TipoReporte>('GERENCIAL_EJECUTIVO');
  const [vistaActiva, setVistaActiva] = useState<'configuracion' | 'vista-previa' | 'historial'>('configuracion');
  const [mostrarExportador, setMostrarExportador] = useState(false);
  
  const {
    reportes,
    loading,
    error,
    generarReporte,
    obtenerDatosReporte,
    eliminarReporte,
    descargarReporte
  } = useReportes();
  
  const estadisticas = useEstadisticasReportes();

  // Estado de filtros y opciones
  const [filtros, setFiltros] = useState<FiltrosReporte>({
    periodo: 'MENSUAL',
    fechaInicio: new Date().toISOString().split('T')[0].replace(/-(\d{2})$/, '-01'),
    fechaFin: new Date().toISOString().split('T')[0],
    niveLDetalle: 'DETALLADO'
  });

  const [opciones, setOpciones] = useState<OpcionesPresentacion>({
    incluirGraficos: true,
    incluirResumenEjecutivo: true,
    incluirAnalisisComparativo: true,
    incluirRecomendaciones: true,
    incluirAnexos: false,
    incluirFotos: false,
    numerarPaginas: true
  });

  // Configuración de tipos de reporte con iconos y colores
  const configuracionTipos = useMemo(() => ({
    'VALORIZACION_MENSUAL': {
      icon: FileText,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      colorHover: 'hover:bg-blue-200',
      colorActivo: 'bg-blue-600 text-white'
    },
    'AVANCE_OBRA': {
      icon: BarChart,
      color: 'bg-green-100 text-green-700 border-green-200',
      colorHover: 'hover:bg-green-200',
      colorActivo: 'bg-green-600 text-white'
    },
    'FINANCIERO_CONSOLIDADO': {
      icon: TrendingUp,
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      colorHover: 'hover:bg-amber-200',
      colorActivo: 'bg-amber-600 text-white'
    },
    'CONTROL_CONTRACTUAL': {
      icon: FileCheck,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      colorHover: 'hover:bg-purple-200',
      colorActivo: 'bg-purple-600 text-white'
    },
    'GERENCIAL_EJECUTIVO': {
      icon: Presentation,
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      colorHover: 'hover:bg-indigo-200',
      colorActivo: 'bg-indigo-600 text-white'
    }
  }), []);

  // Generar reporte
  const handleGenerarReporte = useCallback(async (configuracionExportacion: ConfiguracionExportacion) => {
    try {
      const solicitud: SolicitudReporte = {
        tipo: tipoReporteActivo,
        nombre: `${TIPOS_REPORTE[tipoReporteActivo]} - ${new Date().toLocaleDateString('es-PE')}`,
        filtros,
        opciones,
        configuracionExportacion
      };

      const resultado = await generarReporte(solicitud);
      
      if (resultado.estado === 'COMPLETADO') {
        setVistaActiva('historial');
      }
      
      return {
        exito: true,
        rutaArchivo: resultado.rutaArchivo,
        urlDescarga: resultado.urlDescarga,
        tamaño: resultado.tamaño,
        tiempoGeneracion: resultado.tiempoGeneracion
      };
    } catch (error) {
      return {
        exito: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }, [tipoReporteActivo, filtros, opciones, generarReporte]);

  // Obtener datos para vista previa
  const datosVistaPrevia = useMemo(() => {
    try {
      return obtenerDatosReporte(tipoReporteActivo, filtros);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      return null;
    }
  }, [tipoReporteActivo, filtros, obtenerDatosReporte]);

  // Renderizar componente de reporte específico
  const renderizarVistaPrevia = () => {
    if (!datosVistaPrevia) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Error al cargar datos</h3>
          <p className="text-gray-600">No se pudieron obtener los datos para la vista previa</p>
        </div>
      );
    }

    switch (tipoReporteActivo) {
      case 'VALORIZACION_MENSUAL':
        return <ReporteValorizacion datos={datosVistaPrevia as import('../../types/reporte.types').DatosReporteValorizacion} filtros={filtros} />;
      case 'AVANCE_OBRA':
        return <ReporteAvanceObra datos={datosVistaPrevia as import('../../types/reporte.types').DatosReporteAvanceObra} filtros={filtros} />;
      case 'FINANCIERO_CONSOLIDADO':
        return <ReporteFinanciero datos={datosVistaPrevia as import('../../types/reporte.types').DatosReporteFinanciero} filtros={filtros} />;
      case 'CONTROL_CONTRACTUAL':
        return <ReporteContractual datos={datosVistaPrevia as import('../../types/reporte.types').DatosReporteContractual} filtros={filtros} />;
      case 'GERENCIAL_EJECUTIVO':
        return <ReporteGerencial datos={datosVistaPrevia as import('../../types/reporte.types').DatosReporteGerencial} filtros={filtros} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Principal */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Centro de Reportes</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Sistema profesional de generación y análisis de reportes
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Estadísticas rápidas */}
              <div className="hidden lg:flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{estadisticas.totalReportes}</div>
                  <div className="text-gray-600">Reportes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{estadisticas.totalDescargas}</div>
                  <div className="text-gray-600">Descargas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{estadisticas.tiempoPromedioGeneracion.toFixed(1)}s</div>
                  <div className="text-gray-600">Tiempo Prom.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar de Navegación */}
          <div className="w-80 space-y-6">
            {/* Selector de Tipo de Reporte */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Tipo de Reporte
                </h3>
                <p className="text-sm text-gray-600">
                  Selecciona el tipo de análisis que necesitas
                </p>
              </div>
              
              <div className="p-4 space-y-2">
                {Object.entries(TIPOS_REPORTE).map(([tipo, nombre]) => {
                  const config = configuracionTipos[tipo as TipoReporte];
                  const IconComponent = config.icon;
                  const esActivo = tipoReporteActivo === tipo;
                  
                  return (
                    <button
                      key={tipo}
                      onClick={() => setTipoReporteActivo(tipo as TipoReporte)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        esActivo 
                          ? config.colorActivo
                          : `${config.color} ${config.colorHover}`
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <div>
                        <div className="font-medium text-sm">{nombre}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navegación de Vistas */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Navegación</h3>
              </div>
              
              <div className="p-4 space-y-2">
                {[
                  { id: 'configuracion', label: 'Configuración', icon: Filter },
                  { id: 'vista-previa', label: 'Vista Previa', icon: Eye },
                  { id: 'historial', label: 'Historial', icon: History }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setVistaActiva(id as any)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                      vistaActiva === id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Acciones</h3>
              </div>
              
              <div className="p-4 space-y-3">
                <button
                  onClick={() => setMostrarExportador(true)}
                  className="w-full flex items-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Generar Reporte</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Configurar Plantilla</span>
                </button>
              </div>
            </div>
          </div>

          {/* Área Principal */}
          <div className="flex-1">
            {vistaActiva === 'configuracion' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <FiltrosAvanzados
                  filtros={filtros}
                  onFiltrosChange={setFiltros}
                  tipoReporte={tipoReporteActivo}
                  onAplicar={() => setVistaActiva('vista-previa')}
                  onReset={() => setFiltros({
                    periodo: 'MENSUAL',
                    fechaInicio: new Date().toISOString().split('T')[0].replace(/-(\d{2})$/, '-01'),
                    fechaFin: new Date().toISOString().split('T')[0],
                    niveLDetalle: 'DETALLADO'
                  })}
                />

                {/* Opciones de Presentación */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Opciones de Presentación
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Personaliza el contenido de tu reporte
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {[
                      { key: 'incluirGraficos', label: 'Incluir gráficos y visualizaciones' },
                      { key: 'incluirResumenEjecutivo', label: 'Incluir resumen ejecutivo' },
                      { key: 'incluirAnalisisComparativo', label: 'Incluir análisis comparativo' },
                      { key: 'incluirRecomendaciones', label: 'Incluir recomendaciones' },
                      { key: 'incluirAnexos', label: 'Incluir anexos y documentación' },
                      { key: 'numerarPaginas', label: 'Numerar páginas' }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={opciones[key as keyof OpcionesPresentacion] as boolean}
                          onChange={(e) => setOpciones(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {vistaActiva === 'vista-previa' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Vista Previa - {TIPOS_REPORTE[tipoReporteActivo]}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {filtros.fechaInicio} al {filtros.fechaFin}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setMostrarExportador(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Exportar
                    </button>
                  </div>
                </div>
                
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    renderizarVistaPrevia()
                  )}
                </div>
              </motion.div>
            )}

            {vistaActiva === 'historial' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200"
              >
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Historial de Reportes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {reportes.length} reportes generados
                  </p>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {reportes.map((reporte) => (
                    <div key={reporte.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              configuracionTipos[reporte.tipo].color
                            }`}>
                              {(() => {
                                const IconComponent = configuracionTipos[reporte.tipo].icon;
                                return <IconComponent className="w-5 h-5" />;
                              })()}
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900">{reporte.nombre}</h4>
                              <p className="text-sm text-gray-600">
                                {TIPOS_REPORTE[reporte.tipo]} • {reporte.formato}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="text-right">
                            <div className="font-medium">
                              {new Date(reporte.fechaGeneracion).toLocaleDateString('es-PE')}
                            </div>
                            <div className="text-xs">
                              {reporte.numeroDescargas} descargas
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {reporte.estado === 'COMPLETADO' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-600" />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => descargarReporte(reporte.id)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => eliminarReporte(reporte.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {reportes.length === 0 && (
                    <div className="p-12 text-center">
                      <History className="w-12 h-12 text-gray-400 dark:text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No hay reportes generados</h3>
                      <p className="text-gray-600">Genera tu primer reporte para verlo aquí</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Exportador */}
      {mostrarExportador && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Exportar {TIPOS_REPORTE[tipoReporteActivo]}
              </h3>
              <button
                onClick={() => setMostrarExportador(false)}
                className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <ExportadorReporte
                onExportar={handleGenerarReporte}
                nombreReporteBase={`${TIPOS_REPORTE[tipoReporteActivo]} ${new Date().toLocaleDateString('es-PE')}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mostrar errores */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reporte;