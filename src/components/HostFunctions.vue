<template>
  <div>
    <button class="btn btn-sm btn-outline-secondary smaller-font clear-local-storage" @click="clearLocalStorage()">
      Clear Local Storage
    </button>
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
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showRunGame: false,
      membersAdded: false,
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
    }
  },
  created() {
    const self = this
    this.socket.on('loadTeam', (data) => {
      if (self.demoConfig.running && self.gameName == data.gameName && self.teamName == data.teamName) {
        self.checkRunComplete(data)
        if (!self.runComplete) {
          window.setTimeout(function() {
            self.run()
          }, 1000)
        }
      }
    })

    this.socket.on('startRun', (data) => {
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
      this.socket.emit('setDemoRunTo', {gameName: this.gameName, runTo: runTo})
    },
    clearLocalStorage() {
      if (confirm('Clear localStorage?')) {
        localStorage.removeItem('myName')
        localStorage.removeItem('teamName')
        localStorage.removeItem('myRole')
        localStorage.removeItem('gameName')
      }
    },
    setStepThrough() {
      const stepThrough = document.getElementById('step-through').checked
      this.socket.emit('setDemoStepThrough', {gameName: this.gameName, stepThrough: stepThrough})

    },
    checkRunComplete(data) {
    console.log(data.teamName, data.columns.find(function(c) {
      return c.name == 'done'
    }).cards.length + ' >= ' + this.demoConfig.runToCards)

      this.runComplete = data.columns.find(function(c) {
        return c.name == 'done'
      }).cards.length >= this.demoConfig.runToCards
    },
    setUpGame() {
      this.socket.emit('setupRunGame', {gameName: this.gameName})
    },
    runGame() {
      this.socket.emit('setDemoRunning', {gameName: this.gameName, running: true})
    },
    stopGame() {
      this.socket.emit('setDemoRunning', {gameName: this.gameName, running: false})
    },
    run() {
      if (this.runComplete) {
        console.log('Run Complete to ' + this.demoConfig.runToCards + ' cards')
      } else {
        this.socket.emit('runDemoGame', {gameName: this.gameName, teamName: this.teamName})
      }
    },
    restartGame() {
      const restartGame = confirm('Are you sure you want to re-start this game?')
      if (restartGame) {
        this.socket.emit('setDemoRunning', {gameName: this.gameName, running: false})
        this.socket.emit('restartGame', {gameName: this.gameName, stealth: this.stealth})
      }
    },
  }
}
</script>

<style lang="scss">
  .clear-local-storage {
    float: right;
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
