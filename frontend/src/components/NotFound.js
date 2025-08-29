import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 px-4", children: _jsxs("div", { className: "max-w-md w-full text-center", children: [_jsxs("div", { className: "mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4", children: _jsx(AlertTriangle, { className: "w-8 h-8 text-red-600" }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "P\u00E1gina no encontrada" }), _jsxs("p", { className: "text-gray-600 mb-4", children: ["La ruta ", _jsx("code", { className: "bg-gray-100 px-2 py-1 rounded text-sm", children: location.pathname }), " no existe."] }), location.pathname === '/Backend' && (_jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4", children: _jsxs("p", { className: "text-yellow-800 text-sm", children: [_jsx("strong", { children: "Error detectado:" }), " Navegaci\u00F3n incorrecta a \"/Backend\". Esta ruta no deber\u00EDa existir en el frontend."] }) }))] }), _jsxs("div", { className: "space-y-3", children: [_jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors", children: [_jsx(Home, { className: "w-4 h-4" }), "Ir al Dashboard"] }), _jsxs("button", { onClick: () => window.history.back(), className: "inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ml-3", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Volver atr\u00E1s"] })] })] }) }));
};
export default NotFound;
