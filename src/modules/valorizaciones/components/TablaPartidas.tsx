import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import type { Partida, PartidaDetalleForm, MetodoMedicion } from '../../../types/valorizacion.types';
import {
  Plus,
  Minus,
  Search,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Info,
  Edit3
} from 'lucide-react';

interface Props {
  partidas: Partida[];
  partidasSeleccionadas: PartidaDetalleForm[];
  onAgregarPartida: (partidaId: number, metrado: number) => void;
  onQuitarPartida: (partidaId: number) => void;
  readonly?: boolean;
  showCalculations?: boolean;
}
const TablaPartidas = ({ 
  partidas, 
  partidasSeleccionadas, 
  onAgregarPartida, 
  onQuitarPartida, 
  readonly = false,
  showCalculations = true 
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [metradosTemporales, setMetradosTemporales] = useState<Record<number, string>>({});
  const [metadatosTemporales, setMetadatosTemporales] = useState<Record<number, {
    fecha_medicion?: string;
    responsable_medicion?: string;
    metodo_medicion?: MetodoMedicion;
    observaciones?: string;
  }>>({});
  // Formatear moneda
  const formatearMoneda = (monto: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(monto).replace('PEN', 'S/');
  };
  // Formatear número con separador de miles
  const formatearNumero = (numero: number, decimales = 4): string => {
    return new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales
    }).format(numero);
  };
  // Filtrar partidas
  const partidasFiltradas = useMemo(() => {
    let resultado = partidas;
    if (searchTerm) {
      resultado = resultado.filter(p =>
        p.codigo_partida.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoriaFiltro) {
      resultado = resultado.filter(p => p.categoria === categoriaFiltro);
    }
    return resultado.sort((a, b) => a.numero_orden - b.numero_orden);
  }, [partidas, searchTerm, categoriaFiltro]);
  // Obtener categorías únicas
  const categorias = useMemo(() => {
    const cats = Array.from(new Set(partidas.map(p => p.categoria).filter(Boolean)));
    return cats.sort();
  }, [partidas]);
  // Verificar si una partida está seleccionada
  const estaSeleccionada = useCallback((partidaId: number): boolean => {
    return partidasSeleccionadas.some(p => p.partida_id === partidaId);
  }, [partidasSeleccionadas]);
  // Obtener metrado actual de una partida seleccionada
  const getMetradoActual = useCallback((partidaId: number): number => {
    const partida = partidasSeleccionadas.find(p => p.partida_id === partidaId);
    return partida?.metrado_actual || 0;
  }, [partidasSeleccionadas]);
  // Manejar cambio en metrado temporal
  const handleMetradoChange = useCallback((partidaId: number, valor: string) => {
    setMetradosTemporales(prev => ({
      ...prev,
      [partidaId]: valor
    }));
  }, []);
  // Manejar agregar partida
  const handleAgregar = useCallback((partidaId: number) => {
    const metradoStr = metradosTemporales[partidaId] || '0';
    const metrado = parseFloat(metradoStr);
    if (isNaN(metrado) || metrado <= 0) {
      alert('Ingrese un metrado válido mayor a cero');
      return;
    }
    onAgregarPartida(partidaId, metrado);
    // Limpiar metrado temporal
    setMetradosTemporales(prev => {
      const nuevo = { ...prev };
      delete nuevo[partidaId];
      return nuevo;
    });
  }, [metradosTemporales, onAgregarPartida]);
  // Manejar actualizar partida existente
  const handleActualizar = useCallback((partidaId: number) => {
    const metradoStr = metradosTemporales[partidaId] || getMetradoActual(partidaId).toString();
    const metrado = parseFloat(metradoStr);
    if (isNaN(metrado) || metrado < 0) {
      alert('Ingrese un metrado válido');
      return;
    }
    onAgregarPartida(partidaId, metrado);
    // Limpiar metrado temporal
    setMetradosTemporales(prev => {
      const nuevo = { ...prev };
      delete nuevo[partidaId];
      return nuevo;
    });
  }, [metradosTemporales, getMetradoActual, onAgregarPartida]);
  // Calcular totales
  const totales = useMemo(() => {
    let montoTotal = 0;
    let metradoTotalContractual = 0;
    let metradoTotalEjecutado = 0;
    let porcentajePromedioAvance = 0;
    partidasSeleccionadas.forEach(ps => {
      const partida = partidas.find(p => p.id === ps.partida_id);
      if (partida) {
        const montoPartida = ps.metrado_actual * partida.precio_unitario;
        montoTotal += montoPartida;
        metradoTotalContractual += partida.metrado_contractual;
        metradoTotalEjecutado += ps.metrado_actual;
      }
    });
    if (metradoTotalContractual > 0) {
      porcentajePromedioAvance = (metradoTotalEjecutado / metradoTotalContractual) * 100;
    }
    return {
      montoTotal,
      metradoTotalContractual,
      metradoTotalEjecutado,
      porcentajePromedioAvance,
      cantidadPartidas: partidasSeleccionadas.length
    };
  }, [partidasSeleccionadas, partidas]);
  // Validar metrado
  const validarMetrado = useCallback((partidaId: number, metrado: number): {
    valido: boolean;
    mensaje?: string;
    tipo?: 'error' | 'warning';
  } => {
    const partida = partidas.find(p => p.id === partidaId);
    if (!partida) return { valido: false, mensaje: 'Partida no encontrada' };
    if (metrado <= 0) {
      return { valido: false, mensaje: 'El metrado debe ser mayor a cero', tipo: 'error' };
    }
    if (metrado > partida.metrado_contractual * 1.05) {
      return { 
        valido: false, 
        mensaje: 'Metrado excede contractual + 5% de tolerancia', 
        tipo: 'error' 
      };
    }
    if (metrado > partida.metrado_contractual) {
      return { 
        valido: true, 
        mensaje: 'Metrado en tolerancia del 5%', 
        tipo: 'warning' 
      };
    }
    return { valido: true };
  }, [partidas]);
  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por código o descripción..."
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={categoriaFiltro}
          onChange={(e: any) => setCategoriaFiltro(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 min-w-[200px]"
        >
          <option value="">Todas las categorías</option>
          {categorias.map(categoria => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
        <div className="text-sm text-gray-600">
          {partidasFiltradas.length} partidas
        </div>
      </div>
      {/* Resumen de totales */}
      {showCalculations && partidasSeleccionadas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
        >
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium text-blue-800">Resumen de Partidas Seleccionadas</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-600 font-medium">Partidas</p>
              <p className="text-lg font-bold text-blue-900">{totales.cantidadPartidas}</p>
            </div>
            <div>
              <p className="text-blue-600 font-medium">Monto Total</p>
              <p className="text-lg font-bold text-blue-900">{formatearMoneda(totales.montoTotal)}</p>
            </div>
            <div>
              <p className="text-blue-600 font-medium">Metrado Ejecutado</p>
              <p className="text-lg font-bold text-blue-900">{formatearNumero(totales.metradoTotalEjecutado, 2)}</p>
            </div>
            <div>
              <p className="text-blue-600 font-medium">Avance Promedio</p>
              <p className="text-lg font-bold text-blue-900">{totales.porcentajePromedioAvance.toFixed(2)}%</p>
            </div>
          </div>
        </motion.div>
      )}
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Código / Descripción
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Unidad
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Metrado Contractual
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Precio Unitario
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Monto Contractual
              </th>
              {!readonly && (
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Metrado a Ejecutar
                </th>
              )}
              {readonly && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Metrado Ejecutado
                </th>
              )}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Monto Parcial
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {partidasFiltradas.map((partida: any, index: number) => {
              const estaSeleccionadaPartida = estaSeleccionada(partida.id);
              const metradoActual = getMetradoActual(partida.id);
              const metradoTemporal = metradosTemporales[partida.id] || '';
              const metradoParaCalculo = metradoTemporal ? parseFloat(metradoTemporal) : metradoActual;
              const montoParial = !isNaN(metradoParaCalculo) ? metradoParaCalculo * partida.precio_unitario : 0;
              const porcentajeAvance = partida.metrado_contractual > 0 ? (metradoActual / partida.metrado_contractual) * 100 : 0;
              const validacion = metradoTemporal ? validarMetrado(partida.id, parseFloat(metradoTemporal) || 0) : { valido: true };
              return (
                <motion.tr
                  key={partida.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={`hover:bg-gray-50 ${estaSeleccionadaPartida ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{partida.codigo_partida}</div>
                      <div className="text-gray-600 dark:text-gray-300 text-xs mt-1 max-w-xs">
                        {partida.descripcion}
                      </div>
                      {partida.categoria && (
                        <div className="text-xs text-blue-600 mt-1">{partida.categoria}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-900 font-mono">
                    {partida.unidad_medida}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-gray-900">
                    {formatearNumero(partida.metrado_contractual)}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-gray-900">
                    {formatearMoneda(partida.precio_unitario)}
                  </td>
                  <td className="px-4 py-4 text-right font-mono font-medium text-gray-900">
                    {formatearMoneda(partida.monto_contractual)}
                  </td>
                  {!readonly && (
                    <td className="px-4 py-4">
                      {estaSeleccionadaPartida ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={metradoTemporal || metradoActual}
                            onChange={(e: any) => handleMetradoChange(partida.id, e.target.value)}
                            step="0.0001"
                            min="0"
                            className={`w-24 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-primary-500 ${
                              !validacion.valido && metradoTemporal 
                                ? 'border-red-300 focus:ring-red-500' 
                                : validacion.tipo === 'warning' && metradoTemporal
                                ? 'border-yellow-300 focus:ring-yellow-500'
                                : 'border-gray-300'
                            }`}
                          />
                          {metradoTemporal && (
                            <button
                              onClick={() => handleActualizar(partida.id)}
                              disabled={!validacion.valido}
                              className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                              title="Actualizar metrado"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <input
                          type="number"
                          value={metradoTemporal}
                          onChange={(e: any) => handleMetradoChange(partida.id, e.target.value)}
                          placeholder="0.0000"
                          step="0.0001"
                          min="0"
                          className={`w-24 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-primary-500 ${
                            !validacion.valido && metradoTemporal 
                              ? 'border-red-300 focus:ring-red-500' 
                              : validacion.tipo === 'warning' && metradoTemporal
                              ? 'border-yellow-300 focus:ring-yellow-500'
                              : 'border-gray-300'
                          }`}
                        />
                      )}
                      {/* Mensaje de validación */}
                      {metradoTemporal && validacion.mensaje && (
                        <div className={`text-xs mt-1 ${
                          validacion.tipo === 'error' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {validacion.mensaje}
                        </div>
                      )}
                    </td>
                  )}
                  {readonly && (
                    <td className="px-4 py-4 text-right">
                      <div className="font-mono text-gray-900">{formatearNumero(metradoActual)}</div>
                      {porcentajeAvance > 0 && (
                        <div className="text-xs text-blue-600">{porcentajeAvance.toFixed(1)}%</div>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-4 text-right">
                    <div className="font-mono font-medium text-gray-900">
                      {formatearMoneda(montoParial)}
                    </div>
                    {estaSeleccionadaPartida && (
                      <div className="text-xs text-blue-600">
                        Avance: {((metradoActual / partida.metrado_contractual) * 100).toFixed(1)}%
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {!readonly && (
                      <div className="flex justify-center gap-1">
                        {estaSeleccionadaPartida ? (
                          <button
                            onClick={() => onQuitarPartida(partida.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Quitar partida"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAgregar(partida.id)}
                            disabled={!metradoTemporal || !validacion.valido}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Agregar partida"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {partidasFiltradas.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-300">
          <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No se encontraron partidas con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
};
export default TablaPartidas;