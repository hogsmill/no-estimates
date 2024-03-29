<template>
  <div id="app" class="mb-4">
    <Header />
    <ClearStorage />
    <RateThisGame />
    <ConnectionError />
    <Results />
    <div v-if="currentTab == 'facilitator'">
      <FacilitatorView />
    </div>
    <div v-if="currentTab == 'game'" class="main">
      <HostFunctions v-if="admin" />
      <SetGame />
      <SetEstimates v-if="gameName" />
      <GoMobile v-if="allowMobile" />
      <WalkThrough />
      <Status />
      <div class="container board" :class="appTypeBoard()">
        <h3 class="board-title">
          <span v-if="gameName">Game: {{ gameName }}</span>
          <span v-if="gameName && teamName"> - </span>
          <span v-if="teamName">Team: {{ teamName }} ({{ myTeamMembers }} {{ membersString() }})</span>
        </h3>
        <div class="game-buttons">
          <Report />
          <Chat />
          <ChatFacilitator v-if="admin" />
        </div>
        <Roles />
        <Message />
        <Day />
        <Board />
      </div>
    </div>
    <Modals />
  </div>
</template>

<script>
import bus from './socket.js'

import ls from './lib/localStorage.js'
import appTypeFuns from './lib/appType.js'
import params from './lib/params.js'
import stringFuns from './lib/stringFuns.js'

import Header from './components/Header.vue'
import Modals from './components/Modals.vue'
import RateThisGame from './components/RateThisGame.vue'
import ClearStorage from './components/ClearStorage.vue'
import HostFunctions from './components/HostFunctions.vue'
import ConnectionError from './components/error/ConnectionError.vue'
import Report from './components/Report.vue'
import Results from './components/facilitator/Results.vue'
import GoMobile from './components/GoMobile.vue'
import SetGame from './components/SetGame.vue'
import SetEstimates from './components/SetEstimates.vue'
import Status from './components/Status.vue'
import Message from './components/Message.vue'
import FacilitatorView from './components/FacilitatorView.vue'
import WalkThrough from './components/WalkThrough.vue'

import Roles from './components/Roles.vue'
import Day from './components/Day.vue'
import Chat from './components/Chat.vue'
import ChatFacilitator from './components/ChatFacilitator.vue'
import Board from './components/Board.vue'

