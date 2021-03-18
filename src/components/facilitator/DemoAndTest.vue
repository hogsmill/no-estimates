<template>
  <table class="demo-and-test">
    <tr>
      <td class="left" colspan="16">
        <h4>Demo And Test</h4>
        <i v-if="showDemoAndTest" @click="setShowDemoAndTest(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showDemoAndTest" @click="setShowDemoAndTest(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showDemoAndTest" class="header">
      <td class="demo-and-test-buttons">
        <button class="btn btn-sm btn-site-primary" @click="createDemo()">
          Create Demo Game
        </button>
        <button class="btn btn-sm btn-site-primary" @click="restartDemo()">
          Re-start Demo Game
        </button>
        <button class="btn btn-sm btn-site-primary" @click="runDemoToMvp()">
          Run Demo to MVP
        </button>
        <button class="btn btn-sm btn-site-primary" @click="runDemoToEnd()">
          Run Demo to End
        </button>
      </td>
    </tr>
  </table>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import bus from '../../socket.js'

export default {
  data() {
    return {
      showDemoAndTest: false,
      gameName: 'Demo',
      teamName: 'Blue',
      myName: 'Dev',
      myRole: 'Designer'
    }
  },
  methods: {
    setShowDemoAndTest(val) {
      this.showDemoAndTest = val
    },
    createDemo() {
      const uuid = uuidv4()
      const myNameData = {id: uuid, name: this.myName, captain: true}
      bus.$emit('sendLoadGame', {gameName: this.gameName, teamName: this.teamName, myName: myNameData, myRole: this.myRole})
    },
    restartDemo() {
      const restartGame = confirm('Are you sure you want to re-start the demo game?')
      if (restartGame) {
        bus.$emit('sendRestartGame', {gameName: this.gameName, teamName: this.teamName})
      }
    },
    runDemoToMvp() {
      bus.$emit('sendRunDemoToMvp', {gameName: this.gameName, teamName: this.teamName})
    },
    runDemoToEnd() {
      bus.$emit('sendRunDemoToEnd', {gameName: this.gameName, teamName: this.teamName})
    }
  }
}
</script>

<style lang="scss">
  .demo-and-test {
    .demo-and-test-buttons {
      text-align: center;
    }
  }
</style>
