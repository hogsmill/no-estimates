<template>

  <div class="report">
    <button class="btn btn-sm btn-site-primary" @click="show()">Report</button>
    <span class="current-value">Current Project Value: <span v-html="currency"></span><span>{{total()}}</span></span>

    <modal class="report-modal" name="report-modal" :height="500" :classes="['rounded']">
      <div class="mt-4">
      <h4>Status (Day: {{currentDay}}) <button class="btn btn-sm btn-site-primary" @click="hide()">Close</button></h4>
      <div class="scroller">
      <table class="estimates">
        <tr>
          <td>Estimate for Total Project: </td>
          <td><input type="text" id="project-estimate" class="form-control" :value="projectEstimate" /></td>
          <td><button class="btn btn-sm btn-site-primary" @click="saveTotalProject">Save</button></td>
        </tr>
        <tr>
          <td>Estimate for MVP (#1-11): </td>
          <td><input type="text" id="mvp-estimate" class="form-control" :value="mvpEstimate" /></td>
          <td><button class="btn btn-sm btn-site-primary" @click="saveMVP">Save</button></td>
        </tr>
        <tr>
          <td>Re-estimate for Total project: </td>
          <td><input type="text" id="re-estimate" class="form-control" :value="reEstimate" /></td>
          <td><button class="btn btn-sm btn-site-primary" @click="saveReEstimate">Save</button></td>
        </tr>
      </table>
      <table class="results">
        <thead>
          <tr>
            <th>Card #</th>
            <th>Effort</th>
            <th>Commit<br />Day</th>
            <th>Delivery<br />Day</th>
            <th>Delivery<br />Time</th>
            <th>Total<br /><span v-html="currency"></span><span>{{total()}}</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(card, index) in workCards" :key="index">
            <td>{{card.number}}</td>
            <td>{{totalEffort(card)}}</td>
            <td><span v-if="card.commit > 0">{{card.commit}}</span></td>
            <td>{{card.delivery}}</td>
            <td :class="{ 'not-delivered': !card.delivery }">{{time(card)}}</td>
            <td>{{card.value}}</td>
          </tr>
        </tbody>
      </table>
      </div>
      </div>
    </modal>

  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  methods: {
    show () {
      this.$modal.show('report-modal');
    },
    hide () {
      this.$modal.hide('report-modal');
    },
    time(card) {
      var t
      if (card.delivery) {
        t = card.delivery - card.commit
      } else if (card.commit) {
        t = this.currentDay - card.commit
      } else {
        t= ''
      }
      return t
    },
    totalEffort(card) {
      return card.design +
        card.develop +
        card.test +
        card.deploy
    },
    total() {
      var total = 0
      for (var i = 0; i < this.workCards.length; i++) {
        if (this.workCards[i].value) {
          total += this.workCards[i].value
        }
      }
      return total
    },
    saveTotalProject() {
      var estimate = document.getElementById("project-estimate").value
      this.socket.emit("updateProjectEstimate", {gameName: this.gameName, teamName: this.teamName, projectEstimate: estimate})
    },
    saveMVP() {
      var estimate = document.getElementById("mvp-estimate").value
      this.socket.emit("updateMVPEstimate", {gameName: this.gameName, teamName: this.teamName, mvpEstimate: estimate})
    },
    saveReEstimate() {
      var estimate = document.getElementById("re-estimate").value
      this.socket.emit("updateReEstimate", {gameName: this.gameName, teamName: this.teamName, reEstimate: estimate})
    }
  },
  computed: {
    currency() {
      return this.$store.getters.getCurrency
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    workCards() {
      return this.$store.getters.getWorkCards
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    projectEstimate() {
      return this.$store.getters.getProjectEstimate
    },
    mvpEstimate() {
      return this.$store.getters.getMVPEstimate
    },
    reEstimate() {
      return this.$store.getters.getReEstimate
    },
  },
  mounted() {
    this.socket.on("updateProjectEstimate", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateProjectEstimate", data)
      }
    })
    this.socket.on("updateMVPEstimate", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateMVPEstimate", data)
      }
    })
    this.socket.on("updateReEstimate", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateReEstimate", data)
      }
    })
  }
}
</script>

<style lang="scss">
  .report {
    display: inline-block;

    button {
      text-align: left;
      margin-top: 6px;
    }

    .current-value {
      position: relative;
      top: 3px;
      padding-left: 6px;
    }
  }

  .report-modal {

    .scroller {
      overflow-y: auto;
      height: 390px;
    }

    input {
      width: 50px;
      height: 24px;
      margin: 0 auto;
      text-align: right;
    }

    button {
      height: 24px;
      line-height: 12px;
      margin: 6px;
    }

    table {
      margin: 6px auto;
      font-size: small;
      width: 98%;
    }

    th {
      padding: 4px;
      border: 1px solid;
    }

    td {
      padding: 0 4px;
      vertical-align: middle;
      text-align: center;
      border: 1px solid;
    }
  }

  .estimates {
    width: 80%;
    margin: 0 auto;
  }

  .results {
    th {
      width: 16%;
      text-align: center;
    }

    .not-delivered {
      font-style: italic;
      color: #aaa;
      border-color: #444;
    }
  }

</style>
