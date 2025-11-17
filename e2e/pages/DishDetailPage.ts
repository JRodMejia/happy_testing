import { Page, Locator } from '@playwright/test';

export class DishDetailPage {
  readonly page: Page;
  readonly backButton: Locator;
  readonly dishName: Locator;
  readonly dishDescription: Locator;
  readonly dishImage: Locator;
  readonly quickPrepBadge: Locator;
  readonly caloriesBadge: Locator;
  readonly stepsHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backButton = page.getByTestId('dish-back-button');
    this.dishName = page.getByTestId('dish-detail-name');
    this.dishDescription = page.getByTestId('dish-detail-description');
    this.dishImage = page.getByRole('img').first();
    this.quickPrepBadge = page.getByText('Rápido');
    this.caloriesBadge = page.getByText(/\d+ kcal/);
    this.stepsHeading = page.getByRole('heading', { name: /pasos de preparación/i });
  }

  async clickBack() {
    await this.backButton.click();
  }

  async verifyDishDetailsVisible(dishName: string) {
    await this.page.waitForURL(/\/dishes\/\d+\/view/);
    await this.page.getByRole('heading', { name: dishName }).waitFor({ state: 'visible' });
  }

  async getPreparationSteps() {
    const steps = await this.page.locator('li').allTextContents();
    return steps;
  }
}
