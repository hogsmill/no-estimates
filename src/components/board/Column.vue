<template>
  <div class="col">
    <div class="row" v-if="column.name == 'options'">
      <WorkCardStack v-bind:socket="socket" />
      <OtherTeams />
    </div>
    <div class="row" v-if="column.name != 'options'">
      <div v-for="(card, index) in column.cards" :key="index">
        <WorkCard v-bind:column="column.name" v-bind:workCard="card" v-bind:socket="socket" />
      </div>
    </div>
  </div>
</template>

<script>
import OtherTeams from "./OtherTeams.vue";
import WorkCardStack from "./WorkCardStack.vue";
import WorkCard from "./WorkCard.vue";

export default {
  components: {
    WorkCardStack,
    OtherTeams,
    WorkCard
  },
  props: [
    'column',
    'socket'
  ],
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
  .design { background-color: #b10018; }
  .develop { background-color: #76a001; }
  .test { background-color: #0067b1; }
  .deploy { background-color: #4f0384; }
  .done { background-color: navy; }
</style>
