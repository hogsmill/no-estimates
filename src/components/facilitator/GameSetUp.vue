<template>
  <table class="game-set-up">
    <tr>
      <td colspan="4">
        <h4>Game Set Up</h4>
        <i v-if="showGameSetUp" @click="setShowGameSetUp(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showGameSetUp" @click="setShowGameSetUp(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showGameSetUp">
      <td>PLayers join by:</td>
      <td colspan="3" class="left">
        <input type="checkbox" id="players-join-by-selecting" class="form-control" :checked="config.playersJoinBy == 'selecting'" @click="playersJoinBy('selecting')">
        <input type="checkbox" id="players-join-by-typing" class="form-control" :checked="config.playersJoinBy == 'typing'" @click="playersJoinBy('typing')">
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../../socket.js'

export default {
  data() {
    return {
      showGameSetUp: false
    }
  },
  computed: {
    config() {
      return this.$store.getters.getConfig
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  methods: {
    setShowGameSetUp(val) {
      this.showGameSetUp = val
    },
    playersJoinBy(val) {
      bus.$emit('sendPlayersJoinBy', {gameName: this.gameName, playersJoinBy: val})
    }
  }
}
</script>
