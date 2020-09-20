

module.exports = {

  addDependencyToCard: function(columns, card, dependentOn) {
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].name == 'design' && columns[i].order == 2) { // Future proofing in case it ever changes
        for (let j = 0; j < columns[i].cards.length; j++) {
          if (columns[i].cards[j].number == card.number) {
            columns[i].cards[j].dependentOn = dependentOn
          }
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
  }
}
