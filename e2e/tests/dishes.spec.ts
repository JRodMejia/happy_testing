import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DishesPage } from '../pages/DishesPage';
import { NewDishPage } from '../pages/NewDishPage';
import { testUsers } from '../helpers/testData';

test.describe('Dishes Page - Positive Tests', () => {
  let dishesPage: DishesPage;

  test.beforeEach(async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
    
    dishesPage = new DishesPage(page);
    await expect(page).toHaveURL(/.*\/dishes/);
  });

  test('should display dishes page elements correctly', async () => {
    await expect(dishesPage.dishesHeading).toBeVisible();
    await expect(dishesPage.dishesHeading).toHaveText('Sugerencias de Platillos');
    await expect(dishesPage.addDishButton).toBeVisible();
    await expect(dishesPage.addDishButton).toHaveText('+ Agregar Platillo');
  });

  test('should navigate to new dish page when clicking add button', async ({ page }) => {
    const newDishPage = new NewDishPage(page);
    
    await dishesPage.clickAddDish();
    
    await expect(page).toHaveURL(/.*\/dishes\/new/);
    await expect(newDishPage.newDishHeading).toBeVisible();
  });

  test('should display dishes list or empty state', async () => {
    const hasEmptyState = await dishesPage.isEmptyStateVisible();
    const hasDishesList = await dishesPage.isDishesListVisible();
    
    // Either empty state OR dishes list should be visible
    expect(hasEmptyState || hasDishesList).toBeTruthy();
  });

  test('should display empty state message when no dishes', async () => {
    const hasEmptyState = await dishesPage.isEmptyStateVisible();
    
    if (hasEmptyState) {
      await expect(dishesPage.dishesEmptyText).toHaveText('No hay platillos registrados.');
    }
  });
});

test.describe('Dishes Page - Negative Tests', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    await dishesPage.goto();
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
  });

});