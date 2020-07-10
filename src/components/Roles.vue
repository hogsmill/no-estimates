<template>
  <div class="card-deck">
    <div class="row roles">
      <div class="roles">
        <div class="role" :class="role.role.toLowerCase()" v-for="(role, index) in roles" :key="index">
          <div class="name"><span v-if="!role.name">(Empty)</span>{{role.name}} </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    roles() {
      return this.$store.getters.getRoles
    }
  }
}
</script>

<style>
  .roles { text-align: center; width: 100%; font-weight: bold; }
  .role { display: inline-block; height: 75px; width: 105px; margin: 6px; }
  .role .name { background-color: #fff; color: #888; font-size: 80%; height: 18px; }
  .designer { background-image: url("../assets/img/designer.png"); background-size: contain; }
  .developer { background-image: url("../assets/img/developer.png"); background-size: contain; }
  .tester { background-image: url("../assets/img/tester.png"); background-size: contain; }
  .deployer { background-image: url("../assets/img/deployer.png"); background-size: contain; }
</style>
