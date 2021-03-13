import io from 'socket.io-client'
import bus from './EventBus'

let connStr
if (location.hostname == 'localhost') {
  connStr = 'http://localhost:3007'
} else {
  connStr = 'https://agilesimulations.co.uk:3007'
}
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

// --- Send ---

bus.$on('sendRestartGame', (data) => { socket.emit('sendRestartGame', data) })

// Results

bus.$on('sendShowGameResult', (data) => { socket.emit('sendShowGameResult', data) })

bus.$on('sendShowAllTeamsResult', (data) => { socket.emit('sendShowAllTeamsResult', data) })

bus.$on('sendShowSingleTeamResult', (data) => { socket.emit('sendShowSingleTeamResult', data) })

bus.$on('sendShowMultipleTeamsResult', (data) => { socket.emit('sendShowMultipleTeamsResult', data) })

bus.$on('sendSetWipUseMovingAverage', (data) => { socket.emit('sendSetWipUseMovingAverage', data) })

bus.$on('sendSetWipUseDays', (data) => { socket.emit('sendSetWipUseDays', data) })

bus.$on('sendSetCumulativeFlowUseDays', (data) => { socket.emit('sendSetCumulativeFlowUseDays', data) })

bus.$on('sendSetCardSize', (data) => { socket.emit('sendSetCardSize', data) })

bus.$on('sendSetMonteCarloRuns', (data) => { socket.emit('sendSetMonteCarloRuns', data) })

bus.$on('sendSetMonteCarloRunTo', (data) => { socket.emit('sendSetMonteCarloRunTo', data) })

bus.$on('sendShowSourceOfVariation', (data) => { socket.emit('sendShowSourceOfVariation', data) })

// Demo

bus.$on('sendSetDemoStepThrough', (data) => { socket.emit('sendSetDemoStepThrough', data) })

bus.$on('sendSetDemoRunTo', (data) => { socket.emit('sendSetDemoRunTo', data) })

bus.$on('sendSetupRunGame', (data) => { socket.emit('sendSetupRunGame', data) })

bus.$on('sendSetDemoRunning', (data) => { socket.emit('sendSetDemoRunning', data) })

bus.$on('sendRunDemoGame', (data) => { socket.emit('sendRunDemoGame', data) })

// --- Receive ---

socket.on('sendBroadcastMessage', (data) => { bus.$emit('sendBroadcastMessage', data) })

socket.on('loadTeam', (data) => { bus.$emit('loadTeam', data) })

// Facilitator

// Graphs

socket.on('showResult', (data) => { bus.$emit('showResult', data) })

socket.on('updateSourcesOfVariation', (data) => { bus.$emit('updateSourcesOfVariation', data) })

// Demo

socket.on('startRun', (data) => { bus.$emit('startRun', data) })


export default bus
