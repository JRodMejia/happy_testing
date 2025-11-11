Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.getByTestId('email-input').type(email);
  cy.getByTestId('password-input').type(password);
  cy.getByTestId('login-button').click();
});

// Use cy.session() to preserve authentication between tests
Cypress.Commands.add('loginWithSession', (email, password) => {
  cy.session(
    [email, password], // Unique identifier for the session
    () => {
      // Commands to create the session
      cy.visit('/login');
      cy.getByTestId('email-input').type(email);
      cy.getByTestId('password-input').type(password);
      cy.getByTestId('login-button').click();
      cy.url().should('include', '/dishes');
    },
    {
      validate() {
        // Optional: validate that session is still valid
        cy.getCookie('session').should('exist');
      },
      cacheAcrossSpecs: true // Cache session across different spec files
    }
  );
});

// Alternative: Login via API (faster)
Cypress.Commands.add('loginViaAPI', (email, password) => {
  cy.session(
    [email, password],
    () => {
      cy.request({
        method: 'POST',
        url: '/api/login',
        body: { email, password }
      }).then((response) => {
        // Session cookie should be set automatically
        expect(response.status).to.eq(200);
      });
    },
    {
      validate() {
        cy.getCookie('session').should('exist');
      }
    }
  );
});