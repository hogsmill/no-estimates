
const correlation = require('./results/correlation.js')
const cycleTime = require('./results/cycleTime.js')
const distribution = require('./results/distribution.js')
const scatterPlot = require('./results/scatterPlot.js')

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
              data.results = correlation.correlation(res[r].workCards)
              break
            case 'cycle-time':
              data.results = cycleTime.cycleTime(res[r].workCards)
              break
            case 'distribution':
              data.results = distribution.distribution(res[r].workCards)
              break
            case 'scatter-plot':
              data.results = scatterPlot.scatterPlot(res[r].workCards)
              if (data.results.length) {
                data.limits = scatterPlot.limits(data.results)
              }
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
