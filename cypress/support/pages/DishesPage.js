class DishesPage {
  elements = {
    dishesHeading: () => cy.getByTestId('dishes-heading'),
    addDishButton: () => cy.getByTestId('add-dish-button'),
    dishesEmptyState: () => cy.getByTestId('dishes-empty-state'),
    dishesEmptyText: () => cy.getByTestId('dishes-empty-text'),
    dishesList: () => cy.getByTestId('dishes-list'),
    // Individual dish cards (add these test IDs to DishesClientList)
    dishCard: (index) => cy.getByTestId(`dish-card-${index}`),
    dishName: (index) => cy.getByTestId(`dish-name-${index}`),
    dishDescription: (index) => cy.getByTestId(`dish-description-${index}`),
    dishViewButton: (index) => cy.getByTestId(`dish-view-button-${index}`),
    dishEditButton: (index) => cy.getByTestId(`dish-edit-button-${index}`),
    dishDeleteButton: (index) => cy.getByTestId(`dish-delete-button-${index}`),
    // Delete confirmation modal
    deleteModal: () => cy.getByTestId('delete-modal'),
    deleteConfirmButton: () => cy.getByTestId('delete-confirm-button'),
    deleteCancelButton: () => cy.getByTestId('delete-cancel-button')
  };

  visit() {
    cy.visit('/dishes');
  }

  clickAddDish() {
    this.elements.addDishButton().click();
  }

  verifyDishesPageLoaded() {
    this.elements.dishesHeading().should('be.visible').and('contain', 'Sugerencias de Platillos');
    this.elements.addDishButton().should('be.visible');
  }

  verifyEmptyStateDisplayed() {
    this.elements.dishesEmptyState().should('be.visible');
    this.elements.dishesEmptyText().should('contain', 'No hay platillos registrados.');
  }

  verifyDishesListDisplayed() {
    this.elements.dishesList().should('be.visible');
  }

  verifyDishExists(dishName) {
    this.elements.dishesList().should('contain', dishName);
  }

  clickViewDish(index = 0) {
    this.elements.dishViewButton(index).click();
  }

  clickEditDish(index = 0) {
    this.elements.dishEditButton(index).click();
  }

  clickDeleteDish(index = 0) {
    this.elements.dishDeleteButton(index).click();
  }

  confirmDelete() {
    this.elements.deleteConfirmButton().click();
  }

  cancelDelete() {
    this.elements.deleteCancelButton().click();
  }

  getDishCount() {
    return cy.get('[data-testid^="dish-card-"]').its('length');
  }
}

export default DishesPage;