
function _cardIsPlayable(card) {
  let playable = false
  const cols = Object.keys(card.effort)
  for (let i = 0; i < cols.length; i++) {
    if (!card.blocked && card.effort[cols[i]] < card[cols[i]]) {
      playable = true
    }
  }
  return playable
}

function _memberHasEffort(member) {
  return member.effort.available > 1
}

module.exports = {

  aCardIsPlayable: function(game) {
    let playable = false
    for (let i = 0; i < game.columns.length - 1; i++) {
      const column = game.columns[i]
      for (let j = 0; j < column.cards.length; j++) {
        const card = column.cards[j]
        if (_cardIsPlayable(card)) {
          console.log('    Card #' + card.number + ' is playable')
          playable = true
        }
      }
    }
    return playable
  },

  effortCanBeAssigned: function(game) {
    let effortAvailable = false
    for (let i = 0; i < game.members.length; i++) {
      const member = game.members[i]
      // TODO: Make this allow other roles, i.e. 1 left
      if (member.effort.available > 1) {
        console.log('    ' + member.name + ' has ' + member.effort.available + ' effort available')
        effortAvailable = true
      }
    }
    return effortAvailable
  },

  cardIsPlayable: function(card) {
    return _cardIsPlayable(card)
  },

  memberHasEffort: function(member) {
    return _memberHasEffort(member)
  }
  
}
