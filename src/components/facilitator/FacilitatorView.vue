<template>
  <div class="container about">
    <h1>No Estimates - <span v-if="stealth">(Stealth)</span> Facilitator View</h1>

    <div class="connections">
      Current server connections: {{ connections.connections }} / {{ connections.maxConnections }}
    </div>

    <table class="game-messaging">
      <tr>
        <td>
          <h4>Messaging</h4>
          <span v-if="showGameMessaging" @click="setShowGameMessaging(false)" title="collapse" class="toggle">&#9650;</span>
          <span v-if="!showGameMessaging" @click="setShowGameMessaging(true)" title="expand" class="toggle">&#9660;</span>
        </td>
      </tr>
      <tr v-if="showGameMessaging" class="message-params">
        <td>
          <div>Message: </div>
          <input type="text" id="gameMessageText">
          <button class="btn btn-sm btn-site-primary" @click="sendMessage">
            Send
          </button>
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
        <td class="center">
          <input type="text" id="percentageBlocked" class="form-control" :value="percentageBlocked">
        </td>
        <td>x 10 out of every 10 cards</td>
        <td class="center">
          <button class="btn btn-sm btn-site-primary" @click="savePercentageBlocked">
            Save
          </button>
        </td>
      </tr>
      <tr v-if="showGameParams">
        <td>Deployment fail: </td>
        <td class="center">
          <input type="text" id="percentageDeployFail" class="form-control" :value="percentageDeployFail">
        </td>
        <td>x 10 out of every 10 deployments</td>
        <td class="center">
          <button class="btn btn-sm btn-site-primary" @click="savePercentageDeployFail">
            Save
          </button>
        </td>
      </tr>
      <tr v-if="showGameParams">
        <td class="left-col">
          <span class="mvp-label">MVP: </span> <span class="mvp-cards">Cards 1 to</span>
        </td>
        <td class="center">
          <input type="text" id="mvpCards" class="form-control" :value="mvpCards">
        </td>
        <td colspan="2" class="left">
          <button class="btn btn-sm btn-site-primary" @click="saveMvpCards">
            Save
          </button>
        </td>
      </tr>
      <tr v-if="showGameParams">
        <td class="left-col">
          Hosts
        </td>
        <td colspan="3" class="stealth">
          <input id="isStealth" type="checkbox" :checked="stealth" @click="toggleStealth()"> Hosts are in "Stealth" mode? {{ stealth }}
        </td>
      </tr>
      <tr v-if="showGameParams">
        <td class="left-col">
          Teams
        </td>
        <td colspan="3">
          <div v-for="(team, index) in gameState" :key="index">
            <input type="checkbox" :checked="team.include" @click="toggleTeamActive(team)" :disabled="team.otherCards.length > 0"> {{ team.name }}
          </div>
        </td>
      </tr>
    </table>

    <table class="game-state">
      <tr>
        <td class="left" colspan="16">
          <h4>Game State: (Game: {{ gameName }}) <span v-if="gameName" title="Restart Game" class="restart" @click="restartGame">&#8635;</span></h4>
          <span v-if="showGameState" @click="setShowGameState(false)" title="collapse" class="toggle">&#9650;</span>
          <span v-if="!showGameState" @click="setShowGameState(true)" title="expand" class="toggle">&#9660;</span>
        </td>
      </tr>
      <tr v-if="showGameState" class="header">
        <td>Team</td>
        <td>
          <div class="white rounded-circle member-role designer">
            D
          </div>
          <div class="white rounded-circle member-role developer">
            D
          </div>
          <div class="white rounded-circle member-role tester">
            T
          </div>
          <div class="white rounded-circle member-role deployer">
            D
          </div>
          <br>
          Members
        </td>
        <td>Autodeploy?</td>
        <td>Current<br>Day</td>
        <td>Last<br>Card<br>Played</td>
        <td>Other<br>Team<br>Cards</td>
        <td colspan="5">
          Columns
        </td>
        <td colspan="3">
          Estimates<br>Proj./MVP/Re-est.
        </td>
      </tr>
      <tr v-for="(team, index) in gameState" :key="index">
        <td v-if="showTeamState(team)" class="white" :style="{'background-color': team.name.toLowerCase()}">
          {{ team.name }}
        </td>
        <td v-if="showTeamState(team)">
          <div v-for="(member, m) in team.members" :key="m">
            <b>{{ member.name }}</b>
            <div class="white rounded-circle member-role" :class="roleClass(member.role)">
              {{ effort(member) }}
            </div>
          </div>
        </td>
        <td v-if="showTeamState(team) && !team.autoDeploy.doing && !team.autoDeploy.done">
          &#9746;
        </td>
        <td v-if="showTeamState(team) && team.autoDeploy.doing">
          {{ team.autoDeploy.effort }} / 8
        </td>
        <td v-if="showTeamState(team) && team.autoDeploy.done">
          &#9745;
        </td>
        <td v-if="showTeamState(team)">
          {{ team.currentDay }}
        </td>
        <td v-if="showTeamState(team)">
          {{ team.currentWorkCard }}
        </td>
        <OtherCards v-if="showTeamState(team)" :cards="team.otherCards" />
        <Column v-if="showTeamState(team)" :column="team.columns.design" :name="'Design'" />
        <Column v-if="showTeamState(team)" :column="team.columns.develop" :name="'Develop'" />
        <Column v-if="showTeamState(team)" :column="team.columns.test" :name="'Test'" />
        <Column v-if="showTeamState(team)" :column="team.columns.deploy" :name="'Deploy'" />
        <Column v-if="showTeamState(team)" :column="team.columns.done" :name="'Done'" />
        <td v-if="showTeamState(team)">
          {{ estimates(team) }}
        </td>
      </tr>
    </table>

    <table class="games">
      <tr>
        <td class="left" colspan="16">
          <h4>Games</h4>
          <span v-if="showGames" @click="setShowGames(false)" title="collapse" class="toggle">&#9650;</span>
          <span v-if="!showGames" @click="setShowGames(true)" title="expand" class="toggle">&#9660;</span>
        </td>
      </tr>
      <tr v-if="showGames" class="header">
        <td>Games</td>
        <td>
          <table class="games-table">
            <thead>
              <th>Include?</th>
              <th>Game Name</th>
              <th />
            </thead>
            <tbody>
              <tr v-for="(game, index) in games" :key="index">
                <td>
                  <input type="checkbox" :checked="game.include" @click="toggleGameActive(game)" :disabled="game.name == gameName">
                </td>
                <td>
                  {{ game.name }}
                </td>
                <td>
                  <button class="btn btn-sm btn-site-primary" @click="deleteGame(game.name)" :disabled="game.name == gameName">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import OtherCards from './OtherCards.vue'
