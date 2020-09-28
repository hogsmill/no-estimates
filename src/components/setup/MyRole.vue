<template>
  <tr>
    <td>
      Role
    </td>
    <td v-if="myRole && !change">
      <span class="setup-label">{{ myRole }}</span>
      <button class="btn btn-sm btn-secondary smaller-font" @click="changeMyRole">
        Change
      </button>
    </td>
    <td v-if="!myRole || change">
      <select id="role-select" class="form-control setup-input col-md-6 offset-md-2 mr-2">
        <option v-for="(role, index) in roles" :key="index" :selected="role.role == myRole">
          {{ role.role }}
        </option>
      </select>
      <button class="btn btn-sm btn-secondary smaller-font" @click="saveMyRole">
        Save
      </button>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      change: false
    }
  },
  computed: {
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
  methods: {
    changeMyRole: function() {
      this.change = true
    },
    saveMyRole: function() {
      const myRole = document.getElementById('role-select').value
      this.$store.dispatch('updateMyRole', myRole)
      localStorage.setItem('myRole', myRole)
      if (myRole && this.gameName && this.teamName) {
        this.socket.emit('updateRole', {gameName: this.gameName, teamName: this.teamName, name: this.myName, role: myRole })
      }
      this.change = false
    }
  }
}
</script>

<style lang="scss">

</style>
