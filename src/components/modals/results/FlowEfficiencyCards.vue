<template>
  <vue-final-modal name="flow-efficiency-cards" classes="modal-container" content-class="vfm__content modal-content" v-model="modals.results['flowEfficiencyCards']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide('flow-efficiency-cards')" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4 flow-efficiency">
      <h4>
        Flow Efficiency (Selected Cards, Team {{ selectedGraphTeams[1] }})
      </h4>
      <div class="flow-efficiency-card-key">
        <div class="working-on" /> Worked On
        <div class="waiting" /> Waiting
      </div>
      <FlowEfficiencyCard :type="'Worst'" :card="modalData[0]" />
      <FlowEfficiencyCard :type="'Best'" :card="modalData[1]" />
      <FlowEfficiencyCard :type="'Longest in play'" :card="modalData[2]" />
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import FlowEfficiencyCard from '../../graphs/FlowEfficiencyCard.vue'

export default {
  components: {
    VueFinalModal,
    FlowEfficiencyCard
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
      this.$store.dispatch('hideResultModal', 'flowEfficiencyCards')
    }
  }
}
</script>
