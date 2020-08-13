<template>

  <div class="work-card-back" :class="{'complete': currentWorkCard === false}" @click="pullInCard()">
    <div v-if="currentWorkCard !== false" class="stack-number rounded-circle">{{currentWorkCard + 1}}</div>
    <div v-if="currentWorkCard === false" class="stack-number rounded-circle complete">0</div>
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
        this.socket.emit("updateCommit", {gameName: this.gameName, teamName: this.teamName, workCard: currentWorkCard, commit: this.currentDay})
        this.socket.emit("updateColumns", {gameName: this.gameName, teamName: this.teamName, columns: columns})
        this.socket.emit("updateCurrentWorkCard", {gameName: this.gameName, teamName: this.teamName, currentWorkCard: currentWorkCard + 1})
        if (workCards[currentWorkCard].teamDependency > 0) {
          var dependentOn = this.selectDependentTeam()
          this.socket.emit("updateDependentTeam", {gameName: this.gameName, teamName: this.teamName, workCard: workCards[currentWorkCard], dependentOn: dependentOn})
        }
      }
    },
    selectDependentTeam() {
      // Make sure we don't pick our own team...
      var teams = []
      for (var i = 0; i < this.teams.length; i++) {
        if (this.teams[i].name != this.teamName) {
          teams.push(i)
        }
      }
      var index = teams[Math.floor(Math.random() * teams.length)]
      return this.teams[index]
    }
  },
  computed: {
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
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
    teams() {
      return this.$store.getters.getTeams
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

<style lang="scss">

  .work-card-back {
    margin: 6px;
    height: 100px;
    background-image: url("../../assets/img/work-card-back.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;

    &:hover {
      cursor: pointer;
    }

    &.complete {
      opacity: 0.5;
    }
    .stack-number {
      width: 20px;
      position: relative;
      top: 58px;
      margin: 0 auto;
      color: #fff;
      background-color: red;

      &.complete {
        color: red;
      }
    }
  }
</style>
