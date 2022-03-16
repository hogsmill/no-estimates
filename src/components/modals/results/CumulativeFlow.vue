<template>
  <vue-final-modal name="cumulative-flow" classes="modal-container" content-class="vfm__content modal-content" v-model="modals.results['cumulativeFlow']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4 cumulative-flow">
      <h4>
        Team {{ selectedGraphTeams[1] }} Cumulative Flow
        <span v-if="graphConfig.cumulativeFlow.useDays">(per Day)</span>
        <span v-if="!graphConfig.cumulativeFlow.useDays">(per Move)</span>
      </h4>
      <div>
        <BarChart :graph="'cumulative-flow'" />
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
    },
    graphConfig() {
      return this.$store.getters.getGraphConfig
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideResultModal', 'cumulativeFlow')
    }
  }
}
</script>
