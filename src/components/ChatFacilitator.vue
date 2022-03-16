<template>
  <div class="chat-div">
    <i class="far fa-comments" @click="show(true)" />
    <div v-if="totalMessages()" class="roundel">
      <span>{{ totalMessages() }}</span>
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

export default {
  data() {
    return {
      selectedMessage: ''
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    facilitatorMessages() {
      return this.$store.getters.getFacilitatorMessages
    }
  },
  methods: {
    show() {
      this.$store.dispatch('showModal', 'chatFacilitator')
    },
    getMessageClass(message) {
      return message.source == 'us' ? 'our-message' : 'their-message'
    },
    totalMessages() {
      let n = 0
      for (let i = 0; i < this.facilitatorMessages.length; i++) {
        if (!this.facilitatorMessages[i].seen) {
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
