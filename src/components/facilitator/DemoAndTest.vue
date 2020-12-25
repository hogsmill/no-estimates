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
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showDemoAndTest: false
    }
  },
  computed: {
  },
  created() {
    this.socket.emit('getGames')
  },
  methods: {
    setShowDemoAndTest(val) {
      this.showDemoAndTest = val
    },
    createDemo() {
      console.log('createDemo')
    },
    runDemoToMvp() {
      console.log('runDemoToMvp')
    },
    runDemoToEnd() {
      console.log('runDemoToEnd')
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
