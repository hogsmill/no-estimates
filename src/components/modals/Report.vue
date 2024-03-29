<template>
  <vue-final-modal name="walk-through" classes="modal-container" content-class="vfm__content modal-content report-modal" v-model="modals['report']">
    <div class="mt-4">
      <h4>
        Status (Day: {{ currentDay }}) <button class="btn btn-sm btn-site-primary" @click="hide()">
          Close
        </button>
      </h4>
      <Estimates />
      <div v-if="tab == 'Report'" class="scroller">
        <table class="results">
          <thead>
            <tr>
              <th>Card #</th>
              <th>Effort</th>
              <th>Commit<br>Day</th>
              <th>Delivery<br>Day</th>
              <th>Delivery<br>Time</th>
              <th>Total<br><span v-if="currency">{{ currency.symbol }}{{ total() }}</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(card, index) in workCards" :key="index">
              <td>{{ card.number }}</td>
              <td>{{ totalEffort(card) }}</td>
              <td><span v-if="card.commit > 0">{{ card.commit }}</span></td>
              <td>{{ card.delivery }}</td>
              <td :class="{ 'not-delivered': !card.delivery }">
                {{ time(card) }}
              </td>
              <td>{{ card.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import stringFuns from '../../lib/stringFuns.js'

import Estimates from './estimates/Estimates.vue'

export default {
  components: {
    VueFinalModal,
    Estimates
  },
  data() {
    return {
      tab: 'Report'
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
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
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'report')
    },
    selectTab(tab) {
      this.tab = tab
    },
    time(card) {
      let t
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
      let total = 0
      for (let i = 0; i < this.workCards.length; i++) {
        if (this.workCards[i].value) {
          total += this.workCards[i].value
        }
      }
      return total
    }
  }
}
</script>

<style lang="scss">

  $orange: #f4511e;

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

    h4 {
      text-align: center;
    }

   .tabs {
     border-bottom: 1px solid $orange;
     position: relative;
     margin-bottom: 4px;
     padding-left: 6px;

     .tab {
        width: 100px;
        padding: 4px;
        display: inline-block;
        text-align: center;
        background-color: #fff;
        position: relative;
        top: 1px;
        border-bottom: 1px solid $orange;

        &.selected {
          color: #fff;
          background-color: $orange;
          border-top: 1px solid;
          border-left: 1px solid;
          border-right: 1px solid;
          border-bottom: 1px solid $orange;
        }
      }
    }

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

   .summary {
     width: 60%;
     margin-top: 24px;

     td {
       font-weight: bold;
       font-size: larger;
       padding: 12px;
     }
   }
  }
</style>
