export const testUsers = {
  valid: {
    email: 'test@nutriapp.com',
    password: 'nutriapp123'
  },
  newUser: {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    nationality: 'México',
    phone: '+52123456789',
    password: 'TestPass123!'
  },
  invalid: {
    email: 'invalid@test.com',
    password: 'wrongpassword'
  }
};

export const testDishes = {
  valid: {
    name: 'Ensalada César',
    description: 'Ensalada fresca con pollo y aderezo césar',
    prepTime: 15,
    cookTime: 10,
    quickPrep: true
  },
  invalid: {
    name: '',
    description: '',
    prepTime: -5,
    cookTime: 0
  }
};