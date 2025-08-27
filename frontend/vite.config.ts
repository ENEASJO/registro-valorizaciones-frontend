import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configuración específica para variables de entorno
  define: {
    // Asegurar que las variables se incluyan en el build
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL)
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Force new build with timestamp to break cache
        entryFileNames: `[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `[name]-[hash]-${Date.now()}.[ext]`,
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'lucide-react'],
          charts: ['recharts'],
          utils: ['framer-motion', 'exceljs', 'jspdf', 'html2canvas']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',   // Permitir acceso desde cualquier IP
    port: 5173,        // Puerto estándar de Vite
    open: false,       // No abrir navegador automáticamente en entorno de prueba
    strictPort: false, // Permite usar puerto alternativo si 5173 está ocupado
    cors: true,        // Habilitar CORS
    hmr: {
      port: 24678      // Puerto específico para HMR (Hot Module Replacement)
    },
    proxy: {
      // Configurar proxy para evitar problemas de CORS con el backend FastAPI
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Proxy específico para consultas RUC
      '/consulta-ruc': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/buscar': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8000', 
        changeOrigin: true,
        secure: false
      },
      '/health': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true, 
        secure: false
      }
    }
  }
})
