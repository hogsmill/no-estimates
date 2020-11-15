<template>
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
    }
  },
  methods: {
    setShowGameParams(val) {
      this.showGameParams = val
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
    }
  }
}
</script>

<style lang="scss">
  .mvp-label {
    left: 0;
  }
</style>
