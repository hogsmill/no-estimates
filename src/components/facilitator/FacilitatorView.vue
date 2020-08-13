<template>
  <div class="container about">

    <h1>No Estimates - Facilitator View</h1>

    <table class="game-params">
      <tr>
        <td colspan="4">
          <h4>Game Params</h4>
          <span v-if="showGameParams" @click="setShowGameParams(false)">&#9650;</span>
          <span v-if="!showGameParams" @click="setShowGameParams(true)">&#9660;</span>
        </td>
      </tr>
      <tr v-if="showGameParams">
        <td>Blocked frequency: </td>
        <td class="center"><input type="text" id="percentageBlocked" class="form-control" :value="percentageBlocked" /></td>
        <td>x 10 out of every 10 cards</td>
        <td class="center"><button class="btn btn-sm btn-site-primary" @click="savePercentageBlocked">Save</button></td>
      </tr>
      <tr v-if="showGameParams">
        <td>Deployment fail: </td>
        <td class="center"><input type="text" id="percentageDeployFail" class="form-control" :value="percentageDeployFail" /></td>
        <td>x 10 out of every 10 deployments</td>
        <td class="center"><button class="btn btn-sm btn-site-primary" @click="savePercentageDeployFail">Save</button></td>
      </tr>
      <tr v-if="showGameParams">
        <td class="left-col">Teams</td>
        <td colspan="3">
          <div><input type="checkbox"> Blue</div>
          <div><input type="checkbox"> Green</div>
          <div><input type="checkbox"> Purple</div>
          <div><input type="checkbox"> Red</div>
        </td>
      </tr>
    </table>

    <table class="game-state">
      <tr>
        <td colspan="4">
          <h4>Game State</h4>
          <span v-if="showGameState" @click="setShowGameState(false)">&#9650;</span>
          <span v-if="!showGameState" @click="setShowGameState(true)">&#9660;</span>
        </td>
      </tr>
    </table>

  </div>
</template>

<script>

export default {
  props: [
    'socket'
  ],
  data() {
    return {
    showGameParams: true,
    showGameState: true
    }
  },
  methods: {
    setShowGameParams(val) {
      this.showGameParams = val
    },
    setShowGameState(val) {
      this.showGameState = val
    },
    savePercentageBlocked: function() {
      var percentageBlocked = document.getElementById('percentageBlocked').value
      this.socket.emit("percentageBlocked", {gameName: this.gameName, percentageBlocked: percentageBlocked})
    },
    savePercentageDeployFail: function() {
      var percentageDeployFail = document.getElementById('percentageDeployFail').value
      this.socket.emit("percentageDeployFail", {gameName: this.gameName, percentageDeployFail: percentageDeployFail})
    }
  },
  computed: {
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
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
  }
}
</script>

<style lang="scss">

  .game-params, .game-state {

    width: 80%;
    margin: 12px;
    border: 1px solid #ccc;

    h4 {
      width: 50%;
      display: inline-block;
    }

    span {
      position: absolute;
      right: 6px;
    }

    td {
      position: relative;
      padding: 4px;
      text-align: left;
      border: 1px solid #ccc;

      &.center {
        text-align: center;
      }
      &.left-col {
        vertical-align: top;
      }
    }
    input {
      width: 70px;
      height: 24px;
      padding: 2px;
      text-align: right;
      margin: 0 auto;
    }
  }
</style>
