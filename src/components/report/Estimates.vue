<template>
  <table class="estimates">
    <tr>
      <td>Estimate for Total Project: </td>
      <td><input type="text" id="project-estimate" class="form-control" :value="projectEstimate"></td>
      <td>
        <button class="btn btn-sm btn-site-primary" :disabled="!gameName || !teamName" @click="saveTotalProject">
          Save
        </button>
      </td>
    </tr>
    <tr>
      <td>Estimate for MVP (#1-11): </td>
      <td><input type="text" id="mvp-estimate" class="form-control" :value="mvpEstimate"></td>
      <td>
        <button class="btn btn-sm btn-site-primary" @click="saveMVP">
          Save
        </button>
      </td>
    </tr>
    <tr>
      <td>Re-estimate for Total project: </td>
      <td><input type="text" id="re-estimate" class="form-control" :value="reEstimate"></td>
      <td>
        <button class="btn btn-sm btn-site-primary" @click="saveReEstimate">
          Save
        </button>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    projectEstimate() {
      return this.$store.getters.getProjectEstimate
    },
    mvpEstimate() {
      return this.$store.getters.getMVPEstimate
    },
    reEstimate() {
      return this.$store.getters.getReEstimate
    }
  },
  mounted() {
    this.socket.on('updateProjectEstimate', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('updateProjectEstimate', data)
      }
    })
    this.socket.on('updateMVPEstimate', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('updateMVPEstimate', data)
      }
    })
    this.socket.on('updateReEstimate', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('updateReEstimate', data)
      }
    })
  },
  methods: {
    saveTotalProject() {
      const estimate = document.getElementById('project-estimate').value
      this.socket.emit('updateProjectEstimate', {gameName: this.gameName, teamName: this.teamName, projectEstimate: estimate})
    },
    saveMVP() {
      const estimate = document.getElementById('mvp-estimate').value
      this.socket.emit('updateMVPEstimate', {gameName: this.gameName, teamName: this.teamName, mvpEstimate: estimate})
    },
    saveReEstimate() {
      const estimate = document.getElementById('re-estimate').value
      this.socket.emit('updateReEstimate', {gameName: this.gameName, teamName: this.teamName, reEstimate: estimate})
    }
  }
}
</script>
