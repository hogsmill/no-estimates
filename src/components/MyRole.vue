<template>
  <div class="role-name" v-if="!showAbout">
    <div class="role-name text-right">
      <button class="btn btn-sm btn-info" v-if="!myRole" @click="show">Set My Speciality</button>
      <span v-if="myRole" @click="show">My Role is: {{myRole}}</span>
    </div>

    <modal name="set-role" :height="180" :classes="['rounded']">
      <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
      <h4>Select Your Speciality</h4>
      <div class="set-role">
        <select id="role-select" class="form-control">
          <option v-for="(role, index) in roles" :key="index">{{role.role}}</option>
        </select>
        <button class="btn btn-sm btn-info" @click="saveMyRole">Save</button>
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
      this.$modal.show('set-role');
    },
    hide () {
      this.$modal.hide('set-role');
    },
    saveMyRole: function() {
      var role = document.getElementById('role-select').value
      this.socket.emit("updateRole", {gameName: this.gameName, teamName: this.teamName, myName: this.myName, role: role })
      this.hide()
    }
  },
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    myName() {
      return this.$store.getters.getMyName
    },
    myRole() {
      return this.$store.getters.getMyRole
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    roles() {
      return this.$store.getters.getRoles
    }
  },
  mounted() {
    //this.socket.on("addTeamName", (data) => {
    //  if (this.gameName == data.gameName) {
    //    this.$store.dispatch("addTeam", data.team)
    //  }
    //})
  }
}
</script>

<style>
  .role-name {padding: 0 6px; display: inline-block; }
  .role-name button { font-size: smaller; background-color: #aaa; border: 1px solid #aaa; }
  .role-name button:hover { color: #aaa; background-color: #fff; }
  .set-role-modal { height: 120px; }

  #role-select { width: 50%; margin: 0 auto; }
</style>
