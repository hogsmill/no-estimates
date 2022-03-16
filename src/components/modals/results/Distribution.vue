<template>
  <vue-final-modal name="distribution" classes="modal-container" content-class="vfm__content modal-content" v-model="modals.results['distribution']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide('distribution')" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4 cycle-time">
      <h4>
        Team {{ selectedGraphTeams[1] }} Distribution
      </h4>
      <div>
        <BarChart :graph="'distribution'" />
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import BarChart from '../../graphs/BarChart.vue'

export default {
  components: {
    VueFinalModal,
    BarChart
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    selectedGraphTeams() {
      return this.$store.getters.getSelectedGraphTeams
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideResultModal', 'distribution')
    }
  }
}
</script>
