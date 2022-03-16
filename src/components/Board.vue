<template>
  <div class="board-container">
    <div class="game-board">
      <table class="board-table rounded">
        <thead>
          <tr v-if="capabilities.concurrentDevAndTest">
            <th>
              <div class="backlog">
                Backlog
              </div>
              <WipLabel />
            </th>
            <th v-for="(column, index) in headerColumns()" :key="index" :class="columnClass(column)" :colspan="devColumn(column)">
              <div v-if="column.name != 'develop'" :class="column.name">
                {{ columnDisplayName(column.name) }} ({{ column.cards.length }})
                <span class="autoDeploy" v-if="showAutoDeploy(column)" title="Deployment is now automated">&#10004;</span>
                <span class="canStartAutoDeploy rounded-circle" v-if="canStartAutoDeploy(column)" @click="startAutoDeploy()">&#10033;</span>
              </div>
              <div v-if="column.name == 'develop'" class="develop-test">
                {{ developTestHeader() }}
              </div>
              <WipHeader :column="column" />
            </th>
          </tr>
          <tr v-if="!capabilities.concurrentDevAndTest">
            <th>
              <div class="backlog">
                Backlog
              </div>
              <WipLabel />
            </th>
            <th v-for="(column, index) in columns" :key="index" :class="columnClass(column)">
              <div :class="column.name">
                {{ columnDisplayName(column.name) }} ({{ column.cards.length }})
                <span class="autoDeploy" v-if="showAutoDeploy(column)" title="Deployment is now automated">&#10004;</span>
                <span class="canStartAutoDeploy rounded-circle" v-if="canStartAutoDeploy(column)" @click="startAutoDeploy()">&#10033;</span>
              </div>
              <WipHeader :column="column" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td :rowspan="rowSpan()">
              <WorkCardStack />
              <OtherSkills />
              <OtherTeams v-if="teams.length > 1" />
            </td>
            <td v-for="(column, index) in columns" :key="index" :class="columnClass(column)">
              <div v-if="showHeader(rows[0])">
                {{ headerString(rows[0]) }}
              </div>
              <Column :column="column" :type="rows[0]" />
            </td>
          </tr>
          <tr v-if="rows.length > 1">
            <td v-for="(column, index) in columns" :key="index" :class="columnClass(column)">
              <div v-if="showHeader(rows[1])">
                {{ headerString(rows[1]) }}
              </div>
              <Column :column="column" :type="rows[1]" />
            </td>
          </tr>
          <tr v-if="rows.length > 2">
            <td v-for="(column, index) in columns" :key="index" :class="columnClass(column)">
              <div>
                {{ headerString(rows[2]) }}
              </div>
              <Column :column="column" :type="rows[2]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

import stringFuns from '../lib/stringFuns.js'

import OtherTeams from './board/OtherTeams.vue'
import OtherSkills from './board/OtherSkills.vue'
import WipLabel from './board/WipLabel.vue'
import WipHeader from './board/WipHeader.vue'
import WorkCardStack from './board/WorkCardStack.vue'
import Column from './board/Column.vue'

