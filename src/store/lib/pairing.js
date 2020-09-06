
function updateTodayCard(card, name) {
  let i 
  const names = []
  for (i = 0; i < card.names.length; i++) {
    if (card.names[i].name.id != name.id) {
      names.push(card.names[i])
    }
  }
  names.push(name)
  card.names = names
  return card
}

function updateTodayColumn(column, cardUnused, name) {
  const cards = []
  let card = {number: card.number, names: [], cardUnused}
      
  for (let i = 0; i < column.cards.length; i++) {
    if (column.cards[i].number != card.number) {
      cards.push(column.cards[i])
    } else {
      card = column.cards[i]
    }
  }
  cards.push(updateTodayCard(card, name))
  column.cards = cards
  return column
}

function updateToday(today, unusedColumn, card, name) {
  const column = {column: column.name, cards: [], unusedColumn: unusedColumn},
      columns = []
  for (let i = 0; i < today.columns.length; i++) {
    if (today.columns[i].column == column.column) {
      column = today.columns[i]
    } else {
      columns.push(today.columns[i])
    }
  }
  columns.push(updateTodayColumn(column, card, name))
  today.columns = columns
  return today
}

function addExtraPointToCardForPairing(column, card) {
  const pairedCard = column.cards.find(function(c) { return c.number == card})
  if (pairedCard && pairedCard.effort) {
    pairedCard.effort[column.name] = pairedCard.effort[column.name] + 1
  }
  return column
}

module.exports = {

  updateTodaysEffort: function(res, column, card, name) {
    const todaysEffort = [], day = res.currentDay, today = {day: day, columns: []}
    for (let i = 0; i < res.daysEffort.length; i++) {
      if (res.daysEffort[i].day != day) {
        todaysEffort.push(res.daysEffort[i])
      } else {
        today = res.daysEffort[i]
      }
    }
    todaysEffort.push(updateToday(today, column, card, name))
    return todaysEffort
  },

  addExtraPointForPairing: function(day, columns, daysEffort) {
    const todaysEffort = daysEffort.find(function(d) { return day == d.day })
    if (todaysEffort) {
      for (let i = 0; i < columns.length; i++) {
        for (let j = 0; j < todaysEffort.columns.length; j++) {
          if (columns[i].name == todaysEffort.columns[j].column) {
            for (let k = 0; k < todaysEffort.columns[j].cards.length; k++) {
              if (todaysEffort.columns[j].cards[k].names.length > 1) {
                columns[i] = addExtraPointToCardForPairing(columns[i], todaysEffort.columns[j].cards[k].number)
              }
            }
          }
        }
      }
    }
    return columns
  },

  addSecondarySkill: function(roles, column, name) {
    const role = column.charAt(0).toUpperCase() + column.slice(1) + 'er'
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].role == role) {
        let roleExists = false
        for (let j = 0; j < roles[i].otherNames.length; j++) {
          if (roles[i].otherNames[j].id == name.id) {
            roleExists = true
          }
        }
        if (!roleExists) {
          roles[i].otherNames.push(name)
        }
      }
    }
    return roles
  }

}
