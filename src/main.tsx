import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerServiceWorker } from './utils/service-worker-manager'

// Register Service Worker for production only
if (import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      // Clear Service Worker caches first
      const { clearServiceWorkerCaches } = await import('./utils/service-worker-manager');
      await clearServiceWorkerCaches();

      // console.log('🛡️ Main.tsx: Registering Service Worker...');
      registerServiceWorker()
        .then((registration) => {
          // console.log('✅ Main.tsx: Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          // console.error('❌ Main.tsx: Service Worker registration failed:', error);
        });
    } catch (error) {
      console.error('Error initializing Service Worker:', error);
    }
  });
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
