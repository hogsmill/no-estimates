import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    host: false,
    gameName: '',
    myName: '',
    myTeam: '',
    players: [],
    teams: [],
    roles: [
      {role: 'Designer', order: 1},
      {role: 'Developer', order: 2},
      {role: 'Tester', order: 3, name: 'Steve'},
      {role: 'Deployer', order: 4}
    ],
    columns: [
      {name: "Options", order: 1},
      {name: "Design", order: 2},
      {name: "Develop", order: 3},
      {name: "Test", order: 4},
      {name: "Deploy", order: 5},
      {name: "Done", order: 6}
    ],
    days: [
      {day: 1, passed: true },
      {day: 2, passed: true },
      {day: 3, current: true },
      {day: 4},
      {day: 5}
    ],
    eventCards: [
      {number: 1, text: "Perhaps you hae delivered at least one card? If, are you able to forecast when you might deliver the Minimum Viable Product, whihc the Product Owner has defined as cards #1-11 "}
    ],

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
    getGameName: (state) => {
      return state.gameName;
    },
    getMyName: (state) => {
      return state.myName;
    },
    getMyTeam: (state) => {
      return state.myTeam;
    },
    getTeams: (state) => {
      return state.teams;
    },
    getDays: (state) => {
      return state.days;
    },
    getRoles: (state) => {
      return state.roles.sort(function(a, b) { return a.order > b.order });
    },
    getColumns: (state) => {
      return state.columns;
    },
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
    updateMyTeam: (state, payload) => {
      state.myTeam = payload;
    },
    addTeam: (state, payload) => {
      var found = false
      for (var i = 0; i < state.teams.length; i++) {
        if (state.teams[i] == payload) {
          found = true
        }
      }
      if (!found) {
        state.teams.push(payload)
      }
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
    updateGameName: ({ commit }, payload) => {
      commit("updateGameName", payload);
    },
    updateMyName: ({ commit }, payload) => {
      commit("updateMyName", payload);
    },
    updateMyTeam: ({ commit }, payload) => {
      commit("updateMyTeam", payload);
    },
    addTeam: ({ commit }, payload) => {
      commit("addTeam", payload);
    }
  }
});
