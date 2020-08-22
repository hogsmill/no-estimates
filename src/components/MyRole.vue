<template>
  <div class="role-name" v-if="!showFacilitator && gameName && myName.id && teamName">
    <div class="role-name text-right">
      <button class="btn btn-sm btn-secondary smaller-font" v-if="!myRole" @click="show" :disabled="!myName">Set My Speciality</button>
      <span v-if="myRole && canChangeRole()" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">
        My Role is: {{myRole}}
        <span class="change-roles-allowed" title="Changing roles allowed">&#10003;</span>
      </span>
      <span v-if="myRole && !canChangeRole()" class="mr-2 mt-2 pointer p-2 bg-light">
        My Role is: {{myRole}}
        <span title="Changing roles not allowed">&#9940;</span>
      </span>
    </div>

    <modal name="set-role" :height="180" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Select Your Speciality</h4>
        <div class="set-role">
          <select id="role-select" class="form-control col-md-6 offset-md-2 mr-2">
            <option v-for="(role, index) in roles" :key="index">{{role.role}}</option>
          </select>
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveMyRole">Save</button>
        </div>
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
    canChangeRole: function() {
      return this.currentDay == 1 || this.myTeam.recharting
    },
    saveMyRole: function() {
      var myRole = document.getElementById('role-select').value
      this.$store.dispatch("updateMyRole", myRole)
      localStorage.setItem("myRole", myRole);
      if (myRole && this.gameName && this.teamName) {
        this.socket.emit("updateRole", {gameName: this.gameName, teamName: this.teamName, name: this.myName, role: myRole })
      }
      this.hide()
    }
  },
  computed: {
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
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
    myTeam() {
      return this.$store.getters.getMyTeam
    },
    roles() {
      return this.$store.getters.getRoles
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    }
  }
}
</script>

<style lang="scss">

  .change-roles-allowed {
    font-weight: bold;
    color: green;
  }
  .role-name {
    padding: 0 6px;
    display: inline-block;
  }

  .set-role-modal {
    height: 120px;
  }

  .set-role {
    display: flex;
  }

</style>
