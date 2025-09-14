import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Building2, 
  Plus,
  TrendingUp,
  Briefcase,
  Award,
  Target,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import type { 
  EntidadContratistaDetalle, 
  FiltrosEntidadContratista,
  EmpresaForm
} from '../../../types/empresa.types';
import { useEntidadesContratistas, useEmpresas } from '../../../hooks/useEmpresas';
import ListaEntidades from './ListaEntidades';
import FormularioEmpresa from './FormularioEmpresa';
import DetalleEntidad from './DetalleEntidad';
import BreadcrumbEmpresas from './BreadcrumbEmpresas';
interface GestionEjecutorasProps {
  onVolverADashboard?: () => void;
  onMostrarMensaje?: (tipo: 'success' | 'error', texto: string) => void;
}
type TipoModal = 'empresa' | 'detalle' | null;
const GestionEjecutoras = ({ onVolverADashboard, onMostrarMensaje }: GestionEjecutorasProps = {}) => {
  const { entidades, loading, error } = useEntidadesContratistas();
  const { crearEmpresa, eliminarEmpresa, loading: loadingEmpresa } = useEmpresas();
  const [modalAbierto, setModalAbierto] = useState<TipoModal>(null);
  const [entidadSeleccionada, setEntidadSeleccionada] = useState<EntidadContratistaDetalle | null>(null);
  const [empresaEditando, setEmpresaEditando] = useState<EmpresaForm | null>(null);
  const [filtros, setFiltros] = useState<FiltrosEntidadContratista>({
    search: '',
    tipo_entidad: undefined,
    estado: undefined,
    categoria: undefined,
    especialidades: []
  });
  // Filtrar entidades para ejecutoras
  const entidadesEjecutoras = entidades.filter(entidad => {
    // Mostrar empresas con categoria_contratista = 'EJECUTORA' o null (temporal)
    if (entidad.tipo_entidad === 'EMPRESA' && entidad.datos_empresa) {
      return entidad.datos_empresa.categoria_contratista === 'EJECUTORA' || 
             entidad.datos_empresa.categoria_contratista === null ||
             entidad.datos_empresa.categoria_contratista === undefined;
    }
    // Para consorcios, por ahora mostrar todos (futuro: filtrar por función del consorcio)
    return entidad.tipo_entidad === 'CONSORCIO';
  });
  // Estadísticas específicas para ejecutoras
  const estadisticas = {
    totalEjecutoras: entidadesEjecutoras.length,
    empresasEjecutoras: entidadesEjecutoras.filter(e => e.tipo_entidad === 'EMPRESA').length,
    consorciosEjecutores: entidadesEjecutoras.filter(e => e.tipo_entidad === 'CONSORCIO').length,
    activasEjecutoras: entidadesEjecutoras.filter(e => e.estado === 'ACTIVO').length
  };
  // Handlers para modales
  const abrirModalEmpresa = (empresa?: EntidadContratistaDetalle) => {
    if (empresa && empresa.tipo_entidad === 'EMPRESA' && empresa.datos_empresa) {
      const empresaForm: EmpresaForm = {
        ruc: empresa.datos_empresa.ruc,
        razon_social: empresa.datos_empresa.razon_social,
        nombre_comercial: empresa.datos_empresa.nombre_comercial,
        email: empresa.datos_empresa.email,
        telefono: empresa.datos_empresa.telefono,
        direccion: empresa.datos_empresa.direccion,
        estado: empresa.estado,
        tipo_empresa: 'SAC', // Default
        categoria_contratista: empresa.datos_empresa.categoria_contratista,
        especialidades: empresa.datos_empresa.especialidades
      };
      setEmpresaEditando(empresaForm);
    } else {
      setEmpresaEditando(null);
    }
    setModalAbierto('empresa');
  };
  const abrirDetalleEntidad = (entidad: EntidadContratistaDetalle) => {
    setEntidadSeleccionada(entidad);
    setModalAbierto('detalle');
  };
  const cerrarModal = () => {
    setModalAbierto(null);
    setEntidadSeleccionada(null);
    setEmpresaEditando(null);
  };
  // Handler para crear/actualizar empresa ejecutora
  const handleSubmitEmpresa = async (empresaData: EmpresaForm) => {
    try {
      // Asegurar que la empresa se marque como EJECUTORA
      const empresaConCategoria = {
        ...empresaData,
        categoria_contratista: 'EJECUTORA' as const
      };
      
      if (empresaEditando) {
        onMostrarMensaje?.('success', 'Empresa ejecutora actualizada correctamente');
      } else {
        await crearEmpresa(empresaConCategoria);
        onMostrarMensaje?.('success', 'Empresa ejecutora registrada correctamente');
      }
      cerrarModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar empresa ejecutora';
      onMostrarMensaje?.('error', errorMessage);
      throw error;
    }
  };
  // Handler para eliminar entidad ejecutora
  const handleEliminarEntidad = async (entidad: EntidadContratistaDetalle) => {
    const tipoEntidad = entidad.tipo_entidad === 'EMPRESA' ? 'empresa ejecutora' : 'consorcio ejecutor';
    if (!confirm(`¿Estás seguro de que quieres eliminar esta ${tipoEntidad} "${entidad.nombre_completo}"?`)) {
      return;
    }
    try {
      if (entidad.tipo_entidad === 'EMPRESA' && entidad.id) {
        await eliminarEmpresa(entidad.id);
        onMostrarMensaje?.('success', 'Empresa ejecutora eliminada correctamente');
      } else {
        onMostrarMensaje?.('error', 'La eliminación de consorcios aún no está implementada');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar';
      onMostrarMensaje?.('error', errorMessage);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-blue-900">Empresas Ejecutoras</h1>
          </div>
          <p className="text-blue-700 ml-13">
            Gestión integral de empresas y consorcios responsables de la ejecución de obras
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => abrirModalEmpresa()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 rounded-lg transition-colors"
          >
            <Building2 className="w-5 h-5" />
            Nueva Empresa Ejecutora
          </button>
        </div>
      </div>
      {/* Breadcrumbs */}
      <BreadcrumbEmpresas 
        tipo="ejecutoras"
        onNavigate={(ruta) => {
          if (ruta === 'dashboard') {
            onVolverADashboard();
          }
        }}
      />
      {/* Estadísticas específicas para ejecutoras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{estadisticas.totalEjecutoras}</p>
              <p className="text-sm text-blue-700">Total Ejecutoras</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{estadisticas.empresasEjecutoras}</p>
              <p className="text-sm text-blue-700">Empresas Ejecutoras</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{estadisticas.activasEjecutoras}</p>
              <p className="text-sm text-blue-700">Activas</p>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error al cargar empresas ejecutoras: {error}</span>
          </div>
        </div>
      )}
      {/* Lista de entidades ejecutoras */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200">
        <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-900">
              Registro de Empresas Ejecutoras
            </h2>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Empresas y consorcios habilitados para ejecutar obras de infraestructura municipal
          </p>
        </div>
        <div className="p-6">
          <ListaEntidades
            entidades={entidadesEjecutoras}
            loading={loading}
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onVerDetalle={abrirDetalleEntidad}
            onEditar={abrirModalEmpresa}
            onEliminar={handleEliminarEntidad}
          />
        </div>
      </div>
      {/* Modales */}
      <FormularioEmpresa
        isOpen={modalAbierto === 'empresa'}
        onClose={cerrarModal}
        onSubmit={handleSubmitEmpresa}
        empresa={empresaEditando || undefined}
        loading={loadingEmpresa}
        title={empresaEditando ? 'Editar Empresa Ejecutora' : 'Nueva Empresa Ejecutora'}
      />
      <DetalleEntidad
        entidad={entidadSeleccionada}
        isOpen={modalAbierto === 'detalle'}
        onClose={cerrarModal}
        onEditar={() => {
          if (entidadSeleccionada) {
            cerrarModal();
            abrirModalEmpresa(entidadSeleccionada);
          }
        }}
      />
    </div>
  );
};
export default GestionEjecutoras;