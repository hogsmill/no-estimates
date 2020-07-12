<template>
  <div class="work-card">
    <div class="work-card-number">
      <span v-if="workCard.urgent" class="urgent">URGENT</span>
      <strong>#{{workCard.number}}</strong>
    </div>
    <div class="work-card-effort">
      <div class="work-card-column column design rounded-circle">A</div>
      <div v-for="n in workCard.design" :key="n" class="work-card-column rounded-circle" @click="toggleEffort('design', n)"></div>
    </div>
    <div class="work-card-effort">
      <div class="work-card-column column develop rounded-circle">B</div>
      <div v-for="n in workCard.develop" :key="n" class="work-card-column rounded-circle" @click="toggleEffort('develop', n)"></div>
    </div>
    <div class="work-card-effort">
      <div class="work-card-column column test rounded-circle">C</div>
      <div v-for="n in workCard.test" :key="n" class="work-card-column rounded-circle" @click="toggleEffort('test', n)"></div>
    </div>
    <div class="work-card-effort">
      <div class="work-card-column column deploy rounded-circle">D</div>
      <div v-for="n in workCard.deploy" :key="n" class="work-card-column rounded-circle" @click="toggleEffort('deploy', n)"></div>
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
            :style="{'background-color': workCard.dependentOn.name.toLowerCase()}">
            <strong v-if="!workCard.dependentOn">None</strong>
            <strong v-if="workCard.dependentOn">{{workCard.dependentOn.name}}</strong>
          </div>
          <div v-for="n in workCard.teamDependency" :key="n" class="dependency-column rounded-circle" @click="toggleEffort('teamDependency', n)"></div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: [
    'workCard',
    'socket'
  ],
  methods: {
    effort(column) {
      return this.workCard[column]
    },
    totalEffort() {
      return this.workCard.design +
        this.workCard.develop +
        this.workCard.test +
        this.workCard.deploy
    },
    toggleEffort(role, n) {
      console.log(role, n)
    },
    selectDependentTeam() {
      var dependentOn = this.teams[Math.floor(Math.random() * this.teams.length)]
      this.socket.emit("updateDependentTeam", {gameName: this.gameName, workCard: this.workCard, dependentOn: dependentOn})
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teams() {
      return this.$store.getters.getTeams
    }
  },
  mounted() {
    this.socket.on("updateDependentTeam", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("updateDependentTeam", data)
      }
    })
  }
}
</script>
<style>
  .work-card { background-color: #fff; color: #444; margin: 6px; width: 122px; border: 1px solid; }
  .work-card div { text-align: left; height: 14px; }
  .work-card .urgent { text-align: left; padding: 0 6px; margin-right: 14px; background-color: red; font-weight: bold; color: #fff; }
  .work-card .work-card-number { text-align: right; padding-right: 2px; }
  .work-card .work-card-effort .work-card-column.column { color: #fff; border: 0; display: inline-block; width: 11px; height: 11px; font-size: 8px; padding-left: 2px; }
  .work-card .work-card-effort .work-card-column { display: inline-block; border: 1px solid; margin-left: 1px; width: 8px; height: 8px; font-size: 8px; padding-left: 2px; }
  .work-card table { width: 100%; margin-top: 5px; border-collapse: collapse}
  .work-card td { font-size: 8px; }
  .work-card .dependency { background-color: #000; color: #fff; }
  .work-card .dependency div { display: inline-block; }
  .work-card .dependency .dependency-team { background-color: #fff; width: 40px; color: #fff; text-align: center;  }
  .work-card .dependency-column { display: inline-block; border: 1px solid; margin-left: 1px; width: 8px; height: 8px; font-size: 8px; padding-left: 2px; }

  .set-dependent-team { text-align: center; }
</style>
