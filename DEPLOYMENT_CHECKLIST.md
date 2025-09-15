# Checklist de Despliegue

## Antes del Despliegue

### Backend
- [ ] Ejecutar pruebas: `pytest tests/ -v`
- [ ] Verificar tipos de datos en schemas:
  - [ ] `EmpresaResponse.id` es string
  - [ ] `RepresentanteResponse.id` es string
- [ ] Probar endpoints localmente:
  - [ ] `GET /empresas` retorna 200
  - [ ] `POST /empresas` crea empresa correctamente
  - [ ] `GET /empresas/{id}` muestra teléfono y email
- [ ] Verificar que no haya conversión de UUID a int

### Frontend
- [ ] Verificar URLs de API en `src/config/api.ts`
- [ ] Probar Service Worker en producción
- [ ] Verificar tipos en TypeScript
- [ ] Probar vista de detalles de empresa

## Durante el Despliegue

### Monitoreo
- [ ] Verificar GitHub Actions
- [ ] Revisar logs de Cloud Run
- [ ] Probar health check: `GET /health`

## Después del Despliegue

### Verificaciones Críticas
- [ ] Las empresas se cargan en el frontend
- [ ] Los números de teléfono aparecen en vista de detalles
- [ ] Los emails aparecen en vista de detalles
- [ ] No hay errores 500 en console del navegador
- [ ] No hay errores 404 en Network

### Pruebas de Regresión
- [ ] Crear nueva empresa
- [ ] Editar empresa existente
- [ ] Ver detalles de empresa
- [ ] Buscar empresas
- [ ] Navegar por paginación

## Errores Comunes y Soluciones

### Error: "invalid literal for int() with base 10: 'uuid-string'"
**Causa**: Backend intentando convertir UUID a entero
**Solución**:
```python
# En app/models/empresa.py
class EmpresaResponse(BaseModel):
    id: str  # Debe ser string, no int
```

### Error: 404 en endpoints
**Causa**: URLs incorrectas o prefijo faltante
**Solución**: Verificar que frontend y backend usen mismas rutas

### Error: Mixed Content (HTTP/HTTPS)
**Causa**: Service Worker con dominio incorrecto
**Solución**: Actualizar TARGET_DOMAIN en service-worker.js

## Comandos Útiles

```bash
# Verificar estado del deploy
gcloud run services describe registro-valorizaciones-backend --region southamerica-west1

# Ver logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50

# Probar localmente
curl http://localhost:8000/empresas
```