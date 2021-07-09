
const run = require('./run/funs.js')
const dbStore = require('./dbStore.js')
const teamFuns = require('./lib/teams.js')

function playThisCard(card, member, cardToPlay) {
  const playCard = cardToPlay ? card.number == cardToPlay.number : true
  return playCard && run.cardIsPlayable(card) && run.memberHasEffort(member)
}

function addEffortToCard(db, io, game, member, cardToPlay) {
  let added = false
  for (let i = game.columns.length - 1; i >= 0; i--) {
    const column = game.columns[i]
    for (let j = 0; j < column.cards.length; j++) {
      const card = column.cards[j]
      if (!added && playThisCard(card, member, cardToPlay)) {
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

function addEffort(db, io, game, card) {
  let added = false
  for (let i = 0; i < game.members.length; i++) {
    const member = game.members[i]
    if (!added && run.memberHasEffort(member)) {
      addEffortToCard(db, io, game, member, card)
      added = true
    }
  }
}

function makeAMove(db, io, config, data, n) {
  data.teamName = data.teams[n].name
  //db.collection('noEstimates').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, game) {
  db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, game) {
    if (err) throw err
    const urgentCard = run.urgent(game)
    const dependentCard = run.dependency(game)
    if (urgentCard && run.effortCanBeAssigned(game)) {
      console.log('  Adding Effort to Urgent card')
      addEffort(db, io, game, urgentCard)
    } else if (dependentCard && parseInt(Math.random() * 4)) {
      console.log('  Doing a dependency, card ', dependentCard.number)
      dependentCard.team = game.teamName
      const otherData = {
        gameName: game.gameName,
        teamName: dependentCard.dependentOn.name,
        card: dependentCard,
        myName: game.members[0],
        effort: 1
      }
      dbStore.addEffortToOthersCard(db, io, otherData, false)
    } else if (run.noCardsLeft(game)) {
      console.log('  All cards played')
    } else if (!run.aCardIsPlayable(game) && game.currentWorkCard < 25) {
      console.log('  Pulling in card')
      dbStore.pullInCard(db, io, data, true)
    } else if (!run.effortCanBeAssigned(game)) {
      console.log('  Incrementing day')
      dbStore.updateCurrentDay(db, io, data, false)
    } else {
      console.log('  Adding Effort')
      addEffort(db, io, game)
    }

    if (!run.complete(game, config) && global.running[data.gameName]) {
      n = n < data.teams.length - 1 ? n + 1 : 0
      setTimeout(function() {
        makeAMove(db, io, config, data, n)
      }, 100)
    }
  })
}

function _setUpTeam(db, io, data, debugOn) {

  const names = [
    {name: 'Allan', id: '1111', captain: true},
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

  if (debugOn) { console.log('  setting up', data.teamName) }

  db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, teamRes) {
    if (err) throw err
    if (teamRes) {
      let members = []
      for (let j = 0; j < names.length; j++) {
        members = teamFuns.addMember(members, names[j], roles[j])
      }
      teamRes.members = members
      updateTeam(db, io, teamRes)
    }
  })
}

function updateTeam(db, io, res) {
  const id = res._id
  delete res._id
  db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err) {
    if (err) throw err
    io.emit('loadTeam', res)
  })
}

global.running = {}

module.exports = {

  setUp: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setUp', data) }

    db.gamesCollection.find({gameName: data.gameName}).toArray(function(err, teams) {
      if (err) throw err
      if (teams.length) {
        for (let i = 0; i < teams.length; i++) {
          const teamData = {
            gameName: data.gameName,
            teamName: teams[i].teamName,
            include: teams[i].include
          }
          _setUpTeam(db, io, teamData, debugOn)
        }
      }
    })
  },

  setUpTeam: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setUpTeam', data) }

    _setUpTeam(db, io, data, debugOn)
    /*
    const names = [
      {name: 'Allan', id: '1111', captain: true},
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

    db.gameCollection.insertOne({gameName: data.gameName, teamName: res.teams[i].name}, function(err, ) {
      if (err) throw err
      if (res.teams[i].include) {
        if (debugOn) { console.log('  setting up', res.teams[i].name) }
        db.gameCollection.findOne({gameName: data.gameName, teamName: res.teams[i].name}, function(err, teamRes) {
          if (err) throw err
          if (teamRes) {
            let members = []
            for (let j = 0; j < names.length; j++) {
              members = teamFuns.addMember(members, names[j], roles[j])
            }
            teamRes.members = members
            updateTeam(db, io, teamRes)
          }
        })
      }
    })
    */
  },

  startDemoRunning: function(db, io, data, debugOn) {

    if (debugOn) { console.log('startDemoRunning', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        global.running[data.gameName] = true
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          if (res.teams[i].include) {
            teams.push(res.teams[i])
          }
        }
        data.teams = teams
        makeAMove(db, io, res.demoConfig, data, 0)
      }
    })
  },

  stopDemoRunning: function(db, io, data, debugOn) {

    if (debugOn) { console.log('startDemoRunning', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        delete global.running[data.gameName]
      }
    })
  }

}
