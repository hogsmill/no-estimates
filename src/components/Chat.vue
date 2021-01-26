<template>
  <div class="chat-div">
    <i class="fas fa-comments" @click="show()" title="Chat to other teams or facilitators" />
    <div v-if="totalMessages()" class="roundel">
      <span>{{ totalMessages() }}</span>
    </div>

    <modal name="chat-popup" class="popup" :height="600" :width:="800" :classes="['rounded']">
      <div class="text-right">
        <span @click="hide()" class="glyphicon glyphicon-star">x</span>
      </div>
      <div>
        <h4>Chat to Other Teams</h4>
        <table>
          <tr>
            <td colspan="2">
              <h5 v-if="chattingTo">
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
                    <i v-if="message.source == 'them' && !message.seen" class="fas fa-eye-slash" @click="facilitationMessageSeen(message, index)" />
                    yyy {{ message.message }}
                    <div v-if="message.reply" class="reply">
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
    </modal>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      chattingTo: '',
    }
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
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
    show() {
      this.$modal.show('chat-popup')
    },
    hide() {
      this.$modal.hide('chat-popup')
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
    totalMessages() {
      let total = 0
      for (let i = 0; i < this.activeTeams.length; i++) {
        total = total + this.noOfMessages(this.activeTeams[i])
      }
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
        if (message.source == 'them' && !message.seen) {
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
          this.socket.emit('sendMessageToFacilitators', {gameName: this.gameName, teamName: this.teamName, message: message})
        } else {
          this.socket.emit('sendMessage', {gameName: this.gameName, teamName: this.teamName, chattingTo: this.chattingTo, message: message})
        }
      }
    },
    sendMessageToFacilitators() {
      const message = document.getElementById('new-message').value
      this.socket.emit('sendMessageToFacilitators', {gameName: this.gameName, teamName: this.teamName, message: message})
    },
    messageSeen(messages, index) {
      messages[index].seen = true
      this.messages[this.chattingTo] = messages
      this.socket.emit('updateMessages', {gameName: this.gameName, teamName: this.teamName, messages: this.messages})
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
  h4, h5 {
    text-align: center;
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
        margin: 6px 0 0 12px
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
