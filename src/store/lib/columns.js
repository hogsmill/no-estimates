
const design = '#b10018'
const develop = '#76a001'
const test = '#0067b1'
const deploy = '#4f0384'
const done = 'navy'

const colours = [
  design,
  develop,
  test,
  deploy,
  done,
  'Orange',
  'Black',
  'Grey',
  'Brown',
  'Magenta',
  'Salmon',
  'Teal'
]
const initialColumns = [
  {name: 'design', order: 1, cards: [], include: true, colour: design, wipLimit: 0},
  {name: 'develop', order: 2, cards: [], include: true, colour: develop, wipLimit: 0},
  {name: 'test', order: 3, cards: [], include: true, colour: test, wipLimit: 0},
  {name: 'deploy', order: 4, cards: [], include: true, colour: deploy, wipLimit: 0},
  {name: 'done', order: 5, cards: [], include: true, colour: done, wipLimit: 0}
]

module.exports = {

  initialColumns: function() {
    return initialColumns
  }

}
