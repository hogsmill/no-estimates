<template>
  <span>
    <button class="btn btn-sm btn-secondary smaller-font" @click="show()">
      Go Mobile
    </button>
  </span>
</template>

<script>

export default {
  created() {
  },
  methods: {
    show() {
      this.$store.dispatch('showMobile', 'goMobile')
    }
  }
}
</script>
