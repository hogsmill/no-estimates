<template>
  <tr>
    <td>
      Game Name
    </td>
    <td v-if="gameName && !change">
      <span class="setup-label">{{ gameName }}</span>
      <button class="btn btn-sm btn-secondary smaller-font setup-change" @click="changeGameName">
        &#128393;
      </button>
    </td>
    <td v-if="!gameName || change">
      <input type="text" id="game-name" class="form-control setup-input" :value="gameName">
      <button class="btn btn-sm btn-secondary smaller-font save-button" @click="saveGameName">
        Save
      </button>
    </td>
  </tr>
</template>

<script>
import stringFuns from '../../lib/stringFuns.js'

export default {
  data() {
    return {
      change: false
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
  methods: {
    changeGameName: function() {
      this.change = true
      this.$store.dispatch('settingUp', {setting: 'Game Name', value: true})
    },
    saveGameName: function() {
      let game = document.getElementById('game-name').value
      game = stringFuns.sanitize(game)
      if (game != '') {
        this.$store.dispatch('updateGameName', game)
        localStorage.setItem('gameName', game)
        if (game && this.teamName) {
          window.bus.$emit('loadGame', {gameName: this.gameName, teamName: this.teamName})
        }
      }
      this.change = false
      this.$store.dispatch('settingUp', {setting: 'Game Name', value: false})
    }
  }
}
</script>

<style lang="scss">

</style>
