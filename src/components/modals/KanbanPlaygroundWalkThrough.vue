<template>
  <vue-final-modal name="feedback" classes="modal-container" content-class="vfm__content modal-content" v-model="modals['walkThrough']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4>Welcome to the Kanban Playground</h4>
      <div>
        <p>
          The Kanban Playground allows you to explore various work policies and
          practices, and how they affect throughput and flow in your teams.
        </p>
        <p>
          Add <code>?host</code> to the URL to see the facilitation tab to set various
           parameters.
        </p>
        <p>
          This activity is best facilitated by someone familiar with the game,
          so do <a href="https://agilesimulations.co.uk?pricing">get in touch</a>
          and we can either facilitate a workshop for you, or teach you how to do it yourself.
        </p>
        <Facilitation />
      </div>
    </div>
    <div class="buttons">
      <button class="btn btn-info" @click="hide()">
        Play Game
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'

import Facilitation from './walkThrough/Facilitation.vue'

export default {
  components: {
    VueFinalModal,
    Facilitation
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'walkThrough')
    }
  }
}
</script>
