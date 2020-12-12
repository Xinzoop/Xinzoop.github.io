import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue } from "bootstrap-vue";
import VueHtmlToPaper from "vue-html-to-paper";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(VueHtmlToPaper)

new Vue({
    render: h => h(App),
  }).$mount('#app')
  