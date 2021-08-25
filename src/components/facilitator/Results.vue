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
            <div v-if="admin" class="source-show">
              <input type="checkbox" :checked="source.show" @click="showSourceOfVariation(source)">
            </div>
            <div v-if="!admin && source.show" class="source-show">
              <i class="fas fa-exclamation-circle" />
            </div>
            <div v-if="admin || source.show" class="source-name">
              {{ source.name }}
            </div>
          </div>
        </div>
      </div>
    </modal>

    <!-- Value Delivered -->

    <modal name="value-delivered" class="popup" :height="540" :width="920" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('value-delivered')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 value-delivered">
        <h4>
          Value Delivered per team <span v-if="currency">({{ currency.symbol }})</span>
        </h4>
        <div class="key">
          <div class="winner" />
          Winner
        </div>
        <div class="key">
          <div class="positive" />
          Positive
        </div>
        <div class="key">
          <div class="negative" />
          Negative
        </div>
        <div>
          <BarChart :chartdata="valueDelivered.data" :options="valueDelivered.options" />
        </div>
      </div>
    </modal>

    <!-- WIP -->

    <modal name="wip" class="popup" :height="520" :width="920" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('wip')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 wip">
        <h4>
          Team {{ selectedGraphTeam1 }} WIP Trend - No. of Cards in Play
          <span v-if="graphConfig.wip.useMovingAverage">(Moving Average,</span>
          <span v-if="!graphConfig.wip.useMovingAverage">(Raw Data,</span>
          <span v-if="graphConfig.wip.useDays"> per Day)</span>
          <span v-if="!graphConfig.wip.useDays"> per Move)</span>
        </h4>
        <div>
          Average: {{ wip.average }}
        </div>
        <div>
          <LineChart :chartdata="wip.data" :options="wip.options" />
        </div>
      </div>
    </modal>

    <!-- Cumulative Flow -->

    <modal name="cumulative-flow" class="popup" :height="520" :width="920" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('cumulative-flow')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 cumulative-flow">
        <h4>
          Team {{ selectedGraphTeam1 }} Cumulative Flow
          <span v-if="graphConfig.cumulativeFlow.useDays">(per Day)</span>
          <span v-if="!graphConfig.cumulativeFlow.useDays">(per Move)</span>
        </h4>
        <div>
          <BarChart :chartdata="cumulativeFlow.data" :options="cumulativeFlow.options" />
        </div>
      </div>
    </modal>

    <!-- Correlation -->

    <modal name="correlation" class="popup" :height="520" :width="920" :classes="['rounded']">
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
        <Correlation v-if="selectedGraphTeam1" :team="selectedGraphTeam1" :correlation="correlation1" />
        <Correlation v-if="selectedGraphTeam2" :team="selectedGraphTeam2" :correlation="correlation2" />
        <Correlation v-if="selectedGraphTeam3" :team="selectedGraphTeam3" :correlation="correlation3" />
      </div>
    </modal>

    <!-- Flow Efficiency (overall) -->

    <modal name="flow-efficiency" class="popup" :height="520" :width="920" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('flow-efficiency')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 flow-efficiency">
        <h4>
          Flow Efficiency
        </h4>
        <p>
          Ratio of days cards worked on / days cards worked on + days cards not worked on
        </p>
        <div class="flow-efficiency-labels">
          <div class="positive-flow-efficiency">
            Perfect flow
          </div>
          <div class="negative-flow-efficiency">
            Worst flow
          </div>
        </div>
        <FlowEfficiency v-if="selectedGraphTeam1" :team="selectedGraphTeam1" :flow-efficiency="flowEfficiency1" />
        <FlowEfficiency v-if="selectedGraphTeam2" :team="selectedGraphTeam2" :flow-efficiency="flowEfficiency2" />
        <FlowEfficiency v-if="selectedGraphTeam3" :team="selectedGraphTeam3" :flow-efficiency="flowEfficiency3" />
      </div>
    </modal>

    <!-- Flow Efficiency (selected cards) -->

    <modal name="flow-efficiency-cards" class="popup" :height="520" :width="920" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('flow-efficiency-cards')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 flow-efficiency">
        <h4>
          Flow Efficiency (Selected Cards, Team {{ selectedGraphTeam1 }})
        </h4>
        <div class="flow-efficiency-card-key">
          <div class="working-on" /> Worked On
          <div class="waiting" /> Waiting
        </div>
        <FlowEfficiencyCard :type="'Worst'" :card="flowEfficiencyCard1" />
        <FlowEfficiencyCard :type="'Best'" :card="flowEfficiencyCard2" />
        <FlowEfficiencyCard :type="'Longest in play'" :card="flowEfficiencyCard3" />
      </div>
    </modal>

    <!-- Cycle Time -->

    <modal name="cycle-time" class="popup" :height="520" :width="920" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('cycle-time')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 cycle-time">
        <h4>
          Team {{ selectedGraphTeam1 }} Cycle Time - Time to complete card in days
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

    <modal name="distribution" class="popup" :height="540" :width="920" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('distribution')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 cycle-time">
        <h4>
          Team {{ selectedGraphTeam1 }} Distribution
        </h4>
        <div>
          <BarChart :chartdata="distribution.data" :options="distribution.options" />
        </div>
      </div>
    </modal>

    <!-- Scatter Plot -->

    <modal name="scatter-plot" class="popup" :height="520" :width="920" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('scatter-plot')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 scatter-plot">
        <h4>
          Team {{ selectedGraphTeam1 }} Scatter Plot
        </h4>
        <p>
          <span class="key l75">75%</span> of cards completed in {{ scatterPlot.limits[75] }} days,
          <span class="key l90">90%</span> in {{ scatterPlot.limits[90] }} days,
          <span class="key l95">95%</span> in {{ scatterPlot.limits[95] }} days and
          <span class="key l99">99%</span> in {{ scatterPlot.limits[99] }} days
        </p>
        <div>
          <ScatterPlot :chartdata="scatterPlot.data" :options="scatterPlot.options" />
        </div>
        <div class="line l75" :style="{ 'top': scatterPlotLine(75) + 'px' }" />
        <div class="line l90" :style="{ 'top': scatterPlotLine(90) + 'px' }" />
        <div class="line l95" :style="{ 'top': scatterPlotLine(95) + 'px' }" />
        <div class="line l99" :style="{ 'top': scatterPlotLine(99) + 'px' }" />
      </div>
    </modal>

    <!-- Monte Carlo -->

    <modal name="monte-carlo" class="popup" :height="520" :width="920" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide('monte-carlo')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 monte-carlo">
        <h4>
          Team {{ selectedGraphTeam1 }} Monte Carlo: {{ parseInt(graphConfig.monteCarlo.runs).toLocaleString() }} runs to complete {{ monteCarloCards() }} cards
        </h4>
        <div class="estimates">
          <div v-if="graphConfig.monteCarlo.runTo == 'Remaining'">
            <span v-if="monteCarlo.projectEstimate">Initial Estimate: <b>{{ monteCarlo.projectEstimate }}</b> days</span>
            <span v-if="monteCarlo.reEstimate">- Re-estimate: <b>{{ monteCarlo.reEstimate }}</b> days</span>
          </div>
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
import bus from '../../socket.js'

