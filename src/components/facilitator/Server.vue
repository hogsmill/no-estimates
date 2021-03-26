<template>
  <table class="game-server">
    <tr>
      <td>
        <h4>Server</h4>
        <i v-if="showServer" @click="setShowGameMessaging(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showServer" @click="setShowGameMessaging(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showServer" class="server-params">
      <td>
        <button class="btn btn-sm btn-danger" @click="checkPassword()">
          Restart Server
        </button>
        Password
        <input type="text" id="server-message">
        <span v-if="serverRestartPasswordError" class="password-status">Incorrect password</span>
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../../socket.js'

export default {
  data() {
    return {
      showServer: false,
      serverRestartPasswordError: false
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    activeTeams() {
      return this.$store.getters.getActiveTeams
    }
  },
  created() {
    bus.$on('serverRestartPasswordError', () => {
      this.serverRestartPasswordError = true
    })
  },
  methods: {
    setShowGameMessaging(val) {
      this.showServer = val
    },
    checkPassword() {
      this.serverRestartPasswordError = false
      if (confirm('Are you sure you want to restart the server?')) {
        const password = document.getElementById('server-message').value
        document.getElementById('server-message').value = ''
        bus.$emit('sendCheckServerRestartPassword', password)
      }
    }
  }
}
</script>

<style lang="scss">
  .game-server {
    .server-params {
      div, input, button {
        display: inline-block;
        margin: 2px 6px;
      }

      input {
        width: 200px;
        border: 1px solid #ccc;
        text-align: left;
      }

      .password-status {
        position: initial;
        color: red;
      }
    }
  }
</style>
