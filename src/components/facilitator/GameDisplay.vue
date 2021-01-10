<template>
  <table class="game-display">
    <tr>
      <td class="left" colspan="16">
        <h4>Game Display</h4>
        <i v-if="showGameDisplay" @click="setShowGameDisplay(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showGameDisplay" @click="setShowGameDisplay(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showGameDisplay" class="header">
      <td rowspan="5">
        Show results
      </td>
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showResult('correlation')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('correlation')">
          Hide
        </button>
        Correlation
      </td>
    </tr>
    <tr v-if="showGameDisplay">
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showResult('cycle-time')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('cycle-time')">
          Hide
        </button>
        Cycle Time
        <div>
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
    </tr>
    <tr v-if="showGameDisplay">
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showResult('distribution')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('distribution')">
          Hide
        </button>
        Distribution
      </td>
    </tr>
    <tr v-if="showGameDisplay">
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showResult('scatter-plot')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('scatter-plot')">
          Hide
        </button>
        Scatter Plot
      </td>
    </tr>
    <tr v-if="showGameDisplay">
      <td>
        <button class="btn btn-sm btn-site-primary" @click="showResult('monte-carlo')">
          Show
        </button>
        <button class="btn btn-sm btn-site-primary" @click="hideResult('monte-carlo')">
          Hide
        </button>
        Monte Carlo Simulation
        <div class="monte-carlo-params">
          <div class="param-title">
            Run to
          </div>
          <div class="run-to">
            <div>
              <input type="radio" name="monte-carlo-run-to" id="run-to-remaining" :checked="graphConfig.monteCarlo.runTo == 'Remaining'" @click="saveMonteCarloRunTo('Remaining')"> Remaining cards
            </div>
            <div>
              <input type="radio" name="monte-carlo-run-to" id="run-to-50" :checked="graphConfig.monteCarlo.runTo == '50'" @click="saveMonteCarloRunTo('50')"> 50 cards
            </div>
            <div>
              <input type="radio" name="monte-carlo-run-to" id="run-to-100" :checked="graphConfig.monteCarlo.runTo == '100'" @click="saveMonteCarloRunTo('100')"> 100 cards
            </div>
          </div>
          <div class="param-title">
            No. Of Runs
          </div>
          <div>
            <input type="text" id="monte-carlo-runs" :value="graphConfig.monteCarlo.runs">
            <button class="btn btn-sm btn-site-primary" @click="saveMonteCarloRuns()">
              Save
            </button>
          </div>
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
      showGameDisplay: false
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    graphConfig() {
      return this.$store.getters.getGraphConfig
    }
  },
  methods: {
    setShowGameDisplay(val) {
      this.showGameDisplay = val
    },
    showResult(result) {
      this.socket.emit('showResult', {gameName: this.gameName, result: result})
    },
    hideResult(result) {
      this.socket.emit('hideResult', {gameName: this.gameName, result: result})
    },
    saveCardSize(size) {
      const val = document.getElementById('card-size-' + size).value
      this.socket.emit('setCardSize', {gameName: this.gameName, size: size, value: val})
    },
    saveMonteCarloRuns() {
      const runs = document.getElementById('monte-carlo-runs').value
      this.socket.emit('setMonteCarloRuns', {gameName: this.gameName, runs: runs})
    },
    saveMonteCarloRunTo(runTo) {
      this.socket.emit('setMonteCarloRunTo', {gameName: this.gameName, runTo: runTo})
    }
  }
}
</script>

<style lang="scss">
  .card-sizes {
    margin-left: 80px;
    width: 50%;

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
    div {
      display: inline-block;
      width: 200px;
      padding: 3px;

      &.param-title {
        width: 330px;
        text-align: right;
        padding-right: 6px;
        vertical-align: top;
      }

      &.run-to {
        div {
          padding: 0;
        }
      }
    }

    button {
      margin-left: 6px;
    }
  }
</style>
