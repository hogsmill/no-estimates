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

MongoClient.connect(url, { useUnifiedTopology: true, maxIdleTimeMS: maxIdleTime }, function (err, client) {
  if (err) throw err
  const db = client.db('db')

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

    socket.on('sendGetAvailableGames', (data) => { dbStore.getAvailableGames(db, io, data, debugOn) })

    socket.on('sendLoadGame', (data) => { dbStore.loadGame(db, io, data, debugOn) })

    socket.on('sendMakeCaptain', (data) => { dbStore.makeCaptain(db, io, data, debugOn) })

    socket.on('sendRestartGame', (data) => { dbStore.restartGame(db, io, data, debugOn) })

    socket.on('sendDeleteGame', (data) => {
      dbStore.deleteGameMeta(db, io, data, debugOn)
      dbStore.deleteGame(db, io, data, debugOn)
    })

    socket.on('emitShowSetEstimates', (data) => { emit('showSetEstimates', data) })

    socket.on('emitRetro', (data) => { emit('retro', data) })

    socket.on('sendRetroDone', (data) => { dbStore.retroDone(db, io, data, debugOn) })

    socket.on('emitShowEventCard', (data) => { emit('showEventCard', data) })

    socket.on('sendUpdateCurrentDay', (data) => { dbStore.updateCurrentDay(db, io, data, debugOn) })

    socket.on('emitHide', (data) => { emit('hide', data) })

    socket.on('sendPullInCard', (data) => { dbStore.pullInCard(db, io, data, debugOn) })

    socket.on('emitHint', (data) => { emit('hint', data) })

    socket.on('emitUpdatePersonEffort', (data) => { emit('updatePersonEffort', data) })

    socket.on('emitUpdatePersonAutoDeployEffort', (data) => { emit('updatePersonAutoDeployEffort', data) })

    socket.on('sendUpdateEffort', (data) => { dbStore.updateEffort(db, io, data, debugOn) })

    socket.on('sendAddEffortToOthersCard', (data) => { dbStore.addEffortToOthersCard(db, io, data, debugOn) })

    socket.on('emitUpdateOtherTeamEffort', (data) => { emit('updateOtherTeamEffort', data) })

    socket.on('sendSendMessage', (data) => { dbStore.sendMessage(db, io, data, debugOn) })

    socket.on('sendSendMessageToFacilitators', (data) => { dbStore.sendMessageToFacilitators(db, io, data, debugOn) })

    socket.on('sendUpdateMessages', (data) => { dbStore.updateMessages(db, io, data, debugOn) })

    socket.on('sendUpdateFacilitatorMessages', (data) => { dbStore.updateFacilitatorMessages(db, io, data, debugOn) })

    socket.on('sendAnswerFacilitatorQuestion', (data) => { dbStore.answerFacilitatorQuestion(db, io, data, debugOn) })

    socket.on('sendUpdateProjectEstimate', (data) => { dbStore.updateProjectEstimate(db, io, data, debugOn) })

    socket.on('sendUpdateMVPEstimate', (data) => { dbStore.updateMVPEstimate(db, io, data, debugOn) })

    socket.on('sendUpdateReEstimate', (data) => { dbStore.updateReEstimate(db, io, data, debugOn) })

    socket.on('sendStartAutoDeploy', (data) => { dbStore.startAutoDeploy(db, io, data, debugOn) })

    socket.on('sendIncrementAutoDeploy', (data) => { dbStore.incrementAutoDeploy(db, io, data, debugOn) })

    // Facilitator View

    socket.on('sendUpdateConfig', (data) => { dbStore.updateConfig(db, io, data, debugOn) })

    socket.on('emitBroadcastMessage', (data) => { emit('broadcastMessage', data) })

    socket.on('sendUpdateStealth', (data) => { dbStore.updateStealth(db, io, data, debugOn) })

    socket.on('sendUpdateTeamActive', (data) => { dbStore.updateTeamActive(db, io, data, debugOn) })

    socket.on('sendUpdateGameInclude', (data) => { dbStore.updateGameInclude(db, io, data, debugOn) })

    // Game State

    socket.on('sendGetGames', (data) => { dbStore.getGames(db, io, data, debugOn) })

    socket.on('sendGetGameDetails', (data) => { dbStore.getGameDetails(db, io, data, debugOn) })

    socket.on('sendGameState', (data) => { dbStore.gameState(db, io, data) })

    // Results

    socket.on('sendShowGameResult', (data) => { results.showGameResult(db, io, data, debugOn) })

    socket.on('sendShowAllTeamsResult', (data) => { results.showAllTeamsResult(db, io, data, debugOn) })

    socket.on('sendShowSingleTeamResult', (data) => { results.showSingleTeamResult(db, io, data, debugOn) })

    socket.on('sendShowMultipleTeamsResult', (data) => { results.showMultipleTeamsResult(db, io, data, debugOn) })

    socket.on('sendShowSourceOfVariation', (data) => { results.showSourceOfVariation(db, io, data, debugOn) })

    socket.on('sendSetWipUseMovingAverage', (data) => { results.setWipUseMovingAverage(db, io, data, debugOn) })

    socket.on('sendSetWipUseDays', (data) => { results.setWipUseDays(db, io, data, debugOn) })

    socket.on('sendSetCumulativeFlowUseDays', (data) => { results.setCumulativeFlowUseDays(db, io, data, debugOn) })

    socket.on('sendSetCardSize', (data) => { results.setCardSize(db, io, data, debugOn) })

    socket.on('sendSetMonteCarloRunTo', (data) => { results.setMonteCarloRunTo(db, io, data, debugOn) })

    socket.on('sendSetMonteCarloRuns', (data) => { results.setMonteCarloRuns(db, io, data, debugOn) })

    // Demo

    socket.on('sendSetDemoRunTo', (data) => { dbStore.setDemoRunTo(db, io, data, debugOn) })

    socket.on('sendSetDemoStepThrough', (data) => { dbStore.setDemoStepThrough(db, io, data, debugOn) })

    socket.on('sendSetDemoRunning', (data) => { dbStore.setDemoRunning(db, io, data, debugOn) })
    
    socket.on('sendSetDemoNotRunning', (data) => { dbStore.setDemoNotRunning(db, io, data, debugOn) })

    socket.on('sendRunDemoToMvp', (data) => { demo.runDemoToMvp(db, io, data, debugOn) })

    socket.on('sendRunDemoToMvp', (data) => { demo.runDemoToEnd(db, io, data, debugOn) })

    socket.on('sendRunDemoGame', (data) => { runGame.run(db, io, data, debugOn) })

    socket.on('sendSetupRunGame', (data) => { runGame.setUp(db, io, data, debugOn) })
  })
})

const port = process.argv[2] || 3007

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
