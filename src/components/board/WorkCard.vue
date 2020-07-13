<template>
  <div class="work-card" :class="{'blocked': workCard.blocked}">
    <div v-if="workCard.blocked" class="blocked-text"><strong>BLOCKED</strong></div>
    <div class="work-card-number">
      <span v-if="workCard.urgent" class="urgent">URGENT</span>
      <strong>#{{workCard.number}}</strong>
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
    <table>
      <tr>
        <td>EFFORT</td>
        <td>COMMIT</td>
      </tr>
      <tr>
        <td>{{totalEffort()}}</td>
        <td>{{workCard.commit}}</td>
      </tr>
      <tr>
        <td>DELIVER</td>
        <td>TIME</td>
      </tr>
      <tr>
        <td>0</td>
        <td>0</td>
      </tr>
      <tr v-if="workCard.teamDependency">
        <td class="dependency" colspan="3">
          <span>TEAM: </span>
          <div class="dependency-team" @click="selectDependentTeam()" :click-prevent="selectDependentTeam"
            :style="{'background-color': teamClass()}">
            <strong v-if="!workCard.dependentOn">None</strong>
            <strong v-if="workCard.dependentOn">{{workCard.dependentOn.name}}</strong>
          </div>
          <div v-for="n in workCard.teamDependency" :key="n" class="dependency-column rounded-circle" @click="toggleEffort('teamDependency', n)"></div>
        </td>
      </tr>
    </table>

    <modal class="work-card-popup" name="work-card-popup" :height="150" :classes="['rounded']">
      <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
      <h4>Unable to Assign Effort</h4>
      <p>{{message}}</p>
      <div class="button">
        <button class="btn btn-sm btn-info" @click="hide()">Save</button>
      </div>
    </modal>
  </div>
</template>

<script>
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
    addEffort(column) {
      this.message = ''
      if (this.workCard.blocked) {
        this.message = "Can't assign - card is blocked"
      } else if (this.column == column) {
        if (this.myEffort.available == 0) {
          this.message = "Can't assign - all effort assigned"
        } else {
          this.workCard.effort[column] = this.workCard.effort[column] + 1
          if (column == this.myRole.replace(/er$/, '').toLowerCase()) {
            this.$store.dispatch("updateMyAssignedEffort", 1)
          } else {
            this.$store.dispatch("updateMyAssignedEffort", 2)
          }
        }
      } else if (this.column != column) {
        this.message = "Can't assign - wrong column"
      }
      if (this.message) {
        this.show()
      } else {
        this.socket.emit("updatePersonEffort", {gameName: this.gameName, teamName: this.teamName, workCard: this.workCard, name: this.myName, column: column})
        this.socket.emit("updateEffort", {gameName: this.gameName, teamName: this.teamName, workCard: this.workCard})
      }
    },
    selectDependentTeam() {
      var dependentOn = this.teams[Math.floor(Math.random() * this.teams.length)]
      this.socket.emit("updateDependentTeam", {gameName: this.gameName, teamName: this.teamName, workCard: this.workCard, dependentOn: dependentOn})
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
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
    teamName() {
      return this.$store.getters.getTeamName
    },
    teams() {
      return this.$store.getters.getTeams
    }
  },
  mounted() {
    this.socket.on("updateDependentTeam", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateDependentTeam", data)
      }
    })

    this.socket.on("updateEffort", (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch("updateEffort", data)
      }
    })
  }
}
</script>
<style>
  .work-card-popup * { text-align: center; }
  .work-card-popup .button { text-align: center; }
  .work-card { background-color: #fff; color: #444; margin: 6px; width: 122px; border: 1px solid; }
  .work-card div { text-align: left; height: 14px; }
  .work-card .urgent { text-align: left; padding: 0 6px; margin-right: 14px; background-color: red; font-weight: bold; color: #fff; }
  .work-card .work-card-number { text-align: right; padding-right: 2px; }
  .work-card .work-card-effort .work-card-column.column { color: #fff; border: 0; display: inline-block; width: 11px; height: 11px; font-size: 8px; padding-left: 2px; }
  .work-card .work-card-effort .assigned { background-color: #000; }
  .work-card .work-card-effort .work-card-column { display: inline-block; border: 1px solid; margin-left: 1px; width: 8px; height: 8px; font-size: 8px; padding-left: 2px; }
  .work-card table { width: 100%; margin-top: 5px; border-collapse: collapse}
  .work-card td { font-size: 8px; }
  .work-card.blocked { background-color: red; }
  .work-card .blocked-text { z-index: 10; position: relative; top: 50px; left: 16px; color: #fff; font-size: large; }
  .work-card .dependency { background-color: #000; color: #fff; }
  .work-card .dependency div { display: inline-block; }
  .work-card .dependency .dependency-team { background-color: #fff; width: 40px; color: #fff; text-align: center;  }
  .work-card .dependency-column { display: inline-block; border: 1px solid; margin-left: 1px; width: 8px; height: 8px; font-size: 8px; padding-left: 2px; }

  .set-dependent-team { text-align: center; }
</style>
