
const correlation = require('./results/correlation.js')
const cycleTime = require('./results/cycleTime.js')
const distribution = require('./results/distribution.js')
const scatterPlot = require('./results/scatterPlot.js')
const monteCarlo = require('./results/monteCarlo.js')

module.exports = {

  showResult: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('showResult', data) }

    db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let r = 0; r < res.length; r++) {
          data.teamName = res[r].teamName
          const cards = res[r].columns.find(function(c) {
            return c.name == 'done'
          }).cards
          switch(data.result) {
            case 'correlation':
              data.results = correlation.correlation(cards)
              break
            case 'cycle-time':
              data.results = cycleTime.cycleTime(cards)
              break
            case 'distribution':
              data.results = distribution.distribution(cards)
              break
            case 'scatter-plot':
              data.results = scatterPlot.scatterPlot(cards)
              if (data.results.length) {
                data.limits = scatterPlot.limits(data.results)
              }
              break
            case 'monte-carlo':
              data.results = cycleTime.cycleTime(cards)
              console.log(data.results)
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
