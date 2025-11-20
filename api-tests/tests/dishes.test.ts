import { test, expect } from '@playwright/test';
import { ApiClient } from '../helpers/ApiClient';
import { TestUsers, TestDishes } from '../fixtures/testData';

test.describe('Dishes API', () => {
  let apiClient: ApiClient;
  let sessionCookie: string;

  // Login before all tests to get session
  test.beforeAll(async ({ request }) => {
    apiClient = new ApiClient(request);
    const loginResponse = await apiClient.post('/api/login', {
      email: TestUsers.existingUser.email,
      password: TestUsers.existingUser.password,
    });
    sessionCookie = apiClient.extractSessionCookie(loginResponse) || '';
  });

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test.describe('GET /api/dishes', () => {
    test('should get all dishes for authenticated user', async () => {
      const headers = apiClient.createAuthHeaders(sessionCookie);
      const response = await apiClient.get('/api/dishes', headers);

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.dishes).toBeDefined();
      expect(Array.isArray(body.dishes)).toBe(true);
    });

    test('should return 401 when not authenticated', async () => {
      const response = await apiClient.get('/api/dishes');

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('No autorizado');
    });
  });

  test.describe('POST /api/dishes', () => {
    test('should create a new dish successfully', async () => {
      const headers = apiClient.createAuthHeaders(sessionCookie);
      const dishData = {
        ...TestDishes.validDish,
        name: `Test Dish ${Date.now()}`, // Unique name
      };

      const authResponse = await apiClient.request.post('/api/dishes', {
        data: dishData,
        headers,
      });

      expect(authResponse.status()).toBe(200);
      const body = await authResponse.json();
      expect(body.dish).toBeDefined();
      expect(body.dish.name).toBe(dishData.name);
      expect(body.dish.description).toBe(dishData.description);
      expect(body.dish.prepTime).toBe(dishData.prepTime);
      expect(body.dish.cookTime).toBe(dishData.cookTime);
      expect(body.dish.quickPrep).toBe(dishData.quickPrep);
      expect(body.dish.calories).toBe(dishData.calories);
    });

    test('should create dish with minimal required fields', async () => {
      const headers = apiClient.createAuthHeaders(sessionCookie);
      const dishData = {
        ...TestDishes.minimalDish,
        name: `Minimal Dish ${Date.now()}`,
      };

      const response = await apiClient.request.post('/api/dishes', {
        data: dishData,
        headers,
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.dish).toBeDefined();
      expect(body.dish.calories).toBeNull(); // Optional field should be null
      expect(body.dish.quickPrep).toBe(false); // Default value
    });

    test('should return 400 when required fields are missing', async () => {
      const headers = apiClient.createAuthHeaders(sessionCookie);
      const response = await apiClient.request.post('/api/dishes', {
        data: {
          name: 'Incomplete Dish',
          // Missing description, prepTime, cookTime
        },
        headers,
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.error).toBe('Missing fields');
    });

    test('should return 401 when not authenticated', async () => {
      const response = await apiClient.post('/api/dishes', TestDishes.validDish);

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('No autorizado');
    });
  });

  test.describe('GET /api/dishes/:id', () => {
    let createdDishId: number;

    test.beforeAll(async ({ request }) => {
      // Create a dish to test GET by ID
      const headers = apiClient.createAuthHeaders(sessionCookie);
      const response = await request.post('/api/dishes', {
        data: {
          ...TestDishes.validDish,
          name: `Test Dish for GET ${Date.now()}`,
        },
        headers,
      });
      const body = await response.json();
      createdDishId = body.dish.id;
    });

    test('should get dish by ID', async ({ request }) => {
      const headers = apiClient.createAuthHeaders(sessionCookie);
      const response = await request.get(`/api/dishes/${createdDishId}`, {
        headers,
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.dish).toBeDefined();
      expect(body.dish.id).toBe(createdDishId);
    });

    test('should return 401 when not authenticated', async ({ request }) => {
      const response = await request.get(`/api/dishes/${createdDishId}`);

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('No autorizado');
    });

    test('should return 404 for non-existent dish', async ({ request }) => {
      const headers = apiClient.createAuthHeaders(sessionCookie);
      const response = await request.get('/api/dishes/999999', {
        headers,
      });

      expect(response.status()).toBe(404);
      const body = await response.json();
      expect(body.error).toContain('no encontrado');
    });
  });

  test.describe('PUT /api/dishes/:id', () => {
    let dishToUpdate: { id: string; name: string };

    test.beforeAll(async ({ request }) => {
      // Create a dish to test UPDATE
      const headers = apiClient.createAuthHeaders(sessionCookie);
      const response = await request.post('/api/dishes', {
        data: {
          ...TestDishes.validDish,
          name: `Dish to Update ${Date.now()}`,
        },
        headers,
      });
      const body = await response.json();
      dishToUpdate = body.dish;
    });

    test('should update dish successfully', async ({ request }) => {
      const headers = apiClient.createAuthHeaders(sessionCookie);
      const updatedData = {
        ...dishToUpdate,
        name: `Updated Dish ${Date.now()}`,
        description: 'Updated description',
        calories: 500,
      };

      const response = await request.put(`/api/dishes/${dishToUpdate.id}`, {
        data: updatedData,
        headers,
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.dish.name).toBe(updatedData.name);
      expect(body.dish.description).toBe(updatedData.description);
      expect(body.dish.calories).toBe(500);
    });

    test('should return 401 when not authenticated', async ({ request }) => {
      const response = await request.put(`/api/dishes/${dishToUpdate.id}`, {
        data: { name: 'Updated Name' },
      });

      expect(response.status()).toBe(401);
    });
  });

  test.describe('DELETE /api/dishes/:id', () => {
    let dishToDelete: { id: string; name: string };

    test.beforeEach(async ({ request }) => {
      // Create a fresh dish to delete for each test
      const headers = apiClient.createAuthHeaders(sessionCookie);
      const response = await request.post('/api/dishes', {
        data: {
          ...TestDishes.validDish,
          name: `Dish to Delete ${Date.now()}`,
        },
        headers,
      });
      const body = await response.json();
      dishToDelete = body.dish;
    });

    test('should delete dish successfully', async ({ request }) => {
      const headers = apiClient.createAuthHeaders(sessionCookie);
      const response = await request.delete(`/api/dishes/${dishToDelete.id}`, {
        headers,
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);

      // Verify dish is actually deleted
      const getResponse = await request.get(`/api/dishes/${dishToDelete.id}`, {
        headers,
      });
      expect(getResponse.status()).toBe(404);
    });

    test('should return 401 when not authenticated', async ({ request }) => {
      const response = await request.delete(`/api/dishes/${dishToDelete.id}`);

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('No autorizado');
    });

    test('should return 404 when deleting non-existent dish', async ({ request }) => {
      const headers = apiClient.createAuthHeaders(sessionCookie);
      const response = await request.delete('/api/dishes/999999', {
        headers,
      });

      expect(response.status()).toBe(404);
    });
  });
});
