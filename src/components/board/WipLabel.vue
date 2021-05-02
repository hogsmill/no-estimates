<template>
  <div v-if="config.wipLimits" class="backlog">
    {{ config.wipLimitType }} WIP Limits
  </div>
</template>

<script>
export default {
  computed: {
    config() {
      return this.$store.getters.getConfig
    }
  }
}
</script>
