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

// Demo

bus.$on('sendSetDemoStepThrough', (data) => { socket.emit('sendSetDemoStepThrough', data) })

bus.$on('sendSetDemoRunTo', (data) => { socket.emit('sendSetDemoRunTo', data) })

bus.$on('sendSetupRunGame', (data) => { socket.emit('sendSetupRunGame', data) })

bus.$on('sendSetDemoRunning', (data) => { socket.emit('sendSetDemoRunning', data) })

bus.$on('sendRunDemoGame', (data) => { socket.emit('sendRunDemoGame', data) })

// --- Receive ---

socket.on('loadTeam', (data) => { bus.$emit('loadTeam', data) })

// Demo

socket.on('startRun', (data) => { bus.$emit('startRun', data) })


export default bus
