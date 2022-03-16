<template>
  <vue-final-modal name="set-game" classes="modal-container" content-class="vfm__content modal-content set-game" v-model="modals['setGame']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4>
        Game Set Up
      </h4>
      <table class="setup-table">

        <!-- Game Name -->

        <tr class="rounded" :class="{ 'error': gameNameError }">
          <td>
            Game Name:
          </td>
          <td>
            <span v-if="gameFromParams()">{{ selectedGame.gameName }}</span>
            <select v-if="!gameFromParams()" id="game-name-select" class="form-control" @change="setSelectedGame()">
              <option value="">
                -- Select --
              </option>
              <option v-for="(game, index) in games" :key="index" :selected="game.gameName == gameName">
                {{ game.gameName }}
              </option>
            </select>
          </td>
        </tr>

        <!-- Team Name -->

        <tr :class="{ 'error': teamNameError }">
          <td>
            Team:
          </td>
          <td v-if="selectedGame.teams">
            <select id="team-name-select" class="form-control" :disabled="!canRestructure()">
              <option value="">
                -- Select --
              </option>
              <option v-for="(team, index) in activeTeams(selectedGame.teams)" :key="index" :selected="team.name == teamName">
                {{ team.name }}
              </option>
            </select>
          </td>
        </tr>

        <!-- My Name -->

        <tr :class="{ 'error': myNameError }">
          <td>
            My Name:
          </td>
          <td>
            <input type="text" id="my-name" class="form-control" :value="myName.name">
          </td>
        </tr>

        <!-- Role -->

        <tr :class="{ 'error': myRoleError }">
          <td>
            My Role:
          </td>
          <td>
            <select id="role-select" class="form-control" :disabled="!canRestructure()">
              <option value="">
                -- Select --
              </option>
              <option v-for="(role, index) in roles" :key="index" :selected="role == myRole">
                {{ role }}
              </option>
            </select>
          </td>
        </tr>
      </table>
      <button class="btn btn-sm btn-primary smaller-font" @click="save()">
        Done
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import bus from '../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import params from '../../lib/params.js'
import stringFuns from '../../lib/stringFuns.js'

export default {
  components: {
    VueFinalModal
  },
  data() {
    return {
      gameSetFromParams: false,
      selectedGame: {},
      gameNameError: false,
      myNameError: false,
      teamNameError: false,
      myRoleError: false
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    lsSuffix() {
      return this.$store.getters.lsSuffix
    },
    appType() {
      return this.$store.getters.appType
    },
    admin() {
      return this.$store.getters.getAdmin
    },
    config() {
      return this.$store.getters.getConfig
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    capabilities() {
      return this.$store.getters.getCapabilities
    },
    roles() {
      return this.$store.getters.getRoleNames
    },
    myRole() {
      return this.$store.getters.getMyRole
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    games() {
      return this.$store.getters.getGames
    }
  },
  mounted() {
    bus.on('updateGames', (data) => {
      this.$store.dispatch('updateGames', data)
      let game = this.gameFromParams()
      if (game) {
        this.gameSetFromParams = true
      } else {
        game = localStorage.getItem('gameName-' + this.lsSuffix)
      }
      if (game) {
        this.setSelectedGame(game)
      }
    })

    bus.emit('sendGetGames')
  },
  created() {
    this.workshopUrl = params.getParam('workshop')
    this.gameUrl = params.getParam('game')
    if (this.gameUrl) {
      this.workshopUrl = 'None (Single team Game)'
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'setGame')
    },
    gameFromParams() {
      return params.getParam('game')
    },
    setSelectedGame(game) {
      if (!game) {
        game = document.getElementById('game-name-select').value
      }
      if (!game) {
        this.selectedGame = {}
      } else {
        this.selectedGame = this.games.find((g) => {
          return g.gameName == game
        })
      }
    },
    activeTeams() {
      const teams = []
      for (let i = 0; i < this.selectedGame.teams.length; i++) {
        if (this.selectedGame.teams[i].include) {
          teams.push(this.selectedGame.teams[i])
        }
      }
      return teams
    },
    reset() {
      this.myNameError = false,
      this.teamNameError = false,
      this.myRoleError = false
    },
    canRestructure() {
      return this.admin || this.currentDay == 1 || this.capabilities.recharting
    },
    getMyName() {
      let myNameData
      const myName = stringFuns.sanitize(document.getElementById('my-name').value)
      if (this.myName && this.myName.id) {
        myNameData = this.myName
      } else {
        const uuid = uuidv4()
        myNameData = {id: uuid, name: '', captain: false}
      }
      myNameData.name = myName
      myNameData.admin = this.admin
      return myNameData
    },
    getMyRole() {
      let myRole = ''
      if (document.getElementById('role-select')) {
        myRole = document.getElementById('role-select').value
      } else {
        myRole = this.myRole
      }
      return myRole
    },
    showErrors(gameName, teamName, myName) {
      if (! gameName || gameName == '') { this.gameNameError = true }
      if (! teamName) { this.teamNameError = true }
      if (!myName.name || myName.name == '') { this.myNameError = true }
    },
    setLocalStorage(gameName, myName, teamName, myRole) {
      console.log('Setting localStorage', gameName, myName, teamName, myRole)
      localStorage.setItem('gameName-' + this.lsSuffix, gameName)
      localStorage.setItem('myName-' + this.lsSuffix, JSON.stringify(myName))
      localStorage.setItem('teamName-' + this.lsSuffix, teamName)
      localStorage.setItem('myRole-' + this.lsSuffix, myRole)
    },
    save() {
      this.reset()
      const oldTeam = this.teamName
      const gameName = this.selectedGame.gameName
      const teamName =  document.getElementById('team-name-select').value
      const myName = this.getMyName()
      const myRole = document.getElementById('role-select').value
      const data = {
        gameName: gameName,
        teamName: teamName,
        myName: myName,
        myRole: myRole,
        appType: this.appType
      }
      if (oldTeam && oldTeam != teamName) {
        data.oldTeam = oldTeam
      }
      this.showErrors(gameName, teamName, myName)
      if (this.gameNameError || this.teamNameError || this.myNameError) {
        alert('Please set all required fields before saving')
      } else {
        this.setLocalStorage(gameName, myName, teamName, myRole)
        this.$store.dispatch('updateGameName', gameName)
        this.$store.dispatch('updateMyName', myName)
        this.$store.dispatch('updateTeamName', teamName)
        bus.emit('sendLoadGame', data)
        this.hide()
      }
    }
  }
}
</script>

<style lang="scss">
  .setup-table {
    margin: 0 auto 20px auto;
    border: 1px solid #ccc;
    width: initial;

    td {
      height: 45px;
      border: 1px solid #ccc;
      vertical-align: middle;

      span {
        font-size: 16px;
      }

      div {
        padding: 6px;
        text-align: left;

        &.my-name {
          margin-top: 6px;
          margin-bottom: 6px;
        }

        &.my-name-edit {
          padding-bottom: 0;
        }
      }

      &:nth-child(1) {
        padding: 2px 10px;
      }
      &:nth-child(2) {
        width: 200px; ;
      }

      select {
        padding: 0;
      }

      &.button {
        vertical-align: middle;
        width: 60px;

        button {
          margin: 6px;
        }
      }

      .fas {
        color: #888;
        font-size: x-large;

        &:hover {
          cursor: pointer;
          color: #5a6268
        }
      }
    }

    .error {
      background-color: red;
      color: #fff;
    }
  }
</style>
