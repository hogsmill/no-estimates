<template>
  <vue-final-modal name="chat" classes="modal-container" content-class="vfm__content modal-content" v-model="modals['chat']">
    <div class="text-right">
      <span @click="hide()" class="glyphicon glyphicon-star">x</span>
    </div>
    <div>
      <h4>Chat to Other Teams</h4>
      <table>
        <tr>
          <td colspan="2" class="chatting-to">
            <h5 v-if="chattingTo" :style="{ 'color': '#fff', 'background-color': chattingTo == 'Facilitators' ? '#666' : chattingTo.toLowerCase() }">
              Chatting To: '{{ chattingTo }}'
            </h5>
            <h5 v-if="!chattingTo">
              Chat
            </h5>
          </td>
        </tr>
        <tr class="teams-header">
          <td class="teams-column">
            <div v-for="(team, index) in activeOtherTeams()" :key="index"
               class="messages-waiting" :style="{ 'background-color': team.name.toLowerCase() }"
               @click="chatTo(team.name)"
            >
              {{ team.name }}
              <div v-if="noOfMessages(team)" class="no-of-messages-waiting">
                {{ noOfMessages(team) }}
              </div>
            </div>
            <div class="messages-waiting facilitators" @click="chatTo('Facilitators')">
              Facilitators
              <div v-if="noOfFacilitatorMessages()" class="no-of-messages-waiting">
                {{ noOfFacilitatorMessages() }}
              </div>
            </div>
            <div class="chat-to">
              Chat to Team:
              <select id="select-chat-team" class="select-chat-team">
                <option value="">
                  -- Select --
                </option>
                <option v-for="(team, index) in activeOtherTeams(false)" :key="index" :selected="chattingTo == team.name" :value="team.name">
                  {{ team.name }}
                </option>
                <option :selected="chattingTo == 'Facilitators'">
                  Facilitators
                </option>
              </select>
              <i class="fas fa-share" @click="chatTo()" />
            </div>
          </td>
          <td>
            <span class="us"><i class="fas fa-arrow-left" /> us</span>
            <span class="them">them <i class="fas fa-arrow-right" /></span>
            <div class="chat">
              <div v-if="chattingTo && chattingTo != 'Facilitators'">
                <div v-for="(message, index) in messages[chattingTo]" :key="index" :class="getMessageClass(message)">
                  <i v-if="message.source == 'them' && !message.seen" class="fas fa-eye-slash" @click="messageSeen(messages[chattingTo], index)" />
                  {{ message.message }}
                </div>
              </div>
              <div v-if="chattingTo == 'Facilitators'">
                <div v-for="(message, index) in facilitatorMessages" :key="index" :class="getMessageClass(message)">
                  <i v-if="message.source == 'them' && !message.seen" class="fas fa-eye-slash" />
                  {{ message.message }}
                  <div v-if="message.reply" class="reply">
                    <i v-if="!message.replySeen" class="fas fa-eye-slash" @click="facilitationReplySeen(facilitatorMessages, index)" />
                    {{ message.reply }}
                  </div>
                </div>
              </div>
            </div>
            <div class="new-message">
              <input type="text" id="new-message">
              <i v-if="chattingTo" class="fas fa-share" @click="sendMessage()" />
            </div>
          </td>
        </tr>
      </table>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  },
  data() {
    return {
      chattingTo: '',
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    activeTeams() {
      return this.$store.getters.getActiveTeams
    },
    messages() {
      this.scroll()
      return this.$store.getters.getMessages
    },
    facilitatorMessages() {
      this.scroll()
      return this.$store.getters.getFacilitatorMessages
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'chat')
    },
    scroll() {
      if (document.getElementsByClassName('chat').length) {
        setTimeout(function() {
          const chat = document.getElementsByClassName('chat')[0]
          if (chat) {
            chat.scrollTop = chat.scrollHeight
          }
        }, 500)
      }
    },
    getMessageClass(message) {
      return message.source == 'us' ? 'our-message' : 'their-message'
    },
    activeOtherTeams(withMessages) {
      const teams = []
      for (let i = 0; i < this.activeTeams.length; i++) {
        const team = this.activeTeams[i]
        if (team.name != this.teamName && (!withMessages || this.noOfMessages(team))) {
          teams.push(this.activeTeams[i])
        }
      }
      return teams
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
    },
    chatTo(team) {
      if (!team) {
        team = document.getElementById('select-chat-team').value
      }
      this.chattingTo = team
      this.scroll()
    },
    sendMessage(facilitator) {
      if (!this.chattingTo && !facilitator) {
        alert('Please select a team to contact')
      } else {
        const message = document.getElementById('new-message').value
        if (this.chattingTo == 'Facilitators') {
          bus.emit('sendSendMessageToFacilitators', {gameName: this.gameName, teamName: this.teamName, message: message})
        } else {
          bus.emit('sendSendMessage', {gameName: this.gameName, teamName: this.teamName, chattingTo: this.chattingTo, message: message})
        }
      }
    },
    sendMessageToFacilitators() {
      const message = document.getElementById('new-message').value
      bus.emit('sendSendMessageToFacilitators', {gameName: this.gameName, teamName: this.teamName, message: message})
    },
    messageSeen(messages, index) {
      messages[index].seen = true
      this.messages[this.chattingTo] = messages
      bus.emit('sendUpdateMessages', {gameName: this.gameName, teamName: this.teamName, messages: this.messages})
    },
    facilitationReplySeen(messages, index) {
      messages[index].replySeen = true
      bus.emit('sendUpdateFacilitatorMessages', {gameName: this.gameName, teamName: this.teamName, messages: messages})
    }
  }
}
</script>

