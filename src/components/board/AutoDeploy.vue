<template>
  <div class="auto-deploy">
    <div class="deploy-card-header">
      Auto Deploy
    </div>
    <div class="deploy-card-effort" @click="addEffort('auto-deploy')">
      <div class="deploy-card-column column rounded-circle">
        A
      </div>
      <div v-for="n in 8" :key="n" class="deploy-card-column rounded-circle" :class="{'assigned' : n <= myTeam.autoDeploy.effort}" />
    </div>

    <modal class="autodeploy-popup" name="autodeploy-popup" :height="150" :classes="['rounded']">
      <div class="text-right">
        <span @click="hide" class="glyphicon glyphicon-star">x</span>
      </div>
      <h4>Unable to Assign Effort</h4>
      <p v-html="message"></p>
      <div class="button">
        <button class="btn btn-sm btn-info" @click="hide()">
          OK
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
import roles from '../../lib/roles.js'

export default {
  data() {
    return {
      message: ''
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
    myRole() {
      return this.$store.getters.getMyRole
    },
    myOtherRoles() {
      return this.$store.getters.getMyOtherRoles
    },
    myEffort() {
      return this.$store.getters.getMyEffort
    }
  },
  mounted() {
    window.bus.$on('incrementAutoDeploy', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('incrementAutoDeploy', data)
      }
    })
  },
  methods: {
    show () {
      this.$modal.show('autodeploy-popup')
    },
    hide () {
      this.message = ''
      this.$modal.hide('autodeploy-popup')
    },
    addEffort() {
      const effort = roles.iHaveRole('deploy', this.myRole, this.myOtherRoles) ? 1 : 2
      if (this.myEffort.available >= effort) {
        this.$store.dispatch('updateMyAssignedEffort', {effort: effort})
        window.bus.$emit('incrementAutoDeploy', {gameName: this.gameName, teamName: this.teamName})
        window.bus.$emit('updatePersonAutoDeployEffort', {gameName: this.gameName, teamName: this.teamName, name: this.myName})
      } else {
        this.message = 'No effort available'
        this.show()
      }
    }
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
