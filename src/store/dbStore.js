
const utils = require('./lib/utils.js')
const teamFuns = require('./lib/teams.js')
const columnFuns = require('./lib/columns.js')
const cardFuns = require('./lib/cards.js')
const currencyFuns = require('./lib/currency.js')
const pairingFuns = require('./lib/pairing.js')
const dependent = require('./lib/dependent.js')
const chat = require('./lib/chat.js')
const gameState = require('./lib/gameState.js')
const sourceFuns = require('./lib/sources.js')
const runGame = require('./runGame.js')
const dbUpdate = require('./db/dbUpdate.js')

function resetGame(game) {
  game.columns = JSON.parse(JSON.stringify(columnFuns.initialColumns()))
  game.workCards = JSON.parse(JSON.stringify(cardFuns.initialCards()))
  game.otherCards = []
  game.pairing = []
  game.daysEffort = []
  game.autoDeploy = {
    doing: false,
    effort: 0,
    done: false
  }
  game.canStartAutoDeploy = false
  game.concurrentDevAndTest = false
  game.currentDay = 1
  game.currentWorkCard = 0
  game.retrosDone = {}
  game.messages = {}
  game.wip = []
  game.cumulative = []
  game.mvpEstimate = null
  game.mvpActual = null
  game.projectEstimate = null
  game.projectActual = null
  game.reEstimate = null
  const members = []
  for (let i = 0; i < game.members.length; i++) {
    const member = game.members[i]
    member.effort = teamFuns.initialEffort()
    member.otherRoles = []
    members.push(member)
  }
  game.members = members

  return game
}

function newGame(data) {
  const game = {
    appType: data.appType,
    gameName: data.gameName,
    include: false,
    teams: JSON.parse(JSON.stringify(teamFuns.initialTeams())),
    facilitatorMessages: [],
    currencies: currencyFuns.currencies(),
    config: {
      facilitatorStarts: false,
      allowMobile: false,
      gameRunning: false,
      doRetros: false,
      retroDays: 7,
      retroTimer: false,
      retroTime: 0,
      mvpCards: 11,
      percentageBlocked: 0.05,
      percentageDeployFail: 0.5
    },
    graphConfig: {
      wip: {
        useMovingAverage: true,
        useDays: true
      },
      cumulativeFlow: {
        useDays: true
      },
      cycleTime: {
        medium: 15,
        large: 20
      },
      monteCarlo: {
        runs: 1000,
        runTo: '50',
      }
    },
    demoConfig: {
      runTo: 'MVP',
      runToCards: 11,
      running: false
    },
    stealth: false,
    created: new Date().toISOString(),
    restarted: [],
    lastaccess: new Date().toISOString()
  }

  switch(game.appType) {
    case 'No Estimates':
      game.config.autoMoveCompleteCards = true
      game.config.deliveryType = 'revenue'
      break
    case 'Kanban Playground':
      game.config.autoMoveCompleteCards = false
      game.config.deliveryType = 'revenue'
      game.config.splitColumns = false
      game.config.expediteLane = false
      game.config.wipLimits = false
      game.config.wipLimitType = 'soft'
      game.config.wipLimit = 3
      game.config.backlogGenerated = false
      game.config.backlogEffort = false
      game.config.backlogEffortPoints = 1
      break
  }

  return game
}

function newTeam(gameName, teamName, config) {
  const team = {
    gameName: gameName,
    teamName: teamName,
    members: [],
    columns: JSON.parse(JSON.stringify(columnFuns.initialColumns())),
    workCards: JSON.parse(JSON.stringify(cardFuns.initialCards())),
    pairing: [],
    recharting: false,
    otherCards: [],
    config: config,
    retrosDone: {},
    concurrentDevAndTest: false,
    canStartAutoDeploy: false,
    daysEffort: [],
    cardsWorkedOn: [],
    currentDay: 1,
    currentWorkCard: 0,
    messages: {},
    mvpEstimate: null,
    mvpActual: null,
    projectEstimate: null,
    projectActual: null,
    reEstimate: null,
    autoDeploy: {
      doing: false,
      effort: 0,
      done: false
    }
  }
  return team
}

