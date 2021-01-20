
const run = require('./run/funs.js')
const dbStore = require('./dbStore.js')
const teamFuns = require('./lib/teams.js')

function doDependencies(workCards) {
  console.log('  Doing dependencies')
  const cards = []
  for (let i = 0; i < workCards.length; i++) {
    const card = workCards[i]
    if (card.teamDependency) {
     card.dependencyDone = card.teamDependency
    }
    cards.push(card)
  }
  return cards
}

function addEffortToCard(db, io, game, member) {
  let added = false
  for (let i = game.columns.length - 1; i >= 0; i--) {
    const column = game.columns[i]
    for (let j = 0; j < column.cards.length; j++) {
      card = column.cards[j]
      if (!added && run.cardIsPlayable(card) && run.memberHasEffort(member)) {
        console.log('      ' + member.name + ' adding to #' + card.number)
        card.effort[column.name] = card.effort[column.name] + 1
        const data = {
          gameName: game.gameName,
          teamName: game.teamName,
          name: member,
          role: member.role,
          workCard: card,
          column: column.name,
          effort: 1,
          percentageBlocked: game.config.percentageBlocked,
          percentageDeployFail: game.config.percentageDeployFail
        }
        added = true
        dbStore.updateEffort(db, io, data, false)
      }
    }
  }
}

function addEffort(db, io, game) {
  let added = false
  for (let i = 0; i < game.members.length; i++) {
    const member = game.members[i]
    if (!added && run.memberHasEffort(member)) {
      addEffortToCard(db, io, game, member)
      added = true
    }
  }
}

function makeMove(db, io, game, teams) {
  const data = {gameName: game.gameName, teamName: game.teamName, teams: teams, currrentDay: game.currentDay}
  if (!run.aCardIsPlayable(game)) {
    console.log('  Pulling in card')
    dbStore.pullInCard(db, io, data, false)
  } else if (!run.effortCanBeAssigned(game)) {
    console.log('  Incrementing day')
    dbStore.updateCurrentDay(db, io, data, false)
  } else {
    console.log('  Adding Effort')
    addEffort(db, io, game)
  }
}

function updateTeam(db, io, res) {
  console.log('updateTeam')
  const id = res._id
  delete res._id
  db.collection('noEstimates').updateOne({'_id': id}, {$set: res}, function(err) {
    if (err) throw err
    io.emit('loadTeam', res)
  })
}

module.exports = {

  setUp: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setUp', data) }

    const names = [
      {name: 'Allan', id: '1111'},
      {name: 'Dolly', id: '2222'},
      {name: 'Herbert', id: '3333'},
      {name: 'Mary', id: '4444'}
    ]
    const roles = [
      'Designer',
      'Developer',
      'Tester',
      'Deployer'
    ]

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        let members = []
        for (let i = 0; i < 4; i++) {
          members = teamFuns.addMember(members, names[i], roles[i])
        }
        res.members = members
        res.workCards = doDependencies(res.workCards)
        updateTeam(db, io, res)
      }
    })
  },

  runTo: function(db, io, data, debugOn) {

    db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        makeMove(db, io, res, data.teams)
      }
    })
  }

}
