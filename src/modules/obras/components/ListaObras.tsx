import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Building2,
  DollarSign,
  Calendar,
  MapPin,
  Eye,
  Edit2,
  Trash2,
  Filter,
  RefreshCw,
  Download,
} from 'lucide-react';
import type { Obra, FiltrosObra, EstadoObra } from '../types';
import { obrasService } from '../services/obrasService';

interface ListaObrasProps {
  onNuevaObra: () => void;
  onEditarObra: (obra: Obra) => void;
  onVerObra: (obra: Obra) => void;
}

const ListaObras: React.FC<ListaObrasProps> = ({
  onNuevaObra,
  onEditarObra,
  onVerObra,
}) => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosObra>({});
  const [busqueda, setBusqueda] = useState('');
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    por_estado: {
      registrada: 0,
      en_ejecucion: 0,
      paralizada: 0,
      culminada: 0,
      liquidada: 0,
    } as Record<string, number>,
    inversion_total: 0,
  });

  useEffect(() => {
    cargarObras();
    cargarEstadisticas();
  }, [filtros]);

  const cargarObras = async () => {
    try {
      setCargando(true);
      const response = await obrasService.obtenerObras({
        ...filtros,
        busqueda,
      });

      // El backend retorna: {status: "success", data: [...]}
      if (response.status === "success" && response.data) {
        // response.data es directamente el array de obras
        const obrasArray = Array.isArray(response.data) ? response.data : (response.data.obras || []);
        setObras(obrasArray);
      }
    } catch (error) {
      console.error('Error cargando obras:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const stats = await obrasService.obtenerEstadisticas();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleBuscar = () => {
    setFiltros({ ...filtros, busqueda });
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta obra?')) {
      try {
        await obrasService.eliminarObra(id);
        cargarObras();
        cargarEstadisticas();
      } catch (error) {
        console.error('Error eliminando obra:', error);
      }
    }
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(monto);
  };

  const formatearFecha = (fecha: string | null | undefined): string => {
    if (!fecha) return '-';
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('es-PE');
    } catch {
      return '-';
    }
  };

  const getEstadoColor = (estado: EstadoObra) => {
    const colores = {
      registrada: 'bg-blue-100 text-blue-800',
      en_ejecucion: 'bg-green-100 text-green-800',
      paralizada: 'bg-yellow-100 text-yellow-800',
      terminada: 'bg-purple-100 text-purple-800',
      liquidada: 'bg-gray-100 text-gray-800',
      cancelada: 'bg-red-100 text-red-800',
    };
    return colores[estado] || colores.registrada;
  };

  const getEstadoTexto = (estado: EstadoObra) => {
    const textos = {
      registrada: 'Registrada',
      en_ejecucion: 'En Ejecución',
      paralizada: 'Paralizada',
      terminada: 'Terminada',
      liquidada: 'Liquidada',
      cancelada: 'Cancelada',
    };
    return textos[estado] || estado;
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Obras</p>
              <p className="text-3xl font-bold mt-2">{estadisticas.total}</p>
            </div>
            <Building2 className="w-12 h-12 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">En Ejecución</p>
              <p className="text-3xl font-bold mt-2">
                {estadisticas.por_estado.en_ejecucion || 0}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Terminadas</p>
              <p className="text-3xl font-bold mt-2">
                {estadisticas.por_estado.terminada || 0}
              </p>
            </div>
            <Download className="w-12 h-12 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Inversión Total</p>
              <p className="text-2xl font-bold mt-2">
                S/ {(estadisticas.inversion_total / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Barra de acciones */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 flex gap-4 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                placeholder="Buscar por CUI, nombre, número de contrato..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleBuscar}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Buscar
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={cargarObras}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Actualizar
            </button>
            <button
              onClick={onNuevaObra}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Obra
            </button>
          </div>
        </div>
      </div>

      {/* Lista de obras */}
      <div>
        {cargando ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-xl shadow-lg">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : obras.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay obras registradas
            </h3>
            <p className="text-gray-500 mb-6">
              Comienza creando la primera obra del sistema
            </p>
            <button
              onClick={onNuevaObra}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear Primera Obra
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {obras.map((obra) => (
              <motion.div
                key={obra.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all relative"
              >
                {/* Action buttons in top right corner */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={() => onVerObra(obra)}
                    className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-blue-50 rounded-lg shadow-md transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditarObra(obra)}
                    className="p-2 bg-white/90 backdrop-blur-sm text-green-600 hover:bg-green-50 rounded-lg shadow-md transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEliminar(obra.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm text-red-600 hover:bg-red-50 rounded-lg shadow-md transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Card content */}
                <div className="p-6">
                  {/* CUI Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                      <Building2 className="w-3 h-3 mr-1" />
                      {obra.cui ? `CUI: ${obra.cui}` : obra.codigo || 'Sin código'}
                    </span>
                  </div>

                  {/* Project Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 pr-20">
                    {obra.datos_mef?.data?.nombre || obra.nombre || 'Sin nombre'}
                  </h3>

                  {/* Contract Info */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {obra.contrato?.numero_contrato || obra.contrato_numero || 'Sin contrato'}
                      </span>
                    </div>
                    {(obra.contrato?.fecha_contrato || obra.contrato_fecha) && (
                      <div className="text-xs text-gray-500 ml-6">
                        {formatearFecha(obra.contrato?.fecha_contrato || obra.contrato_fecha)}
                      </div>
                    )}
                  </div>

                  {/* MEF Additional Info */}
                  {obra.datos_mef?.data && (
                    <div className="mb-4 pb-4 border-b border-gray-100 space-y-2">
                      {/* Unidad Ejecutora */}
                      {(obra.datos_mef.data.institucionalidad?.unidad_ejecutora ||
                        obra.datos_mef.data.institucionalidad?.uep?.nombre) && (
                        <div className="text-xs">
                          <span className="text-gray-500 font-medium">Unidad Ejecutora:</span>
                          <div className="text-gray-700 mt-0.5 line-clamp-2">
                            {obra.datos_mef.data.institucionalidad.unidad_ejecutora ||
                             obra.datos_mef.data.institucionalidad.uep?.nombre}
                          </div>
                        </div>
                      )}

                      {/* Función / Servicio Público */}
                      {(obra.datos_mef.data.responsabilidad_funcional?.funcion ||
                        obra.datos_mef.data.articulacion_pmi?.servicio_publico) && (
                        <div className="text-xs">
                          <span className="text-gray-500 font-medium">
                            {obra.datos_mef.data.responsabilidad_funcional?.funcion ? 'Función:' : 'Servicio:'}
                          </span>
                          <div className="text-gray-700 mt-0.5">
                            {obra.datos_mef.data.responsabilidad_funcional?.funcion ||
                             obra.datos_mef.data.articulacion_pmi?.servicio_publico}
                          </div>
                        </div>
                      )}

                      {/* Fechas de Ejecución del Expediente Técnico */}
                      {obra.datos_mef.data.expediente_tecnico?.fechas_muro && (
                        <div className="text-xs">
                          <span className="text-gray-500 font-medium">Plazo Ejecución:</span>
                          <div className="text-gray-700 mt-0.5">
                            {formatearFecha(obra.datos_mef.data.expediente_tecnico.fechas_muro.inicio)}
                            {' → '}
                            {formatearFecha(obra.datos_mef.data.expediente_tecnico.fechas_muro.termino)}
                          </div>
                        </div>
                      )}

                      {/* Modificaciones */}
                      {obra.datos_mef.data.modificaciones_ejecucion?.documentos &&
                       obra.datos_mef.data.modificaciones_ejecucion.documentos.length > 0 && (
                        <div className="text-xs">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                            {obra.datos_mef.data.modificaciones_ejecucion.documentos.length} modificación(es)
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Investment Amount */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Inversión Total</p>
                        <p className="text-xl font-bold text-green-700">
                          {obra.datos_mef?.data?.costos_finales?.costo_total_actualizado
                            ? formatearMoneda(obra.datos_mef.data.costos_finales.costo_total_actualizado)
                            : obra.monto_contractual
                              ? formatearMoneda(Number(obra.monto_contractual))
                              : 'S/ 0.00'}
                        </p>
                        {/* Subtotal Metas */}
                        {obra.datos_mef?.data?.expediente_tecnico?.subtotal_metas && (
                          <div className="mt-1 pt-1 border-t border-green-100">
                            <p className="text-xs text-gray-500">Subtotal Metas:</p>
                            <p className="text-sm font-semibold text-green-600">
                              {formatearMoneda(obra.datos_mef.data.expediente_tecnico.subtotal_metas)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="space-y-3">
                    {/* MEF Status */}
                    {obra.datos_mef?.data?.estado && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Estado MEF</p>
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            <MapPin className="w-3 h-3 mr-1" />
                            {obra.datos_mef.data.estado}
                          </span>
                          {obra.datos_mef.data.etapa && (
                            <span className="text-xs text-gray-600 ml-1">
                              {obra.datos_mef.data.etapa}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Obra Status */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Estado Obra</p>
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg ${getEstadoColor(obra.estado_obra)}`}>
                        {getEstadoTexto(obra.estado_obra)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaObras;
