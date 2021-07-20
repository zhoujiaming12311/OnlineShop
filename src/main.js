import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'default-passive-events'
import './plugins/element.js'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 引用全局样式
import global from './assets/css/global.css'
// 全局引入axios，通过this.$http即可发起请求
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器对应样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入进度条NProgress的js与css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 配置请求默认根路径
axios.defaults.baseURL = 'http://localhost:3000/'
// 在request拦截器中，展示进度条NProgress.start()
// 配置请求拦截器request,config为请求对象
axios.interceptors.request.use(config => {
  NProgress.start()
  // 添加token令牌，服务器通过该对象进行判断是否符合要求，对于不符合要求的进行拒绝响应
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
// 在response拦截器中隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 在原型上新增属性绑定axios
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 全局注册
Vue.component('tree-table', TreeTable)
// 注册富文本编辑器
Vue.use(VueQuillEditor)
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  global,
  render: h => h(App)
}).$mount('#app')
