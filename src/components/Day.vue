<template>
  <div class="card-deck">
    <div class="row days">
      <div class="days">
        <div class="day">Day</div>
        <div class="day rounded-circle" :class="getClass(day)" v-for="(day, index) in days" :key="index">{{day.day}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getClass(day) {
      if (day.current) {
        return "current"
      } else if (day.passed) {
        return "passed"
      }
    }
  },
  computed: {
    days() {
      return this.$store.getters.getDays
    }
  }
}
</script>

<style>
  .days { text-align: center; width: 100%; font-weight: bold; }
  .day { display: inline-block; padding: 8px 15px; margin: 6px; }
  .day.passed { color: #666; }
  .day.current { background-color: #fff; color: blue; }
</style>
