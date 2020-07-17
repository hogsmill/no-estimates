<template>
  <div class="card-deck">
    <div class="row days">
      <div class="days">
        <div class="days-label">Day</div>
        <div class="day rounded-circle" :class="getClass(day)" v-for="(day, index) in days()" :key="index">{{day}}</div>
        <button class="btn btn-sm btn-info next" @click="next()">Next</button>
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
      var blocked = []
      for (var i = 1; i < columns.length; i++) {
        for (var j = 0; j < columns[i].cards.length; j++) {
          if (Math.random() < 0.5) {
            blocked.push(columns[i].cards[j].number)
          }
        }
      }
      this.socket.emit("updateQueues", {gameName: this.gameName, teamName: this.teamName, blocked: blocked})
      this.socket.emit("showEventCard", {gameName: this.gameName, teamName: this.teamName})
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
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

<style lang="scss">
  .days {
    text-align: center;
    width: 100%;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .days-label {
    display: inline;
    padding-right: 12px;
    color: #fff;
  }

  .day {
    display: inline-block;
    width: 20px;

    &.passed {
      color: #888;
    }

    &.current {
      background-color: #fff;
      color: blue;
    }

    button {
      margin: 4px;
    }
  }

  .next {
    margin-left: 12px; 
  }

</style>
