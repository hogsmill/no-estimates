
module.exports = {

  removeNameFromRoles: function(name, roles) {
    var i, j, newRoles = []
    for (i = 0; i < roles.length; i++) {
      var role = roles[i]
      role.names = []
      for (j = 0; j < roles[i].names.length; j++) {
        if (name.id != roles[i].names[j].id) {
          role.names.push(roles[i].names[j])
        }
      }
      role.otherNames = []
      for (j = 0; j < roles[i].otherNames.length; j++) {
        if (name.id != roles[i].otherNames[j].id) {
          role.otherNames.push(roles[i].names[j])
        }
      }
      newRoles.push(role)
    }
    return newRoles
  },

  addNameToRoles: function(name, role, roles) {
    for (i = 0; i < roles.length; i++) {
      if (roles[i].role == role.role) {
        roles[i].names.push(name)
      }
    }
    return roles
  }
}
