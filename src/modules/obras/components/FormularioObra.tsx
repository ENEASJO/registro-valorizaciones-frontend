import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  Search,
  Building2,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  Target,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Download,
} from 'lucide-react';
import type {
  ObraFormulario,
  DatosMEF,
  SistemaContratacion,
  ModalidadEjecucion,
  EstadoObra,
  ZonaTipo,
} from '../types';
import { obrasService } from '../services/obrasService';
import { obtenerUbicacionesAgrupadas, type Ubicacion } from '../../../services/ubicacionesService';

interface FormularioObraProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ObraFormulario) => Promise<void>;
  obra?: any;
  loading?: boolean;
  title?: string;
}

const FormularioObra: React.FC<FormularioObraProps> = ({
  isOpen,
  onClose,
  onSubmit,
  obra,
  loading = false,
  title = 'Nueva Obra',
}) => {
  // Estados del formulario
  const [tabActual, setTabActual] = useState(0);
  const [consultandoMEF, setConsultandoMEF] = useState(false);
  const [datosMEF, setDatosMEF] = useState<DatosMEF | null>(null);
  const [errorMEF, setErrorMEF] = useState<string | null>(null);

  // Estados para ubicaciones
  const [ubicaciones, setUbicaciones] = useState<{
    urbana: Ubicacion[];
    centro_poblado: Ubicacion[];
    caserio: Ubicacion[];
  }>({
    urbana: [],
    centro_poblado: [],
    caserio: [],
  });
  const [cargandoUbicaciones, setCargandoUbicaciones] = useState(false);

  const [formulario, setFormulario] = useState<ObraFormulario>({
    cui: obra?.cui || '',
    importar_mef: false,
    numero_contrato: obra?.contrato?.numero_contrato || '',
    codigo_interno: obra?.codigo_interno || '',
    fecha_contrato: obra?.contrato?.fecha_contrato || '',
    sistema_contratacion: obra?.contrato?.sistema_contratacion || 'suma_alzada',
    modalidad_ejecucion: obra?.contrato?.modalidad_ejecucion || 'contrata',
    lugar_ejecucion: obra?.ubicacion?.lugar_ejecucion || '',
    zona_tipo: obra?.ubicacion?.zona_tipo || 'urbana',
    estado_obra: obra?.estado_obra || 'registrada',
  });

  // Cargar ubicaciones al montar el componente
  useEffect(() => {
    const cargarUbicaciones = async () => {
      setCargandoUbicaciones(true);
      try {
        const response = await obtenerUbicacionesAgrupadas();
        if (response.status === 'success' && response.data) {
          setUbicaciones(response.data);
        }
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error);
      } finally {
        setCargandoUbicaciones(false);
      }
    };

    if (isOpen) {
      cargarUbicaciones();
    }
  }, [isOpen]);

  // Consultar datos MEF
  const consultarMEF = useCallback(async () => {
    if (!formulario.cui || formulario.cui.trim().length === 0) {
      setErrorMEF('Ingrese un CUI válido');
      return;
    }

    setConsultandoMEF(true);
    setErrorMEF(null);

    try {
      const response = await obrasService.consultarMEF(formulario.cui);

      if (response.success && response.data) {
        setDatosMEF(response.data);
        setFormulario((prev) => ({
          ...prev,
          datos_mef: response.data,
          importar_mef: true,
        }));
        setErrorMEF(null);
      } else {
        setErrorMEF('No se encontraron datos para este CUI');
        setDatosMEF(null);
      }
    } catch (error: any) {
      setErrorMEF(error.message || 'Error al consultar MEF Invierte');
      setDatosMEF(null);
    } finally {
      setConsultandoMEF(false);
    }
  }, [formulario.cui]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formulario);
  };

  const handleChange = (
    field: keyof ObraFormulario,
    value: any
  ) => {
    setFormulario((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const tabs = [
    { id: 0, nombre: 'Datos MEF', icono: Download },
    { id: 1, nombre: 'Datos Contractuales', icono: FileText },
    { id: 2, nombre: 'Ubicación', icono: MapPin },
    { id: 3, nombre: 'Observaciones', icono: Building2 },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center gap-3">
              <Building2 className="w-7 h-7 text-white" />
              <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTabActual(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-colors
                  ${
                    tabActual === tab.id
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <tab.icono className="w-5 h-5" />
                <span className="font-medium">{tab.nombre}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col h-[calc(90vh-140px)]">
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB 0: Datos MEF */}
              {tabActual === 0 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Importar datos desde MEF Invierte
                    </h3>
                    <p className="text-sm text-blue-700">
                      Ingresa el CUI para consultar y cargar automáticamente los datos
                      del proyecto desde el Banco de Inversiones del MEF.
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CUI (Código Único de Inversiones) *
                      </label>
                      <input
                        type="text"
                        value={formulario.cui}
                        onChange={(e) => handleChange('cui', e.target.value)}
                        placeholder="2595080"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={consultarMEF}
                        disabled={consultandoMEF || !formulario.cui}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {consultandoMEF ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Search className="w-5 h-5" />
                        )}
                        {consultandoMEF ? 'Consultando...' : 'Consultar'}
                      </button>
                    </div>
                  </div>

                  {errorMEF && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <p className="text-sm text-red-700">{errorMEF}</p>
                    </div>
                  )}

                  {datosMEF && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-6"
                    >
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="w-6 h-6" />
                        <h3 className="font-semibold text-lg">Datos MEF Cargados</h3>
                      </div>

                      {/* 1. INFORMACIÓN GENERAL */}
                      <div className="bg-white rounded-lg p-5 shadow-sm space-y-4">
                        <h4 className="font-bold text-green-800 text-base uppercase border-b-2 border-green-200 pb-2">📋 Información General</h4>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                          <div className="col-span-2">
                            <span className="font-semibold text-gray-700 block mb-1">Nombre del Proyecto:</span>
                            <p className="text-gray-900 leading-relaxed">{datosMEF.nombre}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700 block mb-1">CUI:</span>
                            <p className="text-gray-900 font-mono text-base">{datosMEF.cui}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700 block mb-1">Estado:</span>
                            <p className="text-gray-900"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">{datosMEF.estado}</span></p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700 block mb-1">Etapa:</span>
                            <p className="text-gray-900">{datosMEF.etapa}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700 block mb-1">Fecha Registro:</span>
                            <p className="text-gray-900">{datosMEF.fecha_registro}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="font-semibold text-gray-700 block mb-1">Fuente:</span>
                            <p className="text-gray-600 text-xs italic">{datosMEF.fuente}</p>
                          </div>
                        </div>
                      </div>

                      {/* 2. COSTOS Y PRESUPUESTO */}
                      <div className="bg-white rounded-lg p-5 shadow-sm space-y-4">
                        <h4 className="font-bold text-green-800 text-base uppercase border-b-2 border-green-200 pb-2">💰 Costos y Presupuesto</h4>

                        {/* Costos del Expediente Técnico Original */}
                        {datosMEF.expediente_tecnico && (
                          <>
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <p className="font-semibold text-blue-900 text-xs uppercase mb-2">Expediente Técnico Original</p>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                {datosMEF.expediente_tecnico.subtotal_metas && (
                                  <div>
                                    <span className="font-medium text-gray-700 block text-xs">Subtotal Metas:</span>
                                    <p className="text-gray-900 font-bold">S/ {datosMEF.expediente_tecnico.subtotal_metas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                                  </div>
                                )}
                                {datosMEF.expediente_tecnico.costo_expediente_tecnico && (
                                  <div>
                                    <span className="font-medium text-gray-700 block text-xs">Expediente Técnico:</span>
                                    <p className="text-gray-900">S/ {datosMEF.expediente_tecnico.costo_expediente_tecnico.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                                  </div>
                                )}
                                {datosMEF.expediente_tecnico.costo_supervision && (
                                  <div>
                                    <span className="font-medium text-gray-700 block text-xs">Supervisión:</span>
                                    <p className="text-gray-900">S/ {datosMEF.expediente_tecnico.costo_supervision.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                                  </div>
                                )}
                                {datosMEF.expediente_tecnico.costo_liquidacion && (
                                  <div>
                                    <span className="font-medium text-gray-700 block text-xs">Liquidación:</span>
                                    <p className="text-gray-900">S/ {datosMEF.expediente_tecnico.costo_liquidacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                                  </div>
                                )}
                                {datosMEF.expediente_tecnico.costo_inversion_actualizado && (
                                  <div className="col-span-2 mt-2 pt-2 border-t border-blue-300">
                                    <span className="font-semibold text-blue-900 block text-xs">Costo Inversión Actualizado:</span>
                                    <p className="text-blue-900 font-bold text-lg">S/ {datosMEF.expediente_tecnico.costo_inversion_actualizado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Costos Modificados (si existen) */}
                        {datosMEF.modificaciones_ejecucion && (
                          <div className="bg-orange-50 border border-orange-200 rounded p-3">
                            <p className="font-semibold text-orange-900 text-xs uppercase mb-2">⚠️ Costos Modificados durante Ejecución</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              {datosMEF.modificaciones_ejecucion.subtotal_modificado && (
                                <div>
                                  <span className="font-medium text-gray-700 block text-xs">Subtotal Modificado:</span>
                                  <p className="text-gray-900 font-bold">S/ {datosMEF.modificaciones_ejecucion.subtotal_modificado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                                </div>
                              )}
                              {datosMEF.modificaciones_ejecucion.costo_supervision_modificado && (
                                <div>
                                  <span className="font-medium text-gray-700 block text-xs">Supervisión Modificada:</span>
                                  <p className="text-gray-900">S/ {datosMEF.modificaciones_ejecucion.costo_supervision_modificado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                                </div>
                              )}
                              {datosMEF.modificaciones_ejecucion.costo_liquidacion_modificado && (
                                <div>
                                  <span className="font-medium text-gray-700 block text-xs">Liquidación Modificada:</span>
                                  <p className="text-gray-900">S/ {datosMEF.modificaciones_ejecucion.costo_liquidacion_modificado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                                </div>
                              )}
                              {datosMEF.modificaciones_ejecucion.costo_inversion_modificado && (
                                <div className="col-span-2 mt-2 pt-2 border-t border-orange-300">
                                  <span className="font-semibold text-orange-900 block text-xs">Costo Inversión Modificado:</span>
                                  <p className="text-orange-900 font-bold text-lg">S/ {datosMEF.modificaciones_ejecucion.costo_inversion_modificado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Costos Finales */}
                        <div className="bg-green-50 border-2 border-green-400 rounded p-3">
                          <p className="font-semibold text-green-900 text-xs uppercase mb-2">✅ Costos Finales</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="col-span-2">
                              <span className="font-bold text-green-900 block text-sm">COSTO TOTAL ACTUALIZADO:</span>
                              <p className="text-green-900 font-bold text-2xl">S/ {datosMEF.costos_finales.costo_total_actualizado?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                            </div>
                            {datosMEF.costos_finales.costo_control_concurrente > 0 && (
                              <div>
                                <span className="font-medium text-gray-700 block text-xs">Control Concurrente:</span>
                                <p className="text-gray-900">S/ {datosMEF.costos_finales.costo_control_concurrente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                              </div>
                            )}
                            {datosMEF.costos_finales.costo_controversias > 0 && (
                              <div>
                                <span className="font-medium text-gray-700 block text-xs">Controversias:</span>
                                <p className="text-gray-900">S/ {datosMEF.costos_finales.costo_controversias.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                              </div>
                            )}
                            {datosMEF.costos_finales.monto_carta_fianza > 0 && (
                              <div>
                                <span className="font-medium text-gray-700 block text-xs">Carta Fianza:</span>
                                <p className="text-gray-900">S/ {datosMEF.costos_finales.monto_carta_fianza.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 3. INSTITUCIONALIDAD */}
                      {datosMEF.institucionalidad && (
                        <div className="bg-white rounded-lg p-5 shadow-sm space-y-4">
                          <h4 className="font-bold text-green-800 text-base uppercase border-b-2 border-green-200 pb-2">🏛️ Institucionalidad</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {datosMEF.institucionalidad.uep && datosMEF.institucionalidad.uep.codigo && (
                              <div className="col-span-2">
                                <span className="font-semibold text-gray-700 block mb-1">Unidad Ejecutora de Proyectos (UEP):</span>
                                <p className="text-gray-900">
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">{datosMEF.institucionalidad.uep.codigo}</span>
                                  {datosMEF.institucionalidad.uep.nombre && <span className="ml-2">{datosMEF.institucionalidad.uep.nombre.trim()}</span>}
                                </p>
                              </div>
                            )}
                            {datosMEF.institucionalidad.sector && (
                              <div>
                                <span className="font-semibold text-gray-700 block mb-1">Sector:</span>
                                <p className="text-gray-900">{datosMEF.institucionalidad.sector}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 4. METAS FÍSICAS */}
                      {datosMEF.expediente_tecnico?.metas && datosMEF.expediente_tecnico.metas.length > 0 && (
                        <div className="bg-white rounded-lg p-5 shadow-sm space-y-4">
                          <h4 className="font-bold text-green-800 text-base uppercase border-b-2 border-green-200 pb-2">🎯 Metas Físicas</h4>
                          <div className="space-y-3">
                            {datosMEF.expediente_tecnico.metas.map((meta, idx) => (
                              <div key={idx} className="border-l-4 border-green-500 bg-gray-50 pl-4 pr-3 py-3 rounded-r">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-bold text-gray-900 text-sm">{meta.tipo} - {meta.activo}</p>
                                    <div className="flex gap-3 mt-1 text-xs text-gray-600">
                                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{meta.naturaleza}</span>
                                      <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">{meta.factor_productivo}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-green-700 text-lg">{meta.cantidad}</p>
                                    <p className="text-gray-600 text-xs">{meta.unidad}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 5. CRONOGRAMA Y FECHAS */}
                      {datosMEF.expediente_tecnico && (
                        <div className="bg-white rounded-lg p-5 shadow-sm space-y-4">
                          <h4 className="font-bold text-green-800 text-base uppercase border-b-2 border-green-200 pb-2">📅 Cronograma y Fechas</h4>

                          {datosMEF.expediente_tecnico.modalidad_ejecucion && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                              <span className="font-semibold text-blue-900 block text-xs uppercase">Modalidad de Ejecución</span>
                              <p className="text-blue-900 font-medium mt-1">{datosMEF.expediente_tecnico.modalidad_ejecucion}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {/* Fechas Originales */}
                            {datosMEF.expediente_tecnico.fechas_muro && (
                              <div className="bg-gray-50 rounded p-3">
                                <span className="font-semibold text-gray-800 block mb-2 text-xs uppercase">🧱 Muro de Contención</span>
                                <div className="space-y-1 text-xs">
                                  <p><span className="font-medium text-gray-600">Inicio:</span> <span className="text-gray-900">{datosMEF.expediente_tecnico.fechas_muro.inicio}</span></p>
                                  <p><span className="font-medium text-gray-600">Término:</span> <span className="text-gray-900">{datosMEF.expediente_tecnico.fechas_muro.termino}</span></p>
                                  <p><span className="font-medium text-gray-600">Entrega:</span> <span className="text-gray-900">{datosMEF.expediente_tecnico.fechas_muro.entrega}</span></p>
                                </div>
                              </div>
                            )}

                            {datosMEF.expediente_tecnico.fechas_ptar && (
                              <div className="bg-gray-50 rounded p-3">
                                <span className="font-semibold text-gray-800 block mb-2 text-xs uppercase">💧 PTAR</span>
                                <div className="space-y-1 text-xs">
                                  <p><span className="font-medium text-gray-600">Inicio:</span> <span className="text-gray-900">{datosMEF.expediente_tecnico.fechas_ptar.inicio}</span></p>
                                  <p><span className="font-medium text-gray-600">Término:</span> <span className="text-gray-900">{datosMEF.expediente_tecnico.fechas_ptar.termino}</span></p>
                                  <p><span className="font-medium text-gray-600">Entrega:</span> <span className="text-gray-900">{datosMEF.expediente_tecnico.fechas_ptar.entrega}</span></p>
                                </div>
                              </div>
                            )}

                            {/* Fechas Modificadas */}
                            {datosMEF.modificaciones_ejecucion?.fechas_muro_modificado && (
                              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                                <span className="font-semibold text-orange-800 block mb-2 text-xs uppercase">🧱 Muro (Modificado)</span>
                                <div className="space-y-1 text-xs">
                                  <p><span className="font-medium text-gray-600">Inicio:</span> <span className="text-orange-900">{datosMEF.modificaciones_ejecucion.fechas_muro_modificado.inicio}</span></p>
                                  <p><span className="font-medium text-gray-600">Término Vigente:</span> <span className="text-orange-900 font-bold">{datosMEF.modificaciones_ejecucion.fechas_muro_modificado.termino_vigente}</span></p>
                                  <p><span className="font-medium text-gray-600">Entrega:</span> <span className="text-orange-900">{datosMEF.modificaciones_ejecucion.fechas_muro_modificado.entrega}</span></p>
                                </div>
                              </div>
                            )}

                            {datosMEF.modificaciones_ejecucion?.fechas_ptar_modificado && (
                              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                                <span className="font-semibold text-orange-800 block mb-2 text-xs uppercase">💧 PTAR (Modificado)</span>
                                <div className="space-y-1 text-xs">
                                  <p><span className="font-medium text-gray-600">Inicio:</span> <span className="text-orange-900">{datosMEF.modificaciones_ejecucion.fechas_ptar_modificado.inicio}</span></p>
                                  <p><span className="font-medium text-gray-600">Término Vigente:</span> <span className="text-orange-900 font-bold">{datosMEF.modificaciones_ejecucion.fechas_ptar_modificado.termino_vigente}</span></p>
                                  <p><span className="font-medium text-gray-600">Entrega:</span> <span className="text-orange-900">{datosMEF.modificaciones_ejecucion.fechas_ptar_modificado.entrega}</span></p>
                                </div>
                              </div>
                            )}

                            {datosMEF.expediente_tecnico.fechas_supervision && (
                              <div className="bg-gray-50 rounded p-3">
                                <span className="font-semibold text-gray-800 block mb-2 text-xs uppercase">👁️ Supervisión</span>
                                <div className="space-y-1 text-xs">
                                  <p><span className="font-medium text-gray-600">Inicio:</span> <span className="text-gray-900">{datosMEF.expediente_tecnico.fechas_supervision.inicio}</span></p>
                                  <p><span className="font-medium text-gray-600">Término:</span> <span className="text-gray-900">{datosMEF.expediente_tecnico.fechas_supervision.termino}</span></p>
                                </div>
                              </div>
                            )}

                            {datosMEF.modificaciones_ejecucion?.fechas_supervision_modificado && (
                              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                                <span className="font-semibold text-orange-800 block mb-2 text-xs uppercase">👁️ Supervisión (Modificado)</span>
                                <div className="space-y-1 text-xs">
                                  <p><span className="font-medium text-gray-600">Inicio:</span> <span className="text-orange-900">{datosMEF.modificaciones_ejecucion.fechas_supervision_modificado.inicio}</span></p>
                                  <p><span className="font-medium text-gray-600">Término Vigente:</span> <span className="text-orange-900 font-bold">{datosMEF.modificaciones_ejecucion.fechas_supervision_modificado.termino_vigente}</span></p>
                                </div>
                              </div>
                            )}

                            {datosMEF.expediente_tecnico.fechas_liquidacion && (
                              <div className="bg-gray-50 rounded p-3">
                                <span className="font-semibold text-gray-800 block mb-2 text-xs uppercase">📊 Liquidación</span>
                                <div className="space-y-1 text-xs">
                                  <p><span className="font-medium text-gray-600">Inicio:</span> <span className="text-gray-900">{datosMEF.expediente_tecnico.fechas_liquidacion.inicio}</span></p>
                                  <p><span className="font-medium text-gray-600">Término:</span> <span className="text-gray-900">{datosMEF.expediente_tecnico.fechas_liquidacion.termino}</span></p>
                                </div>
                              </div>
                            )}

                            {datosMEF.modificaciones_ejecucion?.fechas_liquidacion_modificado && (
                              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                                <span className="font-semibold text-orange-800 block mb-2 text-xs uppercase">📊 Liquidación (Modificado)</span>
                                <div className="space-y-1 text-xs">
                                  <p><span className="font-medium text-gray-600">Inicio:</span> <span className="text-orange-900">{datosMEF.modificaciones_ejecucion.fechas_liquidacion_modificado.inicio}</span></p>
                                  <p><span className="font-medium text-gray-600">Término Vigente:</span> <span className="text-orange-900 font-bold">{datosMEF.modificaciones_ejecucion.fechas_liquidacion_modificado.termino_vigente}</span></p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 6. MODIFICACIONES DURANTE EJECUCIÓN */}
                      {datosMEF.modificaciones_ejecucion?.documentos && datosMEF.modificaciones_ejecucion.documentos.length > 0 && (
                        <div className="bg-white rounded-lg p-5 shadow-sm space-y-4">
                          <h4 className="font-bold text-green-800 text-base uppercase border-b-2 border-green-200 pb-2">📝 Documentos de Modificación</h4>
                          <div className="space-y-3">
                            {datosMEF.modificaciones_ejecucion.documentos.map((doc: any, idx) => (
                              <div key={idx} className="border-l-4 border-orange-500 bg-orange-50 pl-4 pr-3 py-3 rounded-r">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-bold text-orange-900 text-sm">
                                      {doc.tipo || doc.tipo_documento}
                                    </p>
                                    <p className="text-gray-700 text-xs mt-1">
                                      N° {doc.numero || doc.numero_documento}
                                    </p>
                                    {doc.descripcion && (
                                      <p className="text-gray-600 text-xs mt-1 italic">{doc.descripcion}</p>
                                    )}
                                  </div>
                                  <div className="text-right text-xs text-gray-600">
                                    {(doc.fecha || doc.fecha_documento) && (
                                      <p className="font-medium">{doc.fecha || doc.fecha_documento}</p>
                                    )}
                                    {doc.monto_modificacion && (
                                      <p className="font-bold text-orange-700 mt-1">
                                        S/ {doc.monto_modificacion.toLocaleString('es-PE')}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* TAB 1: Datos Contractuales */}
              {tabActual === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Contrato *
                      </label>
                      <input
                        type="text"
                        value={formulario.numero_contrato}
                        onChange={(e) => handleChange('numero_contrato', e.target.value)}
                        placeholder="N.º 01-2025-MDSM/GM"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Interno
                      </label>
                      <input
                        type="text"
                        value={formulario.codigo_interno || ''}
                        onChange={(e) => handleChange('codigo_interno', e.target.value)}
                        placeholder="OBR-2025-001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Contrato *
                      </label>
                      <input
                        type="date"
                        value={formulario.fecha_contrato}
                        onChange={(e) => handleChange('fecha_contrato', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sistema de Contratación *
                      </label>
                      <select
                        value={formulario.sistema_contratacion}
                        onChange={(e) => handleChange('sistema_contratacion', e.target.value as SistemaContratacion)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="suma_alzada">Suma Alzada</option>
                        <option value="precios_unitarios">Precios Unitarios</option>
                        <option value="tarifas">Tarifas</option>
                        <option value="porcentaje">Porcentaje</option>
                        <option value="llave_en_mano">Llave en Mano</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Modalidad de Ejecución *
                      </label>
                      <select
                        value={formulario.modalidad_ejecucion}
                        onChange={(e) => handleChange('modalidad_ejecucion', e.target.value as ModalidadEjecucion)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="contrata">Contrata</option>
                        <option value="administracion_directa">Administración Directa</option>
                        <option value="encargo">Encargo</option>
                        <option value="convenio">Convenio</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado de Obra *
                      </label>
                      <select
                        value={formulario.estado_obra}
                        onChange={(e) => handleChange('estado_obra', e.target.value as EstadoObra)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="registrada">Registrada</option>
                        <option value="en_ejecucion">En Ejecución</option>
                        <option value="paralizada">Paralizada</option>
                        <option value="terminada">Terminada</option>
                        <option value="liquidada">Liquidada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Ubicación */}
              {tabActual === 2 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Ubicación en San Marcos, Huari, Áncash
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Selecciona el tipo de zona y luego elige la ubicación específica de la lista
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Zona *
                      </label>
                      <select
                        value={formulario.zona_tipo}
                        onChange={(e) => {
                          const nuevoTipo = e.target.value as ZonaTipo;
                          handleChange('zona_tipo', nuevoTipo);
                          // Limpiar lugar de ejecución al cambiar tipo
                          handleChange('lugar_ejecucion', '');
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="urbana">Zona Urbana</option>
                        <option value="centro_poblado">Centro Poblado</option>
                        <option value="caserio">Caserío</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lugar de Ejecución *
                      </label>
                      {cargandoUbicaciones ? (
                        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          <span className="text-sm text-gray-500">Cargando ubicaciones...</span>
                        </div>
                      ) : (
                        <select
                          value={formulario.lugar_ejecucion}
                          onChange={(e) => handleChange('lugar_ejecucion', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Seleccione una ubicación</option>
                          {ubicaciones[formulario.zona_tipo]?.map((ubicacion) => (
                            <option key={ubicacion.id} value={ubicacion.nombre}>
                              {ubicacion.nombre}
                            </option>
                          ))}
                        </select>
                      )}
                      {!cargandoUbicaciones && ubicaciones[formulario.zona_tipo]?.length === 0 && (
                        <p className="text-xs text-amber-600 mt-1">
                          No hay ubicaciones registradas para este tipo de zona
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Observaciones */}
              {tabActual === 3 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    value={formulario.observaciones || ''}
                    onChange={(e) => handleChange('observaciones', e.target.value)}
                    rows={8}
                    placeholder="Observaciones adicionales sobre la obra..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <div className="flex gap-2">
                {tabActual > 0 && (
                  <button
                    type="button"
                    onClick={() => setTabActual(tabActual - 1)}
                    className="px-6 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                  >
                    Anterior
                  </button>
                )}

                {tabActual < tabs.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setTabActual(tabActual + 1)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Guardar Obra
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FormularioObra;
