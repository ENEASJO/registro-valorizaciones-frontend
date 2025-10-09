import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Users, GraduationCap, Loader2, Save, X } from 'lucide-react';
import {
  obtenerCatalogoCargos,
  obtenerPlantelPorObra,
  agregarProfesional,
  eliminarProfesional,
  type Profesional,
  type ProfesionalCreate,
} from '../../../services/plantelService';

interface PlantelProfesionalProps {
  obraId?: string;
}

const PlantelProfesional: React.FC<PlantelProfesionalProps> = ({ obraId }) => {
  const [plantel, setPlantel] = useState<Profesional[]>([]);
  const [catalogoCargos, setCatalogoCargos] = useState<Record<string, string[]>>({});
  const [cargando, setCargando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Estado del formulario
  const [formulario, setFormulario] = useState({
    nombres: '',
    apellidos: '',
    cargo_categoria: '',
    cargo_tecnico: '',
  });

  // Cargar catálogo de cargos al montar
  useEffect(() => {
    const cargarCatalogo = async () => {
      const response = await obtenerCatalogoCargos();
      if (response.status === 'success' && response.data) {
        setCatalogoCargos(response.data);
      }
    };
    cargarCatalogo();
  }, []);

  // Cargar plantel cuando hay obraId
  useEffect(() => {
    if (obraId) {
      cargarPlantel();
    }
  }, [obraId]);

  const cargarPlantel = async () => {
    if (!obraId) return;

    setCargando(true);
    try {
      const response = await obtenerPlantelPorObra(obraId);
      if (response.status === 'success' && response.data) {
        setPlantel(response.data);
      }
    } catch (error) {
      console.error('Error al cargar plantel:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCategoriaChange = (categoria: string) => {
    setFormulario({
      ...formulario,
      cargo_categoria: categoria,
      cargo_tecnico: '', // Resetear cargo técnico al cambiar categoría
    });
  };

  const handleAgregarProfesional = async () => {
    if (!obraId) {
      alert('Debe guardar la obra primero antes de agregar profesionales');
      return;
    }

    if (!formulario.nombres || !formulario.apellidos || !formulario.cargo_categoria || !formulario.cargo_tecnico) {
      alert('Todos los campos son obligatorios');
      return;
    }

    setGuardando(true);
    try {
      const profesionalData: ProfesionalCreate = {
        obra_id: obraId,
        nombres: formulario.nombres,
        apellidos: formulario.apellidos,
        cargo_categoria: formulario.cargo_categoria,
        cargo_tecnico: formulario.cargo_tecnico,
      };

      const response = await agregarProfesional(profesionalData);

      if (response.status === 'success' && response.data) {
        setPlantel([...plantel, response.data]);
        setFormulario({
          nombres: '',
          apellidos: '',
          cargo_categoria: '',
          cargo_tecnico: '',
        });
        setMostrarFormulario(false);
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error al agregar profesional:', error);
      alert('Error al agregar profesional');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarProfesional = async (profesionalId: string) => {
    if (!confirm('¿Está seguro de eliminar este profesional del plantel?')) {
      return;
    }

    try {
      const response = await eliminarProfesional(profesionalId);
      if (response.status === 'success') {
        setPlantel(plantel.filter((p) => p.id !== profesionalId));
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error al eliminar profesional:', error);
      alert('Error al eliminar profesional');
    }
  };

  const cargosDisponibles = formulario.cargo_categoria
    ? catalogoCargos[formulario.cargo_categoria] || []
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Plantel Profesional</h3>
            <p className="text-sm text-gray-500">
              {obraId ? 'Registre el equipo técnico de la obra' : 'Guarde la obra primero para agregar profesionales'}
            </p>
          </div>
        </div>

        {obraId && (
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {mostrarFormulario ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {mostrarFormulario ? 'Cancelar' : 'Agregar Profesional'}
          </button>
        )}
      </div>

      {/* Formulario para agregar profesional */}
      <AnimatePresence>
        {mostrarFormulario && obraId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-blue-800 mb-4">
              <GraduationCap className="w-5 h-5" />
              <h4 className="font-semibold">Nuevo Profesional</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombres *</label>
                <input
                  type="text"
                  value={formulario.nombres}
                  onChange={(e) => setFormulario({ ...formulario, nombres: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombres del profesional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                <input
                  type="text"
                  value={formulario.apellidos}
                  onChange={(e) => setFormulario({ ...formulario, apellidos: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Apellidos del profesional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                <select
                  value={formulario.cargo_categoria}
                  onChange={(e) => handleCategoriaChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione categoría...</option>
                  {Object.keys(catalogoCargos).map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cargo Técnico *</label>
                <select
                  value={formulario.cargo_tecnico}
                  onChange={(e) => setFormulario({ ...formulario, cargo_tecnico: e.target.value })}
                  disabled={!formulario.cargo_categoria}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Seleccione cargo...</option>
                  {cargosDisponibles.map((cargo) => (
                    <option key={cargo} value={cargo}>
                      {cargo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMostrarFormulario(false)}
                disabled={guardando}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAgregarProfesional}
                disabled={guardando}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {guardando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {guardando ? 'Guardando...' : 'Guardar Profesional'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de profesionales */}
      <div className="space-y-3">
        {cargando ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Cargando plantel...</span>
          </div>
        ) : plantel.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No hay profesionales registrados en el plantel</p>
            {obraId && (
              <p className="text-sm text-gray-500 mt-1">Haga clic en "Agregar Profesional" para comenzar</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {plantel.map((profesional) => (
              <motion.div
                key={profesional.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {profesional.nombres} {profesional.apellidos}
                      </h4>
                    </div>
                    <p className="text-sm text-blue-600 font-medium">{profesional.cargo_tecnico}</p>
                    <p className="text-xs text-gray-500 mt-1">{profesional.cargo_categoria}</p>
                  </div>

                  <button
                    onClick={() => handleEliminarProfesional(profesional.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar profesional"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen */}
      {plantel.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Users className="w-5 h-5" />
            <span className="font-medium">
              Total: {plantel.length} {plantel.length === 1 ? 'profesional' : 'profesionales'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantelProfesional;
