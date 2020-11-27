
module.exports = {

  addDependencyToCard: function(columns, workCard, dependentOn) {
    const newColumns = []
    newColumns.push(columns[0])
    for (let i = 1; i < columns.length; i++) {
      const column = columns[i]
      const cards = column.cards
      column.cards = []
      for (let j = 0; j < cards.length; j++) {
        const card = cards[j]
        if (card.number == workCard.number && !workCard.dependentOn) {
          card.dependentOn = dependentOn
        }
        column.cards.push(card)
      }
      newColumns.push(column)
    }
    return newColumns
  },

  addDependentEffort: function(columns, workCard, effort) {
    const newColumns = []
    newColumns.push(columns[0])
    for (let i = 1; i < columns.length; i++) {
      const column = columns[i]
      const cards = column.cards
      column.cards = []
      for (let j = 0; j < cards.length; j++) {
        const card = cards[j]
        if (card.number == workCard.number) {
          card.dependencyDone = card.dependencyDone + effort
        }
        column.cards.push(card)
      }
      newColumns.push(column)
    }
    return newColumns
  },

  addOtherCardEffort: function(otherCards, workCard, effort) {
    const newOtherCards = []
    for (let i = 0; i < otherCards.length; i++) {
      const otherCard = otherCards[i]
      if (otherCard.number == workCard.number) {
        otherCard.dependencyDone = otherCard.dependencyDone + effort
      }
      newOtherCards.push(otherCard)
    }
    return newOtherCards
  }
}
