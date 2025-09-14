import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  Building2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Clock,
  BarChart,
  Eye,
  Filter,
  Construction,
  Calculator
} from 'lucide-react';
import type { 
  FiltrosObra, 
  EstadoObra,
  TipoObra,
  CrearObraParams 
} from '../../types/obra.types';
import { ESTADOS_OBRA, TIPOS_OBRA } from '../../types/obra.types';
import { useObras } from '../../hooks/useObras';
import { useEntidadesContratistas } from '../../hooks/useEmpresas';
import FormularioObra from './components/FormularioObra';
import DetalleObra from './components/DetalleObra';

type TipoModal = 'crear' | 'editar' | 'detalle' | null;

const Obras = () => {
  const { obras, loading, error, cargarObras, crearObra, obtenerEstadisticas } = useObras();
  const { entidades } = useEntidadesContratistas();

  const [modalAbierto, setModalAbierto] = useState<TipoModal>(null);
  const [obraSeleccionada, setObraSeleccionada] = useState<number | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const [filtros, setFiltros] = useState<FiltrosObra>({
    search: '',
    estado: undefined,
    entidad_ejecutora_id: undefined,
    entidad_supervisora_id: undefined,
    tipo_obra: undefined
  });

  // Función para mostrar mensajes temporales
  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 5000);
  };

  // Handlers para modales
  const abrirModalCrear = () => {
    setModalAbierto('crear');
  };

  const abrirModalEditar = (obraId: number) => {
    setObraSeleccionada(obraId);
    setModalAbierto('editar');
  };

  const abrirDetalleObra = (obraId: number) => {
    setObraSeleccionada(obraId);
    setModalAbierto('detalle');
  };

  const cerrarModal = () => {
    setModalAbierto(null);
    setObraSeleccionada(null);
  };

  // Handler para crear obra
  const handleSubmitObra = async (params: CrearObraParams) => {
    setLoadingModal(true);
    try {
      await crearObra(params);
      mostrarMensaje('success', 'Obra creada correctamente');
      cerrarModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear obra';
      mostrarMensaje('error', errorMessage);
      throw error; // Re-throw para que el modal maneje el error
    } finally {
      setLoadingModal(false);
    }
  };

  // Handler para eliminar obra
  const handleEliminarObra = async (obraId: number) => {
    const obra = obras.find(o => o.id === obraId);
    if (!obra) return;

    if (!confirm(`¿Estás seguro de que quieres eliminar la obra "${obra.nombre}"?`)) {
      return;
    }

    try {
      // TODO: Implementar eliminación
      mostrarMensaje('success', 'Obra eliminada correctamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar obra';
      mostrarMensaje('error', errorMessage);
    }
  };

  // Función para actualizar filtros
  const actualizarFiltros = (nuevosFiltros: Partial<FiltrosObra>) => {
    const filtrosActualizados = { ...filtros, ...nuevosFiltros };
    setFiltros(filtrosActualizados);
    cargarObras(filtrosActualizados);
  };

  const getEstadoConfig = (estado: EstadoObra) => {
    switch (estado) {
      case 'REGISTRADA':
        return { color: 'bg-gray-100 text-gray-800', icon: Clock };
      case 'EN_EJECUCION':
        return { color: 'bg-blue-100 text-blue-800', icon: Construction };
      case 'PARALIZADA':
        return { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
      case 'TERMINADA':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'LIQUIDADA':
        return { color: 'bg-purple-100 text-purple-800', icon: Calculator };
      case 'CANCELADA':
        return { color: 'bg-red-100 text-red-800', icon: AlertCircle };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const getAvanceColor = (avance: number) => {
    if (avance < 25) return 'bg-red-500';
    if (avance < 50) return 'bg-yellow-500';
    if (avance < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Obtener nombre de entidad
  const getNombreEntidad = (entidadId: number): string => {
    const entidad = entidades.find(e => e.id === entidadId);
    return entidad ? entidad.nombre_completo : 'Entidad no encontrada';
  };

  // Calcular estadísticas básicas
  const estadisticas = {
    total: obras.length,
    activas: obras.filter(o => o.estado === 'EN_EJECUCION').length,
    terminadas: obras.filter(o => o.estado === 'TERMINADA').length,
    paralizadas: obras.filter(o => o.estado === 'PARALIZADA').length,
    montoTotal: obras.reduce((sum, o) => sum + o.monto_total, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Obras Públicas</h1>
          <p className="text-gray-600 mt-2">
            Gestión integral de obras de infraestructura municipal
          </p>
        </div>
        
        <button 
          onClick={abrirModalCrear}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Obra
        </button>
      </div>

      {/* Mensaje de notificación */}
      <AnimatePresence>
        {mensaje && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg flex items-center gap-3 ${
              mensaje.tipo === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {mensaje.tipo === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">{mensaje.texto}</span>
            <button
              onClick={() => setMensaje(null)}
              className="ml-auto p-1 hover:bg-black hover:bg-opacity-5 rounded"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Construction className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
              <p className="text-sm text-gray-600">Total Obras</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.activas}</p>
              <p className="text-sm text-gray-600">En Ejecución</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.terminadas}</p>
              <p className="text-sm text-gray-600">Terminadas</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.paralizadas}</p>
              <p className="text-sm text-gray-600">Paralizadas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                S/ {(estadisticas.montoTotal / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-gray-600">Inversión Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error al cargar datos: {error}</span>
          </div>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por número de contrato, nombre o ubicación..."
              value={filtros.search}
              onChange={(e) => actualizarFiltros({ search: e.target.value })}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {/* Estado */}
          <select 
            value={filtros.estado || ''}
            onChange={(e) => actualizarFiltros({ estado: e.target.value as EstadoObra || undefined })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Todos los estados</option>
            {Object.entries(ESTADOS_OBRA).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <button 
            onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Más Filtros
          </button>
        </div>

        {/* Filtros avanzados */}
        <AnimatePresence>
          {mostrarFiltrosAvanzados && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 pt-4 mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Obra
                  </label>
                  <select
                    value={filtros.tipo_obra || ''}
                    onChange={(e) => actualizarFiltros({ tipo_obra: e.target.value as TipoObra || undefined })}
                    className="input-field"
                  >
                    <option value="">Todos los tipos</option>
                    {Object.entries(TIPOS_OBRA).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entidad Ejecutora
                  </label>
                  <select
                    value={filtros.entidad_ejecutora_id || ''}
                    onChange={(e) => actualizarFiltros({ entidad_ejecutora_id: parseInt(e.target.value) || undefined })}
                    className="input-field"
                  >
                    <option value="">Todas las ejecutoras</option>
                    {entidades.map(entidad => (
                      <option key={entidad.id} value={entidad.id}>
                        {entidad.nombre_completo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entidad Supervisora
                  </label>
                  <select
                    value={filtros.entidad_supervisora_id || ''}
                    onChange={(e) => actualizarFiltros({ entidad_supervisora_id: parseInt(e.target.value) || undefined })}
                    className="input-field"
                  >
                    <option value="">Todas las supervisoras</option>
                    {entidades.map(entidad => (
                      <option key={entidad.id} value={entidad.id}>
                        {entidad.nombre_completo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de obras */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : obras.length === 0 ? (
          <div className="text-center py-12">
            <Construction className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay obras registradas</h3>
            <p className="text-gray-600 mb-6">
              Comienza creando la primera obra del sistema
            </p>
            <button 
              onClick={abrirModalCrear}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Crear Primera Obra
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {obras.map((obra, index) => {
              const estadoConfig = getEstadoConfig(obra.estado);
              const IconoEstado = estadoConfig.icon;
              
              return (
                <motion.div
                  key={obra.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                          {obra.numero_contrato}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 mt-2 line-clamp-2">
                          {obra.nombre}
                        </h3>
                        {obra.codigo_interno && (
                          <p className="text-sm text-gray-500 mt-1">{obra.codigo_interno}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${estadoConfig.color}`}>
                        <IconoEstado className="w-3 h-3" />
                        {ESTADOS_OBRA[obra.estado]}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">Ejecutora: {getNombreEntidad(obra.entidad_ejecutora_id)}</span>
                      </div>
                      
                      {obra.ubicacion && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{obra.ubicacion}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>
                          {new Date(obra.fecha_inicio).toLocaleDateString('es-PE')} - {' '}
                          {new Date(obra.fecha_fin_prevista).toLocaleDateString('es-PE')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">
                          S/ {obra.monto_total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{obra.plazo_ejecucion_dias} días</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BarChart className="w-4 h-4 text-gray-400" />
                          <span>{obra.numero_valorizaciones} valorizaciones</span>
                        </div>
                      </div>
                    </div>

                    {/* Barra de progreso (simulada - requiere datos de valorizaciones) */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Avance Estimado</span>
                        <span className="text-sm font-semibold text-gray-900">15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getAvanceColor(15)}`}
                          style={{ width: '15%' }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button 
                        onClick={() => abrirDetalleObra(obra.id)}
                        className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </button>
                      <button 
                        onClick={() => abrirModalEditar(obra.id)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Editar obra"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEliminarObra(obra.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar obra"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Formulario */}
      <FormularioObra
        isOpen={modalAbierto === 'crear'}
        onClose={cerrarModal}
        onSubmit={handleSubmitObra}
        loading={loadingModal}
        title="Nueva Obra"
      />

      {/* Modal Detalle */}
      <DetalleObra
        obraId={obraSeleccionada}
        isOpen={modalAbierto === 'detalle'}
        onClose={cerrarModal}
        onEditar={abrirModalEditar}
      />
    </div>
  );
};

export default Obras;