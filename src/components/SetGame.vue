<template>
  <span>

    <button class="btn btn-sm btn-secondary smaller-font" @click="show">
      Set Up
    </button>

    <modal name="set-up" :height="330" class="rounded">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Game Set Up</h4>
        <table class="setup-table" border>

          <!-- Game Name -->

          <tr :class="{ 'error': gameNameError }">
            <td>Game Name: </td>
            <td v-if="gameName && !gameNameEditing">
              {{ gameName }}
              <button class="btn btn-sm btn-secondary smaller-font" @click="changeGameName">
                &#128393;
              </button>
            </td>
            <td v-if="!gameName || gameNameEditing">
              <input type="text" id="game-name" class="form-control setup-input" :value="gameName">
            </td>
          </tr>

          <!-- My Name -->

          <tr :class="{ 'error': myNameError }">
            <td>My Name: </td>
            <td v-if="myName.id && !myNameEditing" class="setup-input">
              {{ myName.name }}
              <button class="btn btn-sm btn-secondary smaller-font" @click="changeMyName">
                &#128393;
              </button>
            </td>
            <td v-if="!myName.id || myNameEditing">
              <input type="text" id="my-name" class="form-control setup-input" :value="myName.name">
            </td>
            <td>
              <input type="checkbox" id="captain" :checked="myName.captain"> Team Captain?
            </td>
          </tr>

          <tr :class="{ 'error': teamNameError }">
            <td>Team: </td>
            <td v-if="teamName && !teamNameEditing">
              {{ teamName.name }}
              <button class="btn btn-sm btn-secondary smaller-font" @click="changeTeamName">
                &#128393;
              </button>
            </td>
            <td v-if="!teamName || teamNameEditing">
              <select :class="{ 'hidden': activeTeams.length == 0}" id="team-name-select" class="form-control offset-md-2 mr-2 setup-input ">
                <option v-for="(team, index) in activeTeams" :key="index" :selected="team.name == teamName">
                  {{ team.name }}
                </option>
              </select>
            </td>
          </tr>

          <tr :class="{ 'error': myRoleError }">
            <td>My Role: </td>
            <td v-if="myRole && !myRoleEditing">
              {{ myRole.role }}
              <button class="btn btn-sm btn-secondary smaller-font" @click="changeMyRole">
                &#128393;
              </button>
            </td>
            <td v-if="!myRole || myRoleEditing">
              <select id="role-select" class="form-control setup-input offset-md-2 mr-2 setup-input ">
                <option v-for="(role, index) in roles" :key="index" :selected="role.role == myRole">
                  {{ role.role }}
                </option>
              </select>
            </td>
          </tr>
        </table>
        <button class="btn btn-sm btn-primary smaller-font" @click="save">
          Done
        </button>
      </div>
    </modal>

  </span>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import stringFuns from '../lib/stringFuns.js'

export default {
  props: [
    'socket'
  ],
  data() {
    return {
      gameNameEditing: false,
      gameNameError: false,
      myNameEditing: false,
      myNameError: false,
      teamNameEditing: false,
      teamNameError: false,
      myRoleEditing: false,
      myRoleError: false,
    }
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    activeTeams() {
      return this.$store.getters.getActiveTeams
    },
    roles() {
      return this.$store.getters.getRoles
    },
    myRole() {
      return this.$store.getters.getMyRole
    },
  },
  methods: {
    show () {
      this.$modal.show('set-up')
    },
    hide () {
      this.$modal.hide('set-up')
    },
    changeGameName: function() {
      this.gameNameEditing = true
      this.gameNameError = false
    },
    changeMyName: function() {
      this.myNameEditing = true
      this.myNameError = false
    },
    changeTeamName: function() {
      this.teamNameEditing = true
      this.teamNameError = false
    },
    changeMyRole: function() {
      this.myRoleEditing = true
      this.myRoleError = false
    },
    getGameName: function() {
      let gameName = ''
      if (document.getElementById('game-name')) {
        gameName = document.getElementById('game-name').value
        gameName = stringFuns.sanitize(gameName)
      } else if (this.gameName) {
        gameName = this.gameName
      }
      return gameName
    },
    getMyName: function() {
      let myNameData
      if (this.myName && this.myName.id) {
        myNameData = this.myName
      } else {
        const uuid = uuidv4()
        myNameData = {id: uuid, name: '', captain: false, host: this.isHost}
      }
      if (document.getElementById('my-name')) {
        const myName = document.getElementById('my-name').value
        myNameData.name = stringFuns.sanitize(myName)
      }
      return myNameData
    },
    getTeamName: function() {
      let teamName = ''
      if (document.getElementById('team-name-select')) {
        teamName = document.getElementById('team-name-select').value
      }
      return teamName
    },
    getMyRole: function() {
      let myRole = ''
      if (document.getElementById('role-select')) {
        myRole = document.getElementById('role-select').value
      }
      return myRole
    },
    showErrors: function(gameName, myName, teamName) {
      if (! gameName) { this.gameNameError = true }
      if (! myName.name) { this.myNameError = true }
      if (! teamName) { this.teamNameError = true }
    },
    setLocalStorage: function(gameName, myName, teamName, myRole) {
      localStorage.setItem('gameName', gameName)
      localStorage.setItem('myName', JSON.stringify(myName))
      localStorage.setItem('teamName', teamName)
      localStorage.setItem('myRole', myRole)
    },
    save () {
      const gameName = this.getGameName()
      const myName = this.getMyName()
      const teamName =  this.getTeamName()
      const myRole = this.getMyRole()
      if (gameName && myName && teamName) {
        this.setLocalStorage(gameName, myName, teamName, myRole)
        this.$store.dispatch('updateGameName', gameName)
        this.$store.dispatch('updateMyName', myName)
        this.$store.dispatch('updateTeamName', teamName)
        this.socket.emit('loadGame', {gameName: this.gameName, teamName: this.teamName, myName: myName, myRole: myRole})
        this.hide()
      } else {
        this.showErrors(gameName, myName, teamName)
        alert('Please set all fields before saving')
      }
    }
  }
}
</script>

<style lang="scss">

  .setup-table {

    margin-bottom: 20px;

    td {
      height: 45px;

      &:nth-child(1) {
        padding: 2px 10px;
      }
      &:nth-child(2) {
        width: 300px; ;
      }
    }

    .error {
      background-color: red;
    }
    .setup-label {
      display: inline-block;
      width: 200px;
      line-height: 1.5;
    }

    .setup-change {
      background-color: transparent;
      color: #212529;
      border-color: transparent;
    }

    .setup-input {
      display: inline-block;
      width: 200px;
    }
  }

</style>
