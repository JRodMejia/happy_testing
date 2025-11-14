import LoginPage from '../../support/pages/LoginPage';
import DishesPage from '../../support/pages/DishesPage';

describe('Login Page - Positive Tests', () => {
  const loginPage = new LoginPage();
  const dishesPage = new DishesPage();

  beforeEach(() => {
    // Clear session before each test in login spec
    cy.clearAllSessionStorage();
    cy.clearCookies();
    loginPage.visit();
  });

  it('should display login page elements correctly', () => {
    loginPage.verifyLoginPageLoaded();
    loginPage.elements.loginHeading().should('contain', 'Bienvenido');
    loginPage.elements.registerLink().should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validUser.email, users.validUser.password);
      cy.url().should('include', '/dishes');
      dishesPage.verifyDishesPageLoaded();
    });
  });

  it('should navigate to register page', () => {
    loginPage.clickRegisterLink();
    cy.url().should('include', '/register');
  });

  it('should show loading state when submitting', () => {
    cy.fixture('users').then((users) => {
      loginPage.fillEmail(users.validUser.email);
      loginPage.fillPassword(users.validUser.password);
      loginPage.clickLoginButton();
      loginPage.elements.loginButton().should('contain', 'Ingresando...');
    });
  });
});

describe('Login Page - Negative Tests', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.clearAllSessionStorage();
    cy.clearCookies();
    loginPage.visit();
  });

  it('should require email field', () => {
    cy.fixture('users').then((users) => {
      loginPage.fillPassword(users.validUser.password);
      loginPage.elements.emailInput().should('have.attr', 'required');
    });
  });

  it('should require password field', () => {
    cy.fixture('users').then((users) => {
      loginPage.fillEmail(users.validUser.email);
      loginPage.elements.passwordInput().should('have.attr', 'required');
    });
  });

  it('should validate email format', () => {
    loginPage.fillEmail('invalid-email');
    loginPage.elements.emailInput().should('have.attr', 'type', 'email');
  });

  it('should not login with wrong password', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validUser.email, 'wrongpassword');
      loginPage.verifyErrorMessageVisible();
      cy.url().should('include', '/login');
    });
  });

  it('should disable button while loading', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validUser.email, users.validUser.password);
      loginPage.elements.loginButton().should('be.disabled');
    });
  });
});