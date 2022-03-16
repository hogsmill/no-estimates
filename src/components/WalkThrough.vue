<template>
  <button v-if="!showFacilitator" class="btn btn-sm btn-info explain" @click="show()">
    Explain this for me...
  </button>
</template>

<script>
export default {
  computed: {
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
    }
  },
  methods: {
    show() {
      this.$store.dispatch('showModal', 'walkThrough')
    }
  }
}
</script>
