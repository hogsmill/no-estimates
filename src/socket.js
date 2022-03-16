import io from 'socket.io-client'
import bus from './EventBus'

const prod = location.hostname != 'localhost'

let asConnStr, connStr
if (!prod) {
  asConnStr = 'http://localhost:3099'
  connStr = 'http://localhost:3007'
} else {
  asConnStr = 'https://agilesimulations.co.uk:3099'
  connStr = 'https://agilesimulations.co.uk:' + process.env.VUE_APP_PORT
}
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

const connectToAgileSimulations = location.hostname != 'localhost'
let asSocket
if (connectToAgileSimulations) {
  console.log('Connecting to: ' + asConnStr)
  asSocket = io(asConnStr)
}

// Agile Simulations (login)

if (connectToAgileSimulations) {

  bus.on('sendCheckLogin', (data) => { asSocket.emit('sendCheckLogin', data) })

  bus.on('sendRating', (data) => { asSocket.emit('sendRating', data) })

  asSocket.on('loginSuccess', (data) => { bus.emit('loginSuccess', data) })

  asSocket.on('logout', (data) => { bus.emit('logout', data) })
}

// ------------------------------

socket.on('connect_error', (err) => { bus.emit('connectionError', err) })

// --- Send ---

bus.on('sendCheckServerRestartPassword', (data) => { socket.emit('sendCheckServerRestartPassword', data) })

bus.on('sendCheckSystemWorkshops', (data) => { socket.emit('sendCheckSystemWorkshops', data) })

bus.on('sendLoadGame', (data) => { socket.emit('sendLoadGame', data) })

bus.on('sendMakeCaptain', (data) => { socket.emit('sendMakeCaptain', data) })

bus.on('sendRestartGame', (data) => { socket.emit('sendRestartGame', data) })

bus.on('sendDisableMember', (data) => { socket.emit('sendDisableMember', data) })

bus.on('sendEnableMember', (data) => { socket.emit('sendEnableMember', data) })

bus.on('sendDeleteMember', (data) => { socket.emit('sendDeleteMember', data) })

bus.on('emitHide', (data) => { socket.emit('emitHide', data) })

bus.on('emitRetro', (data) => { socket.emit('emitRetro', data) })

bus.on('sendRetroDone', (data) => { socket.emit('sendRetroDone', data) })

bus.on('sendSetColumnWip', (data) => { socket.emit('sendSetColumnWip', data) })

bus.on('emitShowEventCard', (data) => { socket.emit('emitShowEventCard', data) })

bus.on('sendUpdateCurrentDay', (data) => { socket.emit('sendUpdateCurrentDay', data) })

bus.on('sendStartAutoDeploy', (data) => { socket.emit('sendStartAutoDeploy', data) })

bus.on('sendIncrementAutoDeploy', (data) => { socket.emit('sendIncrementAutoDeploy', data) })

bus.on('emitUpdatePersonAutoDeployEffort', (data) => { socket.emit('emitUpdatePersonAutoDeployEffort', data) })

bus.on('sendAddEffortToOthersCard', (data) => { socket.emit('sendAddEffortToOthersCard', data) })

bus.on('emitUpdateOtherTeamEffort', (data) => { socket.emit('emitUpdateOtherTeamEffort', data) })

bus.on('emitHint', (data) => { socket.emit('emitHint', data) })

bus.on('sendPullInCard', (data) => { socket.emit('sendPullInCard', data) })

bus.on('emitUpdatePersonEffort', (data) => { socket.emit('emitUpdatePersonEffort', data) })

bus.on('sendUpdateEffort', (data) => { socket.emit('sendUpdateEffort', data) })

bus.on('sendMoveCardToNextColumn', (data) => { socket.emit('sendMoveCardToNextColumn', data) })

bus.on('sendSendMessageToFacilitators', (data) => { socket.emit('sendSendMessageToFacilitators', data) })

bus.on('sendSendMessage', (data) => { socket.emit('sendSendMessage', data) })

bus.on('sendUpdateMessages', (data) => { socket.emit('sendUpdateMessages', data) })

bus.on('sendAnswerFacilitatorQuestion', (data) => { socket.emit('sendAnswerFacilitatorQuestion', data) })

bus.on('sendUpdateFacilitatorMessages', (data) => { socket.emit('sendUpdateFacilitatorMessages', data) })

bus.on('sendUpdateProjectEstimate', (data) => { socket.emit('sendUpdateProjectEstimate', data) })

bus.on('sendUpdateMVPEstimate', (data) => { socket.emit('sendUpdateMVPEstimate', data) })

bus.on('sendUpdateReEstimate', (data) => { socket.emit('sendUpdateReEstimate', data) })

bus.on('emitShowSetEstimates', (data) => { socket.emit('emitShowSetEstimates', data) })

// Facilitator

bus.on('emitBroadcastMessage', (data) => { socket.emit('emitBroadcastMessage', data) })

bus.on('sendAddGame', (data) => { socket.emit('sendAddGame', data) })

