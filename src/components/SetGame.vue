<template>
  <span>

    <button class="btn btn-sm btn-secondary smaller-font" @click="show">
      Set Up
    </button>

    <modal name="set-up" :height="330" class="rounded">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Game Set Up</h4>
        <table class="setup-table">
          <GameName :socket="socket" />
          <MyName :socket="socket" />
          <TeamName :socket="socket" />
        </table>
        <button class="btn btn-sm btn-primary smaller-font" @click="hide">
          Done
        </button>
      </div>
    </modal>

  </span>
</template>

<script>
import GameName from './setup/GameName.vue'
import MyName from './setup/MyName.vue'
import TeamName from './setup/TeamName.vue'

export default {
  components: {
    GameName,
    MyName,
    TeamName
  },
  props: [
    'socket'
  ],
  methods: {
    show () {
      this.$modal.show('set-up')
    },
    hide () {
      this.$modal.hide('set-up')
    }
  }
}
</script>

<style lang="scss">

  .setup-table {

    margin-bottom: 20px;

    td {
      height: 45px;
    }

    .setup-label {
      display: inline-block;
      width: 200px;
      line-height: 1.5;
    }

    .setup-input {
      display: inline-block;
      width: 200px;
    }
  }

</style>
