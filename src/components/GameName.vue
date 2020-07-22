<template>
  <div class="game-name" v-if="!showAbout">
    <div class="game-name text-right">
      <button class="btn btn-sm btn-info" v-if="!gameName" @click="show">Set Game Name</button>
      <span v-if="gameName" @click="show">Game: {{gameName}}</span>
    </div>

    <modal name="set-game-name" :height="120" :classes="['rounded']">
      <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
      <h4>Enter Your Game Name</h4>
      <div class="set-game-name">
        <input type="text" id="game-name" class="form-control" />
        <button class="btn btn-sm btn-info" @click="saveGameName">Save</button>
      </div>
    </modal>

  </div>
</template>

<script>
export default {
  data() {
    return {
      myGameName: ''
    }
  },
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
      this.myGameName = gameName
      this.socket.emit("updateGameName", {gameName: gameName})
      localStorage.setItem("gameName", gameName);
      this.hide()
    }
  },
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  mounted() {
    const self = this
    this.socket.on("updateGameName", (data) => {
      if (self.myGameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateGameName", data)
      }
    })

    var gameName = localStorage.getItem("gameName")
    if (gameName) {
      self.myGameName = gameName
      self.socket.emit("updateGameName", {gameName: gameName})
    }
  }
}
</script>

<style lang="scss">

  .game-name {
    padding: 0 6px;
    display: inline-block;

    button {
      font-size: smaller;
      background-color: #aaa;
      border: 1px solid #aaa;

      &:hover {
        color: #aaa;
        background-color: #fff;
      }
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
