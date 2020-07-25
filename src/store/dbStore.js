
var initialRoles = [
  {role: 'Designer', order: 1, names: []},
  {role: 'Developer', order: 2, names: []},
  {role: 'Tester', order: 3, names: []},
  {role: 'Deployer', order: 4, names: []}
]

var initialTeams = [
  { name: 'Blue', otherCards: [], canStartAutoDeploy: false, autoDeploy: { doing: false, effort: 0, done: false } },
  { name: 'Green', otherCards: [], canStartAutoDeploy: false, autoDeploy: { doing: false, effort: 0, done: false } },
  { name: 'Purple', otherCards: [], canStartAutoDeploy: false, autoDeploy: { doing: false, effort: 0, done: false } },
  { name: 'Red', otherCards: [], canStartAutoDeploy: false, autoDeploy: { doing: false, effort: 0, done: false } }
]

var initialColumns = [
  {name: "options", order: 1},
  {name: "design", order: 2, cards: []},
  {name: "develop", order: 3, cards: []},
  {name: "test", order: 4, cards: []},
  {name: "deploy", order: 5, cards: []},
  {name: "done", order: 6, cards: []}
]

function createNewGame(data) {

  var game = data
  game.roles = initialRoles
  game.teams = initialTeams
  game.columns = initialColumns
  game.gameName = data.gameName
  game.currentDay = 1
  game.currentEventCard = 0
  game.currentWorkCard = 0

  return game
}

function _loadGame(err, client, db, io, data) {

  db.collection('games').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
    if (err) throw err;
    if (res) {
      console.log("Loading game '" + data.gameName + "', team '" + data.teamName + "'")
      io.emit("loadGame", res)
      client.close();
    } else {
      var i, games = [], gameTeams = [], game = createNewGame(data)
      for (i = 0; i < initialTeams.length; i++) {
        game.teamName = initialTeams[i].name
        gameTeams.push(game.teamName)
        games.push(JSON.parse(JSON.stringify(game)))
      }
      console.log("Created new game '" + data.gameName + "', teams '" + gameTeams.join(', ') + "'")
      db.collection('games').insertMany(games, function(err, res) {
      if (err) throw err;
      for (i = 0; i < games.length; i++) {
        io.emit("loadGame", games[i])
      }
      _updateRole(err, client, db, io, data)
    })
    }
  })
}

function _updateRole(err, client, db, io, data) {

  db.collection('games').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
    if (err) throw err;
    if (res) {
      var i, j, roles = res.roles
      for (i = 0; i < roles.length; i++) {
        var names = []
        for (j = 0; j < roles[i].names.length; j++) {
          if (roles[i].names[j] != data.name) {
            names.push(roles[i].names[j])
          }
        }
        roles[i].names = names
      }
      for (i = 0; i < roles.length; i++) {
        if (roles[i].role == data.role) {
          roles[i].names.push(data.name)
        }
      }
      db.collection('games').updateOne({"_id": res._id}, {$set: {roles: roles}}, function(err, res) {
        if (err) throw err;
        data.roles = roles
        io.emit("updateRoles", data)
      })
    }
  })
}

function cardValue(workCards, card) {
  if (!card.urgent) {
    if (card.delivery < 3) {
      card.value = 700
    } else if (card.delivery < 6) {
      card.value = 400
    } else {
      card.value = 200
    }
  } else {
    card.value = -100 * card.delivery
  }
  for (var i = 0; i < state.workCards.length; i++) {
    if (workCards[i].number == card.number) {
      workCards[i].delivery = card.delivery
      workCards[i].value = card.value
    }
  }
}

function moveCard(columns, workCards, card, n) {
  var fromCol = columns[n]
  var toCol = columns[n + 1]
  var i, cards = []
  for (i = 0; i < fromCol.cards.length; i++) {
    if (fromCol.cards[i].number != card.number) {
      cards.push(fromCol.cards[i])
    }
  }
  fromCol.cards = cards
  if (toCol.name == 'done') {
    card.done = true
    card.delivery = state.currentDay
    card.time = card.delivery - card.commit
    cardValue(workCards, card)
  }
  toCol.cards.push(card)
}

