<template>
  <div class="game-name" v-if="!showFacilitator">
    <div class="game-name text-right">
      <button class="btn btn-sm btn-secondary smaller-font" v-if="!gameName" @click="show">
        Set Game Name
      </button>
      <span v-if="gameName" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">Game: {{ gameName }}</span>
    </div>

    <modal name="set-game-name" :height="120" class="rounded">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Enter Your Game Name</h4>
        <div class="set-game-name">
          <input type="text" id="game-name" class="form-control">
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveGameName">
            Save
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import stringFuns from '../lib/stringFuns.js'

export default {
  computed: {
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  mounted() {
    window.bus.$on('restartGame', (data) => {
      if (this.gameName == data.gameName) {
        location.reload()
      }
    })
  },
  methods: {
    show () {
      this.$modal.show('set-game-name')
    },
    hide () {
      this.$modal.hide('set-game-name')
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
      this.hide()
    }
  }
}
</script>

<style lang="scss">

  .game-name {
    padding: 0 6px;
    display: inline-block;

    .restart:hover {
      cursor: pointer;
    }
  }
  .set-game-name-modal {
    height: 120px;
  }
  #game-name {
    display: inline-block;
    width: 30%;
    margin-right: 6px;
  }

</style>
