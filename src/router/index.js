/*
 * @Author: coco
 * @Date: 2020-04-10 11:03:32
 * @LastEditTime: 2020-04-16 15:59:05
 * @LastEditors: coco
 * @Description:
 * @FilePath: /vue_shop/src/router/index.js
 * @https://github.com/android-coco
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Welcome from '@/components/welcome/Welcome'
import Users from '@/components/user/Users'
import Rights from '@/components/power/Rights'
import Roles from '@/components/power/Roles'
import Cate from '@/components/goods/Cate'
import Params from '@/components/goods/Params'
import List from '@/components/goods/List'
import Add from '@/components/goods/Add'
import Order from '@/components/order/Order'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', name: 'welcome', component: Welcome },
      { path: '/users', name: 'users', component: Users },
      { path: '/rights', name: 'rights', component: Rights },
      { path: '/roles', name: 'roles', component: Roles },
      { path: '/categories', name: 'categories', component: Cate },
      { path: '/params', name: 'params', component: Params },
      { path: '/goods', name: 'goods', component: List },
      { path: '/goods/add', name: 'add', component: Add },
      { path: '/orders', name: 'orders', component: Order }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫--控制访问权限
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next是一个函数，表示放行
  // next()放行，next('/login')强制跳转
  if (to.path === '/login') return next()
  //获取token
  const tonkenStr = window.sessionStorage.getItem('token')
  if (!tonkenStr) return next('/login')
  next()
})

export default router
