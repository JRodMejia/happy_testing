import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;
  readonly nutriappTitle: Locator;
  readonly loginHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error-message');
    this.registerLink = page.getByTestId('register-link');
    this.nutriappTitle = page.getByTestId('nutriapp-title');
    this.loginHeading = page.getByTestId('login-heading');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }

  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }
}