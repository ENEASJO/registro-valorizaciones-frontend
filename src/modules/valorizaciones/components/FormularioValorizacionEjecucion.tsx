import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import type { Partida, PartidaDetalleForm, ValorizacionEjecucionForm, CalculosValorizacion } from '../../../types/valorizacion.types';
import type { ValorizacionForm } from '../../../hooks/useValorizaciones';
import { useObras } from '../../../hooks/useObras';
import {
  ArrowLeft,
  Save,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Building,
  FileText,
  Plus,
  Minus,
  Info
} from 'lucide-react';
import { useValorizaciones } from '../../../hooks/useValorizaciones';



import TablaPartidas from './TablaPartidas';
interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}
const FormularioValorizacionEjecucion = ({ onCancel, onSuccess }: Props) => {
  // Estados del formulario
  const [obraSeleccionada, setObraSeleccionada] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  // Expediente
  const [numeroExpediente, setNumeroExpediente] = useState('');
  const [numeroExpedienteSiaf, setNumeroExpedienteSiaf] = useState('');
  // Deducciones
  const [adelantoDirecto, setAdelantoDirecto] = useState<number>(0);
  const [adelantoMateriales, setAdelantoMateriales] = useState<number>(0);
  const [penalidades, setPenalidades] = useState<number>(0);
  const [otrasDeduccciones, setOtrasDeduccciones] = useState<number>(0);
  // Personal y observaciones
  const [residente, setResidente] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [observacionesResidente, setObservacionesResidente] = useState('');
  const [observacionesSupervisor, setObservacionesSupervisor] = useState('');
  // Partidas seleccionadas
  const [partidasSeleccionadas, setPartidasSeleccionadas] = useState<PartidaDetalleForm[]>([]);
  // Estados de cálculo y validación
  const [calculos, setCalculos] = useState<CalculosValorizacion | null>(null);
  const [errores, setErrores] = useState<string[]>([]);
  const [mostrarCalculos, setMostrarCalculos] = useState(false);
  // Hooks
  const { 
    crearValorizacionEjecucion, 
    calcularMontos, 
    validarValorizacion,
    formatearMoneda,
    cargarPartidasPorObra,
    partidas,
    loading 
  } = useValorizaciones();
  const { obras, obtenerObraPorId } = useObras();
  // Obras valorizables (registrada = primera valorización, en_ejecucion = valorizaciones subsecuentes)
  const obrasValorizables = obras.filter(o => o.estado === 'en_ejecucion' || o.estado === 'registrada');
  // Obra actual
  const [obraActual, setObraActual] = useState<any>(null);
  
  // Cargar obra seleccionada
  useEffect(() => {
    if (obraSeleccionada) {
      obtenerObraPorId(obraSeleccionada).then(obra => {
        setObraActual(obra);
      }).catch(error => {
        console.error('Error cargando obra:', error);
        setObraActual(null);
      });
    } else {
      setObraActual(null);
    }
  }, [obraSeleccionada, obtenerObraPorId]);
  // Cargar partidas cuando se selecciona una obra
  useEffect(() => {
    if (obraSeleccionada) {
      cargarPartidasPorObra(obraSeleccionada);
      setPartidasSeleccionadas([]);
    }
  }, [obraSeleccionada, cargarPartidasPorObra]);
  // Recalcular montos cuando cambian las partidas o deducciones
  useEffect(() => {
    if (partidasSeleccionadas.length > 0 && obraActual) {
      const formData = {
        obra_id: obraActual.id || 0,
        numero_valorizacion: 1,
        periodo: '2024-01',
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        tipo_valorizacion: 'EJECUCION',
        monto_ejecutado: partidasSeleccionadas.reduce((sum, p) => sum + (p.metrado_actual * 100), 0),
        adelanto_directo_porcentaje: adelantoDirecto,
        adelanto_materiales_porcentaje: adelantoMateriales,
        penalidades_monto: penalidades,
        otras_deducciones_monto: otrasDeduccciones
      };
      const nuevosCalculos = calcularMontos(formData);
      setCalculos(nuevosCalculos as any);
      setErrores([]);
    } else {
      setCalculos(null);
      setErrores([]);
    }
  }, [partidasSeleccionadas, adelantoDirecto, adelantoMateriales, penalidades, otrasDeduccciones, obraActual, calcularMontos]);
  // Función para agregar partida
  const agregarPartida = useCallback((partidaId: number, metrado: number) => {
    const partida = partidas.find(p => p.id === partidaId);
    if (!partida) return;
    const nuevaPartida: PartidaDetalleForm = {
      partida_id: partidaId,
      metrado_actual: metrado,
      fecha_medicion: new Date().toISOString().split('T')[0],
      metodo_medicion: 'MANUAL'
    };
    setPartidasSeleccionadas(prev => {
      const existe = prev.find(p => p.partida_id === partidaId);
      if (existe) {
        return prev.map(p => 
          p.partida_id === partidaId 
            ? { ...p, metrado_actual: metrado }
            : p
        );
      }
      return [...prev, nuevaPartida];
    });
  }, [partidas]);
  // Función para quitar partida
  const quitarPartida = useCallback((partidaId: number) => {
    setPartidasSeleccionadas(prev => prev.filter(p => p.partida_id !== partidaId));
  }, []);
  // Función para calcular días del periodo
  const calcularDiasPeriodo = useCallback(() => {
    if (!fechaInicio || !fechaFin) return 0;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1;
  }, [fechaInicio, fechaFin]);
  // Función para guardar
  const handleGuardar = async () => {
    if (!obraActual) {
      setErrores(['Debe seleccionar una obra']);
      return;
    }
    const form: ValorizacionForm = {
      obra_id: obraActual.id,
      numero_valorizacion: 1,
      periodo: '2024-01',
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      tipo_valorizacion: 'EJECUCION',
      monto_ejecutado: partidasSeleccionadas.reduce((sum, p) => sum + (p.metrado_actual * 100), 0),
      numero_expediente: numeroExpediente || undefined,
      numero_expediente_siaf: numeroExpedienteSiaf || undefined,
      adelanto_directo_porcentaje: adelantoDirecto,
      adelanto_materiales_porcentaje: adelantoMateriales,
      penalidades_monto: penalidades,
      otras_deducciones_monto: otrasDeduccciones,
      residente_obra: residente,
      supervisor_obra: supervisor,
      observaciones_residente: observacionesResidente,
      observaciones_supervisor: observacionesSupervisor
    } as ValorizacionForm;
    try {
      const validacion = validarValorizacion(form);
      if (!validacion.valido) {
        setErrores(validacion.errores);
        return;
      }
      await crearValorizacionEjecucion(form);
      onSuccess();
    } catch (error) {
      console.error('Error al crear valorización:', error);
      setErrores([error instanceof Error ? error.message : 'Error desconocido']);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nueva Valorización de Ejecución</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Crear valorización mensual de avance de obra</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setMostrarCalculos(!mostrarCalculos)}
            className="btn-secondary flex items-center gap-2"
            disabled={!calculos}
          >
            <Calculator className="w-4 h-4" />
            {mostrarCalculos ? 'Ocultar' : 'Ver'} Cálculos
          </button>
          <button
            onClick={handleGuardar}
            disabled={loading || errores.length > 0}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Guardando...' : 'Guardar Valorización'}
          </button>
        </div>
      </div>
      {/* Errores */}
      {errores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-red-200 bg-red-50"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800 mb-1">Errores de Validación</h3>
              <ul className="text-sm text-red-700 space-y-1">
                {errores.map((error: any, index: number) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
      {/* Cálculos */}
      {mostrarCalculos && calculos && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card border-blue-200 bg-blue-50"
        >
          <div className="flex items-start gap-3 mb-4">
            <Calculator className="w-5 h-5 text-blue-500 mt-0.5" />
            <h3 className="font-medium text-blue-800">Resumen de Cálculos</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-blue-600">Monto Bruto</p>
              <p className="font-semibold text-blue-900">{formatearMoneda(calculos.monto_bruto)}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Total Deducciones</p>
              <p className="font-semibold text-blue-900">{formatearMoneda(calculos.total_deducciones)}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Monto Neto</p>
              <p className="font-semibold text-blue-900">{formatearMoneda(calculos.monto_neto)}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Avance Físico</p>
              <p className="font-semibold text-blue-900">{calculos.porcentaje_avance_fisico.toFixed(2)}%</p>
            </div>
          </div>
          {calculos.advertencias.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Advertencias:</p>
                  <ul className="text-sm text-yellow-700 mt-1">
                    {calculos.advertencias.map((adv: any, index: number) => (
                      <li key={index}>• {adv}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información básica */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos generales */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900">Información General</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Obra *
                </label>
                <select
                  value={obraSeleccionada || ''}
                  onChange={(e: any) => setObraSeleccionada(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Seleccionar obra...</option>
                  {obrasValorizables.map(obra => (
                    <option key={obra.id} value={obra.id}>
                      {obra.numero_contrato} - {obra.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Contractual (de Ejecución)
                </label>
                <input
                  type="text"
                  value={obraActual ? formatearMoneda(obraActual.monto_ejecucion) : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                  Obtenido automáticamente de la obra seleccionada
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio Periodo *
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e: any) => setFechaInicio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin Periodo *
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e: any) => setFechaFin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Días del Periodo
                </label>
                <input
                  type="text"
                  value={calcularDiasPeriodo()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado de Obra
                </label>
                <input
                  type="text"
                  value={obraActual ? obraActual.estado.replace('_', ' ') : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Expediente
                </label>
                <input
                  type="text"
                  value={numeroExpediente}
                  onChange={(e: any) => setNumeroExpediente(e.target.value)}
                  placeholder="Número de expediente administrativo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Expediente SIAF
                </label>
                <input
                  type="text"
                  value={numeroExpedienteSiaf}
                  onChange={(e: any) => setNumeroExpedienteSiaf(e.target.value)}
                  placeholder="Número de expediente SIAF"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
          {/* Personal responsable */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Responsable</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Residente de Obra
                </label>
                <input
                  type="text"
                  value={residente}
                  onChange={(e: any) => setResidente(e.target.value)}
                  placeholder="Nombre completo del residente"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supervisor de Obra
                </label>
                <input
                  type="text"
                  value={supervisor}
                  onChange={(e: any) => setSupervisor(e.target.value)}
                  placeholder="Nombre completo del supervisor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
          {/* Observaciones */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Observaciones</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones del Residente
                </label>
                <textarea
                  value={observacionesResidente}
                  onChange={(e: any) => setObservacionesResidente(e.target.value)}
                  rows={3}
                  placeholder="Observaciones técnicas, dificultades encontradas, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones del Supervisor
                </label>
                <textarea
                  value={observacionesSupervisor}
                  onChange={(e: any) => setObservacionesSupervisor(e.target.value)}
                  rows={3}
                  placeholder="Control de calidad, cumplimiento de especificaciones, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Panel lateral de deducciones */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Deducciones Contractuales</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adelanto Directo (%)
                </label>
                <input
                  type="number"
                  value={adelantoDirecto}
                  onChange={(e: any) => setAdelantoDirecto(Number(e.target.value) || 0)}
                  min="0"
                  max="30"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Máximo 30% según normativa</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adelanto Materiales (%)
                </label>
                <input
                  type="number"
                  value={adelantoMateriales}
                  onChange={(e: any) => setAdelantoMateriales(Number(e.target.value) || 0)}
                  min="0"
                  max="20"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Máximo 20% según normativa</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Penalidades (S/)
                </label>
                <input
                  type="number"
                  value={penalidades}
                  onChange={(e: any) => setPenalidades(Number(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Otras Deducciones (S/)
                </label>
                <input
                  type="number"
                  value={otrasDeduccciones}
                  onChange={(e: any) => setOtrasDeduccciones(Number(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="border-t pt-4">
                <div className="text-sm text-gray-600">
                  <p>Retención Garantía: 5%</p>
                  <p className="text-xs mt-1">Se aplica automáticamente según normativa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tabla de partidas */}
      {obraSeleccionada && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900">Partidas a Valorizar</h2>
          </div>
          <TablaPartidas
            partidas={partidas}
            partidasSeleccionadas={partidasSeleccionadas}
            onAgregarPartida={agregarPartida}
            onQuitarPartida={quitarPartida}
            readonly={false}
          />
          {partidasSeleccionadas.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-300">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Seleccione partidas para valorizar</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default FormularioValorizacionEjecucion;