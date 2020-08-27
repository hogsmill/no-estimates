
<template>

  <span v-if="captain" class="captain">&#9733;</span>

</template>

<script>
export default {
  props: [
    'captain'
  ]
}
</script>
