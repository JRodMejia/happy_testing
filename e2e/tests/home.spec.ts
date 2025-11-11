import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Home Page - Positive Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display home page elements correctly', async ({ page }) => {
    await expect(homePage.homeHeading).toBeVisible();
    await expect(homePage.homeHeading).toHaveText('Welcome to NutriApp!');
    await expect(homePage.homeDescription).toBeVisible();
    await expect(homePage.testEmailValue).toBeVisible();
    await expect(homePage.testPasswordValue).toBeVisible();
    await expect(homePage.loginButton).toBeVisible();
  });

  test('should display test credentials', async ({ page }) => {
    await expect(homePage.testEmailValue).toHaveText('test@nutriapp.com');
    await expect(homePage.testPasswordValue).toHaveText('nutriapp123');
  });

  test('should navigate to login page when clicking login button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await homePage.clickLoginButton();
    
    await expect(page).toHaveURL(/.*\/login/);
    await expect(loginPage.loginHeading).toBeVisible();
  });

  test('should have correct link href for login button', async ({ page }) => {
    const loginButton = homePage.loginButton;
    await expect(loginButton).toHaveAttribute('href', '/login');
  });
});

test.describe('Home Page - Negative Tests', () => {
  test('should handle direct navigation to protected routes', async ({ page }) => {
    await page.goto('/dishes');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
  });
});