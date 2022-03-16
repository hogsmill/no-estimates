<template>
  <vue-final-modal name="event-card" classes="modal-container" content-class="vfm__content modal-content" v-model="modals['eventCard']">
    <div v-if="!currentEventCard.text">
      <h4>We are now on Day {{ currentDay + 1 }}</h4>
      <ProjectValue :cards="completed()" />
      <button class="btn btn-sm btn-info" @click="done()">
        Done
      </button>
    </div>
    <div v-if="currentEventCard.text">
      <h4>
        Day {{ currentDay + 1 }}
      </h4>
      <ProjectValue :cards="completed()" />
      <p v-html="currentEventCard.text.replace('[MVPCARDS]', mvpCards)" />
      <div v-if="myName.captain" class="event-card-buttons">
        <button v-if="!currentEventCard.function" class="btn btn-sm btn-info" @click="done()">
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
      <div v-if="!myName.captain" class="event-card-buttons">
        <p v-if="currentEventCard.confirm">
          (<i>The captain will select the answer</i>)
        </p>
        <button v-if="!currentEventCard.function" class="btn btn-sm btn-outline-info" @click="dismiss()">
          Dismiss
        </button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import ProjectValue from './eventCard/ProjectValue.vue'

export default {
  components: {
    VueFinalModal,
    ProjectValue
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    members() {
      return this.$store.getters.getMembers
    },
    columns() {
      return this.$store.getters.getColumns
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
    graphConfig() {
      return this.$store.getters.getGraphConfig
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
  methods: {
    dismiss() {
      this.$store.dispatch('hideModal', 'eventCard')
    },
    hide(name) {
      bus.emit('emitHide', {gameName: this.gameName, teamName: this.teamName, popup: 'eventCard'})
    },
    completed() {
      return this.columns.find(function(c) {
        return c.name == 'done'
      }).cards.length
    },
    done(data) {
      if (this.myName.captain) {
        const updateData = {gameName: this.gameName, teamName: this.teamName}
        if (data) {
          for (const key in data) {
            updateData[key] = data[key]
          }
        }
        if (this.currentEventCard.autoDeployCard) {
          updateData.canStartAutoDeploy = true
        }
        bus.emit('sendUpdateCurrentDay', updateData)
      }
      this.hide('eventCard')
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
    },
  }
}
</script>
