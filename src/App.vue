<template>
  <div id="app">
    <!-- 获取微信凭证 start -->
    <wechat-config>
    </wechat-config>
    <!-- 获取微信凭证 end -->
    <keep-alive :exclude="excludeComponents">
      <router-view v-if="$route.meta.keepAlive && isRouter"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive && isRouter"></router-view>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import WechatConfig from '@/components/common/wechatConfig/wechatConfig'
import tip from '@/utils/Toast'

export default {
  name: 'App',
  data () {
    return {
      // 路由开关
      isRouter: this.$store.state.isRouter,
      // 店铺ID
      wechatID: '',
      // 本地保存appid
      jyyf_appid: '',
      // 本地保存openid
      jyyf_openid: '',
      // code
      code: '',
      // openid
      openid: '',
      // 激活卡
      retwxcode: '',
      // 请求地址url,IOS为进入时url,Android为当前页面url
      curPageUrl: ''
    }
  },
  computed: {
    // appid
    appid () {
      let self = this
      return self.$store.state.appid
    },
    // baseURL
    baseURL () {
      let self = this
      return self.$store.state.baseURL
    },
    // 缓存组件
    excludeComponents () {
      let self = this
      return self.$store.state.excludeComponents
    }
  },
  components: {
    WechatConfig
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  methods: {
    // 页面重载的方法
    reload () {
      let self = this
      self.isRouter = false
      self.$nextTick(() => {
        self.isRouter = true
      })
    },
    // 获取wechatID
    getWechatID () {
      let self = this
      console.log(self.$route, 'wechatID1')
      // 路由开关
      if (self.isRouter) {
        return false
      }
      let baseURL = window.location.href.slice(0, window.location.href.lastIndexOf('/'))
      self.$store.commit('setBaseURL', baseURL)
      console.log(self.$route, 'wechatID2')
      let beforeLoginUrl = sessionStorage.getItem('jyyf_beforeLoginUrl')
      let id = beforeLoginUrl.split('=')[1]
      let str
      if (id.indexOf('&') >= 0) {
        str = decodeURIComponent(id.split('&')[0].replace(/"/g, ''))
      } else if (id.indexOf('&') === -1) {
        str = decodeURIComponent(id.replace(/"/g, ''))
      }
      // 卡券过来时去掉最后面的等号
      if (str && (str.indexOf('=') === str.length - 1)) {
        str = str.substr(0, str.length - 1)
      }
      self.wechatID = str
      self.$store.commit('setWechatID', self.wechatID)
      // 获取Appid
      self.getAppid()
    },
    // 获取appid
    getAppid () {
      let self = this
      console.log(self.$route, 'appid')
      let data = {
        wechatID: self.wechatID
      }
      self.$api.system.getPrimaryKey(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setAppid', res.data.appid)
          let url = sessionStorage.getItem('jyyf_beforeLoginUrl').replace(/"/g, '')
          if (url.indexOf('&') >= 0 && url.indexOf('msgType=') >= 0) {
            url = url.split('&')[1] || ''
            let msgType = url.split('=')[1] || ''
            if (msgType === 'activate') {
              // 卡包过来直接去注册
              self.toRegister()
              return false
            }
          }
          // 非静默授权，第一次有弹框
          self.getCode()
        } else {
          tip(res.msg)
        }
      })
    },
    // 非静默授权，第一次有弹框
    getCode () {
      let self = this
      console.log(self.$route, 'code')
      let url = sessionStorage.getItem('jyyf_beforeLoginUrl').replace(/"/g, '')
      const REDIRECT_URI = encodeURIComponent(self.baseURL + url)
      const URL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + self.appid + '&redirect_uri=' + REDIRECT_URI + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
      // 非静默授权，第一次有弹框
      // 如果没有code，则去请求
      // 截取code
      // https://www.spzlk.cn/testSupermarket/?dianpu=2&code=001PKA0j2nSOTD0WYe2j2qnT0j2PKA09&state=STATE
      if (url.indexOf('&code=') === -1) {
        window.location.href = URL
      } else if (url.indexOf('&code=') >= 0 && url.indexOf('state=')) {
        self.code = url.substring(url.indexOf('&code=') + 6, url.indexOf('state=') - 1)
        // 获取openid
        self.getOpenId()
      }
    },
    // 获取openid
    getOpenId () {
      let self = this
      let data = {
        wechatID: self.wechatID,
        code: self.code
      }
      self.$api.system.getOpenID(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          sessionStorage.setItem('jyyf_openid', res.data.openid)
          self.$store.commit('setOpenid', res.data.openid)
          self.openid = res.data.openid
          self.$store.commit('setHeadimgurl', res.data.headimgurl)
          // 设置用户信息
          self.setUserInfo()
        } else {
          tip(res.msg)
        }
      })
    },
    // 卡包注册
    toRegister () {
      let self = this
      console.log(self.$route, 'toRegister')
      let url = sessionStorage.getItem('jyyf_beforeLoginUrl').replace(/"/g, '')
      let toPath = url.slice(1, 9)
      if (toPath === 'register') {
        let _arr = url.split('=')
        let openid = _arr[_arr.length - 1]
        sessionStorage.setItem('jyyf_openid', openid)
        self.$store.commit('setOpenid', openid)
        self.openid = openid
        self.isRouter = true
        self.$router.push(url)
      }
    },
    // 设置用户信息
    setUserInfo () {
      let self = this
      let data = {
        wechatID: self.wechatID,
        wexinID: self.openid
      }
      self.$api.system.login(data).then(result => {
        let res = result.data
        // res.code 200：正确；20：注册；30：加入卡包；40：激活卡包；500：报错
        if (res.code === 200) {
          self.$store.commit('setUserInfo', res.data)
          self.$store.commit('setToken', res.data.token)
          sessionStorage.setItem('jyyf_token', res.data.token)
          self.$axios.defaults.headers.common.Authorization = res.data.token
          self.isRouter = true
          let url = sessionStorage.getItem('jyyf_beforeLoginUrl').replace(/"/g, '')
          self.$router.push(url)
        } else if (res.code === 20) {
          self.isRouter = true
          self.$router.push('/register')
        } else if (res.code === 30) {
          // 验证卡包
          self.getWechatCardList(30)
        } else if (res.code === 40) {
          self.retwxcode = res.data.code
          // 验证卡包
          self.getWechatCardList(40)
        } else {
          tip(res.msg)
        }
      })
    },
    // 验证卡包
    getWechatCardList (code) {
      let self = this
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        self.curPageUrl = self.baseURL + sessionStorage.getItem('jyyf_beforeLoginUrl')
      } else if (/(Android|Windows)/i.test(navigator.userAgent)) {
        self.curPageUrl = window.location.href
      } else {
        self.curPageUrl = window.location.href
      }
      let data = {
        wechatID: self.wechatID,
        curPageUrl: self.curPageUrl
      }
      self.$api.system.getWeiXinCardList(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          wx.config({
            // debug: true,
            debug: false,
            appId: self.$store.state.appid,
            timestamp: res.data.cardExt.timestamp,
            nonceStr: res.data.cardExt.nonce_str,
            signature: res.data.wxsignstr,
            // 所有要调用的 API 都要加到这个列表中
            jsApiList: [
              'addCard',
              'openCard'
            ]
          })
          if (code === 30) {
            // 添加卡券
            self.addCard(res.data)
          } else if (code === 40) {
            // 激活卡券
            self.openCard(res.data)
          }
        } else {
          tip(res.msg)
        }
      })
    },
    // 添加卡券
    addCard (data) {
      wx.ready(() => {
        // 添加卡券
        wx.addCard({
          cardList: [
            {
              cardId: data.cardId,
              cardExt: '{"timestamp":"' + data.cardExt.timestamp + '","signature":"' + data.cardExt.signature + '","nonce_str":"' + data.cardExt.nonce_str + '"}'
            }
          ],
          success: function (res) {
            tip('已添加卡券请激活！')
          },
          cancel: function (res) {
            tip(res)
          }
        })
      })
    },
    // 激活卡券
    openCard (data) {
      let self = this
      wx.ready(() => {
        // 激活卡券
        wx.openCard({
          cardList: [
            {
              cardId: data.cardId,
              code: self.retwxcode
            }
          ],
          cancel: function (res) {
            tip(res)
          }
        })
      })
    }
  },
  created () {
    let self = this
    // 获取wechatID
    self.getWechatID()
  },
  mounted: function () {
    // 浏览器关闭时清除缓存
    window.addEventListener('beforeunload', () => {
      sessionStorage.removeItem('jyyf_token')
      sessionStorage.removeItem('jyyf_openid')
    })
  }
}
</script>

<style>
@import '../static/font/font.css';
</style>
