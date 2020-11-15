<template>
  <table class="games">
    <tr>
      <td class="left" colspan="16">
        <h4>Games</h4>
        <span v-if="showGames" @click="setShowGames(false)" title="collapse" class="toggle">&#9650;</span>
        <span v-if="!showGames" @click="setShowGames(true)" title="expand" class="toggle">&#9660;</span>
      </td>
    </tr>
    <tr v-if="showGames" class="header">
      <td>Games</td>
      <td>
        <table class="games-table">
          <thead>
            <th>Include?</th>
            <th>Game Name</th>
            <th />
          </thead>
          <tbody>
            <tr v-for="(game, index) in games" :key="index">
              <td>
                <input type="checkbox" :checked="game.include" @click="toggleGameActive(game)" :disabled="game.name == gameName">
              </td>
              <td>
                {{ game.name }}
              </td>
              <td>
                <button class="btn btn-sm btn-site-primary" @click="deleteGame(game.name)" :disabled="game.name == gameName">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showGames: false
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    games() {
      return this.$store.getters.getGames
    }
  },
  created() {
    this.socket.emit('getGames')
  },
  methods: {
    setShowGames(val) {
      this.showGames = val
    },
    toggleGameActive(game) {
      game.include = !game.include
      this.socket.emit('updateGameActive', {game: game})
    },
    deleteGame(game) {
      this.socket.emit('deleteGame', {game: game})
    }
  }
}
</script>
