<template>

  <div class="report">
    <button class="btn btn-sm btn-info" @click="show()">Report</button>

    <modal class="report-modal" name="report-modal" :height="500" :classes="['rounded']">
      <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
      <h4>Status (Day: {{currentDay}}) <button class="btn btn-sm btn-info" @click="hide()">Close</button></h4>
      <div class="scroller">
      <table class="estimates">
        <tr>
          <td>Estimate for Total Project: </td>
          <td><input type="text" id="project-estimate" class="form-control" /></td>
          <td><button class="btn btn-sm btn-info" @click="saveTotalProject">Save</button></td>
        </tr>
        <tr>
          <td>Estimate for MVP (#1-11): </td>
          <td><input type="text" id="mvp-estimate" class="form-control" /></td>
          <td><button class="btn btn-sm btn-info" @click="saveMVP">Save</button></td>
        </tr>
        <tr>
          <td>Re-estimate for Total project: </td>
          <td><input type="text" id="re-estimate" class="form-control" /></td>
          <td><button class="btn btn-sm btn-info" @click="saveReEstimate">Save</button></td>
        </tr>
      </table>
      <table>
        <thead>
          <tr>
            <th>Card #</th>
            <th>Commit Day</th>
            <th>Delivery Day</th>
            <th>Delivery Time</th>
            <th  v-html="currency"></th>
            <th>Prob. Forecast (50%/85%)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(card, index) in workCards" :key="index">
            <td>{{card.number}}</td>
            <td>{{card.commit}}</td>
            <td>{{card.delivery}}</td>
            <td>{{time(card)}}</td>
            <td>{{card.value}}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      </div>
    </modal>

  </div>
</template>

<script>
export default {
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
    saveTotalProject() {

    },
    saveMVP() {

    },
    saveReEstimate() {

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
    }
  }
}
</script>

<style>
  .report { width: 80px; }
  .report button { text-align: left; margin-top: 6px;  }

  .report-modal .scroller { overflow-y: auto; height: 390px; }
  .report-modal input { width: 50px; height: 24px; margin: 6px; }
  .report-modal button { height: 24px; line-height: 12px; margin: 6px; }
  .report-modal table { margin-top: 6px auto; font-size: small; }
  .report-modal th { padding: 4px;  }
  .report-modal td { padding: 0 4px; vertical-align: middle; text-align: center;  }

  .estimates { width: 80%; margin: 0 auto; }
</style>
