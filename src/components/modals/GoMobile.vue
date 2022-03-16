<template>
  <vue-final-modal name="feedback" classes="modal-container" content-class="vfm__content modal-content" v-model="modals['goMobile']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4>Go Mobile</h4>
      <div>
        <canvas id="qr" />
      </div>
      <button class="btn btn-sm btn-primary smaller-font" @click="hide()">
        Done
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'

const qrCode = require('qrcode')

export default {
  components: {
    VueFinalModal
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    }
  },
  created() {
    window.setTimeout(() => {
      this.createQrCode()
    }, 500)
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'goMobile')
    },
    createQrCode() {
      const canvas = document.getElementById('qr')
      qrCode.toCanvas(canvas, location.href, function (error) {
        if (error) console.error(error)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .modal-container {
    #qr {
      margin: 0 auto;
      padding: 6px;
    }
  }
</style>
