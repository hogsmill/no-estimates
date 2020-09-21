import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Template from './Template.vue'
import Status from './Status.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'
import FacilitatorView from './components/facilitator/FacilitatorView.vue'

import VModal from 'vue-js-modal'
import { store } from './store/store'

require('./assets/site.css')

Vue.config.productionTip = false

Vue.use(VModal)
Vue.use(VueRouter)
const routes = [
  { name: 'game', path: '/', component: App },
  { name: 'walkthrough', path: '/home', component: App,  children: 
  [
    { path: 'walkthrough', component: WalkThroughView },
  ] },
  { name: 'facilitator', path: '/facilitator', component: FacilitatorView },
  { name: 'status', path: '/status', component: Status }
]
const router = new VueRouter({
  routes,
  mode: 'history'
})

const app = new Vue({
  store,
  router,
  render: (h) => h(Template)
}).$mount('#app')

if (window.Cypress) {
  // only available during E2E tests
  window.app = app
  window.store = store
}
