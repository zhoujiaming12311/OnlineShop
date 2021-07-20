// import 导入时分为两种写法（两种方式效果一致）， 其一是import Cates from '../components/goods/Cate'，其二是import Cate from '../components/goods/Cate.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cates from '../components/goods/Cate'
import Params from '../components/goods/Params'
import Lists from '../components/goods/List'
import Add from '../components/goods/add'
import Order from '../components/order/Order'
import Report from '../components/report/Report'
Vue.use(VueRouter)
// 配置路由规则，当用户访问login这个路径时，系统通过router-view自动展示Login这个组件
// 当访问Home时,在占位符<router-view>中通过redirect重定向到children(子路由规则)中的welcome组件
const routes = [
  // 重定向到login
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/Home',
    component: Home,
    redirect: '/welcome',
    children: [
      // path：url路径 components:组件名
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/Cates', component: Cates },
      { path: '/params', component: Params },
      { path: '/goods', component: Lists },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]
const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行  next('/login') 强制跳转
  // 如果访问登录页面则直接放行
  if (to.path === '/login') {
    return next()
  }
  // 通过token判断当前用户是否处于登录状态，如果既不在登录状态且当前访问的又不是登录页面则强制跳转回登录页
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  } else {
    next()
  }
})

export default router
