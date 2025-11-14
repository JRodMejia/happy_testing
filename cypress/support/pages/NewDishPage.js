class NewDishPage {
  elements = {
    newDishHeading: () => cy.getByTestId('new-dish-heading'),
    newDishFormContainer: () => cy.getByTestId('new-dish-form-container'),
    // Form fields (add these test IDs to NewDishForm.tsx)
    nameInput: () => cy.getByTestId('dish-name-input'),
    descriptionInput: () => cy.getByTestId('dish-description-input'),
    prepTimeInput: () => cy.getByTestId('dish-prep-time-input'),
    cookTimeInput: () => cy.getByTestId('dish-cook-time-input'),
    quickPrepCheckbox: () => cy.getByTestId('dish-quick-prep-checkbox'),
    imageUrlInput: () => cy.getByTestId('dish-image-url-input'),
    submitButton: () => cy.getByTestId('dish-submit-button'),
    cancelButton: () => cy.getByTestId('dish-cancel-button'),
    errorMessage: () => cy.getByTestId('dish-error-message'),
    successMessage: () => cy.getByTestId('dish-success-message')
  };

  visit() {
    cy.visit('/dishes/new');
  }

  verifyNewDishPageLoaded() {
    this.elements.newDishHeading().should('be.visible').and('contain', 'Agregar Platillo');
    this.elements.newDishFormContainer().should('be.visible');
  }

  fillDishForm(dishData) {
    if (dishData.name) this.elements.nameInput().clear().type(dishData.name);
    if (dishData.description) this.elements.descriptionInput().clear().type(dishData.description);
    if (dishData.prepTime !== undefined) this.elements.prepTimeInput().clear().type(dishData.prepTime.toString());
    if (dishData.cookTime !== undefined) this.elements.cookTimeInput().clear().type(dishData.cookTime.toString());
    if (dishData.quickPrep !== undefined && dishData.quickPrep) {
      this.elements.quickPrepCheckbox().check();
    }
    if (dishData.imageUrl) this.elements.imageUrlInput().clear().type(dishData.imageUrl);
    
    // Add at least one preparation step (required field)
    if (dishData.steps && dishData.steps.length > 0) {
      dishData.steps.forEach((step, index) => {
        if (index > 0) {
          // Click "Add step" button for additional steps
          cy.contains('button', '+ Agregar paso').click();
        }
        // Find step inputs by placeholder pattern
        cy.get(`input[placeholder*="Paso ${index + 1}"]`).clear().type(step);
      });
    } else {
      // If no steps provided, add a default one
      cy.get('input[placeholder*="Paso 1"]').clear().type('Preparar el platillo según las instrucciones');
    }
  }

  submitForm() {
    this.elements.submitButton().click();
  }

  createDish(dishData) {
    this.fillDishForm(dishData);
    this.submitForm();
  }

  clickCancel() {
    this.elements.cancelButton().click();
  }

  verifyValidationError() {
    this.elements.errorMessage().should('be.visible');
  }
}

export default NewDishPage;