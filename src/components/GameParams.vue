<template>
  <div class="game-params" v-if="!showAbout">
    <div class="game-params">
      <button class="btn btn-sm btn-site-primary" @click="show">Game Params</button>
    </div>

    <modal name="set-game-params" :height="180" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4 set-game-params">
        <h4>Game Parameters <button class="btn btn-sm btn-site-primary" @click="hide()">Close</button></h4>
        <table>
          <tr>
            <td>Blocked frequency: </td>
            <td class="input"><input type="text" id="percentageBlocked" class="form-control" :value="percentageBlocked * 10" /> out of every 10 cards</td>
            <td><button class="btn btn-sm btn-site-primary" @click="savePercentageBlocked">Save</button></td>
          </tr>
          <tr>
            <td>Deployment fail: </td>
            <td class="input"><input type="text" id="percentageDeployFail" class="form-control" :value="percentageDeployFail * 10" /> out of every 10 deployments</td>
            <td><button class="btn btn-sm btn-site-primary" @click="savePercentageDeployFail">Save</button></td>
          </tr>
        </table>
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
      this.$modal.show('set-game-params');
    },
    hide () {
      this.$modal.hide('set-game-params');
    },
    savePercentageBlocked: function() {
      var percentageBlocked = document.getElementById('percentageBlocked').value / 10
      this.socket.emit("percentageBlocked", {gameName: this.gameName, percentageBlocked: percentageBlocked})
    },
    savePercentageDeployFail: function() {
      var percentageDeployFail = document.getElementById('percentageDeployFail').value / 10
      this.socket.emit("percentageDeployFail", {gameName: this.gameName, percentageDeployFail: percentageDeployFail})
    }
  },
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    percentageBlocked() {
      return this.$store.getters.getPercentageBlocked
    },
    percentageDeployFail() {
      return this.$store.getters.getPercentageDeployFail
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

  .game-params {
    display: inline-block;

    button {
      margin-top: 6px;
    }
  }
  .set-game-params-modal {
    height: 120px;
  }

  .set-game-params {
    text-align: center;

    button {
      line-height: 12px;
      margin-top: 0;
    }

    table {
      width: 100%;
      margin: 0 auto;

      td {
        border: 1px solid;
        vertical-align: middle;

        &.input {
          text-align: left;
          padding-left: 12px;
        }
      }

      input {
        width: 50px;
        height: 24px;
        margin: 6px;
        display: inline-block;
      }
    }
  }

  #game-params {
    display: inline-block;
    width: 30%;
    margin-right: 6px;
  }

</style>
