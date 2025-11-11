class EditDishPage {
  elements = {
    editDishHeading: () => cy.getByTestId('edit-dish-heading'),
    nameInput: () => cy.getByTestId('dish-name-input'),
    descriptionInput: () => cy.getByTestId('dish-description-input'),
    prepTimeInput: () => cy.getByTestId('dish-prep-time-input'),
    cookTimeInput: () => cy.getByTestId('dish-cook-time-input'),
    quickPrepCheckbox: () => cy.getByTestId('dish-quick-prep-checkbox'),
    imageUrlInput: () => cy.getByTestId('dish-image-url-input'),
    updateButton: () => cy.getByTestId('dish-update-button'),
    cancelButton: () => cy.getByTestId('dish-cancel-button'),
    errorMessage: () => cy.getByTestId('dish-error-message')
  };

  visit(dishId) {
    cy.visit(`/dishes/${dishId}/edit`);
  }

  verifyEditPageLoaded() {
    this.elements.editDishHeading().should('be.visible').and('contain', 'Editar Platillo');
  }

  updateDishField(field, value) {
    switch(field) {
      case 'name':
        this.elements.nameInput().clear().type(value);
        break;
      case 'description':
        this.elements.descriptionInput().clear().type(value);
        break;
      case 'prepTime':
        this.elements.prepTimeInput().clear().type(value.toString());
        break;
      case 'cookTime':
        this.elements.cookTimeInput().clear().type(value.toString());
        break;
      case 'quickPrep':
        if (value) {
          this.elements.quickPrepCheckbox().check();
        } else {
          this.elements.quickPrepCheckbox().uncheck();
        }
        break;
      case 'imageUrl':
        this.elements.imageUrlInput().clear().type(value);
        break;
    }
  }

  updateDish(dishData) {
    Object.keys(dishData).forEach(key => {
      this.updateDishField(key, dishData[key]);
    });
    this.elements.updateButton().click();
  }

  clickCancel() {
    this.elements.cancelButton().click();
  }
}

export default EditDishPage;