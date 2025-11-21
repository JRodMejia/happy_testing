/**
 * Helper functions for API testing
 * Utility methods for common API test operations
 */

/**
 * Validate response structure for user object
 * @param {Object} user - User object to validate
 */
export const validateUserResponse = (user) => {
  expect(user).to.have.property('id');
  expect(user).to.have.property('email');
  expect(user).to.have.property('firstName');
  expect(user).to.have.property('lastName');
  // Note: API returns password hash, which is a backend concern
};

/**
 * Validate response structure for dish object
 * @param {Object} dish - Dish object to validate
 */
export const validateDishResponse = (dish) => {
  expect(dish).to.have.property('id');
  expect(dish).to.have.property('name');
  expect(dish).to.have.property('description');
  expect(dish).to.have.property('steps');
  expect(dish).to.have.property('prepTime');
  expect(dish).to.have.property('cookTime');
};

/**
 * Validate error response structure
 * @param {Object} response - API response
 * @param {number} expectedStatus - Expected status code
 */
export const validateErrorResponse = (response, expectedStatus) => {
  expect(response.status).to.eq(expectedStatus);
  expect(response.body).to.have.property('error');
  expect(response.body.error).to.be.a('string');
};

/**
 * Generate unique email for testing
 * @param {string} prefix - Email prefix
 * @returns {string} Unique email
 */
export const generateUniqueEmail = (prefix = 'test') => {
  return `${prefix}_${Date.now()}@cypress-test.com`;
};

/**
 * Generate unique dish name for testing
 * @param {string} prefix - Dish name prefix
 * @returns {string} Unique dish name
 */
export const generateUniqueDishName = (prefix = 'Cypress Test Dish') => {
  return `${prefix} ${Date.now()}`;
};

/**
 * Extract session cookie from response headers
 * @param {Object} response - API response
 * @returns {string|null} Session cookie value
 */
export const extractSessionCookie = (response) => {
  const setCookie = response.headers['set-cookie'];
  if (!setCookie || !Array.isArray(setCookie)) return null;
  
  const sessionCookie = setCookie.find(cookie => cookie.includes('session='));
  if (!sessionCookie) return null;
  
  const match = sessionCookie.match(/session=([^;]+)/);
  return match ? match[1] : null;
};

/**
 * Wait for API to be ready
 * @param {number} maxRetries - Maximum number of retries
 */
export const waitForApi = (maxRetries = 5) => {
  let retries = 0;
  
  const checkApi = () => {
    cy.request({
      method: 'GET',
      url: '/api/dishes',
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status !== 401 && response.status !== 200) {
        if (retries < maxRetries) {
          retries++;
          cy.wait(1000);
          checkApi();
        }
      }
    });
  };
  
  checkApi();
};

/**
 * Compare objects excluding specified fields
 * @param {Object} obj1 - First object
 * @param {Object} obj2 - Second object
 * @param {Array} excludeFields - Fields to exclude from comparison
 */
export const compareObjects = (obj1, obj2, excludeFields = []) => {
  Object.keys(obj1).forEach(key => {
    if (!excludeFields.includes(key)) {
      expect(obj1[key]).to.deep.equal(obj2[key]);
    }
  });
};
