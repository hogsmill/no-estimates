<template>
  <span>

    <button class="btn btn-sm btn-secondary smaller-font" :disabled="!gameName || !teamName || !canChangeRole()" @click="show">
      Set Role
    </button>

    <modal name="set-up-role" :height="190" class="rounded">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Role Set Up</h4>
        <table class="setup-table">
          <MyRole />
        </table>
        <button class="btn btn-sm btn-primary smaller-font" @click="hide">
          Done
        </button>
      </div>
    </modal>
  </span>
</template>

<script>
import MyRole from './setup/MyRole.vue'

export default {
  components: {
    MyRole
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
    currentDay() {
      return this.$store.getters.getCurrentDay
    }
  },
  methods: {
    show () {
      this.$modal.show('set-up-role')
    },
    hide () {
      this.$modal.hide('set-up-role')
    },
    canChangeRole: function() {
      return this.currentDay == 1 || this.myTeam.recharting
    },
  }
}
</script>
