import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DishesPage } from '../pages/DishesPage';
import { testUsers } from '../helpers/testData';

test.describe('Login Page - Positive Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login page elements correctly', async ({ page }) => {
    await expect(loginPage.nutriappTitle).toBeVisible();
    await expect(loginPage.loginHeading).toHaveText('Bienvenido');
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.registerLink).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
    
    await expect(page).toHaveURL(/.*\/dishes/);
    await expect(dishesPage.dishesHeading).toBeVisible();
  });

  test('should navigate to register page when clicking register link', async ({ page }) => {
    await loginPage.clickRegisterLink();
    
    await expect(page).toHaveURL(/.*\/register/);
  });

  test('should show loading state when submitting', async ({ page }) => {
    await loginPage.emailInput.fill(testUsers.valid.email);
    await loginPage.passwordInput.fill(testUsers.valid.password);
    
    await loginPage.loginButton.click();
    await expect(loginPage.loginButton).toContainText('Ingresando...');
  });
});

test.describe('Login Page - Negative Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await loginPage.login(testUsers.invalid.email, testUsers.invalid.password);
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/Credenciales incorrectas/i);
  });

  test('should show error with empty email', async ({ page }) => {
    await loginPage.passwordInput.fill(testUsers.valid.password);
    await loginPage.loginButton.click();
    
    // HTML5 validation should prevent submission
    await expect(loginPage.emailInput).toHaveAttribute('required', '');
  });

  test('should show error with empty password', async ({ page }) => {
    await loginPage.emailInput.fill(testUsers.valid.email);
    await loginPage.loginButton.click();
    
    await expect(loginPage.passwordInput).toHaveAttribute('required', '');
  });

  test('should show error with invalid email format', async ({ page }) => {
    await loginPage.emailInput.fill('invalid-email');
    await loginPage.passwordInput.fill(testUsers.valid.password);
    
    // Check HTML5 validation
    const isInvalid = await loginPage.emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBeTruthy();
  });

  test('should not login with correct email but wrong password', async ({ page }) => {
    await loginPage.login(testUsers.valid.email, 'wrongpassword123');
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should disable button while loading', async ({ page }) => {
    await loginPage.emailInput.fill(testUsers.valid.email);
    await loginPage.passwordInput.fill(testUsers.valid.password);
    await loginPage.loginButton.click();
    
    await expect(loginPage.loginButton).toBeDisabled();
  });
});