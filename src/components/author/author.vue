<template>
    <div class="tc"></div>
</template>

<script>

export default {
  data () {
    return {
      // 店铺ID
      wechatID: '',
      // 本地保存appid
      jyyf_appid: '',
      // 本地保存openid
      jyyf_openid: '',
      userToken: '',
      code: '',
      // openid
      openid: ''
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
    }
  },
  methods: {
    // 获取wechatID
    getWechatID () {
      let baseURL = window.location.href.slice(0, window.location.href.lastIndexOf('/'))
      this.$store.commit('setBaseURL', baseURL)
      let beforeLoginUrl = sessionStorage.getItem('jyyf_beforeLoginUrl')
      // https://www.spzlk.cn/login.php?dianpu=2；微会员
      // https://www.spzlk.cn/testSupermarket/?dianpu=2;超市测试
      // https://www.spzlk.cn/supermarket/?dianpu=2;超市
      let id = beforeLoginUrl.split('=')[1]
      if (id.indexOf('&') >= 0) {
        this.wechatID = id.split('&')[0].replace(/"/g, '')
      } else if (id.indexOf('&') === -1) {
        this.wechatID = id.replace(/"/g, '')
      }
      this.$store.commit('setWechatID', this.wechatID)
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
      if (url.indexOf('code=') >= 0) {
        this.code = url.substring(url.indexOf('code=') + 5, url.indexOf('state=') - 1)
        this.getOpenid()
      } else if (url.indexOf('code=') === -1) {
        window.location.href = URL
      }
    },
    // 发送code请求openid
    getOpenid () {
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
          // 设置用户信息
          this.setUserInfo()
        }
      }).catch(error => {
        throw error
      })
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
        if (res.code === 200) {
          this.$store.commit('setUserInfo', res.data)
          this.$store.commit('setMoneyDetail', res.data.moneyDetail)
          sessionStorage.setItem('jyyf_token', res.data.token)
          this.$axios.defaults.headers.common.Authorization = res.data.token
          let url = sessionStorage.getItem('jyyf_beforeLoginUrl').replace(/"/g, '')
          this.$router.push(url)
        } else {
          this.$router.push('/register')
        }
      }).catch(error => {
        throw error
      })
    }
  },
  created () {
    this.getWechatID()
    this.getAppid()
  }
}
</script>
<style scoped>
</style>
