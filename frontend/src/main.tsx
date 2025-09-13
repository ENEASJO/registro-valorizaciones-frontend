import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerServiceWorker } from './utils/service-worker-manager'

// Register Service Worker for production only
if (import.meta.env.PROD) {
  window.addEventListener('load', () => {
    console.log('🛡️ Main.tsx: Registering Service Worker...');
    registerServiceWorker()
      .then((registration) => {
        console.log('✅ Main.tsx: Service Worker registered successfully:', registration);
      })
      .catch((error) => {
        console.error('❌ Main.tsx: Service Worker registration failed:', error);
      });
  });
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
