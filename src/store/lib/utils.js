
module.exports = {

  safePush: function(obj, key, val) {
    if (!obj[key]) {
      obj[key] = []
    }
    obj[key].push(val)
    return obj
  }
}
