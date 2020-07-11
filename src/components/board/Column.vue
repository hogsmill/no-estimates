<template>
  <div class="col">
    <div class="row" v-if="column.name.toLowerCase() == 'options'">
      <CardStack v-bind:stack="'Work Cards'" />
      <CardStack v-bind:stack="'Dependencies'" />
    </div>
    <div class="row" v-if="column.name.toLowerCase() != 'options'">
      <div v-for="(card, index) in column.cards" :key="index">
        <WorkCard v-bind:card="card" />
      </div>
    </div>
  </div>
</template>

<script>
import CardStack from "./CardStack.vue";
import WorkCard from "./WorkCard.vue";

export default {
  components: {
    CardStack,
    WorkCard
  },
  props: [
    'column'
  ],
  methods: {
  },
  computed: {
    nColumns() {
      return this.$store.getters.getColumns.length;
    }
  },
}
</script>

<style>
  .game-board .col { width: 130px; }
  .game-board .row { text-align: center; }
  .game-board .row.header { text-align: center; padding: 4px; }
  .options div { border: 1px solid; display: block; }
  .options { background-color: navy; }
  .design { background-color: red; }
  .develop { background-color: green; }
  .test { background-color: lightblue; }
  .deploy { background-color: purple; }
  .done { background-color: navy; }
</style>
