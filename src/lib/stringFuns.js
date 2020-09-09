
const StringFuns = {

  properCase: function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  },

  roleToColumn: function(role) {
    return role.replace(/er$/, '').toLowerCase()
  },

  sanitize: function(s) {
    return s.replaceAll(/[^a-zA-Z0-9' ]/g, '').trim()
  }
}

export default StringFuns
