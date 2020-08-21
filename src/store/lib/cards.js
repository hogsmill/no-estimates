
function cardValue(workCards, card) {
  if (!card.urgent) {
    if (card.delivery < 3) {
      card.value = 700
    } else if (card.delivery < 6) {
      card.value = 400
    } else {
      card.value = 200
    }
  } else {
    card.value = -100 * card.delivery
  }
  workCard = workCards.find(function(workCard) { return workCard.number == card.number })
  workCard.delivery = card.delivery
  workCard.value = card.value
}

function blockOrFailCard(card, colName, teamName, teams, percentageBlocked, percentageDeployFail) {
  var team = teams.find(function(t) { return t.name == teamName })
  var rand = Math.random()
  card.blocked = false
  card.failed = false
  if (colName != 'deploy' && colName != 'done' && rand < percentageBlocked) {
    card.blocked = true
  }
  if (colName == 'deploy' && !team.autoDeploy.done && card.deploy == card.effort['deploy'] && rand < percentageDeployFail) {
    card.failed = true
    card.effort.deploy = 0
  }
}

module.exports = {

  cardCompleteInColumn: function(card, colName, team, teams, percentageBlocked, percentageDeployFail) {
    blockOrFailCard(card, colName, team, teams, percentageBlocked, percentageDeployFail)
    var dependentDone = true
    if (colName == 'deploy') {
      dependentDone = card.teamDependency == 0 || card.teamDependency == card.dependencyDone
    }
    return !card.blocked && !card.failed && card[colName] == card.effort[colName] && dependentDone
  },

  moveCard: function(columns, workCards, card, n, currentDay) {
    var fromCol = columns[n]
    var toCol = columns[n + 1]
    var i, cards = []
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
  }
}
