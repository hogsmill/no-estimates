<template>
  <table v-if="feature('backlogGenerated')" class="game-backlog">
    <tr>
      <td colspan="4">
        <h4>
          Delivery
        </h4>
        <i v-if="showDelivery" @click="setShowDelivery(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showDelivery" @click="setShowDelivery(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showDelivery">
      <td class="left-col">
        Delivery Type
      </td>
      <td colspan="4" class="left">
        <select id="delivery-type" @change="setDeliveryType()">
          <option value="value" :selected="config.deliveryType == 'value'">
            Value
          </option>
          <option value="satisfaction" :selected="config.deliveryType == 'satisfication'">
            Customer Satisfaction
          </option>
        </select>
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../../socket.js'

export default {
  data() {
    return {
      showDelivery: false
    }
  },
  computed: {
    config() {
      return this.$store.getters.getConfig
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  methods: {
    setShowDelivery(val) {
      this.showDelivery = val
    },
    feature(feature) {
      return Object.keys(this.config).find(function(k) {
        return k == feature
      })
    },
    setDeliveryType() {
      const deliveryType = document.getElementById('delivery-type').value
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'deliveryType', value: deliveryType})
    }
  }
}
</script>

<style lang="scss">
  .game-delivery {
  }
</style>