import Column from './Column.vue'

export default {
  components: {
    OtherCards,
    Column
  },
  props: [
    'socket'
  ],
  data() {
    return {
      showGameMessaging: false,
      showGameParams: false,
      showGameState: true,
      showGames: false
    }
  },
  computed: {
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
    },
    stealth() {
      return this.$store.getters.getStealth
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
    mvpCards() {
      return this.$store.getters.getMvpCards
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    games() {
      return this.$store.getters.getGames
    },
    connections() {
      return this.$store.getters.getConnections
    }
  },
  created() {
    this.socket.emit('getGames')
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
    setShowGames(val) {
      this.showGames = val
    },
    sendMessage() {
      const message = document.getElementById('gameMessageText').value
      if (message) {
        this.socket.emit('broadcastMessage', {gameName: this.gameName, message: message})
      }
    },
    toggleStealth() {
      const isStealth = document.getElementById('isStealth').checked
      localStorage.setItem('stealth', isStealth)
      this.socket.emit('updateStealth', {gameName: this.gameName, stealth: isStealth})
    },
    toggleTeamActive(team) {
      team.include = !team.include
      this.socket.emit('updateTeamActive', {gameName: this.gameName, team: team})
    },
    toggleGameActive(game) {
      game.include = !game.include
      this.socket.emit('updateGameActive', {game: game})
    },
    deleteGame(game) {
      this.socket.emit('deleteGame', {game: game})
    },
    savePercentageBlocked: function() {
      const percentageBlocked = document.getElementById('percentageBlocked').value
      this.socket.emit('percentageBlocked', {gameName: this.gameName, percentageBlocked: percentageBlocked})
    },
    saveMvpCards: function() {
      const mvpCards = document.getElementById('mvpCards').value
      this.socket.emit('updateMvpCards', {gameName: this.gameName, mvpCards: parseInt(mvpCards)})
    },
    savePercentageDeployFail: function() {
      const percentageDeployFail = document.getElementById('percentageDeployFail').value
      this.socket.emit('percentageDeployFail', {gameName: this.gameName, percentageDeployFail: percentageDeployFail})
    },
    showTeamState(team) {
      return this.showGameState && team.include
    },
    estimates(team) {
      const proj = team.projectEstimate ? team.projectEstimate : '-'
      const mvp = team.mvpEstimate ? team.mvpEstimate : '-'
      const re = team.reEstimate ? team.reEstimate : '-'
      return proj + ' / ' + mvp + ' / ' + re
    },
    restartGame() {
      const restartGame = confirm('Are you sure you want to re-start this game?')
      if (restartGame) {
        this.socket.emit('restartGame', {gameName: this.gameName, stealth: this.stealth})
      }
    },
    effort(role) {
      return role.effort ? role.effort.available : '?'
    },
    roleClass(role) {
      return role.toLowerCase()
    }
  }
}
</script>

<style lang="scss">

   @import '../../assets/colours.scss';

  .connections {
    text-align: right;
  }

  .game-messaging, .game-params, .game-state, .games {

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

  .mvp-label {
    left: 0;
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

    .restart {
      position: relative;
      left: 6px;
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

    .member-role {
      width: 20px;
      position: relative;
      left: 2px;
      display: inline-block;
    }

    .designer {
      background-color: $design;
    }
    .developer {
      background-color: $develop;
    }
    .tester {
      background-color: $test;
    }
    .deployer {
      background-color: $deploy;
    }
  }

  .games {

    .games-table {
      border: none;
    }
  }
</style>
