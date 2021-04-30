<template>
  <div v-if="gameSpecificConfig.wipLimits" :style="{ 'background-color': column.colour }">
    <span>WIP: </span>
    <span v-if="editingWip != column.name" class="wip" @click="toggleEditingWip(column.name)">{{ column.wipLimit }}</span>
    <span v-if="editingWip == column.name">
      <input type="text" :id="'wip-' + column.name" class="edit-wip">
      <i class="fas fa-save" @click="saveWip(column.name)" />
    </span>
  </div>
</template>

<script>
import bus from '../../socket.js'

export default {
  props: [
    'column'
  ],
  data() {
    return {
      editingWip: ''
    }
  },
  computed: {
    gameSpecificConfig() {
      return this.$store.getters.getGameSpecificConfig
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    }
  },
  methods: {
    toggleEditingWip(column) {
      this.editingWip = column
    },
    saveWip(column) {
      const wip = document.getElementById('wip-' + column).value
      if (!wip.match(/^[0-9]+$/)) {
        alert('Please enter a number for WIP')
      } else {
        bus.$emit('sendSetColumnWip', {gameName: this.gameName, teamName: this.teamName, column: column, wipLimit: wip})
        this.editingWip = ''
      }
    }
  }
}
</script>

<style lang="scss">
  .edit-wip {
    height: 12px;
    width: 30px;
    margin-right: 6px;
  }
</style>
