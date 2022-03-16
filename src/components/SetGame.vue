<template>
  <span>
    <button class="btn btn-sm btn-secondary smaller-font" @click="show()">
      Set Up
    </button>
    <button v-if="gameName && myName.id" class="btn btn-sm btn-secondary smaller-font" @click="makeMeCaptain()">
      Make Me Captain
    </button>
  </span>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import bus from '../socket.js'

import stringFuns from '../lib/stringFuns.js'

export default {
  data() {
    return {

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
    }
  },
  methods: {
    show() {
      this.$store.dispatch('showModal', 'setGame')
    },
    makeMeCaptain() {
      if (confirm('Make yourself captain of the ' + this.teamName + ' team?')) {
        bus.emit('sendMakeCaptain', {gameName: this.gameName, teamName: this.teamName, myName: this.myName})
      }
    }
  }
}
</script>

<style lang="scss">



</style>
