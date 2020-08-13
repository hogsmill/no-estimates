
const util = require('util')

var initialRoles = [
  {role: 'Designer', order: 1, names: [], otherNames: []},
  {role: 'Developer', order: 2, names: [], otherNames: []},
  {role: 'Tester', order: 3, names: [], otherNames: []},
  {role: 'Deployer', order: 4, names: [], otherNames: []}
]

var initialTeams = [
  { name: 'Blue', otherCards: [], concurrentDevAndTest: false, canStartAutoDeploy: false, autoDeploy: { doing: false, effort: 0, done: false } },
  { name: 'Green', otherCards: [], concurrentDevAndTest: false, canStartAutoDeploy: false, autoDeploy: { doing: false, effort: 0, done: false } },
  { name: 'Purple', otherCards: [], concurrentDevAndTest: false, canStartAutoDeploy: false, autoDeploy: { doing: false, effort: 0, done: false } },
  { name: 'Red', otherCards: [], concurrentDevAndTest: false, canStartAutoDeploy: false, autoDeploy: { doing: false, effort: 0, done: false } }
]

var initialColumns = [
  {name: "options", order: 1},
  {name: "design", order: 2, cards: []},
  {name: "develop", order: 3, cards: []},
  {name: "test", order: 4, cards: []},
  {name: "deploy", order: 5, cards: []},
  {name: "done", order: 6, cards: []}
]

var initialCards = [
  {number: 1, design: 6, develop: 7, test: 8, deploy: 2, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 2, design: 0, develop: 8, test: 6, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 3, design: 10, develop: 9, test: 9, deploy: 3, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 4, design: 4, develop: 9, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 5, design: 4, develop: 10, test: 5, deploy: 2, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 6, design: 1, develop: 8, test: 2, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 7, design: 1, develop: 10, test: 3, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 8, design: 0, develop: 4, test: 3, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 9, design: 10, develop: 4, test: 10, deploy: 6, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 10, design: 1, develop: 7, test: 10, deploy: 8, urgent: true, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 11, design: 8, develop: 10, test: 10, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 12, design: 3, develop: 8, test: 11, deploy: 3, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 13, design: 0, develop: 6, test: 9, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 14, design: 1, develop: 6, test: 3, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 15, design: 10, develop: 1, test: 5, deploy: 2, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 16, design: 2, develop: 5, test: 1, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 17, design: 3, develop: 6, test: 8, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 18, design: 0, develop: 7, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 19, design: 5, develop: 9, test: 4, deploy: 7, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 20, design: 8, develop: 8, test: 3, deploy: 7, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 21, design: 1, develop: 6, test: 5, deploy: 1, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 22, design: 0, develop: 10, test: 7, deploy: 7, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 23, design: 5, develop: 10, test: 11, deploy: 8, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 24, design: 0, develop: 6, test: 4, deploy: 6, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
  {number: 25, design: 3, develop: 2, test: 2, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}}
]

function createNewGame(data) {

  var game = data
  game.roles = initialRoles
  game.pairing = []
  game.teams = initialTeams
  game.columns = initialColumns
  game.workCards = initialCards
  game.gameName = data.gameName
  game.daysEffort = []
  game.currentDay = 1
  game.currentEventCard = 0
  game.currentWorkCard = 0
  game.percentageBlocked = 0.05
  game.percentageDeployFail = 0.5
  game.created = new Date().toISOString()

  return game
}

