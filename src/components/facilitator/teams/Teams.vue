<template>
  <div class="graph-teams">
    <div v-if="!multiple">
      Select Team
      <select :id="'graph-team-' + graph + '-1'" @change="setSelectedGraphTeam(graph, 1)">
        <option value="">
          -- Select --
        </option>
        <option v-for="(team, index) in teams" :key="index" :selected="team.name == selectedGraphTeams[1]">
          {{ team.name }}
        </option>
      </select>
    </div>
    <div v-if="multiple" class="multiple">
      <table>
        <tr>
          <td v-for="(n, index) in Math.min(teams.length, 6)" :key="index">
            Select Team {{ n }}<br>
            <select :id="'graph-team-' + graph + '-' + n" @change="setSelectedGraphTeam(graph, n)">
              <option value="">
                -- Select --
              </option>
              <option v-for="(team, tindex) in teams" :key="tindex" :selected="team.name == selectedGraphTeams[n]">
                {{ team.name }}
              </option>
            </select>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'multiple',
    'graph'
  ],
  computed: {
    teams() {
      return this.$store.getters.getActiveTeams
    },
    selectedGraphTeams() {
      return this.$store.getters.getSelectedGraphTeams
    }
  },
  methods: {
    setSelectedGraphTeam(graph, n) {
      const team = document.getElementById('graph-team-' + graph + '-' + n).value
      this.$store.dispatch('setSelectedGraphTeam', {n: n, team: team})
    }
  }
}
</script>

<style lang="scss">

.graph-teams {

  select {
    margin-left: 6px;
  }

  .multiple {
    table {
      border: none;
    }
  }
}

</style>
