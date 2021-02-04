
const sma = require('sma')

module.exports = {

  run: function(wip) {
    const results = {
      wip: [],
      wipMovingAverage: [],
      average: 0,
      labels: [],
      labelsMovingAverage: []
    }
    let sum = 0
    for (let i = 0; i < wip.length; i++) {
      results.wip.push(wip[i].overall)
      sum = sum + parseInt(wip[i].overall)
      results.labels.push(i)
    }

    results.wipMovingAverage = sma(results.wip, 12)
    results.labelsMovingAverage = results.labels.slice(6, results.labels.length - 6)
    results.average = sum == 0 ? 0 : Math.round((sum / wip.length) * 1000) / 1000
    return results
  }
}