bus.on('sendGetGames', (data) => { socket.emit('sendGetGames', data) })

bus.on('sendPlayersJoinBy', (data) => { socket.emit('sendPlayersJoinBy', data) })

bus.on('sendUpdateStealth', (data) => { socket.emit('sendUpdateStealth', data) })

bus.on('sendUpdateCurrency', (data) => { socket.emit('sendUpdateCurrency', data) })

bus.on('sendUpdateConfig', (data) => { socket.emit('sendUpdateConfig', data) })

bus.on('sendUpdateTeamActive', (data) => { socket.emit('sendUpdateTeamActive', data) })

bus.on('sendDeleteGame', (data) => { socket.emit('sendDeleteGame', data) })

bus.on('sendRunDemoToMvp', (data) => { socket.emit('sendRunDemoToMvp', data) })

bus.on('sendRunDemoToEnd', (data) => { socket.emit('sendRunDemoToEnd', data) })

// Results

bus.on('sendShowGameResult', (data) => { socket.emit('sendShowGameResult', data) })

bus.on('sendShowAllTeamsResult', (data) => { socket.emit('sendShowAllTeamsResult', data) })

bus.on('sendShowSingleTeamResult', (data) => { socket.emit('sendShowSingleTeamResult', data) })

bus.on('sendShowMultipleTeamsResult', (data) => { socket.emit('sendShowMultipleTeamsResult', data) })

bus.on('sendSetWipUseMovingAverage', (data) => { socket.emit('sendSetWipUseMovingAverage', data) })

bus.on('sendSetWipUseDays', (data) => { socket.emit('sendSetWipUseDays', data) })

bus.on('sendSetCumulativeFlowUseDays', (data) => { socket.emit('sendSetCumulativeFlowUseDays', data) })

bus.on('sendSetCardSize', (data) => { socket.emit('sendSetCardSize', data) })

bus.on('sendSetMonteCarloRuns', (data) => { socket.emit('sendSetMonteCarloRuns', data) })

bus.on('sendSetMonteCarloRunTo', (data) => { socket.emit('sendSetMonteCarloRunTo', data) })

bus.on('sendShowSourceOfVariation', (data) => { socket.emit('sendShowSourceOfVariation', data) })

// Demo

bus.on('sendSetDemoRunTo', (data) => { socket.emit('sendSetDemoRunTo', data) })

bus.on('sendSetupRunGame', (data) => { socket.emit('sendSetupRunGame', data) })

bus.on('sendStartDemoRunning', (data) => { socket.emit('sendStartDemoRunning', data) })

bus.on('sendStopDemoRunning', (data) => { socket.emit('sendStopDemoRunning', data) })

bus.on('sendDemoMakeMove', (data) => { socket.emit('sendDemoMakeMove', data) })

// --- Receive ---

socket.on('serverRestartPasswordError', (data) => { bus.emit('serverRestartPasswordError', data) })

socket.on('broadcastMessage', (data) => { bus.emit('broadcastMessage', data) })

socket.on('loadGame', (data) => { bus.emit('loadGame', data) })

socket.on('loadTeam', (data) => { bus.emit('loadTeam', data) })

socket.on('makeCaptain', (data) => { bus.emit('makeCaptain', data) })

socket.on('updateGameState', (data) => { bus.emit('updateGameState', data) })

socket.on('updateGames', (data) => { bus.emit('updateGames', data) })

socket.on('updateConnections', (data) => { bus.emit('updateConnections', data) })

socket.on('showEventCard', (data) => { bus.emit('showEventCard', data) })

socket.on('autoDeployIncremented', (data) => { bus.emit('autoDeployIncremented', data) })

socket.on('autoDeployComplete', (data) => { bus.emit('autoDeployComplete', data) })

socket.on('showSetEstimates', (data) => { bus.emit('showSetEstimates', data) })

// Day

socket.on('retro', (data) => { bus.emit('retro', data) })

socket.on('hide', (data) => { bus.emit('hide', data) })

// Status

socket.on('hint', (data) => { bus.emit('hint', data) })

socket.on('updatePersonEffort', (data) => { bus.emit('updatePersonEffort', data) })

socket.on('updatePersonAutoDeployEffort', (data) => { bus.emit('updatePersonAutoDeployEffort', data) })

socket.on('updateOtherTeamEffort', (data) => { bus.emit('updateOtherTeamEffort', data) })

socket.on('broadcastMessage', (data) => { bus.emit('broadcastMessage', data) })

// Facilitator

// Graphs

socket.on('addGameError', (data) => { bus.emit('addGameError', data) })

socket.on('showResult', (data) => { bus.emit('showResult', data) })

socket.on('updateSourcesOfVariation', (data) => { bus.emit('updateSourcesOfVariation', data) })

// Demo

socket.on('startRun', (data) => { bus.emit('startRun', data) })

socket.on('demoMoveComplete', (data) => { bus.emit('demoMoveComplete', data) })

export default bus
