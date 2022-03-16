<template>
  <span>
    <button class="btn btn-sm btn-secondary smaller-font" :disabled="!gameName || !teamName" @click="showSetEstimates()">
      Set Estimates
    </button>
  </span>
</template>

<script>
import bus from '../socket.js'

export default {
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    }
  },
  created() {
    bus.on('showSetEstimates', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.show()
      }
    })
  },
  methods: {
    show() {
      this.$dispatch.show('showModal', 'setEstimates')
    }
  }
}
</script>
