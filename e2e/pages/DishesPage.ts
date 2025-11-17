import { Page, Locator } from '@playwright/test';

export class DishesPage {
  readonly page: Page;
  readonly dishesHeading: Locator;
  readonly addDishButton: Locator;
  readonly dishesEmptyState: Locator;
  readonly dishesEmptyText: Locator;
  readonly dishesList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dishesHeading = page.getByTestId('dishes-heading');
    this.addDishButton = page.getByTestId('add-dish-button');
    this.dishesEmptyState = page.getByTestId('dishes-empty-state');
    this.dishesEmptyText = page.getByTestId('dishes-empty-text');
    this.dishesList = page.getByTestId('dishes-list');
  }

  async goto() {
    await this.page.goto('/dishes');
  }

  async clickAddDish() {
    await this.addDishButton.click();
  }

  async isEmptyStateVisible() {
    return await this.dishesEmptyState.isVisible();
  }

  async isDishesListVisible() {
    return await this.dishesList.isVisible();
  }

  async clickViewDish(index: number) {
    await this.page.getByTestId(`dish-view-button-${index}`).click();
  }

  async clickEditDish(index: number) {
    await this.page.getByTestId(`dish-edit-button-${index}`).click();
  }

  async clickDeleteDish(index: number) {
    await this.page.getByTestId(`dish-delete-button-${index}`).click();
  }

  async getDishNameByIndex(index: number) {
    return await this.page.getByTestId(`dish-name-${index}`).textContent();
  }

  async verifyDishExists(dishName: string) {
    await this.page.getByText(dishName).waitFor({ state: 'visible' });
  }

  async verifyDishNotExists(dishName: string) {
    await this.page.getByText(dishName, { exact: true }).waitFor({ state: 'detached', timeout: 5000 });
  }
}