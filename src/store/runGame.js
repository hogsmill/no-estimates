
const run = require('./run/funs.js')
const db = require('./dbStore.js')

function makeMove() {
  //if (!playableCards(game)) {
  //  console.log('pulling in card')
  //}
}

function runGameTo(game, cards, stepThrough) {
  if (run.complete(game, cards)) {
    return game
  } else {
    makeMove()
    if (stepThrough) {
      return game
    } else {
      runGameTo(game, cards, stepThrough)
    }
  }
}

module.exports = {

  runTo: function(err, db, io, data, debugOn) {

    if (debugOn) { console.log('runTo', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        let cards
        switch(data.runTo) {
          case 'MVP':
            cards = res.config.mvpCards
            break
          case 'End':
            cards = res.workCards.length
            break
        }
        console.log('Running game to card ' + cards + ' (Step Through: ' + data.stepThrough + ')')
        res = runGameTo(res, cards, data.stepThrough)
        run.updateTeam(db, io, res)
      }
    })
  }

}
