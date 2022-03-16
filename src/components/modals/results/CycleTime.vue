<template>
  <vue-final-modal name="cycle-time" classes="modal-container" content-class="vfm__content modal-content" v-model="modals.results['cycleTime']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4 cycle-time">
      <h4>
        Team {{ selectedGraphTeams[1] }} Cycle Time - Time to complete card in days
      </h4>
      <table>
        <tr>
          <td>Small: </td>
          <td class="small" />
          <td>Medium: </td>
          <td class="medium" />
          <td>Large: </td>
          <td class="large" />
        </tr>
      </table>
      <div>
        <BarChart :graph="'cycle-time'" />
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
      this.$store.dispatch('hideResultModal', 'cycleTime')
    }
  }
}
</script>
