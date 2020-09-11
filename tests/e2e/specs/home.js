// https://docs.cypress.io/api/introduction/api.html

describe('First load', () => {

  const spyAction = (type, payload, optionalSpyName = type) => {
    return cy.window().its('store._modules.root.context').should(context => {
      cy.spy(context, 'commit')
        .withArgs(type, payload)
        .as(optionalSpyName)
    })
  }

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })
  it('Loads the No Estimates game', () => {
    cy.contains('h1', 'No Estimates')
  })
  

  it('Has basic initial state', () => {
    cy.window()
    .its('app.$store.state').should(({currentDay, workCards}) => {
      expect(currentDay).to.equal(1)
      expect(workCards).to.have.lengthOf(25)
    })
  })


  it('Allows us to set a game name', () => {
    spyAction('updateGameName', 'Typed in game name')
    
    cy.get('button').contains('Set Game Name').click()
    cy.contains('h4', 'Your Game Name')
    cy.get('input#game-name').type('Typed in game name')
    cy.get('button').contains('Save').click()
    
    cy.get('@updateGameName').should('have.been.calledOnce')
  })

  it('Reacts when we set the game name', () => {
    cy.window()
      .its('app.$store').should((store) => {
        store.commit('updateGameName', 'Another Game Name')
      })
    cy.contains('span', 'Game: Another Game Name')
  })


})
