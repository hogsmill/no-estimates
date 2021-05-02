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
    config() {
      return this.$store.getters.getConfig
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
      return this.teamName && this.capabilities.autoDeploy.doing && column.name == 'deploy' &&
             this.type == 'expedite' || this.type == 'done' || this.type == 'all'
    },
    cardComplete(card) {
      return card.effort[this.column.name] == card[this.column.name]
    },
    showCard(card) {
      let show = true
      const complete = this.cardComplete(card)
      switch(this.type) {
        case 'expedite':
          show = card.urgent
          break
        case 'notexpedite':
          show = !card.urgent
          break
        case 'expeditedone':
          show = !card.urgent && complete
          break
        case 'expeditedoing':
          show = !card.urgent && !complete
          break
        case 'done':
          show = complete
          break
        case 'doing':
          show = !complete
          break
        case 'all':
          show = true
          break
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
