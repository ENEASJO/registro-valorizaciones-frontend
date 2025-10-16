import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import type { ValorizacionSupervisionForm } from '../../../types/valorizacion.types';
import type { ValorizacionForm } from '../../../hooks/useValorizaciones';
import { useObras } from '../../../hooks/useObras';
import {
  ArrowLeft,
  Save,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  FileText,
  Info,
  Cloud,
  X,
  Pause,
  MoreHorizontal
} from 'lucide-react';
import { useValorizaciones } from '../../../hooks/useValorizaciones';



interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}
const FormularioValorizacionSupervision = ({ onCancel, onSuccess }: Props) => {
  // Estados del formulario
  const [obraSeleccionada, setObraSeleccionada] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  // Expediente
  const [numeroExpediente, setNumeroExpediente] = useState('');
  const [numeroExpedienteSiaf, setNumeroExpedienteSiaf] = useState('');
  // Días trabajados
  const [diasEfectivos, setDiasEfectivos] = useState<number>(0);
  const [diasLluvia, setDiasLluvia] = useState<number>(0);
  const [diasFeriados, setDiasFeriados] = useState<number>(0);
  const [diasSuspension, setDiasSuspension] = useState<number>(0);
  const [diasOtros, setDiasOtros] = useState<number>(0);
  // Deducciones
  const [penalidades, setPenalidades] = useState<number>(0);
  const [otrasDeduccciones, setOtrasDeduccciones] = useState<number>(0);
  // Documentación
  const [supervisorResponsable, setSupervisorResponsable] = useState('');
  const [actividadesRealizadas, setActividadesRealizadas] = useState('');
  const [observacionesPeriodo, setObservacionesPeriodo] = useState('');
  const [motivosDiasNoTrabajados, setMotivosDiasNoTrabajados] = useState('');
  // Estados de cálculo y validación
  const [errores, setErrores] = useState<string[]>([]);
  const [mostrarCalculos, setMostrarCalculos] = useState(false);
  // Hooks
  const { 
    crearValorizacionSupervision,
    valorizacionesEjecucion,
    formatearMoneda,
    loading 
  } = useValorizaciones();
  const { obras, obtenerObraPorId } = useObras();
  // Obras valorizables con supervisor (REGISTRADA o EN_EJECUCION)
  const obrasConSupervisor = obras.filter(o =>
    (o.estado === 'EN_EJECUCION' || o.estado === 'REGISTRADA') &&
    o.entidad_supervisora_id
  );
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
  // Calcular días del periodo
  const diasPeriodo = useMemo(() => {
    if (!fechaInicio || !fechaFin) return 0;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1;
  }, [fechaInicio, fechaFin]);
  // Calcular días no trabajados totales
  const diasNoTrabajados = diasLluvia + diasFeriados + diasSuspension + diasOtros;
  // Tarifa diaria de supervisión (calculada desde el contrato)
  const tarifaDiaria = useMemo(() => {
    if (!obraActual) return 0;
    return obraActual.monto_supervision / obraActual.plazo_ejecucion_dias;
  }, [obraActual]);
  // Cálculos de montos
  const calculos = useMemo(() => {
    if (!obraActual || diasEfectivos === 0) {
      return {
        montoBruto: 0,
        retencionMonto: 0,
        totalDeducciones: 0,
        montoNeto: 0,
        igvMonto: 0,
        montoTotal: 0
      };
    }
    const montoBruto = diasEfectivos * tarifaDiaria;
    const retencionMonto = montoBruto * 0.05; // 5% retención garantía
    const totalDeducciones = retencionMonto + penalidades + otrasDeduccciones;
    const montoNeto = montoBruto - totalDeducciones;
    const igvMonto = montoNeto * 0.18; // IGV 18%
    const montoTotal = montoNeto + igvMonto;
    return {
      montoBruto,
      retencionMonto,
      totalDeducciones,
      montoNeto,
      igvMonto,
      montoTotal
    };
  }, [obraActual, diasEfectivos, tarifaDiaria, penalidades, otrasDeduccciones]);
  // Porcentaje de días trabajados
  const porcentajeDiasTrabajados = diasPeriodo > 0 ? (diasEfectivos / diasPeriodo) * 100 : 0;
  // Validaciones en tiempo real
  useEffect(() => {
    const nuevosErrores: string[] = [];
    if (!obraSeleccionada) {
      nuevosErrores.push('Debe seleccionar una obra');
    }
    if (!fechaInicio || !fechaFin) {
      nuevosErrores.push('Debe especificar el periodo de supervisión');
    } else if (new Date(fechaInicio) > new Date(fechaFin)) {
      nuevosErrores.push('La fecha de inicio no puede ser posterior a la fecha fin');
    }
    if (diasEfectivos + diasNoTrabajados > diasPeriodo) {
      nuevosErrores.push('La suma de días trabajados y no trabajados excede los días del periodo');
    }
    if (diasEfectivos < 0) {
      nuevosErrores.push('Los días efectivos no pueden ser negativos');
    }
    if (diasLluvia < 0 || diasFeriados < 0 || diasSuspension < 0 || diasOtros < 0) {
      nuevosErrores.push('Los días no trabajados no pueden ser negativos');
    }
    if (!supervisorResponsable.trim()) {
      nuevosErrores.push('Debe especificar el supervisor responsable');
    }
    // Validar fechas dentro del plazo de la obra
    if (obraActual && fechaInicio && fechaFin) {
      const obraInicio = new Date(obraActual.fecha_inicio || '2024-01-01');
      const obraFin = new Date(obraActual.fecha_fin_prevista || '2024-12-31');
      const periodoInicio = new Date(fechaInicio);
      const periodoFin = new Date(fechaFin);
      if (periodoInicio < obraInicio) {
        nuevosErrores.push('El periodo no puede ser anterior al inicio de la obra');
      }
      if (periodoFin > obraFin) {
        nuevosErrores.push('El periodo no puede ser posterior a la fecha prevista de fin');
      }
    }
    setErrores(nuevosErrores);
  }, [
    obraSeleccionada, fechaInicio, fechaFin, diasEfectivos, diasNoTrabajados, 
    diasPeriodo, diasLluvia, diasFeriados, diasSuspension, diasOtros, 
    supervisorResponsable, obraActual
  ]);
  // Autocompletar días cuando cambia el periodo
  useEffect(() => {
    if (diasPeriodo > 0 && diasEfectivos === 0 && diasNoTrabajados === 0) {
      setDiasEfectivos(diasPeriodo);
    }
  }, [diasPeriodo]);
  // Función para buscar valorización de ejecución asociada
  const buscarValorizacionEjecucion = useCallback(() => {
    if (!obraSeleccionada || !fechaInicio || !fechaFin) return null;
    return valorizacionesEjecucion.find(ve => 
      ve.obra_id === obraSeleccionada &&
      ve.periodo_inicio === fechaInicio &&
      ve.periodo_fin === fechaFin
    );
  }, [obraSeleccionada, fechaInicio, fechaFin, valorizacionesEjecucion]);
  // Función para guardar
  const handleGuardar = async () => {
    if (!obraActual) return;
    if (errores.length > 0) return;
    const valorizacionEjecucion = buscarValorizacionEjecucion();
    if (!valorizacionEjecucion) {
      setErrores(['No se encontró una valorización de ejecución para el mismo periodo']);
      return;
    }
    const form: ValorizacionForm = {
      obra_id: obraActual.id,
      numero_valorizacion: 1,
      periodo: '2024-01',
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      tipo_valorizacion: 'SUPERVISION',
      monto_ejecutado: calculos.montoBruto,
      numero_expediente: numeroExpediente || undefined,
      numero_expediente_siaf: numeroExpedienteSiaf || undefined,
      penalidades_monto: penalidades,
      otras_deducciones_monto: otrasDeduccciones
    } as ValorizacionForm;
    try {
      await crearValorizacionSupervision(form);
      onSuccess();
    } catch (error) {
      console.error('Error al crear valorización de supervisión:', error);
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
            <h1 className="text-3xl font-bold text-gray-900">Nueva Valorización de Supervisión</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Crear valorización de supervisión basada en días efectivos trabajados</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setMostrarCalculos(!mostrarCalculos)}
            className="btn-secondary flex items-center gap-2"
            disabled={!obraActual || diasEfectivos === 0}
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
      {mostrarCalculos && obraActual && diasEfectivos > 0 && (
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
              <p className="font-semibold text-blue-900">{formatearMoneda(calculos.montoBruto)}</p>
              <p className="text-xs text-blue-600">{diasEfectivos} días × {formatearMoneda(tarifaDiaria)}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Deducciones</p>
              <p className="font-semibold text-blue-900">{formatearMoneda(calculos.totalDeducciones)}</p>
              <p className="text-xs text-blue-600">Retención + Penalidades</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Monto Neto</p>
              <p className="font-semibold text-blue-900">{formatearMoneda(calculos.montoNeto)}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Días Trabajados</p>
              <p className="font-semibold text-blue-900">{porcentajeDiasTrabajados.toFixed(1)}%</p>
              <p className="text-xs text-blue-600">{diasEfectivos} de {diasPeriodo} días</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-blue-600 mb-2">Desglose de Deducciones:</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Retención Garantía (5%):</span>
                <span className="font-medium text-blue-800 ml-2">{formatearMoneda(calculos.retencionMonto)}</span>
              </div>
              {penalidades > 0 && (
                <div>
                  <span className="text-blue-600">Penalidades:</span>
                  <span className="font-medium text-blue-800 ml-2">{formatearMoneda(penalidades)}</span>
                </div>
              )}
              {otrasDeduccciones > 0 && (
                <div>
                  <span className="text-blue-600">Otras Deducciones:</span>
                  <span className="font-medium text-blue-800 ml-2">{formatearMoneda(otrasDeduccciones)}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información básica y control de días */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos generales */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-500 dark:text-gray-300" />
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
                  <option value="">Seleccionar obra con supervisor...</option>
                  {obrasConSupervisor.map(obra => (
                    <option key={obra.id} value={obra.id}>
                      {obra.numero_contrato} - {obra.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Supervisión
                </label>
                <input
                  type="text"
                  value={obraActual ? formatearMoneda(obraActual.monto_supervision) : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
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
                  Días Calendario del Periodo
                </label>
                <input
                  type="text"
                  value={diasPeriodo}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarifa Diaria de Supervisión
                </label>
                <input
                  type="text"
                  value={formatearMoneda(tarifaDiaria)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                  Calculada automáticamente: Monto supervisión / Días plazo
                </p>
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
          {/* Control de días */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900">Control de Días Trabajados</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Días Efectivos Trabajados *
                </label>
                <input
                  type="number"
                  value={diasEfectivos}
                  onChange={(e: any) => setDiasEfectivos(Number(e.target.value) || 0)}
                  min="0"
                  max={diasPeriodo}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                  Días reales de supervisión efectiva (máximo {diasPeriodo} días)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Cloud className="w-4 h-4 text-blue-500" />
                  Días de Lluvia
                </label>
                <input
                  type="number"
                  value={diasLluvia}
                  onChange={(e: any) => setDiasLluvia(Number(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-green-500" />
                  Días Feriados
                </label>
                <input
                  type="number"
                  value={diasFeriados}
                  onChange={(e: any) => setDiasFeriados(Number(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Pause className="w-4 h-4 text-orange-500" />
                  Días Suspensión
                </label>
                <input
                  type="number"
                  value={diasSuspension}
                  onChange={(e: any) => setDiasSuspension(Number(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                  Otros Motivos
                </label>
                <input
                  type="number"
                  value={diasOtros}
                  onChange={(e: any) => setDiasOtros(Number(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total No Trabajados
                </label>
                <input
                  type="text"
                  value={diasNoTrabajados}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
            </div>
            {/* Validación visual de días */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Días del periodo:</span>
                <span className="font-medium">{diasPeriodo}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Días efectivos:</span>
                <span className="font-medium text-green-600">{diasEfectivos}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Días no trabajados:</span>
                <span className="font-medium text-orange-600">{diasNoTrabajados}</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t pt-2 mt-2">
                <span className="text-gray-700">Total asignado:</span>
                <span className={`font-medium ${
                  diasEfectivos + diasNoTrabajados <= diasPeriodo 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {diasEfectivos + diasNoTrabajados} / {diasPeriodo}
                </span>
              </div>
            </div>
          </div>
          {/* Supervisor y actividades */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Supervisor y Actividades</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supervisor Responsable *
                </label>
                <input
                  type="text"
                  value={supervisorResponsable}
                  onChange={(e: any) => setSupervisorResponsable(e.target.value)}
                  placeholder="Nombre completo del supervisor responsable"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actividades Realizadas
                </label>
                <textarea
                  value={actividadesRealizadas}
                  onChange={(e: any) => setActividadesRealizadas(e.target.value)}
                  rows={3}
                  placeholder="Descripción de las actividades de supervisión realizadas durante el periodo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones del Periodo
                </label>
                <textarea
                  value={observacionesPeriodo}
                  onChange={(e: any) => setObservacionesPeriodo(e.target.value)}
                  rows={3}
                  placeholder="Observaciones generales sobre el periodo de supervisión..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivos de Días No Trabajados
                </label>
                <textarea
                  value={motivosDiasNoTrabajados}
                  onChange={(e: any) => setMotivosDiasNoTrabajados(e.target.value)}
                  rows={2}
                  placeholder="Explicación detallada de los motivos de los días no trabajados..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Panel lateral de deducciones */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Deducciones</h3>
            <div className="space-y-4">
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
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Penalidades aplicables por incumplimientos</p>
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
                  <p className="text-xs mt-1">Se aplica automáticamente sobre el monto bruto</p>
                </div>
              </div>
            </div>
          </div>
          {/* Información de la valorización de ejecución relacionada */}
          {obraSeleccionada && fechaInicio && fechaFin && (
            <div className="card border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-blue-500" />
                <h3 className="font-medium text-blue-800">Valorización Relacionada</h3>
              </div>
              {buscarValorizacionEjecucion() ? (
                <div className="text-sm text-blue-700">
                  <CheckCircle className="w-4 h-4 text-green-500 inline mr-2" />
                  Se encontró valorización de ejecución para el mismo periodo
                </div>
              ) : (
                <div className="text-sm text-orange-700">
                  <AlertTriangle className="w-4 h-4 text-orange-500 inline mr-2" />
                  No se encontró valorización de ejecución para este periodo
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FormularioValorizacionSupervision;