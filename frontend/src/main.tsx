import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './utils/service-worker-test'

// Registrar Service Worker para interceptar peticiones HTTP a HTTPS
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    }).then((registration) => {
      console.log('🛡️ Service Worker registrado en main.tsx:', registration);
      
      // Forzar activación inmediata
      if (registration.active) {
        console.log('✅ Service Worker ya está activo');
      } else {
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'activated') {
                console.log('🚀 Service Worker activado exitosamente');
              }
            });
          }
        });
      }
    }).catch((error) => {
      console.error('❌ Error registrando Service Worker en main.tsx:', error);
    });
  });
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
