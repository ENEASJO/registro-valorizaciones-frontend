import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash, 
  Mail, 
  Phone, 
  MapPin,
  Crown,
  MoreVertical,
  Calendar
} from 'lucide-react';
import type { 
  EntidadContratistaDetalle, 
  FiltrosEntidadContratista, 
  EstadoGeneral,
  CategoriaContratista,
  EspecialidadEmpresa 
} from '../../../types/empresa.types';

interface ListaEntidadesProps {
  entidades: EntidadContratistaDetalle[];
  loading: boolean;
  filtros: FiltrosEntidadContratista;
  onFiltrosChange: (filtros: FiltrosEntidadContratista) => void;
  onVerDetalle: (entidad: EntidadContratistaDetalle) => void;
  onEditar?: (entidad: EntidadContratistaDetalle) => void;
  onEliminar?: (entidad: EntidadContratistaDetalle) => void;
}

const ESTADOS_OPTIONS: { value: EstadoGeneral; label: string; color: string }[] = [
  { value: 'ACTIVO', label: 'Activo', color: 'bg-green-100 text-green-800' },
  { value: 'INACTIVO', label: 'Inactivo', color: 'bg-gray-100 text-gray-800' },
  { value: 'SUSPENDIDO', label: 'Suspendido', color: 'bg-red-100 text-red-800' }
];

const CATEGORIAS_OPTIONS: { value: CategoriaContratista; label: string }[] = [
  { value: 'A', label: 'Categoría A' },
  { value: 'B', label: 'Categoría B' },
  { value: 'C', label: 'Categoría C' },
  { value: 'D', label: 'Categoría D' },
  { value: 'E', label: 'Categoría E' }
];

const ESPECIALIDADES_OPTIONS: EspecialidadEmpresa[] = [
  'EDIFICACIONES',
  'CARRETERAS', 
  'SANEAMIENTO',
  'ELECTRICIDAD',
  'TELECOMUNICACIONES',
  'PUENTES'
];

