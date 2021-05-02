<template>
  <table v-if="feature('delivery')" class="game-delivery">
    <tr>
      <td colspan="4">
        <h4>
          Backlog
        </h4>
        <i v-if="showBacklog" @click="setShowBacklog(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showBacklog" @click="setShowBacklog(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showBacklog">
      <td class="left-col">
        Backlog is generated?
      </td>
      <td colspan="4" class="left">
        <input type="checkbox" id="backlog-generated" class="form-control" :checked="config.backlogGenerated" @click="toggleBacklogGenerated()">
      </td>
    </tr>
    <tr v-if="showBacklog && config.backlogGenerated">
      <td class="left-col">
        Backlog takes effort to create item?
      </td>
      <td>
        <input type="checkbox" id="backlog-effort" class="form-control" :checked="config.backloEffort" @click="toggleBacklogEffort()">
      </td>
      <td>
        Effort per card <input type="text" id="backlog-effort-points" class="form-control" :value="config.backlogEffortPoints">
      </td>
      <td>
        <button class="btn btn-sm btn-site-primary" @click="setBacklogEffort()">
          Save
        </button>
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../../socket.js'

export default {
  data() {
    return {
      showBacklog: false
    }
  },
  computed: {
    config() {
      return this.$store.getters.getConfig
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  methods: {
    setShowBacklog(val) {
      this.showBacklog = val
    },
    feature(feature) {
      return Object.keys(this.config).find(function(k) {
        return k == feature
      })
    },
    toggleBacklogGenerated() {
      const backlogGenerated = document.getElementById('backlog-generated').checked
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'backlogGenerated', value: backlogGenerated})
    },
    toggleBacklogEffort() {
      const backlogEffort = document.getElementById('backlog-effort').checked
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'backlogEffort', value: backlogEffort})
    },
    setBacklogEffort() {
      const backlogEffortPoints = document.getElementById('backlog-effort-points').value
      bus.$emit('sendUpdateConfig', {gameName: this.gameName, field: 'backlogEffortPoints', value: backlogEffortPoints})
    }
  }
}
</script>

<style lang="scss">
  .game-backlog {
    .left-col {
      width: 30%;
    }
    input {
      margin: 0 !important;
      display: inline-block;
    }
  }
</style>
