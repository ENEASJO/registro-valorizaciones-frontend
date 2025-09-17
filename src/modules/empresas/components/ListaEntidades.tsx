import { useState, useMemo, useEffect } from 'react';
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

const ListaEntidades = ({
  entidades,
  loading,
  filtros,
  onFiltrosChange,
  onVerDetalle,
  onEditar,
  onEliminar
}: ListaEntidadesProps) => {
  // Estado para controlar qué menú está abierto
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Buscar si el clic fue en un botón de menú
      const botonMenu = target.closest('button[aria-label="Más opciones"]');
      if (!botonMenu && menuAbierto) {
        setMenuAbierto(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuAbierto]);

  // Filtrar entidades
  const entidadesFiltradas = useMemo(() => {
    return entidades.filter(entidad => {
      // Filtro por búsqueda
      if (filtros.search) {
        const searchTerm = filtros.search.toLowerCase();
        const nombre = entidad.nombre_completo || '';
        const ruc = entidad.ruc_principal || '';
        const representante = entidad.datos_empresa?.representante_legal || '';

        return (
          nombre.toLowerCase().includes(searchTerm) ||
          ruc.toLowerCase().includes(searchTerm) ||
          (representante && representante.toLowerCase().includes(searchTerm))
        );
      }
      return true;
    });
  }, [entidades, filtros]);

  // Función para encontrar el representante principal según prioridad de cargos
  const encontrarRepresentantePrincipal = (representantes?: any[]): string | null => {
    if (!representantes || representantes.length === 0) {
      return null;
    }

    // Orden de prioridad de cargos
    const prioridadCargos = [
      'GERENTE GENERAL',
      'GERENTE',
      'PRESIDENTE',
      'DIRECTOR',
      'ADMINISTRADOR',
      'SOCIO',
      'REPRESENTANTE LEGAL'
    ];

    // Buscar representante por orden de prioridad
    for (const cargo of prioridadCargos) {
      const representante = representantes.find(r =>
        r.cargo && r.cargo.toUpperCase().includes(cargo)
      );
      if (representante && representante.nombre) {
        return representante.nombre;
      }
    }

    // Si no encuentra por cargo, devolver el primer representante con nombre
    const primerConNombre = representantes.find(r => r.nombre);
    return primerConNombre ? primerConNombre.nombre : null;
  };

  return (
    <div className="space-y-6">
      {/* Contenido principal */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entidadesFiltradas.map((entidad) => {
          // Debug: Verificar estructura de datos
          console.log('📋 Datos de entidad:', {
            id: entidad.id,
            nombre_completo: entidad.nombre_completo,
            representante_legal: entidad.datos_empresa?.representante_legal,
            representantes: entidad.datos_empresa?.representantes,
            dni_representante: entidad.datos_empresa?.dni_representante,
            datos_empresa: {
              ruc: entidad.datos_empresa?.ruc,
              razon_social: entidad.datos_empresa?.razon_social,
              email: entidad.datos_empresa?.email,
              telefono: entidad.datos_empresa?.telefono
            }
          });

          return (
          <motion.div
            key={entidad.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200"
          >
            {/* Header de la tarjeta */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {entidad.nombre_completo || entidad.datos_empresa?.razon_social || 'Sin nombre'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {entidad.ruc_principal || entidad.datos_empresa?.ruc || 'Sin RUC'}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuAbierto(menuAbierto === entidad.id ? null : entidad.id);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    aria-label="Más opciones"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 transition-opacity duration-200 ${
                    menuAbierto === entidad.id ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}>
                    <button
                      onClick={() => {
                        onVerDetalle(entidad);
                        setMenuAbierto(null);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-colors rounded-t-lg"
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
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                    )}
                    {onEliminar && (
                      <>
                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                        <button
                          onClick={() => {
                            onEliminar(entidad);
                            setMenuAbierto(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
                        >
                          <Trash className="w-4 h-4" />
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Representante Principal */}
              {(entidad.datos_empresa?.representante_legal ||
                entidad.datos_empresa?.representantes?.length ||
                entidad.datos_empresa?.dni_representante) && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                      Representante Principal
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {entidad.datos_empresa.representante_legal ||
                     encontrarRepresentantePrincipal(entidad.datos_empresa?.representantes) ||
                     entidad.datos_empresa?.dni_representante}
                  </p>
                </div>
              )}

              {/* Información de contacto */}
              <div className="space-y-3">
                {entidad.datos_empresa?.telefono && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{entidad.datos_empresa.telefono}</span>
                  </div>
                )}

                {entidad.datos_empresa?.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{entidad.datos_empresa.email}</span>
                  </div>
                )}

                {entidad.datos_empresa?.direccion && (
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{entidad.datos_empresa.direccion}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer de la tarjeta */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  entidad.estado === 'ACTIVO'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : entidad.estado === 'INACTIVO'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {entidad.estado === 'ACTIVO' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {entidad.estado === 'INACTIVO' && <Clock className="w-3 h-3 mr-1" />}
                  {entidad.estado === 'SUSPENDIDO' && <Star className="w-3 h-3 mr-1" />}
                  {entidad.estado}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
      </div>

      {/* Estado vacío */}
      {entidadesFiltradas.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No se encontraron entidades</p>
        </div>
      )}
    </div>
  );
};

export default ListaEntidades;