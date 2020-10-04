<template>
  <nav class="navbar navbar-expand-lg navbar-light mb-4">
    <a class="navbar-brand" href="http://agilesimulations.co.uk">
      <img src="/lego.png" class="ml-4" height="38px">
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto">
        <MenuItem :to="{ name: 'home'}">
          Game
        </MenuItem>
        <MenuItem :to="{ name: 'status'}">
          Status
        </MenuItem>
        <MenuItem to="/home/walkthrough">
          Walkthrough
        </MenuItem>
        <MenuItem v-if="isHost" to="/facilitator">
          Facilitator
        </MenuItem>
      </ul>
    </div>
  </nav>
</template>

<script>
import MenuItem from './MenuItem'
export default {
  components: {
    MenuItem
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    }
  }
}
</script>
