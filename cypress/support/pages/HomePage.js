class HomePage {
  elements = {
    homeHeading: () => cy.getByTestId('home-heading'),
    homeDescription: () => cy.getByTestId('home-description'),
    testEmailValue: () => cy.getByTestId('test-email-value'),
    testPasswordValue: () => cy.getByTestId('test-password-value'),
    loginButton: () => cy.getByTestId('home-login-button')
  };

  visit() {
    cy.visit('/');
  }

  clickLoginButton() {
    this.elements.loginButton().click();
  }

  verifyHomePageLoaded() {
    this.elements.homeHeading().should('be.visible').and('contain', 'Welcome to NutriApp!');
    this.elements.homeDescription().should('be.visible');
    this.elements.loginButton().should('be.visible');
  }

  verifyTestCredentialsDisplayed() {
    this.elements.testEmailValue().should('contain', 'test@nutriapp.com');
    this.elements.testPasswordValue().should('contain', 'nutriapp123');
  }
}

export default HomePage;