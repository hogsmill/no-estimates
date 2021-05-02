
const initialCards = [
  {number: 1, design: 6, develop: 7, test: 8, deploy: 2, urgent: false, teamDependency: 0},
  {number: 2, design: 0, develop: 8, test: 6, deploy: 4, urgent: false, teamDependency: 0},
  {number: 3, design: 10, develop: 9, test: 9, deploy: 3, urgent: true, teamDependency: 0},
  {number: 4, design: 4, develop: 9, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0},
  {number: 5, design: 4, develop: 10, test: 5, deploy: 2, urgent: false, teamDependency: 4, dependencyDone: 0},
  {number: 6, design: 1, develop: 8, test: 2, deploy: 5, urgent: false, teamDependency: 0},
  {number: 7, design: 1, develop: 10, test: 3, deploy: 1, urgent: false, teamDependency: 0},
  {number: 8, design: 0, develop: 4, test: 3, deploy: 5, urgent: false, teamDependency: 0},
  {number: 9, design: 10, develop: 4, test: 10, deploy: 6, urgent: false, teamDependency: 0},
  {number: 10, design: 1, develop: 7, test: 10, deploy: 8, urgent: true, teamDependency: 4, dependencyDone: 0},
  {number: 11, design: 8, develop: 10, test: 10, deploy: 1, urgent: false, teamDependency: 0},
  {number: 12, design: 3, develop: 8, test: 11, deploy: 3, urgent: false, teamDependency: 0},
  {number: 13, design: 0, develop: 6, test: 9, deploy: 4, urgent: false, teamDependency: 0},
  {number: 14, design: 1, develop: 6, test: 3, deploy: 1, urgent: false, teamDependency: 0},
  {number: 15, design: 10, develop: 1, test: 5, deploy: 2, urgent: true, teamDependency: 0},
  {number: 16, design: 2, develop: 5, test: 1, deploy: 5, urgent: false, teamDependency: 0},
  {number: 17, design: 3, develop: 6, test: 8, deploy: 4, urgent: false, teamDependency: 0},
  {number: 18, design: 0, develop: 7, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0},
  {number: 19, design: 5, develop: 9, test: 4, deploy: 7, urgent: true, teamDependency: 0},
  {number: 20, design: 8, develop: 8, test: 3, deploy: 7, urgent: false, teamDependency: 0},
  {number: 21, design: 1, develop: 6, test: 5, deploy: 1, urgent: false, teamDependency: 4, dependencyDone: 0},
  {number: 22, design: 0, develop: 10, test: 7, deploy: 7, urgent: false, teamDependency: 0},
  {number: 23, design: 5, develop: 10, test: 11, deploy: 8, urgent: false, teamDependency: 0},
  {number: 24, design: 0, develop: 6, test: 4, deploy: 6, urgent: false, teamDependency: 0},
  {number: 25, design: 3, develop: 2, test: 2, deploy: 4, urgent: false, teamDependency: 0}
]

function cardValue(workCards, card) {
  if (!card.urgent) {
    if (card.time < 3) {
      card.value = 700
    } else if (card.time < 6) {
      card.value = 400
    } else {
      card.value = 200
    }
  } else {
    card.value = -100 * card.time
  }
  const workCard = workCards.find(function(workCard) { return workCard.number == card.number })
  workCard.delivery = card.delivery
  workCard.value = card.value
}

function deployFailPercentage(card, deployFail) {
  if (card.workedOn.deploy) {
    const pairedInDeploy = card.workedOn.deploy.find(function(n) {
      return n.role != 'Deployer'
    })
    if (pairedInDeploy) {
      deployFail = deployFail / 2
    }
  }
  return deployFail
}

function blockOrFailCard(card, colName, teamName, autoDeploy, percentageBlocked, percentageDeployFail) {
  const rand = Math.random()
  card.blocked = false
  card.failed = false
  if (colName != 'deploy' && colName != 'done' && rand < parseFloat(percentageBlocked)) {
    card.blocked = true
  }
  if (colName == 'deploy') {
    percentageDeployFail = deployFailPercentage(card, parseFloat(percentageDeployFail))
  }
  // TODO: shouldn't need >= - check adding effort
  if (colName == 'deploy' && !autoDeploy.done && card.effort['deploy'] >= card.deploy  && rand < parseFloat(percentageDeployFail)) {
    card.failed = true
    card.effort.deploy = 0
  }
}

function selectDependentTeam(teams, teamName) {
  // Make sure we don't pick our own team...
  const otherTeams = []
  for (let i = 0; i < teams.length; i++) {
    if (teams[i].include && teams[i].name != teamName) {
      otherTeams.push(i)
    }
  }
  const index = otherTeams[Math.floor(Math.random() * otherTeams.length)]
  return teams[index]
}

