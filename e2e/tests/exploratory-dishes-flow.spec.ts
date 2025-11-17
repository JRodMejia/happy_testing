import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DishesPage } from '../pages/DishesPage';
import { NewDishPage } from '../pages/NewDishPage';
import { DishDetailPage } from '../pages/DishDetailPage';
import { EditDishPage } from '../pages/EditDishPage';
import { testUsers } from '../helpers/testData';

test.describe('Exploratory Tests - Dishes Complete Flow', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
    await expect(page).toHaveURL(/.*\/dishes$/);
  });

  test('should display dishes list with multiple items', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    
    // Verify page loaded
    await expect(dishesPage.dishesHeading).toBeVisible();
    await expect(dishesPage.dishesHeading).toHaveText('Sugerencias de Platillos');
    
    // Verify add button exists
    await expect(dishesPage.addDishButton).toBeVisible();
    
    // Verify dishes list is displayed
    const hasDishesList = await dishesPage.isDishesListVisible();
    expect(hasDishesList).toBeTruthy();
    
    // Verify at least one dish card is visible
    const firstDishCard = page.getByTestId('dish-card-0');
    await expect(firstDishCard).toBeVisible();
  });

  test('should view dish details and return to list', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    const dishDetailPage = new DishDetailPage(page);
    
    // Click on first dish's view button
    await dishesPage.clickViewDish(0);
    
    // Verify we're on the detail page
    await expect(page).toHaveURL(/\/dishes\/\d+\/view/);
    
    // Verify dish detail elements are visible
    await expect(dishDetailPage.stepsHeading).toBeVisible();
    
    // Click back button
    await dishDetailPage.clickBack();
    
    // Verify we're back on dishes list
    await expect(page).toHaveURL(/.*\/dishes$/);
    await expect(dishesPage.dishesHeading).toBeVisible();
  });

  test('should create a new dish successfully', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    const newDishPage = new NewDishPage(page);
    
    const uniqueDishName = `Exploratory Test Dish ${Date.now()}`;
    
    // Navigate to new dish page
    await dishesPage.clickAddDish();
    await expect(page).toHaveURL(/.*\/dishes\/new/);
    
    // Fill the form
    await newDishPage.fillDishForm({
      name: uniqueDishName,
      description: 'A dish created during automated exploration',
      prepTime: 10,
      cookTime: 15,
      quickPrep: true,
      steps: [
        'Prepare all ingredients',
        'Cook the dish',
        'Serve and enjoy'
      ]
    });
    
    // Submit the form
    await newDishPage.submitForm();
    
    // Verify redirect to dishes list
    await expect(page).toHaveURL(/.*\/dishes$/);
    
    // Verify the new dish appears in the list
    await dishesPage.verifyDishExists(uniqueDishName);
  });

  test('should edit an existing dish', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    const newDishPage = new NewDishPage(page);
    const editDishPage = new EditDishPage(page);
    
    const originalName = `Original Dish ${Date.now()}`;
    const updatedName = `Updated Dish ${Date.now()}`;
    
    // First, create a dish
    await dishesPage.clickAddDish();
    await newDishPage.fillDishForm({
      name: originalName,
      description: 'Original description',
      prepTime: 10,
      cookTime: 10,
      steps: ['Step 1']
    });
    await newDishPage.submitForm();
    await expect(page).toHaveURL(/.*\/dishes$/);
    
    // Find the newly created dish by getting its position
    await page.waitForTimeout(1000); // Wait for list to update
    const dishHeading = page.getByRole('heading', { name: originalName, exact: true });
    await dishHeading.waitFor({ state: 'visible' });
    
    // Navigate to parent card and click edit - using class selector for unique card
    const parentCard = dishHeading.locator('xpath=ancestor::div[contains(@class, "bg-white")]').first();
    const editButton = parentCard.locator('[data-testid^="dish-edit-button-"]');
    await editButton.click();
    
    // Verify we're on edit page
    await editDishPage.verifyEditPageLoaded();
    
    // Update the name
    await editDishPage.updateDishName(updatedName);
    
    // Submit the changes
    await editDishPage.submitForm();
    
    // Verify redirect to dishes list
    await expect(page).toHaveURL(/.*\/dishes$/);
    
    // Verify the updated name appears
    await dishesPage.verifyDishExists(updatedName);
    
    // Verify old name doesn't exist
    await dishesPage.verifyDishNotExists(originalName);
  });

  test('should delete a dish immediately without confirmation', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    const newDishPage = new NewDishPage(page);
    
    const dishToDelete = `Dish To Delete ${Date.now()}`;
    
    // Create a dish to delete
    await dishesPage.clickAddDish();
    await newDishPage.fillDishForm({
      name: dishToDelete,
      description: 'This will be deleted',
      prepTime: 5,
      cookTime: 5,
      steps: ['Step 1']
    });
    await newDishPage.submitForm();
    await expect(page).toHaveURL(/.*\/dishes$/);
    
    // Verify dish exists
    await dishesPage.verifyDishExists(dishToDelete);
    
    // Find and delete the dish
    await page.waitForTimeout(1000);
    const dishHeading = page.getByRole('heading', { name: dishToDelete, exact: true });
    await dishHeading.waitFor({ state: 'visible' });
    const parentCard = dishHeading.locator('xpath=ancestor::div[contains(@class, "bg-white")]').first();
    const deleteButton = parentCard.locator('[data-testid^="dish-delete-button-"]');
    await deleteButton.click();
    
    // Wait a moment for deletion to process
    await page.waitForTimeout(500);
    
    // Verify dish no longer exists
    await dishesPage.verifyDishNotExists(dishToDelete);
  });

  test('should navigate through complete CRUD cycle', async ({ page }) => {
    const dishesPage = new DishesPage(page);
    const newDishPage = new NewDishPage(page);
    const dishDetailPage = new DishDetailPage(page);
    const editDishPage = new EditDishPage(page);
    
    const dishName = `Complete CRUD Test ${Date.now()}`;
    const updatedDishName = `${dishName} - Updated`;
    
    // CREATE
    await dishesPage.clickAddDish();
    await newDishPage.fillDishForm({
      name: dishName,
      description: 'Testing complete CRUD cycle',
      prepTime: 15,
      cookTime: 20,
      quickPrep: false,
      steps: ['Prepare', 'Cook', 'Serve']
    });
    await newDishPage.submitForm();
    await expect(page).toHaveURL(/.*\/dishes$/);
    
    // READ - View Details
    await page.waitForTimeout(1000);
    let dishHeading = page.getByRole('heading', { name: dishName, exact: true });
    await dishHeading.waitFor({ state: 'visible' });
    let parentCard = dishHeading.locator('xpath=ancestor::div[contains(@class, "bg-white")]').first();
    const viewButton = parentCard.locator('[data-testid^="dish-view-button-"]');
    await viewButton.click();
    await expect(page).toHaveURL(/\/dishes\/\d+\/view/);
    await expect(page.getByRole('heading', { name: dishName })).toBeVisible();
    await dishDetailPage.clickBack();
    
    // UPDATE
    dishHeading = page.getByRole('heading', { name: dishName, exact: true });
    await dishHeading.waitFor({ state: 'visible' });
    parentCard = dishHeading.locator('xpath=ancestor::div[contains(@class, "bg-white")]').first();
    const editButton = parentCard.locator('[data-testid^="dish-edit-button-"]');
    await editButton.click();
    await editDishPage.verifyEditPageLoaded();
    await editDishPage.updateDishName(updatedDishName);
    await editDishPage.submitForm();
    await expect(page).toHaveURL(/.*\/dishes$/);
    await dishesPage.verifyDishExists(updatedDishName);
    
    // DELETE
    dishHeading = page.getByRole('heading', { name: updatedDishName, exact: true });
    await dishHeading.waitFor({ state: 'visible' });
    parentCard = dishHeading.locator('xpath=ancestor::div[contains(@class, "bg-white")]').first();
    const deleteButton = parentCard.locator('[data-testid^="dish-delete-button-"]');
    await deleteButton.click();
    await page.waitForTimeout(500);
    await dishesPage.verifyDishNotExists(updatedDishName);
  });

  test('should logout and redirect to login page', async ({ page }) => {
    // Click logout button
    await page.getByRole('button', { name: 'Logout' }).click();
    
    // Verify redirect to login
    await expect(page).toHaveURL(/.*\/login/);
    
    // Verify login page elements are visible
    const loginHeading = page.getByRole('heading', { name: /bienvenido/i });
    await expect(loginHeading).toBeVisible();
  });
});

