import { test, expect } from '@playwright/test';

test.describe('Auth - Playwright', () => {
  test('shows error with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="email"]', 'wrong@user.com');
    await page.fill('input[name="password"]', 'wrongpass');

    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    await expect(page.locator('p.text-red-500')).toBeVisible();
  });

  test('navigates to register page', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    console.log('Navigated to login page');
    await page.getByRole('link', { name: 'Regístrate' }).click();

    await expect(page).toHaveURL(/.*\/register/);
    await expect(page.getByText('Regístrate')).toBeVisible();
  });
});
