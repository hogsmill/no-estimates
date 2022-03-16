<template>
  <vue-final-modal name="feedback" classes="modal-container" content-class="vfm__content modal-content" v-model="modals['setEstimates']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4>
        Set Estimates
      </h4>
      <p>
        There are <b>25</b> cards, with an average effort of <b>21</b> points per card
      </p>
      <p>
        There {{ areString() }} <b>{{ myTeamMembers }}</b> team {{ membersString() }}, and {{ eachString() }} up to <b>4</b> effort points per day
      </p>
      <p>
        You are currently on day <b>{{ currentDay }}</b>, and have completed <b>{{ completed() }}</b>
        card<span v-if="completed() != 1">s</span>.
      </p>
      <p>
        Estimates are <b>the number of days to complete the work</b>.
      </p>
      <Estimates />
      <button class="btn btn-sm btn-primary smaller-font" @click="hide()">
        Done
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import stringFuns from '../../lib/stringFuns.js'

import Estimates from './estimates/Estimates.vue'

export default {
  components: {
    VueFinalModal,
    Estimates
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    myTeamMembers() {
      return this.$store.getters.getMyTeamMembers
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    columns() {
      return this.$store.getters.getColumns
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'setEstimates')
    },
    areString() {
      return this.myTeamMembers == 1 ? 'is' : 'are'
    },
    eachString() {
      return this.myTeamMembers == 1 ? 'they have' : 'each has'
    },
    membersString() {
      return stringFuns.pluralString(this.myTeamMembers, 'member')
    },
    completed() {
      return this.columns.find(function(c) { return c.name == 'done' }).cards.length
    },
    showSetEstimates() {
      bus.emit('emitShowSetEstimates', {gameName: this.gameName, teamName: this.teamName})
    }
  }
}
</script>
