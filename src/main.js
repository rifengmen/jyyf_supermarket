// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router' // 导入路由
import store from './vuex/store' // 导入vuex
import api from './api' // 导入api接口
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'normalize.css'
import Lazyload from 'vue-lazyload'
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.IMGURL = process.env.VUE_APP_IMG_BASEURL
Vue.use(ElementUI)
Vue.use(Vant)
Vue.use(VideoPlayer)
// 设置图片懒加载
Vue.use(Lazyload, {
  preLoad: 0.5,
  error: 'static/img/goods.png',
  // loading: 'static/img/goodsloading.gif',
  attempt: 2,
  listenEvents: ['scroll'],
  filter: {
    index (listener, opts) {
      if (location.href.indexOf('index') > -1) {
        opts.ListenEvents = ['touchmove']
      }
    }
  },
  observer: true,
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1
  }
})
// 设置页面title
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
