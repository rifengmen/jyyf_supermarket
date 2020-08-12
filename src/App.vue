<template>
  <div id="app">
    <!-- 获取微信凭证 start -->
    <wechat-config>
    </wechat-config>
    <!-- 获取微信凭证 end -->
    <keep-alive :excloude="excludeComponents">
      <router-view v-if="$route.meta.keepAlive && isRouter"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive && isRouter"/>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import WechatConfig from '@/components/common/wechatConfig/wechatConfig'

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
      // token
      userToken: '',
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
      return this.$store.state.appid
    },
    // baseURL
    baseURL () {
      return this.$store.state.baseURL
    },
    // 缓存组件
    excludeComponents () {
      return this.$store.state.excludeComponents
    }
  },
  components: {
    WechatConfig
  },
  methods: {
    // 获取wechatID
    getWechatID () {
      // 路由开关
      if (this.isRouter) {
        return false
      }
      let baseURL = window.location.href.slice(0, window.location.href.lastIndexOf('/'))
      this.$store.commit('setBaseURL', baseURL)
      let beforeLoginUrl = sessionStorage.getItem('jyyf_beforeLoginUrl')
      // https://www.spzlk.cn/login.php?dianpu=2；微会员
      // https://www.spzlk.cn/testSupermarket/?dianpu=2;超市测试
      // https://www.spzlk.cn/supermarket/?dianpu=2;超市
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
      this.wechatID = str
      this.$store.commit('setWechatID', this.wechatID)
      this.getAppid()
    },
    // 获取appid
    getAppid () {
      let requestData = {
        wechatID: this.wechatID
      }
      requestData = JSON.stringify(requestData)
      let data = new FormData()
      data.append('requestData', requestData)
      this.$axios.post('system/customlogin/getPrimaryKey', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setAppid', res.data.appid)
          let url = sessionStorage.getItem('jyyf_beforeLoginUrl').replace(/"/g, '')
          if (url.indexOf('&') >= 0 && url.indexOf('msgType=') >= 0) {
            url = url.split('&')[1] || ''
            let msgType = url.split('=')[1] || ''
            if (msgType === 'activate') {
              // 卡包过来直接去注册
              this.toRegister()
              return false
            }
          }
          this.getCode()
        }
      }).catch(error => {
        throw error
      })
    },
    // 非静默授权，第一次有弹框
    getCode () {
      let url = sessionStorage.getItem('jyyf_beforeLoginUrl').replace(/"/g, '')
      const REDIRECT_URI = encodeURIComponent(this.baseURL + url)
      const URL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + REDIRECT_URI + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
      // 非静默授权，第一次有弹框
      // 如果没有code，则去请求
      // 截取code
      // https://www.spzlk.cn/testSupermarket/?dianpu=2&code=001PKA0j2nSOTD0WYe2j2qnT0j2PKA09&state=STATE
      if (url.indexOf('&code=') === -1) {
        window.location.href = URL
      } else if (url.indexOf('&code=') >= 0 && url.indexOf('state=')) {
        this.code = url.substring(url.indexOf('&code=') + 6, url.indexOf('state=') - 1)
        this.getOpenId()
      }
    },
    // 发送code请求openid
    getOpenId () {
      let requestData = {
        wechatID: this.wechatID,
        code: this.code
      }
      requestData = JSON.stringify(requestData)
      let data = new FormData()
      data.append('requestData', requestData)
      // 发送给后台并请求token
      this.$axios.post('system/customlogin/getOpenID', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          sessionStorage.setItem('jyyf_openid', res.data.openid)
          this.$store.commit('setOpenid', res.data.openid)
          this.openid = res.data.openid
          this.$store.commit('setHeadimgurl', res.data.headimgurl)
          let url = sessionStorage.getItem('jyyf_beforeLoginUrl').replace(/"/g, '')
          let msgType = url.split('&')[1].split('=')[1]
          if (msgType === 'activate') {
            // 卡包过来直接去注册
            this.toRegister()
          } else {
            // 设置用户信息
            this.setUserInfo()
          }
        }
      }).catch(error => {
        throw error
      })
    },
    // 卡包注册
    toRegister () {
      let url = sessionStorage.getItem('jyyf_beforeLoginUrl').replace(/"/g, '')
      let toPath = url.slice(1, 9)
      if (toPath === 'register') {
        let _arr = url.split('=')
        let openid = _arr[_arr.length - 1]
        sessionStorage.setItem('jyyf_openid', openid)
        this.$store.commit('setOpenid', openid)
        this.openid = openid
        this.isRouter = true
        this.$router.push(url)
      }
    },
    // 设置用户信息
    setUserInfo () {
      let data = new FormData()
      let requestData = {
        wechatID: this.wechatID,
        wexinID: this.openid
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/customlogin/login', data).then(result => {
        let res = result.data
        // res.code 200：正确；20：注册；30：加入卡包；40：激活卡包；500：报错
        if (res.code === 200) {
          this.$store.commit('setUserInfo', res.data)
          this.$store.commit('setMoneyDetail', res.data.moneyDetail)
          sessionStorage.setItem('jyyf_token', res.data.token)
          this.$axios.defaults.headers.common.Authorization = res.data.token
          this.isRouter = true
          let url = sessionStorage.getItem('jyyf_beforeLoginUrl').replace(/"/g, '')
          this.$router.push(url)
        } else if (res.code === 20) {
          this.isRouter = true
          this.$router.push('/register')
        } else if (res.code === 30) {
          // 验证卡包
          this.getWechatCardList(30)
        } else if (res.code === 40) {
          this.retwxcode = res.data.code
          // 验证卡包
          this.getWechatCardList(40)
        } else {
          this.$toast({
            message: res.msg,
            type: 'fail'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 验证卡包
    getWechatCardList (code) {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        this.curPageUrl = this.baseURL + sessionStorage.getItem('jyyf_beforeLoginUrl')
      } else if (/(Android|Windows)/i.test(navigator.userAgent)) {
        this.curPageUrl = window.location.href
      } else {
        this.curPageUrl = window.location.href
      }
      let data = new FormData()
      let requestData = {
        wechatID: this.wechatID,
        curPageUrl: this.curPageUrl
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/customlogin/getWeiXinCardList', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          let _this = this
          wx.config({
            // debug: true,
            debug: false,
            appId: _this.$store.state.appid,
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
            this.addCard(res.data)
          } else if (code === 40) {
            // 激活卡券
            this.openCard(res.data)
          }
        } else {
          this.$toast({
            message: res.msg,
            type: 'fail'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 添加卡券
    addCard (data) {
      let _this = this
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
            _this.$toast({
              message: '已添加卡券请激活！',
              type: 'success'
            })
          },
          cancel: function (res) {
            _this.$toast({
              message: res,
              type: 'fail'
            })
          }
        })
      })
    },
    // 激活卡券
    openCard (data) {
      let _this = this
      wx.ready(() => {
        // 激活卡券
        wx.openCard({
          cardList: [
            {
              cardId: data.cardId,
              code: _this.retwxcode
            }
          ],
          cancel: function (res) {
            _this.$toast({
              message: res,
              type: 'fail'
            })
          }
        })
      })
    }
  },
  created () {
    // 获取wechatID
    this.getWechatID()
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
