
module.exports = {

  removeNameFromRoles: function(name, roles, ) {
    let i, j
    const newRoles = []
    for (i = 0; i < roles.length; i++) {
      const names = []
      for (j = 0; j < roles[i].names.length; j++) {
        if (name.id != roles[i].names[j].id) {
          names.push(roles[i].names[j])
        }
      }
      roles[i].names = names
      const otherNames = []
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

  addNameToRoles: function(name, role, roles, ) {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].role == role) {
        roles[i].names.push(name)
      }
    }
    return roles
  },

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
