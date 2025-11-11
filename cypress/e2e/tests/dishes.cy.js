import LoginPage from '../../support/pages/LoginPage';
import DishesPage from '../../support/pages/DishesPage';
import NewDishPage from '../../support/pages/NewDishPage';

describe('Dishes Page - Positive Tests', () => {
  const dishesPage = new DishesPage();
  const newDishPage = new NewDishPage();

  beforeEach(() => {
    // Use session to login once and reuse
    cy.fixture('users').then((users) => {
      cy.loginWithSession(users.validUser.email, users.validUser.password);
      dishesPage.visit();
    });
  });

  it('should display dishes page elements correctly', () => {
    dishesPage.verifyDishesPageLoaded();
  });

  it('should navigate to new dish page', () => {
    dishesPage.clickAddDish();
    cy.url().should('include', '/dishes/new');
    newDishPage.verifyNewDishPageLoaded();
  });

  it('should display dishes list or empty state', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="dishes-empty-state"]').length > 0) {
        dishesPage.verifyEmptyStateDisplayed();
      } else {
        dishesPage.verifyDishesListDisplayed();
      }
    });
  });
});

describe('Dishes Page - Negative Tests', () => {
  const dishesPage = new DishesPage();

  beforeEach(() => {
    cy.clearAllSessionStorage();
    cy.clearCookies();
  });

  it('should redirect to login when not authenticated', () => {
    dishesPage.visit();
    cy.url().should('include', '/login');
  });
});