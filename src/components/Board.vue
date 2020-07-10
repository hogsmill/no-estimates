<template>
  <div class="row">
    <div class="left">
      Left Col Stuff
    </div>
    <div class="right">
      <div class="row game-board">
        <div v-for="(column, index) in columns" :key="index">
          <Column v-bind:column="column" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Column from "./board/Column.vue";

export default {
  components: {
    Column
  },
  computed: {
    columns() {
      return this.$store.getters.getColumns;
    }
  },
}
</script>

<style>
  .left { width: 17%; }
  .right { width: 82%; }
</style>
