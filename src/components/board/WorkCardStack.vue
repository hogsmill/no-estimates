<template>

  <div class="work-card-back" :class="{'complete': currentWorkCard === false}" @click="pullInCard()">
    <div v-if="currentWorkCard !== false" class="work-card-stack-number rounded-circle">{{currentWorkCard + 1}}</div>
    <div v-if="currentWorkCard === false" class="work-card-stack-number rounded-circle complete">0</div>
  </div>

</template>

<script>
export default {
  props: [
    'socket'
  ],
  methods: {
    pullInCard() {
      if (this.currentWorkCard !== false) {
        var currentWorkCard = this.currentWorkCard
        var workCards = this.workCards
        var columns = this.columns
        workCards[currentWorkCard].commit = this.currentDay
        columns[1].cards.push(workCards[currentWorkCard])
        this.socket.emit("updateColumns", {gameName: this.gameName, teamName: this.teamName, columns: columns})
        this.socket.emit("updateCurrentWorkCard", {gameName: this.gameName, teamName: this.teamName, currentWorkCard: currentWorkCard + 1})
      }
    }
  },
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    currentWorkCard() {
      return this.$store.getters.getCurrentWorkCard
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    columns() {
      return this.$store.getters.getColumns
    },
    workCards() {
      return this.$store.getters.getWorkCards
    }
  },
  mounted() {
    this.socket.on("updateCurrentWorkCard", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateCurrentWorkCard", data)
      }
    })
  }
}
</script>

<style>
  .work-card-back { margin: 6px; width: 100%; height: 100px; background-image: url("../../assets/img/work-card-back.png"); background-size: contain; background-repeat: no-repeat; }
  .work-card-back.complete { opacity: 0.5; }
  .work-card-stack-number { width: 20px; position: relative; top: 50px; left: 50px; color: #fff; background-color: red; }
  .work-card-stack-number.complete { color: red; }
</style>
