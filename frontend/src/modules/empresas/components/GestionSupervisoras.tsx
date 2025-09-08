import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Building2, 
  Plus,
  Shield,
  Eye,
  CheckCircle,
  AlertCircle,
  Search,
  FileCheck
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
interface GestionSupervisorasProps {
  onVolverADashboard?: () => void;
  onMostrarMensaje?: (tipo: 'success' | 'error', texto: string) => void;
}
type TipoModal = 'empresa' | 'detalle' | null;
const GestionSupervisoras = ({ onVolverADashboard, onMostrarMensaje }: GestionSupervisorasProps = {}) => {
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
  // Filtrar entidades para supervisoras
  const entidadesSupervisoras = entidades.filter(entidad => {
    // Solo mostrar empresas con categoria_contratista = 'SUPERVISORA'
    if (entidad.tipo_entidad === 'EMPRESA' && entidad.datos_empresa) {
      return entidad.datos_empresa.categoria_contratista === 'SUPERVISORA';
    }
    // Para consorcios, por ahora mostrar todos (futuro: filtrar por función del consorcio)
    return entidad.tipo_entidad === 'CONSORCIO';
  });
  // Estadísticas específicas para supervisoras
  const estadisticas = {
    totalSupervisoras: entidadesSupervisoras.length,
    empresasSupervisoras: entidadesSupervisoras.filter(e => e.tipo_entidad === 'EMPRESA').length,
    activasSupervisoras: entidadesSupervisoras.filter(e => e.estado === 'ACTIVO').length
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
  // Handler para crear/actualizar empresa supervisora
  const handleSubmitEmpresa = async (empresaData: EmpresaForm) => {
    try {
      // Asegurar que la empresa se marque como SUPERVISORA
      const empresaConCategoria = {
        ...empresaData,
        categoria_contratista: 'SUPERVISORA' as const
      };
      
      if (empresaEditando) {
        onMostrarMensaje?.('success', 'Empresa supervisora actualizada correctamente');
      } else {
        await crearEmpresa(empresaConCategoria);
        onMostrarMensaje?.('success', 'Empresa supervisora registrada correctamente');
      }
      cerrarModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar empresa supervisora';
      onMostrarMensaje?.('error', errorMessage);
      throw error;
    }
  };
  // Handler para eliminar entidad supervisora
  const handleEliminarEntidad = async (entidad: EntidadContratistaDetalle) => {
    const tipoEntidad = entidad.tipo_entidad === 'EMPRESA' ? 'empresa supervisora' : 'consorcio supervisor';
    if (!confirm(`¿Estás seguro de que quieres eliminar esta ${tipoEntidad} "${entidad.nombre_completo}"?`)) {
      return;
    }
    try {
      if (entidad.tipo_entidad === 'EMPRESA' && entidad.empresa_id) {
        await eliminarEmpresa(entidad.empresa_id);
        onMostrarMensaje?.('success', 'Empresa supervisora eliminada correctamente');
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
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-900">Empresas Supervisoras</h1>
          </div>
          <p className="text-green-700 ml-13">
            Gestión de empresas consultoras especializadas en supervisión y control de obras
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => abrirModalEmpresa()}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 border border-green-300 rounded-lg transition-colors"
          >
            <Building2 className="w-5 h-5" />
            Nueva Empresa Supervisora
          </button>
        </div>
      </div>
      {/* Breadcrumbs */}
      <BreadcrumbEmpresas 
        tipo="supervisoras"
        onNavigate={(ruta) => {
          if (ruta === 'dashboard') {
            onVolverADashboard();
          }
        }}
      />
      {/* Estadísticas específicas para supervisoras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{estadisticas.totalSupervisoras}</p>
              <p className="text-sm text-green-700">Total Supervisoras</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{estadisticas.empresasSupervisoras}</p>
              <p className="text-sm text-green-700">Empresas Supervisoras</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{estadisticas.activasSupervisoras}</p>
              <p className="text-sm text-green-700">Activas</p>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Información específica para supervisoras */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Rol de las Empresas Supervisoras
            </h3>
            <p className="text-green-700 mb-4">
              Las empresas supervisoras son responsables del control técnico, seguimiento y verificación 
              del cumplimiento de especificaciones técnicas durante la ejecución de obras públicas.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Control de calidad en obra</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Verificación de especificaciones técnicas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Seguimiento de cronogramas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Emisión de informes técnicos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error al cargar empresas supervisoras: {error}</span>
          </div>
        </div>
      )}
      {/* Lista de entidades supervisoras */}
      <div className="bg-white rounded-xl shadow-sm border border-green-200">
        <div className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <FileCheck className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-900">
              Registro de Empresas Supervisoras
            </h2>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Empresas consultoras y consorcios certificados para supervisión de obras públicas
          </p>
        </div>
        <div className="p-6">
          <ListaEntidades
            entidades={entidadesSupervisoras}
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
        title={empresaEditando ? 'Editar Empresa Supervisora' : 'Nueva Empresa Supervisora'}
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
export default GestionSupervisoras;