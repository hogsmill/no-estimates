<template>
  <vue-final-modal name="value-delivered" classes="modal-container" content-class="vfm__content modal-content" v-model="modals.results['valueDelivered']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4 value-delivered">
      <h4>
        Value Delivered per team <span v-if="currency">({{ currency.symbol }})</span>
      </h4>
      <div class="key">
        <div class="winner" />
        Winner
      </div>
      <div class="key">
        <div class="positive" />
        Positive
      </div>
      <div class="key">
        <div class="negative" />
        Negative
      </div>
      <div>
        <BarChart :graph="'value-delivered'" />
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
    currency() {
      return this.$store.getters.getCurrency
    }
  },
  methods: {
    hide(modal) {
      this.$store.dispatch('hideResultModal', 'valueDelivered')
    }
  }
}
</script>
