<template>
  <div class="status" :class="{ 'urgent': urgent }">
    {{ status }}
  </div>
</template>

<script>
import stringFuns from '../lib/stringFuns.js'

export default {
  data() {
    return {
      status: '',
      urgent: false
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    }
  },
  mounted() {
    const self = this
    window.bus.$on('updatePersonEffort', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        const column = stringFuns.properCase(data.column)
        self.setStatus(data.name.name + ' has added effort to card #' + data.workCard.number + ' in ' + column, false)
      }
    })
    window.bus.$on('updatePersonAutoDeployEffort', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        self.setStatus(data.name.name + ' has added Auto Deploy effort', false)
      }
    })
    window.bus.$on('updateOtherTeamEffort', (data) => {
      if (this.gameName == data.gameName) {
        self.setStatus('Team ' + data.teamName + ' has added effort to card #' + data.card.number, false)
      }
    })
    window.bus.$on('broadcastMessage', (data) => {
      if (this.gameName == data.gameName) {
        self.setStatus(data.message, true)
      }
    })
  },
  methods: {
    setStatus(status, urgent) {
      this.urgent = urgent
      this.status = status
    }
  }
}
</script>

<style lang="scss">
  .status {
    height: 20px;
    font-weight: bold;
    margin: 6px;

    &.urgent {
      background-color: red;
      color: #fff;
    }
  }
</style>
