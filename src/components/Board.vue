<template>
  <div class="board-container">
    <EventCard v-bind:socket="socket" />
    <div class="game-board">
      <table class="board-table rounded">
        <thead>
          <tr>
            <th v-for="(column, index) in columns" :key="index">
              <div :class="column.name">
                {{columnDisplayName(column.name)}}
                <span class="autoDeploy" v-if="showAutoDeploy(column)">&#10004;</span>
                <span class="canStartAutoDeploy rounded-circle" v-if="canStartAutoDeploy(column)" @click="startAutoDeploy()">&#10033;</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="(column, index) in columns" :key="index">
              <Column v-bind:column="column" v-bind:socket="socket" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import stringFuns from '../lib/stringFuns.js'

import EventCard from "./board/EventCard.vue";
import Column from "./board/Column.vue";

export default {
  components: {
    Column,
    EventCard
  },
  props: [
    'socket'
  ],
  methods: {
    columnDisplayName(s) {
      return stringFuns.properCase(s)
    },
    showAutoDeploy(column) {
      return this.teamName && this.myTeam.autoDeploy.done && column.name == 'deploy'
    },
    canStartAutoDeploy(column) {
      return this.teamName && !this.myTeam.autoDeploy.doing && !this.myTeam.autoDeploy.done && this.myTeam.canStartAutoDeploy && column.name == 'deploy'
    },
    startAutoDeploy() {
      this.socket.emit("startAutoDeploy", {gameName: this.gameName, teamName: this.teamName})
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    myTeam() {
      return this.$store.getters.getMyTeam
    },
    columns() {
      return this.$store.getters.getColumns;
    }
  },
  mounted() {
    this.socket.on("updateColumns", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateColumns", data)
      }
    })

    this.socket.on("updateDependentTeam", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("updateDependentTeam", data)
      }
    })

    this.socket.on("startAutoDeploy", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("startAutoDeploy", data)
      }
    })
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
