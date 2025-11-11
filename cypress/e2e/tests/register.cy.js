import RegisterPage from '../../support/pages/RegisterPage';
import LoginPage from '../../support/pages/LoginPage';
import { generateRandomUser } from '../../support/helpers/testData';

describe('Register Page - Positive Tests', () => {
  const registerPage = new RegisterPage();
  const loginPage = new LoginPage();

  beforeEach(() => {
    registerPage.visit();
  });

  it('should display register page elements correctly', () => {
    registerPage.verifyRegisterPageLoaded();
    registerPage.elements.loginLink().should('be.visible');
  });

  it('should register new user successfully', () => {
    const newUser = generateRandomUser();
    registerPage.register(newUser);
    cy.url().should('include', '/login', { timeout: 10000 });
    loginPage.verifyLoginPageLoaded();
  });

  it('should navigate to login page', () => {
    registerPage.clickLoginLink();
    cy.url().should('include', '/login');
  });

  it('should show loading state when submitting', () => {
    const newUser = generateRandomUser();
    registerPage.fillFirstName(newUser.firstName);
    registerPage.fillLastName(newUser.lastName);
    registerPage.fillEmail(newUser.email);
    registerPage.fillNationality(newUser.nationality);
    registerPage.fillPhone(newUser.phone);
    registerPage.fillPassword(newUser.password);
    registerPage.clickRegisterButton();
    registerPage.elements.registerButton().should('contain', 'Registrando...');
  });
});

describe('Register Page - Negative Tests', () => {
  const registerPage = new RegisterPage();

  beforeEach(() => {
    registerPage.visit();
  });

  it('should show error when registering with existing email', () => {
    cy.fixture('users').then((users) => {
      registerPage.register({
        ...users.newUser,
        email: users.validUser.email
      });
      registerPage.verifyErrorMessageVisible();
    });
  });

  it('should require all fields', () => {
    registerPage.clickRegisterButton();
    registerPage.elements.firstNameInput().should('have.attr', 'required');
    registerPage.elements.lastNameInput().should('have.attr', 'required');
    registerPage.elements.emailInput().should('have.attr', 'required');
    registerPage.elements.nationalityInput().should('have.attr', 'required');
    registerPage.elements.phoneInput().should('have.attr', 'required');
    registerPage.elements.passwordInput().should('have.attr', 'required');
  });

  it('should validate email format', () => {
    registerPage.fillEmail('invalid-email');
    registerPage.elements.emailInput().should('have.attr', 'type', 'email');
  });

  it('should disable button while loading', () => {
    const newUser = generateRandomUser();
    registerPage.register(newUser);
    registerPage.elements.registerButton().should('be.disabled');
  });
});