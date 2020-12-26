
const stats = require('./lib/stats.js')

function maxDeliveryTime(workCards) {
  let max = 0
  for (let i = 0; i < workCards.length; i++) {
    if (workCards[i].delivery) {
      const delivery = workCards[i].delivery - workCards[i].commit
      if (delivery > max) {
        max = delivery
      }
    }
  }
  return max
}

function distribution(workCards) {
  const results = {
    days: [],
    counts: []
  }
  const max = maxDeliveryTime(workCards)
  for (let i = 0; i < max; i++) {
    results.days.push(i + 1)
  }
  const counts = {}
  for (let i = 0; i < workCards.length; i++) {
    if (workCards[i].delivery) {
      const delivery = workCards[i].delivery - workCards[i].commit
      if (!counts[delivery]) {
        counts[delivery] = 1
      } else {
        counts[delivery] = counts[delivery] + 1
      }
    }
  }
  for (let j = 0; j < results.days.length; j++) {
    const count = counts[results.days[j]] ? counts[results.days[j]] : 0
    results.counts.push(count)
  }
  return results
}

function cycleTime(workCards) {
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
            case 'cycle-time':
              data.results = cycleTime(res[r].workCards)
              break
            case 'distribution':
              data.results = distribution(res[r].workCards)
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
