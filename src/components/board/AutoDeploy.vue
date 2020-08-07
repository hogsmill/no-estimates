<template>
  <div class="auto-deploy">
    <div class="deploy-card-header">Auto Deploy</div>
    <div class="deploy-card-effort">
      <div class="deploy-card-column column rounded-circle" @click="addEffort('auto-deploy')">A</div>
      <div v-for="n in 8" :key="n" class="deploy-card-column rounded-circle" :class="{'assigned' : n <= myTeam.autoDeploy.effort}"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  methods: {
    addEffort() {
      if (this.myEffort.available > 0) {
        this.$store.dispatch("updateMyAssignedEffort", {effort: 1})
        this.socket.emit("incrementAutoDeploy", {gameName: this.gameName, teamName: this.teamName})
        this.socket.emit("updatePersonAutoDeployEffort", {gameName: this.gameName, teamName: this.teamName, name: this.myName})
      }
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    myTeam() {
      return this.$store.getters.getMyTeam
    },
    myName() {
      return this.$store.getters.getMyName
    },
    myEffort() {
      return this.$store.getters.getMyEffort
    }
  },
  mounted() {
    this.socket.on("incrementAutoDeploy", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("incrementAutoDeploy", data)
      }
    })
  }
}
</script>
<style lang="scss">

  .auto-deploy {
    background-color: #fff;
    color: #444;
    margin: 6px;

    .deploy-card-header {
      font-weight: bold;
    }

    .deploy-card-effort {
      text-align: left;

      .deploy-card-column {
        display: inline-block;
        border: 1px solid;
        margin-left: 1px;
        width: 8px;
        height: 8px;
        font-size: 8px;
        padding-left: 2px;

        &.column {
          background-color: #555;
          color: #fff;
          border: 0;
          display: inline-block;
          width: 11px;
          height: 11px;
          font-size: 8px;
          padding-left: 2px;
        }
      }

      .assigned {
        background-color: #000;
      }
    }
  }
</style>
