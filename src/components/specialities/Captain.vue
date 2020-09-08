
<template>
  <span v-if="myName.captain" class="captain">&#9733;</span>
</template>

<script>
export default {
  computed: {
    myName() {
      return this.$store.getters.getMyName
    }
  }
}
</script>
