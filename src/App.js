import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import NotFound from './components/NotFound';
import Dashboard from './modules/dashboard/Dashboard';
import { GestionEjecutoras, GestionSupervisoras } from './modules/empresas/components';
import Obras from './modules/obras/Obras';
import { ValorizacionEjecucion, ValorizacionSupervision } from './modules/valorizaciones/components';
import Reporte from './modules/reporte/Reporte';
import Configuracion from './modules/configuracion/Configuracion';
function App() {
    return (_jsx(Router, { children: _jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "empresas", element: _jsx(GestionEjecutoras, {}) }), _jsx(Route, { path: "empresas/ejecutoras", element: _jsx(GestionEjecutoras, {}) }), _jsx(Route, { path: "empresas/supervisoras", element: _jsx(GestionSupervisoras, {}) }), _jsx(Route, { path: "obras", element: _jsx(Obras, {}) }), _jsx(Route, { path: "valorizaciones", element: _jsx(Navigate, { to: "/valorizaciones/ejecucion", replace: true }) }), _jsx(Route, { path: "valorizaciones/ejecucion", element: _jsx(ValorizacionEjecucion, {}) }), _jsx(Route, { path: "valorizaciones/supervision", element: _jsx(ValorizacionSupervision, {}) }), _jsx(Route, { path: "reportes", element: _jsx(Reporte, {}) }), _jsx(Route, { path: "configuracion", element: _jsx(Configuracion, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }) }));
}
export default App;
