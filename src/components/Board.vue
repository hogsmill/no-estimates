<template>
  <div class="row">
    <div class="left">
      <EventCard v-bind:socket="socket" />
    </div>
    <div class="right">
      <div class="row game-board">
        <div v-for="(column, index) in columns" :key="index">
          <Column v-bind:column="column" v-bind:socket="socket" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventCard from "./board/EventCard.vue";
import Column from "./board/Column.vue";

export default {
  components: {
    Column,
    EventCard
  },
  props: [
    'socket'
  ],
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
