<template>
  <div class="mobile rounded">
    <div class="header">
      <i class="fas fa-cog" @click="toggleSettings()" />
    </div>
    <div v-if="showSettings" class="setup rounded-bottom">
      <table>
        <tr>
          <td>Game Name: </td>
          <td>
            <select id="available-games" @change="setGameNameFromAvailable()" class="form-control">
              <option> -- Select -- </option>
              <option v-for="(game, gindex) in availableGames" :key="gindex">
                {{ game }}
              </option>
            </select>
          </td>
        </tr>

        <!-- My Name -->

        <tr>
          <td>My Name: </td>
          <td>
            <select id="my-name-select" class="form-control">
              <option value="">
                -- Select --
              </option>
              <option v-for="(member, mindex) in members" :key="mindex" :selected="member.id == myName.id">
                {{ member.name }}
              </option>
            </select>
          </td>
        </tr>

        <!-- Team Name -->

        <tr>
          <td>Team: </td>
          <td>
            <select id="team-name-select" class="form-control">
              <option value="">
                -- Select --
              </option>
              <option v-for="(team, tindex) in activeTeams" :key="tindex" :selected="team.name == teamName">
                {{ team.name }}
              </option>
            </select>
          </td>
        </tr>

        <!-- Role -->

        <tr>
          <td>My Role: </td>
          <td>
            <select id="role-select" class="form-control">
              <option value="">
                -- Select --
              </option>
              <option v-for="(role, rindex) in roles" :key="rindex" :selected="role == myRole">
                {{ role }}
              </option>
            </select>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="!showSettings" class="game">
      <div>
        {{ myName.name }}
        <span v-for="n in myEffort.assigned" :key="n">
          <div class="mobile-effort full rounded-circle" />
        </span>
        <span v-for="n in myEffort.available" :key="n">
          <div class="mobile-effort rounded-circle" />
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th class="mobile-header-column">
              Column
            </th>
            <th class="mobile-header-cards">
              Cards
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(column, index) in columns" :key="index">
            <td v-if="column.name != 'done'">
              {{ columnName(column.name) }}
            </td>
            <td v-if="column.name != 'done'">
              <div v-for="(card, cindex) in column.cards" :key="cindex" class="mobile-card">
                <div v-if="card.urgent" class="urgent">
                  URGENT
                </div>
                <div class="mobile-card-header">
                  <div class="right">
                    {{ effortDone(card) }}/{{ totalEffort(card) }}
                  </div>
                  <div class="left">
                    #{{ card.number }}
                  </div>
                </div>
                <table>
                  <tr>
                    <td>
                      <div class="mobile-card-column design rounded" :class="{ 'complete': card.effort.design >= card.design }" @click="addEffort(card, 'design')">
                        {{ card.effort.design }} / {{ card.design }}
                      </div>
                    </td>
                    <td>
                      <div class="mobile-card-column develop rounded" :class="{ 'complete': card.effort.develop >= card.develop }" @click="addEffort(card, 'develop')">
                        {{ card.effort.develop }} / {{ card.develop }}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="mobile-card-column test rounded" :class="{ 'complete': card.effort.test >= card.test }" @click="addEffort(card, 'test')">
                        {{ card.effort.test }} / {{ card.test }}
                      </div>
                    </td>
                    <td>
                      <div class="mobile-card-column deploy rounded" :class="{ 'complete': card.effort.deploy >= card.deploy }" @click="addEffort(card, 'deploy')">
                        {{ card.effort.deploy }} / {{ card.deploy }}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import stringFuns from '../lib/stringFuns.js'

export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showSettings: false,
      gameNameEditing: false,
      gameNameError: false,
      myNameEditing: false,
      myNameError: false,
      teamNameEditing: false,
      teamNameError: false,
      myRoleEditing: false,
      myRoleError: false
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    myEffort() {
      return this.$store.getters.getMyEffort
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    activeTeams() {
      return this.$store.getters.getActiveTeams
    },
    members() {
      return this.$store.getters.getMembers
    },
    roles() {
      return this.$store.getters.getRoleNames
    },
    myRole() {
      return this.$store.getters.getMyRole
    },
    availableGames() {
      return this.$store.getters.getAvailableGames
    },
    columns() {
      return this.$store.getters.getColumns
    }
  },
  created() {
    this.gameNameEditing = !this.gameName
    this.myNameEditing = !this.myName.id
    this.teamNameEditing = !this.teamName
    this.myRoleEditing = !this.myRole
  },
  methods: {
    toggleSettings() {
      this.showSettings = !this.showSettings
    },
    columnName(name) {
      return stringFuns.properCase(name)
    },
    effortDone(card) {
      return card.effort.design + card.effort.develop + card.effort.test + card.effort.deploy
    },
    totalEffort(card) {
      return card.design + card.develop + card.test + card.deploy
    },
    addEffort(card, column) {
      console.log(column, card.effort[column] < card[column])
    }
  }
}
</script>

<style lang="scss">
$design: #b10018;
$develop: #76a001;
$test: #0067b1;
$deploy: #4f0384;
$done: navy;

.mobile {
  width: 375px;
  height: 667px;
  margin: 12px auto;
  border: 1px solid;
  overflow-y: scroll;

  .header {
    text-align: right;
    padding: 6px;
    background-color: #ccc;

    .fa-cog {
      font-size: x-large;
      color: #888;
    }
  }

  .setup {
    padding: 6px;
  }

  .game {

    .mobile-effort {
      width: 12px;
      height: 12px;
      border: 1px solid;
      display: inline-block;
      margin: 0 2px;
      position: relative;
      top: 2px;
      color: #444;
      box-shadow: 2px 2px 3px #444;

      &.full {
        background-color: #444;
      }
    }

    .mobile-header-column {
      width: 25%;
    }

    .mobile-header-cards {
      width: 75%;
    }

    .mobile-card {
      border: 1px solid;
      margin: 12px;
      box-shadow: 2px 2px 3px #444;
      color: #444;

      .left {
        text-align: left;
        padding: 6px;
        width: 100px;
        float: left;
      }

      .right {
        padding: 6px;
        width: 100px;
        float: right;
      }

      .urgent {
        background-color: red;
        color: white;
        font-weight: bold;
      }

      .mobile-card-column {
        margin: 0 auto;
        width: 100px;
        margin: 6px;
        padding: 12px;
        border: 1px solid;
        font-weight: bold;
        color: #fff;

        &.complete {
          border: 1px dashed #aaa;
          color: #aaa;
          background-color: #fff !important;
        }

        &.design {
          background-color: $design;
        }
        &.develop {
          background-color: $develop;
        }
        &.test {
          background-color: $test;
        }
        &.deploy {
          background-color: $deploy;
        }
      }
    }
  }
}
</style>
