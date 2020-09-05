
module.exports = {

  removeNameFromRoles: function(name, roles, team) {
    var i, j, newRoles = []
    for (i = 0; i < roles.length; i++) {
      var names = []
      for (j = 0; j < roles[i].names.length; j++) {
        if (name.id != roles[i].names[j].id) {
          names.push(roles[i].names[j])
        }
      }
      roles[i].names = names
      var otherNames = []
      for (j = 0; j < roles[i].otherNames.length; j++) {
        if (name.id != roles[i].otherNames[j].id) {
          otherNames.push(roles[i].names[j])
        }
      }
      roles[i].otherNames = otherNames
      newRoles.push(roles[i])
    }
    return newRoles
  },

  addNameToRoles: function(name, role, roles, team) {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].role == role) {
        roles[i].names.push(name)
      }
    }
    return roles
  },

  setRolesEffort: function(roles, data) {
    var capacity = data.capacity ? data.capacity : 4
    for (var i = 0; i < roles.length; i++) {
      for (var j = 0; j < roles[i].names.length; j++) {
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
