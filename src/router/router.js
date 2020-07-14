import Vue from 'vue'
import Router from 'vue-router'
import author from './author'
import login from './login'
import index from './index'
import shopping from './shopping'
import message from './message'
import userInfo from './userInfo'
import other from './other'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // 超市测试
  // base: '/testSupermarket',
  // 超市生产
  // base: '/supermarket',
  routes: [
    // 微信授权模块
    ...author,
    // 登陆模块
    ...login,
    // 首页模块
    ...index,
    // 购物模块
    ...shopping,
    // 消息模块
    ...message,
    // 会员中心模块
    ...userInfo,
    // 其他模块
    ...other
  ]
})

//  使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
// router.beforeEach((to, from, next) => {
//   let jyyfopenid = sessionStorage.getItem('jyyf_openid')
//   if (!jyyfopenid && to.fullPath !== '/author') {
//     let urlPath = to.fullPath
//     urlPath = urlPath.replace(/%5Cu003d/g, '=')
//     urlPath = urlPath.replace(/%5Cu0026/g, '&')
//     // 保存用户进入的url
//     sessionStorage.setItem('jyyf_beforeLoginUrl', urlPath)
//     next('/author')
//     return false
//   }
//   next()
// })
router.beforeEach((to, from, next) => {
  let jyyfopenid = sessionStorage.getItem('jyyf_openid')
  if (!jyyfopenid) {
    let urlPath = to.fullPath
    urlPath = urlPath.replace(/%5Cu003d/g, '=')
    urlPath = urlPath.replace(/%5Cu0026/g, '&')
    // 保存用户进入的url
    sessionStorage.setItem('jyyf_beforeLoginUrl', urlPath)
  }
  next()
})

export default router
