import Vue from 'vue'

export class EventBus extends Vue {
  // Register a custom callback as meddler that gets called upon each event emission.
  // It can be bound to $on as well. 
  $meddle (callback) {
    this.meddler = callback
  }

  // Override Vue's $emit to call the custom meddler callback upon each event emission.
  $emit (event, ...args) {
    if (this.meddler && typeof this.meddler.call === 'function') {
      this.meddler(event, ...args)
    }
    console.log('$EMIT', event, args)
    return super.$emit(event, ...args)
  }

  $on (event, ...args) {
    if (this.meddler && typeof this.meddler.call === 'function') {
      this.meddler(event, ...args)
    }
    console.log('$ON', event, args)
    return super.$on(event, ...args)
  }
  // We can also override $on() to listen to callbacks being registered.
}

export default new EventBus()