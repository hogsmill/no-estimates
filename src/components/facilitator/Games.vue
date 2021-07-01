<template>
  <table class="games">
    <tr>
      <td class="left" colspan="16">
        <h4>
          Games ({{ games.length }})
        </h4>
        <i v-if="showGames" @click="setShowGames(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showGames" @click="setShowGames(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showGames">
      <td colspan="2" class="add-game">
        <input type="text" id="add-new-game">
        <button id="add-new" class="btn btn-sm btn-site-primary add-new" @click="addGame()">
          Add New Game
        </button>
      </td>
    </tr>
    <tr v-if="showGames" class="header">
      <td>
        Games
      </td>
      <td>
        <table class="games-table">
          <thead>
            <th>Game Name</th>
            <th />
            <th>Last Accessed</th>
          </thead>
          <tbody>
            <tr v-for="(game, index) in games" :key="index">
              <td>
                {{ game.gameName }}
              </td>
              <td>
                <button class="btn btn-sm btn-site-primary" @click="deleteGame(game)" :disabled="game.gameName == gameName">
                  Delete
                </button>
              </td>
              <td>
                {{ lastAccessed(game) }}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import timeAgo from '../../lib/timeAgo.js'
import bus from '../../socket.js'

import stringFuns from '../../lib/stringFuns.js'

export default {
  data() {
    return {
      showGames: false,
      id: null
    }
  },
  computed: {
    appType() {
      return this.$store.getters.appType
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    games() {
      return this.$store.getters.getGames
    }
  },
  created() {
    bus.$on('addGameError', (data) => {
      if (data.id == this.id) {
        alert(data.error)
      }
    })
  },
  methods: {
    setShowGames(val) {
      this.showGames = val
      if (val) {
         bus.$emit('sendGetGames', {appType: this.appType})
      }
    },
    idSafe(game) {
      return stringFuns.idSafe(game.gameName)
    },
    lastAccessed(game) {
      return game.lastaccess ? timeAgo.format(new Date(game.lastaccess)) : ''
    },
    addGame() {
      const game = document.getElementById('add-new-game').value
      this.id = this.id ? this.id : uuidv4()
      bus.$emit('sendAddGame', {gameName: game, id: this.id})
    },
    deleteGame(game) {
      bus.$emit('sendDeleteGame', {gameName: game.gameName, appType: this.appType})
    }
  }
}
</script>

<style lang="scss">
  .games {

     .add-game {
       text-align: center;

       #add-new-game {
         width: 200px;
         text-align: left;
       }

      .add-new {
        margin-left: 4px;
      }
    }

    .games-table {
      border: none;

      th {
        text-align: center;
        padding: 3px 8px
      }
    }
  }
</style>
