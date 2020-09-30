
module.exports = {

  addDependencyToCard: function(columns, card, dependentOn) {
    for (let i = 1; i < columns.length; i++) {
      for (let j = 0; j < columns[i].cards.length; j++) {
        if (columns[i].cards[j].number == card.number && !columns[i].cards[j].dependentOn) {
          columns[i].cards[j].dependentOn = dependentOn
        }
      }
    }
    return columns
  },

  addCardToOtherCards: function(teams, card, dependentOnTeam, team) {
    for (let i = 0; i < teams.length; i++) {
      if (teams[i].name == dependentOnTeam) {
        card.team = team
        teams[i].otherCards.push(card)
      }
    }
    return teams
  },

  addEffortToOthersCard: function(columns, team, card) {
    for (let i = 1; i < columns.length; i++) {
      for (let j = 0; j < columns[i].cards.length; j++) {
        if (columns[i].cards[j].number == card.number) {
          columns[i].cards[j].dependencyDone = columns[i].cards[j].dependencyDone + 1
        }
      }
    }
    return columns
  },

  addEffortToMyCard: function(teams, team, card) {
    const newTeams = []
    for (let i = 0; i < teams.length; i++) {
      const newTeam = teams[i]
      if (newTeam.name == team) {
        for (let j = 0; j < teams[i].otherCards.length; j++) {
          if (teams[i].otherCards[j].number == card.number) {
            teams[i].otherCards[j].dependencyDone = teams[i].otherCards[j].dependencyDone + 1
          }
        }
      }
      newTeams.push(newTeam)
    }
    return newTeams
  }
}
