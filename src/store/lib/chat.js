
module.exports = {

  addMessage: function(messages, team, chattingTo, source, message) {
    const teamMessages = messages[chattingTo] ? messages[chattingTo] : []
    teamMessages.push({source: source, message: message, seen: false})
    messages[chattingTo] = teamMessages
    return messages
  }
}
