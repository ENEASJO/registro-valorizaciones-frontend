/**
 * Utility for Service Worker management and readiness checks
 */

// Service Worker readiness state
let serviceWorkerReady = false;
let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
let readinessCheckPromise: Promise<void> | null = null;

/**
 * Register Service Worker and wait for it to be ready
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration> => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker not supported in this browser');
  }

  // If already registered and ready, return existing registration
  if (serviceWorkerReady && serviceWorkerRegistration) {
    console.log('✅ Service Worker already registered and ready');
    return serviceWorkerRegistration;
  }

  // If there's an ongoing registration check, wait for it
  if (readinessCheckPromise) {
    console.log('⏳ Waiting for existing Service Worker registration...');
    await readinessCheckPromise;
    return serviceWorkerRegistration!;
  }

  // Create a new registration promise
  readinessCheckPromise = (async (): Promise<void> => {
    try {
      console.log('🛡️ Registering Service Worker...');
      
      // Register the Service Worker with cache busting
      const timestamp = Date.now();
      const serviceWorkerUrl = `/service-worker.js?v=${timestamp}&force=1`;
      const registration = await navigator.serviceWorker.register(serviceWorkerUrl, {
        scope: '/'
      });
      
      console.log('🛡️ Service Worker registered:', registration);
      serviceWorkerRegistration = registration;

      // Check if already active
      if (registration.active) {
        console.log('✅ Service Worker already active');
        serviceWorkerReady = true;
        return;
      }

      // Wait for activation
      console.log('⏳ Waiting for Service Worker activation...');
      await waitForServiceWorkerActivation(registration);
      
      console.log('✅ Service Worker is ready and active');
      serviceWorkerReady = true;
      
      return;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      throw error;
    } finally {
      readinessCheckPromise = null;
    }
  })();

  // Wait for the registration to complete and return the result
  await readinessCheckPromise;
  return serviceWorkerRegistration!;
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
 * Wait for Service Worker to be ready (with timeout)
 */
export const waitForServiceWorker = async (timeoutMs = 10000): Promise<void> => {
  if (serviceWorkerReady) {
    console.log('✅ Service Worker already ready');
    return;
  }

  console.log('⏳ Waiting for Service Worker readiness...');
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Service Worker readiness timeout')), timeoutMs);
  });

  try {
    await Promise.race([
      registerServiceWorker(),
      timeoutPromise
    ]);
    console.log('✅ Service Worker is ready for API calls');
  } catch (error) {
    console.warn('⚠️ Service Worker not ready, proceeding anyway:', error);
    // Don't throw error, allow API calls to proceed
  }
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