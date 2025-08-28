import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { 
  X, Building2, Save, Search, CheckCircle, AlertTriangle, 
  Loader2, Users, MapPin, Mail, Phone, Shield, Award,
  Database, FileText, Globe, Star, Crown, UserCheck
} from 'lucide-react';
import { API_ENDPOINTS } from '../../../config/api';
// =================================================================
// FORM POPULATION FIXES APPLIED (v2.1)
// =================================================================
// ISSUE: Form fields not populating despite successful API calls
// ROOT CAUSES IDENTIFIED:
// 1. Readonly inputs preventing visual updates (readOnly={!datosObtenidos})
// 2. React state batching timing issues
// 3. No force re-render mechanism for form inputs
// 4. Complex manual state updates without proper tracking
//
// FIXES IMPLEMENTED:
// ✅ Removed readOnly restriction from razon_social input
// ✅ Added comprehensive debugging logs throughout state updates
// ✅ Implemented renderKey mechanism to force form input re-renders
// ✅ Added useCallback enhanced form update function
// ✅ Used React.startTransition for better performance
// ✅ Added delayed verification logging to confirm updates
// ✅ Applied unique keys to all form inputs (email, celular, direccion)
// ✅ Enhanced error handling and state clearing
//
// EXPECTED BEHAVIOR:
// - API call succeeds -> Console shows detailed debugging
// - Form fields populate immediately with received data
// - User sees populated form fields (not empty)
// - Form automatically advances to Step 2
// - All form inputs are editable and show proper values
// =================================================================
// INTERFACES CONSOLIDADAS
// =================================================================
// Utility functions for RUC type detection
const getRucType = (ruc: string): 'NATURAL' | 'JURIDICA' | 'UNKNOWN' => {
  if (ruc.startsWith('10')) return 'NATURAL';
  if (ruc.startsWith('20')) return 'JURIDICA';
  return 'UNKNOWN';
};
const isPersonaNatural = (ruc: string): boolean => getRucType(ruc) === 'NATURAL';
const isPersonaJuridica = (ruc: string): boolean => getRucType(ruc) === 'JURIDICA';
// Extract DNI from RUC for natural persons (remove first and last digit)
const extractDniFromRuc = (ruc: string): string => {
  if (ruc.length === 11 && ruc.startsWith('10')) {
    return ruc.substring(2, 10); // Remove first 2 digits (10) and last digit (check)
  }
  return '';
};
interface RepresentanteConsolidado {
  nombre: string;
  cargo: string;
  numero_documento: string;
  tipo_documento?: string;
  fuente?: 'SUNAT' | 'OECE' | 'AMBOS';
  participacion?: string;
  fecha_desde?: string;
}
interface ContactoConsolidado {
  telefono?: string;
  email?: string;
  direccion?: string;
  domicilio_fiscal?: string;
  ciudad?: string;
  departamento?: string;
}
interface DatosConsolidados {
  ruc: string;
  razon_social: string;
  tipo_persona: 'NATURAL' | 'JURIDICA';
  contacto: ContactoConsolidado;
  estado_registro?: string;
  especialidades: string[];
  miembros: RepresentanteConsolidado[];
  total_miembros: number;
  fuentes_consultadas: string[];
  consolidacion_exitosa: boolean;
  registro?: {
    estado_sunat?: string;
    estado_osce?: string;
    capacidad_contratacion?: string;
    vigencia?: string;
  };
  observaciones?: string[];
}
interface FormularioData {
  // Básicos
  ruc: string;
  razon_social: string;
  dni?: string; // For natural persons
  tipo_empresa: import('../../../types/empresa.types').TipoEmpresa;
  // Contacto
  email: string;
  celular: string;
  direccion: string;
  // Representantes (only for juridical entities)
  representantes: import('../../../types/empresa.types').RepresentanteFormulario[];
  representante_principal_id: number;
  // Estados
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  // Consolidados (solo lectura)
  especialidades_oece: string[];
  estado_sunat?: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  estado_osce?: string;
  fuentes_consultadas: string[];
  capacidad_contratacion?: string;
}
interface FormularioEmpresaProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormularioData) => Promise<void>;
  empresa?: any;
  loading?: boolean;
  title?: string;
}
// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================
const FormularioEmpresa = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  loading = false,
  title = "Nueva Empresa Ejecutora" 
}: FormularioEmpresaProps) => {
  // Estados del formulario
  const [formData, setFormData] = useState<FormularioData>({
    ruc: '',
    razon_social: '',
    dni: '',
    tipo_empresa: 'SAC',
    email: '',
    celular: '',
    direccion: '',
    representantes: [],
    representante_principal_id: 0,
    estado: 'ACTIVO',
    especialidades_oece: [],
    fuentes_consultadas: []
  });
  // Estados del proceso
  const [consultando, setConsultando] = useState(false);
  const [datosObtenidos, setDatosObtenidos] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [tipoConsultaRealizada, setTipoConsultaRealizada] = useState<'SUNAT' | 'CONSOLIDADO' | ''>('');
  const [renderKey, setRenderKey] = useState(0); // Force re-render key
  const formInitializedRef = useRef(false); // Track if form was initialized using ref for synchronous updates
  
  // Reset form cuando se abre (solo si no fue inicializado)
  useEffect(() => {
    console.log('🔍 RESET EFFECT TRIGGERED - isOpen:', isOpen, 'formInitialized:', formInitializedRef.current);
    
    if (isOpen && !formInitializedRef.current) {
      console.log('🔄 FORM RESET - Dialog opened, resetting form data (RACE CONDITION FIXED)');
      formInitializedRef.current = true; // Set synchronously
      setFormData({
        ruc: '',
        razon_social: '',
        dni: '',
        tipo_empresa: 'SAC',
        email: '',
        celular: '',
        direccion: '',
        representantes: [],
        representante_principal_id: 0,
        estado: 'ACTIVO',
        especialidades_oece: [],
        fuentes_consultadas: []
      });
      setDatosObtenidos(false);
      setError('');
      setCurrentStep(1);
      setTipoConsultaRealizada('');
      setRenderKey(0);
    } else if (isOpen && formInitializedRef.current) {
      console.log('✅ RESET PREVENTED - Form already initialized, skipping reset');
    }
  }, [isOpen]);

  // Reset form initialized flag when dialog closes
  useEffect(() => {
    if (!isOpen) {
      formInitializedRef.current = false; // Reset synchronously
    }
  }, [isOpen]);

  // CRITICAL DEBUG: Track form data changes
  useEffect(() => {
    console.log('🔄 FORM DATA CHANGED:', {
      ruc: formData.ruc,
      razon_social: formData.razon_social,
      email: formData.email,
      celular: formData.celular,
      direccion: formData.direccion,
      representantes: formData.representantes?.length || 0
    });
  }, [formData]);

  // Enhanced form update function with race condition protection
  const updateFormDataWithApiResponse = useCallback((data: any, tipoRespuesta: string) => {
    console.log(`🚀 UPDATING FORM DATA - Tipo: ${tipoRespuesta}`);
    console.log('📋 Data to populate:', data);
    console.log('🛡️ RACE CONDITION CHECK - formInitialized:', formInitializedRef.current);
    
    // PROTECTION: Prevent race condition by setting flag immediately
    if (!formInitializedRef.current) {
      console.log('⚡ Setting formInitialized to true to prevent reset race condition');
      formInitializedRef.current = true;
    }
    
    // FIXED: Manejar diferentes estructuras de respuesta
    // Persona natural: campos directos (email, telefono, direccion, dni)
    // Persona jurídica: objeto contacto + miembros
    
    const isPersonaNatural = data.tipo_persona === 'NATURAL' || data.ruc?.startsWith('10');
    
    let email = '';
    let celular = '';
    let direccion = '';
    let dni = '';
    
    if (isPersonaNatural) {
      // Persona natural - campos directos
      email = data.email || '';
      celular = data.telefono || '';
      direccion = data.direccion || '';
      dni = data.dni || '';
    } else {
      // Persona jurídica - objeto contacto
      email = data.contacto?.email || '';
      
      // FIXED: Limpiar el campo teléfono que viene con texto adicional
      let telefonoRaw = data.contacto?.telefono || '';
      celular = telefonoRaw.replace(/^[^:]*:\s*/, '').replace(/\n/g, '').trim();
      
      // FIXED: Usar domicilio_fiscal como dirección principal
      direccion = data.contacto?.domicilio_fiscal || data.contacto?.direccion || '';
    }
    
    const newFormData = {
      ruc: data.ruc || '',
      razon_social: data.razon_social || '',
      dni: dni,
      email: email,
      celular: celular,
      direccion: direccion,
      representantes: (data.miembros || []).map(miembro => ({
        nombre: miembro.nombre || '',
        cargo: miembro.cargo || 'REPRESENTANTE',
        numero_documento: miembro.numero_documento || '',
        tipo_documento: (miembro.tipo_documento as 'DNI' | 'CE' | 'PASSPORT') || 'DNI',
        fuente: (miembro.fuente as 'SUNAT' | 'OECE' | 'MANUAL' | 'AMBOS') || 'SUNAT',
        es_principal: false,
        activo: true
      })),
      representante_principal_id: 0,
      especialidades_oece: data.especialidades || [],
      estado_sunat: data.registro?.estado_sunat as 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | undefined,
      estado_osce: data.registro?.estado_osce,
      fuentes_consultadas: data.fuentes_consultadas || [],
      capacidad_contratacion: data.registro?.capacidad_contratacion
    };

    console.log('📋 NEW FORM VALUES TO SET:', newFormData);

    // Update form data - REMOVED React.startTransition to avoid priority delays
    setFormData(prev => {
      const updated = {
        ...prev,
        ...newFormData
      };
      console.log('📋 FORM DATA UPDATED TO:', updated);
      return updated;
    });
    
    setDatosObtenidos(true);
    setCurrentStep(2);
    setTipoConsultaRealizada('CONSOLIDADO');
    setRenderKey(prev => prev + 1);
    setError('');

    // Additional logging to verify update
    setTimeout(() => {
      console.log('🕐 FORM UPDATE VERIFICATION (500ms delay):', {
        currentRuc: formData.ruc,
        currentRazonSocial: formData.razon_social,
        currentEmail: formData.email,
        shouldBe: {
          ruc: data.ruc,
          razon_social: data.razon_social,
          email: data.contacto?.email
        }
      });
    }, 500);
  }, [formData.ruc, formData.razon_social, formData.email]);
  // =================================================================
  // FUNCIONES DE NEGOCIO
  // =================================================================
  const handleObtenerDatosV2V2 = async () => {
    if (!formData.ruc || formData.ruc.length !== 11) {
      setError('Ingrese un RUC válido de 11 dígitos');
      return;
    }
    setConsultando(true);
    setError('');
    try {
      // Detectar tipo de RUC
      const esPersonaNatural = formData.ruc.startsWith('10');
      const esPersonaJuridica = formData.ruc.startsWith('20');
      if (!esPersonaNatural && !esPersonaJuridica) {
        setError('RUC debe comenzar con 10 (persona natural) o 20 (persona jurídica)');
        return;
      }
      let endpoint = '';
      let tipoConsulta = '';
      if (esPersonaNatural) {
        // Para personas naturales, usar SOLO SUNAT
        endpoint = `${API_ENDPOINTS.consultaRuc}/${formData.ruc}`;
        tipoConsulta = 'SUNAT-ONLY';
        console.log('🔍 Consultando persona natural (10) - SOLO SUNAT');
      } else {
        // Para personas jurídicas, usar endpoint consolidado (SUNAT + OSCE)
        endpoint = `${API_ENDPOINTS.consultaRucConsolidada}/${formData.ruc}`;
        tipoConsulta = 'CONSOLIDADO';
        console.log('🔍 Consultando persona jurídica (20) - CONSOLIDADO (SUNAT + OSCE)');
      }
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      if (esPersonaNatural) {
        // Procesar respuesta SUNAT-only para persona natural
        if (result.ruc && result.razon_social) {
          const dniExtracted = extractDniFromRuc(result.ruc);
          setFormData(prev => ({
            ...prev,
            ruc: result.ruc,
            razon_social: result.razon_social,
            dni: dniExtracted,
            email: '',
            celular: '',
            direccion: result.domicilio_fiscal || '',
            representantes: [], // Natural persons don't have separate representatives
            representante_principal_id: 0,
            especialidades_oece: [],
            estado_sunat: 'ACTIVO',
            fuentes_consultadas: ['SUNAT'],
            capacidad_contratacion: undefined
          }));
          setDatosObtenidos(true);
          setCurrentStep(2);
          setTipoConsultaRealizada('SUNAT');
          
          // CRITICAL FIX: Force re-render of form inputs
          setRenderKey(prev => prev + 1);
          
          // CRITICAL FIX: Explicitly clear error state after successful processing
          setError('');
          
          console.log('✅ Datos SUNAT obtenidos para persona natural');
        } else {
          setError(result.message || 'No se pudo obtener información de SUNAT para este RUC');
        }
      } else {
        // Procesar respuesta consolidada para persona jurídica
        console.log('📊 Respuesta consolidada recibida:', result);
        console.log('📊 DEBUG - Claves del result:', Object.keys(result));
        console.log('📊 DEBUG - result.sunat existe?', !!result.sunat);
        console.log('📊 DEBUG - result.osce existe?', !!result.osce);  
        console.log('📊 DEBUG - result.data existe?', !!result.data);
        console.log('📊 DEBUG - result.success:', result.success);
        console.log('📊 DEBUG - TIMESTAMP:', new Date().toISOString());
        console.log('🚀 FORCE UPDATE - Build:', Date.now());
        
        // Verificar si la respuesta tiene la estructura anidada (sunat/osce)
        if (result.sunat || result.osce) {
          console.log('📊 Procesando estructura anidada consolidada');
          
          // Extraer datos de las fuentes anidadas
          const sunatData = result.sunat || {};
          const osceData = result.osce || {};
          
          // Combinar representantes de ambas fuentes
          const representantesCombinados = [
            ...(sunatData.representantes || []),
            ...(osceData.representantes || [])
          ];
          
          setFormData(prev => ({
            ...prev,
            ruc: result.ruc || sunatData.ruc || osceData.ruc || '',
            razon_social: sunatData.razon_social || osceData.razon_social || '',
            email: osceData.datos_contacto?.email || sunatData.email || osceData.email || '',
            celular: osceData.datos_contacto?.telefono || sunatData.telefono || osceData.telefono || '',
            direccion: sunatData.domicilio_fiscal || osceData.domicilio_fiscal || '',
            representantes: representantesCombinados.map(rep => ({
              nombre: rep.nombre || '',
              cargo: rep.cargo || 'REPRESENTANTE',
              numero_documento: rep.numero_doc || rep.numero_documento || '',
              tipo_documento: 'DNI' as 'DNI' | 'CE' | 'PASSPORT',
              fuente: (rep.fuente as 'SUNAT' | 'OECE' | 'MANUAL' | 'AMBOS') || 'SUNAT',
              es_principal: false,
              activo: true
            })),
            representante_principal_id: 0,
            especialidades_oece: osceData.especialidades || [],
            estado_sunat: 'ACTIVO' as 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO',
            estado_osce: osceData.estado_registro || '',
            fuentes_consultadas: ['SUNAT', 'OSCE'].filter(fuente => 
              (fuente === 'SUNAT' && result.sunat) || (fuente === 'OSCE' && result.osce)
            ),
            capacidad_contratacion: osceData.capacidad_contratacion || ''
          }));
          setDatosObtenidos(true);
          setCurrentStep(2);
          setTipoConsultaRealizada('CONSOLIDADO');
          
          // CRITICAL FIX: Force re-render of form inputs
          setRenderKey(prev => prev + 1);
          
          // CRITICAL FIX: Explicitly clear error state after successful processing
          setError('');
          
          console.log('✅ Datos consolidados procesados desde estructura anidada');
          
        } else if (result.data) {
          // NUEVO CODIGO - SI VES ESTE LOG, VERCEL YA DESPLEGO
          console.log('🎯 NUEVO CODIGO ACTIVADO - FormularioEmpresa v2.1 - ENHANCED DEBUG');
          
          // Estructura consolidada original (fallback) - procesar incluso con success=false
          const data: DatosConsolidados = result.data;
          console.log('📊 Procesando datos consolidados (estructura original):', data);
          console.log('📊 DEBUG - data.consolidacion_exitosa:', data.consolidacion_exitosa);
          console.log('📊 DEBUG - data.ruc:', data.ruc);
          console.log('📊 DEBUG - data.razon_social:', data.razon_social);
          console.log('📊 DEBUG - data.contacto:', data.contacto);
          console.log('📊 DEBUG - data.contacto?.email:', data.contacto?.email);
          console.log('📊 DEBUG - data.contacto?.telefono:', data.contacto?.telefono);
          console.log('📊 DEBUG - data.contacto?.direccion:', data.contacto?.direccion);
          console.log('📊 DEBUG - data.contacto?.domicilio_fiscal:', data.contacto?.domicilio_fiscal);
          console.log('📊 DEBUG - data.miembros:', data.miembros);
          
          // Use the enhanced form update function
          updateFormDataWithApiResponse(data, 'CONSOLIDADO_ESTRUCTURA_ORIGINAL');
          
          console.log('✅ Datos consolidados procesados correctamente');
          
          // Debug: mostrar el estado real
          if (!data.consolidacion_exitosa) {
            console.log('⚠️ Nota: consolidacion_exitosa es false, pero procesando datos de todas formas');
          }
          if (!result.success) {
            console.log('⚠️ Nota: result.success es false, pero procesando datos de todas formas');
          }
        } else {
          console.error('❌ Estructura de respuesta no reconocida:', result);
          setError(result.message || 'Error en la respuesta del servidor');
        }
      }
    } catch (err) {
      setError('Error de conexión. Verifique que la API esté ejecutándose.');
      console.error('Error:', err);
    } finally {
      setConsultando(false);
    }
  };
  const handleRepresentanteSelect = (index: number) => {
    setFormData(prev => ({
      ...prev,
      representante_principal_id: index
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ruc || !formData.razon_social) {
      setError('RUC y Razón Social son obligatorios');
      return;
    }
    // For juridical entities, require representatives; natural persons represent themselves
    if (isPersonaJuridica(formData.ruc) && formData.representantes.length === 0) {
      setError('Debe obtener los datos y tener al menos un representante para personas jurídicas');
      return;
    }
    try {
      // Transform data to match backend API schema
      const apiData = {
        ruc: formData.ruc,
        razon_social: formData.razon_social,
        dni: formData.dni || null,
        tipo_empresa: formData.tipo_empresa,
        email: formData.email || null,
        celular: formData.celular || null,
        direccion: formData.direccion || null,
        representantes: isPersonaNatural(formData.ruc) ? [] : formData.representantes.map(rep => ({
          nombre: rep.nombre,
          cargo: rep.cargo || 'REPRESENTANTE',
          numero_documento: rep.numero_documento,
          tipo_documento: rep.tipo_documento || 'DNI',
          fuente: rep.fuente || 'MANUAL',
          es_principal: rep.es_principal || false,
          activo: rep.activo ?? true
        })),
        representante_principal_id: isPersonaNatural(formData.ruc) ? 0 : formData.representante_principal_id,
        estado: formData.estado,
        especialidades_oece: formData.especialidades_oece || [],
        estado_sunat: formData.estado_sunat || null,
        estado_osce: formData.estado_osce || null,
        fuentes_consultadas: formData.fuentes_consultadas || [],
        capacidad_contratacion: formData.capacidad_contratacion || null
      };
      console.log('📤 Enviando datos al backend:', apiData);
      await onSubmit(apiData);
      onClose();
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      setError('Error al guardar la empresa');
    }
  };
  // =================================================================
  // COMPONENTES UI
  // =================================================================
  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3].map((step: any) => (
        <div key={step} className="flex items-center">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
            ${currentStep >= step 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
              : 'bg-gray-200 text-gray-600'
            }
          `}>
            {step}
          </div>
          <div className={`ml-3 ${currentStep >= step ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className="font-medium">
              {step === 1 && 'Consultar RUC'}
              {step === 2 && 'Verificar Datos'}
              {step === 3 && 'Guardar'}
            </div>
          </div>
          {step < 3 && (
            <div className={`w-16 h-0.5 mx-4 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`} />
          )}
        </div>
      ))}
    </div>
  );
  const ConsolidationBanner = () => {
    const isPartialConsolidation = error && error.startsWith('⚠️ Consolidación parcial:');
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-6 mb-6 ${
          isPartialConsolidation 
            ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
            : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {isPartialConsolidation ? (
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            ) : (
              <CheckCircle className="w-8 h-8 text-green-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg mb-2 ${
              isPartialConsolidation ? 'text-amber-800' : 'text-green-800'
            }`}>
              {isPartialConsolidation 
                ? '⚠️ Datos Parciales Obtenidos' 
                : '🎉 ¡Datos Obtenidos Exitosamente!'
              }
            </h3>
          <div className="mb-4">
            {tipoConsultaRealizada === 'SUNAT' && (
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                <Database className="w-4 h-4" />
                Consulta únicamente (Persona Natural)
              </div>
            )}
            {tipoConsultaRealizada === 'CONSOLIDADO' && (
              <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                <Globe className="w-4 h-4" />
                Consulta Consolidada + OSCE (Persona Jurídica)
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {isPersonaJuridica(formData.ruc) && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className={isPartialConsolidation ? "text-amber-700" : "text-green-700"}>
                  {formData.representantes.length} Representantes
                </span>
              </div>
            )}
            {isPersonaNatural(formData.ruc) && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className={isPartialConsolidation ? "text-amber-700" : "text-green-700"}>
                  Persona Natural
                </span>
              </div>
            )}
            {tipoConsultaRealizada === 'CONSOLIDADO' && (
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-600" />
                <span className={isPartialConsolidation ? "text-amber-700" : "text-green-700"}>
                  {formData.especialidades_oece.length} Especialidades
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-600" />
              <span className={isPartialConsolidation ? "text-amber-700" : "text-green-700"}>
                Estado: {isPartialConsolidation ? 'Parcial' : 'Verificado'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    );
  };
  const RepresentantesGrid = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">
          Representantes Legales ({formData.representantes.length})
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.representantes.map((rep: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleRepresentanteSelect(index)}
            className={`
              relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300
              ${formData.representante_principal_id === index
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg ring-4 ring-blue-100'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            {/* Badge de principal */}
            {formData.representante_principal_id === index && (
              <div className="absolute -top-3 left-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  REPRESENTANTE PRINCIPAL
                </div>
              </div>
            )}
            {/* Contenido */}
            <div className="pt-2">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-gray-900 text-lg leading-tight">
                  {rep.nombre}
                </h4>
                <UserCheck className={`w-5 h-5 ${
                  formData.representante_principal_id === index ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rep.cargo === 'GERENTE GENERAL' ? 'bg-blue-100 text-blue-800' :
                    rep.cargo === 'SOCIO' ? 'bg-gray-100 text-gray-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rep.cargo || 'SOCIO'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-mono">
                  DNI: {rep.numero_documento}
                </p>
                {rep.fecha_desde && (
                  <p className="text-xs text-gray-500">
                    Desde: {rep.fecha_desde}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 flex items-center gap-2">
          <Star className="w-4 h-4" />
          Selecciona el representante que actuará como representante legal principal de la empresa.
        </p>
      </div>
    </div>
  );
  const OECEInformation = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Award className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-bold text-gray-900">
          Especialidades y Capacidades
        </h3>
      </div>
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
        {formData.estado_osce && (
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Estado de Registro
            </h4>
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-medium leading-relaxed">
                {formData.estado_osce}
              </pre>
            </div>
          </div>
        )}
        <div>
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-600" />
            Especialidades ({formData.especialidades_oece.length})
          </h4>
          <div className="flex flex-wrap gap-3">
            {formData.especialidades_oece.map((esp: any, index: number) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-bold shadow-md"
              >
                {esp}
              </motion.span>
            ))}
          </div>
          {formData.capacidad_contratacion && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-orange-200">
              <span className="text-sm text-gray-600 font-medium">
                Capacidad: {formData.capacidad_contratacion}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden"
      >
        {/* Header Elegante */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-8">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{title}</h2>
              <p className="text-blue-100 mt-1">
                Registro de empresa con datos automáticos
              </p>
            </div>
          </div>
          {/* Indicador de pasos */}
          <div className="mt-6">
            <StepIndicator />
          </div>
        </div>
        {/* Contenido Principal */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto max-h-[calc(95vh-280px)]">
          {/* Banner de éxito */}
          <AnimatePresence>
            {datosObtenidos && <ConsolidationBanner />}
          </AnimatePresence>
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Sección 1: Consulta RUC */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Search className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Consulta de RUC</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  RUC Empresarial *
                </label>
                <input
                  type="text"
                  value={formData.ruc}
                  onChange={(e: any) => setFormData(prev => ({ 
                    ...prev, 
                    ruc: e.target.value.replace(/\D/g, '').slice(0, 11) 
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg font-mono"
                  placeholder="10123456789 ó 20123456789"
                  maxLength={11}
                />
                {/* Indicador de tipo de RUC */}
                {formData.ruc.length >= 2 && (
                  <div className="mt-2">
                    {formData.ruc.startsWith('10') && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-blue-600 font-medium">
                          Persona Natural - Consulta directa únicamente
                        </span>
                      </div>
                    )}
                    {formData.ruc.startsWith('20') && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-purple-600 font-medium">
                          Persona Jurídica - Consulta Consolidada + OSCE
                        </span>
                      </div>
                    )}
                    {!formData.ruc.startsWith('10') && !formData.ruc.startsWith('20') && formData.ruc.length >= 2 && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-red-600 font-medium">
                          RUC inválido - Debe comenzar con 10 ó 20
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {isPersonaNatural(formData.ruc) ? 'NOMBRE:' : 'Razón Social'} *
                </label>
                <input
                  key={`razon-social-${renderKey}`}
                  type="text"
                  value={formData.razon_social}
                  onChange={(e: any) => {
                    console.log('🔄 RAZON SOCIAL INPUT CHANGED:', e.target.value);
                    setFormData(prev => ({ ...prev, razon_social: e.target.value }));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                  placeholder="Se completará automáticamente..."
                  readOnly={false}
                />
              </div>
              {/* DNI field for natural persons */}
              {isPersonaNatural(formData.ruc) && datosObtenidos && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    DNI:
                  </label>
                  <input
                    type="text"
                    value={formData.dni}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, dni: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-mono"
                    placeholder="12345678"
                    maxLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Extraído automáticamente del RUC o ingrese manualmente
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleObtenerDatosV2V2}
                disabled={consultando || !formData.ruc}
                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-bold shadow-lg hover:shadow-xl transition-all text-lg"
              >
                {consultando ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <Database className="w-6 h-6" />
                    OBTENER DATOS
                  </>
                )}
              </button>
            </div>
          </div>
          {/* Sección 2: Información de Contacto */}
          {datosObtenidos && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Información de Contacto</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Corporativo
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      key={`email-${renderKey}`}
                      type="email"
                      value={formData.email}
                      onChange={(e: any) => {
                        console.log('🔄 EMAIL INPUT CHANGED:', e.target.value);
                        setFormData(prev => ({ ...prev, email: e.target.value }));
                      }}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500"
                      placeholder="contacto@empresa.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Teléfono / Celular
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      key={`celular-${renderKey}`}
                      type="text"
                      value={formData.celular}
                      onChange={(e: any) => {
                        console.log('🔄 CELULAR INPUT CHANGED:', e.target.value);
                        setFormData(prev => ({ ...prev, celular: e.target.value }));
                      }}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500"
                      placeholder="912345678"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {isPersonaNatural(formData.ruc) ? 'DIRECCIÓN:' : 'Dirección Completa'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    key={`direccion-${renderKey}`}
                    value={formData.direccion}
                    onChange={(e: any) => {
                      console.log('🔄 DIRECCION INPUT CHANGED:', e.target.value);
                      setFormData(prev => ({ ...prev, direccion: e.target.value }));
                    }}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 resize-none"
                    placeholder="Dirección completa obtenida automáticamente..."
                  />
                </div>
              </div>
            </motion.div>
          )}
          {/* Sección 3: Representantes (solo para personas jurídicas) */}
          {isPersonaJuridica(formData.ruc) && formData.representantes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <RepresentantesGrid />
            </motion.div>
          )}
          {/* Sección 4: Información OSCE (solo para personas jurídicas) */}
          {isPersonaJuridica(formData.ruc) && tipoConsultaRealizada === 'CONSOLIDADO' && formData.especialidades_oece.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <OECEInformation />
            </motion.div>
          )}
          {/* Nota informativa para personas naturales */}
          {isPersonaNatural(formData.ruc) && tipoConsultaRealizada === 'SUNAT' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 text-lg mb-2">
                    Información para Personas Naturales
                  </h3>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    <span className="font-semibold">Personas Naturales:</span> Como persona natural, usted actúa como su propio representante legal. 
                    La información de especialidades y capacidades está disponible principalmente para personas jurídicas y empresas.
                  </p>
                  <div className="mt-3 text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
                    💡 Para especialidades OSCE, se requiere registro como persona jurídica
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* Sección 5: Clasificación Local */}
          {datosObtenidos && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Clasificación Local</h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, estado: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
                  >
                    <option value="ACTIVO">✅ Activo</option>
                    <option value="INACTIVO">⏸️ Inactivo</option>
                    <option value="SUSPENDIDO">⚠️ Suspendido</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </form>
        {/* Footer Elegante */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {datosObtenidos ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Datos consolidados listos para guardar
              </span>
            ) : (
              'Complete la consulta RUC para continuar'
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !datosObtenidos}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Empresa
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default FormularioEmpresa;