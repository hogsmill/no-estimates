<template>
  <div id="app" class="mb-4">
    <appHeader></appHeader>
    <WalkThroughView />
    <div v-if="showFacilitator">
      <FacilitatorView v-bind:socket="socket" />
    </div>
    <div class="main" v-else>
      <div v-if="isHost" class="right" @click="clear()">Clear Storage</div>
      <h1>No Estimates <span v-if="teamName">(Team: {{teamName}})</span></h1>
      <h3 class="setup-header" v-if="!isSetUp()">Before we start the game, please set the game name, your name, your team and your speciality.</h3>
      <GameName v-bind:socket="socket" />
      <MyName v-bind:socket="socket" />
      <TeamName v-bind:socket="socket" />
      <MyRole v-bind:socket="socket" />

      <Status v-bind:socket="socket" />
      <div v-if="isSetUp()" class="container board">
        <div class="game-buttons">
          <Report v-bind:socket="socket" />
        </div>
        <Roles />
        <Day v-bind:socket="socket" />
        <Board v-bind:socket="socket" />
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

import params from './lib/params.js'

import Header from "./components/Header.vue";
import Report from "./components/report/Report.vue";
import MyName from "./components/MyName.vue";
import MyRole from "./components/MyRole.vue";
import TeamName from "./components/TeamName.vue";
import GameName from "./components/GameName.vue";
import Status from "./components/Status.vue";
import FacilitatorView from "./components/facilitator/FacilitatorView.vue";
import WalkThroughView from "./components/about/WalkThroughView.vue";

import Roles from "./components/Roles.vue";
import Day from "./components/Day.vue";
import Board from "./components/Board.vue";

export default {
  name: "App",
  components: {
    appHeader: Header,
    FacilitatorView,
    WalkThroughView,
    MyName,
    TeamName,
    MyRole,
    GameName,
    Status,
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
  methods: {
    clear() {
      localStorage.removeItem("myName")
      localStorage.removeItem("teamName")
      localStorage.removeItem("myRole")
      localStorage.removeItem("gameName")
    },
    isSetUp() {
      var setUp = this.myName && this.teamName && this.myRole && this.gameName
      if (setUp && !this.setUp) {
        this.setUp = true
        localStorage.setItem("myName", JSON.stringify(this.myName))
        localStorage.setItem("teamName", this.teamName)
        localStorage.setItem("myRole", this.myRole)
        localStorage.setItem("gameName", this.gameName)
        this.socket.emit("updateRole", {gameName: this.gameName, teamName: this.teamName, name: this.myName, role: this.myRole})
        this.socket.emit("loadGame", {gameName: this.gameName, teamName: this.teamName})
      }
      return setUp
    }
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost;
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough;
    },
    showFacilitator() {
      return this.$store.getters.getShowFacilitator;
    },
    teamName() {
      return this.$store.getters.getTeamName;
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
    var host = "77.68.122.69"
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    var connStr = "http://" + host + ":3007"
    console.log("Connecting to: " + connStr)
    this.socket = io(connStr)

    if (params.isParam("host")) {
      this.$store.dispatch("updateHost", true)
    }

    var myName = localStorage.getItem("myName")
    if (myName) {
      if (!myName.match(/"id":/)) {
        localStorage.removeItem('myName')
      } else {
        myName = JSON.parse(myName)
        this.$store.dispatch("setMyName", myName)
      }
    }

    var teamName = localStorage.getItem("teamName")
    if (teamName) {
      this.$store.dispatch("updateTeamName", teamName)
    }

    var myRole = localStorage.getItem("myRole")
    if (myRole) {
      this.$store.dispatch("updateMyRole", myRole)
    }

    var gameName = localStorage.getItem("gameName")
    if (gameName) {
      this.$store.dispatch("updateGameName", gameName)
      this.socket.emit("gameState", {gameName: gameName})
    }

    this.socket.on("loadGame", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("loadGame", data)
      }
    })

    this.socket.on("percentageBlocked", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("percentageBlocked", data)
      }
    })

    this.socket.on("percentageDeployFail", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("percentageDeployFail", data)
      }
    })

    this.socket.on("updateRoles", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateRoles", data)
      }
    })

    this.socket.on("updateColumns", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateColumns", data)
      }
    })

    this.socket.on("updateTeams", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("updateTeams", data)
      }
    })

    this.socket.on("updateWorkCards", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateWorkCards", data)
      }
    })

    this.socket.on("updatePairing", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updatePairing", data)
      }
    })

    this.socket.on("updateGameState", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("updateGameState", data)
      }
    })
  },
}
</script>

<style lang="scss">

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
