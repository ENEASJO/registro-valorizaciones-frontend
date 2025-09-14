import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  User,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import type { 
  DatosReporteValorizacion, 
  FiltrosReporte 
} from '../../../types/reporte.types';

interface ReporteValorizacionProps {
  datos: DatosReporteValorizacion;
  filtros: FiltrosReporte;
}

const ReporteValorizacion = ({ datos, filtros }: ReporteValorizacionProps) => {
  // Cálculos adicionales
  const estadisticas = useMemo(() => ({
    totalPartidas: datos.partidas.length,
    partidasConAvance: datos.partidas.filter(p => p.metradoActual > 0).length,
    montoTotalPartidas: datos.partidas.reduce((sum, p) => sum + p.montoContractual, 0),
    montoEjecutadoPartidas: datos.partidas.reduce((sum, p) => sum + p.montoActual, 0),
    porcentajeDeduccionesTotales: (datos.valorizacion.deducciones.total / datos.valorizacion.montoBruto) * 100,
    eficienciaEjecucion: (datos.valorizacion.avanceFisicoAcumulado / datos.valorizacion.avanceEconomicoAcumulado) * 100
  }), [datos]);

  const formatearMoneda = (valor: number) => 
    `S/ ${valor.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatearPorcentaje = (valor: number) => 
    `${valor.toFixed(2)}%`;

  return (
    <div className="space-y-6 p-6">
      {/* Header del Reporte */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center border-b border-gray-200 pb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          REPORTE DE VALORIZACIÓN MENSUAL
        </h1>
        <p className="text-lg text-gray-700 mb-1">
          Valorización N° {datos.valorizacion.numero} - {datos.valorizacion.periodo}
        </p>
        <p className="text-sm text-gray-600">
          Período: {datos.valorizacion.periodoInicio} al {datos.valorizacion.periodoFin}
        </p>
      </motion.div>

      {/* Información General de la Obra */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg border border-gray-200"
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Información General de la Obra
            </h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <span className="text-sm font-medium text-gray-700">Nombre:</span>
                <span className="col-span-2 text-sm text-gray-900">{datos.obra.nombre}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <span className="text-sm font-medium text-gray-700">N° Contrato:</span>
                <span className="col-span-2 text-sm text-gray-900">{datos.obra.numeroContrato}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <span className="text-sm font-medium text-gray-700">Ubicación:</span>
                <span className="col-span-2 text-sm text-gray-900 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {datos.obra.ubicacion}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <span className="text-sm font-medium text-gray-700">Tipo de Obra:</span>
                <span className="col-span-2 text-sm text-gray-900">{datos.obra.tipoObra}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <span className="text-sm font-medium text-gray-700">Modalidad:</span>
                <span className="col-span-2 text-sm text-gray-900">{datos.obra.modalidadEjecucion}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <span className="text-sm font-medium text-gray-700">Monto Ejecución:</span>
                <span className="col-span-2 text-sm font-medium text-green-700">
                  {formatearMoneda(datos.obra.montoEjecucion)}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <span className="text-sm font-medium text-gray-700">Monto Supervisión:</span>
                <span className="col-span-2 text-sm font-medium text-blue-700">
                  {formatearMoneda(datos.obra.montoSupervision)}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <span className="text-sm font-medium text-gray-700">Monto Total:</span>
                <span className="col-span-2 text-sm font-bold text-gray-900">
                  {formatearMoneda(datos.obra.montoTotal)}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <span className="text-sm font-medium text-gray-700">Plazo:</span>
                <span className="col-span-2 text-sm text-gray-900 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {datos.obra.plazoEjecucionDias} días
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <span className="text-sm font-medium text-gray-700">Fecha Inicio:</span>
                <span className="col-span-2 text-sm text-gray-900">{datos.obra.fechaInicio}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Información de Contratista y Supervisor */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Contratista */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Contratista Ejecutor</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-3">
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Razón Social</span>
              <p className="text-sm font-medium text-gray-900">{datos.contratista.nombre}</p>
            </div>
            
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">RUC</span>
              <p className="text-sm text-gray-900">{datos.contratista.ruc}</p>
            </div>
            
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Representante Legal</span>
              <p className="text-sm text-gray-900">{datos.contratista.representanteLegal}</p>
            </div>
            
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Dirección</span>
              <p className="text-sm text-gray-900">{datos.contratista.direccion}</p>
            </div>
            
            {(datos.contratista.telefono || datos.contratista.email) && (
              <div className="flex items-center gap-4 pt-2 text-sm text-gray-600">
                {datos.contratista.telefono && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {datos.contratista.telefono}
                  </div>
                )}
                {datos.contratista.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {datos.contratista.email}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Supervisor */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Supervisor de Obra</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-3">
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Razón Social</span>
              <p className="text-sm font-medium text-gray-900">{datos.supervisor.nombre}</p>
            </div>
            
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">RUC</span>
              <p className="text-sm text-gray-900">{datos.supervisor.ruc}</p>
            </div>
            
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Supervisor Responsable</span>
              <p className="text-sm text-gray-900">{datos.supervisor.supervisorResponsable}</p>
            </div>
            
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Dirección</span>
              <p className="text-sm text-gray-900">{datos.supervisor.direccion}</p>
            </div>
            
            {(datos.supervisor.telefono || datos.supervisor.email) && (
              <div className="flex items-center gap-4 pt-2 text-sm text-gray-600">
                {datos.supervisor.telefono && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {datos.supervisor.telefono}
                  </div>
                )}
                {datos.supervisor.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {datos.supervisor.email}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Resumen de Valorización */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg border border-gray-200"
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Resumen de Valorización N° {datos.valorizacion.numero}
            </h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Montos Principales */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Montos y Cálculos</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Monto Bruto:</span>
                    <span className="text-sm font-bold text-green-700">
                      {formatearMoneda(datos.valorizacion.montoBruto)}
                    </span>
                  </div>
                  
                  <div className="ml-4 space-y-2 bg-red-50 p-3 rounded">
                    <div className="text-xs font-semibold text-red-800 mb-2">DEDUCCIONES</div>
                    {[
                      { label: 'Adelanto Directo', valor: datos.valorizacion.deducciones.adelantoDirecto },
                      { label: 'Adelanto Materiales', valor: datos.valorizacion.deducciones.adelantoMateriales },
                      { label: 'Retención Garantía', valor: datos.valorizacion.deducciones.retencionGarantia },
                      { label: 'Penalidades', valor: datos.valorizacion.deducciones.penalidades },
                      { label: 'Otras Deducciones', valor: datos.valorizacion.deducciones.otras }
                    ].map((deduccion, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-xs text-gray-700">{deduccion.label}:</span>
                        <span className="text-xs font-medium text-red-700">
                          -{formatearMoneda(deduccion.valor)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t border-red-200">
                      <span className="text-xs font-semibold text-red-800">Total Deducciones:</span>
                      <span className="text-xs font-bold text-red-800">
                        -{formatearMoneda(datos.valorizacion.deducciones.total)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Monto Neto:</span>
                    <span className="text-sm font-bold text-blue-700">
                      {formatearMoneda(datos.valorizacion.montoNeto)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">IGV (18%):</span>
                    <span className="text-sm font-medium text-gray-700">
                      {formatearMoneda(datos.valorizacion.igv)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 bg-green-50 px-3 rounded">
                    <span className="text-md font-bold text-gray-900">Monto Total con IGV:</span>
                    <span className="text-lg font-bold text-green-700">
                      {formatearMoneda(datos.valorizacion.montoTotal)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Indicadores de Estado */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Estado y Fechas</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${
                      datos.valorizacion.estado === 'APROBADA' ? 'bg-green-100' :
                      datos.valorizacion.estado === 'PAGADA' ? 'bg-blue-100' :
                      'bg-yellow-100'
                    }`}>
                      {datos.valorizacion.estado === 'APROBADA' || datos.valorizacion.estado === 'PAGADA' ? (
                        <CheckCircle className={`w-4 h-4 ${
                          datos.valorizacion.estado === 'PAGADA' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">Estado</p>
                      <p className="text-sm font-semibold text-gray-900">{datos.valorizacion.estado}</p>
                    </div>
                  </div>
                  
                  {datos.valorizacion.fechaPresentacion && (
                    <div>
                      <p className="text-xs font-medium text-gray-600">F. Presentación</p>
                      <p className="text-sm text-gray-900">{datos.valorizacion.fechaPresentacion}</p>
                    </div>
                  )}
                  
                  {datos.valorizacion.fechaAprobacion && (
                    <div>
                      <p className="text-xs font-medium text-gray-600">F. Aprobación</p>
                      <p className="text-sm text-gray-900">{datos.valorizacion.fechaAprobacion}</p>
                    </div>
                  )}
                  
                  {datos.valorizacion.fechaPago && (
                    <div>
                      <p className="text-xs font-medium text-gray-600">F. Pago</p>
                      <p className="text-sm text-gray-900">{datos.valorizacion.fechaPago}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Indicadores de Avance */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-900">Avance de Obra</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Avance Físico Mensual</span>
                    <span className="text-sm font-bold text-blue-700">
                      {formatearPorcentaje(datos.valorizacion.avanceFisicoMensual)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${datos.valorizacion.avanceFisicoMensual}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Avance Económico Mensual</span>
                    <span className="text-sm font-bold text-green-700">
                      {formatearPorcentaje(datos.valorizacion.avanceEconomicoMensual)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${datos.valorizacion.avanceEconomicoMensual}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Avance Físico Acumulado</span>
                    <span className="text-sm font-bold text-blue-700">
                      {formatearPorcentaje(datos.valorizacion.avanceFisicoAcumulado)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ width: `${datos.valorizacion.avanceFisicoAcumulado}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Avance Económico Acumulado</span>
                    <span className="text-sm font-bold text-green-700">
                      {formatearPorcentaje(datos.valorizacion.avanceEconomicoAcumulado)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full" 
                      style={{ width: `${datos.valorizacion.avanceEconomicoAcumulado}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Estadísticas Rápidas */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Estadísticas</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Partidas:</span>
                    <span className="font-medium">{estadisticas.totalPartidas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Con Avance:</span>
                    <span className="font-medium text-green-600">{estadisticas.partidasConAvance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">% Deducciones:</span>
                    <span className="font-medium text-red-600">
                      {formatearPorcentaje(estadisticas.porcentajeDeduccionesTotales)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eficiencia:</span>
                    <span className={`font-medium ${
                      estadisticas.eficienciaEjecucion >= 95 ? 'text-green-600' :
                      estadisticas.eficienciaEjecucion >= 85 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {formatearPorcentaje(estadisticas.eficienciaEjecucion)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Firmas y Aprobaciones */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg border border-gray-200"
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Firmas y Aprobaciones</h3>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              Valorización elaborada y presentada en la fecha: <strong>{datos.firmas.fechaFirmas}</strong>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="border-t-2 border-gray-400 pt-2 mb-2">
                <p className="font-semibold text-gray-900">{datos.firmas.residenteObra}</p>
                <p className="text-sm text-gray-600">RESIDENTE DE OBRA</p>
                <p className="text-xs text-gray-500">Contratista Ejecutor</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="border-t-2 border-gray-400 pt-2 mb-2">
                <p className="font-semibold text-gray-900">{datos.firmas.supervisorObra}</p>
                <p className="text-sm text-gray-600">SUPERVISOR DE OBRA</p>
                <p className="text-xs text-gray-500">Supervisor de Obra</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="border-t-2 border-gray-400 pt-2 mb-2">
                <p className="font-semibold text-gray-900">{datos.firmas.responsableEntidad}</p>
                <p className="text-sm text-gray-600">RESPONSABLE DE LA ENTIDAD</p>
                <p className="text-xs text-gray-500">Entidad Contratante</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ReporteValorizacion;