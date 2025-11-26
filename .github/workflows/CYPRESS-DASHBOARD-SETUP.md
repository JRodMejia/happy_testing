# 📊 Cypress Dashboard Integration Guide

Esta guía explica cómo configurar y utilizar Cypress Dashboard (Cypress Cloud) para monitoreo avanzado de pruebas en CI/CD.

## 🎯 Beneficios del Cypress Dashboard

### Características Principales:
- ✅ **Grabación de Videos**: Videos automáticos de todas las ejecuciones
- ✅ **Screenshots**: Capturas en failures y en cada paso
- ✅ **Test Analytics**: Métricas detalladas de velocidad y estabilidad
- ✅ **Paralelización**: Distribución automática de tests
- ✅ **Flaky Test Detection**: Identifica tests inconsistentes
- ✅ **Historical Data**: Historial completo de ejecuciones
- ✅ **GitHub Integration**: Comentarios automáticos en PRs
- ✅ **Test Replay**: Debugging con time-travel
- ✅ **Smart Orchestration**: Orden óptimo de ejecución

### Planes Disponibles:
- **Free**: 500 test results/mes
- **Team**: 10,000 test results/mes ($75/mes)
- **Business**: 50,000+ test results/mes (custom pricing)

## 🚀 Configuración Paso a Paso

### 1. Crear Cuenta en Cypress Cloud

1. Ve a [https://cloud.cypress.io](https://cloud.cypress.io)
2. Regístrate con tu cuenta de GitHub
3. Crea una nueva organización (o usa la existente)

### 2. Crear Proyecto en Cypress Cloud

```bash
# Opción A: Desde la web
1. Click en "Create New Project"
2. Selecciona "Connect to GitHub"
3. Elige el repositorio: JRodMejia/happy_testing
4. Cypress generará un Project ID y Record Key

# Opción B: Desde terminal
npx cypress open
# En la interfaz: Settings > Project Settings > Record Runs
# Click en "Set up project to record"
```

### 3. Obtener el Record Key

**Desde Cypress Cloud:**
```
1. Ve a: Project Settings > Record Keys
2. Copia el "Record Key"
3. NO compartas esta key públicamente
```

**La key tiene este formato:**
```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 4. Configurar GitHub Secret

**En tu repositorio de GitHub:**

```bash
1. Ve a: Settings > Secrets and variables > Actions
2. Click en "New repository secret"
3. Name: CYPRESS_RECORD_KEY
4. Value: [pega tu record key aquí]
5. Click en "Add secret"
```

### 5. Verificar Configuración Local

El archivo `cypress.config.js` ya está configurado:

```javascript
export default defineConfig({
  e2e: {
    projectId: 'abfpdf',  // ✅ Ya configurado
    video: true,           // ✅ Habilitado para Dashboard
    // ... resto de configuración
  },
});
```

**Si el projectId es diferente, actualízalo:**
```javascript
projectId: 'tu-nuevo-project-id',
```

## 📋 Configuración del Workflow (Ya Implementado)

El archivo `.github/workflows/main-ci.yml` ya incluye:

### Cypress API Tests:
```yaml
- name: Run Cypress API tests
  run: npx cypress run --spec 'cypress/e2e/api/**/*.cy.js' --record --parallel --ci-build-id ${{ github.sha }}-${{ github.run_number }}
  env:
    CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Cypress E2E Tests:
```yaml
- name: Run Cypress E2E tests
  run: npx cypress run --spec 'cypress/e2e/tests/**/*.cy.js' --record --parallel --ci-build-id ${{ github.sha }}-${{ github.run_number }}
  env:
    CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Parámetros Explicados:

- `--record`: Envía resultados a Cypress Dashboard
- `--parallel`: Habilita ejecución paralela
- `--ci-build-id`: ID único para agrupar runs paralelos
- `${{ github.sha }}-${{ github.run_number }}`: Build ID único por commit + run

## 🎬 Videos y Artifacts

### Videos en Dashboard:
```yaml
video: true  # Habilita grabación automática
```

### Videos como GitHub Artifacts (backup):
```yaml
- name: Upload Cypress videos
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: cypress-videos
    path: cypress/videos
    retention-days: 7
```

**Nota:** Los videos se suben tanto al Dashboard como a GitHub Artifacts para redundancia.

## 🧪 Prueba Local con Dashboard

### Ejecutar con Record Localmente:

```bash
# Set your record key
$env:CYPRESS_RECORD_KEY="your-record-key-here"

# Run with recording
npx cypress run --record

# Run specific suite
npx cypress run --spec "cypress/e2e/api/**/*.cy.js" --record

# Con UI
npx cypress open
# Luego en la UI: Runs > Connect to Cypress Cloud
```

## 📊 Visualizar Resultados en Dashboard

### Después de cada CI run:

1. **En GitHub Actions:**
   - Ve al workflow run
   - En los logs verás: "View run details at: https://cloud.cypress.io/projects/abfpdf/runs/..."
   - Click en el link

2. **En Cypress Cloud:**
   - Dashboard > Projects > happy_testing
   - Verás:
     - ✅ Test results (passed/failed)
     - 📹 Videos de cada test
     - 📸 Screenshots
     - ⏱️ Duración y performance
     - 📈 Trends históricos

### Features Avanzados:

**Test Replay:**
```
- Click en cualquier test
- Ver video frame-by-frame
- Inspeccionar DOM en cada step
- Ver console logs y network requests
```

**Flaky Test Detection:**
```
- Dashboard marca tests inconsistentes
- Muestra porcentaje de éxito
- Historial de failures
```

**Analytics:**
```
- Slowest tests
- Most common failures
- Test suite health score
- Performance trends
```

## 🔧 Configuración Avanzada

### Parallel Runs (Multiple Machines):

Para ejecutar en múltiples workers:

```yaml
strategy:
  matrix:
    containers: [1, 2, 3, 4]

steps:
  - name: Run Cypress
    run: npx cypress run --record --parallel --ci-build-id ${{ github.sha }}
```

### Group Tests:

```bash
# API Tests group
npx cypress run --spec "cypress/e2e/api/**" --record --group "API" --parallel

# E2E Tests group
npx cypress run --spec "cypress/e2e/tests/**" --record --group "E2E" --parallel
```

### Tag Builds:

```bash
npx cypress run --record --tag "nightly,regression,prod"
```

## 🔐 Seguridad

### ⚠️ NUNCA expongas el Record Key:

❌ **Mal:**
```yaml
env:
  CYPRESS_RECORD_KEY: "1234-5678-abcd"  # NO!
```

✅ **Bien:**
```yaml
env:
  CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```

### Rotar Keys:

Si tu key se compromete:
```
1. Cypress Cloud > Project Settings > Record Keys
2. Delete old key
3. Create new key
4. Update GitHub secret
```

## 📱 Notificaciones

### GitHub Status Checks:

Cypress Dashboard automáticamente:
- ✅ Crea status checks en PRs
- 📝 Comenta resultados en PRs
- 🔗 Link directo al Dashboard

### Slack Integration:

```
1. Cypress Cloud > Project Settings > Integrations
2. Connect Slack
3. Configura notificaciones:
   - Test failures
   - Flaky tests detected
   - Completed runs
```

## 🎯 Troubleshooting

### Error: "Missing record key"

```bash
# Verifica que el secret existe
GitHub Repo > Settings > Secrets > CYPRESS_RECORD_KEY debe existir

# En local, verifica la variable
echo $env:CYPRESS_RECORD_KEY
```

### Error: "Could not find project with ID"

```javascript
// Verifica cypress.config.js
projectId: 'abfpdf'  // Debe coincidir con Cypress Cloud
```

### Error: "Parallel run failed"

```yaml
# Asegúrate de usar el mismo ci-build-id
--ci-build-id ${{ github.sha }}-${{ github.run_number }}
```

### Videos no se suben:

```javascript
// cypress.config.js
video: true,  // Debe ser true

// Workflow
if: always()  // No usar if: failure() para videos
```

## 📈 Métricas y Reporting

### KPIs en Dashboard:

1. **Test Duration**: Tiempo promedio por test
2. **Success Rate**: % de tests que pasan
3. **Flake Rate**: % de tests inconsistentes
4. **Top Failures**: Tests que más fallan

### Export Data:

```bash
# API de Cypress Cloud
curl -H "x-api-key: your-api-key" \
  https://api.cypress.io/projects/abfpdf/runs
```

## 💰 Costo y Límites

### Plan Free (Actual):
```
✅ 500 test results/mes
✅ 3 usuarios
✅ Data retention: 30 días
✅ Parallelization: hasta 4 machines
```

### Monitorear Uso:
```
Dashboard > Organization > Usage
- Test results used
- Storage used
- Bandwidth
```

## 🎓 Recursos Adicionales

- 📚 [Cypress Cloud Docs](https://docs.cypress.io/guides/cloud/introduction)
- 🎥 [Dashboard Tutorials](https://learn.cypress.io)
- 💬 [Discord Community](https://discord.gg/cypress)
- 📖 [Best Practices](https://docs.cypress.io/guides/references/best-practices)

## ✅ Checklist de Configuración

- [ ] Cuenta en Cypress Cloud creada
- [ ] Proyecto conectado a GitHub repo
- [ ] Project ID verificado en `cypress.config.js`
- [ ] Record Key obtenido de Cypress Cloud
- [ ] Secret `CYPRESS_RECORD_KEY` configurado en GitHub
- [ ] Workflow actualizado con `--record --parallel`
- [ ] Videos habilitados (`video: true`)
- [ ] Push a GitHub y verificar CI
- [ ] Verificar resultados en Cypress Dashboard
- [ ] Configurar notificaciones (opcional)
- [ ] Configurar GitHub integration (opcional)

---

**🎉 Una vez configurado, cada CI run automáticamente:**
- Graba videos
- Toma screenshots
- Sube a Dashboard
- Genera reportes
- Detecta flaky tests
- Muestra trends y analytics
