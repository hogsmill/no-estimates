<template>
  <vue-final-modal name="set-captain" classes="modal-container" content-class="vfm__content modal-content report-modal" v-model="modals['setCaptain']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4>You need to nominate a team captain</h4>
      <p>
        You need to decide who is going to be team captain, and they then need
        to click Game Set Up and click the <b>Team Captain</b> button before you
        start the game
      </p>
      <button class="btn btn-sm btn-info" @click="hide()">
        OK
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'setCaptain')
    }
  }
}
</script>
