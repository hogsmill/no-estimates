<template>
  <div class="other-team-header">
    <div class="other-team-header">Other Teams</div>
    <div v-for="(team, teamIndex) in teams" :key="teamIndex">
      <div v-if="team.name == teamName">
        <div v-for="(card, cardIndex) in team.otherCards" :key="cardIndex" class="other-work-card">
          <div class="urgent" v-if="card.urgent">URGENT</div>
          <div class="other-work-card-header">
            <div class="card-number">#{{card.number}}</div>
            <div class="card-team"><span :style="{ 'background-color': card.team.toLowerCase()}">{{card.team}}</span></div>
          </div>
          <div class="other-work-card-effort">
            <div class="other-work-card-column column rounded-circle" @click="addEffort(card)">X</div>
            <div v-for="n in card.effort" :key="n" :class="{'assigned' : n <= card.assigned}" class="other-work-card-column rounded-circle"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  methods: {
    addEffort(workCard) {
      console.log(workCard)
      this.socket.emit("addEffortToOthersCard", {gameName: this.gameName, teamName: this.teamName, workCard: workCard, myName: this.myName})
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
    teams() {
      return this.$store.getters.getTeams
    }
  }
}
</script>

<style lang="scss">
  .other-team-header {
    font-weight: bold;
    width: 100%;
    margin-top: 20px;
  }

  .other-work-card {
    background-color: #fff;
    color: #444;
    margin: 6px;
    width: 122px;
    height: 72px;

    .other-work-card-header {
      padding: 2px 2px 0 0;
      font-weight: bold;
      margin-bottom: 4px;

      .card-team {
        text-align: right;
        width: 80%;
        display: inline-block;

        span {
          padding: 2px; color: #fff;
        }
      }

      .card-number {
        text-align: left;
        width: 20%;
        padding-left: 2px;
        display: inline-block;
      }
    }

    .other-work-card-effort {
      text-align: left;

      .other-work-card-column {
        display: inline-block;
        border: 1px solid;
        margin-left: 1px;
        width: 8px;
        height: 8px;
        font-size: 8px;
        padding-left: 2px;

        &.column {
          background-color: #555;
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
  }
</style>
