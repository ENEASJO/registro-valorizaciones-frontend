import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  User, 
  AlertTriangle, 
  Check,
  Edit3,
  Trash,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Percent
} from 'lucide-react';
import type { 
  ProfesionalForm, 
  ObraProfesional, 
  Profesion,
  ResultadoDisponibilidadProfesional,
  ErrorValidacion
} from '../../../types/obra.types';
import { useProfesiones, useProfesionales, useValidacionesObra } from '../../../hooks/useObras';

interface PlantelProfesionalProps {
  obraId?: number;
  profesionales: ProfesionalForm[];
  onProfesionalesChange: (profesionales: ProfesionalForm[]) => void;
  fechaInicio: string;
  fechaFin: string;
  readonly?: boolean;
  className?: string;
}

interface ProfesionalFormulario extends ProfesionalForm {
  id?: string; // ID temporal para el formulario
  isEditing?: boolean;
  errors?: Record<string, string>;
  disponibilidad?: ResultadoDisponibilidadProfesional;
}

const PlantelProfesional: React.FC<PlantelProfesionalProps> = ({
  obraId,
  profesionales,
  onProfesionalesChange,
  fechaInicio,
  fechaFin,
  readonly = false,
  className = ""
}) => {
  const { profesiones } = useProfesiones();
  const { verificarDisponibilidad } = useProfesionales();
  const { validarPorcentajeProfesional } = useValidacionesObra();

  const [profesionalesForm, setProfesionalesForm] = useState<ProfesionalFormulario[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [profesionalEditando, setProfesionalEditando] = useState<string | null>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Sincronizar con props
  useEffect(() => {
    const formData = profesionales.map((prof, index) => ({
      ...prof,
      id: `prof-${index}`,
      isEditing: false,
      errors: {}
    }));
    setProfesionalesForm(formData);
  }, [profesionales]);

  // Crear nuevo profesional vacío
  const crearProfesionalVacio = (): ProfesionalFormulario => ({
    id: `new-${Date.now()}`,
    profesion_id: 0,
    nombre_completo: '',
    numero_colegiatura: '',
    dni: '',
    telefono: '',
    email: '',
    porcentaje_participacion: 0,
    fecha_inicio_participacion: fechaInicio,
    fecha_fin_participacion: fechaFin,
    cargo: '',
    responsabilidades: [],
    observaciones: '',
    isEditing: true,
    errors: {}
  });

  // Validar profesional
  const validarProfesional = async (profesional: ProfesionalFormulario): Promise<Record<string, string>> => {
    const errors: Record<string, string> = {};

    // Validaciones básicas
    if (!profesional.profesion_id) {
      errors.profesion_id = 'Debe seleccionar una profesión';
    }

    if (!profesional.nombre_completo.trim()) {
      errors.nombre_completo = 'El nombre completo es obligatorio';
    }

    if (profesional.porcentaje_participacion <= 0 || profesional.porcentaje_participacion > 100) {
      errors.porcentaje_participacion = 'El porcentaje debe estar entre 1 y 100';
    }

    // Validar email si se proporciona
    if (profesional.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profesional.email)) {
      errors.email = 'Formato de email inválido';
    }

    // Validar DNI si se proporciona
    if (profesional.dni && (profesional.dni.length !== 8 || !/^\d{8}$/.test(profesional.dni))) {
      errors.dni = 'El DNI debe tener 8 dígitos';
    }

    // Validar teléfono si se proporciona
    if (profesional.telefono && (profesional.telefono.length < 7 || profesional.telefono.length > 15)) {
      errors.telefono = 'El teléfono debe tener entre 7 y 15 dígitos';
    }

    return errors;
  };

  // Verificar disponibilidad del profesional
  const verificarDisponibilidadProfesional = async (profesional: ProfesionalFormulario) => {
    if (!profesional.nombre_completo.trim() || profesional.porcentaje_participacion !== 100) {
      return;
    }

    setLoading(prev => ({ ...prev, [profesional.id!]: true }));

    try {
      const resultado = await verificarDisponibilidad(
        profesional.nombre_completo,
        profesional.fecha_inicio_participacion,
        profesional.fecha_fin_participacion || fechaFin,
        obraId
      );

      setProfesionalesForm(prev => prev.map(p => 
        p.id === profesional.id 
          ? { ...p, disponibilidad: resultado }
          : p
      ));
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
    } finally {
      setLoading(prev => ({ ...prev, [profesional.id!]: false }));
    }
  };

  // Agregar nuevo profesional
  const agregarProfesional = () => {
    const nuevoProfesional = crearProfesionalVacio();
    setProfesionalesForm(prev => [...prev, nuevoProfesional]);
    setMostrarFormulario(true);
    setProfesionalEditando(nuevoProfesional.id!);
  };

  // Guardar profesional
  const guardarProfesional = async (profesionalId: string) => {
    const profesional = profesionalesForm.find(p => p.id === profesionalId);
    if (!profesional) return;

    const errors = await validarProfesional(profesional);

    if (Object.keys(errors).length > 0) {
      setProfesionalesForm(prev => prev.map(p => 
        p.id === profesionalId 
          ? { ...p, errors }
          : p
      ));
      return;
    }

    // Verificar disponibilidad si tiene 100%
    if (profesional.porcentaje_participacion === 100) {
      await verificarDisponibilidadProfesional(profesional);
      
      const profesionalActualizado = profesionalesForm.find(p => p.id === profesionalId);
      if (profesionalActualizado?.disponibilidad && !profesionalActualizado.disponibilidad.disponible) {
        // Mostrar advertencia pero permitir guardar
      }
    }

    // Actualizar el estado
    const profesionalesActualizados = profesionalesForm.map(p => 
      p.id === profesionalId 
        ? { ...p, isEditing: false, errors: {} }
        : p
    );

    setProfesionalesForm(profesionalesActualizados);
    setProfesionalEditando(null);
    setMostrarFormulario(false);

    // Notificar cambios al padre
    const profesionalesSinTemporal = profesionalesActualizados
      .filter(p => !p.id?.startsWith('new-'))
      .map(({ id, isEditing, errors, disponibilidad, ...prof }) => prof);

    onProfesionalesChange(profesionalesSinTemporal);
  };

  // Editar profesional
  const editarProfesional = (profesionalId: string) => {
    setProfesionalesForm(prev => prev.map(p => 
      p.id === profesionalId 
        ? { ...p, isEditing: true, errors: {} }
        : p
    ));
    setProfesionalEditando(profesionalId);
    setMostrarFormulario(true);
  };

  // Cancelar edición
  const cancelarEdicion = (profesionalId: string) => {
    const profesional = profesionalesForm.find(p => p.id === profesionalId);
    
    if (profesional?.id?.startsWith('new-')) {
      // Eliminar profesional nuevo
      setProfesionalesForm(prev => prev.filter(p => p.id !== profesionalId));
    } else {
      // Revertir cambios
      setProfesionalesForm(prev => prev.map(p => 
        p.id === profesionalId 
          ? { ...p, isEditing: false, errors: {} }
          : p
      ));
    }
    
    setProfesionalEditando(null);
    setMostrarFormulario(false);
  };

  // Eliminar profesional
  const eliminarProfesional = (profesionalId: string) => {
    const profesional = profesionalesForm.find(p => p.id === profesionalId);
    if (!profesional) return;

    if (confirm(`¿Estás seguro de que quieres eliminar a ${profesional.nombre_completo}?`)) {
      const profesionalesActualizados = profesionalesForm.filter(p => p.id !== profesionalId);
      setProfesionalesForm(profesionalesActualizados);

      const profesionalesSinTemporal = profesionalesActualizados
        .filter(p => !p.id?.startsWith('new-'))
        .map(({ id, isEditing, errors, disponibilidad, ...prof }) => prof);

      onProfesionalesChange(profesionalesSinTemporal);
    }
  };

  // Actualizar campo de profesional
  const actualizarCampo = (profesionalId: string, campo: string, valor: any) => {
    setProfesionalesForm(prev => prev.map(p => 
      p.id === profesionalId 
        ? { 
            ...p, 
            [campo]: valor,
            errors: { ...p.errors, [campo]: undefined } // Limpiar error del campo
          }
        : p
    ));

    // Verificar disponibilidad automáticamente si cambia el nombre y tiene 100%
    if (campo === 'nombre_completo' || campo === 'porcentaje_participacion') {
      setTimeout(() => {
        const profesional = profesionalesForm.find(p => p.id === profesionalId);
        if (profesional && profesional.porcentaje_participacion === 100) {
          verificarDisponibilidadProfesional({ ...profesional, [campo]: valor });
        }
      }, 500); // Debounce
    }
  };

  // Calcular estadísticas
  const totalPorcentajes = profesionalesForm.reduce((sum, p) => sum + p.porcentaje_participacion, 0);
  const profesionalesConConflictos = profesionalesForm.filter(p => 
    p.disponibilidad && !p.disponibilidad.disponible
  ).length;

  const getProfesionNombre = (profesionId: number): string => {
    const profesion = profesiones.find(p => p.id === profesionId);
    return profesion ? profesion.nombre : 'Profesión no encontrada';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Plantel Profesional</h3>
          <p className="text-sm text-gray-600">
            Asignación de profesionales responsables de la obra
          </p>
        </div>

        {!readonly && (
          <button
            type="button"
            onClick={agregarProfesional}
            className="btn-primary flex items-center gap-2"
            disabled={mostrarFormulario}
          >
            <Plus className="w-4 h-4" />
            Agregar Profesional
          </button>
        )}
      </div>

      {/* Estadísticas */}
      {profesionalesForm.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                {profesionalesForm.length} Profesional{profesionalesForm.length !== 1 ? 'es' : ''}
              </span>
            </div>
          </div>
          
          <div className={`rounded-lg p-4 ${
            totalPorcentajes > 100 ? 'bg-red-50' : 
            totalPorcentajes < 100 ? 'bg-yellow-50' : 'bg-green-50'
          }`}>
            <div className="flex items-center gap-2">
              <Percent className={`w-5 h-5 ${
                totalPorcentajes > 100 ? 'text-red-600' : 
                totalPorcentajes < 100 ? 'text-yellow-600' : 'text-green-600'
              }`} />
              <span className={`font-medium ${
                totalPorcentajes > 100 ? 'text-red-900' : 
                totalPorcentajes < 100 ? 'text-yellow-900' : 'text-green-900'
              }`}>
                {totalPorcentajes}% Total
              </span>
            </div>
          </div>

          {profesionalesConConflictos > 0 && (
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-900">
                  {profesionalesConConflictos} Conflicto{profesionalesConConflictos !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista de profesionales */}
      <div className="space-y-4">
        <AnimatePresence>
          {profesionalesForm.map((profesional) => (
            <motion.div
              key={profesional.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {profesional.isEditing ? (
                // Formulario de edición
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Profesión */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profesión *
                      </label>
                      <select
                        value={profesional.profesion_id}
                        onChange={(e) => actualizarCampo(profesional.id!, 'profesion_id', parseInt(e.target.value))}
                        className={`input-field ${profesional.errors?.profesion_id ? 'border-red-300' : ''}`}
                      >
                        <option value={0}>Seleccionar profesión</option>
                        {profesiones.map(prof => (
                          <option key={prof.id} value={prof.id}>
                            {prof.nombre} ({prof.abreviatura})
                          </option>
                        ))}
                      </select>
                      {profesional.errors?.profesion_id && (
                        <p className="text-sm text-red-600 mt-1">{profesional.errors.profesion_id}</p>
                      )}
                    </div>

                    {/* Nombre completo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={profesional.nombre_completo}
                        onChange={(e) => actualizarCampo(profesional.id!, 'nombre_completo', e.target.value)}
                        className={`input-field ${profesional.errors?.nombre_completo ? 'border-red-300' : ''}`}
                        placeholder="Nombres y apellidos completos"
                      />
                      {profesional.errors?.nombre_completo && (
                        <p className="text-sm text-red-600 mt-1">{profesional.errors.nombre_completo}</p>
                      )}
                    </div>

                    {/* Número de colegiatura */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        N° Colegiatura
                      </label>
                      <input
                        type="text"
                        value={profesional.numero_colegiatura || ''}
                        onChange={(e) => actualizarCampo(profesional.id!, 'numero_colegiatura', e.target.value)}
                        className="input-field"
                        placeholder="CIP-12345"
                      />
                    </div>

                    {/* DNI */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DNI
                      </label>
                      <input
                        type="text"
                        value={profesional.dni || ''}
                        onChange={(e) => actualizarCampo(profesional.id!, 'dni', e.target.value)}
                        className={`input-field ${profesional.errors?.dni ? 'border-red-300' : ''}`}
                        placeholder="12345678"
                        maxLength={8}
                      />
                      {profesional.errors?.dni && (
                        <p className="text-sm text-red-600 mt-1">{profesional.errors.dni}</p>
                      )}
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={profesional.telefono || ''}
                        onChange={(e) => actualizarCampo(profesional.id!, 'telefono', e.target.value)}
                        className={`input-field ${profesional.errors?.telefono ? 'border-red-300' : ''}`}
                        placeholder="987654321"
                      />
                      {profesional.errors?.telefono && (
                        <p className="text-sm text-red-600 mt-1">{profesional.errors.telefono}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profesional.email || ''}
                        onChange={(e) => actualizarCampo(profesional.id!, 'email', e.target.value)}
                        className={`input-field ${profesional.errors?.email ? 'border-red-300' : ''}`}
                        placeholder="profesional@email.com"
                      />
                      {profesional.errors?.email && (
                        <p className="text-sm text-red-600 mt-1">{profesional.errors.email}</p>
                      )}
                    </div>

                    {/* Porcentaje de participación */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Porcentaje de Participación * {loading[profesional.id!] && '(Verificando...)'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={profesional.porcentaje_participacion}
                          onChange={(e) => actualizarCampo(profesional.id!, 'porcentaje_participacion', parseFloat(e.target.value) || 0)}
                          className={`input-field pr-8 ${profesional.errors?.porcentaje_participacion ? 'border-red-300' : ''}`}
                          placeholder="100"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300">
                          %
                        </span>
                      </div>
                      {profesional.errors?.porcentaje_participacion && (
                        <p className="text-sm text-red-600 mt-1">{profesional.errors.porcentaje_participacion}</p>
                      )}
                    </div>

                    {/* Cargo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cargo
                      </label>
                      <input
                        type="text"
                        value={profesional.cargo || ''}
                        onChange={(e) => actualizarCampo(profesional.id!, 'cargo', e.target.value)}
                        className="input-field"
                        placeholder="Residente de Obra"
                      />
                    </div>
                  </div>

                  {/* Advertencia de conflictos */}
                  {profesional.disponibilidad && !profesional.disponibilidad.disponible && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-orange-900">
                            Conflicto de Disponibilidad
                          </h4>
                          <p className="text-sm text-orange-800 mt-1">
                            Este profesional ya tiene 100% de participación en las siguientes obras:
                          </p>
                          <ul className="text-sm text-orange-800 mt-2 space-y-1">
                            {profesional.disponibilidad.conflictos.map((conflicto, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full flex-shrink-0" />
                                <span>
                                  {conflicto.obra_nombre} ({conflicto.numero_contrato})
                                  - {conflicto.fecha_inicio} a {conflicto.fecha_fin_prevista}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => guardarProfesional(profesional.id!)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelarEdicion(profesional.id!)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Vista de lectura
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{profesional.nombre_completo}</h4>
                      <p className="text-sm text-gray-600">{getProfesionNombre(profesional.profesion_id)}</p>
                      {profesional.cargo && (
                        <p className="text-sm text-gray-600">{profesional.cargo}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Porcentaje */}
                      <div className="text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          {profesional.porcentaje_participacion}%
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-300">Participación</p>
                      </div>

                      {/* Estado de disponibilidad */}
                      {profesional.disponibilidad && (
                        <div className="flex items-center gap-1">
                          {profesional.disponibilidad.disponible ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                      )}

                      {/* Botones de acción */}
                      {!readonly && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => editarProfesional(profesional.id!)}
                            className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => eliminarProfesional(profesional.id!)}
                            className="p-2 text-gray-400 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    {profesional.numero_colegiatura && (
                      <div>
                        <span className="font-medium">Colegiatura:</span> {profesional.numero_colegiatura}
                      </div>
                    )}
                    {profesional.dni && (
                      <div>
                        <span className="font-medium">DNI:</span> {profesional.dni}
                      </div>
                    )}
                    {profesional.telefono && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {profesional.telefono}
                      </div>
                    )}
                    {profesional.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {profesional.email}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Estado vacío */}
      {profesionalesForm.length === 0 && !mostrarFormulario && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <User className="w-12 h-12 text-gray-400 dark:text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin profesionales asignados</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Agrega profesionales al plantel técnico de la obra
          </p>
          {!readonly && (
            <button
              type="button"
              onClick={agregarProfesional}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Agregar Primer Profesional
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantelProfesional;