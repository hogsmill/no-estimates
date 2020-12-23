<template>
  <table class="game-params">
    <tr>
      <td colspan="4">
        <h4>Game Params</h4>
        <i v-if="showGameParams" @click="setShowGameParams(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showGameParams" @click="setShowGameParams(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td>Blocked frequency: </td>
      <td class="center">
        <input type="text" id="percentage-blocked" class="form-control" :value="percentageBlocked">
      </td>
      <td>x 10 out of every 10 cards (<em>Default: 0.05 - 1 in 20</em>)</td>
      <td class="center">
        <button class="btn btn-sm btn-site-primary" @click="savePercentageBlocked">
          Save
        </button>
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td>Deployment fail: </td>
      <td class="center">
        <input type="text" id="percentage-deploy-fail" class="form-control" :value="percentageDeployFail">
      </td>
      <td>x 10 out of every 10 deployments  (<em>Default: 0.5 - 1 in 2</em>)</td>
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
        <input type="text" id="mvp-cards" class="form-control" :value="mvpCards">
      </td>
      <td colspan="2" class="left">
        <button class="btn btn-sm btn-site-primary" @click="saveMvpCards">
          Save
        </button>
        (<em>Default 11</em>)
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td class="left-col">
        Retros
      </td>
      <td class="center">
        <input id="do-retros" type="checkbox" :checked="doRetros" @click="toggleDoRetros()">
      </td>
      <td class="left">
        Every <input type="text" id="retro-days" class="form-control" :value="retroDays"> days
      </td>
      <td class="center">
        <button class="btn btn-sm btn-site-primary" @click="saveRetroDays()">
          Save
        </button>
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td class="left-col">
        Hosts
      </td>
      <td colspan="3" class="stealth">
        <input id="is-stealth" type="checkbox" :checked="stealth" @click="toggleStealth()"> Hosts are in "Stealth" mode? {{ stealth }}
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td class="left-col">
        Teams
      </td>
      <td colspan="3">
        <div v-for="(team, index) in teams" :key="index">
          <input :id="'team-active-' + team.name" type="checkbox" :checked="team.include" @click="toggleTeamActive(team.name)" :disabled="otherCards(team)"> {{ team.name }}
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showGameParams: false
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
    gameState() {
      return this.$store.getters.getGameState
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
    doRetros() {
      return this.$store.getters.getDoRetros
    },
    retroDays() {
      return this.$store.getters.getRetroDays
    }
  },
  methods: {
    setShowGameParams(val) {
      this.showGameParams = val
    },
    toggleStealth() {
      const isStealth = document.getElementById('is-stealth').checked
      localStorage.setItem('stealth', isStealth)
      this.socket.emit('updateStealth', {gameName: this.gameName, stealth: isStealth})
    },
    toggleDoRetros() {
      const doRetros = document.getElementById('do-retros').checked
      this.socket.emit('updateConfig', {gameName: this.gameName, field: 'doRetros', value: doRetros})
    },
    saveRetroDays: function() {
      const retroDays = document.getElementById('retro-days').value
      this.socket.emit('updateConfig', {gameName: this.gameName, field: 'retroDays', value: retroDays})
    },
    toggleTeamActive(team) {
      const include = document.getElementById('team-active-' + team).checked
      this.socket.emit('updateTeamActive', {gameName: this.gameName, teamName: team, include: include})
    },
    savePercentageBlocked: function() {
      const percentageBlocked = document.getElementById('percentage-blocked').value
      this.socket.emit('updateConfig', {gameName: this.gameName, field: 'percentageBlocked', value: percentageBlocked})
    },
    saveMvpCards: function() {
      const mvpCards = document.getElementById('mvp-cards').value
      this.socket.emit('updateConfig', {gameName: this.gameName, field: 'mvpCards', value: parseInt(mvpCards)})
    },
    savePercentageDeployFail: function() {
      const percentageDeployFail = document.getElementById('percentage-deploy-fail').value
      this.socket.emit('updateConfig', {gameName: this.gameName, field: 'percentageDeployFail', value: percentageDeployFail})
    },
    otherCards(team) {
      return this.gameState.find(function(t) {
        return t.name == team.name
      }).otherCards.length > 0
    }
  }
}
</script>

<style lang="scss">
  .mvp-label {
    left: 0;
  }
  #retro-days {
    display: inline-block;
  }
</style>
