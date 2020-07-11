<template>
  <div id="app" class="mb-4">
    <appHeader></appHeader>
    <WalkThroughView />
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-else>
      <h1>No Estimates <span v-if="team">(Team: {{team}})</span></h1>
      <MyName v-bind:socket="socket" />
      <TeamName v-bind:socket="socket" />
      <GameName />
      <div class="container board">
        <Roles />
        <Day v-bind:socket="socket" />
        <Board v-bind:socket="socket" />
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

import params from './lib/params.js'

import Header from "./components/Header.vue";
import MyName from "./components/MyName.vue";
import TeamName from "./components/TeamName.vue";
import GameName from "./components/GameName.vue";
import AboutView from "./components/about/AboutView.vue";
import WalkThroughView from "./components/about/WalkThroughView.vue";

import Roles from "./components/Roles.vue";
import Day from "./components/Day.vue";
import Board from "./components/Board.vue";

export default {
  name: "App",
  components: {
    appHeader: Header,
    AboutView,
    WalkThroughView,
    MyName,
    TeamName,
    GameName,
    Roles,
    Day,
    Board
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost;
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough;
    },
    showAbout() {
      return this.$store.getters.getShowAbout;
    },
    team() {
      return this.$store.getters.getTeamName;
    }
  },
  created() {
    var host = "77.68.122.69"
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    var connStr = "http://" + host + ":3007"
    console.log("Connecting to: " + connStr)
    this.socket = io(connStr)

    if (params.isParam("host")) {
      this.$store.dispatch("updateHost", true)
    }
  },
}
</script>

<style>
  .not-host { height: 0px; visibility: hidden; }
  .board { background-color: blue; margin-top: 6px; color: #fff; }
</style>
