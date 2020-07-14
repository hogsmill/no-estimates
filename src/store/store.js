import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

function cardValue(state, card) {
  if (!card.urgent) {
    if (card.delivery < 3) {
      card.value = 700
    } else if (card.delivery < 6) {
      card.value = 400
    } else {
      card.value = 200
    }
  } else {
    card.value = -100 * card.delivery
  }
  for (var i = 0; i < state.workCards.length; i++) {
    if (state.workCards[i].number == card.number) {
      state.workCards[i].delivery = card.delivery
      state.workCards[i].value = card.value
    }
  }
}

function moveCard(state, card, n) {
  var fromCol = state.columns[n]
  var toCol = state.columns[n + 1]
  var i, cards = []
  for (i = 0; i < fromCol.cards.length; i++) {
    if (fromCol.cards[i].number != card.number) {
      cards.push(fromCol.cards[i])
    }
  }
  fromCol.cards = cards
  if (toCol.name == 'done') {
    card.done = true
    card.delivery = state.currentDay
    card.time = card.delivery - card.commit
    cardValue(state, card)
  }
  toCol.cards.push(card)
}

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
    players: [],
    teams: [
      { name: 'Blue', members: []},
      { name: 'Green', members: []},
      { name: 'Purple', members: []},
      { name: 'Red', members: []}
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
      {number: 2, text: "Remember to roll the die when you attempt to deploy a completed card to see if the deployment was succesful."},
      {number: 3, function: 'Add 1 Point To Everyones Capacity', text: "Pizza inspires your team to greatness! Add one to each person's capacity tomorrow."},
      {number: 4, text: "Did you remember that people can work in areas outside their speciality? They require two effort points to make one effort point in another area."},
      {number: 5, function: 'Add 8 points to Deploy', text: "You read that automating deployments can lead to better quality and more predictable delivery. If you'd like to invest in that, you'll need to spend 8 effort points in Deploy (you can do this over multiple sprints)"},
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
      {number: 4, design: 4, develop: 9, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 5, design: 4, develop: 10, test: 5, deploy: 2, urgent: false, teamDependency: 4, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 6, design: 1, develop: 8, test: 2, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 7, design: 1, develop: 10, test: 3, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 8, design: 0, develop: 4, test: 3, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 9, design: 10, develop: 4, test: 10, deploy: 6, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 10, design: 1, develop: 7, test: 10, deploy: 8, urgent: true, teamDependency: 4, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 11, design: 8, develop: 10, test: 10, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 12, design: 3, develop: 8, test: 11, deploy: 3, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 13, design: 0, develop: 6, test: 9, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 14, design: 1, develop: 6, test: 3, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 15, design: 10, develop: 1, test: 5, deploy: 2, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 16, design: 2, develop: 5, test: 1, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 17, design: 3, develop: 6, test: 8, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 18, design: 0, develop: 7, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 19, design: 5, develop: 9, test: 4, deploy: 7, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 20, design: 8, develop: 8, test: 3, deploy: 7, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 21, design: 1, develop: 6, test: 5, deploy: 1, urgent: false, teamDependency: 4, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 22, design: 0, develop: 10, test: 7, deploy: 7, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 23, design: 5, develop: 10, test: 11, deploy: 8, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 24, design: 0, develop: 6, test: 4, deploy: 6, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}},
      {number: 25, design: 3, develop: 2, test: 2, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}}
    ],
    currentWorkCard: 0
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
    updateRole: (state, payload) => {
      for (var i = 0; i < state.roles.length; i++) {
        var names = []
        for (var j = 0; j < state.roles[i].names.length; j++) {
          if (state.roles[i].names[j] != payload.name) {
            names.push(state.roles[i].names[j])
          }
        }
        if (state.roles[i].role == payload.role) {
          names.push(payload.name)
        }
        state.roles[i].names = names
      }
    },
    updateTeamName: (state, payload) => {
      state.teamName = payload;
    },
    addTeam: (state, payload) => {
      var found = false
      for (var i = 0; i < state.teams.length; i++) {
        if (state.teams[i] == payload.teamName) {
          found = true
        }
      }
      if (!found) {
        state.teams.push(payload)
      }
    },
    updateCurrentEventCard: (state, payload) => {
      state.currentEventCard = payload.currentEventCard;
    },
    updateCurrentDay: (state, payload) => {
      state.currentDay = payload.currentDay
      state.myEffort.available = payload.capacity ? payload.capacity : 4
      state.myEffort.assigned = 0
    },
    updateColumns: (state, payload) => {
      state.columns = payload.columns
    },
    updateQueues: (state, payload) => {
      // Updated blocked//
      for (var i = 1; i < state.columns.length; i++) {
        for (var j = 0; j < state.columns[i].cards.length; j++) {
          for (var k = 0; k < payload.blocked.length; k++) {
            if (state.columns[i].cards[j].number == payload.blocked[k]) {
              state.columns[i].cards[j].blocked = true
            } else {
              state.columns[i].cards[j].blocked = false
            }
          }
        }
      }

      // Update completed
      for (i = 1; i < state.columns.length - 1; i++) {
        var column = state.columns[i]
        var colName = column.name
        for (j = 0; j < column.cards.length; j++) {
          var card = column.cards[j]
          if (!card.blocked && card[colName] == card.effort[colName]) {
            moveCard(state, card, i)
            //console.log('Moving card #' + card.number + ' to column ' + state.columns[i + 1].name)
          }
        }
      }
    },
    updateEffort: (state, payload) => {
      for (var i = 1; i < state.columns.length; i++) {
        for (var j = 0; j < state.columns[i].cards.length; j++) {
          if (state.columns[i].cards[j].number == payload.workCard.number) {
            state.columns[i].cards[j].effort = payload.workCard.effort
          }
        }
      }
    },
    updateCurrentWorkCard: (state, payload) => {
      state.currentWorkCard = payload.currentWorkCard
    },
    updateDependentTeam: (state, payload) => {
      for (var i = 1; i < state.columns.length; i++) {
        for (var j = 0; j < state.columns[i].cards.length; j++) {
          var card = state.columns[i].cards[j]
          if (card.number == payload.workCard.number) {
            card.dependentOn = payload.dependentOn
          }
        }
      }
    }
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
    updateRole: ({ commit }, payload) => {
      commit("updateRole", payload);
    },
    updateTeamName: ({ commit }, payload) => {
      commit("updateTeamName", payload);
    },
    addTeam: ({ commit }, payload) => {
      commit("addTeam", payload);
    },
    updateCurrentEventCard: ({ commit }, payload) => {
      commit("updateCurrentEventCard", payload);
    },
    updateCurrentWorkCard: ({ commit }, payload) => {
      commit("updateCurrentWorkCard", payload);
    },
    updateCurrentDay: ({ commit }, payload) => {
      commit("updateCurrentDay", payload);
    },
    updateColumns : ({ commit }, payload) => {
      commit("updateColumns", payload);
    },
    updateEffort : ({ commit }, payload) => {
      commit("updateEffort", payload);
    },
    updateQueues : ({ commit }, payload) => {
      commit("updateQueues", payload);
    },
    updateDependentTeam: ({ commit }, payload) => {
      commit("updateDependentTeam", payload);
    }
  }
});
