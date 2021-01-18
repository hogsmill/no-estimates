<template>
  <span>

    <!-- Sources of Variation -->

    <modal name="sources-of-variation" class="popup" :height="500" :width="400" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('sources-of-variation')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 correlation">
        <h4>
          Sources of Variation
        </h4>
      </div>
      <div class="sources">
        <div v-for="(source, index) in sourcesOfVariation" :key="index">
          <div class="source">
            <div v-if="isHost" class="source-show">
              <input type="checkbox" :checked="source.show" @click="showSourceOfVariation(source)">
            </div>
            <div v-if="!isHost && source.show" class="source-show">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div v-if="isHost || source.show" class="source-name">
              {{ source.name }}
            </div>
          </div>
        </div>
      </div>
    </modal>

    <!-- Correlation -->

    <modal name="correlation" class="popup" :height="280" :width="850" :classes="['rounded']">
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
            <div :style="{ 'left': correlationPosition(correlation, 0) }">
              {{ correlation }}
            </div>
            <div class="correlation-marker" :style="{ 'left': correlationPosition(correlation, 100) }">
              <i class="fas fa-caret-up" />
            </div>
          </div>
          <div class="correlation-label">
            +1
          </div>
        </div>
      </div>
    </modal>

    <!-- Cycle Time -->

    <modal name="cycle-time" class="popup" :height="520" :width="850" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('cycle-time')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 cycle-time">
        <h4>
          Cycle Time - Time to complete card in days
        </h4>
        <table>
          <tr>
            <td>Small: </td>
            <td class="small" />
            <td>Medium: </td>
            <td class="medium" />
            <td>Large: </td>
            <td class="large" />
          </tr>
        </table>
        <div>
          <BarChart :chartdata="cycleTime.data" :options="cycleTime.options" />
        </div>
      </div>
    </modal>

    <!-- Distribution -->

    <modal name="distribution" class="popup" :height="540" :width="850" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('distribution')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 cycle-time">
        <h4>
          Distribution
        </h4>
        <div>
          <BarChart :chartdata="distribution.data" :options="distribution.options" />
        </div>
      </div>
    </modal>

    <!-- Scatter Plot -->

    <modal name="scatter-plot" class="popup" :height="520" :width="850" :classes="['rounded']">
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
          75% of cards completed in {{ scatterPlot.limits[75] }} days,
          90% in {{ scatterPlot.limits[90] }} days,
          95% in {{ scatterPlot.limits[95] }} days and
          99% in {{ scatterPlot.limits[99] }} days
        </p>
        <div>
          <ScatterPlot :chartdata="scatterPlot.data" :options="scatterPlot.options" />
        </div>
      </div>
    </modal>

    <!-- Monte Carlo -->

    <modal name="monte-carlo" class="popup" :height="520" :width="850" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('monte-carlo')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 monte-carlo">
        <h4>
          Monte Carlo: {{ parseInt(graphConfig.monteCarlo.runs).toLocaleString() }} runs to complete {{ monteCarloCards() }} cards
        </h4>
        <div class="estimates">
          <div v-if="graphConfig.monteCarlo.runTo == 'Remaining'">Initial Estimate: <b>{{ projectEstimate }}</b> days, Re-estimate: <b>{{ reEstimate }}</b> days</div>
        </div>
        <div class="monte-carlo-percentiles rounded">
          Probability of completing cards:
          <ul>
            <li><div class="grey" /> 50% in <b>{{ monteCarlo.percentiles[50] }}</b> days </li>
            <li><div class="green" /> 75% in <b>{{ monteCarlo.percentiles[75] }}</b> days </li>
            <li><div class="orange" /> 90% in <b>{{ monteCarlo.percentiles[90] }}</b> days </li>
            <li><div class="yellow" /> 95% in <b>{{ monteCarlo.percentiles[95] }}</b> days </li>
            <li><div class="red" /> 99% in <b>{{ monteCarlo.percentiles[99] }}</b> days </li>
          </ul>
        </div>
        <div>
          <BarChart :chartdata="monteCarlo.data" :options="monteCarlo.options" />
        </div>
      </div>
    </modal>
  </span>
