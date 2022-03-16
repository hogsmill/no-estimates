<template>
  <vue-final-modal name="flow-efficiency" classes="modal-container" content-class="vfm__content modal-content" v-model="modals.results['flowEfficiency']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide('flow-efficiency')" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4 flow-efficiency">
      <h4>
        Flow Efficiency
      </h4>
      <p>
        Ratio of days cards worked on / days cards worked on + days cards not worked on
      </p>
      <div class="flow-efficiency-labels">
        <div class="positive-flow-efficiency">
          Perfect flow
        </div>
        <div class="negative-flow-efficiency">
          Worst flow
        </div>
      </div>
      <div class="graphs-holder">
        <div v-for="(n, index) in Object.keys(selectedGraphTeams).length" :key="index">
          <FlowEfficiency v-if="selectedGraphTeams[n]" :team="selectedGraphTeams[n]" :flow-efficiency="modalData[n]" />
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import FlowEfficiency from '../../graphs/FlowEfficiency.vue'

export default {
  components: {
    VueFinalModal,
    FlowEfficiency
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    modalData() {
      return this.$store.getters.getModalData
    },
    selectedGraphTeams() {
      return this.$store.getters.getSelectedGraphTeams
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideResultModal', 'flowEfficiency')
    }
  }
}
</script>
