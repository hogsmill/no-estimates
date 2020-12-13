<template>
  <span>
    <i class="fas fa-comments" @click="show()" />
    <div v-if="totalMessages()" class="roundel">
      <span>{{ totalMessages() }}</span>
    </div>

    <modal name="chat-popup" class="popup" :height="600" :classes="['rounded']">
      <div class="text-right">
        <span @click="hide" class="glyphicon glyphicon-star">x</span>
      </div>
      <div>
        <h4>Chat to Other Teams</h4>
        <table>
          <tr class="teams-header">
            <td>
              <div v-for="(team, index) in activeOtherTeams(true)" :key="index"
                   class="messages-waiting" :style="{ 'background-color': team.name.toLowerCase() }"
                   @click="chatTo(team.name)"
              >
                {{ team.name }}
                <div class="no-of-messages-waiting">
                  {{ noOfMessages(team) }}
                </div>
              </div>
            </td>
            <td class="right">
              Chat to Team:
              <select id="select-chat-team" class="select-chat-team">
                <option value="">
                  -- Select --
                </option>
                <option v-for="(team, index) in activeOtherTeams(false)" :key="index" :selected="chattingTo == team.name" :value="team.name">
                  {{ team.name }}
                </option>
              </select>
              <button class="btn btn-sm btn-site-primary" @click="chatTo()">Chat</button>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <h5 v-if="chattingTo">Chatting To: '{{ chattingTo }}'</h5>
              <h5 v-if="!chattingTo">Chat</h5>
              <span class="us"><i class="fas fa-arrow-left" /> us</span>
              <span class="them">them <i class="fas fa-arrow-right" /></span>
              <div class="chat">
                <div v-if="chattingTo">
                  <div v-for="(message, index) in messages[chattingTo]" :key="index" :class=" getMessageClass(message)">
                    <i v-if="message.source == 'them' && !message.seen" class="fas fa-eye-slash" @click="messageSeen(messages[chattingTo], index)" />
                    {{ message.message }}
                  </div>
                </div>
              </div>
              <div class="new-message">
                <input type="text" id="new-message">
                <i class="fas fa-share" @click="sendMessage()" />
              </div>
            </td>
          </tr>
        </table>
      </div>
    </modal>

  </span>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      chattingTo: ''
    }
  },
  computed: {
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
    chatTo(team) {
      if (!team) {
        team = document.getElementById('select-chat-team').value
      }
      this.chattingTo = team
      this.scroll()
    },
    sendMessage() {
      if (!this.chattingTo) {
        alert('Please select a team to contact')
      } else {
        const message = document.getElementById('new-message').value
        this.socket.emit('sendMessage', {gameName: this.gameName, teamName: this.teamName, chattingTo: this.chattingTo, message: message})
      }
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

    &:hover {
      cursor: pointer;
      opacity: 1;
    }

    .no-of-messages-waiting {
      position: absolute;
      right: -4px;
      top: 14px;
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

    .teams-header {
      vertical-align: bottom;

    .right {
      text-align: right;
    }
    .select-chat-team {
        margin-right: 6px;
      }
    }
    .them {
      float: right;
    }
    .chat {
      width: 100%;
      height: 340px;
      border: 1px solid;
      overflow-y: auto;

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
    }
    .new-message {
      margin: 8px 0;

      input {
        width: 542px;
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
