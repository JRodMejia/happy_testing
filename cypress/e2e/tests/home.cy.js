import HomePage from '../../support/pages/HomePage';
import LoginPage from '../../support/pages/LoginPage';

describe('Home Page - Positive Tests', () => {
  const homePage = new HomePage();

  beforeEach(() => {
    homePage.visit();
  });

  it('should display home page elements correctly', () => {
    homePage.verifyHomePageLoaded();
  });

  it('should display test credentials', () => {
    homePage.verifyTestCredentialsDisplayed();
  });

  it('should navigate to login page', () => {
    const loginPage = new LoginPage();
    homePage.clickLoginButton();
    cy.url().should('include', '/login');
    loginPage.verifyLoginPageLoaded();
  });

  it('should have correct link for login button', () => {
    homePage.elements.loginButton().should('have.attr', 'href', '/login');
  });
});

describe('Home Page - Negative Tests', () => {
  it('should redirect to login when accessing protected route', () => {
    cy.visit('/dishes');
    cy.url().should('include', '/login');
  });
});