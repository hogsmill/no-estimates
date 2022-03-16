<template>
  <vue-final-modal name="monte-carlo" classes="modal-container" content-class="vfm__content modal-content" v-model="modals.results['monteCarlo']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4 monte-carlo">
      <h4>
        Team {{ selectedGraphTeams[1] }} Monte Carlo: {{ parseInt(graphConfig.monteCarlo.runs).toLocaleString() }} runs to complete {{ monteCarloCards() }} cards
      </h4>
      <div class="estimates">
        <div v-if="graphConfig.monteCarlo.runTo == 'Remaining'">
          <span v-if="modalData.projectEstimate">Initial Estimate: <b>{{ modalData.projectEstimate }}</b> days</span>
          <span v-if="modalData.reEstimate">- Re-estimate: <b>{{ modalData.reEstimate }}</b> days</span>
        </div>
      </div>
      <div class="monte-carlo-percentiles rounded">
        Probability of completing cards:
        <ul>
          <li><div class="grey" /> 50% in <b>{{ modalData.percentiles[50] }}</b> days </li>
          <li><div class="green" /> 75% in <b>{{ modalData.percentiles[75] }}</b> days </li>
          <li><div class="orange" /> 90% in <b>{{ modalData.percentiles[90] }}</b> days </li>
          <li><div class="yellow" /> 95% in <b>{{ modalData.percentiles[95] }}</b> days </li>
          <li><div class="red" /> 99% in <b>{{ modalData.percentiles[99] }}</b> days </li>
        </ul>
      </div>
      <div>
        <BarChart :graph="'monte-carlo'" />
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
    modalData() {
      return this.$store.getters.getModalData
    },
    graphConfig() {
      return this.$store.getters.getGraphConfig
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideResultModal', 'monteCarlo')
    },
    monteCarloCards() {
      let runTo
      if (this.graphConfig.monteCarlo.runTo == 'Remaining') {
        runTo = 'the remaining ' + this.modalData.cardsLeft
      } else {
        runTo = this.graphConfig.monteCarlo.runTo
      }
      return runTo
    }
  }
}
</script>
