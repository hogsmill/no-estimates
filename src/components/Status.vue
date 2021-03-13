<template>
  <div class="status">
    <div v-if="status && severity == 'urgent'" class="urgent">
      <i class="fas fa-exclamation-triangle" title="urgent" />
      {{ status }}
    </div>
    <div v-if="status && severity == 'info'" class="info">
      <i class="fas fa-info-circle" title="info" />
      {{ status }}
    </div>
    <div v-if="status && severity == 'hint'" class="hint">
      <i class="fas fa-smile-wink" title="hint" />
      {{ status }}
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

import stringFuns from '../lib/stringFuns.js'

export default {
  data() {
    return {
      status: '',
      severity: ''
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
    bus.$on('hint', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        self.setStatus(data.hint, 'hint')
      }
    })
    bus.$on('updatePersonEffort', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        const column = stringFuns.properCase(data.column)
        self.setStatus(data.name.name + ' has added effort to card #' + data.workCard.number + ' in ' + column, 'info')
      }
    })
    bus.$on('updatePersonAutoDeployEffort', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        self.setStatus(data.name.name + ' has added Auto Deploy effort', 'info')
      }
    })
    bus.$on('updateOtherTeamEffort', (data) => {
      if (this.gameName == data.gameName && this.teamName != data.teamName) {
        self.setStatus('Team ' + data.teamName + ' has added effort to card #' + data.card.number, 'info')
      }
    })
    bus.$on('broadcastMessage', (data) => {
      if (this.gameName == data.gameName) {
        if (data.sendTo == 'Everybody' || data.sendTo == this.teamName) {
          self.setStatus(data.message, 'urgent')
        }
      }
    })
  },
  methods: {
    setStatus(status, severity) {
      this.severity = severity
      this.status = status
    }
  }
}
</script>

<style lang="scss">
  .status {
    height: 20px;
    font-weight: bold;
    margin: 6px auto;
    width: 80%;

    .urgent {
      background-color: red;
      color: #fff;

      .fa-exclamation-triangle {
        color: yellow;
      }
    }
    .info {
      .fa-info-circle {
        color: royalblue;
      }
    }
    .hint {
      background-color: green;
      color: #fff;

      .fa-smile-wink {
        color: gold;
      }
    }
  }
</style>
