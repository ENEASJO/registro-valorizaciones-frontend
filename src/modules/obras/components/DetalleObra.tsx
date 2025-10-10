import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit2,
  RefreshCw,
} from 'lucide-react';
import type { Obra } from '../types';

interface DetalleObraProps {
  obra: Obra;
  isOpen: boolean;
  onClose: () => void;
  onEditar: () => void;
  onActualizarMEF: () => void;
}

const DetalleObra: React.FC<DetalleObraProps> = ({
  obra,
  isOpen,
  onClose,
  onEditar,
  onActualizarMEF,
}) => {
  if (!isOpen) return null;

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(monto);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      registrada: 'bg-blue-100 text-blue-800',
      en_ejecucion: 'bg-green-100 text-green-800',
      paralizada: 'bg-yellow-100 text-yellow-800',
      terminada: 'bg-purple-100 text-purple-800',
      liquidada: 'bg-gray-100 text-gray-800',
      cancelada: 'bg-red-100 text-red-800',
    };
    return colores[estado] || colores.registrada;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Building2 className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Detalle de Obra</h2>
              <p className="text-blue-100 text-sm">
                {obra.cui ? `CUI: ${obra.cui}` : obra.codigo || 'Sin código'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onActualizarMEF}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors text-white"
              title="Actualizar datos MEF"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={onEditar}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors text-white"
              title="Editar obra"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Información General */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre de la Obra</p>
                <p className="font-medium text-gray-900">
                  {obra.datos_mef?.nombre || obra.nombre || 'Sin nombre'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CUI / Código</p>
                <p className="font-medium text-gray-900">
                  {obra.cui || obra.codigo || 'Sin código'}
                </p>
              </div>
              {obra.codigo_interno && (
                <div>
                  <p className="text-sm text-gray-500">Código Interno</p>
                  <p className="font-medium text-gray-900">{obra.codigo_interno}</p>
                </div>
              )}
              {obra.datos_mef?.estado && (
                <div>
                  <p className="text-sm text-gray-500">Estado MEF</p>
                  <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    {obra.datos_mef.estado}
                  </span>
                </div>
              )}
              {obra.datos_mef?.etapa && (
                <div>
                  <p className="text-sm text-gray-500">Etapa</p>
                  <p className="font-medium text-gray-900">{obra.datos_mef.etapa}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Estado de la Obra</p>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getEstadoColor(obra.estado_obra)}`}>
                  {obra.estado_obra}
                </span>
              </div>
              {obra.datos_mef?.fecha_registro && (
                <div>
                  <p className="text-sm text-gray-500">Fecha de Registro MEF</p>
                  <p className="font-medium text-gray-900">{formatearFecha(obra.datos_mef.fecha_registro)}</p>
                </div>
              )}
              {obra.fecha_actualizacion_mef && (
                <div>
                  <p className="text-sm text-gray-500">Última Actualización MEF</p>
                  <p className="font-medium text-gray-900">{formatearFecha(obra.fecha_actualizacion_mef)}</p>
                </div>
              )}
            </div>
          </section>

          {/* Costos y Financiamiento - Solo si hay datos MEF */}
          {obra.datos_mef?.costos_finales && (
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Costos y Financiamiento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Costo Total</p>
                  <p className="text-2xl font-bold text-green-800">
                    {formatearMoneda(obra.datos_mef.costos_finales.costo_total_actualizado)}
                  </p>
                </div>
                {obra.datos_mef.costos_finales.costo_obra && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Costo de Obra</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {formatearMoneda(obra.datos_mef.costos_finales.costo_obra)}
                    </p>
                  </div>
                )}
                {obra.datos_mef.costos_finales.costo_supervision && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Supervisión</p>
                    <p className="text-2xl font-bold text-purple-800">
                      {formatearMoneda(obra.datos_mef.costos_finales.costo_supervision)}
                    </p>
                  </div>
                )}
              </div>

              {obra.datos_mef.costos_finales.fuentes_financiamiento && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Fuentes de Financiamiento</p>
                  <div className="space-y-2">
                    {obra.datos_mef.costos_finales.fuentes_financiamiento.map((fuente, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <span className="text-sm text-gray-700">{fuente.fuente}</span>
                        <span className="font-medium text-gray-900">{formatearMoneda(fuente.monto)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Costos Modelo Antiguo - Si no hay datos MEF pero hay monto contractual */}
          {!obra.datos_mef && obra.monto_contractual && (
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Información Financiera
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Monto Contractual</p>
                  <p className="text-2xl font-bold text-green-800">
                    {formatearMoneda(Number(obra.monto_contractual))}
                  </p>
                </div>
                {obra.monto_total && Number(obra.monto_total) > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Monto Total</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {formatearMoneda(Number(obra.monto_total))}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Datos Contractuales - Solo si existen */}
          {(obra.contrato || obra.contrato_numero) && (
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Datos Contractuales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(obra.contrato?.numero_contrato || obra.contrato_numero) && (
                  <div>
                    <p className="text-sm text-gray-500">Número de Contrato</p>
                    <p className="font-medium text-gray-900">
                      {obra.contrato?.numero_contrato || obra.contrato_numero}
                    </p>
                  </div>
                )}
                {(obra.contrato?.fecha_contrato || obra.contrato_fecha) && (
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Contrato</p>
                    <p className="font-medium text-gray-900">
                      {formatearFecha(obra.contrato?.fecha_contrato || obra.contrato_fecha!)}
                    </p>
                  </div>
                )}
                {(obra.contrato?.plazo_ejecucion_dias || obra.contrato_plazo_dias) && (
                  <div>
                    <p className="text-sm text-gray-500">Plazo de Ejecución</p>
                    <p className="font-medium text-gray-900">
                      {obra.contrato?.plazo_ejecucion_dias || obra.contrato_plazo_dias} días
                    </p>
                  </div>
                )}
                {(obra.contrato?.monto_contratado || obra.contrato_monto) && (
                  <div>
                    <p className="text-sm text-gray-500">Monto Contratado</p>
                    <p className="font-medium text-gray-900">
                      {formatearMoneda(Number(obra.contrato?.monto_contratado || obra.contrato_monto))}
                    </p>
                  </div>
                )}
                {(obra.contrato?.contratista_ruc || obra.contratista_ruc) && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Contratista RUC</p>
                      <p className="font-medium text-gray-900">
                        {obra.contrato?.contratista_ruc || obra.contratista_ruc}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Razón Social</p>
                      <p className="font-medium text-gray-900">
                        {obra.contrato?.contratista_nombre || obra.contratista_nombre}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {/* Ubicación - Solo si existe */}
          {obra.ubicacion && (
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                Ubicación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {obra.ubicacion.tipo && (
                  <div>
                    <p className="text-sm text-gray-500">Tipo de Ubicación</p>
                    <p className="font-medium text-gray-900">{obra.ubicacion.tipo}</p>
                  </div>
                )}
                {obra.ubicacion.nombre_ubicacion && (
                  <div>
                    <p className="text-sm text-gray-500">Ubicación Específica</p>
                    <p className="font-medium text-gray-900">{obra.ubicacion.nombre_ubicacion}</p>
                  </div>
                )}
                {obra.ubicacion.direccion_especifica && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Dirección Específica</p>
                    <p className="font-medium text-gray-900">{obra.ubicacion.direccion_especifica}</p>
                  </div>
                )}
                {obra.ubicacion.coordenadas && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Latitud</p>
                      <p className="font-medium text-gray-900">{obra.ubicacion.coordenadas.latitud}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Longitud</p>
                      <p className="font-medium text-gray-900">{obra.ubicacion.coordenadas.longitud}</p>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {/* Expediente Técnico */}
          {obra.datos_mef?.expediente_tecnico && (
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Expediente Técnico
              </h3>

              {obra.datos_mef.expediente_tecnico.modalidad_ejecucion && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Modalidad de Ejecución</p>
                  <p className="font-medium text-gray-900">{obra.datos_mef.expediente_tecnico.modalidad_ejecucion}</p>
                </div>
              )}

              {obra.datos_mef.expediente_tecnico.metas && obra.datos_mef.expediente_tecnico.metas.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Metas Físicas</p>
                  <div className="space-y-3">
                    {obra.datos_mef.expediente_tecnico.metas.map((meta, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-gray-500">Componente</p>
                            <p className="font-medium text-gray-900">{meta.componente}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Meta</p>
                            <p className="font-medium text-gray-900">{meta.meta}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Unidad de Medida</p>
                            <p className="font-medium text-gray-900">{meta.unidad_medida}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Modificaciones de Ejecución */}
          {obra.datos_mef?.modificaciones_ejecucion && obra.datos_mef.modificaciones_ejecucion.documentos && obra.datos_mef.modificaciones_ejecucion.documentos.length > 0 && (
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                Modificaciones de Ejecución
              </h3>
              <div className="space-y-3">
                {obra.datos_mef.modificaciones_ejecucion.documentos.map((doc, idx) => (
                  <div key={idx} className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-yellow-700">Tipo de Documento</p>
                        <p className="font-medium text-yellow-900">{doc.tipo_documento}</p>
                      </div>
                      <div>
                        <p className="text-xs text-yellow-700">Número</p>
                        <p className="font-medium text-yellow-900">{doc.numero_documento}</p>
                      </div>
                      <div>
                        <p className="text-xs text-yellow-700">Fecha</p>
                        <p className="font-medium text-yellow-900">{formatearFecha(doc.fecha_documento)}</p>
                      </div>
                      {doc.monto_modificacion && (
                        <div>
                          <p className="text-xs text-yellow-700">Monto Modificación</p>
                          <p className="font-medium text-yellow-900">{formatearMoneda(doc.monto_modificacion)}</p>
                        </div>
                      )}
                      {doc.observaciones && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-yellow-700">Observaciones</p>
                          <p className="text-sm text-yellow-900">{doc.observaciones}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Institucionalidad */}
          {obra.datos_mef?.institucionalidad && (
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Institucionalidad
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {obra.datos_mef.institucionalidad.unidad_formuladora && (
                  <div>
                    <p className="text-sm text-gray-500">Unidad Formuladora</p>
                    <p className="font-medium text-gray-900">{obra.datos_mef.institucionalidad.unidad_formuladora}</p>
                  </div>
                )}
                {obra.datos_mef.institucionalidad.unidad_ejecutora && (
                  <div>
                    <p className="text-sm text-gray-500">Unidad Ejecutora</p>
                    <p className="font-medium text-gray-900">{obra.datos_mef.institucionalidad.unidad_ejecutora}</p>
                  </div>
                )}
                {obra.datos_mef.institucionalidad.responsable_ue && (
                  <div>
                    <p className="text-sm text-gray-500">Responsable UE</p>
                    <p className="font-medium text-gray-900">{obra.datos_mef.institucionalidad.responsable_ue}</p>
                  </div>
                )}
                {obra.datos_mef.institucionalidad.sector && (
                  <div>
                    <p className="text-sm text-gray-500">Sector</p>
                    <p className="font-medium text-gray-900">{obra.datos_mef.institucionalidad.sector}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Observaciones */}
          {obra.observaciones && (
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-600" />
                Observaciones
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{obra.observaciones}</p>
            </section>
          )}

          {/* Metadatos */}
          <section className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {obra.datos_mef?.fuente && (
                <div>
                  <p className="text-gray-500">Fuente MEF</p>
                  <p className="font-medium text-gray-700">{obra.datos_mef.fuente}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500">Creado</p>
                <p className="font-medium text-gray-700">{formatearFecha(obra.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-500">Última Modificación</p>
                <p className="font-medium text-gray-700">{formatearFecha(obra.updated_at)}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onEditar}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar Obra
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DetalleObra;
