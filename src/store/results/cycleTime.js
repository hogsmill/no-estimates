
const cardFuns = require('../lib/cards.js')

module.exports = {

  run: function(workCards) {

    let i, results = []
    for (i = 0; i < workCards.length; i++) {
      if (workCards[i].delivery) {
        results.push({
          id: '#' + workCards[i].number,
          effort: cardFuns.totalEffort(workCards[i]),
          days: workCards[i].delivery - workCards[i].commit
        })
      }
    }
    results = results.sort(function(a, b) {
      return a.days - b.days
    })
    const data = {
      ids: [],
      effort: [],
      days: []
    }
    for (i = 0; i < results.length; i++) {
      data.ids.push(results[i].id)
      data.effort.push(results[i].effort)
      data.days.push(results[i].days)
    }
    return data
  }
}
