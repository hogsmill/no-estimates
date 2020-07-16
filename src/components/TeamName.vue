<template>
  <div class="team-name" v-if="!showAbout">
    <div class="team-name text-right">
      <button class="btn btn-sm btn-info" v-if="!teamName" @click="show">Set My Team</button>
      <span v-if="teamName" @click="show">My Team is: {{teamName}}</span>
    </div>

    <modal name="set-team-name" :height="180" :classes="['rounded']">
      <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
      <h4>Select Your Team Name</h4>
      <div class="set-team-name">
        <select :class="{ 'hidden': teams.length == 0}" id="team-name-select" class="form-control">
          <option v-for="(team, index) in teams" :key="index">{{team.name}}</option>
        </select>
        <button class="btn btn-sm btn-info" @click="saveTeamName">Save</button>
      </div>
    </modal>

  </div>
</template>

<script>
export default {
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

    button {
      font-size: smaller;
      background-color: #aaa;
      border: 1px solid #aaa;

      &:hover {
        color: #aaa;
        background-color: #fff;
      }
    }
  }

  .set-team-name {
    select {
      width: 50%; margin: 0 auto;
    }
  }

</style>
