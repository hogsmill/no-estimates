<template>
  <span>

    <modal name="event-card-popup" class="popup" :height="400" :classes="['rounded']">
      <div v-if="!currentEventCard.text">
        <h4>We are now on Day {{ currentDay + 1 }}</h4>
        <ProjectValue />
        <button class="btn btn-sm btn-info" @click="done()">
          Done
        </button>
      </div>
      <div v-if="currentEventCard.text">
        <h4>Day {{ currentDay + 1 }}</h4>
        <ProjectValue />
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
    </modal>

    <modal name="event-graph-popup" class="popup" :height="650" :classes="['rounded']">
      <div>
        <h4>Day {{ currentDay + 1 }}</h4>
        <ProjectValue />
        <div v-if="currentEventCard.function == 'Show Cycle Time'" class="event-card-graph">
          <table>
            <tr>
              <td>Small: </td>
              <td class="small" />
              <td>Medium: </td>
              <td class="medium" />
              <td>Large: </td>
              <td class="large" />
            </tr>
          </table>
          <BarChart :chartdata="cycleTime.data" :options="cycleTime.options" />
        </div>
        <div class="event-card-buttons">
          <button class="btn btn-sm btn-info" @click="doneGraph()">
            Done
          </button>
        </div>
      </div>
    </modal>

    <modal name="autodeploy-complete-popup" class="popup" :height="400" :classes="['rounded']">
      <div>
        <h4>Autodeploy Complete</h4>
        <h5>Congratulations!</h5>
        <p>
          Now that you have completed the auto-deployment work, deployments will no
          longer fail, and you will no longer have to re-do any deploy work.
        </p>
        <button class="btn btn-sm btn-info" @click="hide('autodeploy-complete-popup')">
          Done
        </button>
      </div>
    </modal>

  </span>
</template>

<script>
import ProjectValue from './ProjectValue.vue'
import BarChart from '../facilitator/results/BarChart.vue'

export default {
  components: {
    ProjectValue,
    BarChart
  },
  props: [
    'socket'
  ],
  data() {
    return {
      showing: false,
      cycleTime: {
        data: {
          labels: [],
          datasets: [{
            backgroundColor: '',
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            data: []
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {beginAtZero: true},
              gridLines: {display: true}
            }],
            xAxes: [{
              gridLines: {display: false}
            }]
          },
          legend: {display: false},
          responsive: true,
          maintainAspectRatio: false
        }
      }
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
  mounted() {
    const self = this
    this.socket.on('showEventCard', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        if (self.currentEventCard.function == 'Show Cycle Time') {
          self.socket.emit('showResult', {gameName: this.gameName, result: 'cycle-time', target: 'event-card'})
        } else {
          self.$modal.show('event-card-popup')
        }
      }
    })

    this.socket.on('hide', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        self.$modal.hide(data.popup)
      }
    })

    this.socket.on('autodeployComplete', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        self.$modal.show('autodeploy-complete-popup')
      }
    })

    this.socket.on('showResult', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName && data.target == 'event-card') {
        switch(data.result) {
          case 'cycle-time':
            self.showCycleTime(data)
            break
        }
      }
    })
  },
  methods: {
    dismiss() {
      this.$modal.hide('event-card-popup')
    },
    hide(name) {
      this.socket.emit('hide', {gameName: this.gameName, teamName: this.teamName, popup: name})
    },
    doneGraph() {
      if (this.myName.captain) {
        this.socket.emit('updateCurrentDay', {gameName: this.gameName, teamName: this.teamName})
      }
      this.hide('event-graph-popup')
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
        this.socket.emit('updateCurrentDay', updateData)
      }
      this.hide('event-card-popup')
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
    showCycleTime(data) {
      this.cycleTime.data.datasets[0].backgroundColor = []
      for (let i = 0; i < data.results.effort.length; i++) {
        if (data.results.effort[i] < this.graphConfig.cycleTime.medium) {
          this.cycleTime.data.datasets[0].backgroundColor.push('cadetblue')
        } else if (data.results.effort[i] < this.graphConfig.cycleTime.large) {
          this.cycleTime.data.datasets[0].backgroundColor.push('olive')
        } else {
          this.cycleTime.data.datasets[0].backgroundColor.push('darkorange')
        }
      }
      this.cycleTime.data.labels = data.results.ids
      this.cycleTime.data.datasets[0].data = data.results.days
      this.$modal.show('event-graph-popup')
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

    .fas {
      color: #17a2b8;
    }
  }

  .event-card-graph {
    canvas {
      height: 300px;
    }

    table {
      width: 50%;
      margin: 0 auto;
      td {
        width: 50px;
        text-align: right;
        padding: 0 4px;
        &.small {
          background-color: cadetblue;
        }
        &.medium {
          background-color: olive;
        }
        &.large {
          background-color: darkorange;
        }
      }
    }
  }

  .event-card-buttons {
    margin-top: 20px;
  }
</style>
