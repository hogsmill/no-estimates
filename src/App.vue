<template>
  <div>
    <router-view />
    <div class="main">
      <div v-if="isHost" class="right" @click="clear()">
        Clear Storage
      </div>

      <div v-if="!connections.connections" class="not-connected">
        WARNING: You are not connected to the server
      </div>
      <SetGame />
      <SetEstimates />
      <Status />

      <div v-if="isSetUp()" class="container board">
        <h3 class="board-title">
          <span v-if="gameName">Game: {{ gameName }}</span>
          <span v-if="gameName && teamName"> - </span>
          <span v-if="teamName">Team: {{ teamName }}</span>
        </h3>
        <div class="game-buttons">
          <Report />
        </div>
        <Roles />
        <Day />
        <Board />
        <Message />
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

import params from './lib/params.js'

import Report from './components/report/Report.vue'
import SetGame from './components/SetGame.vue'
import SetEstimates from './components/SetEstimates.vue'
import Status from './components/Status.vue'

import Message from './components/Message.vue'
import FacilitatorView from './components/facilitator/FacilitatorView.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'

import Roles from './components/Roles.vue'
import Day from './components/Day.vue'
import Board from './components/Board.vue'

import EventBus from './EventBus'
window.bus = EventBus


export default {
  name: 'App',
  components: {
    MyName,
    TeamName,
    MyRole,
    GameName,
    appHeader: Header,
    FacilitatorView,
    WalkThroughView,
    SetGame,
    SetEstimates,
    Status,
    Message,
    Report,
    Roles,
    Day,
    Board
  },
  data() {
    return {
      setup: false
    }
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    connections() {
      return this.$store.getters.getConnections
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showFacilitator() {
      return this.$store.getters.getHost
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    myRole() {
      return this.$store.getters.getMyRole
    },
  },
  created() {
    let host = '77.68.122.69'
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    const connStr = 'http://' + host + ':3007'
    console.log('Connecting to: ' + connStr)
    window.bus.setupSocket(io(connStr))
    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    if (params.getParam('game')) {
      const game = params.getParam('game')
      this.$store.dispatch('updateGameName', game)
      localStorage.setItem('gameName', game)
    }

    window.bus.$on('updateMvpCards', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateMvpCards', data)
      }
    })

    window.bus.$on('updateStealth', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateStealth', data)
      }
    })

    const self = this
    window.onload = function() {
      let myEffort = localStorage.getItem('myEffort')
      if (myEffort) {
        myEffort = JSON.parse(myEffort)
        self.$store.dispatch('updateMyEffort', myEffort)
      }
    }

    let myName = localStorage.getItem('myName')
    if (myName) {
      if (!myName.match(/"id":/)) {
        localStorage.removeItem('myName')
      } else {
        myName = JSON.parse(myName)
        this.$store.dispatch('setMyName', myName)
      }
    }

    const teamName = localStorage.getItem('teamName')
    if (teamName) {
      this.$store.dispatch('updateTeamName', teamName)
    }

    const myRole = localStorage.getItem('myRole')
    if (myRole) {
      this.$store.dispatch('updateMyRole', myRole)
    }

    const gameName = localStorage.getItem('gameName')
    if (gameName) {
      this.$store.dispatch('updateGameName', gameName)
      window.bus.$emit('gameState', {gameName: gameName})
    }

    window.bus.$on('restartGame', (data) => {
      localStorage.removeItem('myEffort')
      if (this.gameName == data.gameName) {
        location.reload()
      }
    })

    window.bus.$on('loadGame', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('loadGame', data)
      }
    })

    window.bus.$on('percentageBlocked', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('percentageBlocked', data)
      }
    })

    window.bus.$on('percentageDeployFail', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('percentageDeployFail', data)
      }
    })

    window.bus.$on('updateRoles', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('updateRoles', data)
      }
    })

    window.bus.$on('updateColumns', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('updateColumns', data)
      }
    })

    window.bus.$on('updateTeams', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateTeams', data)
      }
    })

    window.bus.$on('updateWorkCards', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('updateWorkCards', data)
      }
    })

    window.bus.$on('updateActuals', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('updateActuals', data)
      }
    })

    window.bus.$on('updatePairing', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('updatePairing', data)
      }
    })

    window.bus.$on('updateGameState', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateGameState', data)
      }
    })

    window.bus.$on('updateConnections', (data) => {
      this.$store.dispatch('updateConnections', data)
    })
  },
  methods: {
    clear() {
      localStorage.removeItem('myName')
      localStorage.removeItem('teamName')
      localStorage.removeItem('myRole')
      localStorage.removeItem('gameName')
    },
    isSetUp() {
      const setUp = this.gameName && this.myName && this.teamName && this.myRole
      if (setUp && !this.setUp) {
        this.setUp = true
        localStorage.setItem('myName', JSON.stringify(this.myName))
        localStorage.setItem('teamName', this.teamName)
        localStorage.setItem('myRole', this.myRole)
        localStorage.setItem('gameName', this.gameName)
        window.bus.$emit('updateRole', {gameName: this.gameName, teamName: this.teamName, name: this.myName, role: this.myRole})
        window.bus.$emit('loadGame', {gameName: this.gameName, teamName: this.teamName})
      }
      return setUp
    }
  },
}
</script>

<style lang="scss">

  .not-connected {
    background-color: red;
    color: #fff;
    font-weight: bold;
  }

  .right {
    text-align: right;
    padding-right: 4px;
  }

  .not-host {
    height: 0px;
    visibility: hidden;
  }

  h1 {
    margin-bottom: 16px;
  }

  .setup-header {
    width: 700px;
    margin: 0 auto 16px auto;
  }

  .board-title {
    padding-top: 8px;
    span {
      margin: 6px;
    }
  }

  .board {
    //
    // Gradient
    //
    /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#7db9e8+0,207cca+44,0000ff+100 */
    background: #7db9e8; /* Old browsers */
    background: -moz-radial-gradient(center, ellipse cover,  #7db9e8 0%, #207cca 44%, #0000ff 100%); /* FF3.6-15 */
    background: -webkit-radial-gradient(center, ellipse cover,  #7db9e8 0%,#207cca 44%,#0000ff 100%); /* Chrome10-25,Safari5.1-6 */
    background: radial-gradient(ellipse at center,  #7db9e8 0%,#207cca 44%,#0000ff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#7db9e8', endColorstr='#0000ff',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
    //
    // End Gradient
    //

    margin-top: 6px;
    color: #fff;

    .game-buttons {
      text-align: left;
    }
  }

</style>
