<template>
  <tr>
    <td>
      My Name
    </td>
    <td v-if="myName.id && !change">
      <span class="setup-label">{{ myName.name }}</span>
      <button class="btn btn-sm btn-secondary smaller-font setup-change" @click="changeMyName">
        &#128393;
      </button>
    </td>
    <td v-if="!myName.id || change">
      <input type="text" id="my-name" class="form-control setup-input" :value="myName.name">
      <button class="btn btn-sm btn-secondary smaller-font save-button" @click="saveMyName">
        Save
      </button>
    </td>
    <td>
      <input type="checkbox" id="captain" :checked="myName.captain"> Team Captain?
    </td>
  </tr>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import stringFuns from '../../lib/stringFuns.js'

export default {
  data() {
    return {
      change: false
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
    }
  },
  methods: {
    changeMyName: function() {
      this.change = true
      this.$store.dispatch('settingUp', {setting: 'My Name', value: true})
    },
    saveMyName: function() {
      const oldName = this.myName
      let newName = document.getElementById('my-name').value
      const captain = document.getElementById('captain').checked
      newName = stringFuns.sanitize(newName)
      if (newName != '') {
        let myNameData
        if (!oldName.id) {
          const uuid = uuidv4()
          myNameData = {id: uuid, name: newName, captain: captain, host: this.isHost}
          localStorage.setItem('myName', JSON.stringify(myNameData))
          this.$store.dispatch('setMyName', myNameData)
        } else {
          myNameData = {id: this.myName.id, name: newName, captain: captain, host: this.isHost}
          this.$store.dispatch('changeName', {name: newName, captain: captain, host: this.isHost})
          localStorage.setItem('myName', JSON.stringify(myNameData))
          if (this.gameName) {
            window.bus.$emit('changeName', {gameName: this.gameName, name: oldName, newName: newName, captain: captain})
          }
        }
      }
      this.change = false
      this.$store.dispatch('settingUp', {setting: 'My Name', value: false})
    }
  }
}
</script>

<style lang="scss">

</style>
