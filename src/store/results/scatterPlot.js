
module.exports = {

  scatterPlot: function(workCards) {
    const scatter = {
      data: [],
      labels: []
    }
    for (let i = 0; i < workCards.length; i++) {
      if (workCards[i].delivery) {
        const card = workCards[i]
        const delivery = card.delivery
        const elapsed = card.delivery - card.commit
        scatter.data.push({
          x: delivery,
          y: elapsed
        })
        scatter.labels.push(
          '#' + card.number + ' - ' +
          'Completed on day ' + delivery + ', ' +
          elapsed + ' days elapsed'
        )
      }
    }
    return scatter
  },

  limits: function(data) {
    data = data.sort(function(a, b) {
      return a.y - b.y
    })
    const len = data.length - 1
    limits = {
      75: data[Math.round(len * 0.75)].y,
      90: data[Math.round(len * 0.90)].y,
      95: data[Math.round(len * 0.95)].y,
      99: data[Math.round(len * 0.99)].y
    }
    return limits
  }
}
