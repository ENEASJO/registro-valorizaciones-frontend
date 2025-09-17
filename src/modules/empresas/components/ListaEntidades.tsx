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
  // Filtrar entidades
  const entidadesFiltradas = useMemo(() => {
    return entidades.filter(entidad => {
      // Filtro por búsqueda
      if (filtros.search) {
        const searchTerm = filtros.search.toLowerCase();
        return (
          entidad.nombre.toLowerCase().includes(searchTerm) ||
          entidad.ruc.toLowerCase().includes(searchTerm) ||
          (entidad.representante && entidad.representante.toLowerCase().includes(searchTerm))
        );
      }
      return true;
    });
  }, [entidades, filtros]);

  return (
    <div className="space-y-6">
      {/* Contenido principal */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entidadesFiltradas.map((entidad) => (
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
                      {entidad.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {entidad.ruc}
                    </p>
                  </div>
                </div>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'ver') {
                      onVerDetalle(entidad);
                    } else if (value === 'editar' && onEditar) {
                      onEditar(entidad);
                    } else if (value === 'eliminar' && onEliminar) {
                      onEliminar(entidad);
                    }
                    e.target.value = '';
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-transparent border-none cursor-pointer appearance-none"
                  aria-label="Más opciones"
                >
                  <option value="">⚙️</option>
                  <option value="ver">👁️ Ver detalles</option>
                  {onEditar && <option value="editar">✏️ Editar</option>}
                  {onEliminar && <option value="eliminar">🗑️ Eliminar</option>}
                </select>
              </div>

              {/* Información principal */}
              <div className="space-y-3">
                {entidad.representante && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{entidad.representante}</span>
                  </div>
                )}

                {entidad.telefono && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{entidad.telefono}</span>
                  </div>
                )}

                {entidad.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{entidad.email}</span>
                  </div>
                )}

                {entidad.direccion && (
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{entidad.direccion}</span>
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

                <button
                  onClick={() => onVerDetalle(entidad)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Ver más
                </button>
              </div>
            </div>
          </motion.div>
        ))}
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