function _getGames(db, io, data, debugOn) {

  if (debugOn) { console.log('getGames') }

  db.gamesCollection.find().toArray(function(err, res) {
    if (err) throw err
    if (res.length) {
      delete res._id
      io.emit('updateGames', res)
    }
  })
}

function _addGame(db, io, data, debugOn) {

  if (debugOn) { console.log('addGame', data) }

  db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
    if (err) throw err
    if (res) {
      data.error = 'Game "' + data.gameName + '" exists'
      io.emit('addGameError', data)
    } else {
      const game = newGame(data)
      game.sourcesOfVariation = sourceFuns.sources()
      db.gamesCollection.insertOne(game, function(err) {
        if (err) throw err
        io.emit('loadGame', game)
        gameState.update(db, io, data)
      })
      const initialTeams = teamFuns.initialTeams()
      for (let i = 0; i < initialTeams.length; i++) {
        const teamName = initialTeams[i].name
        const team = newTeam(data.gameName, teamName, game.config)
        if (!data.demo) {
          if (teamName == data.teamName) {
            team.members = teamFuns.addMember(team.members, data.myName, data.myRole)
          }
        }
        db.gameCollection.insertOne(team, function(err) {
          if (err) throw err
          if (data.demo) {
            const include = initialTeams.find((t) => {
              return t.name == team.teamName
            }).include
            const teamData = {
              gameName: data.gameName,
              teamName: team.teamName,
              include: include
            }
            team.members = runGame.setUpTeam(db, io, teamData, debugOn)
          }
          io.emit('loadTeam', team)
          gameState.update(db, io, data)
        })
      }
    }
  })
}

function updateTeam(db, io, res) {
  const id = res._id
  delete res._id
  db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err) {
    if (err) throw err
    io.emit('loadTeam', res)
    gameState.update(db, io, res)
  })
}

function updateGame(db, io, res) {
  const id = res._id
  delete res._id
  db.gamesCollection.updateOne({'_id': id}, {$set: res}, function(err) {
    if (err) throw err
    io.emit('loadGame', res)
  })
}

function pairingDay(db, io, data, debugOn) {

  if (debugOn) { console.log('pairingDay', data) }

  db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
    if (err) throw err
    if (res) {
      let i, player
      const pairing = []
      data.day = res.currentDay
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
        let column
        for (i = 0; i < player.columns.length; i++) {
          if (player.columns[i].column == data.column) {
            column = player.columns[i]
          }
        }
        if (!column) {
          player.columns.push({column: data.column, days: [data.day]})
        } else {
          let dayDone = false
          for (i = 0; i < column.days.length; i++) {
            if (column.days[i] == data.day) {
              dayDone = true
            }
          }
          if (!dayDone) {
            column.days.push(data.day)
          }
          if (column.days.length >= 5) {
            res.members = pairingFuns.addSecondarySkill(res.members, column.column, data.name)
          }
          const columns = []
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
      res.pairing = pairing
      updateTeam(db, io, res)
    }
  })
}

