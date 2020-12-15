<template>
  <modal name="event-card-popup" class="popup" :height="400" :classes="['rounded']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div v-if="!currentEventCard">
      <h4>We are now on Day {{ currentDay + 1 }}</h4>
      <button class="btn btn-sm btn-info" @click="done">
        Done
      </button>
    </div>
    <div v-if="currentEventCard">
      <h4>Day {{ currentEventCard.number + 1 }}</h4>
      <ProjectValue />
      <p v-html="currentEventCard.text.replace('[MVPCARDS]', mvpCards)" />
      <div>
        <button class="btn btn-sm btn-outline-info" @click="eventCardRead">
          OK, I've read this...
        </button>
      </div>
      <div>
        <div v-for="(member, index) in members" :key="index" class="seen-div">
          <i v-if="member.eventCardRead" class="fas fa-eye" :title="member.name + ' has read this'" />
          <i v-if="!member.eventCardRead" class="fas fa-eye-slash" :title="member.name + ' has not read this'" />
        </div>
      </div>
      <div class="event-card-buttons">
        <button v-if="!currentEventCard || !currentEventCard.function" class="btn btn-sm btn-info" @click="done()">
          Done
        </button>
        <button v-if="currentEventCard.function && !currentEventCard.confirm" class="btn btn-sm btn-info" @click="doFunction()">
          Done
        </button>
        <button v-if="currentEventCard.function && currentEventCard.confirm" class="btn btn-sm btn-info" @click="doFunction()">
          Yes
        </button>
        <button v-if="currentEventCard.function && currentEventCard.confirm" class="btn btn-sm btn-info" @click="done()">
          No
        </button>
      </div>
    </div>
  </modal>
</template>

<script>
import ProjectValue from './ProjectValue.vue'

export default {
  components: {
    ProjectValue
  },
  props: [
    'socket'
  ],
  data() {
    return {
      showing: false
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    members() {
      return this.$store.getters.getMembers
    },
    myName() {
      return this.$store.getters.getMyName
    },
    currentEventCard() {
      return this.$store.getters.getCurrentEventCard
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    mvpCards() {
      return this.$store.getters.getMvpCards
    },
    percentageBlocked() {
      return this.$store.getters.getPercentageBlocked
    },
    percentageDeployFail() {
      return this.$store.getters.getPercentageDeployFail
    }
  },
  mounted() {
    const self = this
    this.socket.on('showEventCard', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        self.$modal.show('event-card-popup')
      }
    })
  },
  methods: {
    hide() {
      this.$modal.hide('event-card-popup')
    },
    eventCardRead() {
      this.socket.emit('eventCardRead', {gameName: this.gameName, teamName: this.teamName, myName: this.myName})
    },
    allSeen() {
      let allSeen = true
      for (let i = 0; i < this.members.length; i++) {
        if (!this.members[i].eventCardRead) {
          allSeen = false
        }
      }
      return allSeen
    },
    done(data) {
      const done = this.allSeen() || confirm('Not everyone has read this - continue anyway?')
      if (done) {
        this.hide()
        const updateData = {gameName: this.gameName, teamName: this.teamName, currentDay: this.currentDay + 1}
        if (data) {
          for (const key in data) {
            updateData[key] = data[key]
          }
        }
        if (this.currentEventCard) {
          if (this.currentEventCard.autoDeployCard) {
            updateData.canStartAutoDeploy = true
          }
        }
        this.socket.emit('updateCurrentDay', updateData)
      }
    },
    doFunction() {
      const data = {
        percentageBlocked: this.percentageBlocked,
        percentageDeployFail: this.percentageDeployFail
      }
      switch(this.currentEventCard.function) {
        case 'Add 1 Point To Everyones Capacity':
          data.capacity = 5
          break
        case 'Add 8 points to Deploy':
          data.autoDeploy = true
          break
        case 'Concurrent Dev and Test':
          data.concurrentDevAndTest = true
          break
        case 'Lose Tester':
          data.testCapacity = 2
          break
        case 'Spend a Day Estimating':
          data.capacity = 'none'
          break
        case 'Recharting':
          data.recharting = true
          break
        default:
          console.log('Doing \'' + this.currentEventCard.function + '\' (not implemented)')
      }
      this.done(data)
    }
  }
}
</script>

<style lang="scss">

  #event-card-popup {
    color: #444;
  }

  .seen-div {
    display: inline-block;
    width: 30px;
  }

  .event-card-buttons {
    margin-top: 20px;
  }
</style>
