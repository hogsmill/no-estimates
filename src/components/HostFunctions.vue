<template>
  <div class="host-funs">
    <button class="btn btn-sm btn-outline-secondary smaller-font clear-local-storage" @click="clearLocalStorage()">
      Clear Local Storage
    </button>
    <br>
    <span class="last-access">
      last access: {{ lastAccess() }}
    </span>
    <div class="run-demo rounded">
      <div class="expand">
        <i v-if="showRunGame" @click="setShowRunGame(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showRunGame" @click="setShowRunGame(true)" title="expand" class="fas fa-caret-down toggle" />
        <h6>Run Game</h6>
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
          <input type="checkbox" id="step-through" @click="setStepThrough()" :checked="demoConfig.stepThrough"> Step Through?
          <button v-if="!demoConfig.stepThrough" class="btn btn-sm btn-site-primary" @click="runGame()">
            Run
          </button>
          <button v-if="!demoConfig.stepThrough" class="btn btn-sm btn-site-primary" @click="stopGame()">
            Stop
          </button>
          <button v-if="demoConfig.stepThrough" class="btn btn-sm btn-site-primary" @click="run()">
            Step
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
  created() {
    const self = this
    bus.$on('loadTeam', (data) => {
      if (self.demoConfig.running && self.gameName == data.gameName && self.teamName == data.teamName) {
        self.checkRunComplete(data)
        if (!self.runComplete) {
          window.setTimeout(function() {
            self.run()
          }, 1000)
        }
      }
    })

    bus.$on('startRun', (data) => {
      if (self.gameName == data.gameName) {
        self.run()
      }
    })
  },
  methods: {
    setShowRunGame(val) {
      this.showRunGame = val
    },
    setRunTo(runTo) {
      bus.$emit('sendSetDemoRunTo', {gameName: this.gameName, runTo: runTo})
    },
    lastAccess() {
      return this.lastAccessed ? timeAgo.format(new Date(this.lastAccessed)) : ''
    },
    clearLocalStorage() {
      if (confirm('Clear localStorage?')) {
        localStorage.removeItem('myName')
        localStorage.removeItem('teamName')
        localStorage.removeItem('myRole')
        localStorage.removeItem('gameName')
      }
    },
    goMobile() {
      this.$store.dispatch('updateCurrentTab', 'mobile')
    },
    setStepThrough() {
      const stepThrough = document.getElementById('step-through').checked
      bus.$emit('setDemoStepThrough', {gameName: this.gameName, stepThrough: stepThrough})

    },
    checkRunComplete(data) {
      this.runComplete = data.columns.find(function(c) {
        return c.name == 'done'
      }).cards.length >= this.demoConfig.runToCards
    },
    setUpGame() {
      bus.$emit('sendSetupRunGame', {gameName: this.gameName})
    },
    runGame() {
      bus.$emit('sendSetDemoRunning', {gameName: this.gameName, running: true})
    },
    stopGame() {
      bus.$emit('sendSetDemoRunning', {gameName: this.gameName, running: false})
    },
    run() {
      if (this.runComplete) {
        console.log('Run Complete to ' + this.demoConfig.runToCards + ' cards')
        bus.$emit('sendSetDemoRunning', {gameName: this.gameName, running: false})
      } else {
        bus.$emit('sendRunDemoGame', {gameName: this.gameName, teamName: this.teamName})
      }
    },
    restartGame() {
      const restartGame = confirm('Are you sure you want to re-start this game?')
      if (restartGame) {
        bus.$emit('sendSetDemoRunning', {gameName: this.gameName, running: false})
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
