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
    this.socket.emit(event, ...args)
    return super.$emit(event, ...args)
  }

  $on (event, ...args) {
    if (this.meddler && typeof this.meddler.call === 'function') {
      this.meddler(event, ...args)
    }
    console.log('$ON', event, args)
    this.socket.on(event, ...args)
    return super.$on(event, ...args)
  }

  setupSocket(socket) {
    this.socket = socket
  }
}

export default new EventBus()