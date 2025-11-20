# API Tests - Playwright

This directory contains API tests for the NutriApp backend endpoints using Playwright's request API.

## 📁 Structure

```
api-tests/
├── config/
│   └── api.config.ts          # Playwright configuration for API tests
├── fixtures/
│   └── testData.ts            # Test data and fixtures
├── helpers/
│   └── ApiClient.ts           # API client wrapper utilities
└── tests/
    ├── auth.test.ts           # Authentication endpoints tests
    └── dishes.test.ts         # Dishes CRUD endpoints tests
```

## 🚀 Running Tests

### Run all API tests:
```bash
npm run test:api
```

### Run specific test file:
```bash
npm run test:api -- auth.test.ts
npm run test:api -- dishes.test.ts
```

### Run with UI mode:
```bash
npm run test:api:ui
```

### Run in debug mode:
```bash
npm run test:api -- --debug
```

## 📋 Test Coverage

### Authentication API (`auth.test.ts`)
- ✅ POST `/api/register` - User registration
  - Valid user creation
  - Missing required fields
  - Duplicate email handling
- ✅ POST `/api/login` - User authentication
  - Valid credentials
  - Missing fields
  - Invalid email
  - Invalid password
- ✅ POST `/api/logout` - Session termination
  - Cookie clearing

### Dishes API (`dishes.test.ts`)
- ✅ GET `/api/dishes` - List all dishes
  - Authenticated request
  - Unauthorized access
- ✅ POST `/api/dishes` - Create dish
  - Complete dish data
  - Minimal required fields
  - Missing required fields
  - Unauthorized access
- ✅ GET `/api/dishes/:id` - Get dish by ID
  - Valid dish retrieval
  - Non-existent dish
  - Unauthorized access
- ✅ PUT `/api/dishes/:id` - Update dish
  - Successful update
  - Unauthorized access
- ✅ DELETE `/api/dishes/:id` - Delete dish
  - Successful deletion
  - Verification of deletion
  - Non-existent dish
  - Unauthorized access

## 🔧 Configuration

The API tests use a separate configuration file (`config/api.config.ts`) with:
- **Base URL**: `http://localhost:3000/api`
- **Timeout**: 30 seconds
- **Reporters**: List, HTML, JSON
- **Web Server**: Auto-starts Next.js dev server

