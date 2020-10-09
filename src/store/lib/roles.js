
function addRole(members, name, role) {
  let found = false
  for (let i = 0; i < members.length; i++) {
    if (members[i].id == name.id) {
      found = true
      members[i].role = role
    }
  }
  return members
}

function generateRolesFromMembers(members, role) {
  let roleMembers = []
  for (let i = 0; i < members.length; i++) {
    if (role.role == members[i].role) {
      roleMembers.push(members[i])
    }
  }
  return roleMembers
}

function generateRolesForTeam(team, roles) {
  let teamRoles = []
  for (let i = 0; i < roles.length; i++) {
    roles[i].names = generateRolesFromMembers(team.members, roles[i])
    teamRoles.push(roles[i])
  }
  return teamRoles
}

module.exports = {

  addMyRole: function(game, data) {
    for (let i = 0; i < game.teams.length; i++) {
      if (game.teams[i].name == data.teamName) {
        game.teams[i].members = addRole(game.teams[i].members, data.myName, data.myRole)
      }
    }
    return game
  },

  generateRoles: function(game) {
    for (let i = 0; i < game.teams.length; i++) {
      if (game.teams[i].name == game.teamName) {
        const roles = game.roles
        game.roles = generateRolesForTeam(game.teams[i], roles)
      }
    }
    return game
  },

  // Existing stuff...
  //
  //addNameToRoles: function(name, role, roles) {
  //  for (let i = 0; i < roles.length; i++) {
  //    if (roles[i].role == role) {
  //      roles[i].names.push(name)
  //    }
  //  }
  //  return roles
  //},
  //
  //removeNameFromRoles: function(name, roles) {
  //  let i, j
  //  const newRoles = []
  //  for (i = 0; i < roles.length; i++) {
  //    const names = []
  //    for (j = 0; j < roles[i].names.length; j++) {
  //      if (name.id != roles[i].names[j].id) {
  //        names.push(roles[i].names[j])
  //      }
  //    }
  //    roles[i].names = names
  //    const otherNames = []
  //    for (j = 0; j < roles[i].otherNames.length; j++) {
  //      if (name.id != roles[i].otherNames[j].id) {
  //        otherNames.push(roles[i].names[j])
  //      }
  //    }
  //    roles[i].otherNames = otherNames
  //    newRoles.push(roles[i])
  //  }
  //  return newRoles
  //},

  setRolesEffort: function(roles, data) {
    let capacity = data.capacity ? data.capacity : 4
    for (let i = 0; i < roles.length; i++) {
      for (let j = 0; j < roles[i].names.length; j++) {
        if (roles[i].role == 'Tester' && data.testCapacity) {
          capacity = data.testCapacity
        }
        if (roles[i].names[j].effort) {
          roles[i].names[j].effort.available = capacity
        }
      }
    }
    return roles
  }
}
