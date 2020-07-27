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
    this.socket.on("updatePersonAutoDeployEffort", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        self.setStatus(data.name + ' has added Auto Deploy effort')
      }
    })
    this.socket.on("updateOtherTeamEffort", (data) => {
      if (this.gameName == data.gameName) {
        self.setStatus('Team ' + data.teamName + ' has added effort to card #' + data.card.number)
      }
    })
  }
}
</script>

<style lang="scss">
  .status {
    height: 20px;
    font-weight: bold;
    margin: 6px;
  }
</style>