## 📊 Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report api-test-results/html-report
```

Reports are saved in:
- HTML: `api-test-results/html-report/`
- JSON: `api-test-results/results.json`

## 🧪 Writing New Tests

1. Create a new test file in `tests/` directory
2. Import helpers and fixtures:
   ```typescript
   import { test, expect } from '@playwright/test';
   import { ApiClient } from '../helpers/ApiClient';
   import { TestUsers } from '../fixtures/testData';
   ```
3. Use the ApiClient for making requests:
   ```typescript
   const apiClient = new ApiClient(request);
   const response = await apiClient.post('/endpoint', data);
   ```
4. Add assertions using Playwright's expect

## 📝 Best Practices

- ✅ Use fixtures for test data (`testData.ts`)
- ✅ Use ApiClient helper for common operations
- ✅ Test both success and error scenarios
- ✅ Verify response status codes and body
- ✅ Clean up resources after tests
- ✅ Use unique identifiers (timestamps) for test data
- ✅ Test authentication for protected endpoints

## 🔐 Authentication

Protected endpoints require authentication. The tests handle this by:
1. Logging in before tests (`beforeAll`)
2. Extracting session cookie
3. Including cookie in subsequent requests

Example:
```typescript
const loginResponse = await apiClient.post('/login', credentials);
const sessionCookie = apiClient.extractSessionCookie(loginResponse);
const headers = apiClient.createAuthHeaders(sessionCookie);
```

## 🐛 Debugging

Enable verbose logging:
```bash
DEBUG=pw:api npm run test:api
```

Run single test:
```bash
npm run test:api -- -g "should login with valid credentials"
```
###
📋 Explicación del archivo api.config.ts
Este archivo configura Playwright específicamente para pruebas de API (diferentes de las pruebas E2E de UI). Vamos línea por línea:

1. Import y función base
    import { defineConfig } from '@playwright/test';
    export default defineConfig({ ... });
Por qué: defineConfig es una función helper de Playwright que proporciona type-safety y autocompletado en tu IDE. Garantiza que todas las opciones de configuración sean válidas.

2. Directorio de tests
Qué hace: Especifica dónde buscar los archivos de test.
Por qué: Los tests están en tests, y como el config está en config, necesitamos subir un nivel (..) y entrar a tests/.
Ruta absoluta resultante: tests

3. Timeouts
Por qué:

timeout: 30_000 - Tests de API son generalmente rápidos. 30 segundos es suficiente para:

Hacer la petición HTTP
Esperar la respuesta de la base de datos
Validar el resultado
Si un test tarda más, probablemente hay un problema
expect: { timeout: 5_000 } - Assertions como expect(response.status()).toBe(200) deben ser instantáneas. 5 segundos es más que suficiente y evita tests colgados.

4. Paralelización
Por qué:

fullyParallel: true - Los tests de API pueden correr al mismo tiempo porque cada uno crea sus propios datos únicos (usando Date.now() en los nombres).

workers:

Local (undefined): Usa todos los cores de tu CPU = tests más rápidos
CI (1): Solo 1 worker para evitar problemas de concurrencia en la base de datos compartida de GitHub Actions
Beneficio: Tests locales corren en ~10 segundos en vez de ~60 segundos.

5. Reintentos
Por qué:

Local (0): No reintentar. Si falla, quieres verlo inmediatamente para debuggear.
CI (2): Reintentar hasta 2 veces porque:
Fallos intermitentes de red
Problemas temporales de base de datos
Lentitud en el servidor de CI
Evita: "Flaky tests" que fallan por problemas de infraestructura, no por bugs reales.

6. Protección CI
Qué hace: Falla el build si encuentras test.only() en CI.

Por qué: Durante desarrollo usas test.only() para correr un solo test:

Si esto llega a CI, solo correría 1 test y los demás se saltarían silenciosamente.
forbidOnly previene este error.

7. Reportes
Por qué múltiples reportes:

list - Output en tiempo real en la consola:

html - Reporte visual interactivo para debugging:

Screenshots de fallos
Stack traces
Tiempos de ejecución
Filtros por estado (passed/failed)
open: 'never' - No abre el navegador automáticamente (lo abres manual con npx playwright show-report)

json - Máquina-readable para:

Integración con GitHub Actions
Análisis de tendencias
Dashboards personalizados
8. Configuración de requests
Por qué:

baseURL - Define el host base para todas las requests:

Beneficio: Cambiar el puerto o dominio en un solo lugar.

extraHTTPHeaders - Headers que se envían en TODAS las requests:

Por qué: Tu API espera JSON. Sin este header, Next.js podría no parsear el body correctamente.

trace: 'on-first-retry' - Graba un trace detallado solo cuando un test falla y se reintenta:

Por qué solo en retry: Los traces ocupan mucho espacio. Solo los necesitas para debuggear fallos intermitentes.

9. Web Server (Auto-start)
🔥 FEATURE MÁS IMPORTANTE - Auto-start del servidor:

Qué hace:

Antes de correr tests, Playwright ejecuta npm run dev
Espera a que http://localhost:3000 responda (max 120 segundos)
Corre todos los tests
Al terminar, mata el servidor automáticamente
Por qué cada opción:

command: 'npm run dev' - Levanta Next.js en modo desarrollo

url: 'http://localhost:3000' - Playwright hace polling a esta URL hasta que responda (health check)

reuseExistingServer: !process.env.CI:

Local (true): Si ya tienes el servidor corriendo en otra terminal, Playwright lo reutiliza (no inicia otro)
CI (false): Siempre inicia un servidor fresco para garantizar estado limpio
timeout: 120_000 - 2 minutos para que el servidor inicie:

Compilación de TypeScript
Build de Next.js
Conexión a PostgreSQL
Generación del cliente Prisma
Beneficio: ¡No necesitas iniciar el servidor manualmente! Solo corres:

Y Playwright se encarga de todo.

🎯 Comparación: API config vs E2E config
Configuración	API Tests	E2E Tests (UI)
testDir	tests	tests
timeout	30 segundos (rápido)	60+ segundos (navegador lento)
fullyParallel	true	false (conflictos de DB)
workers	Múltiples (local)	1 (evitar race conditions)
baseURL	http://localhost:3000	http://localhost:3000
extraHeaders	Content-Type: json	N/A (navegador las maneja)
trace	Solo en retry	Siempre en CI
Navegadores	❌ No usa navegador	✅ Chromium/Firefox/Safari
💡 ¿Por qué archivo separado?
Podrías tener una sola configuración, pero separarlos te da:
    npm run test:api          # Solo API tests  
    npm run playwright:test   # Solo E2E tests

✅ Claridad: Configuraciones específicas para cada tipo de test
✅ Performance: API tests con paralelización completa
✅ Reportes separados: test-results vs api-test-results/
✅ Ejecución selectiva:

🔧 Cómo Playwright usa esta configuración
Cuando corres:
    npx playwright test --config=api-tests/config/api.config.ts

Playwright:

✅ Lee api.config.ts
✅ Ejecuta npm run dev y espera a que localhost:3000 responda
✅ Busca tests en api-tests/tests/*.test.ts
✅ Corre cada test con baseURL = http://localhost:3000
✅ Genera reportes en api-test-results/
✅ Mata el servidor al terminar