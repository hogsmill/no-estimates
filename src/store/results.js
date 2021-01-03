
const correlation = require('./results/correlation.js')
const cycleTime = require('./results/cycleTime.js')
const distribution = require('./results/distribution.js')
const scatterPlot = require('./results/scatterPlot.js')
const monteCarlo = require('./results/monteCarlo.js')

module.exports = {

  showResult: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('showResult', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, gameRes) {
      if (err) throw err
      if (gameRes) {
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
                  data.results = correlation.run(cards)
                  break
                case 'cycle-time':
                  data.results = cycleTime.run(cards)
                  break
                case 'distribution':
                  data.results = distribution.run(cards)
                  break
                case 'scatter-plot':
                  data.results = scatterPlot.run(cards)
                  if (data.results.length) {
                    data.limits = scatterPlot.limits(data.results)
                  }
                  break
                case 'monte-carlo':
                  data.results = monteCarlo.run(cards, gameRes.graphConfig.monteCarlo)
                  break
              }
              io.emit('showResult', data)
            }
          }
        })
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
  },

  setMonteCarloCards: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('setMonteCarloCards', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.monteCarlo.cards = data.cards
        const id = res._id
        delete res._id
        db.collection('noEstimatesGames').updateOne({'_id': id}, {$set: res}, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })
  },

  setMonteCarloRuns: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('setMonteCarloRuns', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.monteCarlo.runs = data.runs
        const id = res._id
        delete res._id
        db.collection('noEstimatesGames').updateOne({'_id': id}, {$set: res}, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })
  }
}
