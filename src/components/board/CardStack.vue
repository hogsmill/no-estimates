<template>
  <div class="work-card-back">{{stack}}</div>
</template>

<script>
export default {
  props: [
    'stack'
  ]
}
</script>

<style>
  .work-card-back { margin: 6px; width: 100%; height: 100px; background-image: url("../../assets/img/work-card-back.png"); background-size: contain; background-repeat: no-repeat; }
</style>
