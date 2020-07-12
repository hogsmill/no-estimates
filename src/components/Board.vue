<template>
  <div class="row">
    <div class="left">
      <EventCard v-bind:socket="socket" />
    </div>
    <div class="right">
      <div class="row game-board">
        <table class="board-table rounded">
          <thead>
            <tr>
              <th v-for="(column, index) in columns" :key="index">
                <div :class="column.name.toLowerCase()">{{column.name}}</div>
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
  </div>
</template>

<script>
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

    this.socket.on("updateBlocked", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateBlocked", data)
      }
    })
  }
}
</script>

<style>
  .left { width: 17%; }
  .right { width: 82%; }

  table.board-table { margin-bottom: 12px; width: 90%; border: 1px solid; border-collapse:separate; border-spacing: 0px; }
  th, td { border: 1px solid; vertical-align: top }
</style>
