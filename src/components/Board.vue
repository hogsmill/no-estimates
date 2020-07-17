<template>
  <div>
    <EventCard v-bind:socket="socket" />
    <div class="row game-board">
      <table class="board-table rounded">
        <thead>
          <tr>
            <th v-for="(column, index) in columns" :key="index">
              <div :class="column.name">{{columnDisplayName(column.name)}}</div>
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
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
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

    this.socket.on("updateQueues", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateQueues", data)
      }
    })

    this.socket.on("updateDependentTeam", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("updateDependentTeam", data)
      }
    })
  }
}
</script>

<style lang="scss">

  table.board-table {
    margin: 6px auto 18px auto;
    width: 90%;
    border: 1px solid;
    border-collapse:separate;
    border-spacing: 0px;
  }

  th, td {
    border: 1px solid;
    vertical-align: top
  }

</style>
