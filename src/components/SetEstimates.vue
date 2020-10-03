<template>
  <span>

    <button class="btn btn-sm btn-secondary smaller-font" :disabled="!gameName || !teamName" @click="show">
      Set Estimates
    </button>

    <modal name="set-up-estimates" :height="400" class="rounded">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Set Estimates</h4>
        <p>There are <b>25</b> cards, with an average effort of <b>21</b> points per card</p>
        <p>There are <b>{{ noOfMembers() }}</b> team members, and each has up to <b>4</b> effort points per day</p>
        <p>You are currently on day <b>{{ currentDay }}</b>, and have completed <b>{{ completed() }}</b>
          card<span v-if="completed() != 1">s</span>.</p>
        <p>Estimates are in days to complete the work.</p>
        <Estimates :socket="socket" />
        <button class="btn btn-sm btn-primary smaller-font" @click="hide">
          Done
        </button>
      </div>
    </modal>

  </span>
</template>

<script>
import Estimates from './report/Estimates.vue'

export default {
  components: {
    Estimates
  },

  computed: {
    gameState() {
      return this.$store.getters.getGameState
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    columns() {
      return this.$store.getters.getColumns
    },
  },
  methods: {
    show () {
      this.$modal.show('set-up-estimates')
    },
    hide () {
      this.$modal.hide('set-up-estimates')
    },
    noOfMembers() {
      let members = 0
      for (let i = 0; i < this.gameState.length; i++) {
        if (this.gameState[i].name == this.teamName) {
          members = this.gameState[i].members.length
        }
      }
      return members
    },
    completed() {
      return this.columns.find(function(c) { return c.name == 'done' }).cards.length
    }
  }
}
</script>
