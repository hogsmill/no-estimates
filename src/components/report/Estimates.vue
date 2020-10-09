<template>
  <table class="estimates">
    <tr>
      <td>Estimate for Total Project: </td>
      <td>
        <input v-if="!projectEstimate" type="text" id="project-estimate" class="form-control" :value="projectEstimate">
        <span v-if="projectEstimate"><b>{{ projectEstimate }}</b></span>
      </td>
      <td>
        <button v-if="!projectEstimate" class="btn btn-sm btn-site-primary" :disabled="!gameName || !teamName" @click="saveTotalProject">
          Save
        </button>
        <button v-if="projectEstimate && currentDay < 2" class="btn btn-sm btn-site-primary" :disabled="!gameName || !teamName" @click="saveTotalProject">
          Change
        </button>
      </td>
      <td>
        <span v-if="!projectActual">Actual: TBD</span>
        <span v-if="projectEstimate && projectActual">Actual: <b>{{ projectActual }}</b></span>
      </td>
    </tr>
    <tr>
      <td>Estimate for MVP (Cards 1-{{ mvpCards }}): </td>
      <td>
        <input v-if="!mvpEstimate" type="text" id="mvp-estimate" class="form-control" :value="mvpEstimate">
        <span v-if="mvpEstimate"><b>{{ mvpEstimate }}</b></span>
      </td>
      <td>
        <button v-if="!mvpEstimate" class="btn btn-sm btn-site-primary" @click="saveMVP">
          Save
        </button>
        <button v-if="mvpEstimate && currentWorkCard < mvpCards" class="btn btn-sm btn-site-primary" @click="saveMVP">
          Change
        </button>
      </td>
      <td>
        <span v-if="!mvpActual">Actual: TBD</span>
        <span v-if="mvpEstimate && mvpActual">Actual: <b>{{ mvpActual }}</b></span>
      </td>
    </tr>
    <tr>
      <td>Re-estimate for Total project: </td>
      <td>
        <input v-if="!reEstimate" type="text" id="re-estimate" class="form-control" :value="reEstimate">
        <span v-if="reEstimate"><b>{{ reEstimate }}</b></span>
      </td>
      <td>
        <button v-if="!reEstimate" class="btn btn-sm btn-site-primary" @click="saveReEstimate">
          Save
        </button>
        <button v-if="reEstimate" class="btn btn-sm btn-site-primary" @click="saveReEstimate">
          Change
        </button>
      </td>
      <td>
        <span v-if="reEstimate && !projectActual">Actual: TBD</span>
        <span v-if="reEstimate && projectActual">Actual: <b>{{ projectActual }}</b></span>
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
    projectActual() {
      return this.$store.getters.getProjectActual
    },
    mvpCards() {
      return this.$store.getters.getMvpCards
    },
    mvpEstimate() {
      return this.$store.getters.getMvpEstimate
    },
    mvpActual() {
      return this.$store.getters.getMvpActual
    },
    reEstimate() {
      return this.$store.getters.getReEstimate
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    currentWorkCard() {
      return this.$store.getters.getCurrentWorkCard
    },
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

<style lang="scss">
  .estimates {
    width: 90%;
    margin: 0 auto;
    span {
      height: 36px;
      line-height: 36px;
    }
  }
</style>
