<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: [
    'chartdata',
    'options'
  ],
  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
}
</script>

<style lang="scss">
  canvas {
    margin: 24px;
    width: 680px !important;
    height: 400px;
  }
</style>
