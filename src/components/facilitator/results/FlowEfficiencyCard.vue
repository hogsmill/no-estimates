<template>
  <div class="flow-efficiency-card">
    <h5>
      {{ type }}: Card #{{ card.card.number }}, in play for {{ resultLength }} day<span v-if="resultLength != 1">s</span>, flow efficiency {{ card.flowEfficiency }}
    </h5>
    <div v-for="(n, index) in flowResult(card)" :key="index"
         class="flow-result"
         :class="{ 'worked-on' : n.workedOn, 'rounded-left': index == 0, 'rounded-right': index == resultLength - 1 }"
         :style="{ 'width': resultWidth + 'px' }"
    />
  </div>
</template>

<script>
export default {
  props: [
    'type',
    'card'
  ],
  data() {
    return {
      resultLength: 1,
      resultWidth: 50
    }
  },
  created() {
    this.resultLength = this.card.card.delivery - this.card.card.commit + 1
    this.resultWidth = parseInt(800 / this.resultLength)
  },
  methods: {
    workedOn(n) {
      return this.card.card.daysWorkedOn.find(function(c) {
        return c == n
      }) ? true : false
    },
    flowResult() {
      const result = []
      for (let i = this.card.card.commit; i <= this.card.card.delivery; i++) {
        result.push({
          n: i,
          workedOn: this.workedOn(i)
        })
      }
      return result
    }
  }
}
</script>

<style lang="scss">
  .flow-efficiency-card {
    width: 800px;
    margin: 24px auto 32px auto;

    h5 {
      background-color: initial;
      color: #444;
      font-weight: initial;
    }

    .flow-result {
      height: 32px;
      background-color: #f5270d;
      display: inline-block;
      border-right: 1px solid #444;

      &.worked-on {
        background-color: #339933;
      }
    }
  }
</style>
