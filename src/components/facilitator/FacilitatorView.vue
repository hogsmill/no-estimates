<template>
  <div class="container about">

    <h1>No Estimates - Facilitator View</h1>

    <table class="game-messaging">
      <tr>
        <td>
          <h4>Game Params</h4>
          <span v-if="showGameMessaging" @click="setShowGameMessaging(false)" title="collapse" class="toggle">&#9650;</span>
          <span v-if="!showGameMessaging" @click="setShowGameMessaging(true)" title="expand" class="toggle">&#9660;</span>
        </td>
      </tr>
      <tr v-if="showGameMessaging" class="message-params">
        <td>
          <div>Message: </div>
          <input type="text" id="gameMessageText" />
          <button class="btn btn-sm btn-site-primary" @click="sendMessage">Send</button>
        </td>
      </tr>
    </table>

    <table class="game-params">
      <tr>
        <td colspan="4">
          <h4>Game Params</h4>
          <span v-if="showGameParams" @click="setShowGameParams(false)" title="collapse" class="toggle">&#9650;</span>
          <span v-if="!showGameParams" @click="setShowGameParams(true)" title="expand" class="toggle">&#9660;</span>
        </td>
      </tr>
      <tr v-if="showGameParams">
        <td>Blocked frequency: </td>
        <td class="center"><input type="text" id="percentageBlocked" class="form-control" :value="percentageBlocked" /></td>
        <td>x 10 out of every 10 cards</td>
        <td class="center"><button class="btn btn-sm btn-site-primary" @click="savePercentageBlocked">Save</button></td>
      </tr>
      <tr v-if="showGameParams">
        <td>Deployment fail: </td>
        <td class="center"><input type="text" id="percentageDeployFail" class="form-control" :value="percentageDeployFail" /></td>
        <td>x 10 out of every 10 deployments</td>
        <td class="center"><button class="btn btn-sm btn-site-primary" @click="savePercentageDeployFail">Save</button></td>
      </tr>
      <tr v-if="showGameParams">
        <td class="left-col">Teams</td>
        <td colspan="3">
          <div v-for="(team, index) in teams" :key="index"><input type="checkbox" :checked="team.include" @click="toggleActive(team)"> {{team.name}}</div>
        </td>
      </tr>
    </table>

    <table class="game-state">
      <tr>
        <td class="left" colspan="16">
          <h4>Game State</h4>
          <span v-if="showGameState" @click="setShowGameState(false)" title="collapse" class="toggle">&#9650;</span>
          <span v-if="!showGameState" @click="setShowGameState(true)" title="expand" class="toggle">&#9660;</span>
        </td>
      </tr>
      <tr  v-if="showGameState" class="header">
        <td>Team</td>
        <td>Members</td>
        <td>Autodeploy?</td>
        <td>Current<br />Day</td>
        <td>Last<br />Card<br />Played</td>
        <td>Other<br />Team<br />Cards</td>
        <td colspan="5">Columns</td>
        <td colspan="3">Estimates<br/>Proj./MVP/Re-est.</td>
      </tr>
      <tr v-for="(team, index) in gameState" :key="index">
        <td v-if="showTeamState(team)" class="white" :style="{'background-color': team.name.toLowerCase()}">{{team.name}}</td>
        <td v-if="showTeamState(team)">
          <div v-for="(member, m) in team.members" :key="m"><b>{{member.name.name}}</b> (<i>{{member.role}}</i>)</div>
        </td>
        <td v-if="showTeamState(team) && !team.autoDeploy.doing && !team.autoDeploy.done">&#9746;</td>
        <td v-if="showTeamState(team) && team.autoDeploy.doing">{{team.autoDeploy.effort}} / 8</td>
        <td v-if="showTeamState(team) && team.autoDeploy.done">&#9745;</td>
        <td v-if="showTeamState(team)">{{team.currentDay}}</td>
        <td v-if="showTeamState(team)">{{team.currentWorkCard}}</td>
        <OtherCards v-if="showTeamState(team)" v-bind:cards="team.otherCards" />
        <Column v-if="showTeamState(team)" v-bind:column="team.columns.design" v-bind:name="'Design'" />
        <Column v-if="showTeamState(team)" v-bind:column="team.columns.develop"  v-bind:name="'Develop'" />
        <Column v-if="showTeamState(team)" v-bind:column="team.columns.test"  v-bind:name="'Test'" />
        <Column v-if="showTeamState(team)" v-bind:column="team.columns.deploy"  v-bind:name="'Deploy'" />
        <Column v-if="showTeamState(team)" v-bind:column="team.columns.done"  v-bind:name="'Done'" />
        <td v-if="showTeamState(team)">{{estimates(team)}}</td>
      </tr>
    </table>

  </div>
