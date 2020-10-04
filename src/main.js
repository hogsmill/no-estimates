import Vue from 'vue'
import App from './App.vue'
import VModal from 'vue-js-modal'
import { store } from './store/store'
import { EventBus } from './EventBus'

require('./assets/site.css')

Vue.config.productionTip = false

Vue.use(VModal)
Vue.prototype.$bus = EventBus

const app = new Vue({
  el: '#app',
  store,
  //EventBus,
  render: (h) => h(App),
})


if (window.Cypress) {
  // only available during E2E tests
  window.app = app
  window.store = store
}
