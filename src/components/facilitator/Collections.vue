<template>
  <div class="collections">
    gamesCollection: {{ process.env.VUE_APP_GAME_COLLECTION }},
    gameCollection: {{ process.env.VUE_APP_COLLECTION }}
  </div>
</template>

<style lang="scss">
  .collections {
    text-align: right;
  }
</style>
