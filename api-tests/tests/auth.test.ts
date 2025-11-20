import { test, expect } from '@playwright/test';
import { ApiClient } from '../helpers/ApiClient';
import { TestUsers } from '../fixtures/testData';

test.describe('Authentication API', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test.describe('POST /api/register', () => {
    test('should register a new user successfully', async () => {
      const uniqueEmail = `user_${Date.now()}@test.com`;
      const userData = {
        ...TestUsers.validUser,
        email: uniqueEmail,
      };

      const response = await apiClient.post('/api/register', userData);

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe(uniqueEmail);
      expect(body.user.firstName).toBe(userData.firstName);
      expect(body.user.password).toBeUndefined(); // Password should not be returned
    });

    test('should return 400 when required fields are missing', async () => {
      const response = await apiClient.post('/api/register', {
        email: 'test@test.com',
        password: 'test123',
        // Missing other required fields
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.error).toBe('Missing fields');
    });

    test('should return 409 when email already exists', async () => {
      const response = await apiClient.post('/api/register', TestUsers.existingUser);

      expect(response.status()).toBe(409);
      const body = await response.json();
      expect(body.error).toBe('El email ya está registrado');
    });
  });

  test.describe('POST /api/login', () => {
    test('should login with valid credentials', async () => {
      const response = await apiClient.post('/login', {
        email: TestUsers.existingUser.email,
        password: TestUsers.existingUser.password,
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe(TestUsers.existingUser.email);

      // Verify session cookie is set
      const sessionCookie = apiClient.extractSessionCookie(response);
      expect(sessionCookie).toBeTruthy();
    });

    test('should return 400 when credentials are missing', async () => {
      const response = await apiClient.post('/login', {
        email: 'test@test.com',
        // Missing password
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.error).toBe('Missing fields');
    });

    test('should return 401 with invalid email', async () => {
      const response = await apiClient.post('/login', {
        email: 'nonexistent@test.com',
        password: 'anypassword',
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('Invalid credentials');
    });

    test('should return 401 with invalid password', async () => {
      const response = await apiClient.post('/login', {
        email: TestUsers.existingUser.email,
        password: 'wrongpassword',
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('Invalid credentials');
    });
  });

  test.describe('POST /api/logout', () => {
    test('should logout and clear session cookie', async () => {
      const response = await apiClient.post('/api/logout', {});

      // Expect redirect status
      expect([302, 307]).toContain(response.status());
      
      // Verify session cookie is cleared
      const cookies = response.headers()['set-cookie'];
      expect(cookies).toContain('session=');
      expect(cookies).toContain('expires=Thu, 01 Jan 1970'); // Cookie expired
    });
  });
});
