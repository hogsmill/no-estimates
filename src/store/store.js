import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    walkThrough: false,
    showAbout: false,
    host: false,
    currency: '&#163;',
    gameName: '',
    myName: '',
    myRole: '',
    teamName: '',
    teams: [
      { name: 'Blue', otherCards: [], canStartAutoDeploy: false, autoDeploy: { doing: false, effort: 0, done: false } },
      { name: 'Green', otherCards: [], canStartAutoDeploy: false, autoDeploy: { doing: false, effort: 0, done: false } },
      { name: 'Purple', otherCards: [], canStartAutoDeploy: false, autoDeploy: { doing: false, effort: 0, done: false } },
      { name: 'Red', otherCards: [], canStartAutoDeploy: false, autoDeploy: { doing: false, effort: 0, done: false } }
    ],
    myEffort: {
      available: 4,
      assigned: 0,
      role: ''
    },
    roles: [
      {role: 'Designer', order: 1, names: []},
      {role: 'Developer', order: 2, names: []},
      {role: 'Tester', order: 3, names: []},
      {role: 'Deployer', order: 4, names: []}
    ],
    columns: [
      {name: "options", order: 1},
      {name: "design", order: 2, cards: []},
      {name: "develop", order: 3, cards: []},
      {name: "test", order: 4, cards: []},
      {name: "deploy", order: 5, cards: []},
      {name: "done", order: 6, cards: []}
    ],
    numberOfDays: 30,
    currentDay: 1,
    eventCards: [
      {number: 1, text: "Good Luck!"},
      {number: 2, text: "Remember that manual deploymnts will fail a certian percentage of the time. In this case, you will need to re-do the deployment effort."},
      {number: 3, function: 'Add 1 Point To Everyones Capacity', text: "Pizza inspires your team to greatness! Add one to each person's capacity tomorrow."},
      {number: 4, text: "Did you remember that people can work in areas outside their speciality? They require two effort points to make one effort point in another area."},
      {number: 5, function: 'Add 8 points to Deploy', confirm: true, autoDeployCard: true, text: "You read that automating deployments can lead to better quality and more predictable delivery. If you'd like to invest in that, you'll need to spend 8 effort points in Deploy (you can do this over multiple sprints)</br></br>(<em>You can do this later by clicking the '*' in the Deploy Column header</em>)"},
      {number: 6, function: 'Pairing', text: "Would someone like to learn a new skill? If so, give this card to that person. After that person spends five days pairing with someone in a work stage different from his or her speciality, the person will be able to work in that state at a 1:1 effort ratio."},
      {number: 7, text: "Perhaps you have delivered at least one card? If so, are you able to forecast when you might deliver the Minimum Viable Product, which the Product Owner has defined as cards #1-11 "},
      {number: 8, text: "In this game, you may have been committing to work on an individual work-item basis. Now a new Scrum Master has joined the comapny, and she wants you to do batch commitment (i.e. pull in as many stories at once as you belive you can accomplish in a week). Will you do this?"},
      {number: 9, text: "Testers and Developers want to sit together. You now have the option to fo concurrent Dev and Test (i.e. no need to finish Development effort before beginning Testing). Do you want to do this?"},
      {number: 10, text: "Vince from the PMO says he's nervous that you're not producing enough according to your original estimate. As a result, he wants you to spend time re-estimating. Lock the team in a room for a day and do no delivery work tomorrow - update your estimate for delivering the entire project and move your day tracker one more day."},
      {number: 11, text: "Vince is satisfied with your estimate and sends it around to the business in an email titled 'Team commits to deadline'"},
      {number: 12, function: 'Have Paired', text: "Did you pair (more than one person worked on a single card in one work stage) today? If so, tick off an extra point of work in each stage where the pairing occured (for today only)"},
      {number: 13, function: 'Lose Tester', text: "Your oranisation has lost a tester so one of your testers now has to support multiple teams. One tester loses two points of effort tomorrow. (Disregard if you have no tester)"},
      {number: 14, function: 'Deploy Dice', text: "You have found that quality improves when you have someone pair with a Deployer. Roll an eight-sided die whenever you finish a work card, whenever someone in addition to Deployer works in deploy. (Disregard if you're doing automated delpoyments)"},
      {number: 15, text: "Team rechartering! Would you like to restructure your team? Feel free to change role specialties or negotiate with other teams to bring on new members."},
      {number: 16, text: "If you restructured your team yesterday, how do you expect the change to impact your forecast."},
      {number: 17, text: "Jim from accounting sales sends an email directing employees to make sure they're fully utilised (i.e. follow a policy that you do not leave capacity on the table). Do you obey or silently ignore him?"},
      {number: 18, text: "How much work in progress do you have? Has that changed from earlier?"},
      {number: 19, text: "When you have completed the MVP (cards 1 to 11), look at your estimates from earlier. How did you do? This time, try creating a probabilistic forecast for the rest of the backlog using the delivery-time data (ask the facilitator for help)."}

      //{number: 6, text: "If you decided yesterday to automate deployments, when you complete the delivery automation, you will no longer have to roll the die when you deploy."},
      //{number: 15, text: "Would you like to restructure your team? Feel free to change role specialities or negotiate with other teams to bring on new members."},
    ],
    currentEventCard: 0,
    workCards: [
      {number: 1, design: 6, develop: 7, test: 8, deploy: 2, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 2, design: 0, develop: 8, test: 6, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 3, design: 10, develop: 9, test: 9, deploy: 3, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 4, design: 4, develop: 9, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 5, design: 4, develop: 10, test: 5, deploy: 2, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 6, design: 1, develop: 8, test: 2, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 7, design: 1, develop: 10, test: 3, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 8, design: 0, develop: 4, test: 3, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 9, design: 10, develop: 4, test: 10, deploy: 6, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 10, design: 1, develop: 7, test: 10, deploy: 8, urgent: true, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 11, design: 8, develop: 10, test: 10, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 12, design: 3, develop: 8, test: 11, deploy: 3, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 13, design: 0, develop: 6, test: 9, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 14, design: 1, develop: 6, test: 3, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 15, design: 10, develop: 1, test: 5, deploy: 2, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 16, design: 2, develop: 5, test: 1, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 17, design: 3, develop: 6, test: 8, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 18, design: 0, develop: 7, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 19, design: 5, develop: 9, test: 4, deploy: 7, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 20, design: 8, develop: 8, test: 3, deploy: 7, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 21, design: 1, develop: 6, test: 5, deploy: 1, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 22, design: 0, develop: 10, test: 7, deploy: 7, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 23, design: 5, develop: 10, test: 11, deploy: 8, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 24, design: 0, develop: 6, test: 4, deploy: 6, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 25, design: 3, develop: 2, test: 2, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}}
    ],
    currentWorkCard: 0,
    projectEstimate: 0,
    mvpEstimate: 0,
    reEstimate: 0
  },
  getters: {
    getShowAbout: (state) => {
      return state.showAbout;
    },
    getWalkThrough: (state) => {
      return state.walkThrough;
    },
    getHost: (state) => {
      return state.host;
    },
    getCurrency: (state) => {
      return state.currency
    },
    getGameName: (state) => {
      return state.gameName;
    },
    getMyName: (state) => {
      return state.myName;
    },
    getMyRole: (state) => {
      return state.myRole;
    },
    getMyEffort: (state) => {
      return state.myEffort;
    },
    getTeamName: (state) => {
      return state.teamName;
    },
    getMyTeam: (state) => {
      var team
      for (var i = 0; i < state.teams.length; i++) {
        if (state.teamName == state.teams[i].name) {
          team = state.teams[i]
        }
      }
      return team
    },
    getTeams: (state) => {
      return state.teams;
    },
    getNumberOfDays: (state) => {
      return state.numberOfDays;
    },
    getCurrentDay: (state) => {
      return state.currentDay;
    },
    getRoles: (state) => {
      return state.roles.sort(function(a, b) { return a.order > b.order });
    },
    getColumns: (state) => {
      return state.columns;
    },
    getCurrentEventCard: (state) => {
      if (state.currentEventCard < state.eventCards.length) {
        return state.eventCards[state.currentEventCard];
      } else {
        return false
      }
    },
    getCurrentWorkCard: (state) => {
      if (state.currentWorkCard < state.workCards.length) {
        return state.currentWorkCard
      } else {
        return false
      }
    },
    getWorkCards: (state) => {
      return state.workCards;
    },
    getProjectEstimate: (state) => {
      return state.projectEstimate;
    },
    getMVPEstimate: (state) => {
      return state.mvpEstimate;
    },
    getReEstimate: (state) => {
      return state.reEstimate;
    }
  },
  mutations: {
    updateShowAbout: (state, payload) => {
      state.showAbout = payload;
    },
    updateWalkThrough: (state, payload) => {
      state.walkThrough = payload;
    },
    updateHost: (state, payload) => {
      state.host = payload;
    },
    loadGame: (state, payload) => {
      state.teams = payload.teams;
      state.columns = payload.columns;
      state.currentDay = payload.currentDay;
      state.currentEventCard = payload.currentEventCard;
      state.currentWorkCard = payload.currentWorkCard;
      state.projectEstimate = payload.projectEstimate
      state.mvpEstimate = payload.mvpEstimate
      state.reEstimate = payload.reEstimate
    },
    updateGameName: (state, payload) => {
      state.gameName = payload;
    },
    updateMyName: (state, payload) => {
      state.myName = payload;
    },
    updateMyRole: (state, payload) => {
      state.myRole = payload;
      state.myEffort.role = payload;
    },
    updateMyAssignedEffort: (state, payload) => {
      state.myEffort.available = state.myEffort.available - payload;
      state.myEffort.assigned = state.myEffort.assigned + payload;
    },
    updateEffortPerDay: (state, payload) => {
      state.effortPerDay = payload;
    },
    updateRoles: (state, payload) => {
      state.roles = payload.roles
    },
    updateTeams: (state, payload) => {
      state.teams = payload.teams
    },
    updateTeamName: (state, payload) => {
      state.teamName = payload;
    },
    updateCurrentEventCard: (state, payload) => {
      state.currentEventCard = payload.currentEventCard;
    },
    updateCurrentDay: (state, payload) => {
      var capacity = 4
      if (payload.testCapacity && state.myEffort.role == 'Tester') {
        capacity = 2
      }
      if (payload.capacity) {
        capacity = payload.capacity
      }
      state.currentDay = payload.currentDay
      state.myEffort.available = capacity
      state.myEffort.assigned = 0
    },
    updateColumns: (state, payload) => {
      state.columns = payload.columns
    },
    updateCurrentWorkCard: (state, payload) => {
      state.currentWorkCard = payload.currentWorkCard
    },
    updateWorkCards: (state, payload) => {
      state.workCards = payload.workCards
    },
    updateProjectEstimate: (state, payload) => {
      state.projectEstimate = payload.projectEstimate
    },
    updateMVPEstimate: (state, payload) => {
      state.mvpEstimate = payload.mvpEstimate
    },
    updateReEstimate: (state, payload) => {
      state.reEstimate = payload.reEstimate
    },
  },
  actions: {
    updateShowAbout: ({ commit }, payload) => {
      commit("updateShowAbout", payload);
    },
    updateWalkThrough: ({ commit }, payload) => {
      commit("updateWalkThrough", payload);
    },
    updateHost: ({ commit }, payload) => {
      commit("updateHost", payload);
    },
    loadGame: ({ commit }, payload) => {
      commit("loadGame", payload);
    },
    updateGameName: ({ commit }, payload) => {
      commit("updateGameName", payload);
    },
    updateMyName: ({ commit }, payload) => {
      commit("updateMyName", payload);
    },
    updateMyRole: ({ commit }, payload) => {
      commit("updateMyRole", payload);
    },
    updateMyAssignedEffort: ({ commit }, payload) => {
      commit("updateMyAssignedEffort", payload);
    },
    updateEffortPerDay: ({ commit }, payload) => {
      commit("updateEffortPerDay", payload);
    },
    updateTeams: ({ commit }, payload) => {
      commit("updateTeams", payload);
    },
    updateRoles: ({ commit }, payload) => {
      commit("updateRoles", payload);
    },
    updateRole: ({ commit }, payload) => {
      commit("updateRole", payload);
    },
    updateTeamName: ({ commit }, payload) => {
      commit("updateTeamName", payload);
    },
    updateCurrentEventCard: ({ commit }, payload) => {
      commit("updateCurrentEventCard", payload);
    },
    updateCurrentWorkCard: ({ commit }, payload) => {
      commit("updateCurrentWorkCard", payload);
    },
    updateWorkCards: ({ commit }, payload) => {
      commit("updateWorkCards", payload);
    },
    updateCurrentDay: ({ commit }, payload) => {
      commit("updateCurrentDay", payload);
    },
    updateColumns : ({ commit }, payload) => {
      commit("updateColumns", payload);
    },
    updateProjectEstimate: ({ commit }, payload) => {
      commit("updateProjectEstimate", payload);
    },
    updateMVPEstimate: ({ commit }, payload) => {
      commit("updateMVPEstimate", payload);
    },
    updateReEstimate: ({ commit }, payload) => {
      commit("updateReEstimate", payload);
    }
  }
});
