<template>
  <div class="container about">
    <h1>No Estimates - <span v-if="stealth">(Stealth)</span> Facilitator View</h1>
    <Connections :socket="socket" />
    <GameMessaging :socket="socket" />
    <GameDisplay :socket="socket" />
    <GameParams :socket="socket" />
    <GameState :socket="socket" />
    <Games :socket="socket" />
    <DemoAndTest :socket="socket" />
    <div v-if="isDev()">
      <Utils />
    </div>
  </div>
</template>

<script>
import Connections from './facilitator/Connections.vue'
import GameMessaging from './facilitator/GameMessaging.vue'
import GameDisplay from './facilitator/GameDisplay.vue'
import GameParams from './facilitator/GameParams.vue'
import GameState from './facilitator/GameState.vue'
import Games from './facilitator/Games.vue'
import DemoAndTest from './facilitator/DemoAndTest.vue'
import Utils from './facilitator/Utils.vue'

export default {
  components: {
    Connections,
    GameMessaging,
    GameDisplay,
    GameParams,
    GameState,
    Games,
    DemoAndTest,
    Utils
  },
  props: [
    'socket'
  ],
  computed: {
    stealth() {
      return this.$store.getters.getStealth
    }
  },
  methods: {
    isDev() {
      return window.location.href.match('localhost')
    }
  }
}
</script>

<style lang="scss">
  .game-messaging, .game-params, .game-display, .game-state, .games, .demo-and-test {

    width: 100%;
    margin: 12px;
    border: 1px solid #ccc;

    .toggle {
      color: #aaa;
      font-size: xx-large;

      &:hover {
        cursor: pointer;
      }
    }

    .left {
      text-align: left;
    }

    h4 {
      width: 75%;
      display: inline-block;
      text-align: left;
    }

    span, i {
      position: absolute;
      right: 6px;
    }

    td {
      vertical-align: top;
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
