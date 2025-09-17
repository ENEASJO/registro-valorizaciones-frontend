import { useState, useMemo, useRef, useEffect } from 'react';
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
  Calendar,
  Star,
  CheckCircle,
  Clock,
  Globe,
  Briefcase,
  User
} from 'lucide-react';
import type {
  EntidadContratistaDetalle,
  FiltrosEntidadContratista,
  EstadoGeneral,
  CategoriaContratista,
  CategoriaContratistaCapacidad,
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

const CATEGORIAS_OPTIONS: { value: CategoriaContratistaCapacidad; label: string }[] = [
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
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);

  // Refs para los menús contextuales
  const menuRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [menuPositions, setMenuPositions] = useState<{ [key: string]: { top: number; left: number } }>({});

  // Actualizar posiciones de los menús
  useEffect(() => {
    if (menuAbierto) {
      const button = menuRefs.current[menuAbierto];
      if (button) {
        const rect = button.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const menuWidth = 192; // w-48 = 192px
        const windowWidth = window.innerWidth;

        // Calcular posición izquierda, asegurando que no se salga de la pantalla
        let left = rect.right - menuWidth;
        if (left < 10) left = 10; // Mínimo margen izquierdo
        if (left + menuWidth > windowWidth - 10) left = windowWidth - menuWidth - 10; // Máximo margen derecho

        setMenuPositions({
          [menuAbierto]: {
            top: rect.bottom + scrollY + 8,
            left: left
          }
        });
      }
    }
  }, [menuAbierto]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuAbierto && !menuRefs.current[menuAbierto]?.contains(event.target as Node)) {
        setMenuAbierto(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuAbierto]);

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
        if (entidad.datos_empresa?.categoria_contratista_capacidad !== filtros.categoria) {
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {entidadesFiltradas.map((entidad, index) => (
            <motion.div
              key={entidad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden"
            >
              {/* Header con gradiente */}
              <div className={`bg-gradient-to-r p-4 ${
                entidad.tipo_entidad === 'EMPRESA'
                  ? entidad.datos_empresa?.categoria_contratista === 'EJECUTORA'
                    ? 'from-blue-500 to-blue-600'
                    : entidad.datos_empresa?.categoria_contratista === 'SUPERVISORA'
                    ? 'from-green-500 to-green-600'
                    : 'from-gray-500 to-gray-600'
                  : 'from-purple-500 to-purple-600'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {/* Avatar más pequeño */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                        {entidad.tipo_entidad === 'EMPRESA' ? (
                          <Building2 className="w-6 h-6 text-white" />
                        ) : (
                          <Users className="w-6 h-6 text-white" />
                        )}
                      </div>
                      {/* Badge de categoría */}
                      {entidad.tipo_entidad === 'EMPRESA' && entidad.datos_empresa?.categoria_contratista && (
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white ${
                          entidad.datos_empresa.categoria_contratista === 'EJECUTORA' ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                          {entidad.datos_empresa.categoria_contratista.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Info principal */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-1 truncate">
                        {entidad.nombre_completo}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                          {entidad.tipo_entidad === 'EMPRESA' ? 'Empresa' : 'Consorcio'}
                        </span>
                        {entidad.tipo_entidad === 'EMPRESA' && entidad.datos_empresa?.categoria_contratista && (
                          <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                            {entidad.datos_empresa.categoria_contratista}
                          </span>
                        )}
                        {entidad.estado === 'ACTIVO' && (
                          <span className="px-2 py-0.5 bg-green-400/20 backdrop-blur-sm rounded-full text-green-100 text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Activo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Estado flotante */}
                  <div className="relative">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      entidad.estado === 'ACTIVO'
                        ? 'bg-green-100 text-green-800'
                        : entidad.estado === 'INACTIVO'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entidad.estado}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido principal */}
              <div className="p-4 space-y-3">
                {/* Información clave */}
                <div className="space-y-2">
                  {entidad.tipo_entidad === 'EMPRESA' && entidad.datos_empresa && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">RUC</span>
                        <span className="font-mono text-xs font-semibold text-gray-900">
                          {entidad.datos_empresa.ruc}
                        </span>
                      </div>

                      {/* Representante Principal */}
                      {(entidad.datos_empresa?.representante_legal || entidad.datos_empresa?.representantes?.[0]) && (
                        <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-md">
                          <User className="w-3 h-3 text-amber-600" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-amber-700 font-medium">Representante</div>
                            <div className="text-xs text-gray-700 truncate">
                              {entidad.datos_empresa?.representantes?.[0]?.nombre || entidad.datos_empresa?.representante_legal}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Contacto rápido */}
                      <div className="grid grid-cols-1 gap-2">
                        {entidad.datos_empresa.email && (
                          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
                            <Mail className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-gray-700 truncate">{entidad.datos_empresa.email}</span>
                          </div>
                        )}
                        {entidad.datos_empresa.telefono && (
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
                            <Phone className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-gray-700">{entidad.datos_empresa.telefono}</span>
                          </div>
                        )}
                      </div>

                      {/* Ubicación */}
                      {entidad.datos_empresa.direccion && (
                        <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-md">
                          <MapPin className="w-3 h-3 text-gray-600 mt-0.5" />
                          <span className="text-xs text-gray-700 truncate">{entidad.datos_empresa.direccion}</span>
                        </div>
                      )}
                    </>
                  )}

                  {entidad.tipo_entidad === 'CONSORCIO' && entidad.datos_consorcio && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Empresas</span>
                        <span className="text-xs font-semibold text-gray-900">
                          {entidad.empresas_participantes?.length || 0}
                        </span>
                      </div>

                      <div className="p-2 bg-purple-50 rounded-md">
                        <div className="text-xs text-gray-700 mb-1">Empresa Líder</div>
                        <div className="text-sm font-medium text-gray-900 truncate">{entidad.datos_consorcio.empresa_lider_nombre}</div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>Constituido: {new Date(entidad.datos_consorcio.fecha_constitucion).toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Especialidades o Participantes */}
                <div className="space-y-1">
                  {entidad.tipo_entidad === 'EMPRESA' && entidad.datos_empresa?.especialidades && entidad.datos_empresa.especialidades.length > 0 && (
                    <>
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs font-medium text-gray-700">Especialidades</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {entidad.datos_empresa.especialidades.slice(0, 3).map((esp) => (
                          <span
                            key={esp}
                            className="px-2 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 text-xs rounded-md font-medium"
                          >
                            {esp.replace('_', ' ')}
                          </span>
                        ))}
                        {entidad.datos_empresa.especialidades.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                            +{entidad.datos_empresa.especialidades.length - 3}
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {entidad.tipo_entidad === 'CONSORCIO' && entidad.empresas_participantes && entidad.empresas_participantes.length > 0 && (
                    <>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-purple-500" />
                        <span className="text-xs font-medium text-gray-700">Participantes</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {entidad.empresas_participantes.slice(0, 2).map((ep) => (
                          <span
                            key={ep.empresa_id}
                            className={`px-2 py-0.5 text-xs rounded-md font-medium flex items-center gap-1 ${
                              ep.es_lider
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {ep.es_lider && <Crown className="w-3 h-3" />}
                            {ep.empresa_nombre.split(' ')[0]} ({ep.porcentaje_participacion}%)
                          </span>
                        ))}
                        {entidad.empresas_participantes.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                            +{entidad.empresas_participantes.length - 2}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Indicadores adicionales */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {entidad.tipo_entidad === 'EMPRESA' && entidad.datos_empresa?.fecha_constitucion && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(entidad.datos_empresa.fecha_constitucion).getFullYear()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Hoy</span>
                    </div>
                  </div>

                  {/* Menú de acciones mejorado */}
                  <div className="relative">
                    <button
                      ref={(el) => menuRefs.current[entidad.id] = el}
                      onClick={() => setMenuAbierto(menuAbierto === entidad.id ? null : entidad.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors group-hover:bg-gray-50"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {menuAbierto === entidad.id && menuPositions[entidad.id] && (
                      <div
                        className="fixed w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] overflow-hidden"
                        style={{
                          top: `${menuPositions[entidad.id].top}px`,
                          left: `${menuPositions[entidad.id].left}px`
                        }}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              onVerDetalle(entidad);
                              setMenuAbierto(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Ver detalles
                          </button>
                          {onEditar && (
                            <button
                              onClick={() => {
                                onEditar(entidad);
                                setMenuAbierto(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>
                          )}
                          {onEliminar && (
                            <>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={() => {
                                  onEliminar(entidad);
                                  setMenuAbierto(null);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash className="w-4 h-4" />
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
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