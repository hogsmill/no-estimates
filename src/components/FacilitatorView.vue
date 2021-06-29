<template>
  <div class="container about">
    <h2>{{ appType }} - <span v-if="stealth">(Stealth)</span> Facilitator View</h2>
    <Connections />
    <GameMessaging />
    <Server />
    <GameDisplay />
    <GameParams />
    <Backlog />
    <Delivery />
    <GameState />
    <Games />
    <DemoAndTest />
    <div v-if="isDev()">
      <Utils />
    </div>
  </div>
</template>

<script>
import Connections from './facilitator/Connections.vue'
import GameMessaging from './facilitator/GameMessaging.vue'
import Server from './facilitator/Server.vue'
import GameDisplay from './facilitator/GameDisplay.vue'
import GameParams from './facilitator/GameParams.vue'
import Backlog from './facilitator/Backlog.vue'
import Delivery from './facilitator/Delivery.vue'
import GameState from './facilitator/GameState.vue'
import Games from './facilitator/Games.vue'
import DemoAndTest from './facilitator/DemoAndTest.vue'
import Utils from './facilitator/Utils.vue'

export default {
  components: {
    Connections,
    GameMessaging,
    Server,
    GameDisplay,
    GameParams,
    Backlog,
    Delivery,
    GameState,
    Games,
    DemoAndTest,
    Utils
  },
  computed: {
    appType() {
      return this.$store.getters.appType
    },
    hostId() {
      return this.$store.getters.getHostId
    },
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
  .game-messaging, .game-server, .game-set-up, .game-params, .game-display,
  .game-state, .game-backlog, .game-delivery, .games,
  .demo-and-test {

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
