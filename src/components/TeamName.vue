<template>
  <div class="team-name" v-if="!showAbout">
    <div class="team-name text-right">
      <button class="btn btn-sm btn-secondary smaller-font" v-if="!teamName" @click="show">Set My Team</button>
      <span v-if="teamName" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">My Team is: {{teamName}}</span>
    </div>

    <modal name="set-team-name" :height="180" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Select Your Team Name</h4>
        <div class="set-team-name">
          <select :class="{ 'hidden': teams.length == 0}" id="team-name-select" class="form-control col-md-6 offset-md-2 mr-2">
            <option v-for="(team, index) in teams" :key="index">{{team.name}}</option>
          </select>
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveTeamName">Save</button>
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
  props: [
    'socket'
  ],
  methods: {
    show () {
      this.$modal.show('set-team-name');
    },
    hide () {
      this.$modal.hide('set-team-name');
    },
    saveTeamName: function() {
      var teamName = document.getElementById('team-name-select').value
      this.$store.dispatch("updateTeamName", teamName)
      localStorage.setItem("teamName", teamName);
      this.hide()
    }
  },
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    teams() {
      return this.$store.getters.getTeams
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
