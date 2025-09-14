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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          {/* Redirigir /empresas directamente a ejecutoras */}
          <Route path="empresas" element={<GestionEjecutoras />} />
          <Route path="empresas/ejecutoras" element={<GestionEjecutoras />} />
          <Route path="empresas/supervisoras" element={<GestionSupervisoras />} />
          <Route path="obras" element={<Obras />} />
          {/* Redirigir /valorizaciones directamente a ejecucion */}
          <Route path="valorizaciones" element={<Navigate to="/valorizaciones/ejecucion" replace />} />
          <Route path="valorizaciones/ejecucion" element={<ValorizacionEjecucion />} />
          <Route path="valorizaciones/supervision" element={<ValorizacionSupervision />} />
          <Route path="reportes" element={<Reporte />} />
          <Route path="configuracion" element={<Configuracion />} />
          {/* Ruta catch-all para manejar rutas no encontradas - debe ir al final */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
