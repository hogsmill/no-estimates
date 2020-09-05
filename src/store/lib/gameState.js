
function cardEffort(card) {
  return {
    effort: card.design + card.develop + card.test + card.deploy,
    done: card.effort.design + card.effort.develop + card.effort.test + card.effort.deploy
  }
}

function teamDetails(team, teams) {
  return teams.find(function(t) { return team == t.name})
}

function columnDetails(res) {
  var cols = {}
  for (var i = 1; i < res.columns.length; i++) {
    cols[res.columns[i].name] = []
    for (var j = 0; j < res.columns[i].cards.length; j++) {
      var card = res.columns[i].cards[j]
      var dependentOn = false
      if (card.dependentOn) {
        dependentOn = {
          team: card.dependentOn.name,
          effort: card.teamDependency,
          done: card.dependencyDone
        }
      }
      cols[res.columns[i].name].push({
        number: card.number,
        blocked: card.blocked,
        commit: card.commit,
        delivered: card.delivered,
        effort: cardEffort(card),
        urgent: card.urgent,
        dependentOn: dependentOn
      })
    }
  }
  return cols
}

function memberDetails(res) {
  var members = []
  for (var i = 0; i < res.roles.length; i++) {
    for (var j = 0; j < res.roles[i].names.length; j++) {
      members.push({
        name: res.roles[i].names[j],
        role: res.roles[i].role
      })
    }
  }
  return members
}

function teamState(res) {
  var team = teamDetails(res.teamName, res.teams)
  var columns = columnDetails(res)
  var members = memberDetails(res)
  return {
    name: res.teamName,
    include: team.include,
    currentDay: res.currentDay,
    currentWorkCard: res.currentWorkCard,
    otherCards: team.otherCards,
    autoDeploy: team.autoDeploy,
    members: members,
    columns: columns,
    projectEstimate: res.projectEstimate,
    mvpEstimate: res.mvpEstimate,
    reEstimate: res.reEstimate
  }
}

module.exports = {

  update: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateGameState', data) }

    db.collection('noEstimates').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        var teams = []
        for (var r = 0; r < res.length; r++) {
          teams.push(teamState(res[r]))
        }
        data.gameState = teams
        io.emit('updateGameState', data)
      }
    })
  }
}
