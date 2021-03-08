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
        <div class="go-mobile" />
        <button class="btn btn-sm btn-primary smaller-font" @click="hide()">
          Done
        </button>
      </div>
    </modal>

  </span>
</template>

<script>
export default {
  methods: {
    show() {
      this.$modal.show('go-mobile')
    },
    hide() {
      this.$modal.hide('go-mobile')
    }
  }
}
</script>

<style lang="scss">
.go-mobile {
  width: 100px;
  height: 100px;
  margin: 24px auto;
  padding: 6px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url("../assets/img/qr-mobile.jpg");
}
</style>
