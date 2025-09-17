import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Building,
  MapPin,
  DollarSign,
  Filter,
  X,
  ChevronDown,
  Search,
  Settings
} from 'lucide-react';
import type { 
  FiltrosReporte, 
  PeriodoReporte,
  TipoReporte 
} from '../../../types/reporte.types';
import { PERIODOS_REPORTE } from '../../../types/reporte.types';

interface FiltrosAvanzadosProps {
  filtros: FiltrosReporte;
  onFiltrosChange: (filtros: FiltrosReporte) => void;
  tipoReporte: TipoReporte;
  onAplicar: () => void;
  onReset: () => void;
}

const FiltrosAvanzados = ({ 
  filtros, 
  onFiltrosChange, 
  tipoReporte,
  onAplicar,
  onReset 
}: FiltrosAvanzadosProps) => {
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [busquedaObra, setBusquedaObra] = useState('');
  const [busquedaContratista, setBusquedaContratista] = useState('');

  // Mock data para opciones
  const obras = [
    { id: 1, nombre: 'CONSTRUCCION DE CARRETERA PRINCIPAL', codigo: 'N.º 001-2025' },
    { id: 2, nombre: 'MEJORAMIENTO DE SISTEMA DE AGUA POTABLE', codigo: 'N.º 002-2025' },
    { id: 3, nombre: 'CONSTRUCCION DE CENTRO DE SALUD', codigo: 'N.º 003-2025' }
  ];

  const contratistas = [
    { id: 1, nombre: 'CONSTRUCTORA ABC S.A.C.', ruc: '20123456789' },
    { id: 2, nombre: 'INGENIERIA XYZ E.I.R.L.', ruc: '20987654321' },
    { id: 3, nombre: 'GRUPO CONSTRUCTOR PERU S.A.', ruc: '20456789123' }
  ];

  const tiposObra = [
    'CARRETERA',
    'EDIFICACION', 
    'SANEAMIENTO',
    'ELECTRICIDAD',
    'PUENTE',
    'OTROS'
  ];

  const estadosObra = [
    'REGISTRADA',
    'EN_EJECUCION',
    'PARALIZADA',
    'TERMINADA',
    'LIQUIDADA',
    'CANCELADA'
  ];

  const departamentos = [
    'Lima',
    'Cusco', 
    'Arequipa',
    'Piura',
    'Ancash',
    'Junín'
  ];

  const actualizarFiltro = <K extends keyof FiltrosReporte>(
    campo: K, 
    valor: FiltrosReporte[K]
  ) => {
    onFiltrosChange({ ...filtros, [campo]: valor });
  };

  const toggleArrayValue = <T,>(array: T[] | undefined, value: T): T[] => {
    const currentArray = array || [];
    return currentArray.includes(value) 
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
  };

  const obtenerRangoFechasPredefinido = (periodo: PeriodoReporte) => {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = hoy.getMonth();

    switch (periodo) {
      case 'MENSUAL':
        return {
          inicio: new Date(año, mes, 1).toISOString().split('T')[0],
          fin: new Date(año, mes + 1, 0).toISOString().split('T')[0]
        };
      case 'TRIMESTRAL':
        const trimestreInicio = Math.floor(mes / 3) * 3;
        return {
          inicio: new Date(año, trimestreInicio, 1).toISOString().split('T')[0],
          fin: new Date(año, trimestreInicio + 3, 0).toISOString().split('T')[0]
        };
      case 'SEMESTRAL':
        const semestreInicio = mes < 6 ? 0 : 6;
        return {
          inicio: new Date(año, semestreInicio, 1).toISOString().split('T')[0],
          fin: new Date(año, semestreInicio + 6, 0).toISOString().split('T')[0]
        };
      case 'ANUAL':
        return {
          inicio: new Date(año, 0, 1).toISOString().split('T')[0],
          fin: new Date(año, 11, 31).toISOString().split('T')[0]
        };
      default:
        return { inicio: filtros.fechaInicio, fin: filtros.fechaFin };
    }
  };

  const handlePeriodoChange = (periodo: PeriodoReporte) => {
    const fechas = obtenerRangoFechasPredefinido(periodo);
    onFiltrosChange({
      ...filtros,
      periodo,
      fechaInicio: fechas.inicio,
      fechaFin: fechas.fin
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header de filtros */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Filtros de Reporte
              </h3>
              <p className="text-sm text-gray-600">
                Configura los parámetros para generar el reporte
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Avanzados
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${
                  mostrarFiltrosAvanzados ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Filtros básicos */}
      <div className="p-6 space-y-6">
        {/* Período */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Período
            </label>
            <select
              value={filtros.periodo}
              onChange={(e) => handlePeriodoChange(e.target.value as PeriodoReporte)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(PERIODOS_REPORTE).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => actualizarFiltro('fechaInicio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => actualizarFiltro('fechaFin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Nivel de detalle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Nivel de Detalle
          </label>
          <div className="flex gap-4">
            {[
              { value: 'RESUMEN', label: 'Resumen', desc: 'Información básica y totalizadores' },
              { value: 'DETALLADO', label: 'Detallado', desc: 'Incluye desgloses y análisis' },
              { value: 'COMPLETO', label: 'Completo', desc: 'Toda la información disponible' }
            ].map((nivel) => (
              <label key={nivel.value} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="nivelDetalle"
                  value={nivel.value}
                  checked={filtros.niveLDetalle === nivel.value}
                  onChange={(e) => actualizarFiltro('niveLDetalle', e.target.value as any)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">{nivel.label}</div>
                  <div className="text-sm text-gray-600">{nivel.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros avanzados */}
      {mostrarFiltrosAvanzados && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-gray-200 overflow-hidden"
        >
          <div className="p-6 space-y-6">
            {/* Selección de obras */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline w-4 h-4 mr-1" />
                Obras Específicas
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-300" />
                <input
                  type="text"
                  placeholder="Buscar obra por nombre o código..."
                  value={busquedaObra}
                  onChange={(e) => setBusquedaObra(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                {obras
                  .filter(obra => 
                    obra.nombre.toLowerCase().includes(busquedaObra.toLowerCase()) ||
                    obra.codigo.toLowerCase().includes(busquedaObra.toLowerCase())
                  )
                  .map((obra) => (
                    <label key={obra.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filtros.obraIds?.includes(String(obra.id)) || false}
                        onChange={() =>
                          actualizarFiltro('obraIds', toggleArrayValue(filtros.obraIds, String(obra.id)))
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{obra.codigo}</div>
                        <div className="text-sm text-gray-600">{obra.nombre}</div>
                      </div>
                    </label>
                  ))
                }
              </div>
            </div>

            {/* Selección de contratistas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contratistas
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-300" />
                <input
                  type="text"
                  placeholder="Buscar contratista por nombre o RUC..."
                  value={busquedaContratista}
                  onChange={(e) => setBusquedaContratista(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                {contratistas
                  .filter(contratista =>
                    contratista.nombre.toLowerCase().includes(busquedaContratista.toLowerCase()) ||
                    contratista.ruc.includes(busquedaContratista)
                  )
                  .map((contratista) => (
                    <label key={contratista.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filtros.contratistaIds?.includes(String(contratista.id)) || false}
                        onChange={() =>
                          actualizarFiltro('contratistaIds', toggleArrayValue(filtros.contratistaIds, String(contratista.id)))
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{contratista.nombre}</div>
                        <div className="text-sm text-gray-600">RUC: {contratista.ruc}</div>
                      </div>
                    </label>
                  ))
                }
              </div>
            </div>

            {/* Filtros por tipo y estado de obra */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipos de Obra
                </label>
                <div className="space-y-2">
                  {tiposObra.map((tipo) => (
                    <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filtros.tiposObra?.includes(tipo) || false}
                        onChange={() =>
                          actualizarFiltro('tiposObra', toggleArrayValue(filtros.tiposObra, tipo))
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{tipo}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estados de Obra
                </label>
                <div className="space-y-2">
                  {estadosObra.map((estado) => (
                    <label key={estado} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filtros.estadosObra?.includes(estado) || false}
                        onChange={() =>
                          actualizarFiltro('estadosObra', toggleArrayValue(filtros.estadosObra, estado))
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {estado.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Filtros por ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Ubicación
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Departamentos
                  </label>
                  <select
                    multiple
                    value={filtros.departamentos || []}
                    onChange={(e) => {
                      const valores = Array.from(e.target.selectedOptions, option => option.value);
                      actualizarFiltro('departamentos', valores);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    size={4}
                  >
                    {departamentos.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Provincias
                  </label>
                  <input
                    type="text"
                    placeholder="Escribir provincias..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Distritos
                  </label>
                  <input
                    type="text"
                    placeholder="Escribir distritos..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Filtros por monto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Rango de Montos (S/)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Monto Mínimo
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={filtros.rangoMontoMin || ''}
                    onChange={(e) => actualizarFiltro('rangoMontoMin', Number(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Monto Máximo
                  </label>
                  <input
                    type="number"
                    placeholder="999,999,999.00"
                    value={filtros.rangoMontoMax || ''}
                    onChange={(e) => actualizarFiltro('rangoMontoMax', Number(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Filtros adicionales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Filtros Adicionales
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.incluirCompletadas || false}
                    onChange={(e) => actualizarFiltro('incluirCompletadas', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Incluir obras completadas
                  </span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.incluirParalizadas || false}
                    onChange={(e) => actualizarFiltro('incluirParalizadas', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Incluir obras paralizadas
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.soloConAlertas || false}
                    onChange={(e) => actualizarFiltro('soloConAlertas', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Solo obras con alertas
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.soloConRetrasos || false}
                    onChange={(e) => actualizarFiltro('soloConRetrasos', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Solo obras con retrasos
                  </span>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer con botones de acción */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filtros.obraIds?.length ? `${filtros.obraIds.length} obras seleccionadas` : 'Todas las obras'}
            {filtros.contratistaIds?.length ? ` • ${filtros.contratistaIds.length} contratistas` : ''}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Restaurar
            </button>
            <button
              onClick={onAplicar}
              className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltrosAvanzados;