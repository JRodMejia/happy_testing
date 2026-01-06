# Unit Tests - Estructura del Proyecto

## 📁 Estructura de Carpetas

```
src/
├── __tests__/                    # Tests globales y utilidades
│   ├── helpers/
│   │   └── test-utils.tsx       # Utilidades de testing reutilizables
│   ├── mocks/
│   │   ├── next-navigation.ts   # Mock de Next.js router
│   │   ├── next-image.tsx       # Mock de Next.js Image
│   │   └── fetch.ts             # Mock de fetch API
│   └── fixtures/
│       └── mock-data.ts         # Datos de prueba reutilizables
│
├── app/                          # Tests de componentes de páginas
│   ├── login/
│   │   ├── page.tsx
│   │   └── page.test.tsx        # ✅ Tests del LoginPage
│   ├── register/
│   │   ├── page.tsx
│   │   └── page.test.tsx        # ✅ Tests del RegisterPage
│   ├── dishes/
│   │   ├── page.tsx
│   │   └── page.test.tsx        # Tests del DishesPage
│   └── page.test.tsx            # ✅ Tests del HomePage
│
└── lib/                          # Tests de utilidades
    ├── utils.ts
    └── utils.test.ts            # ✅ Tests de funciones utilitarias
```

## 🎯 Tipos de Tests Creados

### 1. **Component Tests** (Componentes de React)
- `src/app/login/page.test.tsx`
- `src/app/register/page.test.tsx`
- `src/app/page.test.tsx`

**Qué testean:**
- Renderizado de elementos
- Interacciones del usuario
- Manejo de estados
- Llamadas a APIs
- Navegación

### 2. **Unit Tests** (Funciones puras)
- `src/lib/utils.test.ts`

**Qué testean:**
- Validaciones
- Transformaciones de datos
- Cálculos
- Formateo de strings/fechas

## 🛠️ Utilidades Creadas

### **test-utils.tsx**
```typescript
import { render, screen } from '@/__tests__/helpers/test-utils';

// Render con providers personalizados
renderWithProviders(<Component />);

// Setup para user events
const user = setupUser();

// Utilities comunes
testUtils.generateEmail();
testUtils.generateUsername();
testUtils.wait(1000);
```

### **mock-data.ts**
```typescript
import { mockUsers, mockDishes, generateTestData } from '@/__tests__/fixtures/mock-data';

// Usuarios predefinidos
mockUsers.valid
mockUsers.newUser
mockUsers.invalidCredentials

// Platos predefinidos
mockDishes.valid
mockDishes.dishList

// Generadores dinámicos
generateTestData.user({ firstName: 'Custom' });
generateTestData.dish({ name: 'Custom Dish' });
generateTestData.email();
```

### **Mocks Reutilizables**

#### **next-navigation.ts**
```typescript
import { mockRouter, resetRouterMock } from '@/__tests__/mocks/next-navigation';

// Uso en tests
expect(mockRouter.push).toHaveBeenCalledWith('/dishes');
resetRouterMock(); // Limpiar entre tests
```

#### **fetch.ts**
```typescript
import { 
  mockFetch, 
  mockFetchSuccess, 
  mockFetchError,
  resetFetchMock 
} from '@/__tests__/mocks/fetch';

// Mock respuesta exitosa
mockFetchSuccess({ data: 'success' });

// Mock respuesta con error
mockFetchError({ error: 'Failed' }, 400);

// Verificar llamadas
expect(mockFetch).toHaveBeenCalledWith('/api/login', {...});
```

## 📝 Convenciones de Nombrado

### **Archivos de Test**
- `*.test.tsx` - Tests de componentes React
- `*.test.ts` - Tests de funciones/utilidades

### **Estructura de Describe Blocks**
```typescript
describe('ComponentName - Component Tests', () => {
  describe('Rendering', () => {
    it('should render all elements', () => {});
  });

  describe('User Interactions', () => {
    it('should update input on user type', () => {});
  });

  describe('Form Submission', () => {
    it('should submit form successfully', () => {});
  });
});
```

