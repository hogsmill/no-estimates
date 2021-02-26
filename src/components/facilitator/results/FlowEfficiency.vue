<template>
  <div class="flow-efficiency-holder">
    <h5>Team {{ team }} <span v-if="!flowEfficiency">(<i>No Data</i>)</span></h5>
    <div class="flow-efficiency-label">
      0
    </div>
    <div class="flow-efficiency-div rounded">
      <div v-if="flowEfficiency" :style="{ 'left': flowEfficiencyPosition(flowEfficiency, 50) }">
        {{ flowEfficiency }}
      </div>
      <div v-if="flowEfficiency" class="flow-efficiency-marker" :style="{ 'left': flowEfficiencyPosition(flowEfficiency, 50) }">
        <i class="fas fa-caret-up" />
      </div>
    </div>
    <div class="flow-efficiency-label">
      1
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'team',
    'flowEfficiency'
  ],
  methods: {
    flowEfficiencyPosition(value, n) {
      return parseInt((value * 600) - n) + 'px'
    }
  }
}
</script>

<style lang="scss">
.flow-efficiency-holder {

  margin-bottom: 24px;

  h5 {
    background-color: transparent;
    color: #444;
    padding: 0;
    margin: 12px auto 0px auto;
  }

  div {
    display: inline-block;
  }
  .flow-efficiency-label {
    width: 20px;
    text-align: center;
    position: relative;
    top: -16px;
  }
  .flow-efficiency-div {
    width: 600px;
    height: 48px;
    margin: 0 auto;
    position: relative;
    background: rgb(245,39,13);
    background: linear-gradient(90deg, rgba(245,39,13,1) 0%, rgba(100,210,12,1) 100%);

    div {
      position: absolute;
      width: 100px;
      text-align: center;
      font-size: xx-large;
      font-weight: bold;
      color: #fff;
    }

    .flow-efficiency-marker {
      position: absolute;
      top: 32px;
      font-size: xx-large;

      .fas {
        color: #888;
      }
    }
  }
}
</style>
