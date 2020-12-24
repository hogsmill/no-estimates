
const stats = require('./lib/stats.js')

function scatterPlot(workCards) {
  const results = {
    ids: [],
    days: []
  }
  for (let i = 0; i < workCards.length; i++) {
    // TODO: Hardwired data
    results.ids.push('#' + workCards[i].number)
    results.days.push(parseInt(Math.random() * 20) + 1)

    //if (workCards[i].delivery) {
    //  results.ids.push(workCards[i].id)
    //  results.days.push(workCards[i].delivery - workCards[i].commit)
    //}
  }
  return results
}

function totalEffort(card) {
  return card.design +
    card.develop +
    card.test +
    card.deploy
}

function correlation(workCards) {
  const effort = [], deliveryTime = []
  for (let i = 0; i < workCards.length; i++) {
    if (workCards[i].delivery) {
      const card = workCards[i]
      effort.push(totalEffort(card))
      deliveryTime.push(card.delivery - card.commit)
    }
  }
  return effort.length == 0 ? 0 : stats.pCorrelation(effort, deliveryTime).toFixed(2)
}

module.exports = {

  showResult: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('showResult', data) }

    db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let r = 0; r < res.length; r++) {
          data.teamName = res[r].teamName
          switch(data.result) {
            case 'correlation':
              data.results = correlation(res[r].workCards)
              break
            case 'scatter-plot':
              data.results = scatterPlot(res[r].workCards)
              break
          }
          io.emit('showResult', data)
        }
      }
    })
  },

  hideResult: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('showResult', data) }

    db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let r = 0; r < res.length; r++) {
          data.teamName = res[r].teamName
          io.emit('hideResult', data)
        }
      }
    })
  }
}
