<template>
  <div class="report">
    <button class="btn btn-sm btn-site-primary" @click="show()">
      Report
    </button>
  </div>
</template>

<script>

export default {
  methods: {
    show () {
      this.$store.dispatch('showModal', 'report')
    }
  }
}
</script>

<style lang="scss">

   $orange: #f4511e;

  .report {
    display: inline-block;

    button {
      text-align: left;
      margin-top: 6px;
    }

    .current-value {
      position: relative;
      top: 3px;
      padding-left: 6px;
    }
  }

  .report-modal {

     h4 {
       text-align: center;
     }

    .tabs {
      border-bottom: 1px solid $orange;
      position: relative;
      margin-bottom: 4px;
      padding-left: 6px;

      .tab {
         width: 100px;
         padding: 4px;
         display: inline-block;
         text-align: center;
         background-color: #fff;
         position: relative;
         top: 1px;
         border-bottom: 1px solid $orange;

         &.selected {
           color: #fff;
           background-color: $orange;
           border-top: 1px solid;
           border-left: 1px solid;
           border-right: 1px solid;
           border-bottom: 1px solid $orange;

         }
       }
     }

    .scroller {
      overflow-y: auto;
      height: 390px;
    }

    input {
      width: 50px;
      height: 24px;
      margin: 0 auto;
      text-align: right;
    }

    button {
      height: 24px;
      line-height: 12px;
      margin: 6px;
    }

    table {
      margin: 6px auto;
      font-size: small;
      width: 98%;
    }

    th {
      padding: 4px;
      border: 1px solid;
    }

    td {
      padding: 0 4px;
      vertical-align: middle;
      text-align: center;
      border: 1px solid;
    }

    .estimates {
      width: 80%;
      margin: 0 auto;
    }

    .results {
      th {
        width: 16%;
        text-align: center;
      }

      .not-delivered {
        font-style: italic;
        color: #aaa;
        border-color: #444;
      }
    }

    .summary {
      width: 60%;
      margin-top: 24px;

      td {
        font-weight: bold;
        font-size: larger;
        padding: 12px;
      }
    }
  }


</style>
