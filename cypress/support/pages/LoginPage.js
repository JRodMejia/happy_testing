class LoginPage {
  elements = {
    emailInput: () => cy.getByTestId('email-input'),
    passwordInput: () => cy.getByTestId('password-input'),
    loginButton: () => cy.getByTestId('login-button'),
    errorMessage: () => cy.getByTestId('error-message'),
    registerLink: () => cy.getByTestId('register-link'),
    nutriappTitle: () => cy.getByTestId('nutriapp-title'),
    loginHeading: () => cy.getByTestId('login-heading'),
    loginSubtitle: () => cy.getByTestId('login-subtitle')
  };

  visit() {
    cy.visit('/login');
  }

  fillEmail(email) {
    this.elements.emailInput().clear().type(email);
  }

  fillPassword(password) {
    this.elements.passwordInput().clear().type(password);
  }

  clickLoginButton() {
    this.elements.loginButton().click();
  }

  clickRegisterLink() {
    this.elements.registerLink().click();
  }

  login(email, password) {
    this.fillEmail(email);
    this.fillPassword(password);
    this.clickLoginButton();
  }

  verifyErrorMessageVisible() {
    this.elements.errorMessage().should('be.visible');
  }

  verifyLoginPageLoaded() {
    this.elements.loginHeading().should('be.visible');
    this.elements.nutriappTitle().should('be.visible');
    this.elements.emailInput().should('be.visible');
    this.elements.passwordInput().should('be.visible');
    this.elements.loginButton().should('be.enabled');
  }
}

export default LoginPage;