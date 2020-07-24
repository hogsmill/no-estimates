
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

module.exports = {

  loadGame: function(err, client, db, io, data) {

    db.collection('games').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err;
      if (res) {
        console.log('Game ' + data.gameName + ' exists');
        io.emit("loadGame", res)
        client.close();
      } else {
        var game = createNewGame(data)
        console.log('Game ' + data.gameName + ' created');
        db.collection('games').insertOne(game, function(err, res) {
          if (err) throw err;
          io.emit("loadGame", game)
          updateRoles(err, client, db, io, data)
          client.close();
        })
      }
    })
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

  updateRole: function(err, client, db, io, data) {

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
          client.close();
        })
      }
    })
  }
}
