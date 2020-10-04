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
    this.$bus.$on('updatePersonEffort', function (data) {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        const column = stringFuns.properCase(data.column)
        this.setStatus(data.name.name + ' has added effort to card #' + data.workCard.number + ' in ' + column, false)
      }
    }.bind(this))
    this.$bus.$on('updatePersonAutoDeployEffort', function (data) {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.setStatus(data.name.name + ' has added Auto Deploy effort', false)
      }
    }.bind(this))
    this.$bus.$on('updateOtherTeamEffort', function (data) {
      if (this.gameName == data.gameName && this.teamName != data.teamName) {
        this.setStatus('Team ' + data.teamName + ' has added effort to card #' + data.card.number, false)
      }
    }.bind(this))
    this.$bus.$on('broadcastMessage', function (data) {
      if (this.gameName == data.gameName) {
        this.setStatus(data.message, true)
      }
    }.bind(this))
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
