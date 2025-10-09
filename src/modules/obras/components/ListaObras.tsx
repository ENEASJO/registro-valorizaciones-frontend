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

      // El backend retorna: {success: true, data: {obras: [...], total: 4}}
      if (response.success && response.data) {
        // response.data.obras contiene el array de obras
        const obrasArray = response.data.obras || response.data;
        setObras(Array.isArray(obrasArray) ? obrasArray : []);
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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {cargando ? (
          <div className="flex items-center justify-center p-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : obras.length === 0 ? (
          <div className="text-center p-12">
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CUI / Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contrato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inversión
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado MEF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado Obra
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {obras.map((obra) => (
                  <motion.tr
                    key={obra.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          CUI: {obra.cui}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {obra.datos_mef.nombre}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {obra.contrato.numero_contrato}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(obra.contrato.fecha_contrato).toLocaleDateString('es-PE')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatearMoneda(obra.datos_mef.costos_finales.costo_total_actualizado)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{obra.datos_mef.estado}</div>
                      <div className="text-xs text-gray-500">{obra.datos_mef.etapa}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(obra.estado_obra)}`}>
                        {getEstadoTexto(obra.estado_obra)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onVerObra(obra)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onEditarObra(obra)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEliminar(obra.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaObras;
