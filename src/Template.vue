<template>
  <div id="app" class="mb-4">
    <appHeader /> 
    <h1>Hello App!</h1>
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view />
  </div>
</template>
<script>
import Header from './components/Header.vue'
export default {
  name: 'App',
  components: {
    appHeader: Header
  }
}
</script>