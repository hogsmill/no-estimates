
function total(workCards) {
  let total = 0
  for (let i = 0; i < workCards.length; i++) {
    if (workCards[i].value) {
      total += workCards[i].value
    }
  }
  return total
}

module.exports = {

  run: function(res) {
    const results = {
      teams: [],
      value: []
    }
    for (let i = 0; i < res.length; i++) {
      results.teams.push(res[i].teamName)
      results.value.push(total(res[i].workCards))
    }
    return results
  }
}