module.exports = {

  updateRole: function(err, client, db, io, data) {
    _updateRole(err, client, db, io, data)
  },

  loadGame: function(err, client, db, io, data) {
    _loadGame(err, client, db, io, data)
  },

  updateCurrentDay: function(err, client, db, io, data) {

    db.collection('games').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var currentDay = res.currentDay + 1
        db.collection('games').updateOne({"_id": res._id}, {$set: {currentDay: currentDay}}, function(err, res) {
          io.emit("updateCurrentDay", data)
          client.close()
        })
      }
    })
  },

  updateCurrentWorkCard: function(err, client, db, io, data) {

    db.collection('games').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        db.collection('games').updateOne({"_id": res._id}, {$set: {currentWorkCard: data.currentWorkCard}}, function(err, res) {
          if (err) throw err;
          io.emit("updateCurrentWorkCard", data)
          client.close();
        })
      }
    })
  },

  updateCurrentEventCard: function(err, client, db, io, data) {

    db.collection('games').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        db.collection('games').updateOne({"_id": res._id}, {$set: {currentEventCard: data.currentEventCard}}, function(err, res) {
          if (err) throw err;
          io.emit("updateCurrentEventCard", data)
          client.close();
        })
      }
    })
  },

  updateColumns: function(err, client, db, io, data) {

    db.collection('games').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        db.collection('games').updateOne({"_id": res._id}, {$set: {columns: data.columns}}, function(err, res) {
          if (err) throw err;
          io.emit("updateColumns", data)
          client.close();
        })
      }
    })
  },

  updateQueues: function(err, client, db, io, data) {

    db.collection('games').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var i, j, k, columns = res.columns, workCards = res.workCards
        for (i = 1; i < columns.length; i++) {
          for (j = 0; j < columns[i].cards.length; j++) {
            for (k = 0; k < data.blocked.length; k++) {
              if (columns[i].cards[j].number == data.blocked[k]) {
                columns[i].cards[j].blocked = true
              } else {
                columns[i].cards[j].blocked = false
              }
            }
            for (k = 0; k < data.failed.length; k++) {
              if (columns[i].cards[j].number == data.failed[k]) {
                columns[i].cards[j].failed = true
                columns[i].cards[j].effort.deploy = 0
              }
            }
          }
        }
        // Update completed
        for (i = 1; i < columns.length - 1; i++) {
          var column = columns[i]
          var colName = column.name
          for (j = 0; j < column.cards.length; j++) {
            var card = column.cards[j]
            if (!card.blocked && card[colName] == card.effort[colName]) {
              moveCard(columns, workCards, card, i)
            }
          }
        }
        db.collection('games').updateOne({"_id": res._id}, {$set: {columns: columns, workCards: workCards}}, function(err, res) {
          if (err) throw err;
          io.emit("updateColumns", data)
          client.close();
        })
      }
    })
  },

  updateDependentTeam: function(err, client, db, io, data) {

    db.collection('games').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err;
      if (res.length) {
        team = res[0]
        var i, j, columns = team.columns
        for (i = 1; i < columns.length; i++) {
          for (j = 0; j < columns[i].cards.length; j++) {
            var card = columns[i].cards[j]
            if (card.number == data.workCard.number) {
              card.dependentOn = data.dependentOn
            }
          }
        }
        var teams = team.teams
        for (i = 0; i < teams.length; i++) {
          var otherCards = []
          for (j = 0; j < teams[i].otherCards.length; j++) {
            if (teams[i].otherCards[j].number != data.workCard.number) {
              otherCards.push(teams[i].otherCards[j])
            }
          }
          teams[i].otherCards = otherCards
        }
        for (i = 0; i < teams.length; i++) {
          if (teams[i].name == data.dependentOn.name) {
            data.workCard.team = data.teamName
            teams[i].otherCards.push(data.workCard)
          }
        }
        for (var r = 0; r < res.length; r++) {
          if (typeof(res[r]) != "undefined") {
            data.teamName = res[r].teamName
            data.teams = teams
            io.emit("updateTeams", data)
            data.columns = columns
            io.emit("updateColumns", data)
            db.collection('games').updateOne({"_id": res[r]._id}, {$set: {teams: teams, columns: columns}}, function(err, res) {
              if (err) throw err;
            })
          }
        }
      }
    })
  },

  updateEffort: function(err, client, db, io, data) {

    db.collection('games').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var columns = res.columns
        for (var i = 1; i < columns.length; i++) {
          for (var j = 0; j < columns[i].cards.length; j++) {
            if (columns[i].cards[j].number == data.workCard.number) {
              columns[i].cards[j].effort = data.workCard.effort
            }
          }
        }
        data.columns = columns
        db.collection('games').updateOne({"_id": res._id}, {$set: {columns: columns}}, function(err, res) {
          io.emit("updateColumns", data)
          client.close()
        })
      }
    })
  },
}
