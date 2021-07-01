<template>
  <div class="host-funs">
    <span class="last-access">
      last access: {{ lastAccess() }}
    </span>
    <div class="run-demo rounded">
      <div class="expand">
        <i v-if="showRunGame" @click="setShowRunGame(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showRunGame" @click="setShowRunGame(true)" title="expand" class="fas fa-caret-down toggle" />
        <h6>
          Run Game
          <span v-if="showRunGame">(running: {{ demoConfig.running }})</span>
        </h6>
      </div>
      <div v-if="showRunGame">
        <div>
          <button class="btn btn-sm btn-site-primary" @click="setUpGame()">
            Set Up Game
          </button>
          <i v-if="gameName" title="Restart Game" @click="restartGame()" class="fas fa-undo-alt restart" />
        </div>
        <div>
          Run Game To:
          <input type="radio" id="run-to-mvp" @click="setRunTo('MVP')" :checked="demoConfig.runTo == 'MVP'"> MVP
          <input type="radio" id="run-to-end" @click="setRunTo('End')" :checked="demoConfig.runTo == 'End'"> End
          <button class="btn btn-sm btn-site-primary" @click="startRun()">
            Run
          </button>
          <button class="btn btn-sm btn-site-primary" @click="stopRun()">
            Stop
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import timeAgo from '../lib/timeAgo.js'
import bus from '../socket.js'

export default {
  data() {
    return {
      showRunGame: false,
      membersAdded: false,
      runComplete: false
    }
  },
  computed: {
    lsSuffix() {
      return this.$store.getters.lsSuffix
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    columns() {
      return this.$store.getters.getColumns
    },
    stealth() {
      return this.$store.getters.getStealth
    },
    mvpCards() {
      return this.$store.getters.getMvpCards
    },
    workCards() {
      return this.$store.getters.getWorkCards
    },
    demoConfig() {
      return this.$store.getters.getDemoConfig
    },
    lastAccessed() {
      return this.$store.getters.getLastAccessed
    }
  },
  methods: {
    setShowRunGame(val) {
      this.showRunGame = val
    },
    lastAccess() {
      return this.lastAccessed ? timeAgo.format(new Date(this.lastAccessed)) : ''
    },
    goMobile() {
      this.$store.dispatch('updateCurrentTab', 'mobile')
    },
    setRunTo(runTo) {
      bus.$emit('sendSetDemoRunTo', {gameName: this.gameName, runTo: runTo})
    },
    setUpGame() {
      bus.$emit('sendSetupRunGame', {gameName: this.gameName})
    },
    startRun() {
      bus.$emit('sendStartDemoRunning', {gameName: this.gameName})
    },
    stopRun() {
      bus.$emit('sendStopDemoRunning', {gameName: this.gameName})
    },
    restartGame() {
      const restartGame = confirm('Are you sure you want to re-start this game?')
      if (restartGame) {
        bus.$emit('sendStopDemoRunning', {gameName: this.gameName})
        bus.$emit('sendRestartGame', {gameName: this.gameName, stealth: this.stealth})
      }
    },
  }
}
</script>

<style lang="scss">
  .host-funs {
    float: right;
    text-align: right;
  }

  .run-demo {
    padding: 12px;
    text-align: left;
    padding-left: 6px;
    border: 1px solid;
    background-color: #fff;
    position: absolute;
    top: 57px;
    left: 7px;
    z-index: 10;

    h6 {
      width: 50%;
      text-align: left;
    }

    .expand {
      .fas {
        color: #aaa;
        font-size: x-large;
        float: right;
      }
    }

    button {
      padding-left: 6px;
    }

    input {
      width: 12px;
    }
  }
</style>
