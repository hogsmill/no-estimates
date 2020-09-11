// https://docs.cypress.io/api/introduction/api.html

describe('Game setup', () => {

  const spyContext = () => {
    return cy.window().its('store._modules.root.context')
  }
  const spyAction = (type) => {
    spyContext().should(context => {
      cy.spy(context, 'commit')
        .withArgs(type)
        .as(type)
    })
  }
  const spyArgs = (spy) => {
    return spy.args[0][1]
  }

  const callAction = (type, payload) => {
    return cy.window()
      .its('app.$store').should((store) => {
        store.commit(type, payload)
      })
  }


  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })
  it('Loads the No Estimates game', () => {
    cy.contains('h1', 'No Estimates')
  })
  
  it('Only shows game name button initially', () => {
    cy.contains('.game-name button', 'Set Game Name')
    cy.get('.my-name button').should('not.exist')
    cy.get('.getTeamName-name button').should('not.exist')
    cy.get('.role-name button').should('not.exist')
  })

  it('Has basic initial state', () => {
    cy.window()
    .its('app.$store.state').should(({currentDay, workCards}) => {
      expect(currentDay).to.equal(1)
      expect(workCards).to.have.lengthOf(25)
    })
  })

  


  it('Allows us to trigger action `updateGameName`', () => {
    spyAction('updateGameName')
    
    cy.get('button').contains('Set Game Name').click()
    cy.contains('h4', 'Your Game Name')
    cy.get('input#game-name').type('Typed in game name')
    cy.get('button').contains('Save').click()

    cy.get('@updateGameName').should('have.been.calledOnce')
    cy.get('@updateGameName').should(spy => {
      expect(spyArgs(spy)).to.eq('Typed in game name')
    })

  })

  it('`updateGameName` allows us setup a name', () => {
    callAction('updateGameName', 'Another Game Name')

    cy.contains('span', 'Game: Another Game Name')

    cy.contains('.my-name button', 'Set My Name')
    cy.get('.getTeamName-name button').should('not.exist')
    cy.get('.role-name button').should('not.exist')
  })

  it('Allows us to trigger action `setMyName`', () => {
    callAction('updateGameName', 'Generic Game Name')
    spyAction('setMyName')
    
    cy.get('.my-name button').click()
    cy.get('#my-name').type('Typed in team name')
    cy.get('.set-my-name button').click()

    cy.get('@setMyName').should('have.been.calledOnce')
    cy.get('@setMyName').should(spy => {
      expect(spyArgs(spy)).to.have.property('name','Typed in team name')
    })
  })

  it('`setMyName` allows us setup a team colour', () => {
    callAction('updateGameName', 'Another Game Name')
    callAction('setMyName', {
      name:'Another Team Name',
      captain: false,
      id: '7ccf60aa-9eec-4d19-8f6a-3bdbfbea63de'
    })
    cy.contains('span', 'My Name is: Another Team Name')
    cy.contains('.team-name button', 'Set My Team')
    cy.get('.role-name button').should('not.exist')
  })

  it('You can choose a team colour', () => {
    spyAction('updateTeamName')
    callAction('updateGameName', 'Another Game Name')
    callAction('setMyName', {
      name:'Another Team Name',
      captain: false,
      id: '7ccf60aa-9eec-4d19-8f6a-3bdbfbea63de'
    })
    cy.get('.team-name button').click()
    cy.get('.set-team-name select').select('Green')
    cy.get('.set-team-name button').click()
    
    cy.get('@updateTeamName').should('have.been.calledOnce')
    cy.get('@updateTeamName').should(spy => {
      expect(spyArgs(spy)).to.eq('Green')
    })
  })
  it('You can choose a team colour', () => {
    callAction('updateGameName', 'Another Game Name')
    callAction('setMyName', {
      name:'Another Team Name',
      captain: false,
      id: '7ccf60aa-9eec-4d19-8f6a-3bdbfbea63de'
    })
    callAction('updateTeamName', 'Red')
    cy.get('.team-name').contains('My Team is: Red')
  })

  it('You can choose a speciality', () => {
    spyAction('updateMyRole')
    callAction('updateGameName', 'Another Game Name')
    callAction('setMyName', {
      name:'Another Team Name',
      captain: false,
      id: '7ccf60aa-9eec-4d19-8f6a-3bdbfbea63de'
    })
    callAction('updateTeamName', 'Red')

    cy.get('.role-name button').click()
    cy.get('.set-role select').select('Tester')
    cy.get('.set-role button').click()
    
    cy.get('@updateMyRole').should('have.been.calledOnce')
    cy.get('@updateMyRole').should(spy => {
      expect(spyArgs(spy)).to.eq('Tester')
    })
  })
  it('Can show the selected speciality', () => {
    callAction('updateGameName', 'Another Game Name')
    callAction('setMyName', {
      name:'Another Team Name',
      captain: false,
      id: '7ccf60aa-9eec-4d19-8f6a-3bdbfbea63de'
    })
    callAction('updateTeamName', 'Red')
    callAction('updateMyRole', 'Developer')

    cy.get('.role-name').contains('My Role is: Developer')
    cy.get('.my-name .effort').should('have.length', 4)
    cy.get('.my-name .effort').contains('1').should('have.class', 'developer')
    //The next line _only_ works when the database is online. Needs investigation
    //cy.get('.roles .designer').contains('Another Team Name')
  })

  it('Allows page reloads', () => {
    callAction('updateGameName', 'Another Game Name')
    callAction('setMyName', {
      name:'Another Team Name',
      captain: false,
      id: '7ccf60aa-9eec-4d19-8f6a-3bdbfbea63de'
    })
    callAction('updateTeamName', 'Red')
    callAction('updateMyRole', 'Developer')

    cy.reload()

    cy.get('.game-name').contains('Game: Another Game Name')
    cy.get('.my-name').contains('My Name is: Another Team Name')
    cy.get('.team-name').contains('My Team is: Red')
    cy.get('.role-name').contains('My Role is: Developer')
    cy.get('.my-name .effort').should('have.length', 4)
    cy.get('.my-name .effort').contains('1').should('have.class', 'developer')
    //The next line _only_ works when the database is online. Needs investigation
    //cy.get('.roles .designer').contains('Another Team Name')
  })
})
