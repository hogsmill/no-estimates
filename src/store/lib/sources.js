
const sources = [
  {name: 'Amount of Work in Progress', show: false} ,
  {name: 'Cards getting blocked', show: false} ,
  {name: 'Deployment Failing', show: false} ,
  {name: 'Urgent cards', show: false} ,
  {name: 'Dependencies', show: false},
  {name: 'Devops (working on Autodeploy)', show: false},
  {name: 'No work in specialisation', show: false},
  {name: 'Resource utilisation ("1 left at end of day)")', show: false},
  {name: 'PM (Vince!)")', show: false},
  {name: 'Losing a tester")', show: false}
]

module.exports = {

  sources: function() {
    return sources
  }
}
