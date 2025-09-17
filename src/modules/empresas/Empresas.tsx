import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Briefcase,
  Shield,
  TrendingUp,
  Eye,
} from 'lucide-react';

const Empresas = () => {
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);


  // Dashboard principal
  return (
    <div className="space-y-8">
      {/* Header principal */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Gestión de Empresas Contratistas
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Sistema integral para la administración de empresas ejecutoras y supervisoras 
          en proyectos de infraestructura municipal
        </p>
      </div>

      {/* Mensaje de notificación */}
      <AnimatePresence>
        {mensaje && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg flex items-center gap-3 ${
              mensaje.tipo === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {mensaje.tipo === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">{mensaje.texto}</span>
            <button
              onClick={() => setMensaje(null)}
              className="ml-auto p-1 hover:bg-black hover:bg-opacity-5 rounded"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards de navegación principal */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Card Empresas Ejecutoras */}
        <Link to="/empresas/ejecutoras" className="block">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group cursor-pointer"
          >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:border-blue-300">
            <div className="flex flex-col h-full">
              {/* Header del card */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-2 text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span className="font-medium">Acceder</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              
              {/* Contenido */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-blue-900 mb-3">
                  Empresas Ejecutoras
                </h3>
                <p className="text-blue-700 mb-6 leading-relaxed">
                  Gestiona empresas y consorcios responsables de la ejecución directa 
                  de obras de infraestructura municipal.
                </p>
                
                {/* Características */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Registro de empresas constructoras</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Formación de consorcios ejecutores</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Clasificación por especialidades</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Control de capacidad contractual</span>
                  </div>
                </div>
              </div>
              
              {/* Footer con estadísticas */}
              <div className="border-t border-blue-200 pt-4 mt-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Building2 className="w-4 h-4" />
                    <span>Empresas constructoras</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Gestión especializada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </motion.div>
        </Link>

        {/* Card Empresas Supervisoras */}
        <Link to="/empresas/supervisoras" className="block">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group cursor-pointer"
          >
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:border-green-300">
            <div className="flex flex-col h-full">
              {/* Header del card */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-2 text-green-600 group-hover:translate-x-1 transition-transform">
                  <span className="font-medium">Acceder</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              
              {/* Contenido */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-900 mb-3">
                  Empresas Supervisoras
                </h3>
                <p className="text-green-700 mb-6 leading-relaxed">
                  Administra empresas consultoras especializadas en supervisión 
                  y control de calidad de obras públicas.
                </p>
                
                {/* Características */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Empresas consultoras certificadas</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Consorcios de supervisión</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Especialización en control técnico</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Verificación de cumplimiento</span>
                  </div>
                </div>
              </div>
              
              {/* Footer con estadísticas */}
              <div className="border-t border-green-200 pt-4 mt-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <Eye className="w-4 h-4" />
                    <span>Control y supervisión</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Aseguramiento de calidad</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </motion.div>
        </Link>
      </div>

      {/* Información adicional */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sistema Integral de Gestión
            </h3>
            <p className="text-gray-600">
              Administración completa del ciclo de vida de empresas contratistas
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Consorcios Inteligentes</h4>
              <p className="text-sm text-gray-600">Formación automática y gestión de participaciones</p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Validación Automática</h4>
              <p className="text-sm text-gray-600">Verificación de capacidades y requisitos</p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Análisis Avanzado</h4>
              <p className="text-sm text-gray-600">Reportes y métricas de desempeño</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empresas;