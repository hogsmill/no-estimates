<template>
  <div class="chat-div">
    <i class="far fa-comments" @click="show(true)" />
    <div v-if="totalMessages()" class="roundel">
      <span>{{ totalMessages() }}</span>
    </div>

    <modal name="faciltator-chat-popup" class="popup" :height="600" :classes="['rounded']">
      <div class="text-right">
        <span @click="hide()" class="glyphicon glyphicon-star">x</span>
      </div>
      <div>
        <h4>Questions to Facilitators</h4>
        <p class="click-to-answer">
          (Click on questions to answer)
        </p>
        <table class="facilitator">
          <tr>
            <td>
              <span class="us"><i class="fas fa-arrow-left" /> us</span>
              <span class="them">them <i class="fas fa-arrow-right" /></span>
              <div class="chat facilitators">
                <div v-for="(message, index) in facilitatorMessages" :key="index" @click="setSelectedMessage(index)"
                     :class="getMessageClass(message)" :style="{ 'background-color': message.team.toLowerCase(), 'color': '#fff' }"
                >
                  <i v-if="message.source == 'them' && !message.seen" class="fas fa-eye-slash" @click="facilitatorMessageSeen(index)" />
                  {{ message.message }}
                  <div v-if="message.reply" class="reply">
                    {{ message.reply }}
                  </div>
                </div>
              </div>
              <div class="new-facilitator-message">
                <input type="text" id="selected-facilitator-message" placeholder="Question">
                <input type="text" id="facilitator-answer" placeholder="Type answer here">
                <i class="fas fa-share" @click="answerFacilitatorQuestion()" />
              </div>
            </td>
          </tr>
        </table>
      </div>
    </modal>
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
      this.scroll()
      return this.$store.getters.getFacilitatorMessages
    }
  },
  methods: {
    show() {
      this.$modal.show('faciltator-chat-popup')
    },
    hide() {
      this.$modal.hide('faciltator-chat-popup')
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
    totalMessages() {
      let n = 0
      for (let i = 0; i < this.facilitatorMessages.length; i++) {
        if (!this.facilitatorMessages[i].seen) {
          n = n + 1
        }
      }
      return n
    },
    setSelectedMessage(i) {
      this.selectedMessage = i
      document.getElementById('selected-facilitator-message').value = this.facilitatorMessages[i].message
    },
    answerFacilitatorQuestion() {
      this.facilitatorMessageSeen(this.selectedMessage)
      const message = this.facilitatorMessages[this.selectedMessage]
      const reply = document.getElementById('facilitator-answer').value
      bus.$emit('sendAnswerFacilitatorQuestion', {gameName: this.gameName, message: message, reply: reply})
    },
    facilitatorMessageSeen(index) {
      const messages = this.facilitatorMessages
      messages[index].seen = true
      bus.$emit('sendUpdateFacilitatorMessages', {gameName: this.gameName, teamName: this.teamName, messages: messages})
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
  p.click-to-answer {
    font-style: italic;
    text-align: center;
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
  table.facilitator {
    width: 100%;

    .teams-header {
      vertical-align: bottom;

    .right {
      text-align: right;

      .chat-to {
        margin-bottom: 4px;
      }
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
      height: 380px;
      border: 1px solid;
      overflow-y: auto;

      div {
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
    .new-facilitator-message {
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
