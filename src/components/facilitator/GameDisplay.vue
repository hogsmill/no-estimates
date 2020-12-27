<template>
  <table class="games">
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
        Monte Carlo Simulation (TBD)
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
  }
}
</script>

<style lang="scss">

</style>
