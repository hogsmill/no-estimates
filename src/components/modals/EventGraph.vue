<template>
  <vue-final-modal name="event-graph" classes="modal-container" content-class="vfm__content modal-content" v-model="modals.results['eventGraph']">
    <div>
      <h4>Day {{ currentDay + 1 }}</h4>
      <ProjectValue />
      <div v-if="currentEventCard.function == 'Show Cycle Time'" class="event-card-graph">
        <p v-html="currentEventCard.text" />
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
        <BarChart :graph="'event-card'" />
      </div>
      <div class="event-card-buttons">
        <button class="btn btn-sm btn-info" @click="doneGraph()">
          Done
        </button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import ProjectValue from './eventCard/ProjectValue.vue'
import BarChart from '../graphs/BarChart.vue'

export default {
  components: {
    VueFinalModal,
    ProjectValue,
    BarChart
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    currentEventCard() {
      return this.$store.getters.getCurrentEventCard
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    myName() {
      return this.$store.getters.getMyName
    }
  },
  methods: {
    doneGraph() {
      if (this.myName.captain) {
        bus.emit('sendUpdateCurrentDay', {gameName: this.gameName, teamName: this.teamName})
      }
      this.$store.dispatch('hideResultModal', 'eventGraph')
    }
  }
}
</script>
