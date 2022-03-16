<template>
  <table class="game-state">
    <tr>
      <td class="left" colspan="16">
        <h4>
          Game State: (Game: {{ gameName }})
          <i v-if="facilitatorStarts && !gameRunning && gameName" title="Start Game" @click="startGame()" class="fas fa-play-circle start" />
          <i v-if="facilitatorStarts && gameRunning && gameName" title="Game Started" @click="stopGame()" class="fas fa-stop-circle stop" />
          <i v-if="gameName" title="Restart Game" @click="restartGame()" class="fas fa-undo-alt restart" />
        </h4>
        <i v-if="showGameState" @click="setShowGameState(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showGameState" @click="setShowGameState(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showGameState" class="header">
      <td>Team</td>
      <td>
        <div class="white rounded-circle member-role designer" title="Designer">
          D
        </div>
        <div class="white rounded-circle member-role developer" title="Developer">
          D
        </div>
        <div class="white rounded-circle member-role tester" title="Tester">
          T
        </div>
        <div class="white rounded-circle member-role deployer" title="Deployer">
          D
        </div>
        <br>
        Members
        <br>
        <i v-if="!showMembers" class="fas fa-users" title="Show members" @click="unHideMembers()" />
        <i v-if="showMembers" class="fas fa-users-slash" title="Hide members" @click="hideMembers()" />
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
        <div v-if="showMembers">
          <div v-for="(member, m) in team.members" :key="m">
            <i v-if="member.disabled" class="far fa-square disable-member" :title="'Enable ' + member.name" @click="enableMember(member, team)" />
            <i v-if="!member.disabled" class="far fa-check-square disable-member" :title="'Disable ' + member.name" @click="disableMember(member, team)" />
            <i class="fas fa-minus-circle disable-member delete-member" :title="'Delete ' + member.name" @click="deleteMember(member, team)" />
            <b>{{ member.name }}</b>
            <div class="white rounded-circle member-role" :class="roleClass(member.role)" :title="roleString(member)">
              {{ effort(member) }}
            </div>
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
      <Column v-for="(column, colIndex) in columns" :key="colIndex" :show="showTeamState(team)" :column="team.columns[column.name]" :name="column.name" />
      <td v-if="showTeamState(team)">
        {{ estimates(team) }}
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../../socket.js'

import stringFuns from '../../lib/stringFuns.js'

import OtherCards from './gameState/OtherCards.vue'
import Column from './gameState/Column.vue'

export default {
  components: {
    OtherCards,
    Column
  },
  data() {
    return {
      showGameState: true,
      showMembers: true
    }
  },
  computed: {
    stealth() {
      return this.$store.getters.getStealth
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    facilitatorStarts() {
      return this.$store.getters.getFacilitatorStarts
    },
    gameRunning() {
      return this.$store.getters.getGameRunning
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    teams() {
      return this.$store.getters.getTeams
    },
    columns() {
      return this.$store.getters.getColumns
    }
  },
  methods: {
    setShowGameState(val) {
      this.showGameState = val
    },
    hideMembers() {
      this.showMembers = false
    },
    unHideMembers() {
      this.showMembers = true
    },
    showTeamState(team) {
      const include = this.teams.find(function(t) {
        return t.name == team.name
      }).include
      return this.showGameState && include
    },
    estimates(team) {
      const proj = team.projectEstimate ? team.projectEstimate : '-'
      const mvp = team.mvpEstimate ? team.mvpEstimate : '-'
      const re = team.reEstimate ? team.reEstimate : '-'
      return proj + ' / ' + mvp + ' / ' + re
    },
    startGame() {
      bus.emit('sendUpdateConfig', {gameName: this.gameName, field: 'gameRunning', value: true})
    },
    stopGame() {
      bus.emit('sendUpdateConfig', {gameName: this.gameName, field: 'gameRunning', value: false})
    },
    restartGame() {
      const restartGame = confirm('Are you sure you want to re-start this game?')
      if (restartGame) {
        bus.emit('sendRestartGame', {gameName: this.gameName, stealth: this.stealth})
      }
    },
    enableMember(member, team) {
      if (confirm('Enable ' + member.name + ' in team ' + team.name + '?')) {
        bus.emit('sendEnableMember', {gameName: this.gameName, teamName: team.name, member: member})
      }
    },
    disableMember(member, team) {
      if (confirm('Disable ' + member.name + ' in team ' + team.name + '?')) {
        bus.emit('sendDisableMember', {gameName: this.gameName, teamName: team.name, member: member})
      }
    },
    deleteMember(member, team) {
      if (confirm('Delete ' + member.name + ' from team ' + team.name + '?')) {
        bus.emit('sendDeleteMember', {gameName: this.gameName, teamName: team.name, member: member})
      }
    },
    effort(role) {
      return role.effort ? role.effort.available : '?'
    },
    roleClass(role) {
      return role.toLowerCase()
    },
    roleString(member) {
      return stringFuns.properCase(member.role)
    }
  }
}
</script>

<style lang="scss">

  @import '../../assets/colours.scss';

  .game-state {
    .header td {
      vertical-align: middle;
      text-align: center;
      font-weight: bold;

      .fa-users, .fa-users-slash {
        position: relative;
        color: #888;
        margin: 0 2px;
      }
    }

    .restart, .start, .stop {
      position: relative;
      left: 6px;
      top: 4px;
      color: #888;
      margin-right: 6px;

      &:hover {
        color: #111;
        cursor: pointer;
      }
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
      text-align: center;
    }

    .disable-member {
      position: initial;
      color: #888;
      opacity: 0.5;
      margin-right: 2px;

      &:hover {
        cursor: pointer;
        opacity: 1;
        color: #000;
      }
    }

    .delete-member {
      &:hover {
        color: red;
      }
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
</style>
