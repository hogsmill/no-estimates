
const StringFuns = {

  properCase: function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  },

  roleToColumn: function(role) {
    return role.replace(/er$/, '').toLowerCase()
  }
}

export default StringFuns