const ListaEntidades = ({
  entidades,
  loading,
  filtros,
  onFiltrosChange,
  onVerDetalle,
  onEditar,
  onEliminar
}: ListaEntidadesProps) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

  // Filtrar entidades localmente
  const entidadesFiltradas = useMemo(() => {
    return entidades.filter(entidad => {
      // Filtro por búsqueda
      if (filtros.search) {
        const searchTerm = filtros.search.toLowerCase();
        const cumpleBusqueda = 
          entidad.nombre_completo.toLowerCase().includes(searchTerm) ||
          entidad.ruc_principal?.toLowerCase().includes(searchTerm) ||
          entidad.datos_empresa?.razon_social?.toLowerCase().includes(searchTerm) ||
          entidad.datos_empresa?.nombre_comercial?.toLowerCase().includes(searchTerm) ||
          entidad.datos_consorcio?.nombre?.toLowerCase().includes(searchTerm);
        
        if (!cumpleBusqueda) return false;
      }

      // Filtro por tipo
      if (filtros.tipo_entidad && entidad.tipo_entidad !== filtros.tipo_entidad) {
        return false;
      }

      // Filtro por estado
      if (filtros.estado && entidad.estado !== filtros.estado) {
        return false;
      }

      // Filtro por categoría (solo empresas)
      if (filtros.categoria && entidad.tipo_entidad === 'EMPRESA') {
        if (entidad.datos_empresa?.categoria_contratista !== filtros.categoria) {
          return false;
        }
      }

      // Filtro por especialidades
      if (filtros.especialidades && filtros.especialidades.length > 0) {
        const especialidadesEntidad = entidad.tipo_entidad === 'EMPRESA' 
          ? entidad.datos_empresa?.especialidades || []
          : entidad.datos_consorcio?.especialidades || [];
        
        const tieneEspecialidad = filtros.especialidades.some(esp => 
          especialidadesEntidad.includes(esp)
        );
        
        if (!tieneEspecialidad) return false;
      }

      return true;
    });
  }, [entidades, filtros]);

  const handleFiltroChange = (campo: keyof FiltrosEntidadContratista, valor: any) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor
    });
  };

  const toggleEspecialidad = (especialidad: EspecialidadEmpresa) => {
    const especialidadesActuales = filtros.especialidades || [];
    const nuevasEspecialidades = especialidadesActuales.includes(especialidad)
      ? especialidadesActuales.filter(e => e !== especialidad)
      : [...especialidadesActuales, especialidad];
    
    handleFiltroChange('especialidades', nuevasEspecialidades);
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      search: '',
      tipo_entidad: undefined,
      estado: undefined,
      categoria: undefined,
      especialidades: []
    });
  };

  const getEstadoColor = (estado: EstadoGeneral) => {
    return ESTADOS_OPTIONS.find(e => e.value === estado)?.color || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Búsqueda principal */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, RUC o razón social..."
                value={filtros.search || ''}
                onChange={(e) => handleFiltroChange('search', e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`px-4 py-3 border border-gray-300 rounded-lg flex items-center gap-2 transition-colors ${
                mostrarFiltros ? 'bg-primary-50 border-primary-300 text-primary-700' : 'hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>

          {/* Filtros expandidos */}
          {mostrarFiltros && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200"
            >
              {/* Tipo de entidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Entidad
                </label>
                <select
                  value={filtros.tipo_entidad || ''}
                  onChange={(e) => handleFiltroChange('tipo_entidad', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="EMPRESA">Empresas</option>
                  <option value="CONSORCIO">Consorcios</option>
                </select>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleFiltroChange('estado', e.target.value as EstadoGeneral || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {ESTADOS_OPTIONS.map(estado => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={filtros.categoria || ''}
                  onChange={(e) => handleFiltroChange('categoria', e.target.value as CategoriaContratista || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Todas</option>
                  {CATEGORIAS_OPTIONS.map(categoria => (
                    <option key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón limpiar */}
              <div className="flex items-end">
                <button
                  onClick={limpiarFiltros}
                  className="w-full px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>

              {/* Especialidades */}
              <div className="lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidades
                </label>
                <div className="flex flex-wrap gap-2">
                  {ESPECIALIDADES_OPTIONS.map(especialidad => (
                    <button
                      key={especialidad}
                      onClick={() => toggleEspecialidad(especialidad)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        filtros.especialidades?.includes(especialidad)
                          ? 'bg-primary-100 text-primary-800 border border-primary-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {especialidad}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {entidadesFiltradas.length} {entidadesFiltradas.length === 1 ? 'resultado' : 'resultados'}
        </p>
      </div>

      {/* Lista de entidades */}
      {entidadesFiltradas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
          <p className="text-gray-600 mb-4">
            Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
          </p>
          <button
            onClick={limpiarFiltros}
            className="btn-secondary"
          >
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {entidadesFiltradas.map((entidad, index) => (
            <motion.div
              key={entidad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icono con indicador de rol */}
                    <div className="relative">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        entidad.tipo_entidad === 'EMPRESA' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        {entidad.tipo_entidad === 'EMPRESA' ? (
                          <Building2 className="w-6 h-6" />
                        ) : (
                          <Users className="w-6 h-6" />
                        )}
                      </div>
                      {/* Badge indicador de rol - por ahora mostramos aleatoriamente para demo */}
                      {Math.random() > 0.5 ? (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center" title="Empresa Ejecutora">
                          <span className="text-white text-xs font-bold">E</span>
                        </div>
                      ) : (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center" title="Empresa Supervisora">
                          <span className="text-white text-xs font-bold">S</span>
                        </div>
                      )}
                    </div>

                    {/* Información principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {entidad.nombre_completo}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entidad.tipo_entidad === 'EMPRESA' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {entidad.tipo_entidad === 'EMPRESA' ? 'Empresa' : 'Consorcio'}
                        </span>
                        {/* Badge de rol más prominente */}
                        {Math.random() > 0.5 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                            EJECUTORA
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                            SUPERVISORA
                          </span>
                        )}
                        {entidad.tipo_entidad === 'CONSORCIO' && entidad.empresas_participantes?.some(ep => ep.es_lider) && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            <Crown className="w-3 h-3" />
                            Con Líder
                          </span>
                        )}
                      </div>

                      {/* Información específica por tipo */}
                      {entidad.tipo_entidad === 'EMPRESA' && entidad.datos_empresa && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="font-mono">RUC: {entidad.datos_empresa.ruc}</span>
                            {entidad.datos_empresa.categoria_contratista && (
                              <span className="px-2 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 rounded text-xs font-medium border border-orange-200">
                                Categoría {entidad.datos_empresa.categoria_contratista}
                              </span>
                            )}
                            {/* Indicador visual adicional de especialización */}
                            {Math.random() > 0.7 && (
                              <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded text-xs font-medium border border-purple-200">
                                ⭐ Especializada
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            {entidad.datos_empresa.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {entidad.datos_empresa.email}
                              </div>
                            )}
                            {entidad.datos_empresa.telefono && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {entidad.datos_empresa.telefono}
                              </div>
                            )}
                            {entidad.datos_empresa.direccion && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {entidad.datos_empresa.direccion}
                              </div>
                            )}
                          </div>

                          {entidad.datos_empresa.especialidades && entidad.datos_empresa.especialidades.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {entidad.datos_empresa.especialidades.slice(0, 3).map((esp, index) => (
                                <span key={esp} className={`px-2 py-1 text-xs rounded font-medium ${
                                  index === 0 ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                  index === 1 ? 'bg-green-100 text-green-800 border border-green-200' :
                                  'bg-purple-100 text-purple-800 border border-purple-200'
                                }`}>
                                  {esp.replace('_', ' ')}
                                </span>
                              ))}
                              {entidad.datos_empresa.especialidades.length > 3 && (
                                <span className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded font-medium border border-gray-300">
                                  +{entidad.datos_empresa.especialidades.length - 3} más
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {entidad.tipo_entidad === 'CONSORCIO' && entidad.datos_consorcio && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span className="font-medium">{entidad.empresas_participantes?.length || 0}</span> empresas
                            </span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Constituido: <span className="font-medium">{new Date(entidad.datos_consorcio.fecha_constitucion).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600">
                            Líder: {entidad.datos_consorcio.empresa_lider_nombre}
                          </div>

                          {entidad.datos_consorcio.descripcion && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {entidad.datos_consorcio.descripcion}
                            </p>
                          )}

                          {/* Empresas participantes */}
                          {entidad.empresas_participantes && entidad.empresas_participantes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {entidad.empresas_participantes.slice(0, 2).map(ep => (
                                <span key={ep.empresa_id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center gap-1">
                                  {ep.es_lider && <Crown className="w-3 h-3 text-yellow-600" />}
                                  {ep.empresa_nombre} ({ep.porcentaje_participacion}%)
                                </span>
                              ))}
                              {entidad.empresas_participantes.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{entidad.empresas_participantes.length - 2} más
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Estado y acciones */}
                  <div className="flex items-start gap-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(entidad.estado)}`}>
                      {entidad.estado}
                    </span>

                    {/* Menú de acciones */}
                    <div className="relative">
                      <button
                        onClick={() => setMenuAbierto(menuAbierto === entidad.id ? null : entidad.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {menuAbierto === entidad.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                onVerDetalle(entidad);
                                setMenuAbierto(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4" />
                              Ver Detalle
                            </button>
                            {onEditar && (
                              <button
                                onClick={() => {
                                  onEditar(entidad);
                                  setMenuAbierto(null);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Edit className="w-4 h-4" />
                                Editar
                              </button>
                            )}
                            {onEliminar && (
                              <button
                                onClick={() => {
                                  onEliminar(entidad);
                                  setMenuAbierto(null);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash className="w-4 h-4" />
                                Eliminar
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaEntidades;