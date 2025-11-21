# Cypress API Tests

## 📋 Estructura

```
cypress/
├── e2e/
│   └── api/
│       ├── auth-api.cy.js           # Tests de autenticación
│       └── dishes-api.cy.js         # Tests CRUD de dishes
├── fixtures/
│   └── api/
│       ├── users.json               # Datos de prueba de usuarios
│       └── dishes.json              # Datos de prueba de dishes
└── support/
    ├── commands/
    │   └── apiCommands.js           # Comandos personalizados de API
    └── helpers/
        └── apiHelpers.js            # Funciones auxiliares
```

## 🧪 Tests Implementados

### Authentication API (`auth-api.cy.js`)

**POST /api/register**
- ✅ Registro exitoso con datos válidos
- ✅ Falla cuando falta email
- ✅ Falla cuando falta password
- ✅ Falla con email duplicado

**POST /api/login**
- ✅ Login exitoso con credenciales válidas
- ✅ Falla con email inválido
- ✅ Falla con password inválido
- ✅ Falla cuando falta email
- ✅ Falla cuando falta password

**POST /api/logout**
- ✅ Logout exitoso
- ✅ Limpia session cookie

**Total: 10 tests de autenticación**

---

### Dishes CRUD API (`dishes-api.cy.js`)

**GET /api/dishes**
- ✅ Obtiene todos los dishes cuando está autenticado
- ✅ Falla cuando no está autenticado

**POST /api/dishes**
- ✅ Crea dish con todos los campos
- ✅ Crea dish con campos mínimos
- ✅ Crea dish de preparación rápida
- ✅ Falla cuando falta el nombre
- ✅ Falla cuando no está autenticado

**GET /api/dishes/:id**
- ✅ Obtiene dish específico por ID
- ✅ Retorna 404 para dish inexistente
- ✅ Falla cuando no está autenticado

**PUT /api/dishes/:id**
- ✅ Actualiza dish exitosamente
- ✅ Actualiza solo campos específicos
- ✅ Falla cuando no está autenticado

**DELETE /api/dishes/:id**
- ✅ Elimina dish exitosamente
- ✅ Retorna 404 para dish inexistente
- ✅ Falla cuando no está autenticado

**Flujo CRUD Completo**
- ✅ Ciclo completo: CREATE → READ → UPDATE → DELETE

**Total: 17 tests de dishes**

---

## 🔧 Comandos Personalizados

### Autenticación
```javascript
cy.apiRegister(userData)           // Registrar usuario
cy.apiLogin(email, password)       // Login
cy.apiLogout()                     // Logout
cy.apiSetupAuth(email, password)   // Setup autenticación
```

### Dishes
```javascript
cy.apiGetDishes()                  // Obtener todos los dishes
cy.apiGetDish(dishId)              // Obtener dish por ID
cy.apiCreateDish(dishData)         // Crear nuevo dish
cy.apiUpdateDish(dishId, data)     // Actualizar dish
cy.apiDeleteDish(dishId)           // Eliminar dish
cy.apiCleanupDishes()              // Limpiar dishes de test
```

## 🛠️ Helpers Disponibles

### Validación
```javascript
validateUserResponse(user)         // Valida estructura de user
validateDishResponse(dish)         // Valida estructura de dish
validateErrorResponse(res, status) // Valida respuesta de error
```

### Utilidades
```javascript
generateUniqueEmail(prefix)        // Email único para tests
generateUniqueDishName(prefix)     // Nombre único de dish
extractSessionCookie(response)     // Extrae session cookie
waitForApi(maxRetries)             // Espera a que API esté lista
compareObjects(obj1, obj2, exclude) // Compara objetos
```

## 🚀 Ejecutar Tests

### Todos los tests de API
```bash
npx cypress run --spec "cypress/e2e/api/**/*.cy.js"
```

### Solo autenticación
```bash
npx cypress run --spec "cypress/e2e/api/auth-api.cy.js"
```

### Solo dishes
```bash
npx cypress run --spec "cypress/e2e/api/dishes-api.cy.js"
```

### Modo interactivo
```bash
npx cypress open
```

## 📊 Fixtures

### Users (`cypress/fixtures/api/users.json`)
```json
{
  "validUser": {
    "email": "cypress_user@test.com",
    "password": "SecurePassword123!",
    "firstName": "Cypress",
    "lastName": "User"
  }
}
```

### Dishes (`cypress/fixtures/api/dishes.json`)
```json
{
  "validDish": {
    "name": "Cypress Test Dish",
    "description": "A delicious test dish",
    "ingredients": "Test ingredients",
    "steps": "1. Mix\n2. Cook\n3. Serve",
    "calories": 350,
    "preparationTime": 30,
    "quickPrep": false
  }
}
```

## 🎯 Características

### ✅ Buenas Prácticas Implementadas

1. **Separación de Concerns**
   - Tests en `e2e/api/`
   - Comandos en `support/commands/`
   - Helpers en `support/helpers/`
   - Datos en `fixtures/api/`

2. **Reutilización de Código**
   - Comandos personalizados para operaciones comunes
   - Helpers para validaciones
   - Fixtures para datos de prueba

3. **Mantenibilidad**
   - Tests claros y descriptivos
   - Nomenclatura consistente
   - Organización lógica

4. **Limpieza Automática**
   - `apiCleanupDishes()` elimina datos de test
   - Hooks `before`/`after` para setup/teardown

5. **Validación Robusta**
   - Valida estructura de respuestas
   - Verifica códigos de estado
   - Comprueba errores esperados

6. **Autenticación Manejada**
   - Setup automático de sesión
   - Reutilización de cookies
   - Tests de autorización

## 📈 Cobertura

- **Authentication**: 10 test cases
- **Dishes CRUD**: 17 test cases
- **Total**: 27 test cases

### Escenarios Cubiertos
- ✅ Casos exitosos (happy path)
- ✅ Validación de campos requeridos
- ✅ Manejo de errores (4xx)
- ✅ Autorización (401)
- ✅ Not found (404)
- ✅ Flujos completos end-to-end

## 🔍 Próximos Pasos

Para expandir la cobertura de tests API:

1. **Validación de Datos**
   - Tests de límites (min/max values)
   - Tests de tipos de datos
   - Tests de formato de campos

2. **Casos Edge**
   - Nombres muy largos
   - Caracteres especiales
   - Valores negativos

3. **Performance**
   - Tests de carga
   - Tests de concurrencia
   - Timeouts

4. **Seguridad**
   - XSS prevention
   - SQL injection tests
   - CSRF protection
