class DishDetailPage {
  elements = {
    dishDetailHeading: () => cy.getByTestId('dish-detail-heading'),
    dishName: () => cy.getByTestId('dish-detail-name'),
    dishDescription: () => cy.getByTestId('dish-detail-description'),
    dishPrepTime: () => cy.getByTestId('dish-detail-prep-time'),
    dishCookTime: () => cy.getByTestId('dish-detail-cook-time'),
    dishQuickPrep: () => cy.getByTestId('dish-detail-quick-prep'),
    dishImage: () => cy.getByTestId('dish-detail-image'),
    editButton: () => cy.getByTestId('dish-edit-button'),
    deleteButton: () => cy.getByTestId('dish-delete-button'),
    backButton: () => cy.getByTestId('dish-back-button')
  };

  visit(dishId) {
    cy.visit(`/dishes/${dishId}`);
  }

  verifyDishDetails(dishData) {
    // Wait for name to be visible and verify content
    this.elements.dishName().should('be.visible', { timeout: 10000 });
    this.elements.dishName().should('have.text', dishData.name);
    this.elements.dishDescription().should('be.visible').and('contain', dishData.description);
  }

  clickEdit() {
    this.elements.editButton().click();
  }

  clickDelete() {
    this.elements.deleteButton().click();
  }

  clickBack() {
    this.elements.backButton().click();
  }
}

export default DishDetailPage;