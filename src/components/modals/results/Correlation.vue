<template>
  <vue-final-modal name="correlation" classes="modal-container" content-class="vfm__content modal-content" v-model="modals.results['correlation']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4 correlation">
      <h4>
        Correlation
      </h4>
      <p>
        Correlation between Effort and Delivery Time:
      </p>
      <div class="correlation-labels">
        <div class="positive-correlation">
          Perfect correlation
        </div>
        <div class="negative-correlation">
          Perfect negative correlation
        </div>
        <div class="no-correlation">
          No correlation
        </div>
      </div>
      <div class="graphs-holder">
        <div v-for="(n, index) in Object.keys(selectedGraphTeams).length" :key="index">
          <Correlation v-if="selectedGraphTeams[n]" :team="selectedGraphTeams[n]" :correlation="modalData[n]" />
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import Correlation from '../../graphs/Correlation.vue'

export default {
  components: {
    VueFinalModal,
    Correlation
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
      this.$store.dispatch('hideResultModal', 'correlation')
    }
  }
}
</script>
