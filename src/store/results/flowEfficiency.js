
module.exports = {

  run: function(columns, day) {
    let days = 0, maxDays = 0
    for (let i = 0; i < columns.length; i++) {
      for (let j = 0; j < columns[i].cards.length; j++) {
        days = days + columns[i].cards[j].daysWorkedOn.length
        maxDays = maxDays + day - columns[i].cards[j].commit
      }
    }
    return parseInt(100 * days / maxDays) / 100
  }
}
