import { Page, Locator } from '@playwright/test';

export class EditDishPage {
  readonly page: Page;
  readonly editHeading: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly prepTimeInput: Locator;
  readonly cookTimeInput: Locator;
  readonly quickPrepCheckbox: Locator;
  readonly caloriesInput: Locator;
  readonly imageUrlInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editHeading = page.getByRole('heading', { name: /editar platillo/i });
    this.nameInput = page.getByTestId('dish-name-input');
    this.descriptionInput = page.getByTestId('dish-description-input');
    this.prepTimeInput = page.getByTestId('dish-prep-time-input');
    this.cookTimeInput = page.getByTestId('dish-cook-time-input');
    this.quickPrepCheckbox = page.getByTestId('dish-quick-prep-checkbox');
    this.caloriesInput = page.locator('input[name="calories"]');
    this.imageUrlInput = page.getByTestId('dish-image-url-input');
    this.submitButton = page.getByTestId('dish-submit-button');
    this.cancelButton = page.getByTestId('dish-cancel-button');
  }

  async verifyEditPageLoaded() {
    await this.page.waitForURL(/\/dishes\/\d+$/);
    await this.editHeading.waitFor({ state: 'visible' });
  }

  async updateDishName(name: string) {
    await this.nameInput.fill(name);
  }

  async updateDishDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