module.exports = {

  gameState: function(db, io, data) {
    gameState.update(db, io, data)
  },

  getGames: function(db, io, data, debugOn) {
    _getGames(db, io, data, debugOn)
  },

  addGame: function(db, io, data, debugOn) {
    _addGame(db, io, data, debugOn)
  },

  checkSystemWorkshops: function(db, io, data, debugOn) {

    if (debugOn) { console.log('checkSystemWorkshops', data) }

    const gameName = 'Demo'
    db.gamesCollection.findOne({gameName: gameName}, function(err, res) {
      if (err) throw err
      if (!res) {
        const game = {
          gameName: gameName,
          demo: true,
          appType: data.appType
        }
        _addGame(db, io, game, debugOn)
      }
    })
  },

  loadGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadGame', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res = dbUpdate.game(res)
        res.lastaccess = new Date().toISOString()
        const id = res._id
        delete res._id
        res.sourcesOfVariation = sourceFuns.sources()
        db.gamesCollection.updateOne({'_id': id}, {$set: res}, function(err) {
          if (err) throw err
        })
        console.log('Loading game \'' + data.gameName + '\'')
        io.emit('loadGame', res)
        if (data.oldTeam) {
          db.gameCollection.findOne({gameName: data.gameName, teamName: data.oldTeam}, function(err, resOld) {
            if (err) throw err
            resOld = dbUpdate.team(resOld)
            resOld.members = teamFuns.removeMember(resOld.members, data.myName)
            updateTeam(db, io, resOld)
          })
        }
        db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, gameRes) {
          if (err) throw err
          if (gameRes) {
            gameRes = dbUpdate.team(gameRes)
            gameRes.members = teamFuns.addMember(gameRes.members, data.myName, data.myRole)
            updateTeam(db, io, gameRes)
          }
        })
      } else {
        _addGame(db, io, data, debugOn)
        /*
        console.log('Created new game \'' + data.gameName + '\'')
        const game = newGame(data)
        game.sourcesOfVariation = sourceFuns.sources()
        db.gamesCollection.insertOne(game, function(err) {
          if (err) throw err
          io.emit('loadGame', game)
          gameState.update(db, io, data)
        })
        const initialTeams = teamFuns.initialTeams()
        for (let i = 0; i < initialTeams.length; i++) {
          const teamName = initialTeams[i].name
          const team = newTeam(data.gameName, teamName, game.config)
          if (teamName == data.teamName) {
            team.members = teamFuns.addMember(team.members, data.myName, data.myRole)
          }
          db.gameCollection.insertOne(team, function(err) {
            if (err) throw err
            io.emit('loadTeam', team)
            gameState.update(db, io, data)
          })
        }
        */
      }
    })
  },

  makeCaptain: function(db, io, data, debugOn) {

    if (debugOn) { console.log('makeCaptain', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const members = []
        for (let i = 0; i < res.members.length; i++) {
          const member = res.members[i]
          member.captain = member.id == data.myName.id
          members.push(member)
        }
        res.members = members
        updateTeam(db, io, res)
        io.emit('makeCaptain', data)
      }
    })
  },

  restartGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('restartGame', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const restarted = res.restarted
        restarted.push(new Date().toISOString())
        res.restarted = restarted
        db.gamesCollection.updateOne({'_id': res._id}, {$set: {restarted: restarted}}, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
          db.gameCollection.find({gameName: data.gameName}).toArray(function(err, gameRes) {
            if (err) throw err
            if (gameRes.length) {
              for (let r = 0; r < gameRes.length; r++) {
                gameRes[r] = resetGame(gameRes[r])
                updateTeam(db, io, gameRes[r])
              }
            }
          })
        })
      }
    })
  },

  disableMember: function(db, io, data, debugOn) {

    if (debugOn) { console.log('disableMember', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const members = []
        for (let i = 0; i < res.members.length; i++) {
          const member = res.members[i]
          if (member.id == data.member.id) {
            member.disabled = true
          }
          members.push(member)
        }
        res.members = members
        updateTeam(db, io, res)
      }
    })
  },

  enableMember: function(db, io, data, debugOn) {

    if (debugOn) { console.log('enableMember', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const members = []
        for (let i = 0; i < res.members.length; i++) {
          const member = res.members[i]
          if (member.id == data.member.id) {
            delete member.disabled
          }
          members.push(member)
        }
        res.members = members
        updateTeam(db, io, res)
      }
    })
  },

  deleteMember: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteMember', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const members = []
        for (let i = 0; i < res.members.length; i++) {
          const member = res.members[i]
          if (member.id != data.member.id) {
            members.push(member)
          }
        }
        res.members = members
        updateTeam(db, io, res)
      }
    })
  },

  deleteGameMeta: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteGameMeta', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        db.gamesCollection.deleteOne({'_id': res._id}, function(err, ) {
          if (err) throw err
          _getGames(db, io, data, debugOn)
        })
      }
    })
  },

  deleteGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteGame', data) }

    db.gameCollection.find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let i = 0; i < res.length; i++) {
          db.gameCollection.deleteOne({'_id': res[i]._id}, function(err, ) {
            if (err) throw err
          })
        }
      }
    })
  },

  retroDone: function(db, io, data, debugOn) {

    if (debugOn) { console.log('retroDone', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.retrosDone[data.currentDay] = true
        updateTeam(db, io, res)
      }
    })
  },

  updateCurrentDay: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateCurrentDay', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const day = res.currentDay, currentDay = res.currentDay + 1
        res = teamFuns.updateTeamCapabilities(res, data, res.daysEffort)
        const columns = res.columns, workCards = res.workCards
        for (let i = 0; i < columns.length; i++) {
          for (let j = 0; j < columns[i].cards.length; j++) {
            const card = columns[i].cards[j]
            const colName = columns[i].name
            if (card.blocked || card.failed || (card.dependentOn && colName == 'deploy')) {
              card.blocked = false
              card.failed = false
              if (cardFuns.cardCompleteInColumn(card, colName, res)) {
                cardFuns.moveCard(columns, workCards, card, i, day)
              }
            }
          }
        }
        const actuals = cardFuns.calculateActuals(columns, res.workCards, res.config.mvpCards, day, res.mvpActual, res.projectActual)
        res.currentDay = currentDay
        res.members = teamFuns.setTeamMembersEffort(res.members, data)
        res.columns = columns
        res.workCards = workCards
        res.mvpActual = actuals.mvp
        res.projectActual = actuals.project
        updateTeam(db, io, res)
      }
    })
  },

  pullInCard: function(db, io, data, debugOn) {

    if (debugOn) { console.log('pullInCard', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.currentWorkCard = res.currentWorkCard + 1
        res.columns = cardFuns.pullInCard(res.columns, res.workCards, res.currentWorkCard, res.currentDay, data.teams, data.teamName)
        res = utils.safePush(res, 'wip', cardFuns.wip(res.columns, res.currentDay))
        res = utils.safePush(res, 'cumulative', cardFuns.cumulative(res.columns, res.currentDay))
        updateTeam(db, io, res)
        const card = res.workCards.find(function(c) {
          return c.number == res.currentWorkCard
        })
        if (card.dependentOn) {
          db.gameCollection.findOne({gameName: data.gameName, teamName: card.dependentOn.name}, function(err, depRes) {
            if (err) throw err
            if (depRes) {
              const depCard = depRes.workCards.find(function(c) {
                return c.number == res.currentWorkCard
              })
              depCard.team = data.teamName
              depRes.otherCards.push(depCard)
              updateTeam(db, io, depRes)
            }
          })
        }
      }
    })
  },

  setColumnWip: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setColumnWip', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const columns = []
        for (let i = 0; i < res.columns.length; i++) {
          const column = res.columns[i]
          if (column.name == data.column) {
            column.wipLimit = parseInt(data.wipLimit)
          }
          columns.push(column)
        }
        res.columns = columns
        const id = res._id
        delete res._id
        db.gameCollection.updateOne({'_id': id}, {$set: res}, function() {
          if (err) throw err
          updateTeam(db, io, res)
          gameState.update(db, io, res)
        })
      }
    })
  },

  updateEffort: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateEffort', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, gameRes) {
      if (err) throw err
      if (gameRes) {
        const config = gameRes.config
        db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
          if (err) throw err
          if (res) {
            res.members = teamFuns.decrementMyEffort(res.members, data.name, data.effort)
            const columns = res.columns, workCards = res.workCards, day = res.currentDay
            let todaysEffort = []
            for (let i = 0; i < columns.length; i++) {
              for (let j = 0; j < columns[i].cards.length; j++) {
                if (columns[i].cards[j].number == data.workCard.number) {
                  todaysEffort = pairingFuns.updateTodaysEffort(res, columns[i], data.workCard, data.name)
                  let card = columns[i].cards[j]
                  const colName = columns[i].name
                  card.effort = data.workCard.effort
                  card = cardFuns.addCardWorkedOnInDay(card, res.currentDay)
                  card = cardFuns.addWorkedOn(card, data.column, data.name, data.role)
                  if (config.autoMoveCompleteCards && cardFuns.cardCompleteInColumn(card, colName, res)) {
                    cardFuns.moveCard(columns, workCards, card, i, day)
                  }
                }
              }
            }
            res = utils.safePush(res, 'wip', cardFuns.wip(columns, res.currentDay))
            res = utils.safePush(res, 'cumulative', cardFuns.cumulative(columns, res.currentDay))

            res.daysEffort = todaysEffort
            res.columns = columns
            res.workCards = workCards

            const actuals = cardFuns.calculateActuals(columns, res.workCards, config.mvpCards, day, res.mvpActual, res.projectActual)
            res.mvpActual = actuals.mvp
            res.projectActual = actuals.project

            const id = res._id
            delete res._id
            db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err) {
              if (err) throw err
              if (data.column != data.role.replace(/er$/, '').toLowerCase()) {
                pairingDay(db, io, data, debugOn)
              }
              io.emit('loadTeam', res)
              gameState.update(db, io, res)
            })
          }
        })
      }
    })
  },

  moveCardToNextColumn: function(db, io, data, debugOn) {

    if (debugOn) { console.log('moveCardToNextColumn', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const n = columnFuns.getColumnIndex(res.columns, data.column)
        cardFuns.moveCard(res.columns, res.workCards, data.workCard, n, res.currentDay)
        const id = res._id
        delete res._id
        db.gameCollection.updateOne({'_id': id}, {$set: res}, function() {
          if (err) throw err
          updateTeam(db, io, res)
          gameState.update(db, io, res)
        })
      }
    })
  },

  addEffortToOthersCard: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addEffortToOthersCard', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.card.team}, function(err, otherRes) {
      if (err) throw err
      if (otherRes) {
        otherRes.columns = dependent.addDependentEffort(otherRes.columns, data.card, data.effort, otherRes)
        updateTeam(db, io, otherRes)
      }
    })
    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.otherCards = dependent.addOtherCardEffort(res.otherCards, data.card, data.effort)
        res.members = teamFuns.decrementMyEffort(res.members, data.myName, data.effort)
        updateTeam(db, io, res)
      }
    })
  },

  startAutoDeploy: function(db, io, data, debugOn) {

    if (debugOn) { console.log('startAutoDeploy', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.autoDeploy.doing = true
        updateTeam(db, io, res)
      }
    })
  },

  incrementAutoDeploy: function(db, io, data, debugOn) {

    if (debugOn) { console.log('incrementAutoDeploy', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const autoDeploy = res.autoDeploy
        autoDeploy.effort = autoDeploy.effort + 1
        if (autoDeploy.effort >= 8) {
          autoDeploy.doing = false
          autoDeploy.done = true
          io.emit('autoDeployComplete', data)
        }
        res.autoDeploy = autoDeploy
        res.members = teamFuns.decrementMyEffort(res.members, data.name, data.effort)
        const id = res._id
        delete res._id
        db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err) {
          if (err) throw err
          io.emit('loadTeam', res)
          data.column = 'deploy'
          pairingDay(db, io, data, debugOn)
          gameState.update(db, io, res)
        })
      }
    })
  },

  sendMessage: function(db, io, data, debugOn) {

    if (debugOn) { console.log('sendMessage', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.messages = chat.addMessage(res.messages, data.chattingTo, 'us', data.message)
        updateTeam(db, io, res)
      }
    })
    db.gameCollection.findOne({gameName: data.gameName, teamName: data.chattingTo}, function(err, otherRes) {
      if (err) throw err
      if (otherRes) {
        otherRes.messages = chat.addMessage(otherRes.messages, data.teamName, 'them', data.message)
        updateTeam(db, io, otherRes)
      }
    })
  },

  sendMessageToFacilitators: function(db, io, data, debugOn) {

    if (debugOn) { console.log('sendMessageToFacilitators', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.facilitatorMessages = chat.addFacilitatorMessage(res.facilitatorMessages, data.teamName, 'them', data.message)
        updateGame(db, io, res)
      }
    })
    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.messages = chat.addMessage(res.messages, 'Facilitators', 'us', data.message)
        updateTeam(db, io, res)
      }
    })
  },

  updateMessages: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateMessages', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.messages = data.messages
        updateTeam(db, io, res)
      }
    })
  },

  updateFacilitatorMessages: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateFacilitatorMessages', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.facilitatorMessages = data.messages
        updateGame(db, io, res)
      }
    })
  },

  answerFacilitatorQuestion: function(db, io, data, debugOn) {

    if (debugOn) { console.log('answerFacilitatorQuestion', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const facilitatorMessages = res.facilitatorMessages, messages = []
        for (let i = 0; i < facilitatorMessages.length; i++) {
          const message = facilitatorMessages[i]
          if (message.message == data.message.message) {
            message.reply = data.reply
            message.replySeen = false
          }
          messages.push(message)
        }
        res.facilitatorMessages = facilitatorMessages
        updateGame(db, io, res)
      }
    })
  },

  updateProjectEstimate: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateProjectEstimate', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.projectEstimate = data.projectEstimate
        updateTeam(db, io, res)
      }
    })
  },

  updateMVPEstimate: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateMVPEstimate', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.mvpEstimate = data.mvpEstimate
        updateTeam(db, io, res)
      }
    })
  },

  updateReEstimate: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateReEstimate', data) }

    db.gameCollection.findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.reEstimate = data.reEstimate
        updateTeam(db, io, res)
      }
    })
  },

  updateTeamActive: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateTeamActive', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            team.include = data.include
          }
          teams.push(team)
        }
        res.teams = teams
        const id = res._id
        delete res._id
        db.gamesCollection.updateOne({'_id': id}, {$set: res}, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
          gameState.update(db, io, res)
        })
      }
    })
  },

  playersJoinBy: function(db, io, data, debugOn) {

    if (debugOn) { console.log('playersJoinBy', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const id = res._id
        delete res._id
        res.config.playersJoinBy = data.playersJoinBy
        db.gamesCollection.updateOne({'_id': id}, {$set: res}, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })
    db.gameCollection.find({gameName: data.gameName}).toArray(function(err, teamRes) {
      if (err) throw err
      if (teamRes.length) {
        for (let r = 0; r < teamRes.length; r++) {
          const id = teamRes[r]._id
          delete teamRes[r]._id
          teamRes[r].config.playersJoinBy = data.playersJoinBy
          db.gameCollection.updateOne({'_id': id}, {$set: teamRes[r]}, function(err) {
            if (err) throw err
            io.emit('loadTeam', teamRes[r])
          })
        }
      }
    })
  },

  updateStealth: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateStealth', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.stealth = data.stealth
        db.gamesCollection.updateOne({'_id': res._id}, {$set: {stealth: res.stealth}}, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })
  },

  updateCurrency: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateCurrency', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.currencies = currencyFuns.setCurrency(res.currencies, data.currency)
        db.gamesCollection.updateOne({'_id': res._id}, {$set: {currencies: res.currencies}}, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })
  },

  setGameSpecificParameter: function(db, io, data, appConfig, field, debugOn) {

    if (debugOn) { console.log('setGameSpecificParameter', appConfig, field, data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const config = res.config
        config[appConfig][field] = data[field]
        res.config = config
        updateGame(db, io, res)
      }
    })
  },

  updateConfig: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateConfig', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const id = res._id
        delete res._id
        res.config[data.field] = data.value
        db.gamesCollection.updateOne({'_id': id}, {$set: res}, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })
    db.gameCollection.find({gameName: data.gameName}).toArray(function(err, teamRes) {
      if (err) throw err
      if (teamRes.length) {
        for (let r = 0; r < teamRes.length; r++) {
          const id = teamRes[r]._id
          delete teamRes[r]._id
          teamRes[r].config[data.field] = data.value
          db.gameCollection.updateOne({'_id': id}, {$set: teamRes[r]}, function(err) {
            if (err) throw err
            io.emit('loadTeam', teamRes[r])
          })
        }
      }
    })
  },

  setDemoRunTo: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setDemoRunTo', data) }

    db.gamesCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const demoConfig = res.demoConfig
        demoConfig.runTo = data.runTo
        demoConfig.runToCards = data.runTo == 'MVP' ? res.mvpCards : cardFuns.initialCards().length
        res.demoConfig = demoConfig
        db.gamesCollection.updateOne({'_id': res._id}, {$set: {demoConfig: demoConfig}}, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })
  }

}
