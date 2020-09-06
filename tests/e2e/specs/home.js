// https://docs.cypress.io/api/introduction/api.html

describe('First load', () => {
  it('Loads the No Estimates game', () => {
    cy.visit('/')
    cy.contains('h1', 'No Estimates')
  })
  
  it('Forcing an error', () => {
    cy.visit('/')
    cy.contains('h1', 'This shoudl error')
  })
})
