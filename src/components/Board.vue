<template>
  <div class="board-container">
    <EventCard :socket="socket" />
    <div class="game-board">
      <table class="board-table rounded">
        <thead>
          <tr>
            <th v-for="(column, index) in columns" :key="index">
              <div :class="column.name">
                <span class="concurrentDevAndTest" v-if="concurrentDevAndTestTest(column)" title="Concurrent Dev and Test Allowed">&#x021A4;</span>
                {{ columnDisplayName(column.name) }}
                <span class="concurrentDevAndTest" v-if="concurrentDevAndTestDev(column)" title="Concurrent Dev and Test Allowed">&#x021A6;</span>
                <span class="autoDeploy" v-if="showAutoDeploy(column)" title="Deployment is now automated">&#10004;</span>
                <span class="canStartAutoDeploy rounded-circle" v-if="canStartAutoDeploy(column)" @click="startAutoDeploy()">&#10033;</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="(column, index) in columns" :key="index">
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

import EventCard from './board/EventCard.vue'
import Column from './board/Column.vue'

export default {
  components: {
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
    capabilities() {
      return this.$store.getters.getCapabilities
    },
    columns() {
      return this.$store.getters.getColumns
    }
  },
  methods: {
    columnDisplayName(s) {
      return stringFuns.properCase(s)
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
