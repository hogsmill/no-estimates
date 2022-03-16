<template>
  <vue-final-modal name="wip" classes="modal-container" content-class="vfm__content modal-content" v-model="modals.results['wip']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4 wip">
      <h4>
        Team {{ selectedGraphTeams[1] }} WIP Trend - No. of Cards in Play
        <span v-if="graphConfig.wip.useMovingAverage">(Moving Average,</span>
        <span v-if="!graphConfig.wip.useMovingAverage">(Raw Data,</span>
        <span v-if="graphConfig.wip.useDays"> per Day)</span>
        <span v-if="!graphConfig.wip.useDays"> per Move)</span>
      </h4>
      <div>
        Average: {{ modalData.average }}
      </div>
      <div>
        <LineChart :graph="'wip'" />
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import LineChart from '../../graphs/LineChart.vue'

export default {
  components: {
    VueFinalModal,
    LineChart
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    currency() {
      return this.$store.getters.getCurrency
    },
    modalData() {
      return this.$store.getters.getModalData
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
      this.$store.dispatch('hideResultModal', 'wip')
    }
  }
}
</script>
