<template>
  <div class="container about">
    <h1>No Estimates - <span v-if="stealth">(Stealth)</span> Facilitator View</h1>

    <div class="connections">
      Current server connections: {{ connections.connections }} / {{ connections.maxConnections }}
    </div>

    <GameMessaging :socket="socket" />
    <GameParams :socket="socket" />

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

    <Games :socket="socket" />

  </div>
</template>

<script>
import GameMessaging from './facilitator/GameMessaging.vue'
import GameParams from './facilitator/GameParams.vue'
import Games from './facilitator/Games.vue'
import OtherCards from './facilitator/OtherCards.vue'
import Column from './facilitator/Column.vue'

export default {
  components: {
    GameMessaging,
    GameParams,
    Games,
    OtherCards,
    Column
  },
  props: [
    'socket'
  ],
  data() {
    return {
      showGameState: true,
      showGames: false
    }
  },
  computed: {
    stealth() {
      return this.$store.getters.getStealth
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    connections() {
      return this.$store.getters.getConnections
    }
  },
  methods: {
    setShowGameState(val) {
      this.showGameState = val
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

   @import '../assets/colours.scss';

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
