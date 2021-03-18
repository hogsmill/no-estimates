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
      <td>Facilitator must start game: </td>
      <td colspan="3" class="left">
        <input type="checkbox" id="facilitator-starts" class="form-control" :checked="facilitatorStarts" @click="saveFacilitatorStarts()">
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td>Allow mobile?: </td>
      <td colspan="3" class="left">
        <input type="checkbox" id="allow-mobile" class="form-control" :checked="allowMobile" @click="saveAllowMobile()">
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td>Blocked frequency: </td>
      <td class="center">
        <input type="text" id="percentage-blocked" class="form-control" :value="percentageBlocked">
      </td>
      <td>x 10 out of every 10 cards (<em>Default: 0.05 - 1 in 20</em>)</td>
      <td class="center">
        <button class="btn btn-sm btn-site-primary" @click="savePercentageBlocked()">
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
        <button class="btn btn-sm btn-site-primary" @click="savePercentageDeployFail()">
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
        <button class="btn btn-sm btn-site-primary" @click="saveMvpCards()">
          Save
        </button>
        (<em>Default 11</em>)
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td class="left-col">
        Retros
      </td>
      <td class="left">
        <input id="do-retros" type="checkbox" :checked="doRetros" @click="toggleDoRetros()">
      </td>
      <td class="left">
        Every <input type="text" id="retro-days" class="form-control" :value="retroDays"> days,
      </td>
      <td class="center">
        <button class="btn btn-sm btn-site-primary" @click="saveRetroDays()">
          Save
        </button>
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td class="left-col">
        Retro Timer?
      </td>
      <td class="left">
        <input id="retro-timer" type="checkbox" :checked="retroTimer" @click="toggleRetroTimer()">
      </td>
      <td class="left">
        <input type="text" id="retro-time" class="form-control" :value="retroTime"> minutes
      </td>
      <td class="center">
        <button class="btn btn-sm btn-site-primary" @click="saveRetroTime()">
          Save
        </button>
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td class="left-col">
        Hosts
      </td>
      <td colspan="3" class="stealth">
        <input id="is-stealth" type="checkbox" :checked="stealth" @click="toggleStealth()"> Hosts are in "Stealth" mode?
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
import bus from '../../socket.js'

export default {
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
    facilitatorStarts() {
      return this.$store.getters.getFacilitatorStarts
    },
    allowMobile() {
      return this.$store.getters.getAllowMobile
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
    },
    retroTimer() {
      return this.$store.getters.getRetroTimer
    },
    retroTime() {
      return this.$store.getters.getRetroTime
    },
  },
  methods: {
    setShowGameParams(val) {
      this.showGameParams = val
    },
    toggleStealth() {
      const isStealth = document.getElementById('is-stealth').checked
      localStorage.setItem('stealth', isStealth)
      bus.$emit('sendUpdateStealth', {gameName: this.gameName, stealth: isStealth})
    },
    toggleDoRetros() {
      const doRetros = document.getElementById('do-retros').checked
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'doRetros', value: doRetros})
    },
    saveRetroDays() {
      const retroDays = document.getElementById('retro-days').value
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'retroDays', value: retroDays})
    },
    toggleRetroTimer() {
      const retroTimer = document.getElementById('retro-timer').checked
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'retroTimer', value: retroTimer})
    },
    saveRetroTime() {
      const retroTime = document.getElementById('retro-time').value
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'retroTime', value: retroTime})
    },
    toggleTeamActive(team) {
      const include = document.getElementById('team-active-' + team).checked
      bus.$emit('sendUpdateTeamActive', {gameName: this.gameName, teamName: team, include: include})
    },
    saveFacilitatorStarts() {
      const facilitatorStarts = document.getElementById('facilitator-starts').checked
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'facilitatorStarts', value: facilitatorStarts})
    },
    saveAllowMobile() {
      const allowMobile = document.getElementById('allow-mobile').checked
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'allowMobile', value: allowMobile})
    },
    savePercentageBlocked() {
      const percentageBlocked = document.getElementById('percentage-blocked').value
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'percentageBlocked', value: percentageBlocked})
    },
    saveMvpCards() {
      const mvpCards = document.getElementById('mvp-cards').value
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'mvpCards', value: parseInt(mvpCards)})
    },
    savePercentageDeployFail() {
      const percentageDeployFail = document.getElementById('percentage-deploy-fail').value
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'percentageDeployFail', value: percentageDeployFail})
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
  #facilitator-starts, #allow-mobile {
    margin: 0;
  }
  .mvp-label {
    left: 0;
  }
  #retro-days, #retro-time {
    display: inline-block;
  }
</style>
