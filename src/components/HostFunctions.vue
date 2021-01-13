<template>
  <div>
    <button class="btn btn-sm btn-outline-secondary smaller-font clear-local-storage" @click="clearLocalStorage()">
      Clear Local Storage
    </button>
    <div class="run-demo">
      Run Game To:
      <button class="btn btn-sm btn-site-primary" @click="runGameTo('MVP')">
        MVP
      </button>
      <button class="btn btn-sm btn-site-primary" @click="runGameTo('End')">
        End
      </button>
      <input type="checkbox" id="step-through" :checked="stepThrough" @click="setStepThrough()"> Step Through?
      <button v-if="stepThrough" class="btn btn-sm btn-site-primary" @click="step()">
        Step
      </button>
      <i v-if="gameName" title="Restart Game" @click="restartGame" class="fas fa-undo-alt restart" />
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
      stepThrough: false
    }
  },
  computed: {
    teamName() {
      return this.$store.getters.getTeamName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    stealth() {
      return this.$store.getters.getStealth
    }
  },
  methods: {
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
    runGameTo(runTo) {
      this.socket.emit('runGameTo', {gameName: this.gameName, teamName: this.teamName, runTo: runTo, stepThrough: this.stepThrough})
    },
    step() {

    },
    restartGame() {
      const restartGame = confirm('Are you sure you want to re-start this game?')
      if (restartGame) {
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
    text-align: left;
    padding-left: 6px;

    button {
      padding-left: 6px;
    }

    input {
      width: 12px;
    }
  }
</style>
