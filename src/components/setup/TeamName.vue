<template>
  <tr>
    <td>
      Team
    </td>
    <td v-if="teamName && !change">
      <span class="setup-label">{{ teamName }}</span>
      <button class="btn btn-sm btn-secondary smaller-font setup-change" @click="changeTeamName">
        &#128393;
      </button>
    </td>
    <td v-if="!teamName || change">
      <select :class="{ 'hidden': activeTeams.length == 0}" id="team-name-select" class="form-control  setup-input col-md-6 offset-md-2 mr-2">
        <option v-for="(team, index) in activeTeams" :key="index" :selected="team.name == teamName">
          {{ team.name }}
        </option>
      </select>
      <button class="btn btn-sm btn-secondary smaller-font save-button" @click="saveTeamName">
        Save
      </button>
    </td>
  </tr>
</template>

<script>
export default {
  data() {
    return {
      change: false
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    myRole() {
      return this.$store.getters.getMyRole
    },
    activeTeams() {
      return this.$store.getters.getActiveTeams
    }
  },
  methods: {
    changeTeamName: function() {
      this.change = true
      this.$store.dispatch('settingUp', {setting: 'Team Name', value: true})
    },
    saveTeamName: function() {
      const teamName = document.getElementById('team-name-select').value
      this.$store.dispatch('updateTeamName', teamName)
      localStorage.setItem('teamName', teamName)
      if (!this.teamName && this.gameName) {
        this.$bus.$emit('loadGame', {gameName: this.gameName, teamName: teamName})
      } else if (teamName && this.gameName) {
        this.$bus.$emit('updateTeamName', {gameName: this.gameName, teamName: teamName, role: this.myRole, name: this.myName})
      }
      this.change = false
      this.$store.dispatch('settingUp', {setting: 'Team Name', value: false})
    }
  }
}
</script>

<style lang="scss">
  .team-name {
    padding: 0 6px;
    display: inline-block;
  }

  .set-team-name {
    display: flex;
  }

</style>
