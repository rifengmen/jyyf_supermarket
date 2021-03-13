import Vue from 'vue'
import Router from 'vue-router'
import store from '@/vuex/store'
import login from './login'
import index from './index'
import shopping from './shopping'
import message from './message'
import userInfo from './userInfo'
import other from './other'
import saomagou from './saomagou'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // 超市测试(暂时停用)
  // base: '/testSupermarket',
  // 超市生产(开发时需关闭)
  // base: '/supermarket',
  // 记忆列表页位置
  scrollBehavior (to, from, savePosition) {
    // to 要进入的目标路由对象，到哪儿去
    // from 要离开的路由对象，哪儿来的
    // 记录滚动条的坐标，点击后退时记录值{x:*, y:*}
    if (savePosition) {
      return savePosition
    } else {
      return {x: 0, y: 0}
    }
  },
  routes: [
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
    ...other,
    // 扫码购模块
    ...saomagou
  ]
})

//  使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  let jyyfopenid = sessionStorage.getItem('jyyf_openid')
  if (!jyyfopenid) {
    // let urlPath = to.fullPath
    // urlPath = urlPath.replace(/%5Cu003d/g, '=')
    // urlPath = urlPath.replace(/%5Cu0026/g, '&')
    // 保存用户进入的url
    // sessionStorage.setItem('jyyf_beforeLoginUrl', urlPath)
    store.commit('setRedirect', to)
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