export default {
  name: 'App',
  components: {
    Header,
    Modals,
    ClearStorage,
    RateThisGame,
    HostFunctions,
    ConnectionError,
    FacilitatorView,
    WalkThrough,
    GoMobile,
    SetGame,
    SetEstimates,
    Status,
    Message,
    Report,
    Results,
    Roles,
    Day,
    Chat,
    ChatFacilitator,
    Board
  },
  data() {
    return {
      setup: false
    }
  },
  computed: {
    appType() {
      return this.$store.getters.appType
    },
    lsSuffix() {
      return this.$store.getters.lsSuffix
    },
    admin() {
      return this.$store.getters.getAdmin
    },
    connectionError() {
      return this.$store.getters.getConnectionError
    },
    localStorageStatus() {
      return this.$store.getters.getLocalStorageStatus
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    currentTab() {
      return this.$store.getters.getCurrentTab
    },
    stealth() {
      return this.$store.getters.getStealth
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
    myTeamMembers() {
      return this.$store.getters.getMyTeamMembers
    },
    allowMobile() {
      return this.$store.getters.getAllowMobile
    }
  },
  created() {

    // General setup

    bus.on('connectionError', (data) => {
      this.$store.dispatch('updateConnectionError', data)
    })

    this.$store.dispatch('localStorageStatus', ls.check())

    const appType = appTypeFuns.get('No Estimates')
    this.$store.dispatch('updateAppType', appType)

    if (location.hostname == 'localhost' && params.isParam('host')) {
      this.$store.dispatch('updateAdmin', true)
    }

    // Set up game

    bus.emit('sendCheckSystemWorkshops', {appType: appType})

    let gameName
    if (params.getParam('game')) {
      gameName = params.getParam('game')
      localStorage.setItem('gameName-' + this.lsSuffix, gameName)
      bus.emit('sendLoadGame', {gameName: gameName, appType: appType})
    } else {
      gameName = localStorage.getItem('gameName-' + this.lsSuffix)
    }
    if (gameName) {
      this.$store.dispatch('updateGameName', gameName)
    }

    let myName = localStorage.getItem('myName-' + this.lsSuffix)
    if (myName) {
      myName = JSON.parse(myName)
      this.$store.dispatch('updateMyName', myName)
    }

    const teamName = localStorage.getItem('teamName-' + this.lsSuffix)
    if (teamName) {
      this.$store.dispatch('updateTeamName', teamName)
    }

    const myRole = localStorage.getItem('myRole-' + this.lsSuffix)

    window.onload = function() {
      const appType = appTypeFuns.get()
      if (gameName && myName && teamName && appType) {
        bus.emit('sendLoadGame', {gameName: gameName, teamName: teamName, myName: myName, myRole: myRole, appType: appType})
      }
    }

    // Walk Through

    if (params.isParam('walkThrough')) {
      this.$store.dispatch('showModal', 'walkThrough')
    }

    bus.on('makeCaptain', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        const myName = JSON.parse(localStorage.getItem('myName-' + this.lsSuffix))
        myName.captain = data.myName.id == myName.id
        localStorage.setItem('myName-' + this.lsSuffix, JSON.stringify(myName))
      }
    })

    bus.on('loadTeam', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('loadTeam', data)
      }
    })

    bus.on('loadGame', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('loadGame', data)
      }
    })

    bus.on('updateGameState', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateGameState', data)
      }
    })

    bus.on('updateConnections', (data) => {
      this.$store.dispatch('updateConnectionError', null)
      this.$store.dispatch('updateConnections', data)
    })

    bus.on('hide', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('hideModal', data.popup)
      }
    })
  },
  methods: {
    membersString() {
      return stringFuns.pluralString(this.myTeamMembers, 'member')
    },
    appTypeBoard() {
      let c = ''
      switch(this.appType) {
        case 'No Estimates':
          c = 'no-estimates'
          break
        case 'Kanban Playground':
          c = 'kanban-playground'
          break
      }
      return c
    }
  }
}
</script>

<style lang="scss">

  .not-connected {
    background-color: red;
    color: #fff;
    font-weight: bold;
    margin: 6px;
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

    &.no-estimates, &.billy-bonkers {
      //
      // Gradient
      //
      /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#7db9e8+0,207cca+44,0000ff+100 */
      $start: #7db9e8;
      $mid: #207cca;
      $end: #0000ff;
      background: #7db9e8; /* Old browsers */
      background: -moz-radial-gradient(center, ellipse cover,  $start 0%, $mid 44%, $end 100%); /* FF3.6-15 */
      background: -webkit-radial-gradient(center, ellipse cover,  $start 0%,$mid 44%,$end 100%); /* Chrome10-25,Safari5.1-6 */
      background: radial-gradient(ellipse at center,  $start 0%,$mid 44%,$end 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='$start', endColorstr='$end',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
      //
      // End Gradient
      //
    }

    &.kanban-playground {
      //
      // Gradient
      //
      /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#7db9e8+0,207cca+44,0000ff+100 */
      $start: #ABB2B9;
      $mid: #566573;
      $end: #17202A;
      background: #7db9e8; /* Old browsers */
      background: -moz-radial-gradient(center, ellipse cover,  $start 0%, $mid 44%, $end 100%); /* FF3.6-15 */
      background: -webkit-radial-gradient(center, ellipse cover,  $start 0%,$mid 44%,$end 100%); /* Chrome10-25,Safari5.1-6 */
      background: radial-gradient(ellipse at center,  $start 0%,$mid 44%,$end 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='$start', endColorstr='$end',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
      //
      // End Gradient
      //
    }

    margin-top: 6px;
    color: #fff;

    .game-buttons {
      text-align: left;
    }
  }

  .chat-div {
    width: 50px;
    display: inline-block;
    float: right;
    height: 40px;
  }

</style>
