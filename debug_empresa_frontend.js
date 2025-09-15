// Script para depurar la creación de empresas desde el frontend
// Pegar esto en la consola del navegador

// Intercept fetch para ver todas las peticiones
const originalFetch = window.fetch;
window.fetch = async function(...args) {
    const url = args[0];
    const options = args[1];

    if (typeof url === 'string' && url.includes('/empresas')) {
        console.log('🔍 FETCH INTERCEPTADO:', {
            url: url,
            method: options?.method || 'GET',
            body: options?.body ? JSON.parse(options.body) : null,
            timestamp: new Date().toISOString()
        });

        const response = await originalFetch(...args);

        // Clonar la respuesta para no consumirla
        const clonedResponse = response.clone();

        try {
            const responseData = await clonedResponse.json();
            console.log('📄 RESPUESTA:', {
                url: url,
                status: response.status,
                ok: response.ok,
                data: responseData,
                timestamp: new Date().toISOString()
            });
        } catch (e) {
            console.log('📄 RESPUESTA (no JSON):', {
                url: url,
                status: response.status,
                statusText: response.statusText,
                timestamp: new Date().toISOString()
            });
        }

        return response;
    }

    return originalFetch(...args);
};

// Función para probar el endpoint de debug
async function testDebugEndpoint() {
    const testData = {
        ruc: "20610701117",
        razon_social: "VIDA SANA ALEMANA SOCIEDAD ANONIMA CERRADA - VIDA SANA ALEMANA S.A.C.",
        tipo_empresa: "SAC",
        email: "test@example.com",
        telefono: "999123456"
    };

    console.log('🧪 Probando endpoint de debug...');

    try {
        const response = await fetch('https://registro-valorizaciones-backend-503600768755.southamerica-west1.run.app/debug/test-empresa-creation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        console.log('🎯 Resultado del debug:', result);
    } catch (error) {
        console.error('❌ Error en prueba de debug:', error);
    }
}

// Ejecutar la prueba
testDebugEndpoint();