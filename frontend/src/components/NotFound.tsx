import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  // Log del error para debugging
  useEffect(() => {
    console.warn(`Ruta no encontrada: ${location.pathname}`);
    // Si es la ruta problemática específica, logeamos información adicional
    if (location.pathname === '/Backend') {
      console.error('ERROR: Intento de navegación a /Backend detectado');
      console.error('Location completa:', location);
      console.error('Stack trace:', new Error().stack);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
          <p className="text-gray-600 mb-4">
            La ruta <code className="bg-gray-100 px-2 py-1 rounded text-sm">{location.pathname}</code> no existe.
          </p>
          {location.pathname === '/Backend' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Error detectado:</strong> Navegación incorrecta a "/Backend". 
                Esta ruta no debería existir en el frontend.
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ml-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;