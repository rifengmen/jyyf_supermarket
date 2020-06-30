// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'
import store from './vuex/store'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'normalize.css'
import Lazyload from 'vue-lazyload'
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

Vue.config.productionTip = false
// 这里写上自己的基础url
axios.defaults.baseURL = process.env.API_ROOT
// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('jyyf_token')
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.prototype.IMGURL = 'http://www.spzlk.cn:8000/wemember/'
Vue.use(ElementUI)
Vue.use(Vant)
Vue.use(VideoPlayer)
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
