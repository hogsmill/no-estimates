<template>
  <div class="card-deck">
    <div class="row days">
      <div class="days">
        <div class="days-label">
          Day
        </div>
        <span class="passed" v-if="days()[0] > 1"> . . . </span>
        <div class="day rounded-circle" :class="getClass(day)" v-for="(day, index) in days()" :key="index">
          {{ day }}
        </div>
        <span> . . . </span>
        <button class="btn btn-sm btn-info next" :disabled="!myName.captain" @click="next()"
                :title="myName.captain ? 'Click to move to next day' : 'Only team captains can advance the day'"
        >
          Next
        </button>
      </div>
    </div>

    <modal name="retro" class="popup" :height="460" :classes="['rounded']">
      <div class="mt-4">
        <h2>
          Retro!
          {{ retroClock() }}
        </h2>
        <div class="retro-div">
          <div class="retro-img-div rounded">
            <div class="retro-img" />
          </div>
          <div class="retro-text">
            <h5>
              Why not take {{ retroTimeString() }} to reflect on how it's gone so far?
            </h5>
            <p>
              For instance:
            </p>
            <ul>
              <li>What's gone well?</li>
              <li>What's gone not so well?</li>
              <li>What can the team do better?</li>
            </ul>
            <p>
              You may also want to reconsider your project estimate. Click <b>Set
                Estimates</b> if you want to update it.
            </p>
          </div>
        </div>
        <button class="btn btn-sm btn-info" @click="hide()">
          OK
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      retroTimeLeft: 0,
      retroTimerRunning: false
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    currentWorkCard() {
      return this.$store.getters.getCurrentWorkCard
    },
    columns() {
      return this.$store.getters.getColumns
    },
    facilitatorStarts() {
      return this.$store.getters.getFacilitatorStarts
    },
    gameRunning() {
      return this.$store.getters.getGameRunning
    },
    doRetros() {
      return this.$store.getters.getDoRetros
    },
    retroDays() {
      return this.$store.getters.getRetroDays
    },
    retrosDone() {
      return this.$store.getters.getRetrosDone
    },
    retroTimer() {
      return this.$store.getters.getRetroTimer
    },
    retroTime() {
      return this.$store.getters.getRetroTime
    },
  },
  methods: {
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
    show() {
      this.retroTimerRunning = true
      this.setRetroTime(this.retroTime * 60)
      this.$modal.show('retro')
    },
    hide() {
      this.retroTimerRunning = false
      this.$modal.hide('retro')
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
    getClass(day) {
      if (day < this.currentDay) {
        return 'passed'
      } else if (day == this.currentDay) {
        return 'current'
      }
    },
    days() {
      const days = []
      const range = 15
      const startDay = Math.max(1, this.currentDay - range)
      const endDay = Math.max(30, this.currentDay + range)
      for (let i = startDay; i <= endDay; i++) {
        days.push(i)
      }
      return days
    },
    next() {
      if (this.facilitatorStarts && !this.gameRunning) {
        alert('Please wait for the game to start')
        return
      }
      if (this.doRetros && !this.retrosDone[this.currentDay] && this.currentDay % this.retroDays == 0) {
        this.show()
        this.socket.emit('retroDone', {gameName: this.gameName, teamName: this.teamName, currentDay: this.currentDay})
      } else {
        this.socket.emit('showEventCard', {gameName: this.gameName, teamName: this.teamName})
      }
    }
  }
}
</script>

<style lang="scss">
  .days {
    text-align: center;
    width: 100%;
    font-weight: bold;
    margin-bottom: 4px;

    .passed {
      opacity: 0.25;
    }
  }

  .days-label {
    display: inline;
    padding-right: 12px;
    color: #fff;
  }

  .day {
    display: inline-block;
    width: 20px;

    &.current {
      background-color: #fff;
      color: blue;
    }

    button {
      margin: 4px;
    }
  }

  .next {
    margin-left: 12px;
  }

  .retro-div {
    margin: 0 auto;
    height: 320px;

    p, li {
      text-align: left;
    }

    div {
      height: 285px;
      margin: 6px;

      &.retro-img-div {
        float: left;
        margin: 6px;
        width: 230px;
        //
        // Gradient
        //
        /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#7db9e8+0,207cca+44,0000ff+100 */
        $start: #7db9e8;
        $mid: #207cca;
        $end: #0000ff;
        background: #7db9e8; /* Old browsers */
        background: -moz-radial-gradient(center, ellipse cover,  $start 0%, $mid 44%, $end 100%); /* FF3.6-15 */
        background: -webkit-radial-gradient(center, ellipse cover,  $start 0%,$mid 44%,$end 100%); /* Chrome10-25,Safari5.1-6 */
        background: radial-gradient(ellipse at center,  $start 0%,$mid 44%,$end 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='$start', endColorstr='$end',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
        //
        // End Gradient
        //

        .retro-img {
          background-image: url("../assets/img/retro.png");
          background-size: contain;
          background-repeat: no-repeat;
          background-position-x: center;
          background-position-y: center;
        }
      }

      &.retro-text {
        float: right;
        width: 320px;
      }
    }

    .retro-timer {
      font-weight: bold;
    }
  }

</style>
