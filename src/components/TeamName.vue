<template>
  <div class="team-name" v-if="!showFacilitator && gameName && myName.id">
    <div class="team-name text-right">
      <button class="btn btn-sm btn-secondary smaller-font" v-if="!teamName" @click="show">
        Set My Team
      </button>
      <span v-if="teamName" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">My Team is: {{ teamName }}</span>
    </div>

    <modal name="set-team-name" :height="180" class="rounded">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Select Your Team Name</h4>
        <div class="set-team-name">
          <select :class="{ 'hidden': activeTeams.length == 0}" id="team-name-select" class="form-control col-md-6 offset-md-2 mr-2">
            <option v-for="(team, index) in activeTeams" :key="index" :selected="team.name == teamName">
              {{ team.name }}
            </option>
          </select>
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveTeamName">
            Save
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      myTeamName: ''
    }
  },
  computed: {
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
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
    myRole() {
      return this.$store.getters.getMyRole
    },
    activeTeams() {
      return this.$store.getters.getActiveTeams
    }
  },
  methods: {
    show () {
      this.$modal.show('set-team-name')
    },
    hide () {
      this.$modal.hide('set-team-name')
    },
    saveTeamName: function() {
      const teamName = document.getElementById('team-name-select').value
      this.$store.dispatch('updateTeamName', teamName)
      localStorage.setItem('teamName', teamName)
      if (!this.teamName) {
        window.bus.$emit('loadGame', {gameName: this.gameName, teamName: teamName})
      } else if (teamName && this.gameName) {
        window.bus.$emit('updateTeamName', {gameName: this.gameName, teamName: teamName, role: this.myRole, name: this.myName})
      }
      this.hide()
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
