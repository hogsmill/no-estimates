<template>
  <span>

    <!-- Correlation -->

    <modal name="correlation" class="popup" :height="280" :width="750" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('correlation')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 correlation">
        <h4>
          Correlation
        </h4>
        <p>
          Correlation between Effort and Delivery Time:
        </p>
        <div class="correlation-labels">
          <div class="positive-correlation">
            Perfect correlation
          </div>
          <div class="negative-correlation">
            Perfect negative correlation
          </div>
          <div class="no-correlation">
            No correlation
          </div>
        </div>
        <div class="correlation-holder">
          <div class="correlation-label">
            -1
          </div>
          <div class="correlation-div rounded">
            <div :style="{ 'left': correlationPosition(correlation) }">
              {{ correlation }}
            </div>
          </div>
          <div class="correlation-label">
            +1
          </div>
        </div>
      </div>
    </modal>

    <!-- Scatter Plot -->

    <modal name="scatter-plot" class="popup" :height="190" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('scatter-plot')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 scatter-plot">
        <h4>
          Scatter Plot
        </h4>
        <p>
          scatter plot here
        </p>
      </div>
    </modal>

    <!-- Monte Carlo -->

    <modal name="monte-carlo" class="popup" :height="190" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('monte-carlo')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 monte-carlo">
        <h4>
          Monte Carlo
        </h4>
        <p>
          monte carlo here
        </p>
      </div>
    </modal>
  </span>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      modals: [
        'correlation',
        'scatterPlot',
        'monteCarlo'
      ],
      correlation: 0,
      scatterPlot: [],
      monteCarlo: 'zzz'
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    }
  },
  created() {
    const self = this
    this.socket.on('showResult', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        for (let i = 0; i < this.modals.length; i++) {
          self.hide(this.modals[i])
        }
        switch(data.result) {
          case 'correlation':
            self.showCorrelation(data)
            break
          case 'scatter-plot':
            self.showScatterPlot(data)
            break
          case 'monte-carlo':
            self.showMonteCarlo(data)
            break
          default:
            console.log('Unknown result ', data.result)
        }
      }
    })

    this.socket.on('hideResult', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        self.hide(data.result)
      }
    })
  },
  methods: {
    hide(modal) {
      this.$modal.hide(modal)
    },
    correlationPosition(value) {
      return parseInt(290 * (value + 1)) - 290 + 'px'
    },
    showCorrelation(data) {
      this.correlation = data.results
      this.$modal.show('correlation')
    },
    showScatterPlot(data) {
      this.scatterPlot = data.results
      this.$modal.show('scatter-plot')
    },
    showMonteCarlo(data) {
      this.monteCarlo = data.results
      this.$modal.show('monte-carlo')
    }
  }
}
</script>

<style lang="scss">

  .correlation {
    .correlation-labels {
      width: 640px;
      height: 24px;
      margin: 48px auto 0 auto;

      div {
        width: 200px;
        font-weight: bold;
      }
      .negative-correlation {
        text-align: left;
        float: left;
      }
      .no-correlation {
        text-align: center;
        margin: 0 auto;
      }
      .positive-correlation {
        text-align: right;
        float: right;
      }
    }
    .correlation-holder {

      div {
        display: inline-block;
      }
      .correlation-label {
        width: 20px;
        text-align: center;
        position: relative;
        top: -8px;
      }
      .correlation-div {
        width: 600px;
        margin: 0 auto;
        position: relative;
        background: rgb(245,39,13);
        background: linear-gradient(90deg, rgba(245,39,13,1) 0%, rgba(100,210,12,1) 100%);

        div {
          position: relative;
          width: 20px;
          text-align: center;
          font-size: xx-large;
          font-weight: bold;
          color: #fff;
        }
      }
    }
  }
</style>
