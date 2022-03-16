<template>
  <canvas :id="canvas()" />
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  props: [
    'graph'
  ],
  computed: {
    modalData() {
      return this.$store.getters.getModalData
    }
  },
  mounted() {
    const ctx = document.getElementById(this.canvas()).getContext('2d')
    new Chart(ctx, {
      type: 'bar',
      data: this.modalData.data,
      options: this.modalData.options
    })
  },
  methods: {
    canvas() {
      return this.graph + '-canvas'
    }
  }
}
</script>
