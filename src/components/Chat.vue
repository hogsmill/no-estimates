<template>
  <div class="chat-div">
    <i class="fas fa-comments" @click="show()" title="Chat to other teams or facilitators" />
    <div v-if="totalMessages()" class="roundel">
      <span>{{ totalMessages() }}</span>
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

export default {
  computed: {
    activeTeams() {
      return this.$store.getters.getActiveTeams
    },
    messages() {
      return this.$store.getters.getMessages
    },
    facilitatorMessages() {
      return this.$store.getters.getFacilitatorMessages
    }
  },
  methods: {
    show() {
      this.$store.dispatch('showModal', 'chat')
    },
    totalMessages() {
      let total = 0
      for (let i = 0; i < this.activeTeams.length; i++) {
        total = total + this.noOfMessages(this.activeTeams[i])
      }
      total = total + this.noOfFacilitatorMessages()
      return total
    },
    noOfMessages(team) {
      let n = 0
      if (this.messages[team.name]) {
        for (let i = 0; i < this.messages[team.name].length; i++) {
          const message = this.messages[team.name][i]
          if (message.source == 'them' && !message.seen) {
            n = n + 1
          }
        }
      }
      return n
    },
    noOfFacilitatorMessages() {
      let n = 0
      for (let i = 0; i < this.facilitatorMessages.length; i++) {
        const message = this.facilitatorMessages[i]
        if (message.source == 'them' && !message.replySeen) {
          n = n + 1
        }
      }
      return n
    }
  }
}
</script>

<style lang="scss">
  .fa-comments {
    float: right;
    margin-left: 12px;
    font-size: xx-large;
    color: #ddd;

    &:hover {
      cursor: pointer;
      color: #fff;
    }
  }
  .roundel {
    span {
      background-color: red;
      border: 2px solid #fff;
      width: 16px;
      height: 16px;
      float: right;
      position: relative;
      z-index: 10;
      top: -12px;
      border-radius: 8px;
      font-size: 8px;
      font-weight: bold;
      text-align: center;
    }
  }
</style>