test.describe('Edge Cases and Error Scenarios', () => {
  test('should show validation for required fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dishesPage = new DishesPage(page);
    const newDishPage = new NewDishPage(page);
    
    await loginPage.goto();
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
    await expect(page).toHaveURL(/.*\/dishes$/);
    
    // Navigate to new dish page
    await dishesPage.clickAddDish();
    
    // Verify required attribute on name field
    await expect(newDishPage.nameInput).toHaveAttribute('required', '');
    
    // Verify required attribute on description field
    await expect(newDishPage.descriptionInput).toHaveAttribute('required', '');
    
    // Verify required attribute on prep time field
    await expect(newDishPage.prepTimeInput).toHaveAttribute('required', '');
  });

  test('should cancel dish creation and return to list', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dishesPage = new DishesPage(page);
    const newDishPage = new NewDishPage(page);
    
    await loginPage.goto();
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
    await expect(page).toHaveURL(/.*\/dishes$/);
    
    // Navigate to new dish page
    await dishesPage.clickAddDish();
    await expect(page).toHaveURL(/.*\/dishes\/new/);
    
    // Fill some data
    await newDishPage.nameInput.fill('Test Dish');
    
    // Click cancel
    await newDishPage.cancelForm();
    
    // Verify redirect to dishes list
    await expect(page).toHaveURL(/.*\/dishes$/);
  });
});
