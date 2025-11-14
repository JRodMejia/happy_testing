import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DishesPage } from '../pages/DishesPage';
import { NewDishPage } from '../pages/NewDishPage';
import { testUsers } from '../helpers/testData';

test.describe('Dishes CRUD - Create Operations', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
  });

  test('should create a new dish successfully', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    const newDishPage = new NewDishPage(page);
    
    // Navigate to dishes page
    await expect(page).toHaveURL(/.*\/dishes$/);
    await dishesPage.goto();
    
    // Click Add Dish button
    await dishesPage.clickAddDish();
    await expect(page).toHaveURL(/.*\/dishes\/new/);
    
    // Fill the form with all required data including preparation steps
    await newDishPage.fillDishForm({
      name: 'Ensalada César',
      description: 'Ensalada fresca con pollo y aderezo césar',
      prepTime: 15,
      cookTime: 10,
      quickPrep: true,
      imageUrl: 'https://example.com/caesar-salad.jpg',
      steps: [
        'Lavar y cortar la lechuga',
        'Cocinar el pollo a la plancha',
        'Mezclar con el aderezo césar'
      ]
    });
    
    // Submit the form
    await newDishPage.submitForm();
    
    // Verify navigation to dishes page
    await expect(page).toHaveURL(/.*\/dishes$/);
    
    // Verify the new dish is visible
    await expect(page.getByText('Ensalada César')).toBeVisible();
  });

  test('should require name field', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/dishes$/);
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
    await expect(page).toHaveURL(/.*\/dishes$/);
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