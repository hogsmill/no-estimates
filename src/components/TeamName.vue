<template>
  <div class="team-name" v-if="!showAbout">
    <div class="team-name text-right">
      <button class="btn btn-sm btn-info" v-if="!teamName" @click="show">Set My Team</button>
      <span v-if="teamName" @click="show">My Team is: {{teamName}}</span>
    </div>

    <modal name="set-team-name" :height="180" :classes="['rounded']">
      <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
      <h4>Enter<span v-if="teams.length"> or Select</span> Your Team Name</h4>
      <div class="set-team-name">
        <select :class="{ 'hidden': teams.length == 0}" id="team-name-select" class="form-control">
          <option v-for="(team, index) in teams" :key="index">{{team}}</option>
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
      this.socket.emit("addTeamName", {gameName: this.gameName, team: teamName })
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
  },
  mounted() {
    this.socket.on("addTeamName", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("addTeam", data.team)
      }
    })
  }
}
</script>

<style>
  .team-name { padding-right: 2px; }
  .team-name button { font-size: smaller; background-color: #aaa; border: 1px solid #aaa; }
  .team-name button:hover { color: #aaa; background-color: #fff; }
  .set-team-name-modal { height: 120px; }

  #team-name { display: inline-block; width: 30%; margin-right: 6px; }
  #team-name-select { width: 50%; margin: 0 auto; }

</style>
