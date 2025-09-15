# Guía de Manejo de UUIDs

## Importante

Este proyecto utiliza UUIDs como identificadores primarios en la base de datos. **Nunca** conviertas UUIDs a enteros, esto causará errores 500.

## Reglas de Oro

1. **Todos los IDs son strings** - En frontend y backend
2. **Nunca usar `int(id)`** con UUIDs
3. **Siempre validar tipos** en los schemas de respuesta

## Backend (FastAPI/Python)

### Correcto ✅
```python
# En schemas
class EmpresaResponse(BaseModel):
    id: str  # String para UUIDs

# En conversiones
def convertir_empresa_dict_a_response(empresa_dict):
    return EmpresaResponse(
        id=str(empresa_dict.get('id', '0')),  # Convertir a string
        # ... otros campos
    )
```

### Incorrecto ❌
```python
# NUNCA hacer esto
class EmpresaResponse(BaseModel):
    id: int  # Error: los UUIDs no son enteros

return EmpresaResponse(
    id=int(empresa_dict.get('id', 0)),  # Error: ValueError
)
```

## Frontend (TypeScript)

### Correcto ✅
```typescript
// En interfaces
export interface Empresa {
  id: string;  // String para UUIDs
  representantes: RepresentanteResponse[];
}

export interface RepresentanteResponse {
  id: string;  // String para UUIDs
}
```

### Validación
```typescript
// Siempre validar que los IDs sean strings
function validateEmpresa(data: any): data is Empresa {
  return typeof data.id === 'string';
}
```

## Pruebas

Antes de hacer commit:

```bash
# Ejecutar verificación de tipos
python scripts/check_uuid_types.py

# Ejecutar pruebas
pytest tests/test_uuid_handling.py -v
```

## Depuración

Si ves este error:
```
invalid literal for int() with base 10: 'uuid-string'
```

1. Buscar conversiones `int()` en el código
2. Verificar schemas de respuesta
3. Usar el endpoint de depuración: `/empresas/debug/detailed-error`

## Checklist para Cambios

- [ ] Verificar que todos los IDs sean strings en schemas
- [ ] No usar `int()` con UUIDs
- [ ] Ejecutar pruebas de UUID handling
- [ ] Probar endpoints localmente
- [ ] Verificar vista de detalles en frontend