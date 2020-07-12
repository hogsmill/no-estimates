<template>
  <div class="card-deck">
    <div class="row days">
      <div class="days">
        <div class="days-label">Day</div>
        <div class="day rounded-circle" :class="getClass(day)" v-for="(day, index) in days()" :key="index">{{day}}</div>
        <button class="btn btn-sm btn-info" @click="next()">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  methods: {
    getClass(day) {
      if (day < this.currentDay) {
        return "passed"
      } else if (day == this.currentDay) {
        return "current"
      }
    },
    days() {
      var days = []
      for (var i = 1; i < this.numberOfDays + 1; i++) {
        days.push(i)
      }
      return days
    },
    next() {
      var columns = this.columns
      for (var i = 1; i < columns.length; i++) {
        for (var j = 0; j < columns[i].cards.length; j++) {
          columns[i].cards[j].blocked = Math.random() < 0.5
        }
      }
      this.socket.emit("updateColumns", {gameName: this.gameName, teamName: this.teamName, columns: columns})
      this.socket.emit("showEventCard", {gameName: this.gameName, teamName: this.teamName})
    }
  },
  computed: {
    numberOfDays() {
      return this.$store.getters.getNumberOfDays
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    columns() {
      return this.$store.getters.getColumns
    }
  },
  mounted() {
    this.socket.on("updateCurrentDay", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateCurrentDay", data)
      }
    })
  }
}
</script>

<style>
  .days { text-align: center; width: 100%; font-weight: bold; }
  .days-label { display: inline; padding-right: 12px; color: #fff; }
  .day { display: inline-block; width: 20px; }
  .day.passed { color: #888; }
  .day.current { background-color: #fff; color: blue; }
  .days button { margin: 4px; }
</style>