function _loadGame(err, client, db, io, data, debugOn) {

  db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
    if (err) throw err;
    if (res) {
      if (debugOn) { console.log("Loading game '" + data.gameName + "', team '" + data.teamName + "'") }
      io.emit("loadGame", res)
      client.close();
    } else {
      var i, games = [], gameTeams = [], game = createNewGame(data)
      for (i = 0; i < initialTeams.length; i++) {
        game.teamName = initialTeams[i].name
        gameTeams.push(game.teamName)
        games.push(JSON.parse(JSON.stringify(game)))
      }
      if (debugOn) { console.log("Created new game '" + data.gameName + "', teams '" + gameTeams.join(', ') + "'") }
      db.collection('noEstimates').insertMany(games, function(err, res) {
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

  db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
    if (err) throw err;
    if (res) {
      var i, j, roles = res.roles
      for (i = 0; i < roles.length; i++) {
        var names = []
        for (j = 0; j < roles[i].names.length; j++) {
          if (roles[i].names[j].id != data.name.id) {
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
      db.collection('noEstimates').updateOne({"_id": res._id}, {$set: {roles: roles}}, function(err, res) {
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
  for (var i = 0; i < workCards.length; i++) {
    if (workCards[i].number == card.number) {
      workCards[i].delivery = card.delivery
      workCards[i].value = card.value
    }
  }
}

function blockOrFailCard(card, colName, percentageBlocked, percentageDeployFail) {
  var rand = Math.random()
  if (colName != 'deploy' && rand < percentageBlocked) {
    card.blocked = true
  }
  if (colName == 'deploy' && card.deploy == card.effort['deploy'] && rand < percentageDeployFail) {
    card.failed = true
  }
}

function cardCompleteInColumn(card, colName, percentageBlocked, percentageDeployFail) {
  blockOrFailCard(card, colName, percentageBlocked, percentageDeployFail)
  var dependentDone = true
  if (colName == 'deploy') {
    dependentDone == card.teamDependency == 0 || card.teamDependency == card.dependencyDone
  }
  return !card.blocked && !card.failed && card[colName] == card.effort[colName] && dependentDone
}

function moveCard(columns, workCards, card, n, currentDay) {
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
    card.delivery = currentDay
    card.time = card.delivery - card.commit
    cardValue(workCards, card)
  }
  toCol.cards.push(card)
}

function addSecondarySkill(roles, column, name) {
  var role = column.charAt(0).toUpperCase() + column.slice(1) + 'er'
  for (var i = 0; i < roles.length; i++) {
    if (roles[i].role == role) {
      var roleExists = false
      for (j = 0; j < roles[i].otherNames.length; j++) {
        if (roles[i].otherNames[j].id == name.id) {
          roleExists = true
        }
      }
      if (!roleExists) {
        roles[i].otherNames.push(name)
      }
    }
  }
  return roles
}

function updateTodayPerson(person, card) {
  var i, cards = []
  for (i = 0; i < person.cards.length; i++) {
    if (person.cards[i] != card.number) {
      cards.push(person.cards[i])
    }
  }
  cards.push(card.number)
  person.cards = cards
  return person
}

function updateTodayColumn(column, card, name) {
  var i,
      person = {name: name, cards: []},
      people = []
  for (i = 0; i < column.names.length; i++) {
    if (column.names[i].name.id != name.id) {
      people.push(column.names[i])
    } else {
      person = column.names[i]
    }
  }
  people.push(updateTodayPerson(person, card))
  column.names = people
  return column
}

function updateToday(today, column, card, name) {
  var i, j,
      column = {column: column.name, names: []},
      columns = []
  for (i = 0; i < today.columns.length; i++) {
    if (today.columns[i].column == column.column) {
      column = today.columns[i]
    } else {
      columns.push(today.columns[i])
    }
  }
  columns.push(updateTodayColumn(column, card, name))
  today.columns = columns
  return today
}

function updateTodaysEffort(res, column, card, name) {
  var todaysEffort = [], day = res.currentDay, found = false, today = {day: day, columns: []}
  for (var i = 0; i < res.daysEffort.length; i++) {
    if (res.daysEffort[i].day != day) {
      todaysEffort.push(res.daysEffort[i])
    } else {
      today = res.daysEffort[i]
    }
  }
  todaysEffort.push(updateToday(today, column, card, name))
  return todaysEffort
}

function addExtraPointForPairing(day, columns, daysEffort) {
  var i, j, todaysEffort
  for (i = 0; i < daysEffort.length; i++) {
    if (day == daysEffort[i].day) {
      todaysEffort = daysEffort[i]
    }
  }
  if (todaysEffort) {
    for (i = 0; i < columns.length; i++) {
      for (j = 0; j < todaysEffort.columns; j++) {
        if (columns[i].name == todaysEffort.columns[j].name) {
          console.log(columns[i], todaysEffort.columns[j])
        }
      }
    }
  }
  return columns
}

module.exports = {

  updateRole: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateRole', data) }

    _updateRole(err, client, db, io, data)
  },

  changeName: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('changeName', data) }

    db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err;
      if (res.length) {
        for (var r = 0; r < res.length; r++) {
          if (typeof(res[r]) != "undefined") {
            for (var i = 0; i < res[r].roles.length; i++) {
              var names = []
              for (var j = 0; j < res[r].roles[i].names.length; j++) {
                var name = res[r].roles[i].names[j]
                if (name.id == data.name.id) {
                  name.name = data.newName
                }
                names.push(name)
              }
              res[r].roles[i].names = names
            }
            data.roles = res[r].roles
            data.teamName = res[r].teamName
            io.emit("updateRoles", data)
            db.collection('noEstimates').updateOne({"_id": res[r]._id}, {$set: {roles: data.roles}}, function(err, rec) {
              if (err) throw err;
            })
          }
        }
      }
    })
  },

  percentageBlocked: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('percentageBlocked', data) }

    db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err;
      if (res.length) {
        for (var r = 0; r < res.length; r++) {
          if (typeof(res[r]) != "undefined") {
            db.collection('noEstimates').updateOne({"_id": res[r]._id}, {$set: {percentageBlocked: data.percentageBlocked}}, function(err, rec) {
              if (err) throw err;
              data.teamName = rec.teamName
              io.emit("percentageBlocked", data)
            })
         }
       }
     }
    })
  },

  percentageDeployFail: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('percentageDeployFail', data) }

    db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err;
      if (res.length) {
        for (var r = 0; r < res.length; r++) {
          if (typeof(res[r]) != "undefined") {
            db.collection('noEstimates').updateOne({"_id": res[r]._id}, {$set: {percentageDeployFail: data.percentageDeployFail}}, function(err, rec) {
              if (err) throw err;
              data.teamName = rec.teamName
              io.emit("percentageDeployFail", data)
            })
          }
        }
      }
    })
  },

  loadGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('loadGame', data) }

    _loadGame(err, client, db, io, data, debugOn)
  },

  restartGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('restartGame', data) }

    db.collection('noEstimates').deleteMany({gameName: data.gameName}, function(err, res) {
      _loadGame(err, client, db, io, data, debugOn)
      io.emit("restartGame", data)
    })
  },

  updateCurrentDay: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateCurrentDay', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var teams = res.teams, columns = res.columns, workCards = res.workCards, currentDay = res.currentDay + 1
        for (var i = 0; i < teams.length; i++) {
          if (teams[i].name == data.teamName) {
            if (data.autoDeploy) {
              teams[i].autoDeploy.doing = true
            }
            if (data.canStartAutoDeploy) {
              teams[i].canStartAutoDeploy = true
            }
            if (data.concurrentDevAndTest) {
              teams[i].concurrentDevAndTest = true
            }
            if (data.extraEffortForPairing || true) {
              columns = addExtraPointForPairing(res.currentDay, columns, res.daysEffort)
            }
          }
        }
        for (var i = 1; i < columns.length; i++) {
          for (var j = 0; j < columns[i].cards.length; j++) {
            var card = columns[i].cards[j]
            var colName = columns[i].name
            if (card.blocked || card.failed) {
              card.blocked = false
              card.failed = false
              if (cardCompleteInColumn(card, colName, res.percentageBlocked, res.percentageDeployFail)) {
                moveCard(columns, workCards, card, i, res.currentDay)
              }
            }
          }
        }
        data.teams = teams
        data.columns = columns
        data.workCards = workCards
        db.collection('noEstimates').updateOne({"_id": res._id}, {$set: {currentDay: currentDay, teams: teams, columns: columns, workCards: workCards}}, function(err, res) {
          io.emit("updateCurrentDay", data)
          io.emit("updateTeams", data)
          io.emit("updateColumns", data)
          io.emit("updateWorkCards", data)
          client.close()
        })
      }
    })
  },

  updateCurrentWorkCard: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateCurrentWorkCard', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        db.collection('noEstimates').updateOne({"_id": res._id}, {$set: {currentWorkCard: data.currentWorkCard}}, function(err, res) {
          if (err) throw err;
          io.emit("updateCurrentWorkCard", data)
          client.close();
        })
      }
    })
  },

  updateCurrentEventCard: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateCurrentEventCard', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        db.collection('noEstimates').updateOne({"_id": res._id}, {$set: {currentEventCard: data.currentEventCard}}, function(err, res) {
          if (err) throw err;
          io.emit("updateCurrentEventCard", data)
          client.close();
        })
      }
    })
  },

  updateCommit: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateCommit', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var workCards = res.workCards
        workCards[data.workCard].commit = data.commit
        db.collection('noEstimates').updateOne({"_id": res._id}, {$set: {workCards: workCards}}, function(err, res) {
          if (err) throw err;
          data.workCards = workCards
          io.emit("updateCommit", data)
          client.close();
        })
      }
    })
  },

  updateColumns: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateColumns', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var columns = data.columns, workCards = res.workCards
        for (var i = 1; i < columns.length; i++) {
          for (var j = 0; j < columns[i].cards.length; j++) {
            var card = columns[i].cards[j]
            var colName = columns[i].name
            if (cardCompleteInColumn(card, colName, res.percentageBlocked, res.percentageDeployFail)) {
              moveCard(columns, workCards, card, i, res.currentDay)
            }
          }
        }
        data.columns = columns
        data.workCards = workCards
        db.collection('noEstimates').updateOne({"_id": res._id}, {$set: {columns: columns, workCards: workCards}}, function(err, res) {
          if (err) throw err;
          io.emit("updateColumns", data)
          io.emit("updateWorkCards", data)
          client.close();
        })
      }
    })
  },

  updateDependentTeam: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateDependentTeam', data) }

    db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err;
      if (res.length) {
        var workCardTeam = data.teamName
        for (var r = 0; r < res.length; r++) {
          var i, j, columns = res[r].columns
          for (i = 1; i < columns.length; i++) {
            for (j = 0; j < columns[i].cards.length; j++) {
              var card = columns[i].cards[j]
              if (card.number == data.workCard.number) {
                card.dependentOn = data.dependentOn
              }
            }
          }
          var teams = res[r].teams
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
              data.workCard.team = workCardTeam
              teams[i].otherCards.push(data.workCard)
            }
          }
          data.teamName = res[r].teamName
          data.teams = teams
          data.columns = columns
          io.emit("updateTeams", data)
          io.emit("updateColumns", data)
          db.collection('noEstimates').updateOne({"_id": res[r]._id}, {$set: {teams: teams, columns: columns}}, function(err, res) {
            if (err) throw err;
          })
        }
      }
    })
  },

  updateEffort: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateEffort', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var columns = res.columns, workCards = res.workCards, todaysEffort
        for (var i = 1; i < columns.length; i++) {
          for (var j = 0; j < columns[i].cards.length; j++) {
            if (columns[i].cards[j].number == data.workCard.number) {
              todaysEffort = updateTodaysEffort(res, columns[i], data.workCard, data.name)
              var card = columns[i].cards[j]
              var colName = columns[i].name
              card.effort = data.workCard.effort
              if (cardCompleteInColumn(card, colName, res.percentageBlocked, res.percentageDeployFail)) {
                moveCard(columns, workCards, card, i, res.currentDay)
              }
            }
          }
        }
        data.columns = columns
        data.workCards = workCards
        db.collection('noEstimates').updateOne({"_id": res._id}, {$set: {columns: columns, workCards: workCards, daysEffort: todaysEffort}}, function(err, res) {
          io.emit("updateColumns", data)
          io.emit("updateWorkCards", data)
          client.close()
        })
      }
    })
  },

  pairingDay: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('pairingDay', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var i, pairing = [], player, roles = res.roles
        for (i = 0; i < res.pairing.length; i++) {
          if (res.pairing[i].name.id == data.name.id) {
            player = res.pairing[i]
          } else {
            pairing.push(res.pairing[i])
          }
        }
        if (!player) {
          player = {name: data.name, columns: [{column: data.column, days: [data.day]}]}
        } else {
          var column
          for (i = 0; i < player.columns.length; i++) {
            if (player.columns[i].column == data.column) {
              column = player.columns[i]
            }
          }
          if (!column) {
            player.columns.push({column: data.column, days: [data.day]})
          } else {
            var dayDone = false
            for (i = 0; i < column.days.length; i++) {
              if (column.days[i] == data.day) {
                dayDone = true
              }
            }
            if (!dayDone) {
              column.days.push(data.day)
            }
            if (column.days.length >= 5) {
              roles = addSecondarySkill(roles, column.column, data.name)
            }
            var columns = []
            for (i = 0; i < player.columns.length; i++) {
              if (player.columns[i].column == data.column) {
                columns.push(column)
              } else {
                columns.push(player.columns[i])
              }
            }
            player.columns = columns
          }
        }
        pairing.push(player)
        data.pairing = pairing
        data.roles = roles
        io.emit("updatePairing", data)
        io.emit("updateRoles", data)
        db.collection('noEstimates').updateOne({"_id": res._id}, {$set: {pairing: pairing, roles: roles}}, function(err, res) {
          if (err) throw err;
        })
      }
    })
  },

  addEffortToOthersCard: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addEffortToOthersCard', data) }

    db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err;
      if (res.length) {
        team = res[0]
        var i, j, columns = team.columns, teams = team.teams, workCards = team.workCards
        for (i = 1; i < columns.length; i++) {
          for (j = 0; j < columns[i].cards.length; j++) {
            if (columns[i].cards[j].number == data.card.number) {
              var card = columns[i].cards[j]
              var colName = columns[i].name
              card.dependencyDone = card.dependencyDone + 1
              if (cardCompleteInColumn(card, colName, res.percentageBlocked, res.percentageDeployFail)) {
                moveCard(columns, workCards, card, i, team.currentDay)
              }
            }
          }
        }
        for (i = 0; i < teams.length; i++) {
          for (j = 0; j < teams[i].otherCards.length; j++) {
            if (teams[i].otherCards[j].number ==  data.card.number) {
              teams[i].otherCards[j].dependencyDone = teams[i].otherCards[j].dependencyDone + 1
            }
          }
        }
        for (var r = 0; r < res.length; r++) {
          if (typeof(res[r]) != "undefined") {
            data.teamName = res[r].teamName
            data.teams = teams
            data.columns = columns
            data.workCards = workCards
            io.emit("updateTeams", data)
            io.emit("updateColumns", data)
            io.emit("updateWorkCards", data)
            db.collection('noEstimates').updateOne({"_id": res[r]._id}, {$set: {teams: teams, columns: columns, workCards: workCards}}, function(err, res) {
              if (err) throw err;
            })
          }
        }
      }
    })
  },

  startAutoDeploy: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('startAutoDeploy', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var teams = res.teams
        for (var i = 0; i < teams.length; i++) {
          if (teams[i].name == data.teamName) {
            teams[i].autoDeploy.doing = true
          }
        }
        data.teams = teams
        db.collection('noEstimates').updateOne({"_id": res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err;
          io.emit("updateTeams", data)
          client.close();
        })
      }
    })
  },

  incrementAutoDeploy: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('incrementAutoDeploy', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var teams = res.teams
        for (var i = 0; i < teams.length; i++) {
          if (teams[i].name == data.teamName) {
            teams[i].autoDeploy.effort = teams[i].autoDeploy.effort + 1
            if (teams[i].autoDeploy.effort == 8) {
              teams[i].autoDeploy.doing = false
              teams[i].autoDeploy.done = true
            }
          }
        }
        data.teams = teams
        db.collection('noEstimates').updateOne({"_id": res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err;
          io.emit("updateTeams", data)
          client.close();
        })
      }
    })
  },

  updateProjectEstimate: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateProjectEstimate', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        db.collection('noEstimates').updateOne({"_id": res._id}, {$set: {projectEstimate: data.projectEstimate}}, function(err, res) {
          if (err) throw err;
          io.emit("updateProjectEstimate", data)
          client.close();
        })
      }
    })
  },

  updateMVPEstimate: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateMVPEstimate', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        db.collection('noEstimates').updateOne({"_id": res._id}, {$set: {mvpEstimate: data.mvpEstimate}}, function(err, res) {
          if (err) throw err;
          io.emit("updateMVPEstimate", data)
          client.close();
        })
      }
    })
  },

  updateReEstimate: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateReEstimate', data) }

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        db.collection('noEstimates').updateOne({"_id": res._id}, {$set: {reEstimate: data.reEstimate}}, function(err, res) {
          if (err) throw err;
          io.emit("updateReEstimate", data)
          client.close();
        })
      }
    })
  }

}
