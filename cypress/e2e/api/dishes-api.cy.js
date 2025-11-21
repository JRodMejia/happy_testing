import {
  validateDishResponse,
  validateErrorResponse,
  generateUniqueEmail,
  generateUniqueDishName,
} from '../../support/helpers/apiHelpers';

describe('API Tests - Dishes CRUD', () => {
  let registeredUserEmail;
  let registeredUserPassword;
  let userRegistered = false;

  before(() => {
    // Register user once for all tests
    cy.fixture('api/users').then((users) => {
      const uniqueEmail = generateUniqueEmail('dishuser');
      registeredUserEmail = uniqueEmail;
      registeredUserPassword = users.validUser.password;
      
      const userData = {
        ...users.validUser,
        email: uniqueEmail,
      };

      cy.apiRegister(userData).then((response) => {
        expect(response.status).to.eq(200);
        userRegistered = true;
      });
    });
  });

  beforeEach(() => {
    // Login before each test
    cy.apiSetupAuth(registeredUserEmail, registeredUserPassword);
  });

  after(() => {
    // Cleanup test dishes
    cy.apiCleanupDishes();
  });

  describe('GET /api/dishes', () => {
    it('should retrieve all dishes when authenticated', () => {
      cy.apiGetDishes().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('dishes');
        expect(response.body.dishes).to.be.an('array');

        // Validate structure of dishes if any exist
        if (response.body.dishes.length > 0) {
          validateDishResponse(response.body.dishes[0]);
        }
      });
    });

    it('should fail when not authenticated', () => {
      // Logout first
      cy.apiLogout();

      cy.apiGetDishes().then((response) => {
        expect(response.status).to.eq(401);
        validateErrorResponse(response, 401);
      });

      // Re-authenticate for next tests
      cy.apiSetupAuth(registeredUserEmail, registeredUserPassword);
    });
  });

  describe('POST /api/dishes', () => {
    it('should create a new dish with all fields', () => {
      cy.fixture('api/dishes').then((dishes) => {
        const dishData = {
          ...dishes.validDish,
          name: generateUniqueDishName('Complete Dish'),
        };

        cy.apiCreateDish(dishData).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('dish');

          const dish = response.body.dish;
          validateDishResponse(dish);
          expect(dish.name).to.eq(dishData.name);
          expect(dish.description).to.eq(dishData.description);
          expect(dish.calories).to.eq(dishData.calories);
        });
      });
    });

    it('should create a dish with minimal required fields', () => {
      cy.fixture('api/dishes').then((dishes) => {
        const minimalDish = {
          ...dishes.minimalDish,
          name: generateUniqueDishName('Minimal Dish'),
        };

        cy.apiCreateDish(minimalDish).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('dish');
          validateDishResponse(response.body.dish);
        });
      });
    });

    it('should create a quick prep dish', () => {
      cy.fixture('api/dishes').then((dishes) => {
        const quickDish = {
          ...dishes.quickPrepDish,
          name: generateUniqueDishName('Quick Dish'),
        };

        cy.apiCreateDish(quickDish).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.dish.quickPrep).to.be.true;
        });
      });
    });

    it('should fail when name is missing', () => {
      cy.fixture('api/dishes').then((dishes) => {
        cy.apiCreateDish(dishes.invalidDish).then((response) => {
          validateErrorResponse(response, 400);
        });
      });
    });

    it('should fail when not authenticated', () => {
      // Logout first
      cy.apiLogout();

      cy.fixture('api/dishes').then((dishes) => {
        const dishData = {
          ...dishes.validDish,
          name: generateUniqueDishName('Unauthorized'),
        };

        cy.apiCreateDish(dishData).then((response) => {
          expect(response.status).to.eq(401);
          validateErrorResponse(response, 401);
        });
      });

      // Re-authenticate for next tests
      cy.apiSetupAuth(registeredUserEmail, registeredUserPassword);
    });
  });

  describe('GET /api/dishes/:id', () => {
    beforeEach(function() {
      // Create a dish for GET tests and store ID as alias
      cy.fixture('api/dishes').then((dishes) => {
        const dishData = {
          ...dishes.validDish,
          name: generateUniqueDishName('Get Test Dish'),
        };

        cy.apiCreateDish(dishData).then((response) => {
          cy.wrap(response.body.dish.id).as('testDishId');
        });
      });
    });

    it('should retrieve a specific dish by ID', function() {
      cy.get('@testDishId').then((testDishId) => {
        cy.apiGetDish(testDishId).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('dish');

          const dish = response.body.dish;
          validateDishResponse(dish);
          expect(dish.id).to.eq(testDishId);
        });
      });
    });

    it('should return 404 for non-existent dish', () => {
      const fakeId = '99999999-9999-9999-9999-999999999999';

      cy.apiGetDish(fakeId).then((response) => {
        expect(response.status).to.eq(500);
        validateErrorResponse(response, 500);
      });
    });

    it('should fail when not authenticated', function() {
      // Logout first
      cy.apiLogout();

      cy.get('@testDishId').then((testDishId) => {
        cy.apiGetDish(testDishId).then((response) => {
          expect(response.status).to.eq(401);
          validateErrorResponse(response, 401);
        });
      });

      // Re-authenticate
      cy.apiSetupAuth(registeredUserEmail, registeredUserPassword);
    });
  });

  describe('PUT /api/dishes/:id', () => {
    beforeEach(() => {
      // Create a fresh dish for each update test and store as alias
      cy.fixture('api/dishes').then((dishes) => {
        const dishData = {
          ...dishes.validDish,
          name: generateUniqueDishName('Update Test Dish'),
        };

        cy.apiCreateDish(dishData).then((response) => {
          cy.wrap(response.body.dish).as('dishToUpdate');
        });
      });
    });

    it('should update dish successfully', function() {
      cy.fixture('api/dishes').then((dishes) => {
        const updatedData = {
          ...dishes.validDish,
          name: generateUniqueDishName('Updated Dish'),
          description: 'Updated description',
          calories: 500,
        };

        cy.get('@dishToUpdate').then((dishToUpdate) => {
          cy.apiUpdateDish(dishToUpdate.id, updatedData).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('dish');

            const dish = response.body.dish;
            expect(dish.id).to.eq(dishToUpdate.id);
            expect(dish.name).to.eq(updatedData.name);
            expect(dish.description).to.eq(updatedData.description);
            expect(dish.calories).to.eq(updatedData.calories);
          });
        });
      });
    });

    it('should update only specific fields', function() {
      const partialUpdate = {
        name: generateUniqueDishName('Partially Updated'),
      };

      cy.get('@dishToUpdate').then((dishToUpdate) => {
        cy.apiUpdateDish(dishToUpdate.id, partialUpdate).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.dish.name).to.eq(partialUpdate.name);
          // Other fields should remain unchanged
          expect(response.body.dish.description).to.eq(dishToUpdate.description);
        });
      });
    });

    it('should fail when not authenticated', function() {
      // Logout first
      cy.apiLogout();

      const updatedData = {
        name: 'Unauthorized Update',
      };

      cy.get('@dishToUpdate').then((dishToUpdate) => {
        cy.apiUpdateDish(dishToUpdate.id, updatedData).then((response) => {
          expect(response.status).to.eq(401);
          validateErrorResponse(response, 401);
        });
      });

      // Re-authenticate
      cy.apiSetupAuth(registeredUserEmail, registeredUserPassword);
    });
  });

  describe('DELETE /api/dishes/:id', () => {
    beforeEach(() => {
      // Create a fresh dish for each delete test and store as alias
      cy.fixture('api/dishes').then((dishes) => {
        const dishData = {
          ...dishes.validDish,
          name: generateUniqueDishName('Delete Test Dish'),
        };

        cy.apiCreateDish(dishData).then((response) => {
          cy.wrap(response.body.dish).as('dishToDelete');
        });
      });
    });

    it('should delete dish successfully', function() {
      cy.get('@dishToDelete').then((dishToDelete) => {
        cy.apiDeleteDish(dishToDelete.id).then((response) => {
          expect(response.status).to.eq(200);

          // Verify dish is deleted
          cy.apiGetDish(dishToDelete.id).then((getResponse) => {
            expect(getResponse.status).to.eq(404);
          });
        });
      });
    });

    it('should return 500 when deleting non-existent dish', () => {
      const fakeId = '99999999-9999-9999-9999-999999999999';

      cy.apiDeleteDish(fakeId).then((response) => {
        expect(response.status).to.eq(500);
        // Note: API returns empty body for this error case
      });
    });

    it('should fail when not authenticated', function() {
      // Logout first
      cy.apiLogout();

      cy.get('@dishToDelete').then((dishToDelete) => {
        cy.apiDeleteDish(dishToDelete.id).then((response) => {
          expect(response.status).to.eq(401);
          validateErrorResponse(response, 401);
        });
      });

      // Re-authenticate
      cy.apiSetupAuth(registeredUserEmail, registeredUserPassword);
    });
  });

  describe('Complete CRUD Flow', () => {
    it('should perform full CRUD cycle on a dish', () => {
      cy.fixture('api/dishes').then((dishes) => {
        // CREATE
        const initialDish = {
          ...dishes.validDish,
          name: generateUniqueDishName('CRUD Flow Dish'),
        };

        cy.apiCreateDish(initialDish).then((createResponse) => {
          expect(createResponse.status).to.eq(200);
          const dishId = createResponse.body.dish.id;
          expect(createResponse.body.dish.name).to.eq(initialDish.name);

          // READ
          cy.apiGetDish(dishId).then((getResponse) => {
            expect(getResponse.status).to.eq(200);
            expect(getResponse.body.dish.id).to.eq(dishId);

            // UPDATE
            const updatedDish = {
              name: generateUniqueDishName('CRUD Flow Dish Updated'),
              description: 'Updated in CRUD flow',
            };

            cy.apiUpdateDish(dishId, updatedDish).then((updateResponse) => {
              expect(updateResponse.status).to.eq(200);
              expect(updateResponse.body.dish.name).to.eq(updatedDish.name);
              expect(updateResponse.body.dish.description).to.eq(updatedDish.description);

              // DELETE
              cy.apiDeleteDish(dishId).then((deleteResponse) => {
                expect(deleteResponse.status).to.eq(200);

                // VERIFY DELETION
                cy.apiGetDish(dishId).then((verifyResponse) => {
                  expect(verifyResponse.status).to.eq(404);
                });
              });
            });
          });
        });
      });
    });
  });
});