<style lang="scss">
  h4, h5 {
    text-align: center;
  }
  .chatting-to {
    h5 {
      color: #444;
      background-color: #fff;
    }
  }
  h5 {
    margin: 12px auto 0 auto;
  }
  .messages-waiting {
    color: #fff;
    padding: 2px;
    margin: 6px;
    border-radius: 12px;
    text-align: center;
    opacity: 0.75;
    position: relative;
    width: 120px;

    &:hover {
      cursor: pointer;
      opacity: 1;
    }

    &.facilitators {
      color: #444;
      border: 1px solid;
    }

    .no-of-messages-waiting {
      position: absolute;
      right: -4px;
      top: 14px;
      color: #fff;
      background-color: red;
      border: 2px solid #fff;
      width: 16px;
      height: 16px;
      z-index: 10;
      border-radius: 8px;
      font-size: 8px;
      font-weight: bold;
      text-align: center;
    }
  }
  table {
    width: 100%;

    td {
      vertical-align: top;
    }
    .teams-header {
      vertical-align: bottom;

    .teams-column {
      padding-top: 30px;
    }

    .chat-to {
      margin-top: 24px;
      margin-bottom: 4px;
      text-align: center;
    }
    .select-chat-team {
        margin-right: 6px;
      }
    }
    .them {
      float: right;
    }
    .chat {
      width: 432px;
      height: 380px;
      border: 1px solid;
      overflow-y: auto;

      &.facilitators {
        height: 450px;
      }

      div div {
        border: 1px solid #888;
        padding: 6px;
        border-radius: 6px;
      }
      .their-message {
        margin: 6px 6px 6px 100px;
        background-color: #ddd;
      }
      .our-message {
        margin: 6px 100px 6px 6px;
      }

      .reply {
        background-color: #fff;
        margin: 6px 0 0 12px;
        color: #444;
      }
    }
    .new-message {
      margin: 8px 0;

      input {
        width: 400px;
      }
      .fa-share {
        opacity: 0.75;
        margin-left: 6px;
        font-size: x-large;

        &:hover {
          cursor: pointer;
          opacity: 1;
        }
      }
    }
  }
</style>
