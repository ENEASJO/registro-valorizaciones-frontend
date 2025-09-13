// Simple test to verify Service Worker registration
function testServiceWorker() {
  if ('serviceWorker' in navigator) {
    console.log('🧪 Testing Service Worker...');
    
    // Test if we can register the Service Worker
    navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    }).then(registration => {
      console.log('✅ Service Worker test registration successful:', registration);
      
      // Test if it's active
      if (registration.active) {
        console.log('✅ Service Worker is active');
        testFetchInterception();
      } else {
        console.log('⏳ Waiting for Service Worker to activate...');
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'activated') {
                console.log('✅ Service Worker activated, testing interception...');
                testFetchInterception();
              }
            });
          }
        });
      }
    }).catch(error => {
      console.error('❌ Service Worker test registration failed:', error);
    });
  } else {
    console.log('❌ Service Worker not supported');
  }
}

function testFetchInterception() {
  // Test HTTP to HTTPS interception
  const testUrl = 'http://registro-valorizaciones-503600768755.southamerica-west1.run.app/health';
  
  console.log('🧪 Testing fetch interception with:', testUrl);
  
  fetch(testUrl)
    .then(response => {
      console.log('✅ Fetch successful, intercepted URL:', response.url);
      console.log('✅ Response status:', response.status);
    })
    .catch(error => {
      console.error('❌ Fetch failed:', error);
    });
}

// Run test when page loads
if (import.meta.env.PROD) {
  window.addEventListener('load', () => {
    setTimeout(testServiceWorker, 1000); // Wait a bit for Service Worker to register
  });
}