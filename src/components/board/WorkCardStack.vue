<template>
  <div class="work-card-back" :class="{'complete': currentWorkCard === false}" @click="pullInCard()">
    <div v-if="currentWorkCard !== false" class="stack-number rounded-circle">
      {{ currentWorkCard + 1 }}
    </div>
    <div v-if="currentWorkCard === false" class="stack-number rounded-circle complete">
      0
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

export default {
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    currentWorkCard() {
      return this.$store.getters.getCurrentWorkCard
    },
    workCards() {
      return this.$store.getters.getWorkCards
    },
    teams() {
      return this.$store.getters.getTeams
    },
    teamMembers() {
      return this.$store.getters.getMembers
    },
    facilitatorStarts() {
      return this.$store.getters.getFacilitatorStarts
    },
    gameRunning() {
      return this.$store.getters.getGameRunning
    }
  },
  methods: {
    show() {
      this.$store.dispatch('showModal', 'setCaptain')
    },
    captain() {
      let captain = false
      for (let i = 0; i < this.teamMembers.length; i++) {
        if (this.teamMembers[i].captain) {
          captain = true
        }
      }
      return captain
    },
    pullInCard() {
      if (this.facilitatorStarts && !this.gameRunning) {
        alert('Please wait for the facilitator to start the game')
        return
      }
      const currentCard = this.workCards[this.currentWorkCard]
      if (this.currentWorkCard == 0 && !this.captain()) {
        this.show()
      } else {
        if (currentCard.teamDependency) {
          bus.emit('emitHint', {gameName: this.gameName, teamName: this.teamName, hint: 'You can click the chat icon to chat with other teams about dependent work...'})
        }
        if (this.currentWorkCard !== false) {
          bus.emit('sendPullInCard', {gameName: this.gameName, teamName: this.teamName, teams: this.teams})
        }
      }
    }
  }
}
</script>

<style lang="scss">

  .work-card-back {
    margin: 6px;
    height: 86px;
    background-image: url("../../assets/img/work-card-back.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    box-shadow: 2px 2px 3px #444;

    &:hover {
      cursor: pointer;
    }

    &.complete {
      opacity: 0.5;
    }
    .stack-number {
      width: 20px;
      position: relative;
      top: 58px;
      margin: 0 auto;
      color: #fff;
      background-color: red;

      &.complete {
        color: red;
      }
    }
  }
</style>