export default {
  components: {
    OtherTeams,
    OtherSkills,
    WipLabel,
    WipHeader,
    WorkCardStack,
    Column
  },
  data() {
    return {
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
            y: {
              beginAtZero: true,
              gridLines: {display: true}
            },
            x: {
              gridLines: {display: false}
            }
          },
          plugins: {
            legend: {
              display: false
            }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    }
  },
  computed: {
    config() {
      return this.$store.getters.getConfig
    },
    rows() {
      return this.$store.getters.getRows
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    teams() {
      return this.$store.getters.getActiveTeams
    },
    capabilities() {
      return this.$store.getters.getCapabilities
    },
    columns() {
      return this.$store.getters.getColumns
    },
    currentEventCard() {
      return this.$store.getters.getCurrentEventCard
    },
    graphConfig() {
      return this.$store.getters.getGraphConfig
    }
  },
  created() {
    bus.on('showEventCard', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        if (this.currentEventCard.function == 'Show Cycle Time') {
          bus.emit('sendShowSingleTeamResult', {gameName: this.gameName, teamName: this.teamName, result: 'cycle-time', target: 'event-card'})
        } else {
          this.$store.dispatch('showModal', 'eventCard')
        }
      }
    })

    bus.on('showResult', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName && data.target == 'event-card') {
        switch(data.result) {
          case 'cycle-time':
            this.setCycleTimeData(data)
            break
        }
      }
    })
  },
  methods: {
    columnClass(column) {
      let classStr = ''
      if (this.capabilities.concurrentDevAndTest && column.name == 'develop') {
        classStr = 'dotted-right'
      }
      if (this.capabilities.concurrentDevAndTest && column.name == 'test') {
        classStr = 'dotted-left'
      }
      if (column.type) {
        classStr = classStr + 'column-' + column.type
      }
      if (column.wipLimit && column.cards.length > column.wipLimit) {
        classStr = classStr = ' over-wip'
      }
      return classStr
    },
    rowSpan() {
      let rowSpan = 1
      if (this.config.expediteLane) {
        rowSpan = rowSpan + 1
      }
      if (this.config.splitColumns) {
        rowSpan = rowSpan + 1
      }
      return rowSpan
    },
    columnDisplayName(s) {
      return stringFuns.properCase(s)
    },
    showHeader(column) {
      return column == 'expeditedone' || column == 'done' ||
             column == 'expeditedoing' || column == 'doing'
    },
    headerString(column) {
      let str = ''
      if (column == 'expeditedone' || column == 'done') {
        str = 'Done'
      }
      if (column == 'expeditedoing' || column == 'doing') {
        str = 'Doing'
      }
      return str
    },
    developTestHeader() {
      const devCards = this.columns.find(function(c) {
        return c.name == 'develop'
      }).cards.length
      const testCards = this.columns.find(function(c) {
        return c.name == 'test'
      }).cards.length
      return 'Develop (' + devCards + ') / Test (' + testCards + ')'
    },
    headerColumns() {
      const columns = []
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].name != 'test') {
          columns.push(this.columns[i])
        }
      }
      return columns
    },
    devColumn(column) {
      return column.name == 'develop' ? 2 : 1
    },
    concurrentDevAndTestDev(column) {
      return this.teamName && this.capabilities.concurrentDevAndTest && column.name == 'develop'
    },
    concurrentDevAndTestTest(column) {
      return this.teamName && this.capabilities.concurrentDevAndTest && column.name == 'test'
    },
    showAutoDeploy(column) {
      return this.teamName && this.capabilities.autoDeploy.done && column.name == 'deploy'
    },
    canStartAutoDeploy(column) {
      return this.teamName && !this.capabilities.autoDeploy.doing &&
        !this.capabilities.autoDeploy.done && this.capabilities.canStartAutoDeploy &&
        column.name == 'deploy'
    },
    startAutoDeploy() {
      bus.emit('sendStartAutoDeploy', {gameName: this.gameName, teamName: this.teamName})
    },
    setCycleTimeData(data) {
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
      this.$store.dispatch('showResultModal', {modal: 'eventGraph', data: this.cycleTime})
    }
  }
}
</script>

<style lang="scss">

  .board-container {
    padding-bottom: 12px;
  }

  table.board-table {
    margin: 6px auto 18px auto;
    width: 90%;
    border: 1px solid;
    border-collapse:separate;
    border-spacing: 0px;

    th, td {
      border: 1px solid;
      vertical-align: top;
      width: 16%;
    }

    .dotted-left {
      border-left-style: none;
    }

    .dotted-right {
      border-right-style: none;
    }

    .develop-test {
      background-image: linear-gradient(45deg, #76a001 25%, #0067b1 25%, #0067b1 50%, #76a001 50%, #76a001 75%, #0067b1 75%, #0067b1 100%);
      background-size: 50px 50px;
    }

    .autoDeploy {
      color: gold;
    }

    .canStartAutoDeploy {
      background-color: #fff;
      color: purple;
      font-weight: bold;
      padding: 1px 4px;
    }

  }

  td {
    &.over-wip {
      background-color: red;
    }
  }

</style>
