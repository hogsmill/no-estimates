
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
  const cols = {}
  for (let i = 1; i < res.columns.length; i++) {
    cols[res.columns[i].name] = []
    for (let j = 0; j < res.columns[i].cards.length; j++) {
      const card = res.columns[i].cards[j]
      let dependentOn = false
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

function addRole(member, roles) {
  for (let i = 0; i < roles.length; i++) {
    for (let j = 0; j < roles[i].names.length; j++) {
      if (member.id == roles[i].names[j].id) {
        member.role = roles[i].role
        member.effort = roles[i].names[j].effort
      }
    }
  }
  return member
}

function memberDetails(res) {
  const members = []
  const team = res.teams.find(function(t) {
    return t.name == res.teamName
  })
  for (let i = 0; i < team.members.length; i++) {
    const member = addRole(team.members[i], res.roles)
    members.push(member)
  }
  return members
}

function teamState(res) {
  const team = teamDetails(res.teamName, res.teams)
  const columns = columnDetails(res)
  const members = memberDetails(res)
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
        const teams = []
        for (let r = 0; r < res.length; r++) {
          teams.push(teamState(res[r]))
        }
        data.gameState = teams
        io.emit('updateGameState', data)
      }
    })
  }
}
