<template>
  <div>

    <div id="event-card" :class="{'complete': !current}" @click="show()">
      <div v-if="current" class="event-card-number rounded-circle">{{current.number}}</div>
      <div v-if="!current" class="event-card-number rounded-circle complete">0</div>
    </div>

    <modal name="event-card-popup" class="popup" :height="240" :classes="['rounded']">
      <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
      <h4>Event Card {{current.number}}</h4>
      <p>{{current.text}}</p>
      <div class="set-my-name">
        <button class="btn btn-sm btn-info" @click="done()">Done</button>
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
      this.socket.emit("incrementDay", {gameName: this.gameName, teamName: this.teamName})
      this.socket.emit("incrementEventCard", {gameName: this.gameName, teamName: this.teamName})
      this.hide()
    }
  },
  computed: {
    current() {
      return this.$store.getters.getCurrentEventCard;
    }
  },
  mounted() {
    const self = this;
    this.socket.on("incrementEventCard", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        self.hide()
        this.$store.dispatch("incrementEventCard")
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
