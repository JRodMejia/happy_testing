/**
 * Custom Cypress commands for API testing
 * Provides reusable methods for API requests with authentication
 */

/**
 * Register a new user via API
 * @param {Object} userData - User registration data
 * @returns {Cypress.Chainable} Response
 */
Cypress.Commands.add('apiRegister', (userData) => {
  return cy.request({
    method: 'POST',
    url: '/api/register',
    body: userData,
    failOnStatusCode: false,
  });
});

/**
 * Login a user via API and store session
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Cypress.Chainable} Response
 */
Cypress.Commands.add('apiLogin', (email, password) => {
  return cy.request({
    method: 'POST',
    url: '/api/login',
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200) {
      // Store session cookie for subsequent requests
      const sessionCookie = response.headers['set-cookie']?.[0];
      if (sessionCookie) {
        cy.wrap(sessionCookie).as('sessionCookie');
      }
    }
    return cy.wrap(response);
  });
});

/**
 * Logout current user via API
 * @returns {Cypress.Chainable} Response
 */
Cypress.Commands.add('apiLogout', () => {
  return cy.request({
    method: 'POST',
    url: '/api/logout',
    failOnStatusCode: false,
  });
});

/**
 * Get all dishes via API
 * @returns {Cypress.Chainable} Response
 */
Cypress.Commands.add('apiGetDishes', () => {
  return cy.request({
    method: 'GET',
    url: '/api/dishes',
    failOnStatusCode: false,
  });
});

/**
 * Get a specific dish by ID via API
 * @param {string} dishId - Dish ID
 * @returns {Cypress.Chainable} Response
 */
Cypress.Commands.add('apiGetDish', (dishId) => {
  return cy.request({
    method: 'GET',
    url: `/api/dishes/${dishId}`,
    failOnStatusCode: false,
  });
});

/**
 * Create a new dish via API
 * @param {Object} dishData - Dish data
 * @returns {Cypress.Chainable} Response
 */
Cypress.Commands.add('apiCreateDish', (dishData) => {
  return cy.request({
    method: 'POST',
    url: '/api/dishes',
    body: dishData,
    failOnStatusCode: false,
  });
});

/**
 * Update an existing dish via API
 * @param {string} dishId - Dish ID
 * @param {Object} dishData - Updated dish data
 * @returns {Cypress.Chainable} Response
 */
Cypress.Commands.add('apiUpdateDish', (dishId, dishData) => {
  return cy.request({
    method: 'PUT',
    url: `/api/dishes/${dishId}`,
    body: dishData,
    failOnStatusCode: false,
  });
});

/**
 * Delete a dish via API
 * @param {string} dishId - Dish ID
 * @returns {Cypress.Chainable} Response
 */
Cypress.Commands.add('apiDeleteDish', (dishId) => {
  return cy.request({
    method: 'DELETE',
    url: `/api/dishes/${dishId}`,
    failOnStatusCode: false,
  });
});

/**
 * Setup authenticated session for API tests
 * @param {string} email - User email
 * @param {string} password - User password
 */
Cypress.Commands.add('apiSetupAuth', (email, password) => {
  cy.apiLogin(email, password).then((response) => {
    expect(response.status).to.eq(200);
  });
});

/**
 * Clean up test data - delete all dishes created during tests
 */
Cypress.Commands.add('apiCleanupDishes', () => {
  cy.apiGetDishes().then((response) => {
    if (response.status === 200 && response.body.dishes) {
      response.body.dishes.forEach((dish) => {
        if (dish.name.includes('Test') || dish.name.includes('Cypress')) {
          cy.apiDeleteDish(dish.id);
        }
      });
    }
  });
});
