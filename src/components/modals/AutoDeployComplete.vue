<template>
  <vue-final-modal name="autodeploy-complete" classes="modal-container" content-class="vfm__content modal-content" v-model="modals['autoDeployComplete']">
    <div>
      <h4>Autodeploy Complete</h4>
      <h5>Congratulations!</h5>
      <p>
        Now that you have completed the auto-deployment work, deployments will no
        longer fail, and you will no longer have to re-do any deploy work.
      </p>
      <button class="btn btn-sm btn-info" @click="hide()">
        Done
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

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
      bus.emit('emitHide', {gameName: this.gameName, teamName: this.teamName, popup: 'autoDeployComplete'})
    }
  }
}
</script>
