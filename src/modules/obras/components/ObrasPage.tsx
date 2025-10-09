import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Obra } from '../types';
import ListaObras from './ListaObras';
import FormularioObra from './FormularioObra';
import DetalleObra from './DetalleObra';
import { obrasService } from '../services/obrasService';

type Vista = 'lista' | 'formulario' | 'detalle';

const ObrasPage = () => {
  const [vista, setVista] = useState<Vista>('lista');
  const [obraSeleccionada, setObraSeleccionada] = useState<Obra | undefined>();
  const [guardando, setGuardando] = useState(false);

  const handleNuevaObra = () => {
    setObraSeleccionada(undefined);
    setVista('formulario');
  };

  const handleEditarObra = (obra: Obra) => {
    setObraSeleccionada(obra);
    setVista('formulario');
  };

  const handleVerObra = (obra: Obra) => {
    setObraSeleccionada(obra);
    setVista('detalle');
  };

  const handleGuardarObra = async (formulario: any) => {
    try {
      setGuardando(true);

      if (obraSeleccionada?.id) {
        // Actualizar obra existente
        await obrasService.actualizarObra(obraSeleccionada.id, formulario);
      } else {
        // Crear nueva obra
        await obrasService.crearObra(formulario);
      }

      setVista('lista');
      setObraSeleccionada(undefined);
    } catch (error: any) {
      console.error('Error guardando obra:', error);
      // Mostrar el error al usuario
      alert(`Error al guardar la obra: ${error.message || 'Error desconocido. Por favor, revise los datos ingresados.'}`);
      // No lanzar el error nuevamente para que el modal permanezca abierto
    } finally {
      setGuardando(false);
    }
  };

  const handleActualizarMEF = async () => {
    if (!obraSeleccionada?.id) return;

    try {
      setGuardando(true);
      const response = await obrasService.actualizarDatosMEF(obraSeleccionada.id);

      if (response.success && response.data) {
        setObraSeleccionada(response.data);
      }
    } catch (error) {
      console.error('Error actualizando datos MEF:', error);
    } finally {
      setGuardando(false);
    }
  };

  const handleCerrarFormulario = () => {
    setVista('lista');
    setObraSeleccionada(undefined);
  };

  const handleCerrarDetalle = () => {
    setVista('lista');
    setObraSeleccionada(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Obras Públicas</h1>
          <p className="mt-2 text-gray-600">
            Gestión de obras con integración completa de MEF Invierte
          </p>
        </motion.div>

        {vista === 'lista' && (
          <ListaObras
            onNuevaObra={handleNuevaObra}
            onEditarObra={handleEditarObra}
            onVerObra={handleVerObra}
          />
        )}

        <FormularioObra
          isOpen={vista === 'formulario'}
          onClose={handleCerrarFormulario}
          onSubmit={handleGuardarObra}
          obra={obraSeleccionada}
          loading={guardando}
          title={obraSeleccionada ? 'Editar Obra' : 'Nueva Obra'}
        />

        {vista === 'detalle' && obraSeleccionada && (
          <DetalleObra
            obra={obraSeleccionada}
            isOpen={true}
            onClose={handleCerrarDetalle}
            onEditar={() => {
              setVista('formulario');
            }}
            onActualizarMEF={handleActualizarMEF}
          />
        )}
      </div>
    </div>
  );
};

export default ObrasPage;
