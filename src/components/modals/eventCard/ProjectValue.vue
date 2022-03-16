<template>
  <h5 class="current-value" :class="{ 'negative': total() < 1 }">
    Current Value Delivered: {{ currency.symbol }}{{ total() }}
    <span v-if="cards != null"><br>Current Cards Delivered:  {{ cards }}</span>
  </h5>
</template>

<script>
export default {
  props: [
    'cards'
  ],
  computed: {
    currency() {
      return this.$store.getters.getCurrency
    },
    workCards() {
      return this.$store.getters.getWorkCards
    }
  },
  methods: {
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
    background-color: green;
    color: white;

    &.negative {
      background-color: red;
      color: white;
    }
  }
</style>
