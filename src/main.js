import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'default-passive-events'
import './plugins/element.js'
// 引用全局样式
import global from './assets/css/global.css'
// 全局引入axios，通过this.$http即可发起请求
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 配置请求默认根路径
axios.defaults.baseURL = 'http://localhost:3000/'
// 配置请求拦截器request,config为请求对象
axios.interceptors.request.use(config => {
  console.log(config)
  // 添加token令牌，服务器通过该对象进行判断是否符合要求，对于不符合要求的进行拒绝响应
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
// 在原型上新增属性绑定axios
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 全局注册
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  global,
  render: h => h(App)
}).$mount('#app')
