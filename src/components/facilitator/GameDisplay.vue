<template>
  <table class="game-display">
    <tr>
      <td class="left" colspan="16">
        <h4>Game Display</h4>
        <i v-if="showGameDisplay" @click="setShowGameDisplay(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showGameDisplay" @click="setShowGameDisplay(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showGameDisplay">
      <td rowspan="11" class="show-results-td">
        Show results
      </td>
      <td colspan="2">
        <button class="btn btn-sm btn-site-primary" @click="showGameResult('sources-of-variation')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('sources-of-variation')">
          Hide
        </button>
        Sources of Variation
      </td>
    </tr>
    <tr v-if="showGameDisplay">
      <td colspan="2">
        <button class="btn btn-sm btn-site-primary" @click="showAllTeamsResult('value-delivered')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('value-delivered')">
          Hide
        </button>
        Value Delivered
      </td>
    </tr>
    <tr v-if="showGameDisplay" class="header">
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showMultipleTeamsResult('correlation')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('correlation')">
          Hide
        </button>
        Correlation
      </td>
      <td>
        <Teams :multiple="true" :graph="'correlation'" />
      </td>
    </tr>
    <tr v-if="showGameDisplay" class="header">
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showMultipleTeamsResult('flow-efficiency')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('flow-efficiency')">
          Hide
        </button>
        Flow Efficiency (Overall)
      </td>
      <td>
        <Teams :multiple="true" :graph="'flow-efficiency'" />
      </td>
    </tr>
    <tr v-if="showGameDisplay">
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showSingleTeamResult('flow-efficiency-cards')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('flow-efficiency-cards')">
          Hide
        </button>
        Flow Efficiency (Selected cards)
      </td>
      <td>
        <Teams :multiple="false" :graph="'flow-efficiency-cards'" />
      </td>
    </tr>
    <tr v-if="showGameDisplay">
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showSingleTeamResult('wip')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('wip')">
          Hide
        </button>
        WIP
        <i v-if="showWipConfig" @click="setShowWipConfig(false)" title="collapse WIP config" class="fas fa-caret-up toggle config" />
        <i v-if="!showWipConfig" @click="setShowWipConfig(true)" title="expand WIP config" class="fas fa-caret-down toggle config" />
        <div v-if="showWipConfig" class="wip-config">
          <div>
            Data
            <input type="radio" name="wip-data-type" :checked="graphConfig.wip.useMovingAverage" @click="setWipUseMovingAverage(true)"> Moving Average
            <input type="radio" name="wip-data-type" :checked="!graphConfig.wip.useMovingAverage" @click="setWipUseMovingAverage(false)"> Raw
          </div>
          <div>
            Scope
            <input type="radio" name="wip-scope" :checked="graphConfig.wip.useDays" @click="setWipUseDays(true)"> Plot by day
            <input type="radio" name="wip-scope" :checked="!graphConfig.wip.useDays" @click="setWipUseDays(false)"> Plot by move
          </div>
        </div>
      </td>
      <td>
        <Teams :multiple="false" :graph="'wip'" />
      </td>
    </tr>
    <tr v-if="showGameDisplay">
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showSingleTeamResult('cumulative-flow')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('cumulative-flow')">
          Hide
        </button>
        Cumulative Flow
        <i v-if="showCumulativeFlowConfig" @click="setShowCumulativeFlowConfig(false)" title="collapse Cumulative Flow config" class="fas fa-caret-up toggle config" />
        <i v-if="!showCumulativeFlowConfig" @click="setShowCumulativeFlowConfig(true)" title="expand Cumulative Flow config" class="fas fa-caret-down toggle config" />
        <div v-if="showCumulativeFlowConfig" class="cumulative-flow-config">
          <div>
            Scope
            <input type="radio" name="cumulative-flow-scope" :checked="graphConfig.cumulativeFlow.useDays" @click="setCumulativeFlowUseDays(true)"> Plot by day
            <input type="radio" name="cumulative-flow-scope" :checked="!graphConfig.cumulativeFlow.useDays" @click="setCumulativeFlowUseDays(false)"> Plot by move
          </div>
        </div>
      </td>
      <td>
        <Teams :multiple="false" :graph="'cumulative-flow'" />
      </td>
    </tr>
    <tr v-if="showGameDisplay">
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showSingleTeamResult('cycle-time')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('cycle-time')">
          Hide
        </button>
        Cycle Time
        <i v-if="showCycleTimeConfig" @click="setShowCycleTimeConfig(false)" title="collapse cycle time config" class="fas fa-caret-up toggle config" />
        <i v-if="!showCycleTimeConfig" @click="setShowCycleTimeConfig(true)" title="expand cycle time config" class="fas fa-caret-down toggle config" />
        <div v-if="showCycleTimeConfig">
          <table class="card-sizes">
            <tr>
              <td>
                Small card size, less than
                <input type="text" id="card-size-medium" :value="graphConfig.cycleTime.medium">
                <button class="btn btn-sm btn-site-primary" @click="saveCardSize('medium')">
                  Save
                </button>
              </td>
            </tr>
            <tr>
              <td>
                Medium card size, {{ graphConfig.cycleTime.medium }} to
                <input type="text" id="card-size-large" :value="graphConfig.cycleTime.large">
                <button class="btn btn-sm btn-site-primary" @click="saveCardSize('large')">
                  Save
                </button>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                Large card size, greater than  {{ graphConfig.cycleTime.large }}
              </td>
            </tr>
          </table>
        </div>
      </td>
      <td>
        <Teams :multiple="false" :graph="'cycle-time'" />
      </td>
    </tr>
    <tr v-if="showGameDisplay">
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showSingleTeamResult('distribution')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('distribution')">
          Hide
        </button>
        Distribution
      </td>
      <td>
        <Teams :multiple="false" :graph="'distribution'" />
      </td>
    </tr>
    <tr v-if="showGameDisplay">
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showSingleTeamResult('scatter-plot')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('scatter-plot')">
          Hide
        </button>
        Scatter Plot
      </td>
      <td>
        <Teams :multiple="false" :graph="'scatter-plot'" />
      </td>
    </tr>
    <tr v-if="showGameDisplay">
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showSingleTeamResult('monte-carlo')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('monte-carlo')">
          Hide
        </button>
        Monte Carlo Simulation
        <i v-if="showMonteCarloConfig" @click="setShowMonteCarloConfig(false)" title="collapse Monte Carlo config" class="fas fa-caret-up toggle config" />
        <i v-if="!showMonteCarloConfig" @click="setShowMonteCarloConfig(true)" title="expand Monte Carlo config" class="fas fa-caret-down toggle config" />
        <div v-if="showMonteCarloConfig" class="monte-carlo-params">
          <table>
            <tr>
              <td rowspan="4">
                Run to
              </td>
            </tr>
            <tr>
              <td>
                <input type="radio" name="monte-carlo-run-to" id="run-to-remaining" :checked="graphConfig.monteCarlo.runTo == 'Remaining'" @click="saveMonteCarloRunTo('Remaining')">
                <span>Remaining cards</span>
              </td>
            </tr>
            <tr>
              <td>
                <input type="radio" name="monte-carlo-run-to" id="run-to-50" :checked="graphConfig.monteCarlo.runTo == '50'" @click="saveMonteCarloRunTo('50')">
                <span>50 cards</span>
              </td>
            </tr>
            <tr>
              <td>
                <input type="radio" name="monte-carlo-run-to" id="run-to-100" :checked="graphConfig.monteCarlo.runTo == '100'" @click="saveMonteCarloRunTo('100')">
                <span>100 cards</span>
              </td>
            </tr>
            <tr>
              <td>
                No. Of Runs
              </td>
              <td>
                <input type="text" id="monte-carlo-runs" :value="graphConfig.monteCarlo.runs">
                <button class="btn btn-sm btn-site-primary" @click="saveMonteCarloRuns()">
                  Save
                </button>
              </td>
            </tr>
          </table>
        </div>
      </td>
      <td>
        <Teams :multiple="false" :graph="'monte-carlo'" />
      </td>
    </tr>
  </table>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import bus from '../../socket.js'

