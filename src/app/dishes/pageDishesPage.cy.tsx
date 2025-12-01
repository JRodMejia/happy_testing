import React from 'react'
import DishesPage from './page'

describe('<DishesPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DishesPage />)
  })
})