## 🚀 Comandos de Testing

```bash
# Ejecutar todos los tests (watch mode)
npm test

# Ejecutar tests una vez
npm run test:run

# Abrir UI de Vitest
npm run test:ui

# Ver coverage
npm run test:coverage

# Ejecutar test específico
npm test login.test.tsx

# Watch mode específico
npm test -- --watch login.test.tsx
```

## ✅ Patrón AAA (Arrange-Act-Assert)

Todos los tests siguen este patrón:

```typescript
it('should do something', async () => {
  // Arrange - Preparar
  const user = userEvent.setup();
  render(<Component />);

  // Act - Actuar
  await user.type(screen.getByTestId('input'), 'value');
  await user.click(screen.getByTestId('button'));

  // Assert - Verificar
  expect(screen.getByTestId('result')).toHaveTextContent('expected');
});
```

## 🎨 Mejores Prácticas Implementadas

### 1. **Usar data-testid para seleccionar elementos**
```typescript
// ✅ Bueno
screen.getByTestId('login-button')

// ❌ Evitar
screen.getByText('Iniciar sesión') // Puede cambiar con traducción
```

### 2. **Resetear mocks entre tests**
```typescript
beforeEach(() => {
  resetFetchMock();
  resetRouterMock();
});
```

### 3. **Usar datos de mock centralizados**
```typescript
// ✅ Bueno
const testUser = mockUsers.valid;

// ❌ Evitar
const testUser = { email: 'test@test.com', password: '123' };
```

### 4. **Tests independientes**
- Cada test debe poder ejecutarse solo
- No depender del orden de ejecución
- Limpiar estado entre tests

### 5. **Nombres descriptivos**
```typescript
// ✅ Bueno
it('should show error message when login fails with invalid credentials', () => {});

// ❌ Evitar
it('test login', () => {});
```

## 📊 Coverage

Los tests cubren:

### **LoginPage**
- ✅ Renderizado de elementos
- ✅ Validación de inputs
- ✅ Manejo de estados (loading, error)
- ✅ Llamadas a API
- ✅ Redirección tras login exitoso
- ✅ Manejo de errores

### **RegisterPage**
- ✅ Renderizado de formulario completo
- ✅ Validación de campos requeridos
- ✅ Manejo de emails duplicados
- ✅ Estados de carga
- ✅ Redirección tras registro

### **HomePage**
- ✅ Renderizado de elementos
- ✅ Display de credenciales de prueba
- ✅ Link a login

### **Utils Functions**
- ✅ Validación de email
- ✅ Validación de contraseña
- ✅ Formateo de fechas
- ✅ Cálculos
- ✅ Truncado de texto

## 🔄 Flujo de Trabajo

1. **Escribir el test primero** (TDD opcional)
2. **Implementar la funcionalidad**
3. **Ejecutar tests en watch mode**
4. **Refactorizar**
5. **Verificar coverage**
6. **Commit con tests pasando**

## 📚 Recursos

### **Archivos Clave**
- `vitest.config.ts` - Configuración de Vitest
- `vitest.setup.ts` - Setup global (mocks, etc.)
- `tsconfig.json` - Alias de paths (@/__tests__)

### **Librerías Usadas**
- **Vitest** - Test runner
- **@testing-library/react** - Testing de componentes
- **@testing-library/user-event** - Simulación de eventos
- **@testing-library/jest-dom** - Matchers adicionales

## 🎯 Próximos Pasos

1. Crear tests para páginas de dishes (CRUD)
2. Agregar integration tests
3. Configurar CI/CD para ejecutar tests
4. Aumentar coverage a 80%+
5. Agregar tests de snapshots (opcional)

## 💡 Tips

- Ejecuta `npm run test:ui` para debugging visual
- Usa `screen.debug()` para ver el DOM en tests
- Usa `waitFor()` para operaciones asíncronas
- Mockea solo lo necesario
- Mantén tests simples y legibles