import Teams from './teams/Teams.vue'

export default {
  components: {
    Teams
  },
  data() {
    return {
      showGameDisplay: false,
      showWipConfig: false,
      showCumulativeFlowConfig: false,
      showCycleTimeConfig: false,
      showMonteCarloConfig: false,
      id: ''
    }
  },
  computed: {
    hostId() {
      return this.$store.getters.getHostId
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    graphConfig() {
      return this.$store.getters.getGraphConfig
    },
    selectedGraphTeams() {
      return this.$store.getters.getSelectedGraphTeams
    }
  },
  created() {
    this.$store.dispatch('updateHostId', uuidv4())
  },
  methods: {
    setShowGameDisplay(val) {
      this.showGameDisplay = val
    },
    setShowCycleTimeConfig(val) {
      this.showCycleTimeConfig = val
    },
    setShowWipConfig(val) {
      this.showWipConfig = val
    },
    setShowCumulativeFlowConfig(val) {
      this.showCumulativeFlowConfig = val
    },
    setShowMonteCarloConfig(val) {
      this.showMonteCarloConfig = val
    },
    showGameResult(result) {
      bus.$emit('sendShowGameResult', {
        hostId: this.hostId,
        gameName: this.gameName,
        result: result,
        target: 'game'
      })
    },
    showAllTeamsResult(result) {
      bus.$emit('sendShowAllTeamsResult', {
        hostId: this.hostId,
        gameName: this.gameName,
        result: result,
        target: 'game'
      })
    },
    showSingleTeamResult(result) {
      bus.$emit('sendShowSingleTeamResult', {
        hostId: this.hostId,
        gameName: this.gameName,
        teamName: this.selectedGraphTeams[1],
        result: result,
        target: 'game'
      })
    },
    showMultipleTeamsResult(result) {
      let selected = 0
      for (let i = 0; i < Object.keys(this.selectedGraphTeams).length; i++) {
        if (this.selectedGraphTeams[i + 1]) {
          selected = selected + 1
        }
      }
      if (!selected) {
        alert('Please select 1 or more teams to display')
      } else {
        bus.$emit('sendShowMultipleTeamsResult', {
          hostId: this.hostId,
          gameName: this.gameName,
          teams: this.selectedGraphTeams,
          result: result,
          target: 'game'
        })
      }
    },
    hideResult(result) {
      this.$modal.hide(result)
    },
    setWipUseMovingAverage(val) {
      bus.$emit('sendSetWipUseMovingAverage', {gameName: this.gameName, value: val})
    },
    setWipUseDays(val) {
      bus.$emit('sendSetWipUseDays', {gameName: this.gameName, value: val})
    },
    setCumulativeFlowUseDays(val) {
      bus.$emit('sendSetCumulativeFlowUseDays', {gameName: this.gameName, value: val})
    },
    saveCardSize(size) {
      const val = document.getElementById('card-size-' + size).value
      bus.$emit('sendSetCardSize', {gameName: this.gameName, size: size, value: val})
    },
    saveMonteCarloRuns() {
      const runs = document.getElementById('monte-carlo-runs').value
      bus.$emit('sendSetMonteCarloRuns', {gameName: this.gameName, runs: runs})
    },
    saveMonteCarloRunTo(runTo) {
      bus.$emit('sendSetMonteCarloRunTo', {gameName: this.gameName, runTo: runTo})
    }
  }
}
</script>

<style lang="scss">
  .show-results-td {
    width: 110px;
  }

  .multiple {
    tr {
      td {
        border: none;
        text-align: center;
      }
    }
  }

  i.config {
    position: relative !important;
    left: 6px;
    top: 6px;
  }

  .wip-config, .cumulative-flow-config {
    padding: 6px 0 0 142px;

    input[type=radio] {
      width: 24px;
      position: relative;
      top: 6px;
      margin: 0 0 10px 24px;
    }
  }

  .card-sizes {

    td {
      text-align: right !important;
      border: none !important;

      input {
        width: 30px;
        text-align: center;
      }
      button {
        margin: 0 0 0 6px;
      }
    }
  }

  .monte-carlo-params {
    position: relative;
    left: 100px;

    table {
      width: 300px;

      td {
        border: none;

        input[type=radio] {
          width: 30px;
        }

        span {
          position: absolute;
          left: 40px;
        }
      }
    }

    button {
      margin-left: 6px;
    }
  }
</style>
