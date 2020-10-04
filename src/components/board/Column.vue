<template>
  <div>
    <div v-if="column.name == 'options'">
      <WorkCardStack />
      <OtherSkills />
      <OtherTeams />
    </div>
    <div v-if="column.name != 'options'">
      <AutoDeploy v-if="showAutoDeploy(column)" />
      <div v-for="(card, index) in column.cards" :key="index">
        <WorkCard :column="column.name" :work-card="card" />
      </div>
    </div>
  </div>
</template>

<script>
import OtherTeams from './OtherTeams.vue'
import OtherSkills from './OtherSkills.vue'
import WorkCardStack from './WorkCardStack.vue'
import WorkCard from './WorkCard.vue'
import AutoDeploy from './AutoDeploy.vue'

export default {
  components: {
    WorkCardStack,
    OtherSkills,
    OtherTeams,
    WorkCard,
    AutoDeploy
  },
  props: [
    'column'
  ],
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
      return this.$store.getters.getColumns.length
    }
  },
  methods: {
    showAutoDeploy(column) {
      return this.teamName && this.myTeam.autoDeploy.doing && column.name == 'deploy'
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
