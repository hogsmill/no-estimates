<template>
  <router-link :to="to" v-slot="{ route, navigate, isExactActive }">
    <li :class="['nav-item', isExactActive && 'active']">
      <a class="nav-link pointer" :href="route.fullPath" @click="navigate">
        <slot />
      </a>
    </li>
  </router-link>
</template>
<script>
export default {
    props: [
        'to'
    ]
}
</script>