import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  Download,
  Mail,
  Printer,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  X
} from 'lucide-react';
import type { 
  ConfiguracionExportacion,
  FormatoExportacion,
  ResultadoExportacion 
} from '../../../types/reporte.types';
import { FORMATOS_EXPORTACION } from '../../../types/reporte.types';

interface ExportadorReporteProps {
  onExportar: (configuracion: ConfiguracionExportacion) => Promise<ResultadoExportacion>;
  nombreReporteBase: string;
  className?: string;
}

const ExportadorReporte = ({ 
  onExportar, 
  nombreReporteBase,
  className = '' 
}: ExportadorReporteProps) => {
  const [configuracion, setConfiguracion] = useState<ConfiguracionExportacion>({
    formato: 'PDF',
    nombreArchivo: nombreReporteBase,
    incluirPortada: true,
    incluirIndice: true,
    incluirGraficos: true,
    incluirAnexos: false,
    configuracionPDF: {
      orientacion: 'portrait',
      tamaño: 'A4',
      margen: 20,
      fuente: 'Arial',
      tamañoFuente: 12,
      numerarPaginas: true
    },
    configuracionExcel: {
      incluirFormulas: true,
      incluirGraficos: true,
      protegerHojas: false
    }
  });

  const [exportando, setExportando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoExportacion | null>(null);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);

  const iconosFormato: Record<FormatoExportacion, React.ReactNode> = {
    PDF: <FileText className="w-6 h-6" />,
    EXCEL: <FileSpreadsheet className="w-6 h-6" />,
    WORD: <File className="w-6 h-6" />,
    CSV: <FileSpreadsheet className="w-6 h-6" />
  };

  const coloresFormato: Record<FormatoExportacion, string> = {
    PDF: 'text-red-600 bg-red-100 border-red-200',
    EXCEL: 'text-green-600 bg-green-100 border-green-200',
    WORD: 'text-blue-600 bg-blue-100 border-blue-200',
    CSV: 'text-gray-600 bg-gray-100 border-gray-200'
  };

  const actualizarConfiguracion = <K extends keyof ConfiguracionExportacion>(
    campo: K,
    valor: ConfiguracionExportacion[K]
  ) => {
    setConfiguracion(prev => ({ ...prev, [campo]: valor }));
  };

  const actualizarConfiguracionPDF = <K extends keyof NonNullable<ConfiguracionExportacion['configuracionPDF']>>(
    campo: K,
    valor: NonNullable<ConfiguracionExportacion['configuracionPDF']>[K]
  ) => {
    setConfiguracion(prev => ({
      ...prev,
      configuracionPDF: {
        ...prev.configuracionPDF!,
        [campo]: valor
      }
    }));
  };

  const actualizarConfiguracionExcel = <K extends keyof NonNullable<ConfiguracionExportacion['configuracionExcel']>>(
    campo: K,
    valor: NonNullable<ConfiguracionExportacion['configuracionExcel']>[K]
  ) => {
    setConfiguracion(prev => ({
      ...prev,
      configuracionExcel: {
        ...prev.configuracionExcel!,
        [campo]: valor
      }
    }));
  };

  const handleExportar = async () => {
    setExportando(true);
    setResultado(null);

    try {
      const resultado = await onExportar(configuracion);
      setResultado(resultado);
      
      if (resultado.exito && resultado.urlDescarga) {
        // Iniciar descarga automática
        const link = document.createElement('a');
        link.href = resultado.urlDescarga;
        link.download = configuracion.nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      setResultado({
        exito: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setExportando(false);
    }
  };

  const formatearTamaño = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Exportar Reporte
              </h3>
              <p className="text-sm text-gray-600">
                Configure las opciones de exportación
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setMostrarConfiguracion(!mostrarConfiguracion)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            Configuración
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Selección de formato */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Formato de Exportación
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(FORMATOS_EXPORTACION).map(([key, label]) => (
              <button
                key={key}
                onClick={() => actualizarConfiguracion('formato', key as FormatoExportacion)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  configuracion.formato === key
                    ? `${coloresFormato[key as FormatoExportacion]} border-current`
                    : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {iconosFormato[key as FormatoExportacion]}
                  <span className="text-sm font-medium">{label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Configuración básica */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Archivo
          </label>
          <input
            type="text"
            value={configuracion.nombreArchivo}
            onChange={(e) => actualizarConfiguracion('nombreArchivo', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nombre del archivo sin extensión"
          />
        </div>

        {/* Opciones de contenido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Contenido a Incluir
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={configuracion.incluirPortada}
                onChange={(e) => actualizarConfiguracion('incluirPortada', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Incluir portada</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={configuracion.incluirIndice}
                onChange={(e) => actualizarConfiguracion('incluirIndice', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Incluir índice</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={configuracion.incluirGraficos}
                onChange={(e) => actualizarConfiguracion('incluirGraficos', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Incluir gráficos</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={configuracion.incluirAnexos}
                onChange={(e) => actualizarConfiguracion('incluirAnexos', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Incluir anexos</span>
            </label>
          </div>
        </div>

        {/* Configuración avanzada */}
        {mostrarConfiguracion && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 pt-6 space-y-6"
          >
            {configuracion.formato === 'PDF' && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Configuración PDF
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Orientación
                    </label>
                    <select
                      value={configuracion.configuracionPDF?.orientacion}
                      onChange={(e) => actualizarConfiguracionPDF('orientacion', e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="portrait">Vertical</option>
                      <option value="landscape">Horizontal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Tamaño de Página
                    </label>
                    <select
                      value={configuracion.configuracionPDF?.tamaño}
                      onChange={(e) => actualizarConfiguracionPDF('tamaño', e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="A4">A4</option>
                      <option value="A3">A3</option>
                      <option value="Letter">Letter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Margen (mm)
                    </label>
                    <input
                      type="number"
                      value={configuracion.configuracionPDF?.margen}
                      onChange={(e) => actualizarConfiguracionPDF('margen', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      min="10"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Tamaño de Fuente
                    </label>
                    <input
                      type="number"
                      value={configuracion.configuracionPDF?.tamañoFuente}
                      onChange={(e) => actualizarConfiguracionPDF('tamañoFuente', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      min="8"
                      max="16"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracion.configuracionPDF?.numerarPaginas}
                      onChange={(e) => actualizarConfiguracionPDF('numerarPaginas', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Numerar páginas</span>
                  </label>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Marca de Agua (opcional)
                  </label>
                  <input
                    type="text"
                    value={configuracion.configuracionPDF?.marcaAgua || ''}
                    onChange={(e) => actualizarConfiguracionPDF('marcaAgua', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Texto de marca de agua"
                  />
                </div>
              </div>
            )}

            {configuracion.formato === 'EXCEL' && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Configuración Excel
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracion.configuracionExcel?.incluirFormulas}
                      onChange={(e) => actualizarConfiguracionExcel('incluirFormulas', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Incluir fórmulas</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracion.configuracionExcel?.incluirGraficos}
                      onChange={(e) => actualizarConfiguracionExcel('incluirGraficos', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Incluir gráficos en hojas separadas</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracion.configuracionExcel?.protegerHojas}
                      onChange={(e) => actualizarConfiguracionExcel('protegerHojas', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Proteger hojas contra modificación</span>
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Estado de exportación */}
        {(exportando || resultado) && (
          <div className="border-t border-gray-200 pt-6">
            {exportando && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                <div>
                  <div className="font-medium text-blue-900">Generando reporte...</div>
                  <div className="text-sm text-blue-600">Esto puede tomar unos momentos</div>
                </div>
              </div>
            )}

            {resultado && (
              <div className={`flex items-start gap-3 p-4 rounded-lg ${
                resultado.exito 
                  ? 'bg-green-50 text-green-900' 
                  : 'bg-red-50 text-red-900'
              }`}>
                {resultado.exito ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-medium">
                    {resultado.exito ? 'Reporte generado exitosamente' : 'Error al generar reporte'}
                  </div>
                  <div className="text-sm mt-1">
                    {resultado.exito ? (
                      <div className="space-y-1">
                        {resultado.tamaño && <div>Tamaño: {formatearTamaño(resultado.tamaño)}</div>}
                        {resultado.tiempoGeneracion && <div>Tiempo: {resultado.tiempoGeneracion}s</div>}
                        <div>La descarga debería iniciarse automáticamente</div>
                      </div>
                    ) : (
                      <div>{resultado.error}</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setResultado(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex gap-3">
            <button
              onClick={handleExportar}
              disabled={exportando || !configuracion.nombreArchivo}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-5 h-5" />
              {exportando ? 'Generando...' : 'Exportar Reporte'}
            </button>

            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Mail className="w-5 h-5" />
              Enviar por Email
            </button>

            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Printer className="w-5 h-5" />
              Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportadorReporte;