import DishesPage from '../../support/pages/DishesPage';
import NewDishPage from '../../support/pages/NewDishPage';
import DishDetailPage from '../../support/pages/DishDetailPage';
import EditDishPage from '../../support/pages/EditDishPage';

describe('Dishes CRUD - Create Operations', () => {
  const dishesPage = new DishesPage();
  const newDishPage = new NewDishPage();

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.loginWithSession(users.validUser.email, users.validUser.password);
    });
  });

  it('should create a new dish successfully', () => {
    cy.fixture('dishes').then((dishes) => {
      dishesPage.visit();
      dishesPage.clickAddDish();
      
      // Verify we're on the new dish page
      cy.url().should('include', '/dishes/new');
      newDishPage.verifyNewDishPageLoaded();
      
      newDishPage.fillDishForm(dishes.validDish);
      newDishPage.submitForm();
      
      // Wait for navigation and verify
      cy.url().should('include', '/dishes', { timeout: 10000 });
      cy.url().should('not.include', '/dishes/new');
      dishesPage.verifyDishExists(dishes.validDish.name);
    });
  });

  it('should show form with all fields', () => {
    dishesPage.visit();
    dishesPage.clickAddDish();
    
    newDishPage.elements.nameInput().should('be.visible');
    newDishPage.elements.descriptionInput().should('be.visible');
    newDishPage.elements.prepTimeInput().should('be.visible');
    newDishPage.elements.cookTimeInput().should('be.visible');
    newDishPage.elements.quickPrepCheckbox().should('exist');
    newDishPage.elements.submitButton().should('be.visible');
  });

  it('should require name field', () => {
    cy.fixture('dishes').then((dishes) => {
      dishesPage.visit();
      dishesPage.clickAddDish();
      
      newDishPage.fillDishForm({
        description: dishes.validDish.description,
        prepTime: dishes.validDish.prepTime,
        cookTime: dishes.validDish.cookTime
      });
      newDishPage.submitForm();
      
      // Should show validation error or prevent submission
      newDishPage.elements.nameInput().should('have.attr', 'required');
    });
  });

  it('should handle quick prep checkbox', () => {
    cy.fixture('dishes').then(() => {
      dishesPage.visit();
      dishesPage.clickAddDish();
      
      newDishPage.elements.quickPrepCheckbox().check();
      newDishPage.elements.quickPrepCheckbox().should('be.checked');
      
      newDishPage.elements.quickPrepCheckbox().uncheck();
      newDishPage.elements.quickPrepCheckbox().should('not.be.checked');
    });
  });

  it('should cancel dish creation', () => {
    dishesPage.visit();
    dishesPage.clickAddDish();
    
    newDishPage.elements.nameInput().type('Test Dish');
    newDishPage.clickCancel();
    
    cy.url().should('include', '/dishes');
    cy.url().should('not.include', '/new');
  });

  it('should validate negative prepTime', () => {
    cy.fixture('dishes').then(() => {
      dishesPage.visit();
      dishesPage.clickAddDish();
      
      newDishPage.fillDishForm({
        name: 'Test Dish',
        prepTime: -5
      });
      
      newDishPage.elements.prepTimeInput().should('have.attr', 'min', '0');
    });
  });

  it('should validate negative cookTime', () => {
    cy.fixture('dishes').then(() => {
      dishesPage.visit();
      dishesPage.clickAddDish();
      
      newDishPage.fillDishForm({
        name: 'Test Dish',
        cookTime: -10
      });
      
      newDishPage.elements.cookTimeInput().should('have.attr', 'min', '0');
    });
  });
});

describe('Dishes CRUD - Read Operations', () => {
  const dishesPage = new DishesPage();
  const newDishPage = new NewDishPage();
  const dishDetailPage = new DishDetailPage();

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.loginWithSession(users.validUser.email, users.validUser.password);
    });
  });

  it('should display list of dishes', () => {
    dishesPage.visit();
    
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="dishes-empty-state"]').length > 0) {
        dishesPage.verifyEmptyStateDisplayed();
      } else {
        dishesPage.verifyDishesListDisplayed();
      }
    });
  });

  it('should view dish details', () => {
    dishesPage.visit();
    
    // Check if there are dishes
    cy.get('[data-testid^="dish-card-"]').then(($cards) => {
      if ($cards.length > 0) {
        dishesPage.clickViewDish(0);
        cy.url().should('match', /\/dishes\/\d+/);
        dishDetailPage.elements.dishDetailHeading().should('be.visible');
      } else {
        cy.log('No dishes available to view');
      }
    });
  });

  it('should navigate back to dishes list', () => {
    dishesPage.visit();
    
    cy.get('[data-testid^="dish-card-"]').then(($cards) => {
      if ($cards.length > 0) {
        dishesPage.clickViewDish(0);
        dishDetailPage.clickBack();
        cy.url().should('include', '/dishes');
        cy.url().should('not.match', /\/dishes\/\d+/);
      }
    });
  });
});

describe('Dishes CRUD - Update Operations', () => {
  const dishesPage = new DishesPage();
  const editDishPage = new EditDishPage();

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.loginWithSession(users.validUser.email, users.validUser.password);
    });
  });

  it('should cancel update operation', () => {
    dishesPage.visit();
    
    cy.get('[data-testid^="dish-card-"]').then(($cards) => {
      if ($cards.length > 0) {
        const originalName = $cards.first().find('[data-testid^="dish-name-"]').text();
        
        dishesPage.clickEditDish(0);
        editDishPage.updateDishField('name', 'Should Not Save');
        editDishPage.clickCancel();
        
        cy.url().should('include', '/dishes');
        dishesPage.verifyDishExists(originalName);
      }
    });
  });

  it('should validate required fields on update', () => {
    dishesPage.visit();
    
    cy.get('[data-testid^="dish-card-"]').then(($cards) => {
      if ($cards.length > 0) {
        dishesPage.clickEditDish(0);
        
        editDishPage.elements.nameInput().clear();
        editDishPage.elements.nameInput().should('have.attr', 'required');
      }
    });
  });
});

describe('Dishes CRUD - Delete Operations', () => {
  const dishesPage = new DishesPage();
  const newDishPage = new NewDishPage();

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.loginWithSession(users.validUser.email, users.validUser.password);
    });
  });
 
  it('should delete dish successfully', () => {
    cy.fixture('dishes').then((dishes) => {
      // Create a dish first
      dishesPage.visit();
      dishesPage.clickAddDish();
      newDishPage.createDish({
        ...dishes.validDish,
        name: `Dish to Delete ${Date.now()}`
      });
      
      // Delete it
      dishesPage.visit();
      dishesPage.getDishCount().then((initialCount) => {
        dishesPage.clickDeleteDish(0);
        
        // Wait a moment for deletion to complete
        cy.wait(500);
        cy.url().should('include', '/dishes');
        dishesPage.getDishCount().should('eq', initialCount - 1);
      });
    });
  });
});
