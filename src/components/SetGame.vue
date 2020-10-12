<template>
  <span>

    <button class="btn btn-sm btn-secondary smaller-font" @click="show">
      Set Up
    </button>

    <modal name="set-up" :height="360" class="rounded">
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
            <td>
              <div v-if="gameName && !gameNameEditing">{{ gameName }}</div>
              <input v-if="!gameName || gameNameEditing" type="text" id="game-name" class="form-control" :value="gameName">
            </td>
            <td class="button">
              <button v-if="gameName && !gameNameEditing" class="btn btn-sm btn-secondary smaller-font" @click="changeGameName">
                &#128393;
              </button>
            </td>
          </tr>

          <!-- My Name -->

          <tr :class="{ 'error': myNameError }">
            <td>My Name: </td>
            <td>
              <div v-if="myName.id && !myNameEditing" class="my-name">{{ myName.name }}</div>
              <div v-if="!myName.id || myNameEditing" class="my-name-edit">
                <input type="text" id="my-name" class="form-control" :value="myName.name">
              </div>
              <div>
                <input type="checkbox" id="captain" :disabled="!myNameEditing" :checked="myName.captain"> Team Captain? {{ myNameEditing }}
              </div>
            </td>
            <td class="button">
              <button v-if="myName.id && !myNameEditing" class="btn btn-sm btn-secondary smaller-font" @click="changeMyName">
                &#128393;
              </button>
            </td>
          </tr>

          <!-- Team Name -->

          <tr :class="{ 'error': teamNameError }">
            <td>Team: </td>
            <td>
              <div v-if="teamName && !teamNameEditing">{{ teamName }}</div>
              <select v-if="!teamName || teamNameEditing" :class="{ 'hidden': activeTeams.length == 0}" id="team-name-select" class="form-control">
                <option v-for="(team, index) in activeTeams" :key="index" :selected="team.name == teamName">
                  {{ team.name }}
                </option>
              </select>
            </td>
            <td class="button">
              <button v-if="teamName && !teamNameEditing" :disabled="!canRestructure()" class="btn btn-sm btn-secondary smaller-font" @click="changeTeamName">
                &#128393;
              </button>
            </td>
          </tr>

          <!-- Role -->

          <tr :class="{ 'error': myRoleError }">
            <td>My Role: </td>
            <td>
              <div v-if="myRole && !myRoleEditing">{{ myRole }}</div>
              <select v-if="!myRole || myRoleEditing" id="role-select" class="form-control">
                <option v-for="(role, index) in roles" :key="index" :selected="role.role == myRole">
                  {{ role.role }}
                </option>
              </select>
            </td>
            <td class="button">
              <button v-if="myRole && !myRoleEditing" :disabled="!canRestructure()" class="btn btn-sm btn-secondary smaller-font" @click="changeMyRole">
                &#128393;
              </button>
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
    myTeam() {
      return this.$store.getters.getMyTeam
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
    currentDay() {
      return this.$store.getters.getCurrentDay
    }
  },
  methods: {
    show () {
      this.$modal.show('set-up')
    },
    hide () {
      this.$modal.hide('set-up')
    },
    canRestructure: function() {
      return this.currentDay == 1 || this.myTeam.recharting
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
        myNameData = {id: uuid, name: '', captain: false}
      }
      myNameData.host = this.isHost
      if (document.getElementById('my-name')) {
        const myName = document.getElementById('my-name').value
        const captain = document.getElementById('captain').checked
        myNameData.name = stringFuns.sanitize(myName)
        myNameData.captain = captain
      }
      return myNameData
    },
    getTeamName: function() {
      let teamName = ''
      if (document.getElementById('team-name-select')) {
        teamName = document.getElementById('team-name-select').value
      } else {
        teamName = this.teamName
      }
      return teamName
    },
    getMyRole: function() {
      let myRole = ''
      if (document.getElementById('role-select')) {
        myRole = document.getElementById('role-select').value
      } else {
        myRole = this.myRole
      }
      return myRole
    },
    showErrors: function(gameName, myName, teamName) {
      if (! gameName) { this.gameNameError = true }
      if (! myName.name) { this.myNameError = true }
      if (! teamName) { this.teamNameError = true }
    },
    setLocalStorage: function(gameName, myName, teamName, myRole) {
      console.log('Setting localStorage', gameName, myName, teamName, myRole)
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
        this.socket.emit('loadGame', {gameName: gameName, teamName: teamName, myName: myName, myRole: myRole})
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
    margin: 0 auto 20px auto;

    td {
      height: 45px;

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
        width: 50px;
      }
    }

    .error {
      background-color: red;
    }
  }

</style>
