/**
 * Utility for Service Worker management and readiness checks
 */

// Service Worker readiness state
let serviceWorkerReady = false;
let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
let readinessCheckPromise: Promise<void> | null = null;

/**
 * Service Worker DESACTIVADO - En lugar de registrar, eliminar
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration> => {
  console.log('🚫 Service Worker desactivado en service-worker-manager.ts');

  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker not supported in this browser');
  }

  // En lugar de registrar, eliminar cualquier Service Worker existente
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.length > 0) {
      console.log(`🗑️ Eliminando ${registrations.length} Service Workers desde service-worker-manager...`);
      await Promise.all(registrations.map(reg => reg.unregister()));
      console.log('✅ Service Workers eliminados');
    }

    // Simular un registro exitoso para no romper el código que depende de esto
    serviceWorkerReady = true;
    return {} as ServiceWorkerRegistration;
  } catch (error) {
    console.error('❌ Error al eliminar Service Workers:', error);
    throw error;
  }
};

/**
 * Wait for Service Worker to be activated
 */
const waitForServiceWorkerActivation = (registration: ServiceWorkerRegistration): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check immediately if already active
    if (registration.active) {
      resolve();
      return;
    }

    // Listen for update found
    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      
      if (installingWorker) {
        console.log('🔄 Service Worker installing...');
        
        installingWorker.addEventListener('statechange', () => {
          console.log(`🔄 Service Worker state: ${installingWorker.state}`);
          
          if (installingWorker.state === 'activated') {
            console.log('🚀 Service Worker activated successfully');
            resolve();
          } else if (installingWorker.state === 'redundant') {
            console.error('❌ Service Worker became redundant');
            reject(new Error('Service Worker installation failed'));
          }
        });
      }
    });

    // Set a timeout in case activation takes too long
    const timeout = setTimeout(() => {
      console.warn('⏰ Service Worker activation timeout - proceeding anyway');
      resolve();
    }, 5000); // 5 second timeout

    // Clean up timeout on resolution
    // We'll clear the timeout when the promise resolves
    setTimeout(() => clearTimeout(timeout), 0);
  });
};

/**
 * Check if Service Worker is ready
 */
export const isServiceWorkerReady = (): boolean => {
  return serviceWorkerReady;
};

/**
 * Wait for Service Worker to be ready (with timeout) - DESACTIVADO
 */
export const waitForServiceWorker = async (timeoutMs = 10000): Promise<void> => {
  console.log('🚫 Service Worker desactivado - continuando sin Service Worker');
  // Simular que el Service Worker está listo para no romper el flujo
  serviceWorkerReady = true;
  return;
};

/**
 * Force Service Worker to take control immediately
 */
export const forceServiceWorkerControl = async (): Promise<void> => {
  if (!serviceWorkerRegistration) {
    await registerServiceWorker();
  }

  if (serviceWorkerRegistration) {
    try {
      await serviceWorkerRegistration.update();
      console.log('🔄 Service Worker update triggered');
    } catch (error) {
      console.warn('⚠️ Failed to trigger Service Worker update:', error);
    }
  }
};

/**
 * Clear all Service Worker caches
 */
export const clearServiceWorkerCaches = async (): Promise<void> => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('🗑️ Service Worker caches cleared');
    } catch (error) {
      console.warn('⚠️ Failed to clear Service Worker caches:', error);
    }
  }
};

/**
 * Get current Service Worker registration
 */
export const getServiceWorkerRegistration = (): ServiceWorkerRegistration | null => {
  return serviceWorkerRegistration;
};

/**
 * Debug: Log Service Worker status
 */
export const debugServiceWorkerStatus = (): void => {
  console.log('🔍 Service Worker Status:', {
    ready: serviceWorkerReady,
    registration: serviceWorkerRegistration ? {
      active: !!serviceWorkerRegistration.active,
      installing: !!serviceWorkerRegistration.installing,
      waiting: !!serviceWorkerRegistration.waiting,
      scope: serviceWorkerRegistration.scope
    } : null,
    navigatorSupported: 'serviceWorker' in navigator
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      console.log('📋 Browser Service Worker Registration:', {
        active: !!reg?.active,
        installing: !!reg?.installing,
        waiting: !!reg?.waiting,
        scope: reg?.scope
      });
    }).catch(err => {
      console.error('❌ Error getting Service Worker registration:', err);
    });
  }
};

// Auto-register on module load in production
if (import.meta.env.PROD && typeof window !== 'undefined') {
  // Don't auto-register immediately, wait for explicit call
  console.log('🛡️ Service Worker utility loaded (production mode)');
}