import maths from '../../lib/maths.js'

import correlation from './graphConfig/correlation.js'
import wip from './graphConfig/wip.js'
import valueDelivered from './graphConfig/valueDelivered.js'
import cumulativeFlow from './graphConfig/cumulativeFlow.js'
import cycleTime from './graphConfig/cycleTime.js'
import distribution from './graphConfig/distribution.js'
import scatterPlot from './graphConfig/scatterPlot.js'
import monteCarlo from './graphConfig/monteCarlo.js'

import Correlation from './results/Correlation.vue'
import FlowEfficiency from './results/FlowEfficiency.vue'
import FlowEfficiencyCard from './results/FlowEfficiencyCard.vue'
import BarChart from './results/BarChart.vue'
import LineChart from './results/LineChart.vue'
import ScatterPlot from './results/ScatterPlot.vue'

export default {
  components: {
    Correlation,
    FlowEfficiency,
    FlowEfficiencyCard,
    BarChart,
    LineChart,
    ScatterPlot
  },
  data() {
    return {
      modals: [
        'sources-of-variation',
        'wip',
        'value-delivered',
        'cumulative-flow',
        'correlation',
        'flow-efficiency',
        'flow-efficiency-cards',
        'cycle-time',
        'distribution',
        'scatter-plot',
        'monte-carlo'
      ],
      correlation: correlation.config(),
      wip: wip.config(),
      valueDelivered: valueDelivered.config(),
      cumulativeFlow: cumulativeFlow.config(),
      cycleTime: cycleTime.config(),
      distribution: distribution.config(),
      scatterPlot: scatterPlot.config(),
      monteCarlo:monteCarlo.config(),

      correlation1: null,
      correlation2: null,
      correlation3: null,

      flowEfficiency1: null,
      flowEfficiency2: null,
      flowEfficiency3: null,

      flowEfficiencyCard1: null,
      flowEfficiencyCard2: null,
      flowEfficiencyCard3: null,

      scatterPlotCanvasTop: 80,
      scatterPlotCanvasBottom: 440
    }
  },
  computed: {
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
    sourcesOfVariation() {
      return this.$store.getters.getSourcesOfVariation
    },
    selectedGraphTeam1() {
      return this.$store.getters.getSelectedGraphTeam1
    },
    selectedGraphTeam2() {
      return this.$store.getters.getSelectedGraphTeam2
    },
    selectedGraphTeam3() {
      return this.$store.getters.getSelectedGraphTeam3
    }
  },
  created() {
    const self = this
    bus.$on('showResult', (data) => {
      if (this.hostId == data.hostId && data.target == 'game') {
        for (let i = 0; i < this.modals.length; i++) {
          self.hide(this.modals[i])
        }
        switch(data.result) {
          case 'sources-of-variation':
            self.showSourcesOfVariation(data)
            break
          case 'value-delivered':
            self.showValueDelivered(data)
            break
          case 'wip':
            self.showWip(data)
            break
          case 'cumulative-flow':
            self.showCumulativeFlow(data)
            break
          case 'correlation':
            self.showCorrelation(data)
            break
          case 'flow-efficiency':
            self.showFlowEfficiency(data)
            break
          case 'flow-efficiency-cards':
            self.showFlowEfficiencyCards(data)
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

    bus.$on('updateSourcesOfVariation', (data) => {
      if (this.gameName == data.gameName) {
        self.$store.dispatch('updateSourcesOfVariation', data.results)
      }
    })
  },
  methods: {
    hide(modal) {
      this.$modal.hide(modal)
    },
    max(list) {
      let max = 0
      for (let i = 0; i < list.length; i++) {
        if (list[i] > max) {
        max = list[i]
        }
      }
      return max
    },
    selectedGraphs() {

    },
    showSourcesOfVariation() {
      this.$modal.show('sources-of-variation')
    },
    showSourceOfVariation(source) {
      bus.$emit('sendShowSourceOfVariation', {gameName: this.gameName, source: source})
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
      this.$modal.show('value-delivered')
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
      this.$modal.show('wip')
    },
    showCumulativeFlow(data) {
      this.cumulativeFlow.data.labels = data.results.labels
      this.cumulativeFlow.data.datasets[0].data = data.results.cumulative.done
      this.cumulativeFlow.data.datasets[1].data = data.results.cumulative.deploy
      this.cumulativeFlow.data.datasets[2].data = data.results.cumulative.test
      this.cumulativeFlow.data.datasets[3].data = data.results.cumulative.develop
      this.cumulativeFlow.data.datasets[4].data = data.results.cumulative.design
      this.$modal.show('cumulative-flow')
    },
    showCorrelation(data) {
      if (this.selectedGraphTeam1) {
        this.correlation1 = parseFloat(data.results[0])
      }
      if (this.selectedGraphTeam2) {
        this.correlation2 = parseFloat(data.results[1])
      }
      if (this.selectedGraphTeam3) {
        this.correlation3 = parseFloat(data.results[2])
      }
      this.$modal.show('correlation')
    },
    showFlowEfficiency(data) {
      if (this.selectedGraphTeam1) {
        this.flowEfficiency1 = data.results[0] ? parseFloat(data.results[0]) : 0
      }
      if (this.selectedGraphTeam2) {
        this.flowEfficiency2 = data.results[1] ? parseFloat(data.results[1]) : 0
      }
      if (this.selectedGraphTeam3) {
        this.flowEfficiency3 = data.results[2] ? parseFloat(data.results[2]) : 0
      }
      this.$modal.show('flow-efficiency')
    },
    showFlowEfficiencyCards(data) {
      this.flowEfficiencyCard1 = data.results[0]
      this.flowEfficiencyCard2 = data.results[1]
      this.flowEfficiencyCard3 = data.results[2]
      this.$modal.show('flow-efficiency-cards')
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
    scatterPlotLine(n) {
      const range = this.scatterPlotCanvasBottom - this.scatterPlotCanvasTop
      const maxDay = maths.maxOfKey(this.scatterPlot.data.datasets[0].data, 'y')
      const h = maxDay - this.scatterPlot.limits[n]
      return (h / maxDay * range) + this.scatterPlotCanvasTop
    },
    showScatterPlot(data) {
      this.scatterPlot.data.datasets[0].data = data.results
      this.scatterPlot.limits = data.limits
      this.$modal.show('scatter-plot')
    },
    monteCarloCards() {
      let runTo
      if (this.graphConfig.monteCarlo.runTo == 'Remaining') {
        runTo = 'the remaining ' + this.monteCarlo.cardsLeft
      } else {
        runTo = this.graphConfig.monteCarlo.runTo
      }
      return runTo
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

  .scatter-plot {
    position: relative;

    .key {
      color:#fff;
      padding: 4px;
    }

    .line {
      height: 1px;
      color: #fff;
      border-style: dashed;
      width: 860px;
      margin-left: 24px;
      background-color: red;
      position: absolute;
      top: 10px;
    }

    .l75 {
      background-color: green;
    }
    .l90 {
      background-color: blue;
    }
    .l95 {
      background-color: purple;
    }
    .l99 {
      background-color: red;
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
