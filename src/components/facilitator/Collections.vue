<template>
  <div class="collections">
    gamesCollection: {{ gamesCollection() }},
    gameCollection: {{ gameCollection() }}
  </div>
</template>

<script>
export default {
  methods: {
    gamesCollection() {
      return process.env.VUE_APP_GAME_COLLECTION
    },
    gameCollection() {
      return process.env.VUE_APP_COLLECTION
    }
  }
}
</script>

<style lang="scss">
  .collections {
    text-align: right;
  }
</style>
