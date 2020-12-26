
module.exports = {

  cycleTime: function(workCards) {
    const results = {
      ids: [],
      days: []
    }
    for (let i = 0; i < workCards.length; i++) {
      if (workCards[i].delivery) {
        results.ids.push(workCards[i].number)
        results.days.push(workCards[i].delivery - workCards[i].commit)
      }
    }
    return results
  }
}
