<template>
  <div class="game-name" v-if="!showFacilitator">
    <div class="game-name text-right">
      <button class="btn btn-sm btn-secondary smaller-font" v-if="!gameName" @click="show">Set Game Name</button>
      <span v-if="gameName" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">Game: {{gameName}}</span>
      <span v-if="gameName" title="Restart Game" class="restart" @click="restartGame">&#8635;</span>
    </div>

    <modal name="set-game-name" :height="120" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Enter Your Game Name</h4>
        <div class="set-game-name">
          <input type="text" id="game-name" class="form-control" />
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveGameName">Save</button>
        </div>
      </div>
    </modal>

  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  methods: {
    show () {
      this.$modal.show('set-game-name');
    },
    hide () {
      this.$modal.hide('set-game-name');
    },
    saveGameName: function() {
      var gameName = document.getElementById('game-name').value
      this.$store.dispatch("updateGameName", gameName)
      localStorage.setItem("gameName", gameName);
      this.socket.emit("restartGame", {gameName: this.gameName})
      this.hide()
    },
    restartGame() {
      var restartGame = confirm("Are you sure you want to re-start this game?")
      if (restartGame) {
        this.socket.emit("restartGame", {gameName: this.gameName})
      }
    }
  },
  computed: {
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  mounted() {
    this.socket.on("restartGame", (data) => {
      if (this.gameName == data.gameName) {
        location.reload()
      }
    })
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
