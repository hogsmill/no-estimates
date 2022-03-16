
<template>
  <span />
</template>

<script>
import bus from '../../socket.js'

import correlation from './graphConfig/correlation.js'
import wip from './graphConfig/wip.js'
import valueDelivered from './graphConfig/valueDelivered.js'
import cumulativeFlow from './graphConfig/cumulativeFlow.js'
import cycleTime from './graphConfig/cycleTime.js'
import distribution from './graphConfig/distribution.js'
import scatterPlot from './graphConfig/scatterPlot.js'
import monteCarlo from './graphConfig/monteCarlo.js'

export default {
  data() {
    return {
      correlation: correlation.config(),
      wip: wip.config(),
      valueDelivered: valueDelivered.config(),
      cumulativeFlow: cumulativeFlow.config(),
      cycleTime: cycleTime.config(),
      distribution: distribution.config(),
      scatterPlot: scatterPlot.config(),
      monteCarlo:monteCarlo.config(),

      correlations: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null
      },

      flowEfficiencies: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null
      },

      flowEfficiencyCard1: null,
      flowEfficiencyCard2: null,
      flowEfficiencyCard3: null,

      //scatterPlotCanvasTop: 80,
     //scatterPlotCanvasBottom: 440
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    admin() {
      return this.$store.getters.getAdmin
    },
    hostId() {
      return this.$store.getters.getHostId
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    currency() {
      return this.$store.getters.getCurrency
    },
    graphConfig() {
      return this.$store.getters.getGraphConfig
    },
    workCards() {
      return this.$store.getters.getWorkCards
    },
    noOfDoneCards() {
      return this.$store.getters.getNoOfDoneCards
    },
    selectedGraphTeams() {
      return this.$store.getters.getSelectedGraphTeams
    }
  },
  created() {

    bus.on('showResult', (data) => {
      if (this.hostId == data.hostId && data.target == 'game') {
        switch(data.result) {
          case 'sources-of-variation':
            this.showSourcesOfVariation(data)
            break
          case 'value-delivered':
            this.showValueDelivered(data)
            break
          case 'wip':
            this.showWip(data)
            break
          case 'cumulative-flow':
            this.showCumulativeFlow(data)
            break
          case 'correlation':
            this.showCorrelation(data)
            break
          case 'flow-efficiency':
            this.showFlowEfficiency(data)
            break
          case 'flow-efficiency-cards':
            this.showFlowEfficiencyCards(data)
            break
          case 'cycle-time':
            this.showCycleTime(data)
            break
          case 'distribution':
            this.showDistribution(data)
            break
          case 'scatter-plot':
            this.showScatterPlot(data)
            break
          case 'monte-carlo':
            this.showMonteCarlo(data)
            break
          default:
            console.log('Unknown result ', data.result)
        }
      }
    })

    bus.on('updateSourcesOfVariation', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateSourcesOfVariation', data.results)
      }
    })
  },
  methods: {
    max(list) {
      let max = 0
      for (let i = 0; i < list.length; i++) {
        if (list[i] > max) {
        max = list[i]
        }
      }
      return max
    },
    showSourcesOfVariation() {
      this.$store.dispatch('showResultModal', {modal: 'sourcesOfVariation'})
    },
    showValueDelivered(data) {
      this.valueDelivered.data.labels = data.results.teams
      this.valueDelivered.data.datasets[0].data = data.results.value
      this.valueDelivered.data.datasets[0].backgroundColor = []
      const max = this.max(data.results.value)
      for (let i = 0; i < data.results.value.length; i++) {
        if (data.results.value[i] == max) {
          this.valueDelivered.data.datasets[0].backgroundColor.push('gold')
        } else if (data.results.value[i] < 0) {
          this.valueDelivered.data.datasets[0].backgroundColor.push('lightcoral')
        } else {
          this.valueDelivered.data.datasets[0].backgroundColor.push('lightgreen')
        }
      }
      this.$store.dispatch('setModalData', this.valueDelivered)
      this.$store.dispatch('showResultModal', {modal: 'valueDelivered', data: this.valueDelivered})
    },
    showWip(data) {
      this.wip.average = data.results.average
      this.wip.data.datasets[0].borderColor = data.teamName.toLowerCase()
      if (this.graphConfig.wip.useMovingAverage) {
        this.wip.data.labels = data.results.labelsMovingAverage
        this.wip.data.datasets[0].data = data.results.wipMovingAverage
      } else {
        this.wip.data.labels = data.results.labels
        this.wip.data.datasets[0].data = data.results.wip
      }
      this.$store.dispatch('setModalData', this.wip)
      this.$store.dispatch('showResultModal', {modal: 'wip', data: this.wip})
    },
    showCumulativeFlow(data) {
      this.cumulativeFlow.data.labels = data.results.labels
      this.cumulativeFlow.data.datasets[0].data = data.results.cumulative.done
      this.cumulativeFlow.data.datasets[1].data = data.results.cumulative.deploy
      this.cumulativeFlow.data.datasets[2].data = data.results.cumulative.test
      this.cumulativeFlow.data.datasets[3].data = data.results.cumulative.develop
      this.cumulativeFlow.data.datasets[4].data = data.results.cumulative.design
      this.$store.dispatch('showResultModal', {modal: 'cumulativeFlow', data: this.cumulativeFlow})
    },
    showCorrelation(data) {
      for (let i = 0, j = 1; i < Object.keys(this.selectedGraphTeams).length; i++, j++) {
        if (this.selectedGraphTeams[j]) {
          this.correlations[j] = parseFloat(data.results[i])
        }
      }
      this.$store.dispatch('showResultModal', {modal: 'correlation', data: this.correlations})
    },
    showFlowEfficiency(data) {
      for (let i = 0, j=1; i<= Object.keys(this.selectedGraphTeams).length; i++, j++) {
        if (this.selectedGraphTeams[j]) {
          this.flowEfficiencies[j] = data.results[i] ? parseFloat(data.results[i]) : 0
        }
      }
      this.$store.dispatch('showResultModal', {modal: 'flowEfficiency', data: this.flowEfficiencies})
    },
    showFlowEfficiencyCards(data) {
      this.$store.dispatch('showResultModal', {modal: 'flowEfficiencyCards', data: data.results})
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
      this.$store.dispatch('showResultModal', {modal: 'cycleTime', data: this.cycleTime})
    },
    showDistribution(data) {
      this.distribution.data.labels = data.results.days
      this.distribution.data.datasets[0].data = data.results.counts
      this.$store.dispatch('showResultModal', {modal: 'distribution', data: this.distribution})
    },
    showScatterPlot(data) {
      this.scatterPlot.data.datasets[0].data = data.results
      this.scatterPlot.limits = data.limits
      this.$store.dispatch('showResultModal', {modal: 'scatterPlot', data: this.scatterPlot})
    },
    showMonteCarlo(data) {
      this.monteCarlo.projectEstimate = data.projectEstimate
      this.monteCarlo.reEstimate = data.reEstimate
      this.monteCarlo.cardsLeft = data.cardsLeft
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
      this.$store.dispatch('showResultModal', {modal: 'monteCarlo', data: this.monteCarlo})
    }
  }
}
</script>

<style lang="scss">

  canvas {
    height: 600px !important;
    width: 600px !important;
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

  .graphs-holder {
    height: 400px;
    overflow-y: scroll;
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
  }

  .value-delivered {
    .key {
      width: 200px;
      height: 20px;
      text-align: center;
      display: inline-block;

      div {
        height: 12px;
        width: 50px;
        margin-right: 4px;
        display: inline-block;

        &.winner {
          background-color: gold;
        }
        &.positive {
          background-color: lightgreen;
        }
        &.negative {
          background-color: lightcoral;
        }
      }
    }
  }

  .flow-efficiency {
    .flow-efficiency-labels {
      width: 640px;
      height: 24px;
      margin: 48px auto 0 auto;

      div {
        width: 200px;
        font-weight: bold;
      }
      .negative-flow-efficiency {
        text-align: left;
        float: left;
      }
      .positive-flow-efficiency {
        text-align: right;
        float: right;
      }
    }
  }

  .flow-efficiency-card-key {
    margin: 0 auto;

    div {
      height: 16px;
      width: 50px;
      display: inline-block;
      position: relative;
      top: 3px;

      &.working-on {
        background-color: #339933;
      }

      &.waiting {
        background-color:  #f5270d;
        margin-left: 32px;
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
