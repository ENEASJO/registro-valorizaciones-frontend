# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Nota: Para pautas del monorepo y orquestación FE/BE, consulta el WARP.md raíz:
REGISTRO DE VALORIZACIONES/WARP.md

Resumen del proyecto
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Enrutamiento: react-router-dom (BrowserRouter) con Layout persistente y rutas anidadas
- UI/UX: Radix UI, animaciones con framer-motion, iconos lucide-react, tema claro/oscuro vía ThemeContext
- Capa de API: centralizada en src/config/api.ts con URL base según entorno y endpoints tipados por dominio
- Service Workers: deshabilitados explícitamente y desregistrados de forma agresiva en producción
- Despliegue: README indica despliegue en Vercel mediante GitHub Actions

Comandos comunes (PowerShell)
- Instalar dependencias (hay package-lock.json; en instalaciones limpias se prefiere npm ci)
```pwsh path=null start=null
npm ci
# o
npm install
```

- Servidor de desarrollo (Vite). Asegúrate de tener .env.local (ver Entorno abajo).
```pwsh path=null start=null
npm run dev
```

- Build de producción (TypeScript build + Vite build). Salida en dist/ con nombres cache-busting.
```pwsh path=null start=null
npm run build
```

- Previsualizar el build de producción localmente
```pwsh path=null start=null
npm run preview
```

- Lint
```pwsh path=null start=null
npm run lint
```

- Tests
No hay runner de tests configurado (no existe script de test en package.json). Si se añaden pruebas más adelante, documentar cómo ejecutar una sola prueba aquí.

Entorno y configuración
- Archivos de entorno
  - Existe .env.example. Crea .env.local para overrides de desarrollo.
```pwsh path=null start=null
Copy-Item -Force .env.example .env.local
```

- Variables importantes (ver README y src/config/api.ts)
  - VITE_BACKEND_URL: URL base del backend
  - VITE_ENVIRONMENT: etiqueta de entorno (p. ej., production)
  - VITE_API_TIMEOUT: timeout de requests en ms (por defecto 45000 si no se define)
  - VITE_RETRY_ATTEMPTS: número de reintentos (por defecto 2 si no se define)

- Comportamiento por defecto
  - Si VITE_BACKEND_URL no está definida:
    - Producción usa https://registro-valorizaciones-backend-503600768755.southamerica-west1.run.app
    - Desarrollo usa http://localhost:8000
  - En producción, cualquier http:// al dominio por defecto de Cloud Run se corrige forzosamente a https://
  - Servidor Vite
    - HMR: puerto 24678
    - Hay reglas de proxy para /api, /consulta-ruc, /buscar, /health apuntando a VITE_BACKEND_URL; sin embargo, la mayoría de llamadas usan URLs absolutas de src/config/api.ts

Arquitectura de alto nivel
- Puntos de entrada
  - src/main.tsx monta la app y gestiona Service Workers condicionalmente en producción (vía src/utils/service-worker-manager.ts)
  - src/App.tsx configura BrowserRouter y rutas anidadas bajo un Layout compartido

- Layout y enrutamiento
  - src/components/layout/Layout.tsx provee navegación lateral, barra superior con ThemeToggle y un Outlet para el contenido
  - Rutas (desde src/App.tsx)
    - / → Dashboard
    - /empresas/ejecutoras y /empresas/supervisoras
    - /obras
    - /valorizaciones/ejecucion y /valorizaciones/supervision (con redirección desde /valorizaciones)
    - /reportes
    - /configuracion
    - Catch-all → NotFound

- Módulos (organización por funcionalidades)
  - src/modules/empresas, src/modules/obras, src/modules/valorizaciones, src/modules/reporte, src/modules/configuracion
  - Cada módulo expone un componente principal y un subdirectorio components/ para composición
  - Los tipos compartidos viven en src/types/*.types.ts y se reutilizan en hooks y componentes

- Datos y capa de API (centralizado en src/config/api.ts)
  - Resuelve API_BASE_URL desde variables de entorno con refuerzo HTTPS en producción y localhost en desarrollo
  - Exporta API_ENDPOINTS por dominio (empresas, obras, valorizaciones, health, consultaRuc, etc.)
  - Exporta DEFAULT_HEADERS y API_TIMEOUT que utilizan los hooks de datos
  - Lógica en runtime para desregistrar cualquier Service Worker en producción (con logs de diagnóstico)

- Hooks por dominio
  - src/hooks/useEmpresas.ts
    - Obtiene y mapea respuestas de Empresa (Neon) a tipos del frontend
    - Ofrece operaciones CRUD y filtros del lado del cliente
  - src/hooks/useObras.ts
    - Construye query params para filtros y mapea respuestas del backend a Obra del frontend
    - Utilidad HTTP centralizada con timeout y manejo uniforme de errores
  - src/hooks/useValorizaciones.ts
    - Mapea ValorizacionResponse al tipo del frontend y expone operaciones con timeouts

- Utilidades
  - src/utils/service-worker-manager.ts deshabilita deliberadamente SW y elimina registros/cachés para evitar problemas PWA en producción

- Estilos y UI
  - Tailwind CSS en componentes
  - Radix UI, iconos lucide-react, framer-motion para animaciones
  - ThemeContext y ThemeToggle implementan conmutación claro/oscuro

Integración con backend
- Para orquestar backend + frontend en local, consulta el WARP.md raíz del monorepo:
  REGISTRO DE VALORIZACIONES/WARP.md
- En desarrollo, define VITE_BACKEND_URL en .env.local (por ejemplo, http://localhost:8000) y ejecuta el servidor de desarrollo del frontend.

Detalles notables del repositorio
- Tooling
  - Vite (vite.config.ts) define manualChunks y cache busting basado en timestamp para JS y assets
  - ESLint (eslint.config.js) usa ESLint v9 con @eslint/js, typescript-eslint, react-hooks, react-refresh; dist/ está ignorado
- README
  - Resumen del stack
  - Comandos básicos de desarrollo
  - Nota de despliegue en Vercel + GitHub Actions
  - Variables de entorno necesarias para conectar al backend

Advertencias
- package.json incluye scripts "backend" y "test-sunat" que refieren a archivos ausentes en el repo; probablemente son heredados o locales. Prefiere usar los endpoints configurados y tu servicio FastAPI directamente.
