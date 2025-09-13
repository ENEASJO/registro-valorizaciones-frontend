// Service Worker test using the new manager
import { registerServiceWorker, waitForServiceWorker, debugServiceWorkerStatus } from './service-worker-manager';

async function testServiceWorker() {
  try {
    console.log('🧪 Testing Service Worker with manager...');
    
    // Register and wait for Service Worker
    const registration = await registerServiceWorker();
    console.log('✅ Service Worker test registration successful:', registration);
    
    // Test if it's ready
    await waitForServiceWorker(3000);
    console.log('✅ Service Worker is ready for testing');
    
    // Debug status
    debugServiceWorkerStatus();
    
    // Test fetch interception
    testFetchInterception();
    
  } catch (error) {
    console.error('❌ Service Worker test failed:', error);
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

// Test API endpoint specifically
async function testApiEndpoint() {
  try {
    const apiEndpoint = 'http://registro-valorizaciones-503600768755.southamerica-west1.run.app/api/empresas';
    
    console.log('🧪 Testing API endpoint:', apiEndpoint);
    
    const response = await fetch(apiEndpoint);
    console.log('✅ API test successful:', {
      url: response.url,
      status: response.status,
      contentType: response.headers.get('content-type')
    });
    
    const data = await response.json();
    console.log('✅ API response data:', data);
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

// Run comprehensive tests when page loads
if (import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    setTimeout(async () => {
      await testServiceWorker();
      setTimeout(testApiEndpoint, 2000); // Test API after Service Worker is ready
    }, 1000);
  });
}