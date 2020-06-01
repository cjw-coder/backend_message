import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'

import 'plugins/element.js'
import 'assets/css/global.css'
import 'assets/font/iconfont.css'

Vue.config.productionTip = false

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios = axios

Vue.component('tree-table',treeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
