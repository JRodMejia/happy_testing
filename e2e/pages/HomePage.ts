import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly homeHeading: Locator;
  readonly homeDescription: Locator;
  readonly testEmailValue: Locator;
  readonly testPasswordValue: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeHeading = page.getByTestId('home-heading');
    this.homeDescription = page.getByTestId('home-description');
    this.testEmailValue = page.getByTestId('test-email-value');
    this.testPasswordValue = page.getByTestId('test-password-value');
    this.loginButton = page.getByTestId('home-login-button');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }
}