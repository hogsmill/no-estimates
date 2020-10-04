<template>
  <div id="app" class="mb-4">
    <appHeader /> 
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