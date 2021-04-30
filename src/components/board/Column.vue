<template>
  <div>
    <AutoDeploy v-if="showAutoDeploy(column)" />
    <div v-for="(card, index) in column.cards" :key="index">
      <WorkCard v-if="showCard(card)" :column="column.name" :work-card="card" />
    </div>
  </div>
</template>

<script>
import WorkCard from './WorkCard.vue'
import AutoDeploy from './AutoDeploy.vue'

export default {
  components: {
    WorkCard,
    AutoDeploy
  },
  props: [
    'column',
    'type'
  ],
  computed: {
    gameSpecificConfig() {
      return this.$store.getters.getGameSpecificConfig
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    capabilities() {
      return this.$store.getters.getCapabilities
    }
  },
  methods: {
    showAutoDeploy(column) {
      return this.teamName && this.capabilities.autoDeploy.doing && column.name == 'deploy'
    },
    cardComplete(card) {
      return card.effort[this.column.name] == card[this.column.name]
    },
    showCard(card) {
      let show = true
      const complete = this.cardComplete(card)
      if (this.type == 'expedite') {
        show = card.urgent
      } else if (this.type == 'done') {
        show = complete
      } else if (this.type == 'doing' && !this.getGameSpecificConfig.expediteLane) {
        show = !complete
      } else if (this.type == 'notexpedite') {
        show = !card.urgent
      }
      return show
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

  .backlog {
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
