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
      <MyRole v-bind:socket="socket" />
      <GameName />
      <Status v-bind:socket="socket" />
      <div class="container board">
        <Report v-bind:socket="socket" />
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
import Report from "./components/report/Report.vue";
import MyName from "./components/MyName.vue";
import MyRole from "./components/MyRole.vue";
import TeamName from "./components/TeamName.vue";
import GameName from "./components/GameName.vue";
import Status from "./components/Status.vue";
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
    MyRole,
    GameName,
    Status,
    Report,
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

<style lang="scss">
  .not-host {
    height: 0px;
    visibility: hidden;
  }

  .board {
    //background-color: blue;

    //
    // Gradient - do we want this? :-)
    //
    /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#7db9e8+0,207cca+44,0000ff+100 */
    background: #7db9e8; /* Old browsers */
    background: -moz-radial-gradient(center, ellipse cover,  #7db9e8 0%, #207cca 44%, #0000ff 100%); /* FF3.6-15 */
    background: -webkit-radial-gradient(center, ellipse cover,  #7db9e8 0%,#207cca 44%,#0000ff 100%); /* Chrome10-25,Safari5.1-6 */
    background: radial-gradient(ellipse at center,  #7db9e8 0%,#207cca 44%,#0000ff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#7db9e8', endColorstr='#0000ff',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
    //
    // End Gradient
    //

    margin-top: 6px;
    color: #fff;
  }

</style>
