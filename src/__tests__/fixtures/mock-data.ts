/**
 * Test data fixtures for unit tests
 */

export const mockUsers = {
  valid: {
    email: 'test@nutriapp.com',
    password: 'nutriapp123',
    firstName: 'Test',
    lastName: 'User',
  },
  admin: {
    email: 'admin@nutriapp.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
  },
  newUser: {
    firstName: 'New',
    lastName: 'User',
    email: 'newuser@example.com',
    nationality: 'México',
    phone: '+52123456789',
    password: 'NewUser123!',
  },
  invalidCredentials: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
};

export const mockDishes = {
  valid: {
    id: 1,
    name: 'Ensalada César',
    description: 'Ensalada fresca con pollo y aderezo césar',
    prepTime: 15,
    cookTime: 10,
    quickPrep: true,
    imageUrl: 'https://example.com/caesar-salad.jpg',
  },
  anotherDish: {
    id: 2,
    name: 'Pollo Asado',
    description: 'Pollo marinado asado al horno',
    prepTime: 20,
    cookTime: 45,
    quickPrep: false,
    imageUrl: 'https://example.com/grilled-chicken.jpg',
  },
  dishList: [
    {
      id: 1,
      name: 'Ensalada César',
      description: 'Ensalada fresca',
      prepTime: 15,
      cookTime: 10,
      quickPrep: true,
    },
    {
      id: 2,
      name: 'Pollo Asado',
      description: 'Pollo marinado',
      prepTime: 20,
      cookTime: 45,
      quickPrep: false,
    },
    {
      id: 3,
      name: 'Sopa de Verduras',
      description: 'Sopa nutritiva',
      prepTime: 10,
      cookTime: 30,
      quickPrep: true,
    },
  ],
  invalidDish: {
    name: '',
    description: '',
    prepTime: -5,
    cookTime: -10,
  },
};

export const mockApiResponses = {
  loginSuccess: {
    ok: true,
    status: 200,
    json: async () => ({ message: 'Login successful', token: 'mock-token-123' }),
  },
  loginFailure: {
    ok: false,
    status: 401,
    json: async () => ({ error: 'Credenciales incorrectas' }),
  },
  registerSuccess: {
    ok: true,
    status: 201,
    json: async () => ({ message: 'User registered successfully' }),
  },
  registerFailure: {
    ok: false,
    status: 400,
    json: async () => ({ error: 'Email already exists' }),
  },
  dishesSuccess: {
    ok: true,
    status: 200,
    json: async () => ({ dishes: mockDishes.dishList }),
  },
  dishesEmpty: {
    ok: true,
    status: 200,
    json: async () => ({ dishes: [] }),
  },
  serverError: {
    ok: false,
    status: 500,
    json: async () => ({ error: 'Internal server error' }),
  },
  unauthorized: {
    ok: false,
    status: 401,
    json: async () => ({ error: 'Unauthorized' }),
  },
};

export const mockFormData = {
  login: {
    valid: {
      email: 'test@nutriapp.com',
      password: 'nutriapp123',
    },
    invalid: {
      email: 'invalid@test.com',
      password: 'wrongpass',
    },
    emptyEmail: {
      email: '',
      password: 'password123',
    },
    emptyPassword: {
      email: 'test@example.com',
      password: '',
    },
  },
  register: {
    valid: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      nationality: 'USA',
      phone: '+1234567890',
      password: 'JohnDoe123!',
    },
    missingFields: {
      firstName: '',
      lastName: 'Doe',
      email: 'john@example.com',
      nationality: 'USA',
      phone: '+1234567890',
      password: 'password',
    },
  },
  dish: {
    valid: {
      name: 'New Dish',
      description: 'A delicious new dish',
      prepTime: 15,
      cookTime: 30,
      quickPrep: true,
      imageUrl: 'https://example.com/dish.jpg',
    },
    minimal: {
      name: 'Minimal Dish',
      description: 'Basic dish',
      prepTime: 10,
      cookTime: 20,
    },
    invalid: {
      name: '',
      description: 'Missing name',
      prepTime: -5,
      cookTime: -10,
    },
  },
};

/**
 * Generate dynamic test data
 */
export const generateTestData = {
  user: (overrides = {}) => ({
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    nationality: 'México',
    phone: '+52123456789',
    password: 'Test123!',
    ...overrides,
  }),
  
  dish: (overrides = {}) => ({
    name: `Dish ${Date.now()}`,
    description: 'Test dish description',
    prepTime: 15,
    cookTime: 30,
    quickPrep: true,
    imageUrl: 'https://example.com/test.jpg',
    ...overrides,
  }),
  
  email: () => `test${Date.now()}@example.com`,
  
  username: () => `user${Date.now()}`,
};