</template>

<script>
import BarChart from './results/BarChart.vue'
import ScatterPlot from './results/ScatterPlot.vue'

export default {
  components: {
    BarChart,
    ScatterPlot
  },
  props: [
    'socket'
  ],
  data() {
    return {
      modals: [
        'sources-of-variation',
        'correlation',
        'cycle-time',
        'distribution',
        'scatter-plot',
        'monte-carlo'
      ],
      sourcesOfVariation: [],
      correlation: 0,
      cycleTime: {
        data: {
          labels: [],
          datasets: [{
            backgroundColor: '',
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            data: []
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {beginAtZero: true},
              gridLines: {display: true}
            }],
            xAxes: [{
              gridLines: {display: false}
            }]
          },
          legend: {display: false},
          responsive: true,
          maintainAspectRatio: false
        }
      },
      distribution: {
        data: {
          labels: [],
          datasets: [{
            label: 'No. of Cards that took this many days',
            backgroundColor: '#f87979',
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            data: []
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {beginAtZero: true},
              gridLines: {display: true}
            }],
            xAxes: [{
              gridLines: {display: false}
            }]
          },
          legend: {display: true},
          responsive: true,
          maintainAspectRatio: false
        }
      },
      scatterPlot: {
        data: {
          labels: [],
          datasets: [{
            pointRadius: 8,
            pointHoverRadius: 12,
            backgroundColor: '#f87979',
            pointBackgroundColor: '#f87979',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            data: []
          }]
        },
        limits: {
          75: 0,
          90: 0,
          95: 0,
          99: 0
        },
        options: {
          scales: {
            xAxes: [{type: 'linear', position: 'bottom', ticks: {beginAtZero: true}}],
            yAxes: [{ticks: {beginAtZero: true}}]
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                return data.datasets[0].data[tooltipItem.index].label
              }
            }
          },
          legend: {display: false},
          responsive: true,
          maintainAspectRatio: false
        }
      },
      monteCarlo: {
        data: {
          labels: [],
          datasets: [{
            label: 'Number of times run completes in this many days',
            backgroundColor: '#f87979',
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            data: []
          }]
        },
        percentiles: {
          50: 0,
          75: 0,
          90: 0,
          95: 0,
          99: 0
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {beginAtZero: true},
              gridLines: {display: true}
            }],
            xAxes: [{
              gridLines: {display: false}
            }]
          },
          legend: {display: false},
          responsive: true,
          maintainAspectRatio: false
        }
      }
    }
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    graphConfig() {
      return this.$store.getters.getGraphConfig
    },
    projectEstimate() {
      return this.$store.getters.getProjectEstimate
    },
    reEstimate() {
      return this.$store.getters.getReEstimate
    },
    workCards() {
      return this.$store.getters.getWorkCards
    },
    noOfDoneCards() {
      return this.$store.getters.getNoOfDoneCards
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
          case 'sources-of-variation':
            self.showSourcesOfVariation(data)
            break
          case 'correlation':
            self.showCorrelation(data)
            break
          case 'cycle-time':
            self.showCycleTime(data)
            break
          case 'distribution':
            self.showDistribution(data)
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
    correlationPosition(value, n) {
      return parseInt(290 * (value + 1)) - 290 - n + 'px'
    },
    showSourcesOfVariation(data) {
      this.sourcesOfVariation = data.results
      this.$modal.show('sources-of-variation')
    },
    showSourceOfVariation(source) {
      this.socket.emit('showSourceOfVariation', {gameName: this.gameName, source: source})
    },
    showCorrelation(data) {
      this.correlation = parseFloat(data.results)
      this.$modal.show('correlation')
    },
    showCycleTime(data) {
      this.cycleTime.data.datasets[0].backgroundColor = []
      for (let i = 0; i < data.results.effort.length; i++) {
        if (data.results.effort[i] < this.graphConfig.cycleTime.medium) {
          this.cycleTime.data.datasets[0].backgroundColor.push('cadetblue')
        } else if (data.results.effort[i] < this.graphConfig.cycleTime.large) {
          this.cycleTime.data.datasets[0].backgroundColor.push('olive')
        } else {
          this.cycleTime.data.datasets[0].backgroundColor.push('darkorange')
        }
      }
      this.cycleTime.data.labels = data.results.ids
      this.cycleTime.data.datasets[0].data = data.results.days
      this.$modal.show('cycle-time')
    },
    showDistribution(data) {
      this.distribution.data.labels = data.results.days
      this.distribution.data.datasets[0].data = data.results.counts
      this.$modal.show('distribution')
    },
    showScatterPlot(data) {
      this.scatterPlot.data.datasets[0].data = data.results
      this.scatterPlot.limits = data.limits
      this.$modal.show('scatter-plot')
    },
    monteCarloCards() {
      let runTo
      if (this.graphConfig.monteCarlo.runTo == 'Remaining') {
        runTo = 'the remaining ' + parseInt(this.workCards.length - this.noOfDoneCards)
      } else {
        runTo = this.graphConfig.monteCarlo.runTo
      }
      return runTo
    },
    showMonteCarlo(data) {
      this.monteCarlo.data.labels = data.results.days
      this.monteCarlo.data.datasets[0].data = data.results.counts
      this.monteCarlo.percentiles = data.results.percentiles
      this.monteCarlo.data.datasets[0].backgroundColor = []
      const startDay = this.monteCarlo.data.labels[0]
      for (let i = startDay; i < this.monteCarlo.data.datasets[0].data.length + startDay; i++) {
        if (i <= data.results.percentiles[50]) {
          this.monteCarlo.data.datasets[0].backgroundColor.push('grey')
        } else if (i <= data.results.percentiles[75]) {
          this.monteCarlo.data.datasets[0].backgroundColor.push('green')
        } else if (i <= data.results.percentiles[90]) {
          this.monteCarlo.data.datasets[0].backgroundColor.push('orange')
        } else if (i <= data.results.percentiles[95]) {
          this.monteCarlo.data.datasets[0].backgroundColor.push('yellow')
        } else {
          this.monteCarlo.data.datasets[0].backgroundColor.push('red')
        }
      }
      this.$modal.show('monte-carlo')
    }
  }
}
</script>

