<template>
  <div>
    <button
      v-if="walkThrough && !showFacilitator"
      class="btn btn-sm btn-info explain"
      @click="help()"
    >
      Explain this for me...
    </button>
    <modal name="walk-through" id="walk-through" :height="520" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide()" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4" v-if="step == 1">
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
      <div class="buttons" v-if="step < noOfScreens()">
        <button class="btn btn-info" @click="incrementStep()">
          Next
        </button>
        <button class="btn btn-info" @click="hide()">
          Skip
        </button>
      </div>
      <div class="buttons" v-if="step == noOfScreens()">
        <button class="btn btn-info" @click="hide()">
          Play Game
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
import params from '../../../lib/params.js'

import Facilitation from '../Facilitation.vue'

export default {
  components: {
    Facilitation
  },
  data() {
    return {
      step: 1,
      default: { width: 650, height: 260 },
      positions: {}
    }
  },
  computed: {
    thisGame() {
      return this.$store.getters.thisGame
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
    }
  },
  mounted() {
    const self = this
    if (params.isParam('walkThrough') || params.isParam('walkThrough')) {
      self.$store.dispatch('updateWalkThrough', true)
      self.$modal.show('walk-through')
    }
  },
  methods: {
    noOfScreens() {
      return Object.keys(this.positions).length + 1
    },
    setDefault() {
      const elem = document.getElementsByClassName('vm--modal')[0].getBoundingClientRect()
      this.default = {
        top: elem.top,
        left: elem.left,
        width: elem.width,
        height: elem.height
      }
    },
    show() {
      this.$modal.show('walk-through')
    },
    hide() {
      this.$modal.hide('walk-through')
    },
    help() {
      this.step = 1
      this.show()
    },
    incrementStep() {
      if (this.step == 1) {
        this.setDefault()
      }
      this.step = this.step + 1
      const elem = document.getElementsByClassName('vm--modal')[0]
      let target, positions = {}
      if (this.positions[this.step].target) {
        target = document.getElementById(this.positions[this.step].target)
        target = target.getBoundingClientRect()
        positions.left = target.left + 30
        positions.top = target.top + 30
      } else {
        positions = this.default
      }
      if (this.positions[this.step].width) {
        positions.width = this.positions[this.step].width
      }
      if (this.positions[this.step].height) {
        positions.height = this.positions[this.step].height
      }
      elem.style.left = positions.left + 'px'
      elem.style.top = positions.top + 'px'
      elem.style.width = positions.width + 'px'
      elem.style.height = positions.height +'px'
    }
  },
}
</script>

<style lang="scss">

  .buttons {
    padding: 24px 0 6px 0;
  }

  .explain {
    margin-bottom: 6px;
  }

  #walk-through {

    p {
      margin-left: 8px;
      margin-right: 8px;
    }
 }

</style>
