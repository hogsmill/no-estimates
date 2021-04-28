
const currencies = [
  {name: 'pound', symbol: '£', major: '&pound;', minor: 'p', selected: true},
  {name: 'euro', symbol: '€', major: '&#8364;', minor: 'c', selected: false},
  {name: 'dollar', symbol: '$', major: '&dollar;', minor: 'c', selected: false}
]

module.exports = {

  currencies: function() {
    return currencies
  },

  setCurrency: function(currencies, currency) {

    const currs = []
    for (let i = 0; i < currencies.length; i++) {
      const curr = currencies[i]
      curr.selected = curr.name == currency
      currs.push(curr)
    }
    return currs
  }
  
}
