<template>
  <vue-final-modal name="scatter-plot" classes="modal-container" content-class="vfm__content modal-content" v-model="modals.results['scatterPlot']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4 scatter-plot">
      <h4>
        Team {{ selectedGraphTeams[1] }} Scatter Plot
      </h4>
      <p>
        <span class="key l75">75%</span> of cards completed in {{ modalData.limits[75] }} days,
        <span class="key l90">90%</span> in {{ modalData.limits[90] }} days,
        <span class="key l95">95%</span> in {{ modalData.limits[95] }} days and
        <span class="key l99">99%</span> in {{ modalData.limits[99] }} days
      </p>
      <div>
        <ScatterPlot :graph="'scatter-plot'" />
      </div>
      <div class="line l0" :style="{ 'top': scatterPlotCanvasTop + 'px' }" />
      <div class="line l100" :style="{ 'top': scatterPlotCanvasBottom + 'px' }" />
      <div class="line l75" :style="{ 'top': scatterPlotLine(75) + 'px' }" />
      <div class="line l90" :style="{ 'top': scatterPlotLine(90) + 'px' }" />
      <div class="line l95" :style="{ 'top': scatterPlotLine(95) + 'px' }" />
      <div class="line l99" :style="{ 'top': scatterPlotLine(99) + 'px' }" />
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import maths from '../../../lib/maths.js'

import ScatterPlot from '../../graphs/ScatterPlot.vue'

export default {
  components: {
    VueFinalModal,
    ScatterPlot
  },
  data() {
    return {
      scatterPlotCanvasTop: 105,
      scatterPlotCanvasBottom: 645
    }
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
      this.$store.dispatch('hideResultModal', 'scatterPlot')
    },
    scatterPlotLine(n) {
      const range = this.scatterPlotCanvasBottom - this.scatterPlotCanvasTop
      const maxDay = maths.maxOfKey(this.modalData.data.datasets[0].data, 'y')
      const unit = range / maxDay
      const limit = maxDay - this.modalData.limits[n]
      return this.scatterPlotCanvasTop + (limit * unit)
    },
  }
}
</script>

<style lang="scss">
.scatter-plot {
  position: relative;

  .key {
    color:#fff;
    padding: 4px;
  }

  .line {
    height: 1px;
    color: #fff;
    border-style: dashed;
    width: 571px;
    margin-left: 24px;
    background-color: red;
    position: absolute;
    top: 10px;
    left: 102px;
  }

  .l0 { background-color: 000;     border-style: initial; }
  .l100 { background-color: #888;     border-style: initial;}

  .l75 {
    background-color: green;
  }
  .l90 {
    background-color: blue;
  }
  .l95 {
    background-color: purple;
  }
  .l99 {
    background-color: red;
  }
}
</style>
