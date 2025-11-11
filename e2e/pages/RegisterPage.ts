import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly nationalityInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly errorMessage: Locator;
  readonly loginLink: Locator;
  readonly registerHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('firstname-input');
    this.lastNameInput = page.getByTestId('lastname-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.nationalityInput = page.getByTestId('nationality-input');
    this.phoneInput = page.getByTestId('phone-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.registerButton = page.getByTestId('register-button');
    this.errorMessage = page.getByTestId('register-error-message');
    this.loginLink = page.getByTestId('login-link');
    this.registerHeading = page.getByTestId('register-heading');
  }

  async goto() {
    await this.page.goto('/register');
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    nationality: string;
    phone: string;
    password: string;
  }) {
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.emailInput.fill(userData.email);
    await this.nationalityInput.fill(userData.nationality);
    await this.phoneInput.fill(userData.phone);
    await this.passwordInput.fill(userData.password);
    await this.registerButton.click();
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }

  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }
}