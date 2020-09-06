// https://docs.cypress.io/api/introduction/api.html

describe('First load', () => {
  it('Loads the No Estimates game', () => {
    cy.visit('/')
    cy.contains('h1', 'No Estimates')
  })
})
