import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'

import 'assets/css/global.css'
import 'assets/font/iconfont.css'

import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"

axios.interceptors.request.use(config => {
  Nprogress.start()

  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.prototype.$axios = axios

Vue.component('tree-table',treeTable)

Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  
  const y = dt.getFullYear()
  const M = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + 1 + '').padStart(2,'0')

  const h = (dt.getHours() + '').padStart(2,'0')
  const m = (dt.getMinutes() + '').padStart(2,'0')
  const s = (dt.getSeconds() + '').padStart(2,'0')

  return  `${y}-${M}-${d} ${h}:${m}:${s}`
})

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
