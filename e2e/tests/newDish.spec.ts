import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { NewDishPage } from '../pages/NewDishPage';
import { testUsers } from '../helpers/testData';

test.describe('New Dish Page - Positive Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
    
    // Wait for successful login redirect
    await expect(page).toHaveURL(/.*\/dishes$/);
  });

  test('should display new dish page elements correctly', async ({ page }) => {
    const newDishPage = new NewDishPage(page);
    await newDishPage.goto();
    
    // Verify we're on the new dish page
    await expect(page).toHaveURL(/.*\/dishes\/new/);
    
    // Verify page elements
    await expect(newDishPage.newDishHeading).toBeVisible();
    await expect(newDishPage.newDishHeading).toHaveText('Agregar Platillo');
    await expect(newDishPage.newDishFormContainer).toBeVisible();
  });
});

test.describe('New Dish Page - Negative Tests', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    const newDishPage = new NewDishPage(page);
    await newDishPage.goto();
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
  });
});