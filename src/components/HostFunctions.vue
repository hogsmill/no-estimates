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
          <input type="radio" id="run-to-mvp" :checked="runTo == 'MVP'" @click="setRunTo('MVP')"> MVP
          <input type="radio" id="run-to-end" :checked="runTo == 'End'" @click="setRunTo('End')"> End
          <input type="checkbox" id="step-through" :checked="stepThrough" @click="setStepThrough()"> Step Through?
          <button v-if="!stepThrough" class="btn btn-sm btn-site-primary" @click="run()">
            Run
          </button>
          <button v-if="stepThrough" class="btn btn-sm btn-site-primary" @click="run()">
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
      runTo: 'MVP',
      stepThrough: true,
      running: false,
      membersAdded: false
    }
  },
  computed: {
    teamName() {
      return this.$store.getters.getTeamName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teams() {
      return this.$store.getters.getTeams
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
    }
  },
  created() {
    const self = this
    this.socket.on('loadTeam', (data) => {
      if (!this.stepThrough && this.running && this.gameName == data.gameName && this.teamName == data.teamName) {
        self.run()
      }
    })
  },
  methods: {
    setShowRunGame(val) {
      this.showRunGame = val
    },
    setRunTo(runTo) {
      this.runTo = runTo
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
      this.stepThrough = document.getElementById('step-through').checked
    },
    runComplete() {
      return this.columns.find(function(c) {
        return c.name == 'done'
      }).cards.length >= this.runToCards()
    },
    runToCards() {
      return this.runTo == 'MVP'
        ? this.mvpCards
        : this.workCards.length
    },
    setUpGame() {
      this.socket.emit('setupRunGame', {gameName: this.gameName, teamName: this.teamName})
    },
    run() {
      const complete = this.runComplete()
      if (complete) {
        this.running = false
        console.log('Run Complete to ' + this.runToCards() + ' cards')
      } else {
        this.running = true
        this.socket.emit('runGameTo', {gameName: this.gameName, teamName: this.teamName, teams: this.teams, stepThrough: this.stepThrough})
      }
    },
    restartGame() {
      const restartGame = confirm('Are you sure you want to re-start this game?')
      if (restartGame) {
        this.running = false
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
