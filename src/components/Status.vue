<template>
  <div class="status">{{status}}</div>
</template>

<script>
import stringFuns from '../lib/stringFuns.js'

export default {
  props: [
    'socket'
  ],
  data() {
    return {
      status: ''
    }
  },
  methods: {
    setStatus(status) {
      this.status = status
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
  },
  mounted() {
    const self = this
    this.socket.on("updatePersonEffort", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        var column = stringFuns.properCase(data.column)
        self.setStatus(data.name + ' has added effort to card #' + data.workCard.number + ' in ' + column)
      }
    })
  }
}
</script>

<style>
  .status { height: 20px; }
</style>
