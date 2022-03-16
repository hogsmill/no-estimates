<template>
  <vue-final-modal name="feedback" classes="modal-container" content-class="vfm__content modal-content" v-model="modals['walkThrough']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4>Welcome to the No Estimates Game</h4>
      <div>
        <p>
          Thanks to <a href="https://www.linkedin.com/in/matthewphilip/">Matt Phillip</a> for inventing this
          one and collaborating to build the online version.
        </p>
        <p>
          The No Estimates game allows you to explore sources of variation in
          estimation, and why they will always make your estimation efforts inaccurate
          and, therefor wasteful. Ultimately, it will present a more scientific
          approach to the perennial question - when will my stuff be delivered?
        </p>
        <p>
          This activity is best facilitated by someone familiar with the game,
          so do <a href="https://agilesimulations.co.uk?pricing">get in touch</a>
          and we can either facilitate a workshop for you, or teach you how to do
          it yourself. Here's a blog about the game from
          <a href="https://kanbanzone.com/2021/what-we-learned-from-taking-agile-workshops-online/" target="blank">
            Kanban Zone
          </a>
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
