import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { testUsers } from '../helpers/testData';

test.describe('Register Page - Positive Tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should display register page elements correctly', async () => {
    await expect(registerPage.registerHeading).toHaveText('Crear cuenta');
    await expect(registerPage.firstNameInput).toBeVisible();
    await expect(registerPage.lastNameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.nationalityInput).toBeVisible();
    await expect(registerPage.phoneInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.registerButton).toBeEnabled();
    await expect(registerPage.loginLink).toBeVisible();
  });

  test('should register new user successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const newUser = {
      ...testUsers.newUser,
      email: `test${Date.now()}@example.com`
    };
    
    await registerPage.register(newUser);
    
    await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
    await expect(loginPage.loginHeading).toBeVisible();
  });

  test('should navigate to login page when clicking login link', async ({ page }) => {
    await registerPage.clickLoginLink();
    
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should show loading state when submitting', async () => {
    const newUser = {
      ...testUsers.newUser,
      email: `test${Date.now()}@example.com`
    };
    
    await registerPage.firstNameInput.fill(newUser.firstName);
    await registerPage.lastNameInput.fill(newUser.lastName);
    await registerPage.emailInput.fill(newUser.email);
    await registerPage.nationalityInput.fill(newUser.nationality);
    await registerPage.phoneInput.fill(newUser.phone);
    await registerPage.passwordInput.fill(newUser.password);
    
    await registerPage.registerButton.click();
    await expect(registerPage.registerButton).toContainText('Registrando...');
  });
});

test.describe('Register Page - Negative Tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should show error when registering with existing email', async () => {
    await registerPage.register({
      ...testUsers.newUser,
      email: testUsers.valid.email // existing user
    });
    
    await expect(registerPage.errorMessage).toBeVisible();
  });

  test('should require all fields to be filled', async () => {
    await registerPage.registerButton.click();
    
    await expect(registerPage.firstNameInput).toHaveAttribute('required', '');
    await expect(registerPage.lastNameInput).toHaveAttribute('required', '');
    await expect(registerPage.emailInput).toHaveAttribute('required', '');
    await expect(registerPage.nationalityInput).toHaveAttribute('required', '');
    await expect(registerPage.phoneInput).toHaveAttribute('required', '');
    await expect(registerPage.passwordInput).toHaveAttribute('required', '');
  });

  test('should validate email format', async () => {
    await registerPage.firstNameInput.fill(testUsers.newUser.firstName);
    await registerPage.lastNameInput.fill(testUsers.newUser.lastName);
    await registerPage.emailInput.fill('invalid-email');
    await registerPage.nationalityInput.fill(testUsers.newUser.nationality);
    await registerPage.phoneInput.fill(testUsers.newUser.phone);
    await registerPage.passwordInput.fill(testUsers.newUser.password);
    
    const isInvalid = await registerPage.emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBeTruthy();
  });

  test('should not register with missing first name', async () => {
    await registerPage.register({
      firstName: '',
      lastName: testUsers.newUser.lastName,
      email: `test${Date.now()}@example.com`,
      nationality: testUsers.newUser.nationality,
      phone: testUsers.newUser.phone,
      password: testUsers.newUser.password
    });
    
    await expect(registerPage.firstNameInput).toHaveAttribute('required', '');
  });

  test('should not register with missing last name', async () => {
    await registerPage.register({
      firstName: testUsers.newUser.firstName,
      lastName: '',
      email: `test${Date.now()}@example.com`,
      nationality: testUsers.newUser.nationality,
      phone: testUsers.newUser.phone,
      password: testUsers.newUser.password
    });
    
    await expect(registerPage.lastNameInput).toHaveAttribute('required', '');
  });

  test('should disable button while loading', async () => {
    const newUser = {
      ...testUsers.newUser,
      email: `test${Date.now()}@example.com`
    };
    
    await registerPage.register(newUser);
    await expect(registerPage.registerButton).toBeDisabled();
  });
});