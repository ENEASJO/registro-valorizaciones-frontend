import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  TrendingUp,
  DollarSign,
  Edit3,
  Archive,
  Construction
} from 'lucide-react';
import { useValorizaciones } from '../../../hooks/useValorizaciones';
import { useObras } from '../../../hooks/useObras';
import { useEntidadesContratistas } from '../../../hooks/useEmpresas';
import FormularioValorizacionEjecucion from './FormularioValorizacionEjecucion';
import DetalleValorizacion from './DetalleValorizacion';
import type { FiltrosValorizacion } from '../../../types/valorizacion.types';

type VistaActiva = 'lista' | 'crear' | 'detalle';

const ValorizacionEjecucion = () => {
  // Estados principales
  const [vistaActiva, setVistaActiva] = useState<VistaActiva>('lista');
  const [valorizacionSeleccionada, setValorizacionSeleccionada] = useState<string | null>(null);
  
  // Estados de filtros
  const [filtros, setFiltros] = useState<FiltrosValorizacion>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [obraFiltro, setObraFiltro] = useState<string | undefined>();
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');
  const [showFiltrosAvanzados, setShowFiltrosAvanzados] = useState(false);

  // Hooks
  const {
    valorizacionesEjecucion,
    loading,
    error,
    estadisticasDashboard,
    cargarValorizaciones,
    formatearMoneda
  } = useValorizaciones();
  
  const { obras } = useObras();
  const { entidades } = useEntidadesContratistas();

  // Funciones de navegación
  const volverALista = useCallback(() => {
    setVistaActiva('lista');
    setValorizacionSeleccionada(null);
    cargarValorizaciones(filtros);
  }, [cargarValorizaciones, filtros]);

  const abrirFormulario = useCallback(() => {
    setVistaActiva('crear');
  }, []);

  const verDetalle = useCallback((id: string) => {
    setValorizacionSeleccionada(id);
    setVistaActiva('detalle');
  }, []);

  // Función para aplicar filtros
  const aplicarFiltros = useCallback(() => {
    const nuevosFiltros: FiltrosValorizacion = {
      search: searchTerm || undefined,
      obra_id: obraFiltro,
      estado: estadoFiltro || undefined
    };
    
    setFiltros(nuevosFiltros);
    cargarValorizaciones(nuevosFiltros);
  }, [searchTerm, obraFiltro, estadoFiltro, cargarValorizaciones]);

  // Función para limpiar filtros
  const limpiarFiltros = useCallback(() => {
    setSearchTerm('');
    setObraFiltro(undefined);
    setEstadoFiltro('');
    setFiltros({});
    cargarValorizaciones();
  }, [cargarValorizaciones]);

  // Función para obtener icono de estado
  const getEstadoIcon = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'APROBADA':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'EN_REVISION':
      case 'PRESENTADA':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'BORRADOR':
        return <Edit3 className="w-5 h-5 text-gray-500" />;
      case 'OBSERVADA':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'PAGADA':
        return <DollarSign className="w-5 h-5 text-blue-500" />;
      case 'RECHAZADA':
        return <Archive className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  // Función para obtener color de estado
  const getEstadoColor = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'APROBADA':
        return 'bg-green-100 text-green-800';
      case 'EN_REVISION':
      case 'PRESENTADA':
        return 'bg-yellow-100 text-yellow-800';
      case 'BORRADOR':
        return 'bg-gray-100 text-gray-800';
      case 'OBSERVADA':
        return 'bg-orange-100 text-orange-800';
      case 'PAGADA':
        return 'bg-blue-100 text-blue-800';
      case 'RECHAZADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener nombre de obra
  const getNombreObra = (obraId: string) => {
    const obra = obras.find(o => o.id === obraId);
    return obra ? obra.nombre : 'Obra no encontrada';
  };

  // Función para obtener nombre de entidad ejecutora
  const getNombreEjecutora = (obraId: string) => {
    const obra = obras.find(o => o.id === obraId);
    if (!obra) return 'No disponible';

    const entidad = entidades.find(e => e.id === obra.entidad_ejecutora_id);
    return entidad ? entidad.nombre_completo : 'Entidad no encontrada';
  };

  // Renderizar vista actual
  if (vistaActiva === 'crear') {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Valorizaciones</span>
          <span>/</span>
          <span className="text-blue-600">Valorización de Ejecución</span>
          <span>/</span>
          <span className="text-blue-600 font-medium">Nueva Valorización</span>
        </div>
        
        <FormularioValorizacionEjecucion 
          onCancel={volverALista}
          onSuccess={volverALista}
        />
      </div>
    );
  }

  if (vistaActiva === 'detalle' && valorizacionSeleccionada) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Valorizaciones</span>
          <span>/</span>
          <span className="text-blue-600">Valorización de Ejecución</span>
          <span>/</span>
          <span className="text-blue-600 font-medium">Detalle</span>
        </div>

        <DetalleValorizacion
          valorizacionId={valorizacionSeleccionada}
          tipo="ejecucion"
          onBack={volverALista}
        />
      </div>
    );
  }

  // Vista principal
  return (
    <div className="space-y-6">
      {/* Header con diseño azul */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Construction className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Valorización de Ejecución</h1>
              <p className="text-blue-600 font-medium">Control de valorizaciones de obras ejecutadas</p>
            </div>
          </div>
          <p className="text-gray-600 mt-2 ml-15">
            Gestión y seguimiento de valorizaciones de obras ejecutadas por empresas contratistas
          </p>
        </div>
        <button 
          onClick={abrirFormulario}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Nueva Valorización
        </button>
      </div>

      {/* Dashboard de métricas con tema azul */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Valorizado</p>
              <p className="text-2xl font-bold text-blue-900">{estadisticasDashboard.totalValorizado}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </div>
        
        <div className="card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Aprobadas</p>
              <p className="text-2xl font-bold text-green-900">{estadisticasDashboard.aprobadas}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        
        <div className="card bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-900">{estadisticasDashboard.pendientes}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        
        <div className="card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Pagadas</p>
              <p className="text-2xl font-bold text-purple-900">{estadisticasDashboard.pagadas}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filtros y controles */}
      <div className="card">
        <div className="flex flex-col gap-4">
          {/* Filtros principales */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por número, obra o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && aplicarFiltros()}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={obraFiltro || ''}
              onChange={(e) => setObraFiltro(e.target.value || undefined)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-w-[200px]"
            >
              <option value="">Todas las obras</option>
              {obras.map(obra => (
                <option key={obra.id} value={obra.id}>
                  {obra.numero_contrato} - {obra.nombre.substring(0, 50)}...
                </option>
              ))}
            </select>
            
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="BORRADOR">Borrador</option>
              <option value="PRESENTADA">Presentada</option>
              <option value="EN_REVISION">En Revisión</option>
              <option value="OBSERVADA">Observada</option>
              <option value="APROBADA">Aprobada</option>
              <option value="PAGADA">Pagada</option>
              <option value="RECHAZADA">Rechazada</option>
            </select>

            <div className="flex gap-2">
              <button 
                onClick={aplicarFiltros}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtrar
              </button>
              
              <button 
                onClick={limpiarFiltros}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Limpiar
              </button>
              
              <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>

          {/* Filtros avanzados */}
          {showFiltrosAvanzados && (
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha desde
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha hasta
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Solo con atraso
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Todas</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setShowFiltrosAvanzados(!showFiltrosAvanzados)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium self-start"
          >
            {showFiltrosAvanzados ? 'Ocultar' : 'Mostrar'} filtros avanzados
          </button>
        </div>
      </div>

      {/* Tabla de valorizaciones */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Cargando valorizaciones...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : valorizacionesEjecucion.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay valorizaciones de ejecución para mostrar</p>
            <button 
              onClick={abrirFormulario}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear primera valorización
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Número / Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Obra / Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Periodo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Avance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {valorizacionesEjecucion.map((val: any, index: number) => (
                  <motion.tr
                    key={val.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => verDetalle(val.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getEstadoIcon(val.estado)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            N° {val.numero_valorización || 'Sin número'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {'codigo_valorización' in val ? val.codigo_valorización : `EJE-${val.numero_valorización}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {getNombreObra(val.obra_id)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getNombreEjecutora(val.obra_id)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(val.periodo_inicio).toLocaleDateString('es-PE')} - {' '}
                        {new Date(val.periodo_fin).toLocaleDateString('es-PE')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {'dias_periodo' in val ? val.dias_periodo : 0} días
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatearMoneda(val.monto_bruto)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Neto: {formatearMoneda(val.monto_neto)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ 
                              width: `${Math.min('porcentaje_avance_fisico_total' in val ? val.porcentaje_avance_fisico_total : 0, 100)}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {'porcentaje_avance_fisico_total' in val ? val.porcentaje_avance_fisico_total.toFixed(1) : '0.0'}%
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(val.estado)}`}>
                        {val.estado.charAt(0) + val.estado.slice(1).toLowerCase().replace('_', ' ')}
                      </span>
                      {val.dias_atraso > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          {val.dias_atraso} días atraso
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            verDetalle(val.id);
                          }}
                          className="text-blue-600 hover:text-blue-900" 
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-600 hover:text-gray-900" 
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4" />
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

export default ValorizacionEjecucion;