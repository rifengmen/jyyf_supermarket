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
import 'normalize.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

Vue.config.productionTip = false
// 这里写上自己的基础url
axios.defaults.baseURL = process.env.API_ROOT
axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('jyyf_token')
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.prototype.IMGURL = 'http://www.spzlk.cn:8000/wemember/'
Vue.use(ElementUI)
Vue.use(VueAwesomeSwiper /* { default options with global component } */)
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
