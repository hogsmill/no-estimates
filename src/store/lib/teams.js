
function addNameToTeam(members, name) {
  let found = false
  for (let i = 0; i < members.length; i++) {
    if (members[i].id == name.id) {
      found = true
      members[i].name = name.name
    }
  }
  if (!found) {
    name.role = ''
    name.otherRoles = []
    members.push(name)
  }
  return members
}

function removeNameFromTeam(members, name) {
  let newMembers = []
  for (let i = 0; i < members.length; i++) {
    if (members[i].id != name.id) {
      newMembers.push(members[i])
    }
  }
  return newMembers
}

module.exports = {

  addMyNameToTeam: function(game, data) {
    for (let i = 0; i < game.teams.length; i++) {
      if (game.teams[i].name == data.teamName) {
        game.teams[i].members = addNameToTeam(game.teams[i].members, data.myName)
      } else {
        game.teams[i].members = removeNameFromTeam(game.teams[i].members, data.myName)
      }
    }
    return game
  }
}