function getCardFirstColumn(card, columns) {
  let column
  for (let i = 0; i < columns.length; i++) {
    if (!column && card[columns[i].name] > 0) {
      column = columns[i].name
    }
  }
  return column
}

function newCard(card) {
  card.dependentOn = ''
  card.blocked = false
  card.effort = {
    design: 0,
    develop: 0,
    test: 0,
    deploy: 0
  }
  card.workedOn = {}
  card.daysWorkedOn = []

  return card
}

module.exports = {

  initialCards: function() {
    return initialCards
  },

  totalEffort: function(card) {
    return card.design +
      card.develop +
      card.test +
      card.deploy
  },

  pullInCard: function(columns, workCards, currentWorkCard, currentDay, teams, teamName) {
    const newColumns = []
    let card = workCards.find(function(c) {
      return c.number == currentWorkCard
    })
    card = newCard(card)
    if (teams.length < 2) {
      card.teamDependency = 0
    }
    const cardColumn = getCardFirstColumn(card, columns)
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i]
      if (column.name == cardColumn) {
        const cards = column.cards
        card.commit = currentDay
        if (card.teamDependency) {
          card.dependentOn = selectDependentTeam(teams, teamName)
        }
        cards.push(card)
        column.cards = cards
      }
      newColumns.push(column)
    }
    return newColumns
  },

  addCardWorkedOnInDay: function(card, day) {
    let found = false
    for (let i = 0; i < card.daysWorkedOn.length; i++) {
      if (card.daysWorkedOn[i] == day) {
        found = true
      }
    }
    if (!found) {
      card.daysWorkedOn.push(day)
    }
    return card
  },

  addWorkedOn: function(card, column, name, role) {
    if (!card.workedOn[column]) {
      card.workedOn[column] = []
    }
    const workedInColumn = card.workedOn[column].find(function(n) {
      return n.id == name.id
    })
    if (!workedInColumn) {
      name.role = role
      card.workedOn[column].push(name)
    }
    return card
  },

  cardCompleteInColumn: function(card, colName, res) {
    const team = res.teamName
    const autoDeploy = res.autoDeploy
    const percentageBlocked = res.config.percentageBlocked
    const percentageDeployFail = res.config.percentageDeployFail
    blockOrFailCard(card, colName, team, autoDeploy, percentageBlocked, percentageDeployFail)
    let dependentDone = true
    if (colName == 'deploy') {
      dependentDone = card.teamDependency == 0 || card.teamDependency == card.dependencyDone
    }
    // TODO: shouldn't need >= - check adding effort
    return !card.blocked && !card.failed && card.effort[colName] >= card[colName] && dependentDone
  },

  moveCard: function(columns, workCards, card, n, currentDay) {
    const fromCol = columns[n]
    const toCol = columns[n + 1]
    let i
    const cards = []
    for (i = 0; i < fromCol.cards.length; i++) {
      if (fromCol.cards[i].number != card.number) {
        cards.push(fromCol.cards[i])
      }
    }
    fromCol.cards = cards
    if (toCol.name == 'done') {
      card.done = true
      card.delivery = currentDay
      card.time = card.delivery - card.commit
      cardValue(workCards, card)
    }
    toCol.cards.push(card)
  },

  calculateActuals: function(columns, workCards, mvpCards, day, mvp, project) {
    const actuals = {
      mvp: mvp,
      project: project
    }
    const done = columns.find(function(c) {
      return c.name == 'done'
    })
    if (!project && done.cards.length == workCards.length) {
      actuals.project = day
    }
    if (!mvp && done.cards.length >= mvpCards) {
      let mvpDone = true
      for (let i = 1; i <= mvpCards; i++) {
        if (!done.cards.find(function(c) {
          return c.number == i
        })) {
          mvpDone = false
        }
      }
      if (mvpDone) {
        actuals.mvp = day
      }
    }
    return actuals
  },

  wip: function(columns, currentDay) {
    const wip = {}
    let overall = 0
    for (let i = 0; i < columns.length; i++) {
      const cards = columns[i].cards.length
      if (columns[i].name != 'done') {
        wip[columns[i].name] = cards
        overall = overall + cards
      }
    }
    wip.day = currentDay
    wip.overall = overall
    return wip
  },

  cumulative: function(columns, currentDay) {
    const cumulative = {}
    for (let i = 0; i < columns.length; i++) {
      const cards = columns[i].cards.length
      cumulative[columns[i].name] = cards
    }
    cumulative.day = currentDay
    return cumulative
  }
}
