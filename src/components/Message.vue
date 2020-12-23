<template>
  <div class="message" :class="{ 'error': message != ''}">
    <span v-if="message">
      <i class="fas fa-exclamation-triangle" title="urgent" />
      Can't assign effort: {{ message }}
    </span>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    message() {
      return this.$store.getters.getMessage
    }
  }
}
</script>

<style lang="scss">
  .message {
    width: 80%;
    margin: 6px auto;
    height: 20px;
    font-weight: bold;

    &.error {
      background-color: red;
      color: #fff;

      .fa-exclamation-triangle {
        color: yellow;
      }
    }
  }
</style>
