import { Page, Locator } from '@playwright/test';

export class NewDishPage {
  readonly page: Page;
  readonly newDishHeading: Locator;
  readonly newDishFormContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newDishHeading = page.getByTestId('new-dish-heading');
    this.newDishFormContainer = page.getByTestId('new-dish-form-container');
  }

  async goto() {
    await this.page.goto('/dishes/new');
  }
}