<template>
  <span>

    <button class="btn btn-sm btn-secondary smaller-font" @click="show()">
      Go Mobile
    </button>

    <modal name="go-mobile" :height="300" :width="300" class="rounded">
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
    </modal>

  </span>
</template>

<script>
const qrCode = require('qrcode')

export default {
  created() {
  },
  methods: {
    show() {
      this.$modal.show('go-mobile')
      const self = this
      window.setTimeout(function() {
        self.createQrCode()
      }, 1000)
    },
    hide() {
      this.$modal.hide('go-mobile')
    },
    createQrCode() {
      const canvas = document.getElementById('qr')
      qrCode.toCanvas(canvas, location.href, function (error) {
        if (error) console.error(error)
        console.log('success!')
      })
    }
  }
}
</script>

<style lang="scss">
#qr {
  margin: 0 auto;
  padding: 6px;
}
</style>