<style lang="scss">

  canvas {
    margin: 0 auto;
  }

  .sources {
    margin-top: 32px;
  }

  .source {
    text-align: left;
    padding-left: 24px;

    div {
      display: inline-block;

      &.source-show {
        width: 40px;

        .fas {
          color: crimson;
        }
      }
    }
  }

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
          width: 100px;
          text-align: center;
          font-size: xx-large;
          font-weight: bold;
          color: #fff;
        }

        .correlation-marker {
          position: relative;
          top: 32px;
          font-size: xx-large;

          .fas {
            color: #888;
          }
        }
      }
    }
  }

  .cycle-time {
    table {
      width: 50%;
      margin: 0 auto;
      td {
        width: 50px;
        text-align: right;
        padding: 0 4px;
        &.small {
          background-color: cadetblue;
        }
        &.medium {
          background-color: olive;
        }
        &.large {
          background-color: darkorange;
        }
      }
    }
  }

  .monte-carlo {
    .estimates {
      height: 24px;
    }
  }

  .monte-carlo-percentiles {
    border: 1px solid #ddd;
    width: 240px;
    position: absolute;
    z-index: 10;
    background-color: #fff;
    left: 54px;
    top: 130px;
    box-shadow: 2px 2px 3px #aaa;

    li {
      text-align: left;

      div {
        height: 10px;
        width: 10px;
        display: inline-block;

        &.grey {
          background-color: #bbb;
        }
        &.green {
          background-color: green;
        }
        &.orange {
          background-color: orange;
        }
        &.yellow {
          background-color: yellow;
        }
        &.red {
          background-color: red;
        }
      }
    }
  }
</style>
