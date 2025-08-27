// =================================================================
// SECCIÓN DE INFORMACIÓN DE CONTACTO
// Sistema de Valorizaciones - Frontend
// =================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Building, AlertCircle, CheckCircle } from 'lucide-react';
import type { ContactoConsolidado, ErrorValidacion, EstadoSeccionFormulario } from '../../../../types/empresa.types';

// =================================================================
// INTERFACES
// =================================================================

interface ContactInfoSectionProps {
  // Datos del formulario
  email?: string;
  telefono?: string;
  celular?: string;
  direccion?: string;
  domicilio_fiscal?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  
  // Datos consolidados (solo lectura/referencia)
  datosConsolidados?: ContactoConsolidado;
  
  // Estado de la sección
  estado: EstadoSeccionFormulario;
  
  // Errores
  errores: ErrorValidacion[];
  
  // Handlers
  onChange: (field: string, value: string) => void;
  onBlur?: (field: string) => void;
  
  // Configuración
  readonly?: boolean;
  expandido?: boolean;
  mostrarFuentesDatos?: boolean;
}

// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  email = '',
  telefono = '',
  celular = '',
  direccion = '',
  domicilio_fiscal = '',
  distrito = '',
  provincia = '',
  departamento = '',
  datosConsolidados,
  estado,
  errores,
  onChange,
  onBlur,
  readonly = false,
  expandido = true,
  mostrarFuentesDatos = false,
}) => {
  
  // =================================================================
  // HELPERS
  // =================================================================
  
  const getFieldError = (field: string): string | undefined => {
    return errores.find(error => error.campo === field)?.mensaje;
  };
  
  const hasConsolidatedData = (field: keyof ContactoConsolidado): boolean => {
    return datosConsolidados ? !!datosConsolidados[field] : false;
  };
  
  // const getConsolidatedValue = (field: keyof ContactoConsolidado): string => {
  //   return datosConsolidados?.[field] || '';
  // };
  
  // =================================================================
  // RENDER
  // =================================================================
  
  if (!expandido) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header de sección con indicadores */}
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
          estado.con_errores 
            ? 'bg-red-100 text-red-600' 
            : estado.completado 
              ? 'bg-green-100 text-green-600'
              : 'bg-blue-100 text-blue-600'
        }`}>
          <Mail className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>
          <p className="text-sm text-gray-600">
            Datos de comunicación y ubicación de la empresa
          </p>
        </div>
        {estado.datos_consolidados && (
          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <CheckCircle className="w-4 h-4" />
            Datos obtenidos
          </div>
        )}
      </div>
      
      {/* Información de contacto principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 inline mr-1" />
            Correo Electrónico
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e: any) => onChange('email', e.target.value)}
              onBlur={onBlur ? () => onBlur('email') : undefined}
              readOnly={readonly}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                getFieldError('email') 
                  ? 'border-red-300 bg-red-50' 
                  : hasConsolidatedData('email')
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
              } ${readonly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder="empresa@dominio.com"
            />
            {hasConsolidatedData('email') && (
              <div className="absolute right-3 top-2 text-green-500">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>
          {getFieldError('email') && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {getFieldError('email')}
            </p>
          )}
          {mostrarFuentesDatos && hasConsolidatedData('email') && (
            <p className="text-xs text-green-600 mt-1">
              Obtenido de: {estado.fuente_datos || 'Sistema consolidado'}
            </p>
          )}
        </div>
        
        {/* Teléfono */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="w-4 h-4 inline mr-1" />
            Teléfono Principal
          </label>
          <div className="relative">
            <input
              type="tel"
              value={telefono}
              onChange={(e: any) => onChange('telefono', e.target.value)}
              onBlur={onBlur ? () => onBlur('telefono') : undefined}
              readOnly={readonly}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                getFieldError('telefono') 
                  ? 'border-red-300 bg-red-50' 
                  : hasConsolidatedData('telefono')
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
              } ${readonly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder="987654321"
            />
            {hasConsolidatedData('telefono') && (
              <div className="absolute right-3 top-2 text-green-500">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>
          {getFieldError('telefono') && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {getFieldError('telefono')}
            </p>
          )}
          {mostrarFuentesDatos && hasConsolidatedData('telefono') && (
            <p className="text-xs text-green-600 mt-1">
              Obtenido de: {estado.fuente_datos || 'Sistema consolidado'}
            </p>
          )}
        </div>
      </div>
      
      {/* Celular adicional */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Phone className="w-4 h-4 inline mr-1" />
          Teléfono Celular <span className="text-gray-400 text-xs">(opcional)</span>
        </label>
        <input
          type="tel"
          value={celular}
          onChange={(e: any) => onChange('celular', e.target.value)}
          onBlur={onBlur ? () => onBlur('celular') : undefined}
          readOnly={readonly}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            readonly ? 'bg-gray-50 cursor-not-allowed' : 'border-gray-300'
          }`}
          placeholder="987654321"
        />
      </div>
      
      {/* Direcciones */}
      <div className="space-y-4">
        {/* Dirección principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            Dirección Principal
          </label>
          <div className="relative">
            <textarea
              value={direccion}
              onChange={(e: any) => onChange('direccion', e.target.value)}
              onBlur={onBlur ? () => onBlur('direccion') : undefined}
              readOnly={readonly}
              rows={2}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
                getFieldError('direccion') 
                  ? 'border-red-300 bg-red-50' 
                  : hasConsolidatedData('direccion')
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
              } ${readonly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder="Av. Principal 123, Urbanización Las Flores"
            />
            {hasConsolidatedData('direccion') && (
              <div className="absolute right-3 top-2 text-green-500">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>
          {getFieldError('direccion') && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {getFieldError('direccion')}
            </p>
          )}
        </div>
        
        {/* Domicilio fiscal (si es diferente) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Building className="w-4 h-4 inline mr-1" />
            Domicilio Fiscal <span className="text-gray-400 text-xs">(si es diferente)</span>
          </label>
          <div className="relative">
            <textarea
              value={domicilio_fiscal}
              onChange={(e: any) => onChange('domicilio_fiscal', e.target.value)}
              onBlur={onBlur ? () => onBlur('domicilio_fiscal') : undefined}
              readOnly={readonly}
              rows={2}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
                hasConsolidatedData('domicilio_fiscal')
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300'
              } ${readonly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder="Dirección para notificaciones legales (si es diferente a la principal)"
            />
            {hasConsolidatedData('domicilio_fiscal') && (
              <div className="absolute right-3 top-2 text-green-500">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>
          {mostrarFuentesDatos && hasConsolidatedData('domicilio_fiscal') && (
            <p className="text-xs text-green-600 mt-1">
              Obtenido de: SUNAT (Domicilio fiscal registrado)
            </p>
          )}
        </div>
      </div>
      
      {/* Ubicación geográfica */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Ubicación Geográfica</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Distrito */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distrito
            </label>
            <div className="relative">
              <input
                type="text"
                value={distrito}
                onChange={(e: any) => onChange('distrito', e.target.value)}
                onBlur={onBlur ? () => onBlur('distrito') : undefined}
                readOnly={readonly}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  hasConsolidatedData('ciudad') // OECE puede tener ciudad que mapeamos a distrito
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
                } ${readonly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                placeholder="Lima"
              />
              {hasConsolidatedData('ciudad') && (
                <div className="absolute right-3 top-2 text-green-500">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
          
          {/* Provincia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provincia
            </label>
            <input
              type="text"
              value={provincia}
              onChange={(e: any) => onChange('provincia', e.target.value)}
              onBlur={onBlur ? () => onBlur('provincia') : undefined}
              readOnly={readonly}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                readonly ? 'bg-gray-50 cursor-not-allowed' : 'border-gray-300'
              }`}
              placeholder="Lima"
            />
          </div>
          
          {/* Departamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <div className="relative">
              <input
                type="text"
                value={departamento}
                onChange={(e: any) => onChange('departamento', e.target.value)}
                onBlur={onBlur ? () => onBlur('departamento') : undefined}
                readOnly={readonly}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  hasConsolidatedData('departamento')
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
                } ${readonly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                placeholder="Lima"
              />
              {hasConsolidatedData('departamento') && (
                <div className="absolute right-3 top-2 text-green-500">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Resumen de datos consolidados */}
      {datosConsolidados && mostrarFuentesDatos && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Información de Fuentes
          </h4>
          <div className="text-xs text-blue-700 space-y-1">
            {datosConsolidados.email && (
              <p>• Email: Obtenido del sistema consolidado</p>
            )}
            {datosConsolidados.telefono && (
              <p>• Teléfono: Obtenido del sistema consolidado</p>
            )}
            {datosConsolidados.direccion && (
              <p>• Dirección: Obtenida del sistema consolidado</p>
            )}
            {datosConsolidados.domicilio_fiscal && (
              <p>• Domicilio fiscal: Obtenido de SUNAT</p>
            )}
          </div>
        </div>
      )}
      
      {/* Advertencias de la sección */}
      {estado.con_advertencias && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-amber-800 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Advertencias:</span>
          </div>
          <ul className="text-amber-700 text-sm mt-1 space-y-1">
            <li>• Verifique que los datos de contacto estén actualizados</li>
            {!email && <li>• Se recomienda proporcionar un email para comunicaciones</li>}
            {!telefono && <li>• Se recomienda proporcionar un teléfono de contacto</li>}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ContactInfoSection;