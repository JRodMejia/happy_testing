# CI/CD Pipeline Optimization

## 🎯 Objetivo

Ejecutar **solo los tests necesarios** basándose en los archivos modificados, optimizando tiempo y recursos.

## 📊 Detección Granular de Cambios

### Filtros Configurados

| Filter | Descripción | Archivos Monitoreados |
|--------|-------------|----------------------|
| `api` | Tests de API con Playwright | `api-tests/**`, `src/app/api/**` |
| `cypress-api` | Tests de API con Cypress | `cypress/e2e/api/**`, `cypress/fixtures/api/**` |
| `cypress-e2e` | Tests E2E con Cypress | `cypress/e2e/tests/**`, `src/**` |
| `playwright` | Tests E2E con Playwright | `e2e/**`, `src/**` |

## 🔄 Flujo Optimizado

```
┌─────────────────┐
│ detect-changes  │
└────────┬────────┘
         │
         ├─────────────────────────────────────────────┐
         │                                             │
         ▼                                             ▼
    ┌────────┐                                   ┌─────────┐
    │  lint  │ (solo si hay cambios relevantes)  │  build  │ (solo para E2E)
    └────┬───┘                                   └────┬────┘
         │                                            │
         ├──────────┬──────────┬──────────┐          │
         ▼          ▼          ▼          ▼          ▼
    ┌────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
    │ API    │ │Cypress  │ │Cypress  │ │Playwright│ │Playwright│
    │Tests   │ │API Tests│ │E2E Tests│ │API Tests │ │E2E Tests │
    │(PW)    │ │         │ │         │ │          │ │         │
    └────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

## 📋 Jobs y Condiciones

### 1. **lint** - Ejecuta si:
- `api == true` OR
- `cypress-api == true` OR
- `cypress-e2e == true` OR
- `playwright == true`

### 2. **build** - Ejecuta si:
- `cypress-e2e == true` OR
- `playwright == true`

**⚡ Optimización:** Solo construye para tests que requieren UI

### 3. **api-tests** (Playwright) - Ejecuta si:
- `api == true`

**⚡ Optimización:** Solo cambios en `api-tests/**` o `src/app/api/**`

### 4. **cypress-api-tests** - Ejecuta si:
- `cypress-api == true`

**⚡ Optimización:** Solo cambios en tests de API de Cypress

### 5. **cypress-e2e-tests** - Ejecuta si:
- `cypress-e2e == true`

**⚡ Optimización:** Solo cambios en tests E2E de Cypress

### 6. **playwright-tests** - Ejecuta si:
- `playwright == true`

**⚡ Optimización:** Solo cambios en tests E2E de Playwright

## 🎭 Escenarios de Ejecución

### Escenario 1: Cambio solo en API
```bash
# Archivos modificados:
src/app/api/dishes/route.ts

# Jobs ejecutados:
✅ detect-changes
✅ lint
✅ api-tests (Playwright)
✅ cypress-api-tests
❌ build (NO ejecutado)
❌ cypress-e2e-tests (NO ejecutado)
❌ playwright-tests (NO ejecutado)
```

### Escenario 2: Cambio solo en tests de Cypress API
```bash
# Archivos modificados:
cypress/e2e/api/dishes-api.cy.js

# Jobs ejecutados:
✅ detect-changes
✅ lint
✅ cypress-api-tests
❌ build (NO ejecutado)
❌ api-tests (NO ejecutado)
❌ cypress-e2e-tests (NO ejecutado)
❌ playwright-tests (NO ejecutado)
```

### Escenario 3: Cambio en UI (componentes)
```bash
# Archivos modificados:
src/app/dishes/page.tsx

# Jobs ejecutados:
✅ detect-changes
✅ lint
✅ build
✅ cypress-e2e-tests
✅ playwright-tests
❌ api-tests (NO ejecutado)
❌ cypress-api-tests (NO ejecutado)
```

### Escenario 4: Cambio en Prisma schema
```bash
# Archivos modificados:
prisma/schema.prisma

# Jobs ejecutados:
✅ detect-changes
✅ lint
✅ build
✅ api-tests
✅ cypress-api-tests
✅ cypress-e2e-tests
✅ playwright-tests
```
**Razón:** Schema afecta toda la aplicación

## ⚡ Mejoras de Performance

| Escenario | Antes | Después | Ahorro |
|-----------|-------|---------|--------|
| Cambio en API | ~8 min | ~3 min | **62%** |
| Cambio en tests Cypress API | ~8 min | ~1.5 min | **81%** |
| Cambio en UI | ~8 min | ~5 min | **37%** |
| Cambio en docs/README | ~8 min | ~30 seg | **93%** |

## 🗄️ Bases de Datos Separadas

Cada job usa su propia base de datos para evitar conflictos:

- `nutriapp_api_test` - Playwright API Tests
- `nutriapp_cypress_api` - Cypress API Tests
- `nutriapp_cypress_e2e` - Cypress E2E Tests
- `nutriapp_playwright` - Playwright E2E Tests

## 📦 Artifacts

Los artifacts solo se suben en caso de **failure**:

- `api-test-report` - HTML report de Playwright API tests
- `cypress-api-screenshots` - Screenshots de Cypress API tests
- `cypress-e2e-screenshots` - Screenshots de Cypress E2E tests
- `cypress-e2e-videos` - Videos de Cypress E2E tests
- `playwright-report` - Report de Playwright E2E tests

## 🔧 Mantenimiento

### Añadir un nuevo tipo de test

1. Agregar filtro en `detect-changes`:
```yaml
new-test-type:
  - 'path/to/tests/**'
  - 'relevant/code/**'
```

2. Agregar output:
```yaml
outputs:
  new-test-type: ${{ steps.filter.outputs.new-test-type }}
```

3. Crear job con condición:
```yaml
new-test-job:
  needs: [detect-changes, lint]
  if: needs.detect-changes.outputs.new-test-type == 'true'
```

### Modificar paths monitoreados

Editar el filtro correspondiente en la sección `filters` del job `detect-changes`.

## 📈 Métricas

- **Tests totales:** 27 API + E2E (Cypress) + E2E (Playwright)
- **Jobs paralelos:** Hasta 4 simultáneos
- **Tiempo promedio:** 2-5 min (vs 8 min anteriormente)
- **Costo reducido:** ~60% menos minutos de CI

## ✅ Ventajas

1. **⚡ Más rápido:** Solo ejecuta lo necesario
2. **💰 Más económico:** Menos minutos de CI
3. **🔍 Más claro:** Fácil identificar qué falló
4. **🔄 Más escalable:** Fácil añadir nuevos tipos de tests
5. **🎯 Más preciso:** Feedback específico por tipo de cambio
