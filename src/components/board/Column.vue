<template>
  <div>
    <div v-if="column.name == 'options'">
      <WorkCardStack v-bind:socket="socket" />
      <OtherTeams v-bind:socket="socket" />
    </div>
    <div v-if="column.name != 'options'">
      <AutoDeploy v-if="showAutoDeploy(column)" v-bind:socket="socket" />
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
import AutoDeploy from "./AutoDeploy.vue";

export default {
  components: {
    WorkCardStack,
    OtherTeams,
    WorkCard,
    AutoDeploy
  },
  props: [
    'column',
    'socket'
  ],
  methods: {
    showAutoDeploy(column) {
      return this.teamName && this.myTeam.autoDeploy.doing && column.name == 'deploy'
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    myTeam() {
      return this.$store.getters.getMyTeam
    },
    nColumns() {
      return this.$store.getters.getColumns.length;
    }
  },
}
</script>

<style lang="scss">

  @import '../../assets/colours.scss';

  .game-board {

    .col {
      width: 130px;
    }

    .row {
      text-align: center;

      &.header {
        text-align: center;
        padding: 4px;
      }
    }
  }

  .options {
    background-color: navy;

    div {
      border: 1px solid;
      display: block;
    }
  }

  .design {
    background-color: $design;
  }
  .develop {
    background-color: $develop;
  }
  .test {
    background-color: $test;
  }
  .deploy {
    background-color: $deploy;
  }
  .done {
    background-color: $done;
  }
</style>
