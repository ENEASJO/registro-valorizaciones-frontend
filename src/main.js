import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Service Worker DESACTIVADO para resolver problemas
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  console.log('🚫 Service Worker desactivado en main.js');

  window.addEventListener('load', () => {
    // En lugar de registrar, eliminar cualquier Service Worker existente
    navigator.serviceWorker.getRegistrations().then(registrations => {
      if (registrations.length > 0) {
        console.log(`🗑️ Eliminando ${registrations.length} Service Workers desde main.js...`);
        registrations.forEach(reg => reg.unregister());
      }
    });
  });
}

createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
