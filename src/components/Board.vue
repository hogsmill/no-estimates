<template>
  <div class="board-container">
    <EventCard :socket="socket" />
    <div class="game-board">
      <table class="board-table rounded">
        <thead>
          <tr v-if="capabilities.concurrentDevAndTest">
            <th>
              <div class="options">
                Options
              </div>
            </th>
            <th v-for="(column, index) in headerColumns()" :key="index" :class="columnClass(column)" :colspan="devColumn(column)">
              <div v-if="column.name != 'develop'" :class="column.name">
                {{ columnDisplayName(column.name) }}
                <span class="autoDeploy" v-if="showAutoDeploy(column)" title="Deployment is now automated">&#10004;</span>
                <span class="canStartAutoDeploy rounded-circle" v-if="canStartAutoDeploy(column)" @click="startAutoDeploy()">&#10033;</span>
              </div>
              <div v-if="column.name == 'develop'" class="develop-test">
                Develop / Test
              </div>
            </th>
          </tr>
          <tr v-if="!capabilities.concurrentDevAndTest">
            <th>
              <div class="options">
                Options
              </div>
            </th>
            <th v-for="(column, index) in columns" :key="index" :class="columnClass(column)">
              <div :class="column.name">
                {{ columnDisplayName(column.name) }} ({{ column.cards.length }})
                <span class="autoDeploy" v-if="showAutoDeploy(column)" title="Deployment is now automated">&#10004;</span>
                <span class="canStartAutoDeploy rounded-circle" v-if="canStartAutoDeploy(column)" @click="startAutoDeploy()">&#10033;</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <WorkCardStack :socket="socket" />
              <OtherSkills />
              <OtherTeams v-if="teams.length > 1" :socket="socket" />
            </td>
            <td v-for="(column, index) in columns" :key="index" :class="columnClass(column)">
              <Column :column="column" :socket="socket" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import stringFuns from '../lib/stringFuns.js'

import OtherTeams from './board/OtherTeams.vue'
import OtherSkills from './board/OtherSkills.vue'
import WorkCardStack from './board/WorkCardStack.vue'
import EventCard from './board/EventCard.vue'
import Column from './board/Column.vue'

export default {
  components: {
    OtherTeams,
    OtherSkills,
    WorkCardStack,
    Column,
    EventCard
  },
  props: [
    'socket'
  ],
  computed: {
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
    }
  },
  methods: {
    columnClass(column) {
      let colClass
      if (this.capabilities.concurrentDevAndTest && column.name == 'develop') {
        colClass = 'dotted-right'
      }
      if (this.capabilities.concurrentDevAndTest && column.name == 'test') {
        colClass = 'dotted-left'
      }
      return colClass
    },
    columnDisplayName(s) {
      return stringFuns.properCase(s)
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
      this.socket.emit('startAutoDeploy', {gameName: this.gameName, teamName: this.teamName})
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

</style>
