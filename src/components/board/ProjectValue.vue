<template>
  <h5 class="current-value" :class="{ 'negative': total() < 1 }">
    Current Value Delivered: {{ currencyLabel() }}{{ total() }}
  </h5>
</template>

<script>
import stringFuns from '../../lib/stringFuns.js'

export default {
  computed: {
    currency() {
      return this.$store.getters.getCurrency
    },
    workCards() {
      return this.$store.getters.getWorkCards
    }
  },
  methods: {
    currencyLabel() {
      return stringFuns.htmlDecode(this.currency)
    },
    total() {
      let total = 0
      for (let i = 0; i < this.workCards.length; i++) {
        if (this.workCards[i].value) {
          total += this.workCards[i].value
        }
      }
      return total
    }
  }
}
</script>

<style lang="scss">
  h5 {
    margin: 12px auto;
    padding: 8px;
    font-weight: bold;
    font-size: large;

    &.negative {
      background-color: red;
      color: white;
    }
  }
</style>
