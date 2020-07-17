<template>

  <modal name="event-card-popup" class="popup" :height="240" :classes="['rounded']">
    <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
    <h4>Event Card {{currentEventCard.number}}</h4>
    <p>{{currentEventCard.text}}</p>
    <div>
      <button v-if="!currentEventCard.function" class="btn btn-sm btn-info" @click="done()">Done</button>
      <button v-if="currentEventCard.function" class="btn btn-sm btn-info" @click="doFunction()">Yes</button>
      <button v-if="currentEventCard.function" class="btn btn-sm btn-info" @click="done()">No</button>
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
      var updateData = {gameName: this.gameName, teamName: this.teamName, currentDay: this.currentDay + 1}
      if (data) {
        for (var key in data) {
          updateData[key] = data[key]
        }
      }
      this.socket.emit("updateCurrentDay", updateData)
      this.socket.emit("updateCurrentEventCard", {gameName: this.gameName, teamName: this.teamName, currentEventCard: this.currentEventCard.number})
      this.hide()
    },
    doFunction() {
      var data
      switch(this.currentEventCard.function) {
        case 'Add 1 Point To Everyones Capacity':
          data = {capacity: 5}
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
