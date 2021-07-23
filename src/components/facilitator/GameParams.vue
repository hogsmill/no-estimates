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
    <tr v-if="showGameParams && feature('wipLimits')">
      <td class="left-col">
        WIP Limits?
      </td>
      <td class="wip-limits">
        <input id="wip-limits" type="checkbox" :checked="config.wipLimits" @click="toggleWipLimits()">
      </td>
      <td colspan="2" class="wip-limits">
        <input name="wip-limits-type" id="wip-limits-hard" type="radio" :checked="config.wipLimitType == 'hard'" @click="toggleWipLimitType('hard')"> Hard<br>
        <input name="wip-limits-type" id="wip-limits-soft" type="radio" :checked="config.wipLimitType == 'soft'" @click="toggleWipLimitType('soft')"> Soft
      </td>
    </tr>
    <tr v-if="showGameParams && feature('splitColumns')">
      <td class="left-col">
        Split Columns?
      </td>
      <td colspan="3" class="wip-limits">
        <input id="split-columns" type="checkbox" :checked="config.splitColumns" @click="toggleSplitColumns()">
      </td>
    </tr>
    <tr v-if="showGameParams && feature('expediteLane')">
      <td class="left-col">
        Expedite Lane?
      </td>
      <td colspan="3" class="wip-limits">
        <input id="expedite-lane" type="checkbox" :checked="config.expediteLane" @click="toggleExpediteLane()">
      </td>
    </tr>
    <tr v-if="showGameParams && feature('autoMoveCompleteCards')">
      <td class="left-col">
        Move complete cards automatically?
      </td>
      <td colspan="3" class="wip-limits">
        <input id="auto-move-complete-cards" type="checkbox" :checked="config.autoMoveCompleteCards" @click="toggleAutoMoveCompleteCards()">
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td>Currency: </td>
      <td colspan="3" class="left">
        <select class="form-control" id="currency" @change="changeCurrency()">
          <option value="">
            -- Select --
          </option>
          <option v-for="(curr, index) in currencies" :key="index" :selected="curr.name == currency.name" :value="curr.name">
            {{ curr.symbol }} - {{ curr.name }}
          </option>
        </select>
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
        Stealth
      </td>
      <td colspan="3" class="stealth">
        <input id="is-stealth" type="checkbox" :checked="stealth" @click="toggleStealth()"> Admins are in "Stealth" mode?
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
    config() {
      return this.$store.getters.getConfig
    },
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
    currency() {
      return this.$store.getters.getCurrency
    },
    currencies() {
      return this.$store.getters.getCurrencies
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
    feature(feature) {
      return Object.keys(this.config).find(function(k) {
        return k == feature
      })
    },
    toggleStealth() {
      const isStealth = document.getElementById('is-stealth').checked
      localStorage.setItem('stealth', isStealth)
      bus.$emit('sendUpdateStealth', {gameName: this.gameName, stealth: isStealth})
    },
    toggleWipLimits() {
      const wipLimits = document.getElementById('wip-limits').checked
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'wipLimits', value: wipLimits})
    },
    toggleWipLimitType(wipLimitType) {
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'wipLimitType', value: wipLimitType})
    },
    toggleSplitColumns() {
      const splitColumns = document.getElementById('split-columns').checked
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'splitColumns', value: splitColumns})
    },
    toggleAutoMoveCompleteCards() {
      const autoMoveCompleteCards = document.getElementById('auto-move-complete-cards').checked
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'autoMoveCompleteCards', value: autoMoveCompleteCards})
    },
    toggleExpediteLane() {
      const expediteLane = document.getElementById('expedite-lane').checked
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'expediteLane', value: expediteLane})
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
    changeCurrency() {
      const currency = document.getElementById('currency').value
      bus.$emit('sendUpdateCurrency', {gameName: this.gameName, currency: currency})
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
      const _team = this.gameState.find(function(t) {
        return t.name == team.name
      })
      return _team ? _team.otherCards.length > 0 : []
    }
  }
}
</script>

<style lang="scss">
  #facilitator-starts, #allow-mobile {
    margin: 0;
  }
  #currency {
    width: 200px;
  }
  .mvp-label {
    left: 0;
  }
  #retro-days, #retro-time {
    display: inline-block;
  }
</style>
