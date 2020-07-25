<template>
  <div class="work-card" :class="{'blocked': workCard.blocked}">
    <div v-if="workCard.blocked" class="blocked-text"><strong>BLOCKED</strong></div>
    <div v-if="workCard.failed && column == 'deploy'" class="failed">FAILED</div>
    <div v-if="workCard.urgent" class="urgent">URGENT</div>
    <div class="work-card-header">
      <div class="card-number">#{{workCard.number}}</div>
      <div class="card-effort">Effort: {{totalEffort()}}</div>
    </div>
    <div class="work-card-effort">
      <div class="work-card-column column rounded-circle" :class="{'design': !workCard.blocked}" @click="addEffort('design')">A</div>
      <div v-for="n in workCard.design" :key="n" :class="{'assigned' : n <= workCard.effort.design}" class="work-card-column rounded-circle"></div>
    </div>
    <div class="work-card-effort">
      <div class="work-card-column column rounded-circle" :class="{'develop': !workCard.blocked}" @click="addEffort('develop')">B</div>
      <div v-for="n in workCard.develop" :key="n" :class="{'assigned' : n <= workCard.effort.develop}" class="work-card-column rounded-circle"></div>
    </div>
    <div class="work-card-effort">
      <div class="work-card-column column rounded-circle" :class="{'test': !workCard.blocked}" @click="addEffort('test')">C</div>
      <div v-for="n in workCard.test" :key="n" :class="{'assigned' : n <= workCard.effort.test}" class="work-card-column rounded-circle"></div>
    </div>
    <div class="work-card-effort">
      <div class="work-card-column column rounded-circle" :class="{'deploy': !workCard.blocked}" @click="addEffort('deploy')">D</div>
      <div v-for="n in workCard.deploy" :key="n" :class="{'assigned' : n <= workCard.effort.deploy}" class="work-card-column rounded-circle"></div>
    </div>
    <table class="delivery">
      <tr>
        <td>COMMIT</td>
        <td>DELIVER</td>
        <td>TIME</td>
      </tr>
      <tr>
        <td>{{workCard.commit}}</td>
        <td>{{workCard.delivery}}</td>
        <td :class="{'not-done': !workCard.done}">{{time()}}</td>
      </tr>
      <tr v-if="workCard.teamDependency">
        <td class="dependency" colspan="3">
          <span>TEAM: </span>
          <div class="dependency-team" @click="selectDependentTeam()" :click-prevent="selectDependentTeam"
            :style="{'background-color': teamClass()}">
            <strong v-if="!workCard.dependentOn">None</strong>
            <strong v-if="workCard.dependentOn">{{workCard.dependentOn.name}}</strong>
          </div>
          <div v-for="n in workCard.teamDependency" :key="n" :class="{'assigned' : n <= workCard.dependencyDone}" class="dependency-column rounded-circle"></div>
        </td>
      </tr>
    </table>

    <modal class="work-card-popup" name="work-card-popup" :height="150" :classes="['rounded']">
      <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
      <h4>Unable to Assign Effort</h4>
      <p>{{message}}</p>
      <div class="button">
        <button class="btn btn-sm btn-info" @click="hide()">OK</button>
      </div>
    </modal>

  </div>
</template>

<script>
import stringFuns from '../../lib/stringFuns.js'

