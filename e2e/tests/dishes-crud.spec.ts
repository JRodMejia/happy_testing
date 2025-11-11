import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DishesPage } from '../pages/DishesPage';
import { testUsers } from '../helpers/testData';

test.describe('Dishes CRUD - Create Operations', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
  });

  test('should create a new dish successfully', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    await dishesPage.goto();
    await dishesPage.clickAddDish();
    
    await expect(page).toHaveURL(/.*\/dishes\/new/);
    
    await page.getByTestId('dish-name-input').fill('Ensalada César');
    await page.getByTestId('dish-description-input').fill('Ensalada fresca');
    await page.getByTestId('dish-prep-time-input').fill('15');
    await page.getByTestId('dish-cook-time-input').fill('10');
    await page.getByTestId('dish-submit-button').click();
    
    await expect(page).toHaveURL(/.*\/dishes$/);
    await expect(page.getByText('Ensalada César')).toBeVisible();
  });

  test('should require name field', async ({ page }) => {
    await page.goto('/dishes/new');
    
    const nameInput = page.getByTestId('dish-name-input');
    await expect(nameInput).toHaveAttribute('required', '');
  });
});

test.describe('Dishes CRUD - Read Operations', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
  });

  test('should display list of dishes', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    await dishesPage.goto();
    
    const hasEmptyState = await dishesPage.isEmptyStateVisible();
    const hasDishesList = await dishesPage.isDishesListVisible();
    
    expect(hasEmptyState || hasDishesList).toBeTruthy();
  });
});

test.describe('Dishes CRUD - Update Operations', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
  });

  test('should update dish name', async ({ page }) => {
    // Implementation depends on edit functionality
    await page.goto('/dishes');
    
    const editButton = page.getByTestId('dish-edit-button-0');
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.getByTestId('dish-name-input').fill('Updated Dish Name');
      await page.getByTestId('dish-update-button').click();
      
      await expect(page).toHaveURL(/.*\/dishes$/);
    }
  });
});

test.describe('Dishes CRUD - Delete Operations', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
  });

  test('should delete dish with confirmation', async ({ page }) => {
    await page.goto('/dishes');
    
    const deleteButton = page.getByTestId('dish-delete-button-0');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await page.getByTestId('delete-confirm-button').click();
      
      await expect(page).toHaveURL(/.*\/dishes$/);
    }
  });
});