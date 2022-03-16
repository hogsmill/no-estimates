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
        <button
          class="btn btn-sm btn-info next" :disabled="!myName.captain" @click="next()"
          :title="myName.captain ? 'Click to move to next day' : 'Only team captains can advance the day'"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

export default {
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
    }
  },
  created() {
    bus.on('retro', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.show()
      }
    })
  },
  methods: {
    show() {
      this.$store.dispatch('showModal', 'retro')
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
        alert('Please wait for the facilitator to start the game')
        return
      }
      if (this.doRetros && !this.retrosDone[this.currentDay] && this.currentDay % this.retroDays == 0) {
        bus.emit('emitRetro', {gameName: this.gameName, teamName: this.teamName})
        bus.emit('sendRetroDone', {gameName: this.gameName, teamName: this.teamName, currentDay: this.currentDay})
      } else {
        bus.emit('emitHide', {gameName: this.gameName, teamName: this.teamName, popup: 'retro'})
        bus.emit('emitShowEventCard', {gameName: this.gameName, teamName: this.teamName})
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
    height: 340px;

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
        height: 320px;
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