export default {
  data() {
    return {
      message: ''
    }
  },
  props: [
    'column',
    'workCard',
    'socket'
  ],
  methods: {
    show () {
      this.$modal.show('work-card-popup');
    },
    hide () {
      this.message = ''
      this.$modal.hide('work-card-popup');
    },
    teamClass() {
      return this.workCard.dependentOn ? this.workCard.dependentOn.name.toLowerCase() : ''
    },
    effort(column) {
      return this.workCard[column]
    },
    totalEffort() {
      return this.workCard.design +
        this.workCard.develop +
        this.workCard.test +
        this.workCard.deploy
    },
    time() {
      return this.currentDay - this.workCard.commit
    },
    addEffort(column) {
      var message = ''
      if (this.workCard.blocked) {
        message = "Can't assign - card is blocked"
      } else if (this.column == column) {
        if (this.myEffort.available == 0) {
          message = "Can't assign - all effort assigned"
        } else if (this.workCard.effort[column] == this.workCard[column]) {
          message = "Can't assign - all work completed"
        } else {
          if (column == stringFuns.roleToColumn(this.myRole)) {
            this.workCard.effort[column] = this.workCard.effort[column] + 1
            this.$store.dispatch("updateMyAssignedEffort", 1)
          } else {
            if (this.myEffort.available < 2) {
              message = "Can't assign - you only have one effort point left"
            } else {
              this.workCard.effort[column] = this.workCard.effort[column] + 1
              this.$store.dispatch("updateMyAssignedEffort", 2)
            }
          }
        }
      } else if (this.column != column) {
        message = "Can't assign - wrong column"
      }
      if (message) {
        this.show()
        var self = this
        setTimeout(function() { self.message = message }, 100)
      } else {
        this.socket.emit("updatePersonEffort", {gameName: this.gameName, teamName: this.teamName, workCard: this.workCard, name: this.myName, column: column})
        this.socket.emit("updateEffort", {gameName: this.gameName, teamName: this.teamName, workCard: this.workCard})
      }
    },
    selectDependentTeam() {
      // Make sure we don't pick our own team...
      var teams = []
      for (var i = 0; i < this.teams.length; i++) {
        if (this.teams[i].name != this.teamName) {
          teams.push(i)
        }
      }
      var index = teams[Math.floor(Math.random() * teams.length)]
      var dependentOn = this.teams[index]
      this.socket.emit("updateDependentTeam", {gameName: this.gameName, teamName: this.teamName, workCard: this.workCard, dependentOn: dependentOn})
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
    myRole() {
      return this.$store.getters.getMyRole
    },
    myEffort() {
      return this.$store.getters.getMyEffort
    },
    teams() {
      return this.$store.getters.getTeams
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    }
  }
}
</script>

<style lang="scss">

  .work-card-popup {
    * {
      text-align: center;
    }
    .button {
      text-align: center;
    }
  }

  .work-card {
    background-color: #fff;
    color: #444;
    margin: 6px;

    &.blocked {
      background-color: red;
    }

    .blocked-text {
      z-index: 10;
      position: relative;
      top: 50px;
      left: 16px;
      color: #fff;
      font-size: large;
    }

    div {
      text-align: left;
      height: 14px;
    }

    .urgent, .failed {
      height: 22px;
      text-align: center;
      padding: 0 6px;
      font-weight: bold;
      color: #fff;
    }

    .urgent {
      background-color: red;
    }

    .failed {
      background-color: #888;
    }

    .work-card-header {
      text-align: right;
      padding-right: 2px;
      font-weight: bold;
      margin-bottom: 4px;

      .card-number {
        padding-left: 2px;
        width: 20%;
        display: inline-block;
      }

      .card-effort {
        padding-right: 2px;
        width: 80%;
        display: inline-block;
        text-align: right;
      }
    }

    .work-card-effort {

      .work-card-column {
        display: inline-block;
        border: 1px solid;
        margin-left: 1px;
        width: 8px;
        height: 8px;
        font-size: 8px;
        padding-left: 2px;

        &:hover {
          cursor: pointer;
        }

        &.column {
          color: #fff;
          border: 0;
          display: inline-block;
          width: 11px;
          height: 11px;
          font-size: 8px;
          padding-left: 2px;
        }
      }

      .assigned {
        background-color: #000;
      }
    }

    .delivery {
      td {
        border: 1px solid #444;
      }
    }

    .dependency {
      background-color: #000;
      color: #fff;
      vertical-align: middle;

      div {
        display: inline-block;
        width: 33%;
      }

      .dependency-team {
        background-color: #fff;
        color: #fff;
        text-align: center;

        &:hover {
          cursor: pointer;
        }
      }

      .dependency-column {
        display: inline-block;
        border: 1px solid;
        margin-left: 1px;
        width: 8px;
        height: 8px;
        font-size: 8px;
        padding-left: 2px;

        &.assigned {
          background-color: #fff;
        }
      }
    }

    table {
      width: 100%;
      margin-top: 10px;
      border-collapse: collapse
    }

    td {
      font-size: 8px;

      &.not-done {
        color: #fff;
        font-weight: bold;
        background-color: red;
      }
    }

  }

</style>
