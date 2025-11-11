class RegisterPage {
  elements = {
    firstNameInput: () => cy.getByTestId('firstname-input'),
    lastNameInput: () => cy.getByTestId('lastname-input'),
    emailInput: () => cy.getByTestId('register-email-input'),
    nationalityInput: () => cy.getByTestId('nationality-input'),
    phoneInput: () => cy.getByTestId('phone-input'),
    passwordInput: () => cy.getByTestId('register-password-input'),
    registerButton: () => cy.getByTestId('register-button'),
    errorMessage: () => cy.getByTestId('register-error-message'),
    loginLink: () => cy.getByTestId('login-link'),
    registerHeading: () => cy.getByTestId('register-heading')
  };

  visit() {
    cy.visit('/register');
  }

  fillFirstName(firstName) {
    this.elements.firstNameInput().clear().type(firstName);
  }

  fillLastName(lastName) {
    this.elements.lastNameInput().clear().type(lastName);
  }

  fillEmail(email) {
    this.elements.emailInput().clear().type(email);
  }

  fillNationality(nationality) {
    this.elements.nationalityInput().clear().type(nationality);
  }

  fillPhone(phone) {
    this.elements.phoneInput().clear().type(phone);
  }

  fillPassword(password) {
    this.elements.passwordInput().clear().type(password);
  }

  clickRegisterButton() {
    this.elements.registerButton().click();
  }

  clickLoginLink() {
    this.elements.loginLink().click();
  }

  register(userData) {
    this.fillFirstName(userData.firstName);
    this.fillLastName(userData.lastName);
    this.fillEmail(userData.email);
    this.fillNationality(userData.nationality);
    this.fillPhone(userData.phone);
    this.fillPassword(userData.password);
    this.clickRegisterButton();
  }

  verifyErrorMessageVisible() {
    this.elements.errorMessage().should('be.visible');
  }

  verifyRegisterPageLoaded() {
    this.elements.registerHeading().should('be.visible').and('contain', 'Crear cuenta');
    this.elements.firstNameInput().should('be.visible');
    this.elements.lastNameInput().should('be.visible');
    this.elements.emailInput().should('be.visible');
    this.elements.registerButton().should('be.enabled');
  }
}

export default RegisterPage;