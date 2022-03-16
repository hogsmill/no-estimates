<template>
  <vue-final-modal name="retro" classes="modal-container" content-class="vfm__content modal-content report-modal" v-model="modals['retro']">
    <div class="mt-4">
      <h2>
        Retro!
        <span v-if="retroTimer">{{ retroClock() }}</span>
      </h2>
      <div class="retro-div">
        <div class="retro-img-div rounded">
          <div class="retro-img" />
        </div>
        <div class="retro-text">
          <h5 class="rounded">
            Why not take {{ retroTimeString() }} to reflect on how it's gone so far?
          </h5>
          <p v-if="currency">
            You have delivered {{ completed() }} cards, and
            {{ currency.symbol }}{{ total() }} of value in
            {{ currentDay }} days. You could maybe discuss:
          </p>
          <ul>
            <li>What's gone well?</li>
            <li>What's gone not so well?</li>
            <li>What can the team do better?</li>
          </ul>
          <p>
            You may also want to reconsider your project estimate. Click the <b>Set
            Estimates</b> button if you want to update it.
          </p>
        </div>
      </div>
      <button class="btn btn-sm btn-info" @click="hide()">
        OK
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  },
  data() {
    return {
      retroTimeLeft: 0,
      retroTimerRunning: false
    }
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
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    columns() {
      return this.$store.getters.getColumns
    },
    retroTimer() {
      return this.$store.getters.getRetroTimer
    },
    retroTime() {
      return this.$store.getters.getRetroTime
    },
    currency() {
      return this.$store.getters.getCurrency
    },
    workCards() {
      return this.$store.getters.getWorkCards
    }
  },
  created() {
    this.retroTimerRunning = true
    this.setRetroTime(this.retroTime * 60)
  },
  methods: {
    hide() {
      bus.emit('emitHide', {gameName: this.gameName, teamName: this.teamName, popup: 'retro'})
    },
    setRetroTime(t) {
      this.retroTimeLeft = t
      if (this.retroTimerRunning && t > 0) {
        const self = this
        window.setTimeout(function() {
          self.setRetroTime(t - 1)
        }, 1000)
      }
    },
    retroClock() {
      const minutes = parseInt(this.retroTimeLeft / 60)
      let seconds = this.retroTimeLeft - (minutes * 60)
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      return minutes + ':' + seconds
    },
    retroTimeString() {
      if (!this.retroTimer) {
        return 'a few minutes'
      } else if (this.retroTime == 1) {
        return 'a minute'
      } else {
        return this.retroTime + ' minutes'
      }
    },
    total() {
      let total = 0
      for (let i = 0; i < this.workCards.length; i++) {
        if (this.workCards[i].value) {
          total += this.workCards[i].value
        }
      }
      return total
    },
    completed() {
      return this.columns.find(function(c) {
        return c.name == 'done'
      }).cards.length
    }
  }
}
</script>
