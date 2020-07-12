<template>

  <div class="work-card-back" :class="{'complete': !current}" @click="pullInCard()">
    <div v-if="current" class="event-card-number rounded-circle">{{current.number}}</div>
    <div v-if="!current" class="event-card-number rounded-circle complete">0</div>
  </div>

</template>

<script>
export default {
  methods: {
    pullInCard() {
      if (this.current) {
        this.$store.dispatch("pullInNextCard")
      }
    }
  },
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    current() {
      return this.$store.getters.getCurrentWorkCard
    }
  }
}
</script>

<style>
  .work-card-back { margin: 6px; width: 100%; height: 100px; background-image: url("../../assets/img/work-card-back.png"); background-size: contain; background-repeat: no-repeat; }
  .work-card-back.complete { opacity: 0.5; }
</style>
