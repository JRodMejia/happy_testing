Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('clearCookiesAndLocalStorage', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});