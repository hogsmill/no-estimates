<template>
  <div v-if="gameSpecificConfig.wipLimits" class="backlog">
    {{ gameSpecificConfig.wipLimitType }} WIP Limits
  </div>
</template>

<script>
export default {
  computed: {
    gameSpecificConfig() {
      return this.$store.getters.getGameSpecificConfig
    }
  }
}
</script>
