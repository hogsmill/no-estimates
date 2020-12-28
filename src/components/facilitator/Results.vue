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

    <!-- Cycle Time -->

    <modal name="cycle-time" class="popup" :height="520" :width="750" :classes="['rounded']">
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

    <modal name="distribution" class="popup" :height="540" :width="750" :classes="['rounded']">
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

    <modal name="scatter-plot" class="popup" :height="520" :width="750" :classes="['rounded']">
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

    <modal name="monte-carlo" class="popup" :height="520" :width="750" :classes="['rounded']">
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
          Monte Carlo to go here...
        </p>
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
        'correlation',
        'cycle-time',
        'distribution',
        'scatter-plot',
        'monte-carlo'
      ],
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
    correlationPosition(value) {
      return parseInt(290 * (value + 1)) - 290 + 'px'
    },
    showCorrelation(data) {
      this.correlation = parseFloat(data.results)
      this.$modal.show('correlation')
    },
    showCycleTime(data) {
      this.cycleTime.data.datasets[0].backgroundColor = []
      for (let i = 0; i < data.results.effort.length; i++) {
        if (data.results.effort[i] < 15) {
          this.cycleTime.data.datasets[0].backgroundColor.push('green')
        } else if (data.results.effort[i] < 20) {
          this.cycleTime.data.datasets[0].backgroundColor.push('orange')
        } else {
          this.cycleTime.data.datasets[0].backgroundColor.push('red')
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
    showMonteCarlo(data) {
      console.log(data)
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

  .cycle-time {
    table {
      width: 50%;
      margin: 0 auto;
      td {
        width: 50px;
        text-align: right;
        padding: 2px 4px;
        &.small {
          background-color: green;
        }
        &.medium {
          background-color: orange;
        }
        &.large {
          background-color: red;
        }
      }
    }
  }
</style>
