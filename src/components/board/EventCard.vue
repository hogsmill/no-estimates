<template>

  <modal name="event-card-popup" class="popup" :height="240" :classes="['rounded']">
    <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
    <div v-if="!currentEventCard">
      <h4>We are now on Day {{currentDay + 1}}</h4>
      <button class="btn btn-sm btn-info" @click="done()">Done</button>
    </div>
    <div v-if="currentEventCard">
      <h4>Event Card {{currentEventCard.number}}</h4>
      <p v-html="currentEventCard.text"></p>
      <div>
        <button v-if="!currentEventCard || !currentEventCard.function" class="btn btn-sm btn-info" @click="done()">Done</button>
        <button v-if="currentEventCard.function && !currentEventCard.confirm" class="btn btn-sm btn-info" @click="doFunction()">Done</button>
        <button v-if="currentEventCard.function && currentEventCard.confirm" class="btn btn-sm btn-info" @click="doFunction()">Yes</button>
        <button v-if="currentEventCard.function && currentEventCard.confirm" class="btn btn-sm btn-info" @click="done()">No</button>
      </div>
    </div>
  </modal>

</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showing: false
    }
  },
  methods: {
    show() {
      this.socket.emit("showEventCard", {gameName: this.gameName, teamName: this.teamName})
    },
    hide() {
      this.$modal.hide('event-card-popup');
    },
    done(data) {
      this.hide()
      var updateData = {gameName: this.gameName, teamName: this.teamName, currentDay: this.currentDay + 1}
      if (data) {
        for (var key in data) {
          updateData[key] = data[key]
        }
      }
      if (this.currentEventCard) {
        if (this.currentEventCard.autoDeployCard) {
          updateData.canStartAutoDeploy = true
        }
        this.socket.emit("updateCurrentEventCard", {gameName: this.gameName, teamName: this.teamName, currentEventCard: this.currentEventCard.number})
      }
      this.socket.emit("updateCurrentDay", updateData)
    },
    doFunction() {
      var data
      switch(this.currentEventCard.function) {
        case 'Add 1 Point To Everyones Capacity':
          data = {capacity: 5}
          break
        case 'Add 8 points to Deploy':
          data = {autoDeploy: true}
          break
        case 'Concurrent Dev and Test':
          data = {concurrentDevAndTest: true}
          break
        case 'Lose Tester':
          data = {testCapacity: 2}
          break
        case 'Spend a Day Estimating':
          data = {capacity: 0}
          break
        case 'Have Paired':
          data = {extraEffortForPairing: true}
          break
        case 'Recharting':
          data = {recharting: true}
          break;
        case 'Deploy Dice':
          // TBD
          break
        default:
          console.log("Doing '" + this.currentEventCard.function + "' (not implemented)")
      }
      this.done(data)
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    currentEventCard() {
      return this.$store.getters.getCurrentEventCard;
    },
    currentDay() {
      return this.$store.getters.getCurrentDay;
    }
  },
  mounted() {
    const self = this;
    this.socket.on("updateCurrentEventCard", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        self.hide()
        this.$store.dispatch("updateCurrentEventCard", data)
      }
    })

    this.socket.on("showEventCard", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        self.$modal.show('event-card-popup');
      }
    })
  }
}
</script>

<style lang="scss">

  #event-card-popup {
    color: #444;
  }

</style>
