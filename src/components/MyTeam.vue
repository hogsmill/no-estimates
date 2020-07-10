<template>
  <div class="my-team" v-if="!showAbout">
    <div class="my-team text-right">
      <button class="btn btn-sm btn-info" v-if="!myTeam" @click="show">Set My Team</button>
      <span v-if="myTeam" @click="show">My Team is: {{myTeam}}</span>
    </div>

    <modal name="set-my-team" :height="180" :classes="['rounded']">
      <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
      <h4>Enter<span v-if="teams.length"> or Select</span> Your Team Name</h4>
      <div class="set-my-team">
        <input type="text" id="my-team" class="form-control" />
        <select :class="{ 'hidden': teams.length == 0}" id="my-team-select" class="form-control">
          <option v-for="(team, index) in teams" :key="index">{{team}}</option>
        </select>
        <button class="btn btn-sm btn-info" @click="saveMyTeam">Save</button>
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
      this.$modal.show('set-my-team');
    },
    hide () {
      this.$modal.hide('set-my-team');
    },
    saveMyTeam: function() {
      var myTeam = document.getElementById('my-team').value
        ? document.getElementById('my-team').value
        : document.getElementById('my-team-select').value
      this.$store.dispatch("updateMyTeam", myTeam)
      this.socket.emit("addMyTeam", {gameName: this.gameName, team: myTeam })
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
    myTeam() {
      return this.$store.getters.getMyTeam
    },
    teams() {
      return this.$store.getters.getTeams
    }
  },
  mounted() {
    this.socket.on("addMyTeam", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("addTeam", data.team)
      }
    })
  }
}
</script>

<style>
  .my-team { padding-right: 2px; }
  .my-team button { font-size: smaller; background-color: #aaa; border: 1px solid #aaa; }
  .my-team button:hover { color: #aaa; background-color: #fff; }
  .set-my-team-modal { height: 120px; }

  #my-team { display: inline-block; width: 30%; margin-right: 6px; }
  #my-team-select { width: 50%; margin: 0 auto; }

</style>
