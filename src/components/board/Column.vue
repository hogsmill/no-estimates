<template>
  <div class="col">
    <div class="row" :class="column.name.toLowerCase()">{{column.name}}</div>
    <div class="row" v-if="column.name.toLowerCase() == 'options'">
      <WorkCards />
      <TeamDependencyCards />
    </div>
    <div class="row" v-if="column.name.toLowerCase() != 'options'">Cards here</div>
  </div>
</template>

<script>
import TeamDependencyCards from "./TeamDependencyCards.vue";
import WorkCards from "./WorkCards.vue";

export default {
  components: {
    TeamDependencyCards,
    WorkCards
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
  .game-board .col { border: 1px solid #fff; width: 130px; }
  .game-board .row { text-align: center; }
  .options div { border: 1px solid; display: block; }
  .options { background-color: navy; }
  .design { background-color: red; }
  .develop { background-color: green; }
  .test { background-color: lightblue; }
  .deploy { background-color: purple; }
  .done { background-color: navy; }
</style>
