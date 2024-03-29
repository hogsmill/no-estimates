
import { createStore } from 'vuex'

function setRows(config, state) {
  if (config.expediteLane && config.splitColumns) {
    state.rows = ['expedite', 'expeditedone', 'expeditedoing']
  } else if (config.splitColumns) {
    state.rows = ['done', 'doing']
  } else if (config.expediteLane) {
    state.rows = ['expedite', 'notexpedite']
  } else {
    state.rows = ['all']
  }
}

export const store = createStore({
  state: {
    appType: 'No Estimates',
    thisGame: 'No Estimates',
    session: null,
    userName: '',
    admin: false,
    connections: 0,
    connectionError: null,
    localStorageStatus: true,
    lastaccess: '',
    walkThrough: false,
    modals: {
      'feedback': false,
      'walkThrough': false,
      'setCaptain': false,
      'setEstimates': false,
      'setGame': false,
      'report': false,
      'eventCard': false,
      'retro': false,
      'autoDeployComplete': false,
      'goMobile': false,
      'results': {
        'cumulativeFlow': false,
        'correlation': false,
        'cycleTime': false,
        'distribution': false,
        'flowEfficiency': false,
        'flowEfficiencyCards': false,
        'scatterPlot': false,
        'sourcesOfVariation': false,
        'valueDelivered': false,
        'wip': false
      }
    },
    modalData: {},
    currentTab: 'game',
    hostId: '',
    stealth: false,
    currencies: [],
    gameName: '',
    members: [],
    myName: {id: '', name: '', captain: false, admin: false},
    myRole: '',
    teamName: '',
    teams: [
      { name: 'Blue', include: true },
      { name: 'Green', include: true },
      { name: 'Purple', include: true },
      { name: 'Red', include: true },
      { name: 'Orange', include: false },
      { name: 'Black', include: false },
      { name: 'Grey', include: false },
      { name: 'Brown', include: false },
      { name: 'Magenta', include: false },
      { name: 'Salmon', include: false },
      { name: 'Teal', include: false },
      { name: 'Navy', include: false },
      { name: 'Olive', include: false },
      { name: 'Turquoise', include: false },
      { name: 'Tan', include: false }
    ],
    pairing: [],
    message: '',
    roles: [
      'Designer',
      'Developer',
      'Tester',
      'Deployer'
    ],
    columns: [
      {name: 'design', order: 1, cards: []},
      {name: 'develop', order: 2, cards: []},
      {name: 'test', order: 3, cards: []},
      {name: 'deploy', order: 4, cards: []},
      {name: 'done', order: 5, cards: []}
    ],
    rows: [],
    currentDay: 1,
    eventCards: [
      {number: 1, text: 'Good Luck!<br/><br/>. Have you submitted an initial estimate for the project?<br/><br/>If not, click \'Report\' or \'Set Estimates\' and create your estimate now.'},
      {number: 2, text: 'Remember that manual deployments will fail a certain percentage of the time. In this case, you will need to re-do the deployment effort.'},
      {number: 3, function: 'Add 1 Point To Everyones Capacity', text: 'Pizza inspires your team to greatness! Add one to each person\'s capacity tomorrow.'},
      {number: 4, text: 'Did you remember that people can work in areas outside their speciality? They require two effort points to make one effort point in another area.'},
      {number: 5, function: 'Add 8 points to Deploy', confirm: true, autoDeployCard: true, text: 'You read that automating deployments can lead to better quality and more predictable delivery. If you\'d like to invest in that, you\'ll need to spend 8 effort points in Deploy (you can do this over multiple days)</br></br>(<em>You can do this later by clicking the \'*\' in the Deploy Column header</em>)'},
      {number: 6, text: 'Would someone like to learn a new skill? If a person spends five days working in a work stage different from his or her speciality, the person will be able to work in that state at a 1:1 effort ratio.'},
      {number: 7, text: 'Perhaps you have delivered at least one card? If so, are you able to forecast when you might deliver the Minimum Viable Product, which the Product Owner has defined as cards #1-11 '},
      {number: 8, text: 'In this game, you may have been committing to work on an individual work-item basis. Now a new Scrum Master has joined the company, and she wants you to do batch commitment (i.e. pull in as many stories at once as you believe you can accomplish in a week). Will you do this?'},
      {number: 9, function: 'Concurrent Dev and Test', confirm: true, text: 'Testers and Developers want to work together. You now have the option to do concurrent Dev and Test (i.e. no need to finish Development effort before beginning Testing). Do you want to do this?'},
      {number: 10, function: 'Spend a Day Estimating', text: 'Vince from the PMO says he\'s nervous that you\'re not producing enough according to your original estimate. As a result, he wants you to spend time re-estimating. Lock the team in a room for a day and do no delivery work tomorrow - update your estimate for delivering the entire project then click Next to go to the next day.'},
      {number: 11, text: 'Vince is satisfied with your estimate and sends it around to the business in an email titled \'Team commits to deadline\''},
      {number: 12, function: 'Lose Tester', text: 'Your organisation has lost a tester so if you have testers, one of them now has to support multiple teams. One tester loses two points of effort tomorrow.'},
      {number: 13, function: 'Recharting', text: 'Team rechartering! Would you like to restructure your team? Feel free to change role specialties (<i>click on \'Set Up\'</i>)  or negotiate with other teams to bring on new members. (Use the chat to talk to other teams!)'},
      {number: 14, text: 'If you restructured your team yesterday, how do you expect the change to impact your forecast?'},
      {number: 15, text: 'Jim from accounting sales sends an email directing employees to make sure they\'re fully utilised (i.e. follow a policy that you do not leave capacity on the table). Do you obey or silently ignore him?'},
      {number: 16, function: 'Show Cycle Time', height: 650, text: 'This graph shows how long each card took to complete, compared to their size - is there a relationship between size and time to complete?'},
      {number: 17, text: 'How much work in progress do you have? Has that changed from earlier?'},
      {number: 18, text: 'Many teams follow a batch-and-queue policy when it comes to deployment. That is, they develop work in sprints and then hand over the work to be deployed in a batch, often by a separate Operations group. What policy are you following in this game and why?'},
      {number: 19, text: 'Organizations often wonder what their delivery capacity is. Do you have a sense of your team\'s capacity? If so , how would you communicate it to stakeholders?'}
    ],
    workCards: [
      {number: 1, design: 6, develop: 7, test: 8, deploy: 2, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 2, design: 0, develop: 8, test: 6, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 3, design: 10, develop: 9, test: 9, deploy: 3, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 4, design: 4, develop: 9, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 5, design: 4, develop: 10, test: 5, deploy: 2, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 6, design: 1, develop: 8, test: 2, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 7, design: 1, develop: 10, test: 3, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 8, design: 0, develop: 4, test: 3, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 9, design: 10, develop: 4, test: 10, deploy: 6, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 10, design: 1, develop: 7, test: 10, deploy: 8, urgent: true, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 11, design: 8, develop: 10, test: 10, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 12, design: 3, develop: 8, test: 11, deploy: 3, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 13, design: 0, develop: 6, test: 9, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 14, design: 1, develop: 6, test: 3, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 15, design: 10, develop: 1, test: 5, deploy: 2, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 16, design: 2, develop: 5, test: 1, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 17, design: 3, develop: 6, test: 8, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 18, design: 0, develop: 7, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 19, design: 5, develop: 9, test: 4, deploy: 7, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 20, design: 8, develop: 8, test: 3, deploy: 7, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 21, design: 1, develop: 6, test: 5, deploy: 1, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 22, design: 0, develop: 10, test: 7, deploy: 7, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 23, design: 5, develop: 10, test: 11, deploy: 8, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 24, design: 0, develop: 6, test: 4, deploy: 6, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
      {number: 25, design: 3, develop: 2, test: 2, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}}
    ],
    otherCards: [],
    currentWorkCard: 0,
    messages: {},
    facilitatorMessages: {},
    config: {},
    sourcesOfVariation: [],
    selectedGraphTeams: {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null
    },
    graphConfig: {
      wip: {
        useMovingAverage: true,
        useDays: true
      },
      cumulativeFlow: {
        useDays: true
      },
      cycleTime: {
        small: 15,
        medium: 25
      },
      monteCarlo: {
        runs: 1000,
        runTo: '50'
      }
    },
    demoConfig: {
      runTo: 'MVP',
      runToCards: 11,
      running: false
    },
    retrosDone: {},
    recharting: false,
    concurrentDevAndTest: false,
    autoDeploy: {
      doing: false,
      effort: 0,
      done: false
    },
    projectEstimate: 0,
    projectActual: 0,
    mvpEstimate: 0,
    mvpActual: 0,
    reEstimate: 0,
    gameState: [],
    games: []
  },
  getters: {
    appType: (state) => {
      return state.appType
    },
    lsSuffix: (state) => {
      let suffix
      switch(state.appType) {
        case 'No Estimates':
          suffix = 'ne'
          break
        case 'Kanban Playground':
          suffix = 'kp'
          break
      }
      return suffix
    },
    thisGame: (state) => {
      return state.thisGame
    },
    getSession: (state) => {
      return state.session
    },
    getUserName: (state) => {
      return state.userName
    },
    getAdmin: (state) => {
      return state.admin
    },
    getModalData: (state) => {
      return state.modalData
    },
    getModals: (state) => {
      return state.modals
    },
    getCurrentTab: (state) => {
      return state.currentTab
    },
    getWalkThrough: (state) => {
      return state.walkThrough
    },
    getHostId: (state) => {
      return state.hostId
    },
    getConfig: (state) => {
      return state.config
    },
    getRows: (state) => {
      return state.rows
    },
    getStealth: (state) => {
      return state.stealth
    },
    getCurrency: (state) => {
      return state.currencies.find(function(c) {
        return c.selected
      })
    },
    getCurrencies: (state) => {
      return state.currencies
    },
    getGameName: (state) => {
      return state.gameName
    },
    getMyName: (state) => {
      return state.myName
    },
    getMyRole: (state) => {
      let role = ''
      const me = state.members.find(function(m) {
        return m.id == state.myName.id
      })
      role = me ? me.role : ''
      return role
    },
    getMyOtherRoles: (state) => {
      let roles = []
      const me = state.members.find(function(m) {
        return m.id == state.myName.id
      })
      roles = me ? me.otherRoles : []
      return roles
    },
    getMessage: (state) => {
      return state.message
    },
    getMyEffort: (state) => {
      let effort
      const me = state.members.find(function(m) {
        return m.id == state.myName.id
      })
      if (me) {
        effort = me.effort
      }
      return effort
    },
    getTeamName: (state) => {
      return state.teamName
    },
    getOtherCards: (state) => {
      return state.otherCards.sort(function(a, b) {
        const aEffortLeft = a.teamDependency - a.dependencyDone
        const bEffortLeft = b.teamDependency - b.dependencyDone
        return bEffortLeft - aEffortLeft
      })
    },
    getCapabilities: (state) => {
      return {
        concurrentDevAndTest: state.concurrentDevAndTest,
        autoDeploy: state.autoDeploy,
        recharting: state.recharting
      }
    },
    getMyTeamMembers: (state) => {
      let n = 0
      if (state.stealth) {
        for (let i = 0; i < state.members.length; i++) {
          if (!state.members[i].admin) {
            n = n + 1
          }
        }
      } else {
        n = state.members.length
      }
      return n
    },
    getMembers: (state) => {
      const members = []
      for (let i = 0; i < state.members.length; i++) {
        if (!(state.stealth && state.members[i].admin)) {
          members.push(state.members[i])
        }
      }
      return members
    },
    getTeams: (state) => {
      return state.teams
    },
    getActiveTeams: (state) => {
      const teams = []
      for (let i = 0; i < state.teams.length; i++) {
        if (state.teams[i].include) {
          teams.push(state.teams[i])
        }
      }
      return teams
    },
    getMessages: (state) => {
      return state.messages
    },
    getFacilitatorMessages: (state) => {
      return state.facilitatorMessages
    },
    getPairing: (state) => {
      return state.pairing
    },
    getFacilitatorStarts: (state) => {
      return state.config.facilitatorStarts
    },
    getAllowMobile: (state) => {
      return state.config.allowMobile
    },
    getAllowDemo: (state) => {
      return state.config.allowDemo
    },
    getGameRunning: (state) => {
      return state.config.gameRunning
    },
    getPercentageBlocked: (state) => {
      return state.config.percentageBlocked
    },
    getPercentageDeployFail: (state) => {
      return state.config.percentageDeployFail
    },
    getMvpCards: (state) => {
      return state.config.mvpCards
    },
    getDoRetros: (state) => {
      return state.config.doRetros
    },
    getRetroDays: (state) => {
      return state.config.retroDays
    },
    getRetroTimer: (state) => {
      return state.config.retroTimer
    },
    getRetroTime: (state) => {
      return state.config.retroTime
    },
    getRetrosDone: (state) => {
      return state.retrosDone
    },
    getGraphConfig: (state) => {
      return state.graphConfig
    },
    getDemoConfig: (state) => {
      return state.demoConfig
    },
    getSelectedGraphTeams: (state) => {
      console.log('teams', state.selectedGraphTeams)
      return state.selectedGraphTeams
    },
    getCurrentDay: (state) => {
      return state.currentDay
    },
    getRoleNames: (state) => {
      return state.roles
    },
    getRoles: (state) => {
      const roles = []
      for (let r = 0; r < state.roles.length; r++) {
        const role = {
          role: state.roles[r]
        }
        const names = []
        const otherNames = []
        for (let i = 0; i < state.members.length; i++) {
          if (state.roles[r] == state.members[i].role) {
            names.push(state.members[i])
          }
          for (let j = 0; j < state.members[i].otherRoles.length; j++) {
            if (state.roles[r] == state.members[i].otherRoles[j]) {
              otherNames.push(state.members[i])
            }
          }
        }
        role.names = names
        role.otherNames = otherNames
        roles.push(role)
      }
      return roles
    },
    getColumns: (state) => {
      return state.columns
    },
    getCurrentEventCard: (state) => {
      const card = state.eventCards.find(function(c) {
        return c.number == state.currentDay
      })
      return card ? card : {number: state.currentDay}
    },
    getCurrentWorkCard: (state) => {
      if (state.currentWorkCard < state.workCards.length) {
        return state.currentWorkCard
      } else {
        return false
      }
    },
    getWorkCards: (state) => {
      return state.workCards
    },
    getNoOfDoneCards: (state) => {
      let n
      for (let i = 0; i < state.columns.length; i++) {
        if (state.columns[i].name == 'done') {
          n = state.columns[i].cards.length
        }
      }
      return n
    },
    getProjectEstimate: (state) => {
      return state.projectEstimate
    },
    getProjectActual: (state) => {
      return state.projectActual
    },
    getMvpEstimate: (state) => {
      return state.mvpEstimate
    },
    getMvpActual: (state) => {
      return state.mvpActual
    },
    getReEstimate: (state) => {
      return state.reEstimate
    },
    getGameState: (state) => {
      return state.gameState
    },
    getGames: (state) => {
      return state.games
    },
    getSourcesOfVariation: (state) => {
      return state.sourcesOfVariation
    },
    getConnections: (state) => {
      return state.connections
    },
    getConnectionError: (state) => {
      return state.connectionError
    },
    getLocalStorageStatus: (state) => {
      return state.localStorageStatus
    },
    getLastAccessed: (state) => {
      return state.lastaccess
    }
  },
  mutations: {
    updateAppType: (state, payload) => {
      state.appType = payload
      state.thisGame = payload
    },
    updateLogin: (state, payload) => {
      state.session = payload.session
      state.userName = payload.userName
      state.admin = payload.loggedInAsAdmin
    },
    updateAdmin: (state, payload) => {
      state.admin = payload
    },
    setModalData: (state, payload) => {
      state.modalData = payload
    },
    showModal: (state, payload) => {
      const modals = Object.keys(state.modals)
      for (let i = 0; i < modals.length; i++) {
        state.modals[modals[i]] = false
      }
      state.modals[payload] = true
    },
    hideModal: (state, payload) => {
      state.modals[payload] = false
    },
    showResultModal: (state, payload) => {
      console.log('Showing', payload.modal)
      state.modalData = payload.data
      const modals = Object.keys(state.modals.results)
      for (let i = 0; i < modals.length; i++) {
        state.modals.results[modals[i]] = false
      }
      state.modals.results[payload.modal] = true
      console.log(state.modals)
    },
    hideResultModal: (state, payload) => {
      console.log('Hiding', payload)
      state.modals.results[payload] = false
    },
    updateCurrentTab: (state, payload) => {
      state.currentTab = payload
    },
    updateWalkThrough: (state, payload) => {
      state.walkThrough = payload
    },
    updateHost: (state, payload) => {
      state.host = payload
    },
    updateHostId: (state, payload) => {
      state.hostId = payload
    },
    loadTeam: (state, payload) => {
      state.members = payload.members
      state.workCards = payload.workCards
      state.otherCards = payload.otherCards
      state.columns = payload.columns
      state.daysEffort = payload.daysEffort
      state.retrosDone = payload.retrosDone
      state.currentDay = payload.currentDay
      state.currentWorkCard = payload.currentWorkCard
      state.messages = payload.messages
      state.projectEstimate = payload.projectEstimate
      state.reEstimate = payload.reEstimate
      state.projectActual = payload.projectActual
      state.mvpEstimate = payload.mvpEstimate
      state.mvpActual = payload.mvpActual
      state.pairing = payload.pairing
      state.recharting = payload.recharting
      state.concurrentDevAndTest = payload.concurrentDevAndTest
      state.canStartAutoDeploy = payload.canStartAutoDeploy
      state.autoDeploy = payload.autoDeploy

      const member = state.members.find(function(m) {
        return m.id == state.myName.id
      })
      // TODO: This is only ever null when running demo...
      if (member) {
        state.myName.captain = member.captain
      }
    },
    loadGame: (state, payload) => {
      state.teams = payload.teams
      state.facilitatorMessages = payload.facilitatorMessages
      state.stealth = payload.stealth
      state.currencies = payload.currencies
      state.percentageBlocked = payload.percentageBlocked
      state.percentageDeployFail = payload.percentageDeployFail
      state.sourcesOfVariation = payload.sourcesOfVariation
      state.config = payload.config
      state.graphConfig = payload.graphConfig
      state.demoConfig = payload.demoConfig
      state.lastaccess = payload.lastaccess
      setRows(state.config, state)
    },
    updateGameName: (state, payload) => {
      state.gameName = payload
    },
    updateMyName: (state, payload) => {
      if (payload.uuid && payload.uuid == state.myName.uuid) {
        state.myName.name = payload.name
        state.myName.captain = payload.captain
        state.myName.host = payload.host
      } else {
        state.myName = payload
      }
    },
    updateMessage: (state, payload) => {
      state.message = payload
    },
    updateTeamName: (state, payload) => {
      state.teamName = payload
    },
    setSelectedGraphTeam: (state, payload) => {
      state.selectedGraphTeams[payload.n] = payload.team
    },
    updateGameState: (state, payload) => {
      state.gameState = payload.gameState
    },
    updateGames: (state, payload) => {
      state.games = payload
    },
    updateSourcesOfVariation: (state, payload) => {
      state.sourcesOfVariation = payload
    },
    updateConnections: (state, payload) => {
      state.connections = payload
    },
    updateConnectionError: (state, payload) => {
      state.connectionError = payload
    },
    localStorageStatus: (state, payload) => {
      state.localStorageStatus = payload
    }
  },
  actions: {
    updateAppType: ({ commit }, payload) => {
      commit('updateAppType', payload)
    },
    updateLogin: ({ commit }, payload) => {
      commit('updateLogin', payload)
    },
    updateUserName: ({ commit }, payload) => {
      commit('updateUserName', payload)
    },
    updateAdmin: ({ commit }, payload) => {
      commit('updateAdmin', payload)
    },
    setModalData: ({ commit }, payload) => {
      commit('setModalData', payload)
    },
    showModal: ({ commit }, payload) => {
      commit('showModal', payload)
    },
    hideModal: ({ commit }, payload) => {
      commit('hideModal', payload)
    },
    showResultModal: ({ commit }, payload) => {
      commit('showResultModal', payload)
    },
    hideResultModal: ({ commit }, payload) => {
      commit('hideResultModal', payload)
    },
    updateCurrentTab: ({ commit }, payload) => {
      commit('updateCurrentTab', payload)
    },
    updateHost: ({ commit }, payload) => {
      commit('updateHost', payload)
    },
    updateHostId: ({ commit }, payload) => {
      commit('updateHostId', payload)
    },
    loadAvailableGame: ({ commit }, payload) => {
      commit('loadAvailableGame', payload)
    },
    loadGame: ({ commit }, payload) => {
      commit('loadGame', payload)
    },
    loadTeam: ({ commit }, payload) => {
      commit('loadTeam', payload)
    },
    updateGameName: ({ commit }, payload) => {
      commit('updateGameName', payload)
    },
    updateMyName: ({ commit }, payload) => {
      commit('updateMyName', payload)
    },
    updateMessage: ({ commit }, payload) => {
      commit('updateMessage', payload)
    },
    updateTeamName: ({ commit }, payload) => {
      commit('updateTeamName', payload)
    },
    setSelectedGraphTeam: ({ commit }, payload) => {
      commit('setSelectedGraphTeam', payload)
    },
    updateGameState: ({ commit }, payload) => {
      commit('updateGameState', payload)
    },
    updateGames: ({ commit }, payload) => {
      commit('updateGames', payload)
    },
    updateSourcesOfVariation: ({ commit }, payload) => {
      commit('updateSourcesOfVariation', payload)
    },
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    },
    updateConnectionError: ({ commit }, payload) => {
      commit('updateConnectionError', payload)
    },
    localStorageStatus: ({ commit }, payload) => {
      commit('localStorageStatus', payload)
    }
  }
})
