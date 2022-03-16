<template>
  <vue-final-modal name="sources-of-variation" classes="modal-container" content-class="vfm__content modal-content" v-model="modals.results['sourcesOfVariation']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4 correlation">
      <h4>
        Sources of Variation
      </h4>
    </div>
    <div class="sources">
      <div v-for="(source, index) in sourcesOfVariation" :key="index">
        <div class="source">
          <div v-if="admin" class="source-show">
            <input type="checkbox" :checked="source.show" @click="showSourceOfVariation(source)">
          </div>
          <div v-if="!admin && source.show" class="source-show">
            <i class="fas fa-exclamation-circle" />
          </div>
          <div v-if="admin || source.show" class="source-name">
            {{ source.name }}
          </div>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    admin() {
      return this.$store.getters.getAdmin
    },
    sourcesOfVariation() {
      return this.$store.getters.getSourcesOfVariation
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideResultModal', 'sourcesOfVariation')
    },
    showSourceOfVariation(source) {
      bus.emit('sendShowSourceOfVariation', {gameName: this.gameName, source: source})
    }
  }
}
</script>
