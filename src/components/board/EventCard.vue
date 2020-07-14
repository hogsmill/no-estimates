<template>
  <div>

    <div id="event-card" :class="{'complete': currentEventCard === false}" @click="show()">
      <div v-if="currentEventCard !== false" class="event-card-number rounded-circle">{{currentEventCard.number}}</div>
      <div v-if="currentEventCard === false" class="event-card-number rounded-circle complete">0</div>
    </div>

    <modal name="event-card-popup" class="popup" :height="240" :classes="['rounded']">
      <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
      <h4>Event Card {{currentEventCard.number}}</h4>
      <p>{{currentEventCard.text}}</p>
      <div class="set-my-name">
        <button v-if="!currentEventCard.function" class="btn btn-sm btn-info" @click="done()">Done</button>
        <button v-if="currentEventCard.function" class="btn btn-sm btn-info" @click="doFunction()">Yes</button>
        <button v-if="currentEventCard.function" class="btn btn-sm btn-info" @click="done()">No</button>

      </div>
    </modal>

  </div>
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
    done() {
      this.socket.emit("updateCurrentDay", {gameName: this.gameName, teamName: this.teamName, currentDay: this.currentDay + 1})
      this.socket.emit("updateCurrentEventCard", {gameName: this.gameName, teamName: this.teamName, currentEventCard: this.currentEventCard.number})
      this.hide()
    },
    doFunction() {
      console.log("Doing '" + this.currentEventCard.function + "'")
      this.done()
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

<style>
  #event-card { margin: 26px auto 26px auto; width: 75%; height: 90px; background-image: url("../../assets/img/event-card-back.jpg"); background-size: contain; background-repeat: no-repeat}
  #event-card.complete { opacity: 0.5; }
  .event-card-number { width: 20px; position: relative; top: 50px; left: 54px; color: #fff; background-color: red; }
  .event-card-number.complete { color: red; }
  #event-card-popup { color: #444; }
</style>
