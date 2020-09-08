const gameName = "_Cypress Game"
const myName = "_Cypress Name"

describe('Set initial config', () => {

  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('Only shows game name button initially', () => {
    cy.visit('/')
    cy.contains('.game-name button', 'Set Game Name')
    cy.get('.my-name button').should('not.exist')
    cy.get('.getTeamName-name button').should('not.exist')
    cy.get('.role-name button').should('not.exist')
  })

  it('Only shows my name button once game name set', () => {
    cy.visit('/')
    cy.get('.game-name button').click()
    cy.get('#game-name').type(gameName)
    cy.get('.set-game-name button').click()
    cy.get('.game-name').contains('Game: ' + gameName)

    // Hack to restart game; should be in beforeEach
    const stub = cy.stub()
    cy.on ('window:alert', stub)
    cy.get('.game-name .restart').click()

    cy.contains('.my-name button', 'Set My Name')
    cy.get('.getTeamName-name button').should('not.exist')
    cy.get('.role-name button').should('not.exist')
  })

  it('Only shows team name button once game name and my name set', () => {
    cy.visit('/')
    cy.get('.game-name button').click()
    cy.get('#game-name').type(gameName)
    cy.get('.set-game-name button').click()

    cy.get('.my-name button').click()
    cy.get('#my-name').type(myName)
    cy.get('.set-my-name button').click()

    cy.get('.my-name').contains('My Name is: ' + myName)
    cy.contains('.team-name button', 'Set My Team')
    cy.get('.role-name button').should('not.exist')
  })

  it('Only shows role name button once game name, my name and team set', () => {
    cy.visit('/')
    cy.get('.game-name button').click()
    cy.get('#game-name').type(gameName)
    cy.get('.set-game-name button').click()

    cy.get('.my-name button').click()
    cy.get('#my-name').type(myName)
    cy.get('.set-my-name button').click()

    cy.get('.team-name button').click()
    cy.get('.set-team-name select').select('Blue')
    cy.get('.set-team-name button').click()

    cy.get('.team-name').contains('My Team is: Blue')
  })

  it('When (everything and) role is set, effort is coloured, and role shows name. Refreshing saves all info', () => {
    cy.visit('/')
    cy.get('.game-name button').click()
    cy.get('#game-name').type(gameName)
    cy.get('.set-game-name button').click()

    cy.get('.my-name button').click()
    cy.get('#my-name').type(myName)
    cy.get('.set-my-name button').click()

    cy.get('.team-name button').click()
    cy.get('.set-team-name select').select('Blue')
    cy.get('.set-team-name button').click()

    cy.get('.role-name button').click()
    cy.get('.set-role select').select('Designer')
    cy.get('.set-role button').click()

    cy.get('.role-name').contains('My Role is: Designer')
    cy.get('.my-name .effort').should('have.length', 4)
    cy.get('.my-name .effort').contains('1').should('have.class', 'designer')
    cy.get('.roles .designer').contains(myName)

    cy.reload()

    cy.get('.game-name').contains('Game: ' + gameName)
    cy.get('.my-name').contains('My Name is: ' + myName)
    cy.get('.team-name').contains('My Team is: Blue')
    cy.get('.role-name').contains('My Role is: Designer')
    cy.get('.my-name .effort').should('have.length', 4)
    cy.get('.my-name .effort').contains('1').should('have.class', 'designer')
    cy.get('.roles .designer').contains(myName)
  })
})