</template>

<script>
import OtherCards from "./OtherCards.vue";
import Column from "./Column.vue";

export default {
  props: [
    'socket'
  ],
  components: {
    OtherCards,
    Column
  },
  data() {
    return {
    showGameMessaging: false,
    showGameParams: true,
    showGameState: true
    }
  },
  methods: {
    setShowGameMessaging(val) {
      this.showGameMessaging = val
    },
    setShowGameParams(val) {
      this.showGameParams = val
    },
    setShowGameState(val) {
      this.showGameState = val
    },
    sendMessage() {
      var message = document.getElementById('gameMessageText').value
      if (message) {
        this.socket.emit("broadcastMessage", {gameName: this.gameName, message: message})
      }
    },
    toggleActive(team) {
      team.include = !team.include
      this.socket.emit("updateTeamActive", {gameName: this.gameName, team: team})
    },
    savePercentageBlocked: function() {
      var percentageBlocked = document.getElementById('percentageBlocked').value
      this.socket.emit("percentageBlocked", {gameName: this.gameName, percentageBlocked: percentageBlocked})
    },
    savePercentageDeployFail: function() {
      var percentageDeployFail = document.getElementById('percentageDeployFail').value
      this.socket.emit("percentageDeployFail", {gameName: this.gameName, percentageDeployFail: percentageDeployFail})
    },
    showTeamState(team) {
      return this.showGameState && team.include
    },
    estimates(team) {
      var proj = team.projectEstimate ? team.projectEstimate : '-'
      var mvp = team.mvpEstimate ? team.mvpEstimate : '-'
      var re = team.reEstimate ? team.reEstimate : '-'
      return proj + ' / ' + mvp + ' / ' + re
    }
  },
  computed: {
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teams() {
      return this.$store.getters.getTeams
    },
    percentageBlocked() {
      return this.$store.getters.getPercentageBlocked
    },
    percentageDeployFail() {
      return this.$store.getters.getPercentageDeployFail
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  }
}
</script>

<style lang="scss">

  .game-messaging, .game-params, .game-state {

    width: 100%;
    margin: 12px;
    border: 1px solid #ccc;

    .toggle {
      color: #aaa;
    }

    .left {
      text-align: left;
    }

    h4 {
      width: 50%;
      display: inline-block;
      text-align: left;
    }

    span {
      position: absolute;
      right: 6px;
    }

    td {
      vertical-align: top;
      position: relative;
      padding: 4px;
      text-align: left;
      border: 1px solid #ccc;

      &.center {
        text-align: center;
      }
      &.left-col {
        vertical-align: top;
      }
    }
    input {
      width: 70px;
      height: 24px;
      padding: 2px;
      text-align: right;
      margin: 0 auto;
    }
  }

  .game-messaging {
    .message-params {
      div, input, button {
        display: inline-block;
        margin: 2px 6px;
      }

      input {
        width: 80%;
        border: 1px solid #ccc;
        text-align: left;
      }
    }
  }

  .game-state {
    .header td {
      vertical-align: middle;
      text-align: center;
      font-weight: bold;
    }

    td {
      text-align: center;

      &.auto-deploy div {
        display: inline;
      }
    }

    .white {
      color: #fff;
      font-weight: bold
    }
  }
</style>
