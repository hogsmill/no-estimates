
const valueDelivered = require('./results/valueDelivered.js')
const correlation = require('./results/correlation.js')
const cycleTime = require('./results/cycleTime.js')
const wipFuns = require('./results/wip.js')
const cumulativeFlow = require('./results/cumulativeFlow.js')
const distribution = require('./results/distribution.js')
const scatterPlot = require('./results/scatterPlot.js')
const monteCarlo = require('./results/monteCarlo.js')

function _loadGame(db, io, res) {
  const id = res._id
  delete res._id
  db.collection('noEstimatesGames').updateOne({'_id': id}, {$set: res}, function(err) {
    if (err) throw err
    io.emit('loadGame', res)
  })
}

module.exports = {

  showResult: function(db, io, data, debugOn) {

    if (debugOn) { console.log('showResult', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, gameRes) {
      if (err) throw err
      if (gameRes) {
        db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, res) {
          if (err) throw err
          if (res.length) {
            for (let r = 0; r < res.length; r++) {
              data.teamName = res[r].teamName
              const wip = res[r].wip ? res[r].wip : {}
              const cumulative = res[r].cumulative ? res[r].cumulative : {}
              const cards = res[r].columns.find(function(c) {
                return c.name == 'done'
              }).cards
              switch(data.result) {
                case 'sources-of-variation':
                  data.results = gameRes.sourcesOfVariation
                  break
                case 'value-delivered':
                  data.results = valueDelivered.run(res)
                  break
                case 'wip':
                  data.results = wipFuns.run(wip, gameRes.graphConfig.wip.useDays)
                  break
                case 'cumulative-flow':
                  data.results = cumulativeFlow.run(cumulative, gameRes.graphConfig.cumulativeFlow.useDays)
                  break
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

  hideResult: function(db, io, data, debugOn) {

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

  showSourceOfVariation: function(db, io, data, debugOn) {

    if (debugOn) { console.log('showSourceOfVariation', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const sources = []
        for (let i = 0; i < res.sourcesOfVariation.length; i++) {
          const source = res.sourcesOfVariation[i]
          if (source.name == data.source.name) {
            source.show = true
          }
          sources.push(source)
        }
        db.collection('noEstimatesGames').updateOne({'_id': res._id}, {$set: {sourcesOfVariation: sources}}, function(err) {
          if (err) throw err
          data.results = sources
          io.emit('updateSourcesOfVariation', data)
        })
      }
    })
  },

  setWipUseMovingAverage: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setWipUseMovingAverage', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.wip.useMovingAverage = data.value
        _loadGame(db, io, res)
      }
    })
  },

  setWipUseDays: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setWipUseDays', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.wip.useDays = data.value
        _loadGame(db, io, res)
      }
    })
  },

  setCumulativeFlowUseDays: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setCumulativeFlowUseDays', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.cumulativeFlow.useDays = data.value
        _loadGame(db, io, res)
      }
    })
  },

  setCardSize: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setCardSize', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.cycleTime[data.size] = data.value
        _loadGame(db, io, res)
      }
    })
  },

  setMonteCarloRunTo: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setMonteCarloCards', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.monteCarlo.runTo = data.runTo
        _loadGame(db, io, res)
      }
    })
  },

  setMonteCarloRuns: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setMonteCarloRuns', data) }

    db.collection('noEstimatesGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.graphConfig.monteCarlo.runs = data.runs
        _loadGame(db, io, res)
      }
    })
  }
}
