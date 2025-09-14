import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Registrar Service Worker para corregir Mixed Content
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registrado exitosamente:', registration.scope);
        
        // Forzar la activación inmediata del Service Worker
        if (registration.active) {
          console.log('🔄 Service Worker ya está activo');
        } else if (registration.installing) {
          console.log('⏳ Service Worker está siendo instalado');
          registration.installing.addEventListener('statechange', (e) => {
            if (e.target.state === 'activated') {
              console.log('🚀 Service Worker activado - recargando página para aplicar cambios');
              window.location.reload();
            }
          });
        } else if (registration.waiting) {
          console.log('⏳ Service Worker está esperando');
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      })
      .catch(error => {
        console.error('❌ Error al registrar Service Worker:', error);
      });
  });
} else {
  console.log('ℹ️ Service Worker no disponible o no en producción');
}

createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
