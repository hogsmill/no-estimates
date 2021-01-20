<template>
  <div class="work-card-back" :class="{'complete': currentWorkCard === false}" @click="pullInCard()">
    <div v-if="currentWorkCard !== false" class="stack-number rounded-circle">
      {{ currentWorkCard + 1 }}
    </div>
    <div v-if="currentWorkCard === false" class="stack-number rounded-circle complete">
      0
    </div>

    <span>
      <modal name="set-captain" class="popup" :height="190" :classes="['rounded']">
        <div class="float-right mr-2 mt-1">
          <button type="button" class="close" @click="hide()" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="mt-4">
          <h4>You need to nominate a team captain</h4>
          <p>
            You need to decide who is going to be team captain, and they then need
            to click Game Set Up and click the <b>Team Captain</b> button before you
            start the game
          </p>
          <button class="btn btn-sm btn-info" @click="hide()">
            OK
          </button>
        </div>
      </modal>
    </span>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
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
    }
  },
  methods: {
    show() {
      this.$modal.show('set-captain')
    },
    hide() {
      this.$modal.hide('set-captain')
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
      if (this.facilitatorStarts && this.currentWorkCard == 0) {
        alert('Please wait for the game to start')
        return
      }
      const currentCard = this.workCards[this.currentWorkCard]
      if (this.currentWorkCard == 0 && !this.captain()) {
        this.show()
      } else {
        if (currentCard.teamDependency) {
          this.socket.emit('hint', {gameName: this.gameName, teamName: this.teamName, hint: 'You can click the chat icon to chat with other teams about dependent work...'})
        }
        if (this.currentWorkCard !== false) {
          this.socket.emit('pullInCard', {gameName: this.gameName, teamName: this.teamName, teams: this.teams})
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
