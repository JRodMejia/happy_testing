import { Page, Locator } from '@playwright/test';

export class NewDishPage {
  readonly page: Page;
  readonly newDishHeading: Locator;
  readonly newDishFormContainer: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly prepTimeInput: Locator;
  readonly cookTimeInput: Locator;
  readonly quickPrepCheckbox: Locator;
  readonly imageUrlInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newDishHeading = page.getByTestId('new-dish-heading');
    this.newDishFormContainer = page.getByTestId('new-dish-form-container');
    this.nameInput = page.getByTestId('dish-name-input');
    this.descriptionInput = page.getByTestId('dish-description-input');
    this.prepTimeInput = page.getByTestId('dish-prep-time-input');
    this.cookTimeInput = page.getByTestId('dish-cook-time-input');
    this.quickPrepCheckbox = page.getByTestId('dish-quick-prep-checkbox');
    this.imageUrlInput = page.getByTestId('dish-image-url-input');
    this.submitButton = page.getByTestId('dish-submit-button');
    this.cancelButton = page.getByTestId('dish-cancel-button');
  }

  async goto() {
    await this.page.goto('/dishes/new');
  }

  async fillDishForm(dishData: {
    name: string;
    description: string;
    prepTime: number;
    cookTime: number;
    quickPrep?: boolean;
    imageUrl?: string;
    steps?: string[];
  }) {
    await this.nameInput.fill(dishData.name);
    await this.descriptionInput.fill(dishData.description);
    await this.prepTimeInput.fill(dishData.prepTime.toString());
    await this.cookTimeInput.fill(dishData.cookTime.toString());
    
    if (dishData.quickPrep) {
      await this.quickPrepCheckbox.check();
    }
    
    if (dishData.imageUrl) {
      await this.imageUrlInput.fill(dishData.imageUrl);
    }

    // Fill preparation steps
    if (dishData.steps && dishData.steps.length > 0) {
      // First step should already exist, fill it
      await this.page.locator('input[placeholder^="Paso"]').first().fill(dishData.steps[0]);
      
      // Add and fill additional steps
      for (let i = 1; i < dishData.steps.length; i++) {
        await this.page.getByText('+ Agregar paso').click();
        await this.page.locator('input[placeholder^="Paso"]').nth(i).fill(dishData.steps[i]);
      }
    }
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async cancelForm() {
    await this.cancelButton.click();
  }
}