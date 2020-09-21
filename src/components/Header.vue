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
        <li class="nav-item">
          <router-link :to="{ name: 'game'}">
            Game
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'status'}">
            Status
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/home/walkthrough">
            Walkthrough
          </router-link>
        </li>
        <li v-if="isHost" class="nav-item">
          <router-link to="/facilitator">
            Facilitator
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    isHost() {
      return this.$store.getters.getHost
    }
  }
}
</script>
