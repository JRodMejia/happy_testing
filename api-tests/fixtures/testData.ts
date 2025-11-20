/**
 * Test data fixtures for API tests
 * Centralized test data management
 */

export const TestUsers = {
  validUser: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    nationality: 'USA',
    phone: '1234567890',
    password: 'Test123!',
  },
  existingUser: {
    email: 'test@nutriapp.com',
    password: 'nutriapp123',
  },
  invalidCredentials: {
    email: 'wrong@test.com',
    password: 'wrongpassword',
  },
};

export const TestDishes = {
  validDish: {
    name: 'Test Dish',
    description: 'A delicious test dish',
    prepTime: 15,
    cookTime: 30,
    quickPrep: false,
    imageUrl: 'https://example.com/dish.jpg',
    steps: ['Step 1: Prepare ingredients', 'Step 2: Cook', 'Step 3: Serve'],
    calories: 350,
  },
  minimalDish: {
    name: 'Minimal Dish',
    description: 'Simple test dish',
    prepTime: 5,
    cookTime: 10,
  },
  quickPrepDish: {
    name: 'Quick Salad',
    description: 'Fast and healthy',
    prepTime: 5,
    cookTime: 0,
    quickPrep: true,
    steps: ['Mix vegetables', 'Add dressing'],
    calories: 150,
  },
};

export const InvalidData = {
  missingFields: {
    name: 'Incomplete Dish',
    // Missing required fields
  },
  invalidEmail: {
    email: 'not-an-email',
    password: 'test123',
  },
};
