<template>
  <div class="work-card">
    <div class="work-card-number"><strong>#{{workCard.number}}</strong></div>
    <div class="work-card-effort">
      <div class="work-card-column column design rounded-circle">A</div>
      <div v-for="n in workCard.design" :key="n" class="work-card-column rounded-circle"></div>
    </div>
    <div class="work-card-effort">
      <div class="work-card-column column develop rounded-circle">B</div>
      <div v-for="n in workCard.develop" :key="n" class="work-card-column rounded-circle"></div>
    </div>
    <div class="work-card-effort">
      <div class="work-card-column column test rounded-circle">C</div>
      <div v-for="n in workCard.test" :key="n" class="work-card-column rounded-circle"></div>
    </div>
    <div class="work-card-effort">
      <div class="work-card-column column deploy rounded-circle">D</div>
      <div v-for="n in workCard.deploy" :key="n" class="work-card-column rounded-circle"></div>
    </div>
    <table>
      <tr>
        <td>EFFORT</td>
        <td>COMMIT</td>
      </tr>
      <tr>
        <td>{{totalEffort()}}</td>
        <td>0</td>
      </tr>
      <tr>
        <td>DELIVER</td>
        <td>TIME</td>
      </tr>
      <tr>
        <td>0</td>
        <td>0</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: [
    'card'
  ],
  methods: {
    effort(column) {
      return this.workCard[column]
    },
    totalEffort() {
      return this.workCard.design +
        this.workCard.develop +
        this.workCard.test +
        this.workCard.deploy
    }
  },
  computed: {
    workCard() {
      return this.$store.getters.getWorkCards[this.card - 1]
    }
  }
}
</script>
<style>
  .work-card { background-color: #fff; color: #444; margin: 6px; width: 100%; border: 1px solid; }
  .work-card div { text-align: left; height: 14px; }
  .work-card .work-card-number { text-align: right; padding-right: 2px; }
  .work-card .work-card-effort .work-card-column.column { color: #fff; border: 0; display: inline-block; width: 11px; height: 11px; font-size: 8px; padding-left: 2px; }
  .work-card .work-card-effort .work-card-column { display: inline-block; border: 1px solid; margin-left: 2px; width: 9px; height: 9px; font-size: 8px; padding-left: 2px; }
  .work-card table { width: 100%; margin-top: 5px; border-collapse: collapse}
  .work-card td { font-size: 8px; }
</style>
