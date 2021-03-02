const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')
const prod = os.hostname() == 'agilesimulations' ? true : false

const logFile = prod ? process.argv[4] : 'server.log'

let currentAction = ''
let currentData = ''
ON_DEATH(function(signal, err) {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (currentAction) {
    logStr = logStr + '  Action: ' + currentAction + '\n'
  }
  if (currentData) {
    logStr = logStr + '  Data: ' + currentData + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  Error: ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, function (err) {
    if (err) console.log(logStr)
    process.exit()
  })
})

let httpServer
let io
if (!prod) {
  const express = require('express')
  const app = express()
  httpServer = require('http').createServer(app)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['http://localhost:*'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
} else {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/agilesimulations.co.uk.key'),
    cert: fs.readFileSync('/etc/ssl/certs/07DDA10F5A5AB75BD9E9508BC490D32C.cer')
  }
  httpServer = require('https').createServer(options)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['https://agilesimulations.co.uk'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
}

const dbStore = require('./store/dbStore.js')
const results = require('./store/results.js')
const demo = require('./store/demo.js')        // Just set an end state
const runGame = require('./store/runGame.js')  // Actually run the game

const MongoClient = require('mongodb').MongoClient

const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'
const maxIdleTime = 7200000
const connectDebugOff = prod
const debugOn = !prod

const connections = {}
const maxConnections = 2000

function emit(event, data) {
  if (debugOn) {
    console.log(event, data, '(emit)')
  }
  io.emit(event, data)
}

function doDb(fun, data) {
  currentAction = fun
  currentData = data
  MongoClient.connect(url, { useUnifiedTopology: true, maxIdleTimeMS: maxIdleTime }, function (err, client) {
    if (err) throw err
    const db = client.db('db')

    switch(fun) {
      case 'getAvailableGames':
        dbStore.getAvailableGames(db, io, data, debugOn)
        break
      case 'loadGame':
        dbStore.loadGame(db, io, data, debugOn)
        break
      case 'makeCaptain':
        dbStore.makeCaptain(db, io, data, debugOn)
        break
      case 'restartGame':
        dbStore.restartGame(db, io, data, debugOn)
        break
      case 'deleteGameMeta':
        dbStore.deleteGameMeta(db, io, data, debugOn)
        break
      case 'deleteGame':
        dbStore.deleteGame(db, io, data, debugOn)
        break
      case 'retroDone':
        dbStore.retroDone(db, io, data, debugOn)
        break
      case 'updateCurrentDay':
        dbStore.updateCurrentDay(db, io, data, debugOn)
        break
      case 'pullInCard':
        dbStore.pullInCard(db, io, data, debugOn)
        break
      case 'updateEffort':
        dbStore.updateEffort(db, io, data, debugOn)
        break
      case 'addEffortToOthersCard':
        dbStore.addEffortToOthersCard(db, io, data, debugOn)
        break
      case 'incrementAutoDeploy':
        dbStore.incrementAutoDeploy(db, io, data, debugOn)
        break
      case 'startAutoDeploy':
        dbStore.startAutoDeploy(db, io, data, debugOn)
        break
      case 'updateProjectEstimate':
        dbStore.updateProjectEstimate(db, io, data, debugOn)
        break
      case 'updateMVPEstimate':
        dbStore.updateMVPEstimate(db, io, data, debugOn)
        break
      case 'updateReEstimate':
        dbStore.updateReEstimate(db, io, data, debugOn)
        break
      case 'pairingDay':
        dbStore.pairingDay(db, io, data, debugOn)
        break
      case 'sendMessage':
        dbStore.sendMessage(db, io, data, debugOn)
        break
      case 'sendMessageToFacilitators':
        dbStore.sendMessageToFacilitators(db, io, data, debugOn)
        break
      case 'updateMessages':
        dbStore.updateMessages(db, io, data, debugOn)
        break
      case 'updateFacilitatorMessages':
        dbStore.updateFacilitatorMessages(db, io, data, debugOn)
        break
      case 'answerFacilitatorQuestion':
        dbStore.answerFacilitatorQuestion(db, io, data, debugOn)
        break

      // Facilitator
      //
      case 'updateTeamActive':
        dbStore.updateTeamActive(db, io, data, debugOn)
        break
      case 'updateGameInclude':
        dbStore.updateGameInclude(db, io, data, debugOn)
        break
      case 'updateStealth':
        dbStore.updateStealth(db, io, data, debugOn)
        break
      case 'updateConfig':
        dbStore.updateConfig(db, io, data, debugOn)
        break

     // Game State
     //
     case 'gameState':
       dbStore.gameState(db, io, data)
       break
    case 'getGames':
      dbStore.getGames(db, io, data, debugOn)
      break
    case 'getGameDetails':
      dbStore.getGameDetails(db, io, data, debugOn)
      break

    // Results

    case 'showGameResult':
      results.showGameResult(db, io, data, debugOn)
      break
    case 'showAllTeamsResult':
      results.showAllTeamsResult(db, io, data, debugOn)
      break
    case 'showSingleTeamResult':
      results.showSingleTeamResult(db, io, data, debugOn)
      break
    case 'showMultipleTeamsResult':
      results.showMultipleTeamsResult(db, io, data, debugOn)
      break
    case 'showSourceOfVariation':
      results.showSourceOfVariation(db, io, data, debugOn)
      break
    case 'setWipUseMovingAverage':
      results.setWipUseMovingAverage(db, io, data, debugOn)
      break
    case 'setWipUseDays':
      results.setWipUseDays(db, io, data, debugOn)
      break
    case 'setCumulativeFlowUseDays':
      results.setCumulativeFlowUseDays(db, io, data, debugOn)
      break
    case 'setCardSize':
      results.setCardSize(db, io, data, debugOn)
      break
    case 'setMonteCarloRunTo':
      results.setMonteCarloRunTo(db, io, data, debugOn)
      break
    case 'setMonteCarloRuns':
      results.setMonteCarloRuns(db, io, data, debugOn)
      break

      // Demo

      case 'setDemoRunTo':
        dbStore.setDemoRunTo(db, io, data, debugOn)
        break
      case 'setDemoStepThrough':
        dbStore.setDemoStepThrough(db, io, data, debugOn)
        break
      case 'setDemoRunning':
        dbStore.setDemoRunning(db, io, data, debugOn)
        break
      case 'runDemoToMvp':
        demo.runDemoToMvp(db, io, data, debugOn)
        break
      case 'runDemoToEnd':
        demo.runDemoToEnd(db, io, data, debugOn)
        break
      case 'runDemoGame':
        runGame.run(db, io, data, debugOn)
        break
      case 'setupRunGame':
        runGame.setUp(db, io, data, debugOn)
        break

      default:
        console.log('Unknown function: \'' + fun + '\'')
    }
  })
}

io.on('connection', (socket) => {
  const connection = socket.handshake.headers.host
  connections[connection] = connections[connection] ? connections[connection] + 1 : 1
  if (Object.keys(connections).length > maxConnections || connections[connection] > maxConnections) {
    console.log(`Too many connections. Socket ${socket.id} closed`)
    socket.disconnect(0)
  } else {
    connectDebugOff || console.log(`A user connected with socket id ${socket.id} from ${connection} - ${connections[connection]} connections. (${Object.keys(connections).length} clients)`)
    emit('updateConnections', {connections: connections, maxConnections: maxConnections})
  }

  socket.on('disconnect', () => {
    const connection = socket.handshake.headers.host
    connections[connection] = connections[connection] - 1
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected.`)
    emit('updateConnections', {connections: connections, maxConnections: maxConnections})
  })

  socket.on('getAvailableGames', (data) => { doDb('getAvailableGames', data) })

  socket.on('loadGame', (data) => { doDb('loadGame', data) })

  socket.on('makeCaptain', (data) => { doDb('makeCaptain', data) })

  socket.on('restartGame', (data) => { doDb('restartGame', data) })

  socket.on('deleteGame', (data) => {
    doDb('deleteGameMeta', data)
    doDb('deleteGame', data)
  })

  socket.on('showSetEstimates', (data) => { emit('showSetEstimates', data) })

  socket.on('retro', (data) => { emit('retro', data) })

  socket.on('retroDone', (data) => { doDb('retroDone', data) })

  socket.on('showEventCard', (data) => { emit('showEventCard', data) })

  socket.on('updateCurrentDay', (data) => { doDb('updateCurrentDay', data) })

  socket.on('hide', (data) => { emit('hide', data) })

  socket.on('pullInCard', (data) => { doDb('pullInCard', data) })

  socket.on('hint', (data) => { emit('hint', data) })

  socket.on('updatePersonEffort', (data) => { emit('updatePersonEffort', data) })

  socket.on('updatePersonAutoDeployEffort', (data) => { emit('updatePersonAutoDeployEffort', data) })

  socket.on('updateEffort', (data) => { doDb('updateEffort', data) })

  socket.on('pairingDay', (data) => { doDb('pairingDay', data) })

  socket.on('resetEffort', (data) => { emit('resetEffort', data) })

  socket.on('addEffortToOthersCard', (data) => { doDb('addEffortToOthersCard', data) })

  socket.on('updateOtherTeamEffort', (data) => { emit('updateOtherTeamEffort', data) })

  socket.on('sendMessage', (data) => { doDb('sendMessage', data) })

  socket.on('sendMessageToFacilitators', (data) => { doDb('sendMessageToFacilitators', data) })

  socket.on('updateMessages', (data) => { doDb('updateMessages', data) })

  socket.on('updateFacilitatorMessages', (data) => { doDb('updateFacilitatorMessages', data) })

  socket.on('answerFacilitatorQuestion', (data) => { doDb('answerFacilitatorQuestion', data) })

  socket.on('updateProjectEstimate', (data) => { doDb('updateProjectEstimate', data) })

  socket.on('updateMVPEstimate', (data) => { doDb('updateMVPEstimate', data) })

  socket.on('updateReEstimate', (data) => { doDb('updateReEstimate', data) })

  socket.on('startAutoDeploy', (data) => { doDb('startAutoDeploy', data) })

  socket.on('incrementAutoDeploy', (data) => { doDb('incrementAutoDeploy', data) })

  // Facilitator View

  socket.on('updateConfig', (data) => { doDb('updateConfig', data) })

  socket.on('broadcastMessage', (data) => { emit('broadcastMessage', data) })

  socket.on('updateStealth', (data) => { doDb('updateStealth', data) })

  socket.on('updateTeamActive', (data) => { doDb('updateTeamActive', data) })

  socket.on('updateGameInclude', (data) => { doDb('updateGameInclude', data) })

  socket.on('getGames', (data) => { doDb('getGames', data) })

  socket.on('getGameDetails', (data) => { doDb('getGameDetails', data) })

  // Game State

  socket.on('gameState', (data) => { doDb('gameState', data) })

  // Results

  socket.on('showGameResult', (data) => { doDb('showGameResult', data) })

  socket.on('showAllTeamsResult', (data) => { doDb('showAllTeamsResult', data) })

  socket.on('showSingleTeamResult', (data) => { doDb('showSingleTeamResult', data) })

  socket.on('showMultipleTeamsResult', (data) => { doDb('showMultipleTeamsResult', data) })

  socket.on('showSourceOfVariation', (data) => { doDb('showSourceOfVariation', data) })

  socket.on('setWipUseMovingAverage', (data) => { doDb('setWipUseMovingAverage', data) })

  socket.on('setWipUseDays', (data) => { doDb('setWipUseDays', data) })

  socket.on('setCumulativeFlowUseDays', (data) => { doDb('setCumulativeFlowUseDays', data) })

  socket.on('setCardSize', (data) => { doDb('setCardSize', data) })

  socket.on('setMonteCarloRunTo', (data) => { doDb('setMonteCarloRunTo', data) })

  socket.on('setMonteCarloRuns', (data) => { doDb('setMonteCarloRuns', data) })

  // Demo

  socket.on('setDemoRunTo', (data) => { doDb('setDemoRunTo', data) })

  socket.on('setDemoStepThrough', (data) => { doDb('setDemoStepThrough', data) })

  socket.on('setDemoRunning', (data) => { doDb('setDemoRunning', data) })

  socket.on('runDemoToMvp', (data) => { doDb('runDemoToMvp', data) })

  socket.on('runDemoToEnd', (data) => { doDb('runDemoToEnd', data) })

  socket.on('runDemoGame', (data) => { doDb('runDemoGame', data) })

  socket.on('setupRunGame', (data) => { doDb('setupRunGame', data) })
})

const port = process.argv[2] || 3007

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
