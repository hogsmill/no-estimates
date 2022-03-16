<template>
  <div class="correlation-holder">
    <h5>Team {{ team }}</h5>
    <div class="correlation-label">
      -1
    </div>
    <div class="correlation-div rounded">
      <div :style="{ 'left': correlationPosition(correlation, 0) }">
        {{ correlation }}
      </div>
      <div class="correlation-marker" :style="{ 'left': correlationPosition(correlation, 100) }">
        <i class="fas fa-caret-up" />
      </div>
    </div>
    <div class="correlation-label">
      +1
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'team',
    'correlation'
  ],
  methods: {
    correlationPosition(value, n) {
      return parseInt(290 * (value + 1)) - 290 - n + 'px'
    }
  }
}
</script>

<style lang="scss">
.correlation {

  h5 {
    background-color: transparent;
    color: #444;
    padding: 0;
    margin: 12px auto 0px auto;
  }

  .correlation-labels {
    width: 640px;
    height: 24px;
    margin: 48px auto 0 auto;

    div {
      width: 200px;
      font-weight: bold;
    }
    .negative-correlation {
      text-align: left;
      float: left;
    }
    .no-correlation {
      text-align: center;
      margin: 0 auto;
    }
    .positive-correlation {
      text-align: right;
      float: right;
    }
  }
  .correlation-holder {

    margin-bottom: 24px;

    div {
      display: inline-block;
    }
    .correlation-label {
      width: 20px;
      text-align: center;
      position: relative;
      top: -8px;
    }
    .correlation-div {
      width: 600px;
      margin: 0 auto;
      position: relative;
      background: rgb(245,39,13);
      background: linear-gradient(90deg, rgba(245,39,13,1) 0%, rgba(100,210,12,1) 100%);

      div {
        position: relative;
        width: 100px;
        text-align: center;
        font-size: xx-large;
        font-weight: bold;
        color: #fff;
      }

      .correlation-marker {
        position: relative;
        top: 32px;
        font-size: xx-large;

        .fas {
          color: #888;
        }
      }
    }
  }
}
</style>
