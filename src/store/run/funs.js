
module.exports = {

  complete: function(game, cards) {
    return game.columns.find(function(c) {
      return c.name == 'done'
    }).cards.length >= cards
  },

  updateTeam: function(db, io, res) {
    const id = res._id
    delete res._id
    db.collection('noEstimates').updateOne({'_id': id}, {$set: res}, function(err) {
      if (err) throw err
      io.emit('loadTeam', res)
    })
  }
}
